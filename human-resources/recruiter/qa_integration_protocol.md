# QA Integration Protocol - Shared Knowledge for All Niche Skin Agents

**Purpose:** How to use QA tool and integrate quality checks
**Used By:** ALL niche module agents (mod_intelligence, mod_workflows, mod_memory, etc.)
**Last Updated:** 2025-10-17

---

## 🎯 Critical: Quality is NON-Negotiable

**Our QA Tool:** `C:\Working With AI\ai_sam\ai_toolbox\ai_sam_odoo_dev_qa.py`
- **1,616 lines** of painfully-learned knowledge
- **40+ violation types** detected
- **90%+ accuracy** (battle-tested)

**Philosophy:** "Test your work BEFORE handing off. QA Guardian is your friend, not your enemy."

---

## 🔄 Quality Workflow (MANDATORY)

```
┌─────────────────┐
│  1. DEVELOP     │ ← Write code, follow patterns
└────────┬────────┘
         ↓
┌─────────────────┐
│  2. SELF-TEST   │ ← Test manually (smoke test)
└────────┬────────┘
         ↓
┌─────────────────┐
│  3. RUN QA TOOL │ ← THIS STEP! python ai_sam_odoo_dev_qa.py
└────────┬────────┘
         ↓
   ┌─────┴─────┐
   │ Issues?   │
   └─────┬─────┘
         ↓
    ┌────┴────┐
YES │  4. FIX  │ → (Loop back to step 3)
    └─────────┘
         ↓ NO
┌─────────────────┐
│ 5. COMMIT/PUSH  │ ← git-push or hand off
└─────────────────┘
```

**Key Rule:** NEVER skip step 3! Always run QA tool before committing.

---

## 🚀 How to Run QA Tool

### Basic Run (From Module Root)
```bash
cd "C:\Working With AI\ai_sam\ai_sam\{your_module}\"
python ..\ai_toolbox\ai_sam_odoo_dev_qa.py
```

### With Report (Detailed Output)
```bash
python ..\ai_toolbox\ai_sam_odoo_dev_qa.py --report
```

### Check Specific Module
```bash
python ..\ai_toolbox\ai_sam_odoo_dev_qa.py --module ai_sam_intelligence
```

### Quick Scan (Only Critical/High)
```bash
python ..\ai_toolbox\ai_sam_odoo_dev_qa.py --severity critical,high
```

---

## 📊 Understanding QA Results

### Score Interpretation

**Score: 10/10** 🏆
- Zero violations found
- **Action:** Celebrate! Ready to commit
- Rare achievement (excellence)

**Score: 8-9/10** ✅
- Minor issues only (LOW severity)
- **Action:** Fix if time allows, commit OK
- Good quality (acceptable)

**Score: 6-7/10** ⚠️
- Medium issues present
- **Action:** Review and fix most issues
- Needs improvement (commit with caution)

**Score: 4-5/10** ❌
- High severity issues
- **Action:** MUST fix before committing
- Poor quality (do not commit)

**Score: 0-3/10** 🚫
- Critical issues (blocks install/upgrade)
- **Action:** Stop, fix immediately
- Unacceptable (will break production)

---

### Severity Levels

**CRITICAL** (Score impact: -3 each)
- **Examples:**
  - `<tree>` tags (Odoo 18 incompatibility)
  - Sibling branch imports (architecture violation)
  - Deprecated dependencies (breaks installation)
  - ir.actions model type conflicts
- **Action:** MUST fix (zero tolerance)
- **Why:** Blocks install/upgrade, breaks production

**HIGH** (Score impact: -2 each)
- **Examples:**
  - Missing security rules
  - Missing Python imports
  - Hook not exported
  - Menu/action ordering wrong
- **Action:** SHOULD fix (high priority)
- **Why:** Breaks functionality, causes runtime errors

**MEDIUM** (Score impact: -1 each)
- **Examples:**
  - Missing `_description`
  - Wrong version format
  - Data models in platform skins
- **Action:** GOOD to fix (code quality)
- **Why:** Odoo warnings, architecture drift

