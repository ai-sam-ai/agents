# Scoring Rubric - Pass/Fail Criteria

## Purpose

Objective criteria for determining if code passes the quality gate.

---

## The Three-Gate Model

```
Code Quality Check
    ↓
├─ Gate 1: CRITICAL/HIGH Errors → MUST be zero → FAIL if any
├─ Gate 2: QA Tool Score → MUST be 8+ → CONDITIONAL if 7-7.9
└─ Gate 3: Issue Volume → SHOULD be <10 → CONDITIONAL if 10-20
    ↓
Final Decision: PASS / CONDITIONAL / FAIL
```

---

## Gate 1: CRITICAL/HIGH Errors (Blocking)

### Rule: Zero Tolerance

**CRITICAL Errors (Installation Blockers):**
- ❌ ir.actions model type conflicts
- ❌ Odoo 18 `<tree>` tags (should be `<list>`)
- ❌ Deprecated V2 dependencies (ai_base, ai_trunk)
- ❌ Sibling branch imports (architecture violation)
- ❌ Duplicate XML IDs
- ❌ Python syntax errors

**HIGH Errors (Functionality Breakers):**
- ❌ Missing security rules (custom models)
- ❌ Missing `models` import (NameError)
- ❌ Hook declared but not exported
- ❌ Menu/action load order wrong
- ❌ Invalid manifest format

### Decision Logic
```python
if critical_count > 0 or high_count > 0:
    return "FAIL"
```

**No exceptions.** These MUST be fixed before commit.

---

## Gate 2: QA Tool Score (Quality Baseline)

### Rule: Score ≥ 8 out of 10

**QA Tool:** `ai_sam_development_qa.py` (1,616 lines, THE MACHINE)

**Scoring Breakdown:**
- **10/10** = Zero issues found (perfect)
- **9/10** = Minor issues only (1-2 LOW warnings)
- **8/10** = Acceptable quality (3-5 LOW/MEDIUM warnings)
- **7/10** = Needs improvement (6-10 MEDIUM warnings)
- **6/10** = Poor quality (10+ MEDIUM or 1+ HIGH)
- **<6/10** = Unacceptable (multiple HIGH/CRITICAL)

### Decision Logic
```python
if qa_score >= 8:
    pass_gate_2 = True
elif qa_score >= 7:
    pass_gate_2 = "CONDITIONAL"  # Ask user
else:
    pass_gate_2 = False  # FAIL
```

**Rationale:**
- 8+ = Production-ready quality
- 7-7.9 = Borderline (user decides)
- <7 = Not ready for commit

---

## Gate 3: Issue Volume (Overwhelming Check)

### Rule: Total Issues < 10

**Issue Categories:**
- CRITICAL: [counted in Gate 1]
- HIGH: [counted in Gate 1]
- MEDIUM: Code quality issues
- LOW: Style/optimization suggestions

### Volume Thresholds
```
0-5 issues   = PASS (manageable)
6-10 issues  = PASS (acceptable)
11-20 issues = CONDITIONAL (overwhelming?)
21+ issues   = FAIL (too many problems)
```

### Decision Logic
```python
medium_count = len([i for i in issues if i.severity == 'MEDIUM'])
low_count = len([i for i in issues if i.severity == 'LOW'])
total_issues = medium_count + low_count

if total_issues > 20:
    return "FAIL"  # Too many issues
elif total_issues > 10:
    return "CONDITIONAL"  # Ask user
else:
    return "PASS"
```

**Rationale:**
- 0-10 issues = Normal (fix or accept)
- 11-20 issues = Borderline (user decides)
- 21+ issues = Too many (needs cleanup)

---

## Final Decision Matrix

```
Gate 1 (CRITICAL/HIGH) | Gate 2 (QA Score) | Gate 3 (Volume) | Decision
-----------------------|-------------------|-----------------|-------------
PASS (0 errors)        | 10                | 0-5 issues      | ✅ PASS
PASS (0 errors)        | 9                 | 6-10 issues     | ✅ PASS
PASS (0 errors)        | 8                 | 6-10 issues     | ✅ PASS
PASS (0 errors)        | 7                 | 6-10 issues     | ⚠️ CONDITIONAL
PASS (0 errors)        | 8                 | 11-20 issues    | ⚠️ CONDITIONAL
PASS (0 errors)        | <7                | Any             | ❌ FAIL
PASS (0 errors)        | Any               | 21+ issues      | ❌ FAIL
FAIL (1+ errors)       | Any               | Any             | ❌ FAIL
```

