# PowerShell Script (PS1) Validation Checklist

**Purpose:** Validate PowerShell scripts used in installer for syntax errors, logic issues, path problems, and common anti-patterns before installer compilation.

---

## 🎯 PS1 Script Categories

### Category 1: Pre-Install Scripts
- Environment setup
- Dependency checks
- Service stopping
- File cleanup

### Category 2: Post-Install Scripts
- Service installation
- Configuration
- Database initialization
- First-run setup

### Category 3: Uninstall Scripts
- Service removal
- File cleanup
- Registry cleanup
- Restore previous state

---

## 📋 Syntax Validation

### Check 1: Basic PowerShell Syntax

**Validate:**
```powershell
✅ All brackets paired: { } [ ] ( )
✅ All quotes paired: " " ' '
✅ All backticks used correctly (line continuation)
✅ Semicolons where needed (multi-statement lines)
✅ Cmdlet names spelled correctly
✅ Variable names follow convention ($variableName)
✅ Comments don't break code (# or <# #>)
```

**Common Syntax Errors:**
```powershell
❌ Missing closing brace
if ($condition) {
    Do-Something
# Missing }

❌ Unmatched quotes
$path = "C:\Program Files\SAM AI'

❌ Wrong quote type for paths with variables
$folder = '$env:ProgramFiles\SAM AI'  # Won't expand variable!
✅ $folder = "$env:ProgramFiles\SAM AI"  # Correct

❌ Cmdlet typo
Get-Itme "file.txt"  # Should be Get-Item

❌ Variable typo
$myVar = "value"
Write-Host $myVr  # Typo, will be empty
```

**Manual Check:**
1. Copy entire script to PowerShell ISE
2. Press F5 (run)
3. Check for red syntax errors
4. Fix before proceeding

---

## 🔍 Logic Validation

### Check 2: Variable Initialization

**Validate:**
```powershell
✅ All variables initialized before use
✅ No typos in variable names
✅ Variables scoped appropriately ($script:, $global:)
✅ Environment variables exist ($env:ProgramFiles)
```

**Common Logic Errors:**
```powershell
❌ Variable used before assigned
Write-Host "Path: $installPath"  # $installPath not set yet
$installPath = "C:\SAM AI"

✅ Correct order
$installPath = "C:\SAM AI"
Write-Host "Path: $installPath"

❌ Typo in variable name
$instalPath = "C:\SAM AI"  # Missing 'l'
Write-Host "Path: $installPath"  # Empty!

❌ Assuming environment variable exists
$path = "$env:SAMAI_HOME\config"  # What if SAMAI_HOME not set?

✅ Check first
if ($env:SAMAI_HOME) {
    $path = "$env:SAMAI_HOME\config"
} else {
    $path = "$env:ProgramFiles\SAM AI\config"
}
```

### Check 3: Conditionals & Loops

**Validate:**
```powershell
✅ If/Else logic correct
✅ Comparison operators correct (-eq, -ne, -gt, not =, !=, >)
✅ Boolean logic sound (-and, -or, -not)
✅ Loop termination guaranteed (no infinite loops)
✅ Loop variables updated correctly
```

**Common Logic Errors:**
```powershell
❌ Using = instead of -eq
if ($status = "Running") { }  # Assigns, doesn't compare!
✅ if ($status -eq "Running") { }

❌ Infinite loop risk
while ($true) {
    # No break statement anywhere
}

✅ Loop with exit condition
$maxAttempts = 5
$attempt = 0
while ($attempt -lt $maxAttempts) {
    # Do something
    $attempt++
    if ($success) { break }
}
```

---

## 📁 Path & File Validation

### Check 4: File/Folder References

**Validate:**
```powershell
✅ All file paths exist (or will be created)
✅ Paths use correct separators (\, not /)
✅ Paths handle spaces correctly ("Program Files")
✅ Relative paths relative to correct location
✅ No hardcoded absolute paths (C:\Users\Anthony\...)
```

**Common Path Errors:**
```powershell
❌ Hardcoded user path
$config = "C:\Users\Anthony\Documents\config.xml"
# Won't exist on other machines!

✅ Use system variables
$config = "$env:USERPROFILE\Documents\config.xml"

❌ Assuming file exists without checking
Copy-Item "source.txt" "dest.txt"  # Fails if source.txt missing

✅ Check first
if (Test-Path "source.txt") {
    Copy-Item "source.txt" "dest.txt"
} else {
    Write-Error "source.txt not found"
    exit 1
}

❌ Spaces in path without quotes
Copy-Item C:\Program Files\SAM AI\app.exe dest\
# PowerShell sees 3 arguments: C:\Program, Files\SAM, AI\app.exe

✅ Quote paths with spaces
Copy-Item "C:\Program Files\SAM AI\app.exe" "dest\"

❌ Unix-style path separators
$path = "C:/Program Files/SAM AI"  # May work, but inconsistent

✅ Windows-style
$path = "C:\Program Files\SAM AI"
```

