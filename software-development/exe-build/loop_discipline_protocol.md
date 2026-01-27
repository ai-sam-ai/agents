# Loop Discipline Protocol - The 7-Phase Systematic Workflow

**Purpose:** Enforce systematic approach to prevent file chaos, incomplete diagnostics, and scattered state

---

## 🚫 FILE LOCATION RULES (CRITICAL - CHECK BEFORE EVERY WRITE)

### ✅ ALLOWED Write Locations:
- `${INSTALLER_ROOT}\dev_files\`
- `${INSTALLER_ROOT}\dev_session_reports\`
- `${INSTALLER_ROOT}\dev_files\_archive\`
- `${INSTALLER_ROOT}\logs\`

### ❌ FORBIDDEN Write Locations (NO-GO ZONE):
- **C:\Users\total\** and ALL subdirectories
- User Desktop, Documents, Downloads

### 📖 READ-ONLY Locations:
- `C:\Users\total\.claude\agents\` (read knowledge only)
- `C:\Users\total\.claude\file-history\` (search history only)

**Validation Check (BEFORE every Write/Edit):**
```powershell
if ($filepath -like "C:\Users\total*") {
    ABORT - Report error to user
}
```

---

## 📋 THE 7-PHASE LOOP (Continuous Iteration)

```
Phase 0: CLEANUP FIRST (Run once per session if needed)
   ↓
Phase 1: REVIEW CURRENT STATE
   ↓
Phase 2: DOCUMENT CURRENT STATE
   ↓
Phase 3: MULTI-PASS DIAGNOSIS (Find ALL problems)
   ↓
Phase 4: CONSOLIDATED FINDINGS REPORT
   ↓
Phase 5: USER REVIEW & APPROVAL
   ↓
Phase 6: UPDATE USING CURRENT TOOLS/FILES
   ↓
Phase 7: UPDATE STATE & LOOP BACK
   ↓
(Return to Phase 1 for next iteration)
```

---

## Phase 0: CLEANUP FIRST (MANDATORY - First Session Only)

### Goal: Turn 144-file chaos into clean, manageable structure

### Trigger:
- File count in `dev_files/` > 50
- Multiple duplicate scripts detected
- Multiple "COMPLETE/SUMMARY" docs found

### Substeps:

#### 0.1: Scan dev_files/ Folder
```bash
# Count total files
find "${INSTALLER_ROOT}\dev_files" -type f | wc -l

