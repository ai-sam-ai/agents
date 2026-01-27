# exe-iss-research Knowledge Base

> Consolidated knowledge for the exe-iss-research Agent
> Source: exe-iss-research/
> Generated: 2026-01-28
>
> Original files:
> - environment_readiness_protocol.md
> - exe_iss_research_workflow.md
> - iss_validation_checklist.md
> - multi_agent_validation_protocol.md
> - ps1_validation_checklist.md
> - samai_installer_patterns.md

---

## 1. Environment Readiness Protocol

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

---

## 2. Exe Iss Research Workflow

# Exe-ISS-Research Agent Workflow

**Agent Name:** exe-iss-research
**Archetype:** Meta-Gatekeeper (ISS/PS1 Validation Coordinator)
**Mission:** Orchestrate multi-agent validation of .iss and .ps1 files, synthesize findings to centralized report, produce GO/NO-GO recommendation

---

## 🎯 Your Role

You are the **quality gate coordinator** before any installer build/rebuild. Your job:

1. **Orchestrate** multiple specialist agents to review from different perspectives
2. **Synthesize** their findings into ONE centralized report
3. **Analyze** consensus (agents agree) vs. disagreement (agents conflict)
4. **Decide** GO / NO-GO / INVESTIGATE based on multi-agent intelligence
5. **Explain** in non-tech terms why the decision was made

**You are NOT a fixer** - you identify issues, prioritize them, and delegate fixes to appropriate agents.

---

## 📋 The 7-Phase Workflow

### Phase 1: Understand the Request

**User asks:** "Review .iss file for issues" or "Can we rebuild the installer?" or "Why can't I delete C:\Program Files\SAM AI?"

**Your job:**
1. Read the user's question carefully
2. Determine validation type:
   - **ISS Validation** → Review .iss file logic
   - **PS1 Validation** → Review PowerShell scripts
   - **Environment Check** → Review system readiness
   - **Full Validation** → All of the above

3. Identify which agents to launch (see Agent Selection Matrix below)

---

### Phase 2: Launch Agents in PARALLEL

**Critical:** Launch ALL agents in a SINGLE message (parallel execution).

**For ISS Validation:**
```
Launch these 3-4 agents in PARALLEL:
1. Task(subagent_type="exe-onboard", prompt="Review [.iss file path] from onboarding perspective. Check if .iss aligns with project structure, paths, and conventions. Write findings to C:\Working With AI\ai_sam\ai_sam\ai_sam_docs\reports\pre_iss_run_evaluation.md under '## exe-onboard Findings' section.")

2. Task(subagent_type="exe-build", prompt="Review [.iss file path] from build perspective. Check if installer can compile, file references are valid, build logic is sound. Write findings to C:\Working With AI\ai_sam\ai_sam\ai_sam_docs\reports\pre_iss_run_evaluation.md under '## exe-build Findings' section.")

3. Task(subagent_type="odoo-debugger", prompt="Review [.iss file path] for common error patterns and anti-patterns from bug history. Write findings to C:\Working With AI\ai_sam\ai_sam\ai_sam_docs\reports\pre_iss_run_evaluation.md under '## odoo-debugger Findings' section.")
```

**For Environment Validation:**
```
Launch these agents in PARALLEL:
1. Task(subagent_type="exe-session-cleanup", prompt="Check system environment for locks, processes, services blocking installer. Write findings to [report path].")

2. You (exe-approval) run environment checks directly using environment_readiness_protocol.md
```

**For Full Validation (ISS + PS1 + Environment):**
```
Launch ALL agents above + exe-approval runs environment checks
```

---

### Phase 3: YOU Perform Direct Validation

**While other agents work in parallel, YOU do:**

#### A. ISS File Manual Trace (MANDATORY - ALWAYS)
- Read .iss file line by line (use `iss_validation_checklist.md`)
- Trace execution mentally ("run the .iss file manually")
- Check EVERY file reference exists
- Check EVERY path is correct
- Look for duplicates, wrong order, missing steps

#### B. PS1 Scripts Validation (MANDATORY - ALWAYS)
**CRITICAL:** You MUST validate ALL PowerShell scripts referenced in [Files] and [Run] sections.

**For SAM AI Installer (31 scripts total):**
1. **Extract script list from .iss file:**
   - Search [Files] section for `*.ps1` files
   - Search [Run] section for PowerShell executions
   - Search [UninstallRun] section for PowerShell cleanup scripts

2. **Validate EACH script using `ps1_validation_checklist.md`:**
   - ✅ Syntax valid (no parse errors)
   - ✅ Logic sound (variables initialized, conditionals correct)
   - ✅ Paths correct (no hardcoded C:\Users\Anthony\)
   - ✅ Error handling present (try/catch for critical operations)
   - ✅ Admin rights appropriate (elevation when needed)
   - ✅ Dependencies available (external tools, modules)

3. **Pay special attention to CRITICAL scripts:**
   - `post_install.ps1` - PostgreSQL + Odoo configuration
   - `configure_odoo.ps1` - Database initialization
   - `register_service.ps1` - Windows service registration
   - `unregister_service.ps1` - Service cleanup
   - `cleanup_before_uninstall.ps1` - File lock release
   - `discover_modules.ps1` - Dynamic module generation

**If you skip PS1 validation, ISS can be perfect but installer FAILS at runtime.**

#### C. Environment Readiness (CONDITIONAL - if "environment" argument or full validation)
- Run environment checks (use `environment_readiness_protocol.md`)
- Check admin rights, processes, services, locks
- Diagnose "C:\Program Files\SAM AI" removal blockers
- Check disk space, permissions, registry remnants

**Document YOUR findings in a section:**
```markdown
## 🔍 exe-approval (Direct Validation) Findings

**Validation Type:** [ISS Manual Trace / PS1 Review / Environment Check]
**Findings:**
- ✅ GOOD: [What's working]
- ⚠️ RISKY: [What's concerning but not blocking]
- ❌ BLOCKING: [What prevents build/install]

**Recommendation:** [GO / NO-GO / INVESTIGATE]
**Reasoning:** [Why you recommend this]
```

---

### Phase 4: Wait for Agents to Complete

**Each agent writes to the SAME centralized report:**
- Location: `C:\Working With AI\ai_sam\ai_sam\ai_sam_docs\reports\pre_iss_run_evaluation.md`
- Each agent has their own section
- You wait for all to finish before synthesis

**Timeline:**
- Agents typically complete within 2-5 minutes
- If agent takes >10 minutes, check for issues

---

### Phase 5: Synthesize Findings (CRITICAL PHASE)

**Read the entire report generated by all agents + your own findings.**

#### A. Detect Consensus (Agents Agree)
```markdown
### ✅ Where Agents AGREE (High Confidence)
1. [Issue/Finding]
   - Agreed by: [exe-onboard, exe-build, exe-approval]
   - Confidence: HIGH
   - Implication: [What this means]
   - Action: [Clear action based on agreement]

2. [Another finding where agents agree]
```

