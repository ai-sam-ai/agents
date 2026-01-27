# SAM AI Installer: 6-Agent Workflow System

**Created:** 2025-11-13
**Purpose:** Multi-agent system for debugging and fixing SAM AI installer
**Replaces:** Single complex /exe-diagnose agent with 3 modes

---

## 🎯 Overview

This system separates concerns into 6 specialized agents with 2 state files.

**Key Innovation:** Fix live system FIRST (fast), then port fixes to installer (slow, one time)

---

## 📊 The Two State Files

### LIVE_CURRENT_STATE.md
**Location:** `D:\SAMAI-18-SaaS\github-repos\100-samai-desktop-installer\dev_session_reports\LIVE_CURRENT_STATE.md`

**Purpose:** Track bugs found and fixed in live installation (C:\Program Files\SAM AI)

**Managed By:**
- /exe-odoo-debug (writes issues)
- /exe-odoo-fix (updates with fixes)

**Status Values:**
- `Identified` - Bug found, not yet fixed
- `In Progress` - Currently being fixed
- `Fixed (Live)` - Fixed in live installation, verified working
- `Cannot Fix Live - Needs Rebuild` - Requires installer changes

### INSTALLER_CURRENT_STATE.md
**Location:** `D:\SAMAI-18-SaaS\github-repos\100-samai-desktop-installer\dev_session_reports\INSTALLER_CURRENT_STATE.md`

**Purpose:** Track fixes needed in source repos for next installer build

**Managed By:**
- /exe-state-manager (writes issues translated from live)
- /exe-diagnose (adds root cause analysis)
- /exe-update (updates with fixes)

**Status Values:**
- `Needs Fix (Source)` - Needs to be fixed in source repos
- `Root Cause Analyzed` - /exe-diagnose added analysis
- `Approved for Fix` - /exe-approval verified
- `Fixed (Source)` - /exe-update applied fix
- `Verified in New Installer` - Tested and working

---

## 🤖 The Six Agents

### 1. `/exe-odoo-debug` - Live Installation Bug Finder
**Job:** Find bugs in running Odoo, document in LIVE_CURRENT_STATE.md

**Tools:** Read, Edit, Grep, Glob (READ-ONLY except LIVE_CURRENT_STATE.md)

**Workflow:**
1. Read `C:\Program Files\SAM AI\server\odoo.log`
2. Identify all errors and tracebacks
3. Document each issue in LIVE_CURRENT_STATE.md
4. Reference odoo_18_breaking_changes.md for known patterns

**Output:** Complete list of bugs in live system

**Next Step:** User reviews, then runs /exe-odoo-fix

---

### 2. `/exe-odoo-fix` - Live Installation Bug Fixer
**Job:** Fix bugs in live installation based on LIVE_CURRENT_STATE.md

**Tools:** Bash, Read, Edit, Grep, Glob (can modify C:\Program Files\SAM AI)

**Workflow:**
1. Read LIVE_CURRENT_STATE.md
2. Find FIRST issue with status "Identified"
3. Fix the bug in `C:\Program Files\SAM AI\server\addons\*`
4. Update LIVE_CURRENT_STATE.md with "Fixed (Live)" + fix details
5. Ask user to restart Odoo and verify

**Constraints:**
- Fixes ONE issue at a time
- Does NOT restart services (user does)
- Does NOT touch source repos

**Output:** One bug fixed, ready for verification

**Next Step:** User verifies, restarts Odoo, runs /exe-odoo-fix again OR /exe-odoo-debug to rescan

---

### 3. `/exe-state-manager` - State Translator
**Job:** Translate live fixes to installer fixes

**Tools:** Read, Edit, Grep, Glob (READ-ONLY except INSTALLER_CURRENT_STATE.md)

**Workflow:**
1. Read LIVE_CURRENT_STATE.md
2. Find all issues with status "Fixed (Live)"
3. For each, map live file path → source repo path
4. Write to INSTALLER_CURRENT_STATE.md with "Needs Fix (Source)"
5. Summary of fixes needed per module

**Path Translation Example:**
```
LIVE:
C:\Program Files\SAM AI\server\addons\ai_brain\hooks.py

SOURCE:
D:\SAMAI-18-SaaS\github-repos\04-samai-brain\ai_brain\hooks.py
```

**Output:** Complete list of fixes needed in source repos

**Next Step:** Run /exe-diagnose for root cause analysis

---

### 4. `/exe-diagnose` - Root Cause Analyst
**Job:** Explain WHY bugs occurred, prevent future occurrences

**Tools:** Read, Edit, Grep, Glob (READ-ONLY except INSTALLER_CURRENT_STATE.md)

**Workflow:**
1. Read INSTALLER_CURRENT_STATE.md
2. For each issue, investigate root cause
3. Add "Root Cause Analysis" section:
   - What caused it?
   - Why wasn't it caught?
   - How to prevent in future?
4. Identify patterns across all issues
5. Recommend process improvements