# Identify duplicates
ls -1 dev_files/*.ps1 | grep -iE "build_python"
ls -1 dev_files/*.bat | grep -iE "(start|stop)"

# Find history docs
ls -1 dev_files/*.md | grep -iE "(complete|summary|final|progress)"
```

**Report to user:**
- Total files: [count]
- Duplicate scripts: [list]
- History docs to consolidate: [count]
- Estimated files after cleanup: [target]

#### 0.2: Consolidate History Documents
**Current:** 14+ scattered completion/summary docs
**Target:** 1 BUILD_HISTORY.md

**Process:**
1. Read all *COMPLETE*.md, *SUMMARY*.md, *FINAL*.md files
2. Extract chronological timeline (date-sorted)
3. Merge into: `D:\...\dev_session_reports\BUILD_HISTORY.md`
4. Move originals to: `dev_files\_archive\history\`

**BUILD_HISTORY.md structure:**
```markdown
# SAM AI Installer - Build History

## 2025-11-11: Service Registration Fix
**Source:** SERVICE_REGISTRATION_FIX_2025-11-11.md
**Problem:** Windows service not registering correctly
**Solution:** [Extract key points]
**Result:** ✅ Success / ❌ Failed / ⚠️ Partial

## 2025-11-11: CSRF Error Root Cause
**Source:** CSRF_ERROR_ROOT_CAUSE_ANALYSIS_2025-11-11.md
**Problem:** CSRF validation failing on installer
**Solution:** [Extract key points]
**Result:** ✅ Resolved

[...continue chronologically from oldest to newest...]
```

#### 0.3: Deduplicate Scripts
**Identified duplicates to resolve:**

**Python Build Scripts (3 → 1):**
- `build_python_bundle.ps1` (original)
- `build_python_bundle_fixed.ps1` (iteration)
- `build_python_bundle_production.ps1` (latest?)

**Action:**
1. Compare file dates (newest likely best)
2. Compare file sizes/content (which has most features?)
3. Keep latest: Rename to `build_python_bundle.ps1`
4. Archive others: Move to `_archive/scripts/`

**Start/Stop Scripts (5 → 3):**
- `start_odoo.bat` + `start-odoo.bat` → Keep `start_odoo.bat`
- `stop_odoo.bat` + `stop-odoo.bat` → Keep `stop_odoo.bat`
- `restart_odoo.bat` → Keep (unique function)

**Action:**
1. Compare content (likely identical with different naming)
2. Keep underscore versions (consistent naming)
3. Archive hyphen versions

**Module Analysis Scripts (3 → ? Ask user):**
- `analyze_modules.ps1`
- `analyze_server_modules.ps1`
- `analyze_d_drive_modules.ps1`

**Action:**
1. Read each script's purpose
2. Ask user: "Are these different use cases or can they merge?"
3. If different → Keep all, update names for clarity
4. If redundant → Keep most comprehensive, archive others

#### 0.4: Archive Obsolete Files
**Candidates for `_archive/`:**

**Logs (move to _archive/logs/):**
- `build_output.log` (15.7 MB!)
- All `*_log_*.txt` files (GitHub transition logs)

**CSV Reports (move to _archive/reports/):**
- `duplicate_modules_report.csv`
- `full_modules_report.csv`
- `lightweight_core_full_modules.csv`
- [etc... unless actively referenced in current tools]

**Old READMEs (move to _archive/docs/):**
- Keep: `README.md` (main)
- Archive: `README.txt`, `README_BUILD_INSTALLER.md`, `README_GITHUB_SETUP.md`

**Obsolete Configs (ask user first):**
- Old `.iss` files if superseded
- Old `.py` scripts if superseded

**Mystery Files:**
- `nul` (empty file? Delete?)

#### 0.5: Create CURRENT_STATE.md
**Location:** `${INSTALLER_ROOT}\dev_session_reports\CURRENT_STATE.md`

**Initial content (see central_state_management.md for full structure):**
```markdown
# SAM AI Installer - Current State

**Last Updated:** [timestamp]
**Session:** exe-build-001
**Status:** Cleanup Phase Complete

---

## 🎯 Current Objective
Establish clean baseline after consolidating 144 files

---

## 📊 Known Problems (Consolidated)
[Initially empty - Phase 3 will populate]

---

## 🗂️ Current Files & Tools (Inventory)

### Active Scripts (DO NOT DUPLICATE)
- build_python_bundle.ps1 - Bundles Python for installer
- build_installer_final.ps1 - Compiles installer.exe (Inno Setup)
- start_odoo.bat - Starts Odoo service
- stop_odoo.bat - Stops Odoo service
- restart_odoo.bat - Restarts Odoo service
[...list all ACTIVE scripts only...]

### Active Documentation (MAINTAINED)
- CURRENT_STATE.md - THIS FILE (single source of truth)
- BUILD_HISTORY.md - Consolidated timeline
- 00_MASTER_KNOWLEDGE_BASE.md - Domain knowledge
- 01_TOOLS_AND_SCRIPTS_LIBRARY.md - Tool reference

### Active Configs
- odoo_samai_installer.iss - Main Inno Setup script
- build.py - Build automation (if active)
- requirements.txt - Python dependencies

### Archived (Historical Reference)
- _archive/history/ - 14 history docs consolidated
- _archive/scripts/ - Duplicate/obsolete scripts
- _archive/logs/ - Old build logs
- _archive/reports/ - CSV analysis reports

---

## 🔄 Last Loop Iteration
[Will be updated after Phase 7]

---

## 🚫 DO NOT CREATE (Without Permission)
- ❌ NEW diagnostic scripts (use existing or ask)
- ❌ NEW config files (update existing)
- ❌ NEW state documents (update CURRENT_STATE.md)
- ❌ NEW history docs (append to BUILD_HISTORY.md)
```

#### 0.6: Update 01_TOOLS_AND_SCRIPTS_LIBRARY.md
**Existing file:** `D:\...\dev_files\01_TOOLS_AND_SCRIPTS_LIBRARY.md`

**Actions:**
1. Read current content
2. Remove references to archived scripts
3. Add "[ARCHIVED]" tags for moved scripts
4. Update descriptions for active scripts only
5. Add "Last Updated: [date]" header

#### 0.7: Report Cleanup Results
**Show user comprehensive summary:**

```markdown
🧹 CLEANUP COMPLETE

**Before:**
- Total files: 144
- History docs: 14
- Duplicate scripts: 8
- Massive logs: 1 (15.7 MB)

**After:**
- Active files: ~18-22 (manageable!)
- History docs: 1 (BUILD_HISTORY.md)
- Active scripts: [count] (deduplicated)
- Archived files: 120+ (preserved in _archive/)

**Created:**
- ✅ CURRENT_STATE.md (central source of truth)
- ✅ BUILD_HISTORY.md (consolidated timeline)
- ✅ _archive/ folder structure

**Next:**
- Ready to proceed to Phase 1 (Review Current State)
- Future sessions start clean (not chaotic)
```

**Ask user:**
- "Cleanup satisfactory? Any scripts marked for archive that should stay active?"
- "Ready to proceed to diagnostic phases?"

---

## Phase 1: REVIEW CURRENT STATE

### Goal: Understand what exists BEFORE making changes

### Actions:

#### 1.1: Read CURRENT_STATE.md
**Location:** `D:\...\dev_session_reports\CURRENT_STATE.md`

**Extract:**
- Current objective
- Known problems (from previous session)
- Active tools inventory
- Last loop iteration results

#### 1.2: Read BUILD_HISTORY.md
**Location:** `D:\...\dev_session_reports\BUILD_HISTORY.md`

**Extract:**
- What has been tried before?
- What worked? What failed?
- Patterns in failures (recurring issues?)

#### 1.3: Scan Active Tools
**Location:** `D:\...\dev_files\`

**Check:**
- Are tools listed in CURRENT_STATE.md still present?
- Are there new files since last session?
- File dates (what changed recently?)

#### 1.4: Check for Test Installation
**Commands:**
```powershell
# Is SAM AI currently installed?
Test-Path "C:\Program Files\SAM AI"

# Is Odoo service running?
Get-Service -Name "OdooService*" -ErrorAction SilentlyContinue

# Is previous installer.exe present?
Test-Path "D:\...\100-samai-desktop-installer\Output\installer.exe"
```

**Why:** Need to know if uninstall required before recompile (Phase 0 of lifecycle)

---

## Phase 2: DOCUMENT CURRENT STATE

### Goal: Update CURRENT_STATE.md with fresh observations

### Actions:

#### 2.1: Update "Last Updated" Timestamp
```markdown
**Last Updated:** 2025-11-12 14:35:00
**Session:** exe-build-002
```

#### 2.2: Update Current Objective
**If user provided goal:**
```markdown
## 🎯 Current Objective
Fix compiler error: PostgreSQL path detection failing in installer
```

**If no specific goal:**
```markdown
## 🎯 Current Objective
Multi-pass diagnostic to identify ALL current build issues
```

#### 2.3: Update Tools Inventory (If Changed)
**Add new files (if any):**
- Note: Should be RARE (cleanup discipline)
- If new file found → Ask: "Is this needed or can we archive?"

#### 2.4: Update Installation Status
```markdown
## 🔄 Installation Lifecycle Status

**Test Installation:** Installed (requires uninstall before recompile)
**Location:** C:\Program Files\SAM AI
**Services:** OdooService (Running)
**Next Action:** Uninstall before diagnostic compilation
```

---

## Phase 3: MULTI-PASS DIAGNOSIS (Find ALL Problems)

### Goal: Systematic audit to find EVERY issue, not just first problem

**See: multi_pass_diagnostic_system.md for full 5-pass protocol**

### Quick Summary:
- ✅ Pass 1: Dependencies (Python, PostgreSQL, Odoo versions/paths)
- ✅ Pass 2: File Structure (what's missing, misplaced, outdated)
- ✅ Pass 3: Compiler Config (PyInstaller/Inno Setup issues)
- ✅ Pass 4: Build Errors (compile and capture ALL errors)
- ✅ Pass 5: Runtime Validation (does installer.exe work?)

**Critical Rule:** NEVER stop at first problem. Complete all 5 passes.

---

## Phase 4: CONSOLIDATED FINDINGS REPORT

### Goal: Present ALL findings in ONE organized report

### Structure:

```markdown
## 📊 Diagnostic Findings - [Date]

**Total Issues Found:** [count]
**Passes Completed:** 5/5 ✅

---

### CRITICAL (Blocking build entirely)
1. **PostgreSQL path not detected**
   - Pass: 3 (Compiler Config)
   - Location: installer.iss line 142
   - Impact: Installer won't compile
   - Fix: [specific solution]

### HIGH (Build succeeds but installer broken)
2. **Missing Odoo dependencies in bundle**
   - Pass: 2 (File Structure)
   - Location: addons/ folder incomplete
   - Impact: Installer installs but Odoo won't start
   - Fix: [specific solution]

### MEDIUM (Needs improvement)
3. **Uninstaller doesn't remove registry keys**
   - Pass: 5 (Runtime Validation)
   - Impact: Reinstall may fail
   - Fix: [specific solution]

### LOW (Nice to have)
4. **Branding logo resolution low**
   - Pass: 5 (Runtime Validation)
   - Impact: Visual quality
   - Fix: [specific solution]
```

### Write Report To:
`D:\...\dev_session_reports\diagnostic_YYYYMMDD_HHMMSS.md`

**Also update CURRENT_STATE.md "Known Problems" section**

---

## Phase 5: USER REVIEW & APPROVAL

### Goal: User decides priority and approach

### Actions:

#### 5.1: Present Findings
Show consolidated report (Phase 4 output)

#### 5.2: Ask User:
- "Which issues should I tackle first?"
- "Should I fix CRITICAL only, or continue through HIGH/MEDIUM?"
- "Any issues that are NOT actually problems (false positives)?"

#### 5.3: Create Action Plan
**Based on user input:**
```markdown
## 🎯 Action Plan (Approved by User)

**Priority 1:** Fix CRITICAL issue #1 (PostgreSQL path)
**Priority 2:** Fix HIGH issue #2 (Missing dependencies)
**Priority 3:** [User decides - may defer MEDIUM/LOW]

**Estimated time:** 30-45 minutes
**Proceed? (y/n)**
```

---

## Phase 6: UPDATE USING CURRENT TOOLS/FILES

### Goal: Fix problems WITHOUT creating file chaos

### Rules (NON-NEGOTIABLE):

#### 6.1: BEFORE Fixing - Check Existing Tools
```bash
# Find if solution already exists
grep -r "PostgreSQL" "D:\...\dev_files"
grep -r "install" "D:\...\dev_files" | grep -i "postgres"
```

**Question:** Is there already a script for this? Can I enhance it instead of creating new?

#### 6.2: Prefer Edit Over Write
```powershell
# GOOD: Update existing file
Edit installer.iss (update PostgreSQL path detection)

# BAD: Create new file
Write installer_fixed.iss (duplicate!)
```

#### 6.3: Ask Permission for New Files
**Only create new file if:**
- No existing file can be adapted
- User explicitly approves
- Document in CURRENT_STATE.md immediately

#### 6.4: Track Changes
**For every change:**
- What file modified?
- What changed (before/after)?
- Why changed (which problem does it fix)?
- Result (did it work)?

**Log in:** CURRENT_STATE.md "Last Loop Iteration" section

---

## Phase 7: UPDATE STATE & LOOP BACK

### Goal: Document results, validate, prepare for next iteration

### Actions:

#### 7.1: Update CURRENT_STATE.md
**"Last Loop Iteration" section:**
```markdown
## 🔄 Last Loop Iteration

**Session:** 2025-11-12 14:35
**Changes Made:**
1. Updated installer.iss line 142 (PostgreSQL path detection)
2. Added missing Odoo addons to bundle (5 modules)
3. Enhanced uninstaller script (registry cleanup)

**Problems Fixed:**
- ✅ CRITICAL #1: PostgreSQL path detection
- ✅ HIGH #2: Missing dependencies
- ⚠️ MEDIUM #3: Uninstaller (partial fix)

**Problems Remaining:**
- MEDIUM #3: Registry cleanup needs testing
- LOW #4: Logo resolution (deferred)

**Next Action:**
- Recompile installer.exe
- Test installation
- Validate fixes (did CRITICAL #1 actually resolve?)
```

#### 7.2: Validate Changes Worked
```powershell
# Attempt compilation
.\build_installer_final.ps1

# Check for new errors
if ($LASTEXITCODE -ne 0) {
    Write "Compilation failed - loop back to Phase 3"
} else {
    Write "Compilation succeeded - proceed to testing"
}
```

#### 7.3: Decide Next Loop Action
**Options:**
- **A) Loop to Phase 1:** If fixes created new issues (re-diagnose)
- **B) Loop to Phase 3:** If fixes incomplete (re-run diagnostics)
- **C) Continue to Testing:** If compilation succeeded (Phase 6 of lifecycle)
- **D) User Review:** If major milestone reached (show progress)

#### 7.4: Update CURRENT_STATE.md Status
```markdown
**Status:** Compilation Successful - Ready for Testing
```

---

## 🔄 LOOP CONTINUATION

**After Phase 7, return to Phase 1 for next iteration:**

```
Phase 7 complete
   ↓
Phase 1: Review updated state (what changed?)
   ↓
Phase 2: Document new objective (test installation?)
   ↓
Phase 3: Diagnose (did fixes work?)
   ↓
[...continue cycle until installer.exe fully working...]
```

---

## 🎯 Success Criteria - When to Stop Looping

**Loop is complete when:**
- ✅ All CRITICAL issues resolved
- ✅ All HIGH issues resolved (or user deferred)
- ✅ Installer.exe compiles successfully
- ✅ Test installation succeeds
- ✅ SAM AI starts and is accessible
- ✅ Uninstaller works cleanly
- ✅ User satisfied with result

**Then:** Update CURRENT_STATE.md status to "COMPLETE" and create final summary

---

## 📋 Quick Reference - Phase Checklist

```
[ ] Phase 0: Cleanup (first session only)
    [ ] Scan dev_files (144 → ~20 files)
    [ ] Consolidate history docs (14 → 1)
    [ ] Deduplicate scripts (8 → 3)
    [ ] Archive obsolete (120+ files)
    [ ] Create CURRENT_STATE.md
    [ ] Create BUILD_HISTORY.md

[ ] Phase 1: Review Current State
    [ ] Read CURRENT_STATE.md
    [ ] Read BUILD_HISTORY.md
    [ ] Scan active tools
    [ ] Check test installation status

[ ] Phase 2: Document Current State
    [ ] Update timestamp
    [ ] Update objective
    [ ] Update inventory (if changed)
    [ ] Update installation status

[ ] Phase 3: Multi-Pass Diagnosis
    [ ] Pass 1: Dependencies
    [ ] Pass 2: File Structure
    [ ] Pass 3: Compiler Config
    [ ] Pass 4: Build Errors
    [ ] Pass 5: Runtime Validation

[ ] Phase 4: Consolidated Report
    [ ] Categorize: CRITICAL/HIGH/MEDIUM/LOW
    [ ] Write diagnostic report
    [ ] Update CURRENT_STATE.md problems

[ ] Phase 5: User Review
    [ ] Present findings
    [ ] Get priority guidance
    [ ] Create action plan
    [ ] Get approval to proceed

[ ] Phase 6: Update Existing Tools
    [ ] Check for existing solutions FIRST
    [ ] Prefer Edit over Write
    [ ] Ask permission for new files
    [ ] Track all changes

[ ] Phase 7: Update State & Loop
    [ ] Document changes made
    [ ] Validate fixes worked
    [ ] Decide next loop action
    [ ] Update CURRENT_STATE.md status
```

---

**End of Loop Discipline Protocol**
