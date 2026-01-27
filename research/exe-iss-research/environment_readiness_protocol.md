# Environment Readiness Protocol

**Purpose:** Validate the system environment is ready for installer build/execution. Detect file locks, running services, permission issues, and remnants from previous installations that could obstruct the next run.

---

## 🎯 The Environment Conflict Problem

> "Why can't 'C:\Program Files\SAM AI' folder be removed right now?"

**Root Causes (In Priority Order):**
1. **Processes holding file locks** (app running)
2. **Services still installed** (even if stopped)
3. **Windows Explorer locks** (folder open, thumbnails caching)
4. **Insufficient permissions** (not running as admin)
5. **Antivirus/search indexer** (background scanning)
6. **Junction/symlink issues** (folder is linked elsewhere)

**The Goal:** Detect ALL blockers before installer runs (not during).

---

## 📋 Pre-Build Environment Checks

### Check 1: Administrator Privileges

**Why It Matters:**
- Installing to `C:\Program Files\` requires admin
- Creating Windows services requires admin
- Registry HKLM writes require admin
- Stopping system processes requires admin

**Detection:**
```powershell
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Administrator)) {
    Write-Error "⛔ BLOCKING: Not running as administrator"
    return "NO-GO"
}
```

**Report:**
```markdown
### Administrator Privileges
✅ GOOD: Running as administrator
❌ BLOCKING: Not running as administrator (required for Program Files install)
```

---

### Check 2: Existing Processes

**Why It Matters:**
- Running processes lock files (can't delete/overwrite)
- Old version still running = new version can't install
- Memory corruption if mix old + new binaries

**Detection:**
```powershell
# Check for any process from SAM AI installation
$samPath = "C:\Program Files\SAM AI"
$processes = Get-Process | Where-Object {
    $_.Path -and $_.Path -like "$samPath\*"
}

if ($processes) {
    Write-Warning "⚠️ RISKY: Processes still running from SAM AI folder:"
    foreach ($proc in $processes) {
        Write-Host "  - $($proc.Name) (PID: $($proc.Id), Path: $($proc.Path))"
    }
    return "NO-GO"
}
```

**Specific Processes to Check:**
```powershell
# Common SAM AI process names (customize based on actual app)
$criticalProcesses = @(
    "odoo",
    "odoo-bin",
    "python",
    "postgres",
    "nginx",
    "SAMService"
)

foreach ($procName in $criticalProcesses) {
    $proc = Get-Process -Name $procName -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Warning "⚠️ RISKY: $procName is running (PID: $($proc.Id))"
        # Try to determine if it's SAM AI's process
        if ($proc.Path -like "*SAM AI*") {
            Write-Error "❌ BLOCKING: SAM AI's $procName must be stopped"
            return "NO-GO"
        }
    }
}
```

**Report:**
```markdown
### Running Processes
✅ GOOD: No SAM AI processes running
⚠️ RISKY: Python process running (may or may not be SAM AI)
❌ BLOCKING: Odoo process running from C:\Program Files\SAM AI\server\odoo-bin
```

---

### Check 3: Windows Services

**Why It Matters:**
- Services hold file locks (even when stopped)
- Service binary path may reference old installation
- New service can't install if old service still registered
- Services auto-start = instant lock after reboot

**Detection:**
```powershell
# Check for services with SAM AI in path
$services = Get-Service | Where-Object {
    $_.BinaryPathName -like "*SAM AI*"
}

if ($services) {
    Write-Warning "⚠️ RISKY: Services still reference SAM AI installation:"
    foreach ($svc in $services) {
        $status = $svc.Status
        $startType = (Get-Service $svc.Name).StartType
        Write-Host "  - $($svc.Name): Status=$status, StartType=$startType"
        Write-Host "    Path: $($svc.BinaryPathName)"

        if ($status -eq "Running") {
            Write-Error "❌ BLOCKING: Service '$($svc.Name)' is running"
            return "NO-GO"
        }

        if ($startType -eq "Automatic") {
            Write-Warning "⚠️ RISKY: Service '$($svc.Name)' set to auto-start"
        }
    }
}
```

**Specific Services to Check:**
```powershell
$expectedServices = @(
    "OdooService",
    "SAMService",
    "PostgreSQL",  # If SAM AI manages its own postgres
    "nginx-samai"
)

