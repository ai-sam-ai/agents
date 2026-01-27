# Installation Lifecycle Management - Install/Uninstall/Test/Recompile

**Purpose:** Manage full lifecycle including mandatory uninstall-before-recompile

---

## 🔄 The Complete Lifecycle

```
Phase 0: PRE-FLIGHT CHECK (Cleanup + Uninstall if needed)
   ↓
Phase 1: COMPILE (Build installer.exe)
   ↓
Phase 2: TEST INSTALL (Silent installation)
   ↓
Phase 3: VALIDATE (Does SAM AI work?)
   ↓
Phase 4: UNINSTALL (Clean slate for next iteration)
   ↓
(Loop back to Phase 0 for next compile)
```

**User's Critical Requirement:**
> "Agent should be able to run the installer and uninstaller itself"
> "Must uninstall previous compiled installers before compiling next"

---

## Phase 0: PRE-FLIGHT CHECK (MANDATORY)

### Goal: Ensure clean state before compilation

### Step 0.1: Check for Existing Test Installation
```powershell
# Check if SAM AI installed
$installed = Test-Path "C:\Program Files\SAM AI"

if ($installed) {
    Write-Host "⚠️ Previous test installation found"
    Write-Host "Must uninstall before recompiling (prevents locked files)"
    # Proceed to uninstall
}
```

### Step 0.2: Check Services Running
```powershell
# Check Odoo service
$odooService = Get-Service -Name "SAMAIService" -ErrorAction SilentlyContinue

if ($odooService) {
    if ($odooService.Status -eq "Running") {
        Write-Host "⚠️ SAM AI service running - must stop before uninstall"
        Stop-Service "SAMAIService"
    }
}

# Check PostgreSQL service
$pgService = Get-Service -Name "postgresql-sam*" -ErrorAction SilentlyContinue
if ($pgService -and $pgService.Status -eq "Running") {
    Stop-Service $pgService.Name
}
```

### Step 0.3: Run Uninstaller (If Previous Installation Found)
```powershell
# Locate uninstaller
$uninstaller = "C:\Program Files\SAM AI\unins000.exe"

if (Test-Path $uninstaller) {
    Write-Host "🧹 Running uninstaller..."

    # Run silently
    Start-Process $uninstaller -ArgumentList "/VERYSILENT" -Wait

    # Wait for completion
    Start-Sleep -Seconds 10
}
```

### Step 0.4: Validate Clean Slate
```powershell
# Verify files removed
$stillExists = Test-Path "C:\Program Files\SAM AI"
if ($stillExists) {
    Write-Host "❌ Uninstaller failed - files still present"
    Write-Host "Manual cleanup required"
    # STOP - cannot proceed
    exit 1
}

# Verify services removed
$serviceStillExists = Get-Service -Name "SAMAIService" -ErrorAction SilentlyContinue
if ($serviceStillExists) {
    Write-Host "❌ Uninstaller failed - service still registered"
    # Forcefully remove
    sc.exe delete SAMAIService
}

# Verify registry (optional)
# Check HKLM\SOFTWARE\SAM AI
# Should not exist after uninstall

Write-Host "✅ Clean slate achieved - ready to compile"
```

### Step 0.5: Clean Previous Compiler Output
```powershell
# Remove old installer.exe
Remove-Item "D:\...\Output\SAM_AI_Installer.exe" -Force -ErrorAction SilentlyContinue

# Clean build artifacts
Remove-Item "D:\...\build\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "D:\...\dist\*" -Recurse -Force -ErrorAction SilentlyContinue
```

---

## Phase 1: COMPILE

### Goal: Build installer.exe from source

