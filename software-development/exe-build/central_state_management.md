# Central State Management - Single Source of Truth

**Purpose:** Maintain ONE authoritative document tracking installer state, eliminating scattered information

---

## 📍 File Locations (STRICT RULES)

### CURRENT_STATE.md Location:
```
${INSTALLER_CURRENT_STATE}
```

### BUILD_HISTORY.md Location:
```
${INSTALLER_DEV_REPORTS}\BUILD_HISTORY.md
```

### Session Reports:
```
${INSTALLER_DEV_REPORTS}\
  ├─ CURRENT_STATE.md (single source of truth - always current)
  ├─ BUILD_HISTORY.md (consolidated timeline - append only)
  └─ diagnostic_YYYYMMDD_HHMMSS.md (detailed findings per session)
```

### Working Files (Scripts, Configs):
```
${INSTALLER_DEV_FILES}\
  ├─ 00_MASTER_KNOWLEDGE_BASE.md (domain knowledge)
  ├─ 01_TOOLS_AND_SCRIPTS_LIBRARY.md (tool reference)
  ├─ build_python_bundle.ps1 (active script)
  ├─ build_installer_final.ps1 (active script)
  ├─ odoo_samai_installer.iss (main config)
  └─ [other active tools - minimal count!]
```

### Archive (Historical):
```
${INSTALLER_DEV_FILES}\_archive\
  ├─ history/ (consolidated history docs)
  ├─ scripts/ (obsolete/duplicate scripts)
  ├─ logs/ (old build logs)
  └─ reports/ (CSV analysis reports)
```

### Logs:
```
${INSTALLER_LOGS}\
  ├─ build_output_YYYYMMDD_HHMMSS.log
  └─ install_test_YYYYMMDD_HHMMSS.log
```

---

## ❌ FORBIDDEN LOCATIONS (NEVER WRITE HERE)

**C:\Users\total\** and ALL subdirectories

**Why:** User's home directory is NOT a working folder. All installer work happens in D:\ repo.

**Enforcement:** Agent checks file path before every Write/Edit. If path contains `C:\Users\total`, ABORT and report error.

**Exception (READ-ONLY):**
- `C:\Users\total\.claude\agents\exe-build\` (read own knowledge files)
- `C:\Users\total\.claude\file-history\` (search session history)

---

## 📋 CURRENT_STATE.md Structure (Complete Template)

**Purpose:** THE single source of truth updated every Phase 2 and Phase 7

```markdown
# SAM AI Installer - Current State

**Last Updated:** [ISO timestamp - YYYY-MM-DD HH:MM:SS]
**Session:** exe-build-[number]
**Status:** [In Progress | Blocked | Testing | Complete]

---

## 🔒 STRATEGIC INTENT (LOCKED - HARD KNOWLEDGE)

**PERMANENT DECISIONS - DO NOT QUESTION OR CHANGE!**

[Document any strategic decisions that are LOCKED and should never be revisited]

**Example:**
- **Module Bundling Strategy:** OPTION C - Bundle ALL 8 modules (ai_brain + ai_sam + 6 intelligence suite)
- **Rationale:** Complete desktop experience out-of-box, no post-install module management
- **Date Locked:** 2025-11-12
- **THIS IS LOCKED** - Every agent session must respect this!

[If no locked decisions yet, write: "None yet - will be added as strategic decisions are made"]

---

## 🎯 Current Objective

