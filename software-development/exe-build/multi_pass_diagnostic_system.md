# Multi-Pass Diagnostic System - Find ALL Problems Systematically

**Purpose:** Prevent "AI finds 1 problem" issue by running 5 systematic passes to uncover EVERY issue

**Critical Rule:** NEVER stop at first problem. Complete ALL 5 passes before reporting.

---

## 🎯 The Problem This Solves

**User pain point (verbatim):**
> "AI finds 1 problem, not all problems. I asked 3 separate /cto sessions the same question, each came up with a different answer."

**Root cause:** Single-pass diagnosis is incomplete. Different sessions stumble upon different issues randomly.

**Solution:** Systematic 5-pass audit ensures comprehensive coverage.

---

## 📋 The 5-Pass Framework

```
Pass 1: DEPENDENCIES
  ↓ (Complete this pass fully before moving to next)
Pass 2: FILE STRUCTURE
  ↓ (Complete this pass fully before moving to next)
Pass 3: COMPILER CONFIG
  ↓ (Complete this pass fully before moving to next)
Pass 4: BUILD ERRORS
  ↓ (Complete this pass fully before moving to next)
Pass 5: RUNTIME VALIDATION
  ↓
ALL FINDINGS CONSOLIDATED
```

**Each pass is INDEPENDENT** - don't skip ahead, don't shortcut.

---

## Pass 1: DEPENDENCIES AUDIT

### Goal: Verify ALL external dependencies are present, correct version, correct paths

### What to Check:

#### 1.1: Python Environment
```powershell
# Check Python version
python --version
# Expected: Python 3.10+ (Odoo 18 requirement)

# Check Python location
where python
# Expected: Predictable path (not Windows Store redirect)

# Check pip availability
pip --version
```

**Issues to log:**
- ❌ Python < 3.10
- ❌ Python not in PATH
- ❌ Multiple Python installations (conflict risk)
- ❌ pip not available

#### 1.2: PostgreSQL
```powershell
# Check PostgreSQL installed
Test-Path "C:\Program Files\PostgreSQL\*\bin\postgres.exe"

# Check version
& "C:\Program Files\PostgreSQL\15\bin\postgres.exe" --version
# Expected: PostgreSQL 15+ (for SAM AI)

# Check pg_config (needed for psycopg2 compilation)
where pg_config
```

**Issues to log:**
- ❌ PostgreSQL not installed
- ❌ PostgreSQL < 15
- ❌ pg_config not in PATH (breaks psycopg2)
- ❌ PostgreSQL service not running

#### 1.3: Odoo 18
```powershell
# Check Odoo present in bundle
Test-Path "${SAMAI_ROOT}\*\server\odoo-bin"

# Check Odoo version
python "...\server\odoo-bin" --version
# Expected: Odoo Server 18.0
```

**Issues to log:**
- ❌ Odoo not found
- ❌ Odoo version != 18.0
- ❌ odoo-bin not executable

#### 1.3a: Odoo 18 Compatibility Scan (NEW - Critical)
```powershell
# Scan for Odoo 17 patterns in SAM AI modules
# These cause runtime errors in Odoo 18!

# Check 1: Old hook signatures (CRITICAL - causes TypeError)
Get-ChildItem -Recurse -Include "*.py" -Path "${REPO_AI_BRAIN}","${REPO_AI_SAM_CORE}" |
    Select-String "def post_init_hook\(cr, registry\)" |
    Format-Table -AutoSize

# Check 2: Old <tree> tags in XML (DEPRECATED in Odoo 18)
Get-ChildItem -Recurse -Include "*.xml" -Path "${REPO_AI_BRAIN}","${REPO_AI_SAM_CORE}" |
    Select-String "<tree" |
    Format-Table -AutoSize

# Check 3: Module versions (must be 18.0.x.y)
Get-ChildItem -Recurse -Include "__manifest__.py" -Path "${REPO_AI_BRAIN}","${REPO_AI_SAM_CORE}" |
    Select-String "'version': '17\.0" |
    Format-Table -AutoSize
```

**Odoo 18 Breaking Changes to Detect:**
- ❌ Hook signature `(cr, registry)` instead of `(env)` → **CRITICAL**
- ❌ XML `<tree>` instead of `<list>` → **MEDIUM** (deprecated)
- ❌ Module version `17.0.x.y` instead of `18.0.x.y` → **HIGH**
- ❌ Python < 3.10 → **CRITICAL** (Odoo 18 requirement)