### Step 1.1: Verify Bundled Components Present
```powershell
# Check Python bundle
if (-not (Test-Path "D:\...\bundled\python\python.exe")) {
    Write-Host "❌ Python bundle missing - run build_python_bundle.ps1 first"
    exit 1
}

# Check PostgreSQL bundle
if (-not (Test-Path "D:\...\bundled\postgresql\bin\postgres.exe")) {
    Write-Host "❌ PostgreSQL bundle missing"
    exit 1
}

# Check Odoo bundle
if (-not (Test-Path "D:\...\bundled\odoo\server\odoo-bin")) {
    Write-Host "❌ Odoo bundle missing"
    exit 1
}

# Check SAM AI modules
if (-not (Test-Path "D:\...\bundled\addons\ai_brain\__manifest__.py")) {
    Write-Host "❌ ai_brain module missing"
    exit 1
}

if (-not (Test-Path "D:\...\bundled\addons\ai_sam\__manifest__.py")) {
    Write-Host "❌ ai_sam module missing"
    exit 1
}
```

### Step 1.2: Run Inno Setup Compilation
```powershell
# Compile with logging
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logfile = "D:\...\logs\build_output_$timestamp.log"

iscc "D:\...\dev_files\odoo_samai_installer.iss" | Tee-Object -FilePath $logfile

# Check exit code
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Compilation failed - check log: $logfile"
    exit 1
}
```

### Step 1.3: Verify Installer Created
```powershell
$installer = "D:\...\Output\SAM_AI_Installer.exe"

if (Test-Path $installer) {
    $size = (Get-Item $installer).Length / 1MB
    Write-Host "✅ Installer compiled successfully"
    Write-Host "Size: $([math]::Round($size, 2)) MB"
    Write-Host "Location: $installer"
} else {
    Write-Host "❌ Installer not found at expected location"
    exit 1
}
```

---

## Phase 2: TEST INSTALL

### Goal: Install SAM AI silently for validation

### Step 2.1: Run Installer in Silent Mode
```powershell
$installer = "D:\...\Output\SAM_AI_Installer.exe"
$installLog = "D:\...\logs\install_test_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

Write-Host "📦 Installing SAM AI (silent mode)..."

# Silent install to test location
Start-Process $installer -ArgumentList "/VERYSILENT", "/LOG=`"$installLog`"", "/DIR=`"C:\Program Files\SAM AI`"" -Wait

# Check exit code
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Installation failed - check log: $installLog"
    exit 1
}

Write-Host "✅ Installation completed"
```

### Step 2.2: Wait for Installation to Complete
```powershell
# Installation may take 1-3 minutes
Write-Host "⏳ Waiting for installation to settle..."
Start-Sleep -Seconds 30

# Wait for services to start
Start-Sleep -Seconds 30
```

---

## Phase 3: VALIDATE

### Goal: Verify SAM AI actually works

### Step 3.1: Check Files Installed
```powershell
Write-Host "🔍 Validating file installation..."

$checks = @(
    "C:\Program Files\SAM AI\python\python.exe",
    "C:\Program Files\SAM AI\postgresql\bin\postgres.exe",
    "C:\Program Files\SAM AI\odoo\server\odoo-bin",
    "C:\Program Files\SAM AI\addons\ai_brain\__manifest__.py",
    "C:\Program Files\SAM AI\addons\ai_sam\__manifest__.py",
    "C:\Program Files\SAM AI\config\odoo.conf"
)

$allPresent = $true
foreach ($path in $checks) {
    if (Test-Path $path) {
        Write-Host "  ✅ $path"
    } else {
        Write-Host "  ❌ MISSING: $path"
        $allPresent = $false
    }
}

if (-not $allPresent) {
    Write-Host "❌ Installation incomplete - missing files"
    exit 1
}
```

### Step 3.2: Check Services
```powershell
Write-Host "🔍 Validating services..."

$service = Get-Service -Name "SAMAIService" -ErrorAction SilentlyContinue

if ($service) {
    Write-Host "  ✅ SAM AI service registered"

    if ($service.Status -eq "Running") {
        Write-Host "  ✅ Service running"
    } else {
        Write-Host "  ⚠️ Service not running - attempting start..."
        Start-Service "SAMAIService"
        Start-Sleep -Seconds 10
    }
} else {
    Write-Host "  ❌ SAM AI service not registered"
    exit 1
}
```

### Step 3.3: Check HTTP Endpoint
```powershell
Write-Host "🔍 Validating HTTP accessibility..."