[Single sentence describing what we're working on RIGHT NOW]

**Example:** "Fix CRITICAL compiler error: PostgreSQL path detection failing in Inno Setup script"

---

## 📊 Known Problems (Consolidated)

### CRITICAL (Blocking build entirely)
- [ ] **Problem 1:** [Short title]
  - **Found in:** Pass [1-5] ([Pass name])
  - **Location:** [file:line or component]
  - **Impact:** [Why this blocks progress]
  - **Root Cause Type:** ROOT CAUSE | SYMPTOM
  - **Dependency Chain:** [None | "Caused by Issue #X" | "Causes Issues #Y, #Z"]
  - **Fix Priority:** Fix this first | Will auto-resolve when #X fixed
  - **Status:** New | In Progress | Testing | Fixed
  - **Fix attempted:** [What we tried]
  - **Result:** [Did it work?]

### HIGH (Build succeeds but installer broken)
- [ ] **Problem 2:** [Short title]
  - **Found in:** Pass [1-5]
  - **Location:** [file:line]
  - **Impact:** [Why this matters]
  - **Root Cause Type:** ROOT CAUSE | SYMPTOM
  - **Dependency Chain:** [None | "Caused by Issue #X" | "Causes Issues #Y, #Z"]
  - **Status:** [status]

### MEDIUM (Needs improvement)
- [ ] **Problem 3:** [Short title]
  - **Found in:** Pass [1-5]
  - **Location:** [file:line]
  - **Impact:** [Why this matters]
  - **Root Cause Type:** ROOT CAUSE | SYMPTOM
  - **Dependency Chain:** [None | "Caused by Issue #X" | "Causes Issues #Y, #Z"]
  - **Status:** [status]

### LOW (Nice to have)
- [ ] **Problem 4:** [Short title]
  - **Found in:** Pass [1-5]
  - **Location:** [file:line]
  - **Impact:** [Why this matters]
  - **Root Cause Type:** ROOT CAUSE | SYMPTOM
  - **Dependency Chain:** [None | "Caused by Issue #X" | "Causes Issues #Y, #Z"]
  - **Status:** [status]

**Problem Summary:**
- Total problems: [count]
- Critical: [count]
- High: [count]
- Medium: [count]
- Low: [count]
- Fixed this session: [count]

---

## 🗂️ Current Files & Tools (Inventory)

### Active Scripts (DO NOT DUPLICATE - Update these, don't create new)

**Build Scripts:**
- `build_python_bundle.ps1` - Bundles Python interpreter + packages for installer
  - Last updated: [date]
  - Purpose: [one-line description]
- `build_installer_final.ps1` - Compiles installer.exe using Inno Setup
  - Last updated: [date]
  - Purpose: [one-line description]

**Service Management:**
- `start_odoo.bat` - Starts Odoo Windows service
- `stop_odoo.bat` - Stops Odoo Windows service
- `restart_odoo.bat` - Restarts Odoo Windows service

**Analysis Tools:**
- `analyze_modules.ps1` - Scans for Odoo module dependencies
  - Purpose: [description]

**Other Active Scripts:**
[List any other scripts currently in use]

### Active Documentation (MAINTAINED)

**Core State Documents:**
- `CURRENT_STATE.md` - THIS FILE (single source of truth)
- `BUILD_HISTORY.md` - Consolidated timeline (append only)

**Knowledge Base:**
- `00_MASTER_KNOWLEDGE_BASE.md` - Domain knowledge (SAM AI architecture, installer patterns)
- `01_TOOLS_AND_SCRIPTS_LIBRARY.md` - Tool reference (how to use each script)

**Guides:**
[List any active guide documents that are still relevant]

### Active Configs (Update, don't duplicate)

- `odoo_samai_installer.iss` - Main Inno Setup script (installer compiler config)
  - Last updated: [date]
  - Version: [version]
- `build.py` - Python build automation script
- `requirements.txt` - Python package dependencies for SAM AI

### Archived (Historical Reference - DO NOT USE)

- `_archive/history/` - 14+ history docs consolidated into BUILD_HISTORY.md
- `_archive/scripts/` - Duplicate/obsolete script versions
- `_archive/logs/` - Old build logs (build_output.log 15MB+)
- `_archive/reports/` - CSV module analysis reports

**Total archived:** [count] files

---

## 🔄 Installation Lifecycle Status

**Current Installer Version:** v[X.Y.Z] (compiled [date] [time])
**Last Test Installation:** [date] [time]
**Installation Status:** [Not Installed | Installed | Needs Uninstall]

### Test Installation Details:
- **Location:** C:\Program Files\SAM AI
- **Services:**
  - OdooService: [Running | Stopped | Not Installed]
  - PostgreSQL-SAM: [Running | Stopped | Not Installed]
- **Accessible:** http://localhost:8069 [✅ Accessible | ❌ Unreachable]
- **Modules Loaded:**
  - ai_brain: [✅ Loaded | ❌ Missing]
  - ai_sam: [✅ Loaded | ❌ Missing]
  - [List other critical modules]
- **Issues Found:** [List any runtime issues or "None"]

### Last Uninstallation:
- **Date:** [date] [time]
- **Clean:** [✅ All files removed | ⚠️ Some files remaining | ❌ Failed]
- **Services:** [✅ All services stopped/removed | ⚠️ Some remain]
- **Registry:** [✅ Cleaned | ⚠️ Partial | ❌ Not checked]
- **Validation:** [Command used to verify cleanup]

### Next Lifecycle Action:
- [ ] Uninstall current test installation (before recompile)
- [ ] Fix compiler issues (Phase 6)
- [ ] Recompile installer.exe
- [ ] Test new installation
- [ ] Validate fixes worked

---

## 🔄 Last Loop Iteration

**Session:** [date] [time]
**Phase:** [Phase 1-7]

### What Changed:
1. **File:** [filename]
   - **Change:** [what was modified]
   - **Reason:** Fixes Problem #[X] ([problem title])
   - **Result:** [✅ Success | ⚠️ Partial | ❌ Failed]

2. **File:** [filename]
   - **Change:** [what was modified]
   - **Reason:** [why]
   - **Result:** [result]

### Problems Addressed:
- ✅ **Fixed:** CRITICAL #1 - [problem title]
- ⚠️ **Partial:** HIGH #2 - [problem title] (needs more testing)
- ⏸️ **Deferred:** MEDIUM #3 - [problem title] (user decision)

### Problems Remaining:
- CRITICAL: [count]
- HIGH: [count]
- MEDIUM: [count] (user may defer)
- LOW: [count] (user may defer)

### What We Learned:
- [Lesson 1: Insight from this iteration]
- [Lesson 2: What to avoid next time]
- [Lesson 3: New discovery about the system]

### Next Action:
[Specific next step - e.g., "Recompile installer.exe and test" or "Run Pass 4 to validate fixes"]

---

## 📈 Progress Tracking

### Session History (Last 5 Sessions):

**Session exe-build-005** (2025-11-12 16:30)
- Fixed: CRITICAL #1 (PostgreSQL path)
- Status: Testing

**Session exe-build-004** (2025-11-12 14:00)
- Fixed: HIGH #2 (Missing dependencies)
- Status: Complete

**Session exe-build-003** (2025-11-12 10:00)
- Diagnostic pass complete (5/5 passes)
- Found: 7 issues (2 CRITICAL, 3 HIGH, 2 MEDIUM)

**Session exe-build-002** (2025-11-11 15:00)
- BUILD_HISTORY.md created (consolidated 14 docs)
- Cleanup complete (144 → 18 active files)

**Session exe-build-001** (2025-11-11 12:00)
- Initial baseline established
- Cleanup started

### Velocity Metrics:
- **Problems found:** [count]
- **Problems fixed:** [count]
- **Success rate:** [percentage]
- **Average time per fix:** [estimate]

---

## 🚫 DO NOT CREATE (Without Permission)

These patterns create file chaos - ALWAYS ask first:

### ❌ NEW Diagnostic Scripts
**Instead:** Use existing analysis tools or ask: "Should I create new diagnostic script for [purpose]?"

### ❌ NEW Config Files
**Instead:** Update existing configs (odoo_samai_installer.iss, build.py, requirements.txt)

**Example:**
- ❌ BAD: Create `installer_fixed.iss`
- ✅ GOOD: Edit `odoo_samai_installer.iss` (update existing)

### ❌ NEW State Documents
**Instead:** Update CURRENT_STATE.md or append to BUILD_HISTORY.md

**Example:**
- ❌ BAD: Create `PROGRESS_UPDATE_20251112.md`
- ✅ GOOD: Update CURRENT_STATE.md "Last Loop Iteration" section

### ❌ NEW History Docs
**Instead:** Append to BUILD_HISTORY.md

**Example:**
- ❌ BAD: Create `FIX_COMPLETE_POSTGRESQL.md`
- ✅ GOOD: Append entry to BUILD_HISTORY.md with date/problem/solution

### ❌ NEW Report Formats
**Instead:** Use diagnostic_YYYYMMDD_HHMMSS.md template

### ❌ NEW Duplicate Scripts
**Instead:** Check 01_TOOLS_AND_SCRIPTS_LIBRARY.md first, then ask user

**Example:**
- ❌ BAD: Create `build_python_bundle_v2.ps1`
- ✅ GOOD: Edit `build_python_bundle.ps1` (version control with git, not filenames)

---

## 🔄 Update Protocol (When to Update This File)

### Phase 2 (Document Current State):
- ✅ Update "Last Updated" timestamp
- ✅ Update "Current Objective"
- ✅ Update "Installation Lifecycle Status" (if changed)

### Phase 3 (Multi-Pass Diagnosis):
- ✅ Update "Known Problems" section (add newly discovered issues)
- ✅ Update problem counts

### Phase 6 (Update Tools/Files):
- ✅ Update "Current Files & Tools" inventory (if new file added with permission)
- ✅ Mark modified files with new "Last updated" date

### Phase 7 (Update State & Loop):
- ✅ Update "Last Loop Iteration" (full section rewrite)
- ✅ Update "Problems Addressed" (mark fixed/partial/deferred)
- ✅ Update "Problems Remaining" counts
- ✅ Update "What We Learned"
- ✅ Update "Next Action"
- ✅ Add entry to "Session History"
- ✅ Update "Velocity Metrics"

### Special Updates:
- **File added:** Update "Current Files & Tools" + explain why in "Last Loop Iteration"
- **File archived:** Move from "Active" to "Archived" section + explain why
- **New problem found:** Add to "Known Problems" categorized by severity
- **Problem fixed:** Update status to "Fixed" + document in "Last Loop Iteration"

---

## 📊 State Health Indicators

**Healthy State:**
- ✅ CURRENT_STATE.md updated every session
- ✅ Active files count < 25 (manageable)
- ✅ All problems documented with status
- ✅ Next action always clear
- ✅ No files in C:\Users\total\

**Unhealthy State (Requires Cleanup):**
- ❌ CURRENT_STATE.md not updated in 2+ sessions
- ❌ Active files count > 50 (chaos returning)
- ❌ Problems scattered across multiple docs
- ❌ Next action unclear
- ❌ Files found in C:\Users\total\

**If unhealthy detected:** Run Phase 0 cleanup again

---

## 🎯 The Golden Rules

1. **ONE source of truth:** CURRENT_STATE.md (not scattered docs)
2. **Update constantly:** Phase 2 and Phase 7 of every loop
3. **Never duplicate:** Edit existing files, don't create new versions
4. **Always ask:** Before creating new file, ask user permission
5. **Document immediately:** Changes go in "Last Loop Iteration" right away
6. **Stay in D:\:** Never write to C:\Users\total\
7. **Archive, don't delete:** Obsolete files go to _archive/, not trash
8. **Consolidate always:** Multiple docs → ONE doc (like BUILD_HISTORY.md)
9. **Evidence-first:** Analyze logs/files BEFORE asking user questions
10. **Document root causes:** Track issue dependency chains (ROOT CAUSE vs SYMPTOM)
11. **Respect locked decisions:** Never question 🔒 LOCKED sections
12. **Planning is work:** Documentation sync is productive, not just code changes

---

## 💡 BEHAVIORAL PHILOSOPHY (Critical Mindset)

**FROM → TO (Philosophical Shift):**

**FROM:** "I have diagnostic frameworks, which one do you want?"
**TO:** "I analyzed the evidence, here's what's broken and why"

**FROM:** "Let me plan how to find issues"
**TO:** "Here are the issues I found [already analyzed]"

**FROM:** "What symptoms are you experiencing?"
**TO:** "Logs show these symptoms, root cause is X"

**FROM:** "Should I run diagnostics?"
**TO:** [Runs diagnostics] → "Here are ALL the problems I found"

**Key Principle:**
> **Be a diagnostic expert, not a framework presenter. Analyze autonomously, present findings, then recommend action.**

**This means:**
- Read logs BEFORE asking questions
- Analyze BEFORE presenting frameworks
- Present concrete findings, not abstract plans
- Documentation alignment = sync docs with reality (not document the process)

---

**End of Central State Management Guide**