**LOW** (Score impact: -0.5 each)
- **Examples:**
  - Excessive console.log
  - Missing type hints
  - Unused imports
- **Action:** NICE to fix (style)
- **Why:** Code clarity, optimization

---

## 🔧 Auto-Fix vs Manual Fix

### Auto-Fixable Patterns (90%+ confidence)

**Pattern 1: `<tree>` → `<list>`**
```bash
# QA tool can auto-fix this
python ai_sam_odoo_dev_qa.py --auto-fix tree_to_list
```

**Pattern 2: Deprecated dependencies**
```bash
# QA tool can auto-fix this
python ai_sam_odoo_dev_qa.py --auto-fix deprecated_deps
```

**Pattern 3: Missing `_description`**
```bash
# QA tool can auto-fix this
python ai_sam_odoo_dev_qa.py --auto-fix missing_description
```

**Pattern 4: Wrong version format**
```bash
# QA tool can auto-fix this
python ai_sam_odoo_dev_qa.py --auto-fix version_format
```

**Pattern 5: Missing models import**
```bash
# QA tool can auto-fix this
python ai_sam_odoo_dev_qa.py --auto-fix missing_imports
```

**Pattern 6: Excessive console.log**
```bash
# QA tool can auto-fix this (comments out excess logs)
python ai_sam_odoo_dev_qa.py --auto-fix console_log
```

---

### Manual Fix Required (Complex patterns)

**These require human judgment:**
- ir.actions model type conflicts (need to decide approach)
- Sibling branch imports (need to refactor architecture)
- Missing security rules (need to define permissions)
- Menu/action ordering (need to understand dependencies)
- Duplicate XML IDs (need to understand usage)

---

## 📋 QA Tool Output Format

### Example Output
```
========================================
SAM AI Odoo Development QA Report
========================================

Module: ai_sam_intelligence
Path: C:\Working With AI\ai_sam\ai_sam\ai_sam_intelligence
Scan Date: 2025-10-17 14:30:00

----------------------------------------
SUMMARY
----------------------------------------
Total Issues: 5
  CRITICAL: 0
  HIGH: 1
  MEDIUM: 2
  LOW: 2

Quality Score: 7.5/10

----------------------------------------
CRITICAL ISSUES (0)
----------------------------------------
(none)

----------------------------------------
HIGH ISSUES (1)
----------------------------------------
[HIGH] Missing Security Rules
  File: models/ai_graph_node.py
  Line: 5
  Model: ai.graph.node
  Issue: Custom model has no security rules defined
  Fix: Add security/ir.model.access.csv with user + manager access

----------------------------------------
MEDIUM ISSUES (2)
----------------------------------------
[MEDIUM] Missing _description
  File: models/ai_conversation.py
  Line: 8
  Model: ai.conversation
  Issue: Model missing _description field (Odoo 18 requirement)
  Fix: Add _description = 'AI Conversation History' after _name

[MEDIUM] Wrong Version Format
  File: __manifest__.py
  Line: 3
  Issue: Version '1.0.0' doesn't start with '18.0.'
  Fix: Change to '18.0.1.0' (Odoo 18 format)

----------------------------------------
LOW ISSUES (2)
----------------------------------------
[LOW] Excessive console.log
  File: static/src/js/renderer.js
  Line: Multiple
  Issue: 8 console.log statements found (limit: 3)
  Fix: Remove or comment out debug logs

[LOW] Missing Type Hints
  File: models/ai_conversation.py
  Line: Multiple
  Issue: 3/5 functions lack type hints (60%)
  Fix: Add type hints for function parameters and returns

========================================
RECOMMENDATIONS
========================================
1. Fix HIGH issue (missing security rules) before committing
2. Address MEDIUM issues for better code quality
3. LOW issues can be fixed later (not blocking)

Overall Assessment: GOOD (Score: 7.5/10)
Action: Fix HIGH issues, then commit acceptable

========================================
```

---

## 🎯 Integration with Your Workflow

### Phase 3.5: Quality Validation (NEW!)