### Check 5: File Operations Safety

**Validate:**
```powershell
✅ Check file exists before reading
✅ Check write permissions before writing
✅ Handle file locks gracefully
✅ Clean up temporary files
✅ No accidental overwrites without confirmation
```

**Common Safety Issues:**
```powershell
❌ Delete without checking
Remove-Item "C:\Program Files\SAM AI" -Recurse -Force
# Dangerous if path wrong!

✅ Verify first
$samPath = "C:\Program Files\SAM AI"
if ((Test-Path $samPath) -and ($samPath -like "*SAM AI*")) {
    Write-Host "Removing: $samPath"
    Remove-Item $samPath -Recurse -Force
} else {
    Write-Warning "Path validation failed: $samPath"
}

❌ Overwrite without backup
Copy-Item "new.config" "app.config" -Force

✅ Backup first
if (Test-Path "app.config") {
    Copy-Item "app.config" "app.config.bak"
}
Copy-Item "new.config" "app.config" -Force
```

---

## 🔐 Permissions & Elevation

### Check 6: Admin Rights

**Validate:**
```powershell
✅ Script checks for admin rights if needed
✅ Operations requiring admin are documented
✅ Graceful failure if insufficient permissions
```

**Common Permission Errors:**
```powershell
❌ Assume admin rights
New-Service -Name "SAMService" -BinaryPathName "C:\SAM\service.exe"
# Fails if not admin!

✅ Check elevation first
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Administrator)) {
    Write-Error "This script requires administrator privileges"
    exit 1
}

# Now safe to create service
New-Service -Name "SAMService" -BinaryPathName "C:\SAM\service.exe"
```

---

## ⚠️ Error Handling

### Check 7: Error Handling Present

**Validate:**
```powershell
✅ Try/Catch blocks for risky operations
✅ $ErrorActionPreference set appropriately
✅ Meaningful error messages
✅ Exit codes set correctly (0 = success, 1+ = failure)
✅ Errors logged (not just displayed)
```

**Common Error Handling Issues:**
```powershell
❌ No error handling
Copy-Item "source.txt" "dest.txt"
Remove-Item "old.txt"
# If Copy-Item fails, Remove-Item still runs!

✅ Proper error handling
try {
    Copy-Item "source.txt" "dest.txt" -ErrorAction Stop
    Remove-Item "old.txt" -ErrorAction Stop
    Write-Host "Success" -ForegroundColor Green
    exit 0
} catch {
    Write-Error "Operation failed: $_"
    exit 1
}

❌ Silent failures
$ErrorActionPreference = "SilentlyContinue"
# Errors hidden, script appears to work but doesn't

✅ Stop on errors (for critical scripts)
$ErrorActionPreference = "Stop"
# Any error halts execution

✅ Or handle individually
Copy-Item "file.txt" "dest\" -ErrorAction Stop
```

---

## 🧪 Dependency Validation

### Check 8: External Dependencies

**Validate:**
```powershell
✅ Required PowerShell version specified (#Requires -Version 5.1)
✅ Required modules checked (Test-ModuleManifest, Import-Module)
✅ External executables checked (Test-Path)
✅ Registry keys checked before accessing
✅ Network resources checked before accessing
```

**Common Dependency Errors:**
```powershell
❌ Assume PowerShell 7 features available
$data | ConvertTo-Json -Depth 10 -AsArray
# -AsArray only in PS 7+, fails in PS 5.1

✅ Check version first
#Requires -Version 5.1
# Or check in code:
if ($PSVersionTable.PSVersion.Major -lt 7) {
    Write-Error "Requires PowerShell 7+"
    exit 1
}

❌ Assume external tool exists
& "C:\Tools\mytool.exe" --install
# Fails if mytool.exe not there

✅ Check first
$toolPath = "C:\Tools\mytool.exe"
if (-not (Test-Path $toolPath)) {
    Write-Error "$toolPath not found"
    exit 1
}
& $toolPath --install
```

---

## 🔄 Services & Processes

### Check 9: Service/Process Management

**Validate:**
```powershell
✅ Check service exists before stopping/starting
✅ Wait for service to stop before proceeding
✅ Timeout on service operations (don't hang forever)
✅ Check process exists before killing
✅ Verify process stopped before deleting files
```

**Common Service/Process Errors:**
```powershell
❌ Stop service without checking if exists
Stop-Service -Name "SAMService"
# Error if service doesn't exist

✅ Check first
$service = Get-Service -Name "SAMService" -ErrorAction SilentlyContinue
if ($service) {
    if ($service.Status -eq "Running") {
        Stop-Service -Name "SAMService" -Force
        # Wait for stop (max 30 seconds)
        $service.WaitForStatus("Stopped", (New-TimeSpan -Seconds 30))
    }
    Write-Host "Service stopped"
} else {
    Write-Host "Service not found (OK if first install)"
}

❌ Delete files while process running
Remove-Item "C:\SAM AI\app.exe" -Force
# Fails if app.exe process running (file locked)

✅ Stop process first
$process = Get-Process -Name "app" -ErrorAction SilentlyContinue
if ($process) {
    $process | Stop-Process -Force
    Start-Sleep -Seconds 2  # Give it time to release locks
}
Remove-Item "C:\SAM AI\app.exe" -Force
```