foreach ($svcName in $expectedServices) {
    $svc = Get-Service -Name $svcName -ErrorAction SilentlyContinue
    if ($svc) {
        Write-Host "Found service: $svcName [$($svc.Status)]"

        # Check binary path
        $svcInfo = Get-WmiObject win32_service | Where-Object { $_.Name -eq $svcName }
        if ($svcInfo.PathName -like "*SAM AI*") {
            if ($svc.Status -eq "Running") {
                Write-Error "❌ BLOCKING: $svcName must be stopped before uninstall/reinstall"
            } else {
                Write-Warning "⚠️ RISKY: $svcName is stopped but still registered (should be removed)"
            }
        }
    }
}
```

**Report:**
```markdown
### Windows Services
✅ GOOD: No SAM AI services found
⚠️ RISKY: OdooService exists but stopped (should be uninstalled first)
❌ BLOCKING: SAMService is running (must stop before proceeding)
```

---

### Check 4: File Locks (Advanced)

**Why It Matters:**
- Windows Explorer caching folder (thumbnail generation)
- Search indexer scanning files
- Antivirus scanning files
- Other apps monitoring folder

**Detection (Basic):**
```powershell
# Try to rename folder (non-destructive lock test)
$samPath = "C:\Program Files\SAM AI"
if (Test-Path $samPath) {
    $testPath = "$samPath.LOCKTEST"

    try {
        # Try to rename (won't damage anything)
        Rename-Item -Path $samPath -NewName $testPath -ErrorAction Stop
        # If successful, rename back
        Rename-Item -Path $testPath -NewName $samPath -ErrorAction Stop
        Write-Host "✅ GOOD: No file locks detected on SAM AI folder"
    } catch {
        Write-Error "❌ BLOCKING: Folder is locked (cannot rename). Error: $_"
        # Possible causes:
        # - Folder open in Explorer
        # - Files being scanned
        # - Process has files open
        return "NO-GO"
    }
}
```

**Detection (Advanced - Requires SysInternals Handle.exe):**
```powershell
# Download Handle.exe from SysInternals if not available
$handlePath = "C:\Tools\handle.exe"
if (Test-Path $handlePath) {
    # Find what's locking the folder
    $locks = & $handlePath "C:\Program Files\SAM AI" -accepteula 2>&1

    if ($locks -match "No matching handles found") {
        Write-Host "✅ GOOD: No file handles open on SAM AI folder"
    } else {
        Write-Warning "⚠️ RISKY: Open handles detected:"
        Write-Host $locks
        # Parse output to identify processes
    }
} else {
    Write-Host "⚠️ INFO: Handle.exe not available (cannot detect file locks)"
}
```

**Report:**
```markdown
### File Locks
✅ GOOD: No locks detected (folder can be renamed)
⚠️ RISKY: Folder locked by Windows Explorer (close Explorer windows showing this folder)
❌ BLOCKING: Folder locked by unknown process (use Handle.exe to identify)
```

---

### Check 5: Folder Permissions

**Why It Matters:**
- Insufficient permissions = can't delete files
- Inherited permissions may block access
- Previous install may have set restrictive ACLs

**Detection:**
```powershell
$samPath = "C:\Program Files\SAM AI"
if (Test-Path $samPath) {
    try {
        # Try to create a test file (write permission check)
        $testFile = Join-Path $samPath "writetest.tmp"
        "test" | Out-File $testFile -ErrorAction Stop
        Remove-Item $testFile -Force -ErrorAction Stop
        Write-Host "✅ GOOD: Have write permissions to SAM AI folder"
    } catch {
        Write-Error "❌ BLOCKING: Insufficient permissions to modify SAM AI folder"
        Write-Host "  Error: $_"
        return "NO-GO"
    }

    # Check folder ACLs
    $acl = Get-Acl $samPath
    $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

    $hasFullControl = $false
    foreach ($access in $acl.Access) {
        if ($access.IdentityReference -like "*Administrators*" -and
            $access.FileSystemRights -match "FullControl") {
            $hasFullControl = $true
            break
        }
    }

    if (-not $hasFullControl) {
        Write-Warning "⚠️ RISKY: Administrators don't have FullControl on SAM AI folder"
    }
}
```

**Report:**
```markdown
### Folder Permissions
✅ GOOD: Have full write/delete permissions
⚠️ RISKY: Permissions are restrictive (may cause issues during uninstall)
❌ BLOCKING: Cannot write to folder (insufficient permissions)
```

---

### Check 6: Disk Space

**Why It Matters:**
- Installer needs space to extract files
- Build process needs temp space
- Insufficient space = silent failures

**Detection:**
```powershell
# Check C:\ drive free space
$drive = Get-PSDrive -Name C
$freeSpaceGB = [math]::Round($drive.Free / 1GB, 2)
$usedSpaceGB = [math]::Round($drive.Used / 1GB, 2)
$totalSpaceGB = [math]::Round(($drive.Free + $drive.Used) / 1GB, 2)