---

## Confidence Scoring (For Auto-Fixes)

Each auto-fix has a confidence score (how sure we are it's correct).

### Confidence Levels

**HIGH (90-100%):**
- Safe to auto-fix without approval
- Pattern is deterministic
- Fix has been tested 10+ times
- Zero risk of breaking other code

**Examples:**
- `<tree>` → `<list>` conversion (95%)
- `ai_base` → `ai_brain` replacement (98%)
- Version format fix (92%)

**MEDIUM (70-89%):**
- Suggest fix, ask for approval
- Pattern is mostly deterministic
- Fix has been tested 3-10 times
- Low risk of side effects

**Examples:**
- Add missing `_description` (85%)
- Comment out console.log (88%)
- Add missing `models` import (80%)

**LOW (<70%):**
- Show explanation only (no auto-fix)
- Pattern is context-dependent
- Fix requires human judgment
- Could have unintended side effects

**Examples:**
- Duplicate XML ID resolution (60%)
- Sibling import refactoring (50%)
- Architecture violations (40%)

### Decision Logic for Auto-Fix
```python
if confidence >= 90:
    auto_fix_without_approval()
elif confidence >= 70:
    suggest_fix_and_ask_approval()
else:
    explain_issue_no_fix()
```

---

## Pass Status Explanations

### ✅ PASS - Ready for Commit

**Criteria:**
- Zero CRITICAL/HIGH errors
- QA score ≥ 8
- Total issues ≤ 10
- All auto-fixes applied successfully

**Message to Developer:**
```markdown
✅ **Quality Gate: PASSED**

Your code meets all quality standards and is ready for commit.

**Summary:**
- CRITICAL: 0
- HIGH: 0
- MEDIUM: [count]
- LOW: [count]
- QA Score: [X]/10
- Auto-Fixes Applied: [count]

**Next Step:** `/git-push`
```

---

### ⚠️ CONDITIONAL - User Decides

**Criteria:**
- Zero CRITICAL/HIGH errors (MUST)
- BUT: QA score 7-7.9 OR total issues 11-20

**Message to Developer:**
```markdown
⚠️ **Quality Gate: CONDITIONAL**

Your code has no critical issues, but quality could be improved.

**Issues Found:**
- QA Score: [X]/10 (threshold: 8)
- MEDIUM warnings: [count]
- LOW warnings: [count]

**Your Options:**
1. **Fix now** (recommended): Address issues and re-run `/qa-guardian`
2. **Accept risk**: Proceed to `/git-push`

**Impact of Accepting:**
- Code quality score below standard
- Technical debt accumulates
- Future refactoring may be needed

Do you want to proceed or fix issues first?
```

---

### ❌ FAIL - Cannot Commit

**Criteria:**
- 1+ CRITICAL errors OR
- 1+ HIGH errors OR
- QA score < 7 OR
- Total issues > 20

**Message to Developer:**
```markdown
❌ **Quality Gate: FAILED**

Your code has critical issues that must be fixed before commit.

**Blocking Issues:**
- CRITICAL: [count]
- HIGH: [count]
- QA Score: [X]/10 (threshold: 8)
- Total Issues: [count] (threshold: 20)

**Required Fixes:**
[List of CRITICAL/HIGH issues with file:line]

**Next Steps:**
1. Fix the blocking issues listed above
2. Re-run: `/qa-guardian`
3. Repeat until PASS or CONDITIONAL

**Need Help?**
- Reference: odoo_18_error_prevention.md
- Debug: `/debug` for complex errors
```

---

## Special Cases

### Case 1: Fresh Module (No Code Yet)
```python
if no_python_files and no_xml_files:
    return "PASS"  # Nothing to check
```

### Case 2: QA Tool Not Found
```python
if qa_tool_not_found:
    # Fall back to manual checks
    score = estimate_score_from_grep_checks()
    if score >= 8:
        return "PASS"
    else:
        return "CONDITIONAL"  # Recommend running QA tool
```

### Case 3: All Issues Auto-Fixed
```python
if all_issues_auto_fixed and verification_passed:
    # Re-scan after fixes
    new_scan_result = run_full_scan()
    return evaluate_gates(new_scan_result)
```

### Case 4: Developer Bypasses Gate
```python
if user_requests_bypass:
    warn("Bypassing QA Guardian increases risk of bugs in production.")
    confirm = ask("Are you sure? (yes/no)")
    if confirm == "yes":
        log_bypass_event()  # Track for metrics
        return "PASS (USER OVERRIDE)"
    else:
        return "FAIL"
```

---

## Scoring Examples

### Example 1: Perfect Code
```
CRITICAL: 0
HIGH: 0
MEDIUM: 0
LOW: 0
QA Score: 10/10

Gate 1: PASS (0 errors)
Gate 2: PASS (score 10)
Gate 3: PASS (0 issues)

Decision: ✅ PASS
```

### Example 2: Minor Issues
```
CRITICAL: 0
HIGH: 0
MEDIUM: 2 (missing _description)
LOW: 3 (console.log)
QA Score: 9/10

Gate 1: PASS (0 errors)
Gate 2: PASS (score 9)
Gate 3: PASS (5 issues)

Decision: ✅ PASS
```

### Example 3: Borderline Quality
```
CRITICAL: 0
HIGH: 0
MEDIUM: 8 (various code quality)
LOW: 5 (style issues)
QA Score: 7.5/10

Gate 1: PASS (0 errors)
Gate 2: CONDITIONAL (score 7.5)
Gate 3: CONDITIONAL (13 issues)

Decision: ⚠️ CONDITIONAL
```

### Example 4: Critical Error
```
CRITICAL: 1 (<tree> tags found)
HIGH: 0
MEDIUM: 2
LOW: 1
QA Score: 8/10

Gate 1: FAIL (1 CRITICAL)
Gate 2: PASS (score 8)
Gate 3: PASS (3 issues)

Decision: ❌ FAIL (Gate 1 override)
```

### Example 5: Too Many Issues
```
CRITICAL: 0
HIGH: 0
MEDIUM: 15
LOW: 12
QA Score: 6/10

Gate 1: PASS (0 errors)
Gate 2: FAIL (score 6)
Gate 3: FAIL (27 issues)

Decision: ❌ FAIL
```

---

## Metrics to Track

### Per Session
- Time to scan (goal: <5 minutes)
- Auto-fix success rate (goal: >80%)
- Pass rate (goal: increase over time)
- Conditional rate (acceptable: 10-20%)
- Fail rate (goal: decrease over time)

### Per Developer (if trackable)
- First-time pass rate (goal: increase)
- Repeat failures (goal: decrease)
- Average QA score (goal: >8.5)

### Per Pattern
- Detection accuracy (goal: >95%)
- Fix success rate (goal: >90%)
- False positive rate (goal: <5%)

---

## Rubric Maintenance

### Review Schedule
- **Weekly:** Check if thresholds are appropriate
- **Monthly:** Adjust based on metrics
- **Quarterly:** Major rubric review

### Adjustment Triggers
- Pass rate >95% → Consider tightening (raise bar)
- Fail rate >30% → Consider loosening (lower bar)
- Conditional rate >40% → Clarify thresholds

---

## Philosophy

**Firm but Fair:**
- Critical/High errors = Non-negotiable
- Quality score = Objective standard
- Issue volume = Practical limit

**Goal-Oriented:**
- PASS = Production-ready
- CONDITIONAL = Acceptable with awareness
- FAIL = Not ready (protect quality)

**Balanced:**
- Not too strict (blocks legitimate work)
- Not too lenient (allows poor quality)
- Just right (maintains standards while enabling velocity)

**Remember:** The goal is **sustainable quality**, not perfection. Code must work, be maintainable, and follow standards - but doesn't need to be perfect.