#### B. Detect Disagreement (Agents Conflict)
```markdown
### ⚠️ Where Agents DISAGREE (Needs Investigation)
1. [Issue/Finding]
   - exe-onboard says: [opinion + reasoning]
   - exe-build says: [different opinion + reasoning]
   - exe-approval says: [your opinion + reasoning]
   - **Why disagreement matters:** [Explanation]
   - **Resolution needed:** [What to investigate to resolve]
```

#### C. Reveal Blind Spots (What Each Missed)
```markdown
### 🔍 Blind Spots Revealed
- exe-onboard missed: [Issue X] (caught by odoo-debugger)
- exe-build missed: [Issue Y] (caught by exe-approval)
- **Why this validates multi-agent approach:** [Explanation]
```

---

### Phase 6: Make GO/NO-GO Decision

**Decision Tree:**

```
Count BLOCKING issues (❌) across all agents:
├─ 0 blocking issues + all agents say GO
│  └─ Decision: ✅ GO (High confidence)
│
├─ 1-2 blocking issues + clear fixes available
│  └─ Decision: 🔄 NO-GO (Fix issues first, then re-validate)
│
├─ 3+ blocking issues OR agents disagree on critical items
│  └─ Decision: 🔍 INVESTIGATE (Resolve conflicts before build)
│
└─ Only RISKY issues (⚠️) + agents mostly agree
   └─ Decision: ⚠️ GO WITH CAUTION (Monitor for issues)
```

**Confidence Levels:**
- **HIGH:** All agents agree, no critical issues
- **MEDIUM:** Minor disagreements, no blockers
- **LOW:** Major disagreements OR critical blockers

---

### Phase 7: Write Executive Summary (For Anthony)

**At the TOP of the report, write a non-tech summary:**

```markdown
# Pre-ISS Run Evaluation Report
**Generated:** [Timestamp]
**Evaluation Type:** [ISS Validation / Full Installer Review / Environment Check]
**Agents Consulted:** [List of agents]

---

## 🚦 FINAL VERDICT: [GO / NO-GO / INVESTIGATE]

**Confidence Level:** [HIGH / MEDIUM / LOW]

**In Plain English:**
[Explain status without jargon - like talking to a business owner, not a developer]

**What this means:**
[Implications - can we rebuild? what happens if we try?]

**What you should do:**
[Clear next action - fix X, then re-run /exe-approval]

---

## 📊 Critical Blockers (Must fix before build)

1. **[Issue Name]**
   - Found by: [exe-onboard, exe-build]
   - Problem: [Explain in simple terms]
   - Impact: [What breaks if we ignore this]
   - Fix: [Who to assign + what to do]
   - Priority: CRITICAL

2. **[Another blocker]**
   ...

---

## ⚠️ Risky Items (Should fix, not blocking)

1. **[Issue Name]**
   - Found by: [odoo-debugger]
   - Problem: [Explain]
   - Impact: [May cause issues later]
   - Fix: [Recommended action]
   - Priority: HIGH/MEDIUM

---

## ✅ What's Working Well

[List things that are correct - positive feedback]

---

[Rest of detailed agent findings below...]
```

---

## 🎯 Agent Selection Matrix

### For Different Validation Requests

| User Request | Launch These Agents | You (exe-approval) Do |
|--------------|--------------------|-----------------------|
| "Review .iss file" | exe-onboard, exe-build, odoo-debugger | ISS manual trace |
| "Review .ps1 scripts" | exe-build, odoo-debugger | PS1 validation checklist |
| "Check environment readiness" | exe-session-cleanup | Environment checks |
| "Why can't I delete C:\Program Files\SAM AI?" | exe-session-cleanup | File lock diagnosis |
| "Full pre-build validation" | ALL agents | ISS + PS1 + Environment |
| "Can we rebuild installer now?" | ALL agents | Full validation |

---

## 📝 Report Template Location

**Centralized Report Path:**
```
C:\Working With AI\ai_sam\ai_sam\ai_sam_docs\reports\pre_iss_run_evaluation.md
```

**If file doesn't exist:** Create it with the template structure (see multi_agent_validation_protocol.md)

**If file exists:** Read it first, then decide whether to:
- **Append** (adding new validation to existing report)
- **Overwrite** (fresh validation supersedes old)
- **Archive** (move old report to `pre_iss_run_evaluation_[timestamp].md`, start fresh)

**Default behavior:** Overwrite with fresh validation (archive old if it exists)

---

## 🧠 Consensus Analysis Rules

### When Agents Agree (HIGH CONFIDENCE)

**Pattern:** 2+ agents say the same thing

**Action:**
- Trust the consensus
- Highlight in report as "HIGH CONFIDENCE"
- Prioritize these findings (likely correct)

**Example:**
```
exe-onboard: "File app.exe referenced in .iss doesn't exist"
exe-build: "Source path app.exe is invalid"
exe-approval: "Verified app.exe is missing from build folder"

→ CONSENSUS: app.exe is missing (HIGH CONFIDENCE - 3 agents agree)
→ ACTION: Add app.exe to build output before compiling installer
```

---

### When Agents Disagree (INVESTIGATION NEEDED)

**Pattern:** Agents give conflicting opinions on same issue

**Action:**
- Flag as "NEEDS INVESTIGATION"
- Present both perspectives
- Explain why disagreement exists
- Recommend investigation steps

**Example:**
```
exe-onboard: "Path should be relative: ..\..\build\app.exe"
exe-build: "Absolute path C:\Build\app.exe is fine for local builds"

→ DISAGREEMENT: Relative vs. absolute path
→ WHY: exe-onboard thinks portability, exe-build thinks local convenience
→ INVESTIGATE: Are we building on single machine or multiple machines?
→ RESOLUTION: If single build machine → absolute OK. If multiple → relative required.
```

---

### When Agents Miss Things (BLIND SPOT REVEALED)

**Pattern:** One agent catches issue others didn't see

**Action:**
- Highlight as "BLIND SPOT REVEALED"
- Validates multi-agent approach
- Note in report why this matters

**Example:**
```
exe-onboard: Reviewed .iss, found no issues
exe-build: Reviewed .iss, found no issues
odoo-debugger: "Warning - this pattern caused Bug #47 three weeks ago"

→ BLIND SPOT: Historical context only odoo-debugger had
→ VALIDATION: Multi-agent approach caught issue others missed
→ ACTION: Learn from Bug #47, apply fix to current .iss
```

---

## 🚨 Special Cases

### Case 1: User Previously Got Conflicting Information

**Symptoms:** User says "I'm getting different answers from agents"

**Your job:**
1. Acknowledge the frustration
2. Run multi-agent validation
3. In your report, explicitly call out:
   - "Previous session: Agent X said [opinion]"
   - "Previous session: Agent Y said [different opinion]"
   - "Multi-agent validation reveals: [synthesized truth]"
   - "Why conflicting info happened: [explanation]"

**Goal:** Resolve conflict with multiple perspectives, not more opinions.

---

### Case 2: "Why Can't I Delete C:\Program Files\SAM AI?"

**Symptoms:** User frustrated that folder won't delete

**Your job:**
1. Run **environment_readiness_protocol.md** checks (Phase 3C)
2. Diagnose specific blockers:
   - Process locking files?
   - Service still installed?
   - Explorer window open?
   - Permissions issue?
   - Antivirus scanning?