**Add this phase AFTER development:**

```markdown
### Phase 3: Development
1. Write code (models, views, controllers)
2. Follow established patterns
3. Test manually (smoke test)

### Phase 3.5: Quality Validation ← NEW!
1. Run QA tool: `python ..\ai_toolbox\ai_sam_odoo_dev_qa.py`
2. Review findings:
   - CRITICAL → MUST fix immediately
   - HIGH → SHOULD fix before commit
   - MEDIUM → GOOD to fix (code quality)
   - LOW → NICE to fix (optional)
3. Auto-fix common patterns (if available)
4. Manual fix complex issues
5. Re-run QA until score ≥8/10

### Phase 4: Handover
1. Summarize what was done
2. Include QA score in summary (e.g., "QA Score: 9/10")
3. Update BUILD_HISTORY.md
4. Ready for commit/push
```

---

## 🔍 Common QA Scenarios

### Scenario 1: Perfect Score (10/10)
```
QA Tool Output: Score 10/10, zero issues

Your Response:
"✅ QA validation passed with perfect score (10/10).
Ready for commit!"
```

### Scenario 2: Good Score (8-9/10)
```
QA Tool Output: Score 8/10
- LOW: 2 console.log statements exceed limit
- LOW: Missing type hints on 1 function

Your Response:
"✅ QA validation passed (8/10).
Minor issues (LOW severity):
- Excess console.log (2 statements)
- Missing type hints (1 function)

Action: Acceptable to commit, fix later if time allows."
```

### Scenario 3: Needs Work (6-7/10)
```
QA Tool Output: Score 6/10
- HIGH: Missing security rules for ai.graph.node
- MEDIUM: Missing _description on 2 models

Your Response:
"⚠️ QA validation: Score 6/10 (needs improvement).

Issues to fix:
- HIGH: Missing security rules (fixing now...)
- MEDIUM: Missing _description (fixing now...)

(Fix issues, re-run QA)

✅ Re-scan after fixes: Score 9/10. Ready to commit!"
```

### Scenario 4: Unacceptable (0-5/10)
```
QA Tool Output: Score 3/10
- CRITICAL: <tree> tags found (Odoo 18 incompatibility)
- CRITICAL: Sibling branch import detected
- HIGH: Missing security rules

Your Response:
"🚫 QA validation FAILED (3/10).

CRITICAL issues must be fixed:
1. <tree> → <list> (auto-fixing...)
2. Sibling import (refactoring required...)
3. Missing security rules (adding...)

(Fix all CRITICAL/HIGH issues, re-run QA)

✅ Re-scan after fixes: Score 8/10. Now ready!"
```

---

## 📖 QA Tool Capabilities

### What It Detects

**XML Violations:**
- `<tree>` tags (should be `<list>`)
- Duplicate XML IDs
- view_mode using `tree` (should be `list`)
- Menu/action ordering issues

**Python Violations:**
- Missing imports (`models`, `fields`, `api`)
- Missing `_description` field
- Sibling branch imports
- Hook not exported
- Missing type hints

**Manifest Violations:**
- Wrong version format (not `18.0.x.y`)
- Deprecated dependencies (V2 names)
- Wrong data file order

**Architecture Violations:**
- Data models in platform skins (should be in ai_brain)
- Sibling branch imports (breaks V3 architecture)
- Platform bleeding into canvas core

**Security Violations:**
- Missing security rules for custom models
- Incomplete access definitions

**Code Quality:**
- Excessive console.log (>3 per file)
- Missing docstrings
- Unused imports
- Long functions (>50 lines)

---

## ⚙️ QA Tool Configuration

### Default Thresholds
```python
# In ai_sam_odoo_dev_qa.py
THRESHOLDS = {
    'max_console_log': 3,
    'min_type_hint_coverage': 0.5,  # 50%
    'max_function_length': 50,
    'critical_score_penalty': -3,
    'high_score_penalty': -2,
    'medium_score_penalty': -1,
    'low_score_penalty': -0.5,
}
```