# Wait for Odoo to fully start
Start-Sleep -Seconds 30

try {
    $response = Invoke-WebRequest "http://localhost:8069" -TimeoutSec 30 -ErrorAction Stop

    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ SAM AI accessible at http://localhost:8069"
    }
} catch {
    Write-Host "  ❌ SAM AI not responding at http://localhost:8069"
    Write-Host "  Error: $($_.Exception.Message)"

    # Check Odoo logs for clues
    $logPath = "C:\Program Files\SAM AI\logs\odoo.log"
    if (Test-Path $logPath) {
        Write-Host "  📋 Last 20 lines of Odoo log:"
        Get-Content $logPath -Tail 20
    }

    exit 1
}
```

### Step 3.4: Check Database & Modules
```powershell
Write-Host "🔍 Validating database and modules..."

# Query Odoo for installed modules
try {
    $response = Invoke-WebRequest "http://localhost:8069/web/database/list" -TimeoutSec 10

    # Check if sam_ai database exists
    if ($response.Content -match "sam_ai") {
        Write-Host "  ✅ sam_ai database found"
    } else {
        Write-Host "  ⚠️ sam_ai database not found"
    }
} catch {
    Write-Host "  ⚠️ Could not verify database (may require login)"
}

# TODO: Check if ai_brain and ai_sam modules loaded
# (Requires XML-RPC or API call with authentication)
```

---

## Phase 4: UNINSTALL

### Goal: Clean up test installation

### Step 4.1: Stop Services First
```powershell
Write-Host "🛑 Stopping SAM AI services..."

$service = Get-Service -Name "SAMAIService" -ErrorAction SilentlyContinue
if ($service -and $service.Status -eq "Running") {
    Stop-Service "SAMAIService"
    Write-Host "  ✅ Service stopped"
}
```

### Step 4.2: Run Uninstaller
```powershell
Write-Host "🧹 Running uninstaller..."

$uninstaller = "C:\Program Files\SAM AI\unins000.exe"

if (Test-Path $uninstaller) {
    Start-Process $uninstaller -ArgumentList "/VERYSILENT" -Wait
    Start-Sleep -Seconds 10
    Write-Host "  ✅ Uninstaller completed"
} else {
    Write-Host "  ❌ Uninstaller not found"
}
```

### Step 4.3: Validate Cleanup
```powershell
Write-Host "🔍 Validating cleanup..."

# Check files removed
if (Test-Path "C:\Program Files\SAM AI") {
    $remaining = (Get-ChildItem "C:\Program Files\SAM AI" -Recurse -ErrorAction SilentlyContinue).Count

    if ($remaining -gt 0) {
        Write-Host "  ⚠️ $remaining files/folders still present"
        Write-Host "  (May include user data - expected if preserving config)"
    } else {
        Write-Host "  ✅ All files removed"
    }
} else {
    Write-Host "  ✅ Installation folder removed"
}