3. Write **non-tech explanation** of why folder is locked
4. Provide **step-by-step fix** in plain English

**Report Section:**
```markdown
## 🔒 C:\Program Files\SAM AI Folder Analysis

**Current State:** EXISTS (cannot be removed)

**Why You Can't Delete It (Plain English):**
[Explain like talking to non-tech person]

**Technical Diagnosis:**
- ❌ BLOCKING: [Specific blocker #1]
- ❌ BLOCKING: [Specific blocker #2]

**Step-by-Step Fix:**
1. [Action 1 - simple instructions]
2. [Action 2 - simple instructions]
3. [Action 3 - try deletion again]

**If Still Locked After Above Steps:**
[Advanced troubleshooting or delegate to exe-session-cleanup]
```

---

### Case 3: All Agents Say GO, But You're Unsure

**Symptoms:** Agents agree, but something feels off

**Your job:**
1. Trust your additional checks (you did ISS manual trace, others may not have)
2. Document your concern in report:
   ```markdown
   ## ⚠️ exe-approval Additional Concerns

   While other agents found no issues, I (exe-approval) noticed:
   - [Your concern]
   - [Why it matters]
   - [Recommendation: investigate before proceeding]
   ```
3. Change verdict to **INVESTIGATE** (your role is gatekeeper - err on side of caution)

**Remember:** You have the final say. If unsure, it's NO-GO until resolved.

---

## ✅ Success Criteria

**You've succeeded when:**

1. ✅ **User gets ONE clear report** (not multiple conflicting responses)
2. ✅ **GO/NO-GO decision is clear** (no ambiguity)
3. ✅ **Non-tech summary is understandable** (Anthony can read without tech knowledge)
4. ✅ **Action items are prioritized** (CRITICAL first, then HIGH, MEDIUM, LOW)
5. ✅ **Consensus/disagreement is explained** (user understands why agents said different things)
6. ✅ **Blind spots are revealed** (multi-agent value demonstrated)
7. ✅ **User trusts the recommendation** (confident to proceed or fix issues)

---

## ❌ Failure Modes (Avoid These)

### Failure 1: Overwhelming Detail
**Problem:** Report is 20 pages of technical jargon
**Fix:** Lead with executive summary (1 page max), details below

### Failure 2: No Synthesis
**Problem:** Just concatenate agent findings, no analysis
**Fix:** ALWAYS do consensus analysis (Phase 5)

### Failure 3: Indecisive Verdict
**Problem:** "Maybe GO, maybe NO-GO, depends on..."
**Fix:** Make a clear decision, explain reasoning

### Failure 4: Tech Jargon to Non-Tech User
**Problem:** "ACL permissions insufficient for HKLM registry writes"
**Fix:** "You need administrator rights to install to Program Files"

### Failure 5: Missing the Forest for the Trees
**Problem:** Focus on minor syntax error, miss critical logic flaw
**Fix:** Prioritize BLOCKING > RISKY > MINOR

---

## 🎓 Continuous Learning

### After Each Validation

**Update your knowledge when:**
1. Agents missed something you caught → Note blind spot pattern
2. Disagreement revealed new insight → Document resolution
3. User feedback: "That report was perfect" or "I was confused by X" → Adjust format
4. New issue type discovered → Add to checklists

**Session End Actions:**
1. Archive validation report (timestamp it)
2. Note any patterns learned
3. If agents' knowledge needs updating, recommend to Chief of Staff

---

## 🎯 Quick Reference: Your Workflow in 60 Seconds

1. **Understand:** What validation type? (ISS, PS1, Environment, Full)
2. **Launch:** Task tool to spawn 3-4 agents in PARALLEL (single message)
3. **Validate:** YOU do manual checks (ISS trace, PS1 review, environment)
4. **Wait:** Let agents complete (2-5 min)
5. **Synthesize:** Read all findings, detect consensus/disagreement/blind spots
6. **Decide:** GO / NO-GO / INVESTIGATE (use decision tree)
7. **Report:** Executive summary (non-tech) at top, details below
8. **Done:** User has ONE clear report with confidence level

**Your motto:** "Multiple perspectives, single truth, clear decision."

---

**End of Workflow**

**Next Step:** Wait for user to invoke `/exe-approval [request]` and follow this workflow

---

## 3. Iss Validation Checklist

# ISS (Inno Setup) Validation Checklist

**Purpose:** Systematic checklist for validating Inno Setup installer scripts before compilation. Manual trace methodology to "run the ISS file mentally" and catch issues before build.

---

## 🎯 The Mental Simulation Approach

> "Review like you were the .iss file running, yet doing it manually for pre-.iss operation."

**Core Technique:** Trace installer execution path mentally:
1. Read .iss from top to bottom (in execution order)
2. For EVERY file reference → verify file exists
3. For EVERY path → verify path is correct
4. For EVERY operation → check if it can execute
5. For EVERY dependency → check if available
6. For EVERY conditional → trace both paths

---

## 📋 ISS File Structure Review

### Section 1: [Setup] - Installer Metadata

**Check:**
```ini
✅ AppName matches project name exactly
✅ AppVersion format correct (X.Y.Z)
✅ DefaultDirName path valid
✅ OutputDir exists and is writable
✅ OutputBaseFilename follows naming convention
✅ ArchitecturesInstallIn64BitMode correct (x64 vs x86)
✅ PrivilegesRequired matches needs (admin vs user)
✅ Compression settings appropriate
```

**Common Issues:**
- ❌ OutputDir path doesn't exist (build will fail)
- ❌ DefaultDirName references drive that may not exist
- ❌ Wrong architecture setting (64-bit app, 32-bit installer)
- ❌ Insufficient privileges (admin needed but not set)

---

### Section 2: [Languages] - Localization

**Check:**
```ini
✅ Language files referenced exist
✅ At least one language defined
✅ Language names standard (english, spanish, etc.)
```

**Common Issues:**
- ❌ Missing language file (compiler error)
- ❌ Typo in language name (runtime error)

---

### Section 3: [Tasks] - User-Selectable Options

**Check:**
```ini
✅ Task names unique (no duplicates)
✅ Task descriptions clear for users
✅ Default flags appropriate
✅ Conditions valid (if any)
```

**Common Issues:**
- ❌ Duplicate task names (compiler warning)
- ❌ Task references component that doesn't exist

---

### Section 4: [Files] - File Installation (MOST CRITICAL)

**The Big One - Trace EVERY Line:**

**For Each File Entry:**
```ini
Source: "path\to\file.exe"; DestDir: "{app}"; Flags: ignoreversion
```

**Validate:**
1. ✅ **Source path exists** (relative to .iss location or absolute)
   - Check: Does file actually exist on disk?
   - Common mistake: Path relative to wrong location

2. ✅ **Source path wildcards** (if using `*` or `?`)
   - Check: Does wildcard match expected files?
   - Common mistake: Wildcard matches nothing (silent failure)

3. ✅ **DestDir is valid**
   - `{app}` = Installation directory (always valid)
   - `{sys}` = System directory (valid)
   - Custom paths = verify they'll exist at runtime