### Module-Specific Overrides
```python
# Can be overridden per module (future enhancement)
MODULE_CONFIG = {
    'ai_sam_intelligence': {
        'max_console_log': 5,  # More lenient
    }
}
```

---

## 🎓 Learning from QA Reports

### Pattern Recognition

**If QA tool repeatedly finds same issue:**
1. Add to error prevention checklist
2. Update pre-commit checklist
3. Document in BUILD_HISTORY.md
4. Consider auto-fix pattern

**Example:**
```markdown
# In BUILD_HISTORY.md
### 2025-10-17: Learned Pattern - Missing _description

**Context:** QA tool caught missing _description 3 times
**Lesson:** ALWAYS add _description immediately after _name
**Prevention:** Added to pre-commit checklist
**Impact:** Zero missed _description fields since
```

---

## ✅ Success Metrics

**QA integration succeeds when:**
- ✅ QA tool run before EVERY commit (100% compliance)
- ✅ First-try pass rate >80% (score ≥8/10)
- ✅ Zero CRITICAL issues in last 10 commits
- ✅ Average score ≥8.5/10
- ✅ Auto-fix used for common patterns

**Need improvement when:**
- ❌ QA tool skipped (commit without validation)
- ❌ First-try pass rate <60%
- ❌ Repeat CRITICAL issues
- ❌ Average score <7/10
- ❌ Manual fix for auto-fixable patterns

---

## 🚀 Quick Command Reference

```bash
# Basic scan
python ai_sam_odoo_dev_qa.py

# Detailed report
python ai_sam_odoo_dev_qa.py --report

# Auto-fix all patterns
python ai_sam_odoo_dev_qa.py --auto-fix all

# Auto-fix specific pattern
python ai_sam_odoo_dev_qa.py --auto-fix tree_to_list

# Scan specific module
python ai_sam_odoo_dev_qa.py --module ai_sam_intelligence

# Only show critical/high
python ai_sam_odoo_dev_qa.py --severity critical,high

# Export report to file
python ai_sam_odoo_dev_qa.py --report --output qa_report.txt
```

---

## 💡 Pro Tips

### Tip 1: Run QA Early and Often
Don't wait until the end. Run QA after:
- Adding a new model
- Creating a new view
- Updating manifest
- Major refactoring

**Benefit:** Catch issues early (easier to fix)

---

### Tip 2: Use Auto-Fix for Common Patterns
Don't manually fix what QA tool can fix automatically:
```bash
# Let tool fix common issues
python ai_sam_odoo_dev_qa.py --auto-fix tree_to_list,deprecated_deps,version_format
```

**Benefit:** Save time, consistent fixes

---

### Tip 3: Aim for Score ≥9/10
Don't settle for "barely passing" (8/10):
- Fix LOW issues too (takes 5 minutes)
- Strive for excellence, not "good enough"
- Pride in workmanship

**Benefit:** Fewer bugs, better code quality

---

### Tip 4: Document Patterns
When QA catches new issue type:
1. Fix it
2. Document in BUILD_HISTORY.md
3. Add to pre-commit checklist
4. Propose auto-fix pattern (if repeatable)

**Benefit:** Learn from mistakes, prevent repeats

---

## 🔗 Related Files

**QA Tool:**
- `C:\Working With AI\ai_sam\ai_toolbox\ai_sam_odoo_dev_qa.py` (1,616 lines)

**Knowledge Sources:**
- `odoo_18_tech_stack.md` (error patterns)
- `/qa-guardian` agent (auto-fix patterns, scoring rubric)
- `/developer` agent (error prevention)

**Integration:**
- `niche_agent_template.md` (workflow includes QA step)
- All niche agents (MUST use QA tool)

---

**Remember:** "The best bugs are the ones you catch BEFORE production!"

**Goal:** Zero CRITICAL issues in commits, average score ≥8.5/10, 100% QA compliance.

---

**Last Updated:** 2025-10-17
**Source:** QA Guardian agent + QA tool analysis
**Maintained By:** Chief of Staff (/cos)
**Used By:** ALL niche module agents