Write-Host "C:\ Drive: $freeSpaceGB GB free / $totalSpaceGB GB total"

# Estimate SAM AI size
$samPath = "C:\Program Files\SAM AI"
if (Test-Path $samPath) {
    $samSizeGB = [math]::Round(
        ((Get-ChildItem $samPath -Recurse -ErrorAction SilentlyContinue |
         Measure-Object -Property Length -Sum).Sum / 1GB), 2)
    Write-Host "Current SAM AI installation: $samSizeGB GB"
}

# Rule: Need at least 2x SAM AI size free (for extract + install)
$requiredGB = 5  # Minimum for SAM AI install
if ($freeSpaceGB -lt $requiredGB) {
    Write-Error "❌ BLOCKING: Insufficient disk space (need $requiredGB GB, have $freeSpaceGB GB)"
    return "NO-GO"
} elseif ($freeSpaceGB -lt ($requiredGB * 2)) {
    Write-Warning "⚠️ RISKY: Low disk space (have $freeSpaceGB GB, recommend $($requiredGB * 2) GB)"
}
```

**Report:**
```markdown
### Disk Space
✅ GOOD: 50.5 GB free on C:\ (sufficient for install)
⚠️ RISKY: 8.2 GB free on C:\ (low, recommend 10+ GB)
❌ BLOCKING: 2.1 GB free on C:\ (insufficient, need 5+ GB)
```

---

### Check 7: Registry Remnants

**Why It Matters:**
- Old registry keys can confuse new installer
- Service registration remnants
- Uninstall entries pointing to deleted files

**Detection:**
```powershell
# Check common registry locations
$registryPaths = @(
    "HKLM:\Software\SAM AI",
    "HKLM:\Software\WOW6432Node\SAM AI",
    "HKLM:\System\CurrentControlSet\Services\SAMService",
    "HKLM:\System\CurrentControlSet\Services\OdooService"
)