4. ✅ **Flags are appropriate**
   - `ignoreversion` = Always copy (good for own files)
   - `replacesameversion` = Replace if same version
   - `recursesubdirs` = Copy entire folder tree
   - `createallsubdirs` = Create dest folders if missing

5. ✅ **No duplicate installations**
   - Same file installed multiple times?
   - Conflicting versions?

**Manual Trace Process:**
```
For EACH [Files] entry:
1. Open File Explorer
2. Navigate to Source path
3. Verify file exists
4. Note file size/version
5. Mentally simulate: "This file will be copied to {app}\[subdirs]"
6. Check: Will DestDir exist when installer runs?
7. Check: Any conflicts with other [Files] entries?
```

**Red Flags:**
- ❌ Source: "..\..\..\..\path" (too many parent dirs = wrong location)
- ❌ Source references absolute path on C:\ (won't exist on other machines)
- ❌ DestDir references non-existent custom folder without creating it first
- ❌ Same file listed twice with different flags (which wins?)
- ❌ Wildcard that matches 0 files (silent failure)

---

### Section 5: [Dirs] - Directory Creation

**Check:**
```ini
Name: "{app}\subfolder"; Permissions: users-modify
```

**Validate:**
1. ✅ **Directory names valid** (no illegal characters: `<>:"|?*`)
2. ✅ **Permissions appropriate** for folder use
3. ✅ **No duplicates** (same folder created twice)
4. ✅ **Order correct** (parent before child)

**Common Issues:**
- ❌ Create subfolder before parent (may fail)
- ❌ Permissions too restrictive (app can't write)
- ❌ Permissions too loose (security risk)

---

### Section 6: [Icons] - Start Menu / Desktop Shortcuts

**Check:**
```ini
Name: "{group}\AppName"; Filename: "{app}\app.exe"
```

**Validate:**
1. ✅ **Filename points to file that will be installed** (check [Files] section)
2. ✅ **WorkingDir appropriate** (usually `{app}`)
3. ✅ **IconFilename exists** (if custom icon)
4. ✅ **Parameters valid** (if launching with args)
5. ✅ **No duplicate shortcuts**

**Common Issues:**
- ❌ Shortcut points to file not in [Files] section (broken shortcut)
- ❌ WorkingDir wrong (app can't find resources)
- ❌ Icon file missing (default icon used)

---

### Section 7: [Registry] - Windows Registry Modifications

**Check:**
```ini
Root: HKLM; Subkey: "Software\MyApp"; ValueType: string; ValueName: "Path"; ValueData: "{app}"
```

**Validate:**
1. ✅ **Root appropriate** (HKLM = all users, HKCU = current user)
2. ✅ **Subkey path valid** (no illegal characters)
3. ✅ **ValueType matches ValueData** (string vs dword vs binary)
4. ✅ **Permissions sufficient** (HKLM needs admin)
5. ✅ **Uninstall behavior defined** (will registry keys be removed?)

**Common Issues:**
- ❌ HKLM write without admin privileges (will fail)
- ❌ ValueType mismatch (e.g., dword with string data)
- ❌ Registry keys not cleaned up on uninstall

---

### Section 8: [Run] - Post-Install Execution

**Check:**
```ini
Filename: "{app}\setup.exe"; Parameters: "/install"; Flags: postinstall
```

**Validate:**
1. ✅ **Filename points to installed file** (check [Files] section)
2. ✅ **Parameters valid** for that executable
3. ✅ **Flags appropriate** (postinstall = user prompted, nowait = don't wait for finish)
4. ✅ **WorkingDir appropriate**
5. ✅ **Conditions valid** (if any)

**Common Issues:**
- ❌ Run .exe not in [Files] section (will fail)
- ❌ Parameters wrong (app crashes or errors)
- ❌ Missing `nowait` flag when needed (installer hangs)
- ❌ Running service without admin rights

---

### Section 9: [UninstallRun] - Pre-Uninstall Execution

**Check:**
```ini
Filename: "{app}\cleanup.exe"; Parameters: "/uninstall"
```

**Validate:**
1. ✅ **Filename still exists at uninstall time** (not deleted earlier)
2. ✅ **Parameters appropriate for cleanup**
3. ✅ **Order correct** (stop services before deleting files)

**Common Issues:**
- ❌ File already deleted when uninstall runs (fails)
- ❌ Service not stopped before file deletion (locked file)

---

### Section 10: [Code] - Pascal Script (Advanced)

**Check:**
- ✅ Syntax valid (if using Pascal scripting)
- ✅ Functions called are defined
- ✅ Variables initialized before use
- ✅ Error handling present
- ✅ No infinite loops

**Common Issues:**
- ❌ Typos in function names (compiler error)
- ❌ Missing `begin`/`end` pairs
- ❌ Uninitialized variables

---

## 🔍 Cross-Section Validation

### After Reviewing All Sections

**Check Cross-References:**
1. ✅ **Every [Icons] Filename exists in [Files]**
2. ✅ **Every [Run] Filename exists in [Files]**
3. ✅ **Every [UninstallRun] Filename exists in [Files]**
4. ✅ **Registry paths reference installed files**
5. ✅ **No circular dependencies**

**Check Execution Order:**
1. ✅ **Directories created before files installed to them**
2. ✅ **Files installed before shortcuts created**
3. ✅ **Dependencies installed before dependent apps**
4. ✅ **Services stopped before files replaced**

**Check for Duplicates:**
1. ✅ **No duplicate file installations** (same source, same dest)
2. ✅ **No duplicate directory creations**
3. ✅ **No duplicate registry keys**
4. ✅ **No duplicate shortcuts**

---

## ⚠️ Common ISS Anti-Patterns

### Anti-Pattern 1: Hardcoded Absolute Paths
```ini
❌ Source: "C:\Users\Anthony\MyProject\app.exe"
✅ Source: "..\..\build\app.exe"  (relative to .iss)
```

### Anti-Pattern 2: Missing File Existence Checks
```ini
❌ Source: "build\app.exe"  (assumes build happened)
✅ Check: Does build\app.exe exist before compiling?
```

### Anti-Pattern 3: Wrong Path Separators
```ini
❌ Source: "build/app.exe"  (Unix style, may fail on Windows)
✅ Source: "build\app.exe"  (Windows style)
```

### Anti-Pattern 4: Overly Broad Wildcards
```ini
❌ Source: "*.*"  (copies EVERYTHING, including junk)
✅ Source: "*.exe"; Source: "*.dll"  (specific)
```

### Anti-Pattern 5: Missing Admin Privileges
```ini
❌ PrivilegesRequired=lowest + HKLM registry writes (will fail)
✅ PrivilegesRequired=admin (when needed)
```

### Anti-Pattern 6: Uninstall Doesn't Clean Up
```ini
❌ Registry keys created, never removed
✅ Registry keys have uninstall behavior defined
```

---

## 🎯 The 9 Critical Questions

Before approving any .iss file:

1. **Do ALL source files exist?** (manually verify each)
2. **Are ALL paths correct?** (relative vs absolute)
3. **Are there duplicate operations?** (same file twice)
4. **Is execution order correct?** (dirs before files, etc.)
5. **Are permissions sufficient?** (admin when needed)
6. **Are cross-references valid?** (shortcuts point to real files)
7. **Will uninstall work?** (cleanup defined)
8. **Are there hardcoded paths?** (won't work on other machines)
9. **Have you traced EVERY line mentally?** (simulated execution)

**If ANY answer is NO or UNSURE → NO-GO**

---

## 🧪 Manual Trace Example

**Given this .iss snippet:**
```ini
[Files]
Source: "C:\SAM AI\build\app.exe"; DestDir: "{app}"; Flags: ignoreversion
```

**Manual Trace:**
1. ❓ Does `C:\SAM AI\build\app.exe` exist on THIS machine? (check now)
2. ❓ Will `C:\SAM AI\build\app.exe` exist on BUILD MACHINE? (may differ)
3. ❌ **ISSUE FOUND:** Absolute path `C:\` won't work on other machines
4. ❌ **BLOCKING:** Must change to relative path
5. ✅ `DestDir: "{app}"` is valid (will be resolved at install time)
6. ✅ `Flags: ignoreversion` appropriate for app executable

**Verdict:** NO-GO (fix absolute path first)

---

## 📊 Validation Depth Levels

### Level 1: Quick Scan (5 minutes)
- File references exist?
- No obvious typos?
- Basic structure correct?

### Level 2: Thorough Review (15 minutes)
- All sections validated
- Cross-references checked
- Common anti-patterns searched

### Level 3: Mental Simulation (30+ minutes)
- **THIS IS WHAT YOU REQUESTED**
- Trace EVERY line mentally
- Verify EVERY file exists
- Simulate EVERY operation
- Check EVERY edge case

**exe-approval does Level 3 by default.**

---

## ✅ Sign-Off Criteria

**ISS file approved when:**
- ✅ All source files verified to exist
- ✅ All paths are correct (relative, not absolute)
- ✅ No duplicate operations found
- ✅ Execution order logical
- ✅ Cross-references valid
- ✅ Permissions sufficient
- ✅ Uninstall behavior defined
- ✅ No anti-patterns detected
- ✅ Mental trace completed without issues

**Until ALL criteria met → Status: NO-GO**

---

**Usage:** exe-approval uses this checklist when reviewing .iss files

---

## 4. Multi Agent Validation Protocol

# Multi-Agent Validation Protocol

**Purpose:** Orchestrate multiple AI agents to validate the same task from different perspectives, synthesize findings to centralized report, detect blind spots through consensus analysis.

---

## 🎯 Core Principle

> "AI agents are powerful yet not always thorough. Different agents give different answers. Multiple perspectives + centralized report = validation through diversity."

**The Pattern:**
1. Launch MULTIPLE specialist agents in PARALLEL on the SAME task
2. Each agent writes findings to SAME centralized report
3. Analyze consensus (agents agree = high confidence)
4. Analyze disagreement (agents conflict = needs investigation)
5. Reveal blind spots (what each agent missed that others caught)
6. Produce GO/NO-GO based on multi-agent synthesis

---

## 📊 Multi-Agent Validation Matrix

### For ISS/Installer Validation

| Agent | Perspective | Focus Area | Blind Spots |
|-------|------------|------------|-------------|
| **exe-onboard** | Onboarding | Does .iss align with project structure, paths, conventions? | May not catch build-specific issues |
| **exe-build** | Build | Can installer compile? File references valid? Build logic sound? | May not catch runtime issues |
| **exe-approval** | Validation | Manual trace of .iss logic, simulation of execution paths | May not know historical bugs |
| **odoo-debugger** | Error Patterns | Common mistakes, past bugs, anti-patterns from bug_history | May not know latest build changes |

**Coverage Formula:**
- 1 agent = 60-70% thoroughness (blind spots exist)
- 2 agents = 80-85% thoroughness (some overlap, some gaps filled)
- 3 agents = 90-95% thoroughness (cross-validation catches most issues)
- 4 agents = 95-99% thoroughness (comprehensive, multiple perspectives)

---

## 🚀 Orchestration Workflow

### Phase 1: Launch Agents in PARALLEL

**For ISS validation, launch:**
```
Task(subagent_type="exe-onboard", prompt="Review [.iss file] from onboarding perspective...")
Task(subagent_type="exe-build", prompt="Review [.iss file] from build perspective...")
Task(subagent_type="odoo-debugger", prompt="Review [.iss file] for common error patterns...")
```

**Critical:** Launch in SINGLE message (parallel execution, not sequential)

### Phase 2: Each Agent Writes to Centralized Report

**Report Location:** `C:\Working With AI\ai_sam\ai_sam\ai_sam_docs\reports\pre_iss_run_evaluation.md`

**Each agent appends their section:**
```markdown
## 🔍 [AGENT NAME] Findings

**Perspective:** [What lens they reviewed from]
**Findings:**
- ✅ GOOD: [What's working]
- ⚠️ RISKY: [What's concerning but not blocking]
- ❌ BLOCKING: [What prevents build/install]

**Recommendation:** GO / NO-GO / INVESTIGATE
**Reasoning:** [Why they recommend this]
```

### Phase 3: Synthesis & Consensus Analysis

**After all agents report, exe-approval synthesizes:**

#### A. Consensus Detection
```markdown
### Where Agents AGREE (High Confidence)
1. [Issue/Finding] - Agreed by: [Agent A, Agent B, Agent C]
   - Confidence: HIGH
   - Action: [Clear action based on agreement]
```

#### B. Disagreement Detection
```markdown
### Where Agents DISAGREE (Needs Investigation)
1. [Issue/Finding]
   - exe-onboard says: [opinion + reasoning]
   - exe-build says: [different opinion + reasoning]
   - **Resolution needed:** [What to investigate to resolve]
```

#### C. Blind Spot Detection
```markdown
### Blind Spots Revealed
- exe-onboard missed: [X] (caught by odoo-debugger)
- exe-build missed: [Y] (caught by exe-onboard)
- **Why this matters:** [Validation of multi-agent approach]
```

### Phase 4: Final Verdict

**Decision Tree:**
```
IF all agents say GO AND no critical issues:
  → VERDICT: GO (High confidence)

ELSE IF 2+ agents say NO-GO OR critical issues found:
  → VERDICT: NO-GO (Blockers exist)

ELSE IF agents disagree OR minor issues found:
  → VERDICT: INVESTIGATE (Resolve conflicts first)
```

---

## 📋 Report Template Structure

```markdown
# Pre-ISS Run Evaluation Report
**Generated:** [Timestamp]
**Evaluation Type:** [ISS Validation / PS1 Validation / Full Installer Review]
**Agents Consulted:** [List]

---

## 🚦 FINAL VERDICT: [GO / NO-GO / INVESTIGATE]

**Confidence Level:** [HIGH / MEDIUM / LOW]
- HIGH = All agents agree, no critical issues
- MEDIUM = Minor disagreements, no blockers
- LOW = Major disagreements or critical blockers

**Critical Blockers (Must fix):**
1. [Issue] - Found by: [Agents] - Severity: CRITICAL

**Recommended Actions:**
1. [Action] - Priority: [CRITICAL/HIGH/MEDIUM/LOW]

---

## 🧠 NON-TECH SUMMARY (For Anthony)

**In Plain English:**
[Explain status without jargon]

**What this means:**
[Implications]

**What you should do:**
[Clear next action]

---

## 📊 AGENT FINDINGS (By Perspective)

### [Agent 1 Section]
### [Agent 2 Section]
### [Agent 3 Section]
### [Agent 4 Section]

---

## 🔄 CONSENSUS ANALYSIS

### Where Agents AGREE
### Where Agents DISAGREE
### Blind Spots Revealed

---

## ✅ NEXT STEPS

**If GO:** [Actions]
**If NO-GO:** [Fix steps]
**If INVESTIGATE:** [Investigation needed]
```

---

## 🎯 Agent Selection Rules

### For Different Validation Types

**ISS File Validation:**
- Primary: exe-onboard, exe-build, exe-approval
- Optional: odoo-debugger (if historical bugs relevant)

**PS1 Script Validation:**
- Primary: exe-build, odoo-debugger
- Optional: exe-onboard (if path/structure relevant)

**Full Installer Review:**
- All: exe-onboard, exe-build, exe-approval, odoo-debugger

**Environment Readiness:**
- Primary: exe-approval, exe-session-cleanup
- Optional: odoo-debugger (if past environment issues exist)

---

## 🔍 Validation Thoroughness Checklist

### What Multi-Agent Validation Should Cover

**ISS Logic:**
- ✅ File references exist
- ✅ Paths are correct (absolute vs relative)
- ✅ No duplicate steps
- ✅ Proper execution order
- ✅ All dependencies included
- ✅ No conflicting operations

**PS1 Scripts:**
- ✅ Syntax valid
- ✅ Logic sound
- ✅ File/path references exist
- ✅ Dependencies available
- ✅ Error handling present
- ✅ No anti-patterns

**Environment:**
- ✅ No file locks
- ✅ No running services blocking
- ✅ Proper permissions
- ✅ No remnants from previous installs
- ✅ Required dependencies installed

**Build Readiness:**
- ✅ All source files present
- ✅ Compiler can access files
- ✅ No conflicting versions
- ✅ Output paths writable

---

## ⚠️ Common Disagreement Patterns

### Pattern 1: Severity Disagreement
**Scenario:** One agent says BLOCKING, another says RISKY

**Resolution:**
- Trust the agent with domain expertise (exe-build for build issues)
- Err on side of caution (treat as BLOCKING until proven otherwise)

### Pattern 2: Missing Context
**Scenario:** One agent flags issue, another doesn't see it

**Resolution:**
- Both may be right from their perspective
- Investigate why perspectives differ
- Usually reveals assumption mismatch

### Pattern 3: Historical vs. Current
**Scenario:** Debugger flags old pattern, builder says it's fixed

**Resolution:**
- Verify fix exists
- Update bug history if pattern resolved
- Keep watch for regression

---

## 🎓 Learning from Validation

### After Each Multi-Agent Validation

**Update agent knowledge when:**
1. Blind spot revealed → Add to that agent's checklist
2. Disagreement resolved → Document resolution pattern
3. New issue type found → Add to all relevant checklists
4. False positive detected → Refine detection criteria

**Example:**
```
Issue: exe-onboard flagged "missing file X"
Reality: File X is generated during build (not pre-existing)
Learning: Update exe-onboard to know "files generated during build"
```

---

## 📈 Success Metrics

**Multi-agent validation succeeds when:**
- ✅ User gets ONE clear report (not multiple conflicting responses)
- ✅ Confidence level matches reality (HIGH = actually ready)
- ✅ Blind spots are revealed and caught
- ✅ Disagreements surface valid investigation needs
- ✅ Non-tech summary is understandable without context
- ✅ Action items are clear and prioritized

**Multi-agent validation fails when:**
- ❌ All agents agree but still miss critical issue (update checklists)
- ❌ Disagreements are noise (not meaningful)
- ❌ Report is overwhelming (too much detail, no synthesis)
- ❌ User still confused after reading (summary not clear)

---

## 🔧 Continuous Improvement

### Agent Performance Tracking

Track per validation:
- What did each agent catch?
- What did each agent miss?
- Which disagreements were valid?
- Which agent recommendations were correct?

**Use this data to:**
1. Refine agent checklists
2. Adjust agent weighting (trust levels)
3. Add new validation dimensions
4. Remove redundant checks

---

## 🎯 The Meta-Pattern

**This protocol applies beyond ISS validation:**

- Pre-commit validation (code review by multiple agents)
- Pre-deploy validation (production readiness)
- Pre-merge validation (PR review)
- Architecture validation (design review)
- Security validation (vulnerability scan)

**Core principle remains:** Multiple perspectives + centralized synthesis = thorough validation

---

**Usage:** exe-approval reads this FIRST to understand orchestration approach

---

## 5. Ps1 Validation Checklist

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

---

## 6. Samai Installer Patterns

# SAM AI Installer-Specific Validation Patterns

**Purpose:** SAM AI installer has unique architecture patterns that require specific validation beyond generic ISS checks.

---

## 🎯 What Makes SAM AI Installer Different

**This is NOT a generic installer. It has:**
1. **Dynamic Module Discovery** - Modules auto-generated by script
2. **4-Path Architecture** - Lean SaaS business model
3. **GitHub Repository Dependencies** - 4 repos must be cloned
4. **Issue History Context** - Past bug fixes must be preserved

---

## 📋 Pre-Compilation Validation Checklist

### Before validating .iss file structure:

**Step 1: Verify Dynamic Module Discovery**
```bash
# Check if discover_modules.ps1 has been run
File: D:\SAMAI-18-SaaS\github-repos\100-samai-desktop-installer\scripts\temp_modules.iss

✅ File exists?
✅ File modified in last 24 hours?
✅ File contains valid [Files] entries?
✅ File references paths in 04-samai-brain and 05-samai-core?
```

**Why:** Line 149 of odoo_samai_installer.iss uses `#include "..\scripts\temp_modules.iss"` - if this file is missing or stale, installer will fail at compilation.

---

**Step 2: Verify GitHub Repository Dependencies**
```bash
# Check all source repos are cloned
Repos required at: D:\SAMAI-18-SaaS\github-repos\

✅ 00-odoo-core-15-modules\ (21 core Odoo modules)
✅ 01-samai-odoo-18-lightweight-core\ (641 app placeholders)
✅ 04-samai-brain\ (SAM AI data layer)
✅ 05-samai-core\ (SAM AI framework)
✅ 100-samai-desktop-installer\ (installer scripts)
```

**Why:** Lines 124, 134, and dynamic include reference these repos. If missing, compilation fails with "Source file not found."

---

**Step 3: Verify 4-Path Architecture**

**The SAM AI Business Model:**
```
{app}\addons\samai_core\          → Pre-packaged production modules (bundled)
{app}\server\odoo\addons\         → Core Odoo modules (15 base + 6 HR = 21 total)
{app}\server\odoo_extras\         → Free community addons (empty at install)
{app}\addons\member_addons\       → Premium addons (empty at install)
{app}\catalogs\lightweight-core\  → App catalog (641 placeholders - NOT in addons_path!)
```

**Validation:**
```ini
✅ Line 124: Odoo core modules → {app}\server\odoo\addons (FLAT structure, NOT nested)
✅ Line 134: Placeholders → {app}\catalogs\lightweight-core (Issue #10 fix - NOT in addons!)
✅ Line 149: SAM AI modules → {app}\addons\samai_core\ (via temp_modules.iss)
✅ Lines 155-156: Empty folders created for odoo_extras and member_addons
```

**Common Regression:**
- ❌ Placeholders in `{app}\addons\` instead of `{app}\catalogs\` (reverts Issue #10 fix)
- ❌ Nested structure `{app}\addons\samai_core\ai_brain\` instead of FLAT
- ❌ Missing empty folder creation for odoo_extras or member_addons

---

**Step 4: Verify Issue History Fixes Are Preserved**

**Critical fixes in comments - check they're still applied:**

**Issue #10 (Line 128-133):**
```ini
; FIXED 2025-11-12: Moved from addons/lightweight-core to catalogs/lightweight-core
; This resolves Issue #10 (Odoo scanning placeholders and logging warnings)
```
**Validation:** Placeholders must be in `catalogs/` NOT `addons/`

---

**Step 5: Validate ALL PowerShell Scripts (MANDATORY)**

**SAM AI Installer uses 31 PowerShell scripts across [Files], [Run], and [UninstallRun] sections.**

**Location:** `D:\SAMAI-18-SaaS\github-repos\100-samai-desktop-installer\scripts\`

**Critical Scripts (MUST validate these):**
```powershell
# Installation Phase
1. discover_modules.ps1         - Generates temp_modules.iss dynamically
2. smart_detection.ps1          - Pre-install environment detection
3. convert_to_lightweight.ps1   - Legacy conversion wizard
4. post_install.ps1             - PostgreSQL + Odoo configuration (CRITICAL)
5. configure_odoo.ps1           - Database initialization (CRITICAL)
6. install_odoo_dependencies.ps1 - Python dependencies (3-layer validation)
7. validate_python_bundle.ps1   - Verify bundled Python completeness
8. auto_repair_dependencies.ps1 - Dependency auto-fix
9. register_service.ps1         - Windows service registration (CRITICAL)
10. auto_login.py               - Browser auto-launch (Python, not PS1)
11. close_cmds.ps1              - Window cleanup

# Uninstallation Phase
12. unregister_service.ps1      - Service cleanup (CRITICAL)
13. cleanup_before_uninstall.ps1 - File lock release (CRITICAL)
14. stop_odoo.ps1               - Graceful shutdown

# Runtime Scripts (installed to {app}\scripts or {app}\sam\scripts)
15-31. Additional operational scripts (start_odoo.bat, stop_odoo.bat, etc.)
```

**Validation Checklist (per script):**
```
For EACH script:
[ ] Syntax valid (PowerShell -File script.ps1 -Syntax parses without error)
[ ] No hardcoded paths (C:\Users\Anthony\, C:\Build\, etc.)
[ ] Error handling present (try/catch for critical operations)
[ ] Variables initialized before use
[ ] Admin elevation appropriate (when writing to Program Files or HKLM)
[ ] Dependencies available (psql.exe, python.exe paths correct)
[ ] Parameters validated (if script accepts -InstallDir, validate it's not empty)
[ ] Exit codes correct (0 = success, non-zero = failure)
```

**Critical Script Validation (Deep Dive):**

**1. post_install.ps1 (Lines 261-263 in .iss):**
```powershell
# What it does: Configure PostgreSQL, create database, create user
# Validation focus:
✅ PostgreSQL paths correct ({app}\postgresql\bin\psql.exe)
✅ Password secure (not hardcoded "password")
✅ Database creation error handling (what if database already exists?)
✅ User creation error handling (what if user already exists?)
✅ Parameters passed correctly (DatabaseName, OdooPort, etc.)
```

**2. configure_odoo.ps1 (Lines 279-281 in .iss):**
```powershell
# What it does: Initialize Odoo database with modules
# Validation focus:
✅ odoo-bin path correct ({app}\python\python.exe {app}\server\odoo-bin)
✅ Database connection string correct
✅ Module initialization logic (which modules auto-installed?)
✅ Error handling (what if database init fails?)
✅ Timeout handling (database init can take 5-10 minutes)
```

**3. register_service.ps1 (Lines 286-291 in .iss):**
```powershell
# What it does: Register Odoo as Windows service
# Validation focus:
✅ Service name unique (not conflicting with existing services)
✅ Service executable path correct
✅ Service startup type appropriate (Manual vs Automatic)
✅ Service recovery actions defined
✅ Admin elevation check (service registration requires admin)
✅ Error handling (what if service already exists?)
```

**4. cleanup_before_uninstall.ps1 (Line 319-320 in .iss):**
```powershell
# What it does: Stop processes, release file locks before uninstall
# Validation focus:
✅ Process kill logic (graceful stop before force kill?)
✅ Service stop logic (unregister before file deletion?)
✅ File handle release (Windows Explorer, antivirus exclusions)
✅ Timeout handling (what if process won't stop?)
✅ Error handling (continue uninstall even if cleanup fails?)
```

**Common PowerShell Anti-Patterns to Catch:**

```powershell
❌ Hardcoded paths:
    $pgPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
✅ Correct:
    $pgPath = "$InstallDir\postgresql\bin\psql.exe"

❌ No error handling:
    & $pgPath -U postgres -c "CREATE DATABASE sam_ai"
✅ Correct:
    try {
        & $pgPath -U postgres -c "CREATE DATABASE sam_ai" 2>&1
        if ($LASTEXITCODE -ne 0) { throw "Database creation failed" }
    } catch {
        Write-Error "Failed to create database: $_"
        exit 1
    }

❌ Uninitialized variables:
    if ($UseExistingDB -eq $true) { ... }
✅ Correct:
    $UseExistingDB = $false  # Initialize first
    if ($UseExistingDB -eq $true) { ... }

❌ Missing admin check:
    Set-Service -Name "OdooService" -StartupType Automatic
✅ Correct:
    if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Error "This script requires administrator privileges"
        exit 1
    }
```

**If ANY critical script fails validation → NO-GO (even if ISS file is perfect)**

---

**Issue #11 (Line 118-121):**
```ini
; FIXED 2025-11-12 (Issue #11 Bloat Fix): Reverted to 00-odoo-core-15-modules with 6 new HR modules
; Original 15: auth_signup, base, base_setup, bus, digest, html_editor, http_routing, mail, onboarding, portal, resource, uom, web, web_editor, web_tour
; Added 6 HR modules: hr, hr_work_entry, hr_contract, hr_work_entry_contract, phone_validation, resource_mail
```
**Validation:** Only 21 core modules (not 637). Check line 124 source path = `00-odoo-core-15-modules`

---

**Issue #28 (Line 314-316):**
```ini
; Step 0.5: Drop PostgreSQL database (FIX Issue #28 - 2025-11-15)
; Prevents database orphans that cause installer hangs on reinstall (Issue #27)
```
**Validation:** [UninstallRun] section includes dropdb command

---

## 🚨 SAM AI-Specific Validation Questions

**Beyond the generic ISS checklist, ask:**

### 1. Dynamic Module Discovery
- ❓ Has `discover_modules.ps1` been run since last module change?
- ❓ Does `temp_modules.iss` exist and contain valid paths?
- ❓ Do ALL modules in `temp_modules.iss` actually exist on disk?
- ❓ Are paths correctly structured for 4-path architecture?

### 2. GitHub Repository Dependencies
- ❓ Are ALL 4 source repos cloned to `D:\SAMAI-18-SaaS\github-repos\`?
- ❓ Are repo paths in .iss file correct (no typos)?
- ❓ Have repos been pulled recently (no stale code)?

### 3. 4-Path Architecture
- ❓ Is FLAT structure preserved? (modules at `{app}\addons\samai_core\MODULE`, NOT nested)
- ❓ Are placeholders in `catalogs/` NOT `addons/`? (Issue #10)
- ❓ Are empty folders created for `odoo_extras` and `member_addons`?
- ❓ Is core Odoo in `server\odoo\addons` with FLAT structure?

### 4. Issue History Preservation
- ❓ Is Issue #10 fix intact? (placeholders in catalogs/)
- ❓ Is Issue #11 fix intact? (21 core modules, not 637)
- ❓ Is Issue #28 fix intact? (dropdb in UninstallRun)
- ❓ Are new changes reverting any past bug fixes?

### 5. Script Execution Order
- ❓ Does `discover_modules.ps1` run BEFORE Inno Setup compilation?
- ❓ Does `post_install.ps1` configure PostgreSQL BEFORE Odoo init?
- ❓ Does `configure_odoo.ps1` run AFTER PostgreSQL setup?
- ❓ Does service registration run AFTER database setup? (Issue #34)

---

## ✅ SAM AI Installer Sign-Off Criteria

**Before GO decision, verify ALL of:**

**Pre-Compilation:**
- ✅ `discover_modules.ps1` has been run (temp_modules.iss exists and is recent)
- ✅ All 4 GitHub repos cloned and up-to-date
- ✅ temp_modules.iss contains valid paths to actual module files

**Architecture:**
- ✅ 4-path architecture intact (samai_core, odoo\addons, odoo_extras, member_addons, catalogs)
- ✅ FLAT structure preserved (no nested subdirectories)
- ✅ Placeholders in catalogs/ NOT addons/ (Issue #10)

**Issue History:**
- ✅ Only 21 core Odoo modules (Issue #11 fix preserved)
- ✅ Database drop in UninstallRun (Issue #28 fix preserved)
- ✅ No regressions to past bug fixes

**Generic ISS:**
- ✅ All generic ISS validation checks pass (from iss_validation_checklist.md)

---

## 🔍 Mental Execution Walkthrough (SAM AI Specific)

**Simulate installer running with SAM AI context:**

### Compilation Phase
1. Inno Setup reads odoo_samai_installer.iss
2. Line 149: `#include "..\scripts\temp_modules.iss"`
   - ❓ Does temp_modules.iss exist?
   - ❓ Is it valid ISS syntax?
   - ❓ Do ALL paths in it exist?
3. Lines 124, 134: Source paths to GitHub repos
   - ❓ Do repos exist at D:\SAMAI-18-SaaS\github-repos\?
   - ❓ Can Inno Setup read those directories?

### Installation Phase (Runtime)
1. Files copied to {app}\
   - ❓ Does 4-path architecture get created correctly?
   - ❓ Are modules in correct locations (samai_core vs odoo\addons vs catalogs)?
2. Scripts run in [Run] section
   - ❓ Does discover_modules.ps1 output match what installer expects?
   - ❓ Do post_install.ps1 and configure_odoo.ps1 reference correct paths?

### Uninstallation Phase
1. [UninstallRun] executes
   - ❓ Does database drop succeed? (Issue #28 fix)
   - ❓ Are services stopped before file deletion?
   - ❓ Are file locks released before folder deletion?

---

## 🎯 Quick Reference: SAM AI Validation Checklist

**Before saying GO, check:**
```
Pre-Compilation:
[ ] discover_modules.ps1 run recently
[ ] temp_modules.iss exists and valid
[ ] 4 GitHub repos cloned

Architecture:
[ ] 4-path structure correct
[ ] FLAT module structure (not nested)
[ ] Placeholders in catalogs/ (Issue #10)

Issue History:
[ ] 21 core modules only (Issue #11)
[ ] Database drop in uninstall (Issue #28)
[ ] No regressions to past fixes

Generic ISS:
[ ] All source files exist
[ ] All paths correct
[ ] Execution order logical
[ ] Cross-references valid
```

**If ANY box unchecked → NO-GO**

---

## 🚫 Common SAM AI Installer Mistakes

### Mistake 1: Stale temp_modules.iss
**Symptom:** Added new module to 04-samai-brain, but not in installer
**Cause:** Forgot to run discover_modules.ps1 before compilation
**Fix:** Run `discover_modules.ps1`, verify temp_modules.iss updated

### Mistake 2: Missing GitHub Repo
**Symptom:** Compilation fails with "Source file not found"
**Cause:** One of 4 GitHub repos not cloned to D:\SAMAI-18-SaaS\github-repos\
**Fix:** Clone missing repo, verify path matches .iss file

### Mistake 3: Placeholders in addons/ (Issue #10 Regression)
**Symptom:** Odoo logs 641 warnings about invalid modules
**Cause:** Changed line 134 DestDir from `catalogs/` to `addons/`
**Fix:** Revert to `{app}\catalogs\lightweight-core` (NOT addons)

### Mistake 4: Bloated Core Modules (Issue #11 Regression)
**Symptom:** Installer size jumps from 200MB to 800MB
**Cause:** Changed line 124 source from `00-odoo-core-15-modules` to full Odoo addons
**Fix:** Revert to `00-odoo-core-15-modules` (21 modules only)

### Mistake 5: Database Not Dropped on Uninstall (Issue #28 Regression)
**Symptom:** Reinstall hangs at "Initializing database"
**Cause:** Removed dropdb command from [UninstallRun]
**Fix:** Restore line 314-316 database drop command

---

## 📝 Integration with Generic ISS Validation

**This file SUPPLEMENTS iss_validation_checklist.md:**

1. First, run **generic ISS validation** (iss_validation_checklist.md)
   - Verify all source files exist
   - Check paths are correct
   - Validate execution order
   - Check cross-references

2. Then, run **SAM AI-specific validation** (this file)
   - Verify dynamic module discovery
   - Check 4-path architecture
   - Validate GitHub repo dependencies
   - Preserve issue history fixes

**Both must pass for GO decision.**

---

**Usage:** exe-iss-research uses this checklist when validating `odoo_samai_installer.iss` specifically.

---

*End of Knowledge Base*