---

## 🎯 The "C:\Program Files\SAM AI" Lock Issue

**Why folder can't be removed:**

**Possible Causes:**
1. ✅ **Process still running** (app.exe, service.exe)
   - Check: `Get-Process | Where-Object { $_.Path -like "*SAM AI*" }`

2. ✅ **Service still installed** (even if stopped)
   - Check: `Get-Service | Where-Object { $_.BinaryPathName -like "*SAM AI*" }`

3. ✅ **File lock by Windows** (Explorer, search indexer, antivirus)
   - Check: Use SysInternals Handle.exe to find lock

4. ✅ **Insufficient permissions** (need admin to delete from Program Files)
   - Check: Run PowerShell as administrator

5. ✅ **Junction/Symlink issue** (folder is linked)
   - Check: `Get-Item "C:\Program Files\SAM AI" | Select-Object LinkType`

**Diagnostic Script:**
```powershell
$samPath = "C:\Program Files\SAM AI"

Write-Host "=== Diagnosing SAM AI folder lock ===" -ForegroundColor Yellow

# Check 1: Admin rights
if (-not (Test-Administrator)) {
    Write-Host "❌ Not running as administrator" -ForegroundColor Red
} else {
    Write-Host "✅ Running as administrator" -ForegroundColor Green
}

# Check 2: Processes
$processes = Get-Process | Where-Object { $_.Path -like "*SAM AI*" }
if ($processes) {
    Write-Host "❌ Processes still running:" -ForegroundColor Red
    $processes | ForEach-Object { Write-Host "  - $($_.Name) (PID: $($_.Id))" }
} else {
    Write-Host "✅ No processes running from SAM AI folder" -ForegroundColor Green
}

# Check 3: Services
$services = Get-Service | Where-Object { $_.BinaryPathName -like "*SAM AI*" }
if ($services) {
    Write-Host "❌ Services still referencing SAM AI:" -ForegroundColor Red
    $services | ForEach-Object { Write-Host "  - $($_.Name) [$($_.Status)]" }
} else {
    Write-Host "✅ No services reference SAM AI folder" -ForegroundColor Green
}

# Check 4: Folder exists
if (Test-Path $samPath) {
    Write-Host "⚠️ Folder exists: $samPath" -ForegroundColor Yellow

    # Try to remove
    try {
        Remove-Item $samPath -Recurse -Force -ErrorAction Stop
        Write-Host "✅ Folder removed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Cannot remove folder: $_" -ForegroundColor Red
    }
} else {
    Write-Host "✅ Folder doesn't exist (already removed)" -ForegroundColor Green
}
```

---

## 📊 PS1 Validation Checklist

**Before approving any PS1 script:**

### Syntax
- [ ] No syntax errors (test in PowerShell ISE)
- [ ] All brackets paired
- [ ] All quotes paired
- [ ] Cmdlets spelled correctly

### Logic
- [ ] Variables initialized before use
- [ ] No typos in variable names
- [ ] Conditionals use correct operators (-eq, not =)
- [ ] Loops terminate (no infinite loops)

### Paths
- [ ] No hardcoded absolute paths (C:\Users\Anthony\...)
- [ ] Paths use Windows separators (\)
- [ ] Paths with spaces quoted
- [ ] File existence checked before operations

### Safety
- [ ] Admin rights checked if needed
- [ ] File operations have error handling
- [ ] No accidental overwrites
- [ ] Temporary files cleaned up

### Error Handling
- [ ] Try/Catch for risky operations
- [ ] Meaningful error messages
- [ ] Exit codes set (0 = success, 1+ = failure)
- [ ] $ErrorActionPreference appropriate

### Dependencies
- [ ] PowerShell version checked (#Requires)
- [ ] External tools checked (Test-Path)
- [ ] Modules imported (Import-Module)
- [ ] Services/processes checked before operations

### Services/Processes
- [ ] Service existence checked before operations
- [ ] Timeout on service operations
- [ ] Processes stopped before file deletion
- [ ] File locks released before operations

**If ANY item unchecked → NO-GO**

---

## ✅ Sign-Off Criteria

**PS1 script approved when:**
- ✅ Syntax valid (no errors in PowerShell ISE)
- ✅ Logic sound (manual trace completed)
- ✅ Paths correct (no hardcoded, existence checked)
- ✅ Error handling present (try/catch, exit codes)
- ✅ Dependencies validated (version, tools, modules)
- ✅ Safety measures in place (admin checks, backups)
- ✅ Services/processes handled correctly (locks released)

**Until ALL criteria met → Status: NO-GO**

---

**Usage:** exe-approval uses this checklist when reviewing PS1 scripts