foreach ($regPath in $registryPaths) {
    if (Test-Path $regPath) {
        Write-Warning "⚠️ RISKY: Registry key exists: $regPath"
        Write-Host "  (Should be removed during uninstall)"

        # Check if it references non-existent files
        $installPath = (Get-ItemProperty -Path $regPath -Name "InstallPath" -ErrorAction SilentlyContinue).InstallPath
        if ($installPath -and -not (Test-Path $installPath)) {
            Write-Error "❌ BLOCKING: Registry points to non-existent path: $installPath"
        }
    }
}
```

**Report:**
```markdown
### Registry Remnants
✅ GOOD: No SAM AI registry keys found
⚠️ RISKY: Old registry keys found (should be cleaned up)
❌ BLOCKING: Registry keys point to non-existent install paths (will confuse installer)
```

---

### Check 8: Path/Environment Variables

**Why It Matters:**
- Old PATH entries point to deleted installation
- Environment variables reference old paths
- Scripts may use these variables

**Detection:**
```powershell
# Check PATH for SAM AI references
$envPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($envPath -like "*SAM AI*") {
    Write-Warning "⚠️ RISKY: System PATH contains SAM AI reference"
    $envPath -split ";" | Where-Object { $_ -like "*SAM AI*" } | ForEach-Object {
        Write-Host "  - $_"
        if (-not (Test-Path $_)) {
            Write-Error "❌ BLOCKING: PATH entry points to non-existent folder: $_"
        }
    }
}

# Check for custom environment variables
$envVars = [Environment]::GetEnvironmentVariables("Machine")
foreach ($key in $envVars.Keys) {
    if ($key -like "*SAM*" -or $key -like "*ODOO*") {
        $value = $envVars[$key]
        Write-Host "Found environment variable: $key = $value"
        if ($value -like "*SAM AI*" -and -not (Test-Path $value)) {
            Write-Warning "⚠️ RISKY: $key points to non-existent path: $value"
        }
    }
}
```

**Report:**
```markdown
### Environment Variables
✅ GOOD: No SAM AI references in PATH or environment variables
⚠️ RISKY: PATH contains old SAM AI entry (should be removed)
❌ BLOCKING: SAMAI_HOME variable points to deleted folder
```

---

### Check 9: Temporary Files

**Why It Matters:**
- Previous installer may have left temp files
- Partial installs leave artifacts
- Temp files can cause conflicts

**Detection:**
```powershell
# Check common temp locations
$tempLocations = @(
    "$env:TEMP\SAM AI*",
    "$env:TEMP\InnoSetup*",
    "$env:TEMP\is-*",  # Inno Setup temp folders
    "C:\Windows\Temp\SAM AI*"
)

foreach ($pattern in $tempLocations) {
    $items = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
    if ($items) {
        Write-Warning "⚠️ RISKY: Temp files found: $pattern"
        $items | ForEach-Object {
            Write-Host "  - $($_.FullName)"
        }
    }
}
```

**Report:**
```markdown
### Temporary Files
✅ GOOD: No SAM AI temp files found
⚠️ RISKY: Old installer temp files found in C:\Windows\Temp (should clean up)
```

---

## 🚦 Environment Readiness Decision Tree

```
Check Administrator Privileges
├─ NO → ❌ BLOCKING: "Must run as administrator"
└─ YES → Continue

Check Running Processes
├─ SAM AI processes running → ❌ BLOCKING: "Stop all SAM AI processes first"
└─ No processes → Continue

Check Windows Services
├─ SAM AI services running → ❌ BLOCKING: "Stop services first"
├─ SAM AI services stopped but registered → ⚠️ RISKY: "Should uninstall services"
└─ No services → Continue

Check File Locks
├─ Folder locked → ❌ BLOCKING: "Close applications locking folder"
└─ No locks → Continue

Check Permissions
├─ Cannot write to folder → ❌ BLOCKING: "Insufficient permissions"
└─ Can write → Continue

Check Disk Space
├─ < 5 GB free → ❌ BLOCKING: "Insufficient disk space"
├─ < 10 GB free → ⚠️ RISKY: "Low disk space"
└─ ≥ 10 GB free → Continue

Check Registry Remnants
├─ Points to non-existent paths → ❌ BLOCKING: "Clean registry first"
├─ Old keys exist → ⚠️ RISKY: "Should clean up"
└─ Clean → Continue

Check Environment Variables
├─ Points to non-existent paths → ❌ BLOCKING: "Fix environment variables"
└─ Clean or valid → Continue