**Output:** Deep analysis of why bugs happened + prevention strategies

**Next Step:** Run /exe-approval to verify ready for rebuild

---

### 5. `/exe-approval` - Quality Gate
**Job:** Verify everything is ready before allowing rebuild

**Tools:** (Already exists)

**Checks:**
1. INSTALLER_CURRENT_STATE.md has root cause analysis for all issues
2. All fixes are documented and clear
3. No missing dependencies or conflicts
4. Build artifacts are clean
5. Source repos are in good state
6. No >100MB deletions planned
7. Odoo 18 compatibility verified
8. All knowledge files updated
9. Ready for autonomous rebuild

**Output:** Green light to proceed OR list of blockers

**Next Step:** If approved, run /exe-update

---

### 6. `/exe-update` - Source Fixer & Installer Builder
**Job:** Fix issues in source repos + rebuild installer

**Tools:** Bash, Read, Edit, Grep, Glob (can modify source repos)

**Workflow:**
1. Pre-flight checks (INSTALLER_CURRENT_STATE.md exists, approved, etc.)
2. Read INSTALLER_CURRENT_STATE.md
3. For each "Needs Fix (Source)" issue:
   - Fix in source repo (D:\SAMAI-18-SaaS\github-repos\*)
   - Update INSTALLER_CURRENT_STATE.md with "Fixed (Source)"
4. Clean build artifacts (ONLY: output\*, bundled\python\, logs\*.log)
5. Run build_python_bundle.ps1
6. Run build_installer_final.ps1
7. Report success/failure

**Bulletproof Safeguards:**
- NEVER delete bundled\server (Odoo source)
- NEVER delete bundled\postgresql (DB binaries)
- NEVER delete bundled\addons (SAM AI modules)
- Check folder size before deleting (if >100MB, ask user)
- Use Edit tool ONLY (not Write)
- Reference build_artifacts_definition.md

**Output:** New installer with all fixes applied

**Next Step:** Test new installer

---

## 🔄 Complete Workflow (Start to Finish)

### PHASE 1: Live System Debugging (Fast - 3 min per bug)

```
1. /exe-odoo-debug
   └─> Finds 5 bugs, documents in LIVE_CURRENT_STATE.md

2. /exe-odoo-fix (bug #1)
   └─> Fixes first bug in live installation
   └─> You restart Odoo, verify fix works

3. /exe-odoo-fix (bug #2)
   └─> Fixes second bug
   └─> You restart Odoo, verify fix works

... repeat until all fixable bugs are fixed ...

4. /exe-odoo-debug (rescan)
   └─> Verify all bugs are gone or mark remaining as "Cannot Fix Live"
```

**Time:** 5 bugs × 3 min = ~15 minutes
**Result:** Live Odoo installation is WORKING

---

### PHASE 2: State Translation (5 minutes)

```
5. /exe-state-manager
   └─> Reads LIVE_CURRENT_STATE.md
   └─> Translates all "Fixed (Live)" issues to source repo fixes
   └─> Writes to INSTALLER_CURRENT_STATE.md
```

**Time:** ~5 minutes
**Result:** Clear list of what needs fixing in source repos

---

### PHASE 3: Root Cause Analysis (10-15 minutes)

```
6. /exe-diagnose
   └─> Reads INSTALLER_CURRENT_STATE.md
   └─> Adds root cause analysis for each issue
   └─> Identifies patterns (e.g., "60% are Odoo 18 compatibility")
   └─> Recommends process improvements
```

**Time:** ~10-15 minutes
**Result:** Deep understanding of what went wrong + prevention strategies

---

### PHASE 4: Quality Gate (5 minutes)

```
7. /exe-approval
   └─> Verifies everything is ready
   └─> 9-point checklist
   └─> Green light or list of blockers
```

**Time:** ~5 minutes
**Result:** Confidence that rebuild will succeed

---

### PHASE 5: Rebuild Installer (30-50 minutes)

```
8. /exe-update
   └─> Fixes all issues in source repos
   └─> Cleans build artifacts (safely!)
   └─> Rebuilds Python bundle (~25 min)
   └─> Compiles new installer (~15 min)
```

**Time:** ~30-50 minutes
**Result:** New installer with ALL fixes

---

### PHASE 6: Test & Iterate (if needed)

```
9. Install new installer
10. Test - does it work?
    ├─ YES → Ship it!
    └─ NO → Go back to Phase 1 (but should be rare now)
```

---

## 📊 Time Comparison

### OLD Workflow (Rebuild Every Bug):
```
Bug 1: Find (10 min) + Rebuild (50 min) = 60 min
Bug 2: Find (10 min) + Rebuild (50 min) = 60 min
Bug 3: Find (10 min) + Rebuild (50 min) = 60 min
Bug 4: Find (10 min) + Rebuild (50 min) = 60 min
Bug 5: Find (10 min) + Rebuild (50 min) = 60 min
Total: 5 hours for 5 bugs
```