# Check services
$serviceStillExists = Get-Service -Name "SAMAIService" -ErrorAction SilentlyContinue
if ($serviceStillExists) {
    Write-Host "  ⚠️ Service still registered"
    sc.exe delete SAMAIService
} else {
    Write-Host "  ✅ Service removed"
}
```

---

## 🎯 Update CURRENT_STATE.md After Each Phase

### After Phase 0 (Pre-Flight):
```markdown
## 🔄 Installation Lifecycle Status
**Status:** Pre-flight complete - ready to compile
**Previous installation:** Uninstalled ✅
**Services:** Stopped ✅
**Files cleaned:** Yes ✅
```

### After Phase 1 (Compile):
```markdown
**Status:** Compilation successful
**Installer:** D:\...\Output\SAM_AI_Installer.exe
**Size:** 245 MB
**Ready for:** Testing
```

### After Phase 2 (Test Install):
```markdown
**Status:** Test installation complete
**Location:** C:\Program Files\SAM AI
**Install log:** install_test_20251112_143045.log
**Ready for:** Validation
```

### After Phase 3 (Validate):
```markdown
**Status:** Validation complete
**Files:** ✅ All present
**Services:** ✅ Running
**HTTP:** ✅ Accessible (http://localhost:8069)
**Database:** ✅ sam_ai found
**Modules:** ✅ ai_brain, ai_sam loaded
**Issues:** None (or list any found)
**Ready for:** Uninstall (before next iteration)
```

### After Phase 4 (Uninstall):
```markdown
**Status:** Uninstalled - clean slate
**Files:** ✅ Removed
**Services:** ✅ Removed
**Ready for:** Next compilation cycle
```

---

## 📊 Automated Testing Script

**Location:** `D:\...\dev_files\test_installer_lifecycle.ps1`

```powershell
# Full lifecycle test automation
param(
    [switch]$SkipUninstall
)

Write-Host "🚀 SAM AI Installer Lifecycle Test"
Write-Host "=================================="

# Phase 0: Pre-Flight
Write-Host "`n📋 PHASE 0: PRE-FLIGHT CHECK"
# [Include Step 0.1-0.5 code here]

# Phase 1: Compile
Write-Host "`n🔨 PHASE 1: COMPILE"
# [Include Step 1.1-1.3 code here]

# Phase 2: Test Install
Write-Host "`n📦 PHASE 2: TEST INSTALL"
# [Include Step 2.1-2.2 code here]

# Phase 3: Validate
Write-Host "`n✅ PHASE 3: VALIDATE"
# [Include Step 3.1-3.4 code here]

# Phase 4: Uninstall (optional)
if (-not $SkipUninstall) {
    Write-Host "`n🧹 PHASE 4: UNINSTALL"
    # [Include Step 4.1-4.3 code here]
}

Write-Host "`n🎉 LIFECYCLE TEST COMPLETE"
```

**Usage:**
```powershell
# Full test (includes uninstall)
.\test_installer_lifecycle.ps1

# Test without uninstall (leave installed for manual testing)
.\test_installer_lifecycle.ps1 -SkipUninstall
```

---

## 🚫 Safety Rules

**Rule 1: Always uninstall before recompile**
- Why: Prevents locked files, stale references
- Enforced: Phase 0 checks and aborts if previous install found

**Rule 2: Never delete files manually**
- Why: Use uninstaller to ensure clean removal (services, registry, etc.)
- Exception: If uninstaller fails, manual cleanup as last resort

**Rule 3: Log everything**
- Why: Debugging failed installs/uninstalls requires logs
- Location: `D:\...\logs\` (not C:\Users\total\!)

**Rule 4: Test in isolation**
- Why: Development machine != clean user machine
- Best practice: Use VM for final validation

---

## 📋 Lifecycle Checklist

**Before Each Compile:**
- [ ] Phase 0: Pre-flight complete (clean slate)
- [ ] Previous test installation uninstalled
- [ ] Services stopped/removed
- [ ] Bundled components present

**After Each Compile:**
- [ ] Phase 1: Installer.exe created
- [ ] File size reasonable (~200-300MB)
- [ ] No compilation errors in log

**After Each Test Install:**
- [ ] Phase 2: Installation completed (exit code 0)
- [ ] Install log reviewed (no critical errors)

**After Each Validation:**
- [ ] Phase 3: All files present
- [ ] Services registered and running
- [ ] HTTP endpoint accessible
- [ ] Modules loaded correctly
- [ ] Issues documented in CURRENT_STATE.md

**After Each Uninstall:**
- [ ] Phase 4: Files removed
- [ ] Services removed
- [ ] Ready for next cycle

---

**End of Installation Lifecycle Management**