Check Temporary Files
└─ Temp files exist → ⚠️ RISKY: "Clean up recommended"

ALL CHECKS PASSED → ✅ GO: "Environment ready for installer build/run"
```

---

## 🧹 Automated Cleanup Script

**For issues marked ⚠️ RISKY (not BLOCKING):**

```powershell
# SAFE cleanup (non-destructive)
function Invoke-SafeCleanup {
    Write-Host "=== Safe Environment Cleanup ===" -ForegroundColor Yellow

    # 1. Stop non-critical processes (ask first)
    $processes = Get-Process | Where-Object { $_.Path -like "*SAM AI*" }
    if ($processes) {
        $answer = Read-Host "Stop $($processes.Count) SAM AI process(es)? (Y/N)"
        if ($answer -eq "Y") {
            $processes | Stop-Process -Force
            Start-Sleep -Seconds 2
        }
    }

    # 2. Stop services (ask first)
    $services = Get-Service | Where-Object { $_.BinaryPathName -like "*SAM AI*" -and $_.Status -eq "Running" }
    if ($services) {
        $answer = Read-Host "Stop $($services.Count) SAM AI service(s)? (Y/N)"
        if ($answer -eq "Y") {
            $services | Stop-Service -Force
        }
    }

    # 3. Clean temp files
    $tempLocations = @("$env:TEMP\SAM AI*", "$env:TEMP\InnoSetup*", "$env:TEMP\is-*")
    foreach ($pattern in $tempLocations) {
        $items = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
        if ($items) {
            $answer = Read-Host "Delete $($items.Count) temp file(s) matching $pattern? (Y/N)"
            if ($answer -eq "Y") {
                $items | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
            }
        }
    }

    Write-Host "✅ Cleanup complete" -ForegroundColor Green
}
```

---

## 📊 Environment Readiness Report Format

```markdown
## 🌍 ENVIRONMENT READINESS

**Overall Status:** [READY / RISKY / BLOCKED]

### Critical Checks (Must Pass)
- [✅/❌] Administrator Privileges: [Status + explanation]
- [✅/❌] Running Processes: [Status + explanation]
- [✅/❌] Windows Services: [Status + explanation]
- [✅/❌] File Locks: [Status + explanation]
- [✅/❌] Folder Permissions: [Status + explanation]
- [✅/❌] Disk Space: [Status + explanation]

### Warning Checks (Should Fix)
- [✅/⚠️] Registry Remnants: [Status + explanation]
- [✅/⚠️] Environment Variables: [Status + explanation]
- [✅/⚠️] Temporary Files: [Status + explanation]

### C:\Program Files\SAM AI Folder Status
**Current State:** [EXISTS / DOES NOT EXIST]
**Can Be Removed:** [YES / NO]
**Blockers:** [List of specific blockers preventing removal]

**Explanation (Non-Tech):**
[Plain English explanation of why folder can/can't be removed]

**Recommended Actions:**
1. [Action 1 - Priority: CRITICAL/HIGH/MEDIUM]
2. [Action 2 - Priority: CRITICAL/HIGH/MEDIUM]
```

---

## ✅ Sign-Off Criteria

**Environment approved (READY) when:**
- ✅ Running as administrator
- ✅ No SAM AI processes running
- ✅ No SAM AI services running
- ✅ No file locks detected
- ✅ Have write permissions
- ✅ Sufficient disk space (≥5 GB free)

**Environment requires attention (RISKY) when:**
- ⚠️ Minor registry remnants exist
- ⚠️ Old PATH entries exist
- ⚠️ Temp files present
- ⚠️ Low disk space (5-10 GB)

**Environment blocks build (BLOCKED) when:**
- ❌ Not running as administrator
- ❌ SAM AI processes running
- ❌ SAM AI services running
- ❌ Folder is locked
- ❌ Insufficient permissions
- ❌ Insufficient disk space (<5 GB)

---

**Usage:** exe-approval uses this protocol to check environment readiness before approving build