### NEW Workflow (Fix Live, Rebuild Once):
```
Phase 1: Fix 5 bugs live (15 min)
Phase 2: Translate (5 min)
Phase 3: Root cause (15 min)
Phase 4: Approval (5 min)
Phase 5: Rebuild (50 min)
Total: 90 minutes for 5 bugs
```

**Time Savings:** 3.5 hours per debugging session!

---

## ✅ Benefits

### 1. Speed
- 70% faster than rebuild-per-bug approach
- Fix 10 bugs in 2 hours instead of 10 hours

### 2. Safety
- Each agent has ONE job
- Clear boundaries prevent mistakes
- No random file creation
- Bulletproof deletion safeguards

### 3. Control
- YOU control transitions between phases
- Verify each fix before moving forward
- Approve before final rebuild

### 4. Maintainability
- Simple agents = easy to understand
- Easy to debug when something goes wrong
- Can restart any agent in new session

### 5. Learning
- Root cause analysis prevents repeat errors
- Pattern identification improves process
- Knowledge files updated continuously

---

## 🔍 Agent Comparison Table

| Agent | Reads From | Writes To | Scope | Tools |
|-------|------------|-----------|-------|-------|
| `/exe-odoo-debug` | odoo.log | LIVE_CURRENT_STATE.md | Live installation | Read, Edit, Grep, Glob |
| `/exe-odoo-fix` | LIVE_CURRENT_STATE.md | Live installation + LIVE_CURRENT_STATE.md | Live installation | Bash, Read, Edit, Grep, Glob |
| `/exe-state-manager` | LIVE_CURRENT_STATE.md | INSTALLER_CURRENT_STATE.md | State translation | Read, Edit, Grep, Glob |
| `/exe-diagnose` | INSTALLER_CURRENT_STATE.md | INSTALLER_CURRENT_STATE.md | Root cause analysis | Read, Edit, Grep, Glob |
| `/exe-approval` | INSTALLER_CURRENT_STATE.md + repos | N/A (reports only) | Quality gate | (existing tools) |
| `/exe-update` | INSTALLER_CURRENT_STATE.md | Source repos + INSTALLER_CURRENT_STATE.md | Source fixing + rebuild | Bash, Read, Edit, Grep, Glob |

---

## 🚨 Common Pitfalls to Avoid

### 1. Mixing Live and Installer Fixes
- ❌ DON'T fix source repos during live debugging
- ❌ DON'T touch live installation during rebuild
- ✅ Keep phases separate

### 2. Skipping State Translation
- ❌ DON'T manually port fixes from live to source
- ✅ Use /exe-state-manager to ensure accuracy

### 3. Skipping Root Cause Analysis
- ❌ DON'T just fix bugs without understanding why
- ✅ Use /exe-diagnose to prevent recurrence

### 4. Skipping Approval
- ❌ DON'T run /exe-update without /exe-approval
- ✅ Quality gate prevents repeating mistakes

### 5. Trying to Fix Too Many Bugs at Once
- ❌ DON'T batch up fixes in /exe-odoo-fix
- ✅ Fix one, verify, repeat

---

## 📚 Knowledge Files Referenced

All agents reference these shared knowledge files:

1. **[odoo_18_breaking_changes.md](file://C:/Users/total/.claude/agents/exe-build/shared/odoo_18_breaking_changes.md)** - Odoo 17→18 migration patterns
2. **[build_artifacts_definition.md](file://C:/Users/total/.claude/agents/exe-build/shared/build_artifacts_definition.md)** - What can be safely deleted
3. **[sam_ai_packaging_knowledge.md](file://C:/Users/total/.claude/agents/exe-build/shared/sam_ai_packaging_knowledge.md)** - Module structure
4. **[compiler_technical_knowledge.md](file://C:/Users/total/.claude/agents/exe-build/shared/compiler_technical_knowledge.md)** - Inno Setup details
5. **[central_state_management.md](file://C:/Users/total/.claude/agents/exe-build/shared/central_state_management.md)** - State file formats
6. **[EXE_PATHS_CENTRALIZATION.md](file://D:/SAMAI-18-SaaS/github-repos/EXE_PATHS_CENTRALIZATION.md)** - Path mappings

---

## 🎓 When to Use Which Agent

**"I just installed SAM AI and it's not starting"**
→ Start with `/exe-odoo-debug`

**"I found a bug in odoo.log"**
→ `/exe-odoo-debug` to document, then `/exe-odoo-fix` to fix

**"Live system works now, need to rebuild installer"**
→ `/exe-state-manager` → `/exe-diagnose` → `/exe-approval` → `/exe-update`

**"Why do we keep getting this error?"**
→ `/exe-diagnose` (root cause analysis)

**"Is it safe to rebuild?"**
→ `/exe-approval` (quality gate)

**"Need to fix and rebuild installer"**
→ `/exe-update` (but only after approval)

---

**End of Six-Agent Workflow Documentation**

**Remember:** Each agent has ONE job. Keep it simple. Control the flow.