**Reference:** See [odoo_18_breaking_changes.md](file://C:/Users/total/.claude/agents/exe-build/shared/odoo_18_breaking_changes.md) for complete list

#### 1.4: Python Packages (SAM AI Requirements)
```powershell
# Check if requirements.txt exists
Test-Path "${INSTALLER_ROOT}\requirements.txt"

# Validate key packages
pip list | grep -E "(anthropic|psycopg2|werkzeug|requests)"
```

**Critical packages for SAM AI:**
- anthropic (Claude API)
- psycopg2 (PostgreSQL adapter)
- werkzeug (Odoo web framework)
- requests (HTTP client)
- [etc... extract from requirements.txt]

**Issues to log:**
- ❌ requirements.txt missing
- ❌ Key packages not installed
- ❌ Package version conflicts

#### 1.5: SAM AI Modules (Core Dependencies)
```bash
# Check ai_brain module present
Test-Path "${REPO_AI_BRAIN}\__manifest__.py"

# Check ai_sam module present
Test-Path "${REPO_AI_SAM_CORE}\__manifest__.py"

# Read dependencies from manifests
Get-Content "${REPO_AI_BRAIN}\__manifest__.py" | grep "depends"
```

**Issues to log:**
- ❌ ai_brain module missing/incomplete
- ❌ ai_sam module missing/incomplete
- ❌ Manifest dependencies not satisfied

### Pass 1 Output:
**Create:** `diagnostic_pass1_dependencies.txt`
```
PASS 1: DEPENDENCIES AUDIT
Completed: [timestamp]

[CRITICAL]
- PostgreSQL 15 not found at expected path

[HIGH]
- Python 3.9 detected (Odoo 18 requires 3.10+)

[MEDIUM]
- psycopg2 package missing (required for PostgreSQL)

[LOW]
- (none)

Total Issues: 3 (1 CRITICAL, 1 HIGH, 1 MEDIUM, 0 LOW)
```

---

## Pass 2: FILE STRUCTURE AUDIT

### Goal: Verify all required files present, organized correctly, no missing components

### What to Check:

#### 2.1: Installer Project Structure
```bash
# Expected structure
${INSTALLER_ROOT}\
  ├─ dev_files\
  ├─ dev_session_reports\
  ├─ logs\
  ├─ Output\ (created by compiler)
  ├─ bundled\ (Python, PostgreSQL, Odoo bundles)
  └─ [source files]
```

**Issues to log:**
- ❌ Missing expected folders
- ❌ Output from previous build not cleaned
- ❌ bundled\ folder empty (no components to package)

#### 2.2: SAM AI Module Files
```bash
# Check ai_brain complete
find "${REPO_AI_BRAIN}" -name "*.py" | wc -l
# Expected: [count] Python files

find "${REPO_AI_BRAIN}" -name "__manifest__.py"
find "${REPO_AI_BRAIN}" -name "security\ir.model.access.csv"

# Check ai_sam complete
find "${REPO_AI_SAM_CORE}" -name "*.py" | wc -l
find "${REPO_AI_SAM_CORE}" -name "static\src\*"
```

**Issues to log:**
- ❌ __manifest__.py missing (module won't load)
- ❌ security/ folder missing (Odoo will reject)
- ❌ static/ assets missing (UI broken)

#### 2.3: Bundled Components
```powershell
# Check Python bundle exists
Test-Path "${INSTALLER_BUNDLED}\python\python.exe"

# Check PostgreSQL portable exists
Test-Path "${INSTALLER_BUNDLED}\postgresql\bin\postgres.exe"

# Check Odoo server exists
Test-Path "${INSTALLER_BUNDLED}\odoo\server\odoo-bin"
```

**Issues to log:**
- ❌ Python bundle missing (installer won't work)
- ❌ PostgreSQL bundle missing (no database)
- ❌ Odoo bundle incomplete (missing addons/)

#### 2.4: Configuration Files Present
```bash
# Check Inno Setup script
Test-Path "${INSTALLER_DEV_FILES}\odoo_samai_installer.iss"

# Check build scripts
Test-Path "${INSTALLER_DEV_FILES}\build_python_bundle.ps1"
Test-Path "${INSTALLER_DEV_FILES}\build_installer_final.ps1"

# Check odoo.conf template
Test-Path "D:\...\templates\odoo.conf"
```

**Issues to log:**
- ❌ Inno Setup script missing (can't compile)
- ❌ Build scripts missing (manual process required)
- ❌ odoo.conf template missing (installation will fail)

#### 2.5: Obsolete/Redundant Files
```bash
# Check for file chaos indicators
ls -1 "D:\...\dev_files" | wc -l
# Expected: < 25 files after cleanup

# Check for duplicate scripts
ls -1 dev_files/*_fixed.ps1
ls -1 dev_files/*_v2.ps1
```

**Issues to log:**
- ⚠️ dev_files/ file count > 50 (chaos returning)
- ⚠️ Duplicate script versions found (cleanup needed)

### Pass 2 Output:
**Create:** `diagnostic_pass2_file_structure.txt`
```
PASS 2: FILE STRUCTURE AUDIT
Completed: [timestamp]

[CRITICAL]
- ai_brain module missing security/ir.model.access.csv

[HIGH]
- PostgreSQL bundle not found in bundled/ folder

[MEDIUM]
- dev_files/ has 47 files (cleanup threshold: 50)

[LOW]
- odoo.conf template uses old placeholder syntax

Total Issues: 4 (1 CRITICAL, 1 HIGH, 1 MEDIUM, 1 LOW)
```

---

## Pass 3: COMPILER CONFIG AUDIT

### Goal: Verify PyInstaller spec, Inno Setup script, build configs are correct

### What to Check:

#### 3.1: Inno Setup Script (odoo_samai_installer.iss)
```bash
# Read and validate key sections
$iss = Get-Content "D:\...\odoo_samai_installer.iss"

# Check [Setup] section
$iss | grep "AppName"
$iss | grep "AppVersion"
$iss | grep "DefaultDirName"
$iss | grep "OutputDir"

# Check [Files] section
$iss | grep "Source:"
# Verify all Source paths actually exist

# Check [Run] section (post-install tasks)
$iss | grep "Filename:"
```

**Issues to check:**
- ❌ Source paths point to non-existent files
- ❌ OutputDir incorrect (won't find compiled installer)
- ❌ AppVersion hardcoded (should be dynamic?)
- ❌ Missing post-install tasks (service registration, DB init)
- ❌ Uninstaller section incomplete

**Common issues:**
```ini
; BAD: Hardcoded path that doesn't exist
Source: "C:\Users\Developer\SAM AI\*"; DestDir: "{app}"

; GOOD: Relative path from project root
Source: "bundled\python\*"; DestDir: "{app}\python"

; BAD: Missing wildcard recursive
Source: "addons"; DestDir: "{app}\addons"

; GOOD: Recursive copy
Source: "addons\*"; DestDir: "{app}\addons"; Flags: recursesubdirs
```

#### 3.2: Python Bundling (if using PyInstaller)
```bash
# Check if .spec file exists
Test-Path "D:\...\installer.spec"

# Validate spec contents
$spec = Get-Content "D:\...\installer.spec"

# Check hidden imports (Odoo has MANY)
$spec | grep "hiddenimports"
# Expected: Extensive list of Odoo modules

# Check data files bundled
$spec | grep "datas"
```

**Issues to check:**
- ❌ Hidden imports incomplete (runtime import errors)
- ❌ Data files not bundled (templates, static assets missing)
- ❌ Binary dependencies missing (DLLs)

#### 3.3: Build Script Configuration
```powershell
# Read build_installer_final.ps1
$build = Get-Content "D:\...\build_installer_final.ps1"

# Check paths referenced
$build | grep "Set-Location"
$build | grep "Copy-Item"
$build | grep "Invoke-Expression"

# Check error handling
$build | grep "if.*LASTEXITCODE"
$build | grep "try.*catch"
```

**Issues to check:**
- ❌ Paths hardcoded (won't work on other machines)
- ❌ No error handling (silent failures)
- ❌ Missing cleanup (old files interfere with build)
- ❌ No validation (build continues even if steps fail)

#### 3.4: Version Management
```bash
# Check version consistency
grep "version" "${INSTALLER_DEV_FILES}\odoo_samai_installer.iss"
grep "version" "D:\...\04-samai-brain\__manifest__.py"
grep "version" "D:\...\05-samai-core\__manifest__.py"
```

**Issues to check:**
- ⚠️ Version numbers inconsistent across files
- ⚠️ Version not incremented from last build

### Pass 3 Output:
**Create:** `diagnostic_pass3_compiler_config.txt`
```
PASS 3: COMPILER CONFIG AUDIT
Completed: [timestamp]

[CRITICAL]
- odoo_samai_installer.iss line 142: Source path "C:\Users\old_dev\SAM" doesn't exist

[HIGH]
- odoo_samai_installer.iss: Missing [UninstallRun] section (uninstaller won't clean registry)

[MEDIUM]
- build_installer_final.ps1: No error handling (line 23, 45, 67)

[LOW]
- Version inconsistent: installer.iss (v1.0.5) vs. ai_brain manifest (v1.0.4)

Total Issues: 4 (1 CRITICAL, 1 HIGH, 1 MEDIUM, 1 LOW)
```

---

## Pass 4: BUILD ERRORS AUDIT (Attempt Compilation)

### Goal: Actually run the build and capture ALL errors (not just first failure)

### What to Do:

#### 4.1: Pre-Build Cleanup
```powershell
# Clean previous build artifacts
Remove-Item "${INSTALLER_OUTPUT}\*" -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item "D:\...\build\*" -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item "D:\...\dist\*" -Force -Recurse -ErrorAction SilentlyContinue
```

#### 4.2: Run Build with Full Logging
```powershell
# Execute build script with verbose logging
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logfile = "${INSTALLER_LOGS}\build_output_$timestamp.log"

& "${INSTALLER_DEV_FILES}\build_installer_final.ps1" 2>&1 | Tee-Object -FilePath $logfile
```

#### 4.3: Parse Build Output for ALL Errors
```bash
# Extract errors from log
grep -iE "(error|fail|fatal)" "$logfile"

# Count errors
grep -iE "(error|fail|fatal)" "$logfile" | wc -l

# Extract warnings
grep -iE "(warning|warn)" "$logfile"
```

#### 4.4: Categorize Build Errors

**Compilation Errors:**
- Syntax errors in scripts
- Missing dependencies
- Path not found

**Inno Setup Errors:**
- Source file not found
- Invalid directive
- Registry key syntax error

**Bundling Errors:**
- Missing Python packages
- Missing Odoo addons
- Binary dependency not found

#### 4.5: Test Each Error Fix (Iterative)

**CRITICAL RULE:** Don't stop at first error!

**Old approach (BAD):**
```
1. Run build
2. Hit error: "PostgreSQL not found"
3. Fix PostgreSQL path
4. Stop (user thinks we're done)
5. Next session: Hit error: "Odoo addons missing"
6. Fix addons
7. Stop (repeat cycle...)
```

**New approach (GOOD):**
```
1. Run build COMPLETELY (even after first error)
2. Log ALL errors encountered
3. Categorize: CRITICAL, HIGH, MEDIUM, LOW
4. Report ALL to user
5. Fix systematically (CRITICAL first)
6. Re-run Pass 4 to validate
7. Repeat until build succeeds
```

### Pass 4 Output:
**Create:** `diagnostic_pass4_build_errors.txt`
```
PASS 4: BUILD ERRORS AUDIT
Completed: [timestamp]
Build log: build_output_20251112_143045.log

[CRITICAL] - Build halted
- Line 142: Source path "C:\Program Files\PostgreSQL\15\bin\*" not found
- Line 256: Odoo server\odoo-bin not found in bundle

[HIGH] - Build would fail at runtime
- Missing package: psycopg2 (required for database)
- Missing package: anthropic (required for Claude API)

[MEDIUM] - Build succeeds but degraded
- Warning: Icon file resolution low (should be 256x256)
- Warning: Digital signature missing (Windows will show warning)

[LOW] - Minor improvements
- Verbose output cluttering log (redirect to debug log)

Total Issues: 6 (2 CRITICAL, 2 HIGH, 1 MEDIUM, 1 LOW)

Build Status: FAILED (halted at line 142)
Estimated fixes required: 4 (CRITICAL + HIGH)
```

---

## Pass 5: RUNTIME VALIDATION & LOG ANALYSIS

### Goal: Verify installer.exe works + analyze ALL logs for hidden issues

**Prerequisites:** Pass 4 must succeed (installer.exe compiled)

---

### CRITICAL ADDITION: Log Analysis (User Request)

**User insight:** "Reviewing log files in `C:\Program Files\SAM AI\logs` is an important component of diagnosing"

**Why this matters:** Logs reveal problems that aren't visible during live testing (race conditions, intermittent errors, warnings that become failures)

### What to Test:

#### 5.1: Installer Execution
```powershell
# Run installer in silent mode (for testing)
& "${INSTALLER_OUTPUT}\SAM_AI_Installer.exe" /VERYSILENT /LOG="install_test.log" /DIR="C:\Program Files\SAM AI Test"

# Wait for completion
Start-Sleep -Seconds 60

# Check exit code
if ($LASTEXITCODE -ne 0) {
    Write "Installation failed with code: $LASTEXITCODE"
}
```

**Issues to check:**
- ❌ Installer crashes immediately
- ❌ Installer hangs (timeout)
- ❌ Silent install prompts for input (not silent!)
- ❌ Installation incomplete (missing files/folders)

#### 5.2: File Installation Validation
```powershell
# Verify expected structure created
Test-Path "C:\Program Files\SAM AI Test\python\python.exe"
Test-Path "C:\Program Files\SAM AI Test\postgresql\bin\postgres.exe"
Test-Path "C:\Program Files\SAM AI Test\server\odoo-bin"
Test-Path "C:\Program Files\SAM AI Test\addons\ai_brain"
Test-Path "C:\Program Files\SAM AI Test\addons\ai_sam"

# Check file counts
(Get-ChildItem "C:\Program Files\SAM AI Test\addons" -Recurse).Count
# Expected: Hundreds/thousands of files
```

**Issues to check:**
- ❌ Critical files missing (Python, PostgreSQL, Odoo)
- ❌ SAM AI modules (ai_brain, ai_sam) not installed
- ❌ Incomplete installation (file count too low)

#### 5.3: Service Registration
```powershell
# Check if Odoo service created
Get-Service -Name "SAM AI Service" -ErrorAction SilentlyContinue

# Check if service is running
(Get-Service -Name "SAM AI Service").Status
# Expected: "Running"

# Check PostgreSQL service
Get-Service -Name "postgresql-sam" -ErrorAction SilentlyContinue
```

**Issues to check:**
- ❌ Services not created
- ❌ Services created but not started
- ❌ Service startup type wrong (should be Automatic)

#### 5.4: Runtime Functionality
```powershell
# Wait for Odoo to start
Start-Sleep -Seconds 30

# Test HTTP endpoint
$response = Invoke-WebRequest "http://localhost:8069" -TimeoutSec 30 -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write "✅ SAM AI accessible"
} else {
    Write "❌ SAM AI not responding"
}

# Check for Odoo database initialization
Invoke-WebRequest "http://localhost:8069/web/database/manager"
```

**Issues to check:**
- ❌ Odoo doesn't start (check logs)
- ❌ Port 8069 not listening
- ❌ Database not initialized
- ❌ SAM AI modules not loaded

#### 5.5: Log Analysis (CRITICAL - User Required)

**Goal:** Parse ALL logs for errors, warnings, patterns

**Log Locations to Check:**

**Installation Logs:**
```
${INSTALLER_LOGS}\install_test_YYYYMMDD_HHMMSS.log  (Inno Setup install log)
```

**Runtime Logs (After Installation):**
```
C:\Program Files\SAM AI\logs\odoo.log          (Odoo runtime log)
C:\Program Files\SAM AI\logs\postgresql.log     (PostgreSQL log - if exists)
C:\Program Files\SAM AI\logs\service.log        (Windows service log - if exists)
```

**Build Logs:**
```
${INSTALLER_LOGS}\build_output_YYYYMMDD_HHMMSS.log   (Compiler log)
```

**Parse Each Log Systematically:**

```powershell
# Function to parse log for issues
function Parse-LogForIssues {
    param($logPath, $logName)

    if (-not (Test-Path $logPath)) {
        Write-Host "⚠️ $logName not found: $logPath"
        return
    }

    Write-Host "`n📋 Analyzing $logName..."
    $content = Get-Content $logPath

    # Count total lines
    $totalLines = $content.Count
    Write-Host "  Total lines: $totalLines"

    # Extract ERRORS
    $errors = $content | Select-String -Pattern "(ERROR|CRITICAL|FATAL|Exception|Traceback)" -CaseSensitive:$false
    if ($errors) {
        Write-Host "  ❌ Errors found: $($errors.Count)"
        Write-Host "`n  Top 5 errors:"
        $errors | Select-Object -First 5 | ForEach-Object {
            Write-Host "    - Line $($_.LineNumber): $($_.Line)"
        }
    }

    # Extract WARNINGS
    $warnings = $content | Select-String -Pattern "(WARNING|WARN)" -CaseSensitive:$false
    if ($warnings) {
        Write-Host "  ⚠️ Warnings found: $($warnings.Count)"
        Write-Host "`n  Top 5 warnings:"
        $warnings | Select-Object -First 5 | ForEach-Object {
            Write-Host "    - Line $($_.LineNumber): $($_.Line)"
        }
    }

    # SAM AI-specific patterns
    $samErrors = $content | Select-String -Pattern "(ai_brain|ai_sam|Module.*not found|Import.*failed)" -CaseSensitive:$false
    if ($samErrors) {
        Write-Host "  🧠 SAM AI-specific issues: $($samErrors.Count)"
        $samErrors | Select-Object -First 3 | ForEach-Object {
            Write-Host "    - $($_.Line)"
        }
    }

    # Database connection errors
    $dbErrors = $content | Select-String -Pattern "(database|postgres|psycopg2|connection.*refused)" -CaseSensitive:$false
    if ($dbErrors) {
        Write-Host "  🗄️ Database issues: $($dbErrors.Count)"
        $dbErrors | Select-Object -First 3 | ForEach-Object {
            Write-Host "    - $($_.Line)"
        }
    }

    # Performance issues
    $slowQueries = $content | Select-String -Pattern "(slow|timeout|took [0-9]+\.[0-9]+ seconds)" -CaseSensitive:$false
    if ($slowQueries) {
        Write-Host "  ⏱️ Performance issues: $($slowQueries.Count)"
    }
}

# Parse all logs
Parse-LogForIssues "${INSTALLER_LOGS}\install_test_*.log" "Installation Log"
Parse-LogForIssues "C:\Program Files\SAM AI\logs\odoo.log" "Odoo Runtime Log"
Parse-LogForIssues "C:\Program Files\SAM AI\logs\postgresql.log" "PostgreSQL Log"
Parse-LogForIssues "${INSTALLER_LOGS}\build_output_*.log" "Build Log"
```

**Issues to Flag:**

**CRITICAL (from logs):**
- ❌ `FATAL` errors in any log
- ❌ `Exception` + `Traceback` (Python crashes)
- ❌ `Module 'ai_brain' not found` (SAM AI core missing)
- ❌ `could not connect to database` (PostgreSQL connection failed)
- ❌ `Service failed to start` (Windows service crash)

**HIGH (from logs):**
- ⚠️ `ERROR` appearing repeatedly (> 10 times)
- ⚠️ `Import failed` for key packages (anthropic, psycopg2)
- ⚠️ `Permission denied` (file access issues)
- ⚠️ `Port 8069 already in use` (conflict)

**MEDIUM (from logs):**
- ⚠️ `WARNING` appearing frequently (> 50 times)
- ⚠️ `Deprecated` function calls (future compatibility)
- ⚠️ `Slow query` (> 5 seconds)

**LOW (from logs):**
- ℹ️ Debug messages (if excessive, clutters logs)
- ℹ️ Info-level repeated messages (noise)

**Log Analysis Output (Add to Pass 5 Report):**

```markdown
### Log Analysis Results

**Installation Log:**
- Total lines: 1,245
- Errors: 2 (both CRITICAL)
  - Line 342: "ERROR: PostgreSQL service failed to start"
  - Line 890: "ERROR: Module ai_brain installation failed"
- Warnings: 15 (mostly path-related)

**Odoo Runtime Log:**
- Total lines: 8,932
- Errors: 47 (many repeating)
  - Top error: "ImportError: No module named 'anthropic'" (23 occurrences)
- SAM AI-specific: 12 issues
  - "ai_sam module depends on ai_brain (not installed)"
- Database: 5 connection errors
  - "FATAL: password authentication failed for user 'odoo_user'"

**Build Log:**
- Total lines: 2,103
- Errors: 3
  - Line 142: "Source path not found: C:\old_path\..."
- Warnings: 8 (file size warnings)

**Root Causes Identified from Logs:**
1. PostgreSQL authentication misconfigured (odoo.conf)
2. Python package 'anthropic' not bundled
3. ai_brain module failed to install (blocked ai_sam)
```

---

#### 5.6: Uninstaller Testing
```powershell
# Run uninstaller
& "C:\Program Files\SAM AI Test\unins000.exe" /VERYSILENT

# Wait for completion
Start-Sleep -Seconds 30

# Verify cleanup
Test-Path "C:\Program Files\SAM AI Test"
# Expected: FALSE (folder should be gone)

# Verify services removed
Get-Service -Name "SAM AI Service" -ErrorAction SilentlyContinue
# Expected: Error (service should not exist)
```

**Issues to check:**
- ❌ Uninstaller doesn't remove all files
- ❌ Services not stopped/removed
- ❌ Registry keys not cleaned
- ❌ User data not preserved (should ask before deleting)

---

### 5.7: CREATE/ENHANCE DIAGNOSTIC TOOLS (User Requirement)

**User insight:** "IF diagnostic tools need to be enhanced to simplify our processes, THEY SHOULD BE"

**Philosophy:** Don't just report problems - build tools that prevent them next time!

**When to Create Tool:**
- ✅ Task repeated > 3 times (like log parsing)
- ✅ Manual process error-prone (like path validation)
- ✅ Complex analysis needed (like dependency tree building)
- ✅ Saves significant time (>15 min per use)

**Example Tools to Create/Enhance:**

**Tool 1: Log Analyzer Script**
```powershell
# Location: ${INSTALLER_DEV_FILES}\analyze_logs.ps1
# Purpose: Parse ALL logs, categorize issues, generate report
# Usage: .\analyze_logs.ps1 -LogDir "C:\Program Files\SAM AI\logs"

# Features:
# - Scans all .log files in directory
# - Extracts errors, warnings, patterns
# - Categorizes by severity (CRITICAL/HIGH/MEDIUM/LOW)
# - Generates markdown report
# - Highlights SAM AI-specific issues
# - Detects common root causes automatically
```

**Tool 2: Dependency Checker**
```powershell
# Location: ${INSTALLER_DEV_FILES}\check_dependencies.ps1
# Purpose: Validate ALL dependencies before compile
# Usage: .\check_dependencies.ps1

# Checks:
# - Python version & location
# - PostgreSQL version & location
# - Odoo presence
# - SAM AI modules (ai_brain, ai_sam)
# - Python packages (from requirements.txt)
# - Generates Pass/Fail report
```

**Tool 3: Path Validator**
```powershell
# Location: ${INSTALLER_DEV_FILES}\validate_paths.ps1
# Purpose: Check ALL paths in odoo_samai_installer.iss
# Usage: .\validate_paths.ps1 -IssFile "odoo_samai_installer.iss"

# Features:
# - Parses [Files] section
# - Tests each Source path exists
# - Flags missing files BEFORE compile
# - Suggests fixes (common path mistakes)
```

**Tool 4: Pre-Flight Checker**
```powershell
# Location: ${INSTALLER_DEV_FILES}\pre_flight_check.ps1
# Purpose: ONE command to check everything before compile
# Usage: .\pre_flight_check.ps1

# Runs:
# 1. Dependency checker
# 2. Path validator
# 3. Previous installation detector
# 4. File structure validator
# 5. Generates GO/NO-GO report

# Example output:
# ✅ Dependencies: PASS
# ❌ Paths: FAIL (3 missing)
# ⚠️ Previous install: Found (must uninstall)
# ✅ File structure: PASS
#
# OVERALL: NO-GO (fix paths, uninstall previous)
```

**Tool Enhancement Process:**

**Step 1: Identify Need During Diagnostic**
```
Agent: "I'm parsing logs manually for 5th time - this should be automated"
Agent: "Creating tool: analyze_logs.ps1"
```

**Step 2: Create Tool (Update Existing if Possible)**
```powershell
# Check if tool exists
if (Test-Path "${INSTALLER_DEV_FILES}\analyze_logs.ps1") {
    # Enhance existing
    Write-Host "Enhancing existing analyze_logs.ps1..."
} else {
    # Create new
    Write-Host "Creating new tool: analyze_logs.ps1..."
}
```

**Step 3: Document Tool**
```
Update: 01_TOOLS_AND_SCRIPTS_LIBRARY.md
Add entry:
- analyze_logs.ps1 - Parse all logs, generate issue report
  Usage: .\analyze_logs.ps1 -LogDir "C:\Program Files\SAM AI\logs"
  Created: 2025-11-12 (during Pass 5 diagnostics)
  Saves: ~20 minutes per diagnostic session
```

**Step 4: Test Tool**
```powershell
# Test on current logs
.\analyze_logs.ps1 -LogDir "C:\Program Files\SAM AI\logs"

# Verify output
# If works: Keep tool, add to CURRENT_STATE.md inventory
# If fails: Fix, re-test
```

**Step 5: Integrate Tool into Diagnostic Pass**
```
Next time Pass 5 runs:
- Instead of: Manual log parsing (20 minutes)
- Use: .\analyze_logs.ps1 (2 minutes)
- Result: 18 minutes saved, more comprehensive analysis
```

**Tools Created Should:**
- ✅ Live in dev_files/ (with other active scripts)
- ✅ Be documented in 01_TOOLS_AND_SCRIPTS_LIBRARY.md
- ✅ Have clear usage examples
- ✅ Generate machine-readable output (for automation)
- ✅ Be version-controlled (git)

**Agent Workflow Enhancement:**
```
Phase 3: Multi-Pass Diagnosis
  ↓
Found: Log parsing is manual, repetitive
  ↓
Create: analyze_logs.ps1 tool
  ↓
Test: Verify tool works
  ↓
Document: Add to TOOLS_AND_SCRIPTS_LIBRARY.md
  ↓
Integrate: Use tool in future Pass 5 runs
  ↓
Report to user: "Created analyze_logs.ps1 - saves 18 min per diagnostic"
```

**User's Point: Tools should simplify processes**
✅ Agent will proactively CREATE tools when patterns emerge
✅ Agent will ENHANCE existing tools when gaps found
✅ Agent will DOCUMENT tools for future use
✅ Agent will INTEGRATE tools into diagnostic passes

---

### Pass 5 Output:
**Create:** `diagnostic_pass5_runtime_validation.txt`
```
PASS 5: RUNTIME VALIDATION
Completed: [timestamp]
Install log: install_test_20251112_144530.log

[CRITICAL] - Installer completely broken
- (none if we reached Pass 5!)

[HIGH] - Installer succeeds but SAM AI broken
- Odoo service fails to start (missing database connection)
- SAM AI not accessible at http://localhost:8069 (timeout)

[MEDIUM] - Functional but issues
- Uninstaller leaves behind 15MB of files in C:\Program Files
- Registry keys not cleaned after uninstall

[LOW] - Minor improvements
- Installation takes 8 minutes (could be optimized to ~5 min)
- No progress indicator during silent install

Total Issues: 4 (0 CRITICAL, 2 HIGH, 1 MEDIUM, 1 LOW)

Runtime Status: PARTIAL (installed but Odoo won't start)
Root cause: Database connection string incorrect in odoo.conf
```

---

## 🎯 Consolidated Report (After All 5 Passes)

### Goal: Present ALL findings from all passes in ONE organized document

### Report Structure:

```markdown
# SAM AI Installer - Multi-Pass Diagnostic Report
**Date:** [timestamp]
**Passes Completed:** 5/5 ✅

---

## Executive Summary

**Total Issues Found:** 21
- CRITICAL: 4 (blocking build entirely)
- HIGH: 8 (build succeeds but installer broken)
- MEDIUM: 6 (needs improvement)
- LOW: 3 (nice to have)

**Build Status:** FAILED at Pass 4 (compilation errors)
**Installer Status:** Not tested (Pass 5 skipped - no installer.exe)

**Estimated Time to Fix:**
- CRITICAL issues: 2-3 hours
- HIGH issues: 3-4 hours
- MEDIUM issues: 1-2 hours (can defer)
- LOW issues: 30min-1hr (can defer)

---

## CRITICAL Issues (Fix First - Blocking)

### From Pass 1 (Dependencies):
1. **PostgreSQL 15 not found**
   - Impact: Installer can't bundle database
   - Location: Expected at C:\Program Files\PostgreSQL\15\
   - Fix: Install PostgreSQL 15 or update bundle path

### From Pass 3 (Compiler Config):
2. **odoo_samai_installer.iss line 142: Invalid source path**
   - Impact: Inno Setup compilation fails immediately
   - Current: Source: "C:\Users\old_dev\SAM\*"
   - Fix: Update to "${INSTALLER_BUNDLED}\*"

### From Pass 4 (Build Errors):
3. **Odoo server\odoo-bin not found in bundle**
   - Impact: Nothing to install (missing core component)
   - Location: bundled\odoo\server\odoo-bin
   - Fix: Run odoo bundling script first

4. **Missing Python package: psycopg2**
   - Impact: Database connection will fail at runtime
   - Fix: pip install psycopg2-binary

---

## HIGH Issues (Fix After Critical)

[...list all HIGH issues from all 5 passes...]

---

## MEDIUM Issues (Can Defer with User Permission)

[...list all MEDIUM issues...]

---

## LOW Issues (Nice to Have)

[...list all LOW issues...]

---

## Recommended Fix Sequence

**Phase 1 (2-3 hours):**
1. Install PostgreSQL 15 (Pass 1, Critical #1)
2. Update installer.iss paths (Pass 3, Critical #2)
3. Run odoo bundling script (Pass 4, Critical #3)
4. Install psycopg2 package (Pass 4, Critical #4)
5. Re-run Pass 4 to validate fixes

**Phase 2 (3-4 hours):**
6. Fix HIGH issues (Pass 4, #5-12)
7. Re-run Pass 4 to validate
8. Run Pass 5 (runtime validation)

**Phase 3 (Optional - 1-2 hours):**
9. Fix MEDIUM issues (if user approves)
10. Re-run Pass 5 to validate

**Phase 4 (Optional - 30min-1hr):**
11. Fix LOW issues (if user wants polish)

---

## Next Steps

**Immediate action:** Present this report to user, get priority guidance

**User questions:**
- Should I fix CRITICAL issues now? (estimated 2-3 hours)
- Can I defer MEDIUM/LOW issues for later?
- Any false positives in this report? (issues that aren't actually problems)
```

### Write Report To:
`D:\...\dev_session_reports\diagnostic_YYYYMMDD_HHMMSS_consolidated.md`

**Also update:** CURRENT_STATE.md "Known Problems" section with ALL findings

---

## 📊 Pass Completion Checklist

Before presenting findings to user, verify:

- [ ] Pass 1 completed (Dependencies)
- [ ] Pass 2 completed (File Structure)
- [ ] Pass 3 completed (Compiler Config)
- [ ] Pass 4 completed (Build Errors) - or documented why skipped
- [ ] Pass 5 completed (Runtime Validation) - or documented why skipped
- [ ] All findings categorized (CRITICAL/HIGH/MEDIUM/LOW)
- [ ] All findings include: Location, Impact, Fix
- [ ] Consolidated report written
- [ ] CURRENT_STATE.md updated
- [ ] User presented with complete picture (not just first problem!)

---

## 🚫 Anti-Patterns to Avoid

**❌ DON'T:**
- Stop at first error in Pass 4
- Skip passes because "it probably won't have issues"
- Present findings piecemeal (Pass 1, then later Pass 2, etc.)
- Fix issues without completing all passes first

**✅ DO:**
- Complete ALL 5 passes systematically
- Log every issue found (even if seems minor)
- Categorize by severity objectively
- Present consolidated report with ALL findings
- Let user decide priority

---

**End of Multi-Pass Diagnostic System**
