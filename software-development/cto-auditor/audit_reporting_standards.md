# Audit Reporting Standards - Clear Communication of Quality

**Purpose:** Report audit findings clearly with strategic context and actionable recommendations

**Philosophy:** "A good audit identifies problems. A great audit provides strategic path forward."

---

## Report Structure (Standard Template)

### Executive Summary Format

```markdown
# CTO Audit Report: [Feature/Module Name]

**Date:** [YYYY-MM-DD]
**Auditor:** cto-auditor
**Developer:** [Who wrote the code]
**Risk Level:** [Low/Medium/High]

## Overall Assessment

**Score:** [X/10] - [Category]
**Status:** [✅ Approved / ⚠️ Approved with Notes / ❌ Revise Required]

**One-Sentence Summary:**
[What was built + quality assessment + key recommendation]

**Key Strengths:**
- [Strength 1]
- [Strength 2]

**Critical Issues:**
- [Issue 1 if any]
- [Issue 2 if any]

**Strategic Recommendation:**
[Commit now / Minor fixes / Major revision required]
```

---

## Section 1: CTO Principles Validation (Always First)

**Format:**

```markdown
## CTO Principles Validation

### ✅ Principle 1: Measure First, Act Second
- **Status:** Pass / Concern / Violation
- **Evidence:** [What measurement/data existed]
- **Impact:** [Score deduction if violated]

### ✅ Principle 2: Boring Patterns Win
- **Status:** Pass / Concern / Violation
- **Evidence:** [Which boring pattern, precedent cited]
- **Impact:** [Score deduction if violated]

### ✅ Principle 3: Build for Known Scale (1000+ Clients)
- **Status:** Pass / Concern / Violation
- **Evidence:** [Will foundations scale without rewrites?]
- **Impact:** [Score deduction if violated]

### ✅ Principle 4: Optimize User Time
- **Status:** Pass / Concern / Violation
- **Evidence:** [ROI calculation, break-even timeline]
- **Impact:** [Score deduction if violated]

### ✅ Principle 5: File Discipline
- **Status:** Pass / Concern / Violation
- **Evidence:** [Files created, all allowed?]
- **Impact:** [Score deduction if violated]
```

**Icons:**
- ✅ Green check = Pass
- ⚠️ Yellow warning = Concern (minor)
- ❌ Red X = Violation (deduction applied)

---

## Section 2: Code Quality Assessment

**Format:**

```markdown
## Code Quality Assessment

### Strengths
- ✅ [Positive aspect 1 with example]
- ✅ [Positive aspect 2 with example]
- ✅ [Positive aspect 3 with example]

### Areas for Improvement
- ⚠️ [Improvement 1]
  - **Location:** [File:line]
  - **Issue:** [What's wrong]
  - **Impact:** [-X points]
  - **Fix:** [How to improve]

### Critical Issues (Must Fix Before Commit)
- 🔴 [Issue 1]
  - **Location:** [File:line]
  - **Issue:** [What's critically wrong]
  - **Impact:** [-X points]
  - **Fix:** [Required change]
  - **Why Critical:** [Business/security/architecture impact]
```

**Categories to Cover:**
- Clarity (naming, length, nesting)
- Technical debt (magic numbers, coupling, error handling)
- Performance (N+1, pagination, efficiency)
- Security (injection, access control, secrets)
- Testing (coverage, edge cases)

---

## Section 3: Architecture Validation

**Format:**

```markdown
## Architecture Validation

**Compliance:** [✅ Compliant / ⚠️ Minor Issues / ❌ Violations]

### Layer Boundaries
- **ai_brain (data):** [Correct/Violated]
- **ai_sam (framework):** [Correct/Violated]
- **branches (features):** [Correct/Violated]

### Platform Bleeding Check
- **Canvas core purity:** [✅ Pure / ❌ Platform-specific code found]
- **Cross-branch dependencies:** [✅ None / ❌ Found: X → Y]

### Odoo 18 Compliance
- **Security rules:** [✅ Present / ❌ Missing]
- **View tags:** [✅ Uses `<list>` / ❌ Uses deprecated `<tree>`]
- **Version format:** [✅ 18.0.x.y / ❌ Incorrect]

### Scalability (Known Scale Rule)
- **Target:** 1000+ clients
- **Assessment:** [✅ Foundations scale without rewrites / ⚠️ Minor technical debt / ❌ Temporary hack that will cause heartache]

**Architectural Score:** [X/10]
**Deductions:** [List specific violations]
```

---

## Section 4: Technical Debt Report

**Format:**

```markdown
## Technical Debt Identified

**Debt Level:** [Low / Medium / High]

### Debt Items
1. **[Debt Category]:** [Description]
   - **Location:** [File:line]
   - **Type:** [Magic number / Tight coupling / etc.]
   - **Impact:** [Future maintenance burden]
   - **Mitigation:** [How to address]
   - **Timeline:** [Immediate / Short-term / Long-term]

### Debt Prioritization
**Critical (Fix Now):**
- [Item 1]

**Short-Term (Fix This Week):**
- [Item 2]

**Long-Term (Track for Future):**
- [Item 3]
```

**Debt Categories:**
- Magic numbers
- Tight coupling
- Copy-paste code
- No error handling
- Incomplete validation
- Performance shortcuts
- Security gaps

---

## Section 5: Scoring Breakdown (Transparent Calculation)

**Format:**

```markdown
## Scoring Breakdown

**Base Score:** 10 points

### Deductions Applied

**CTO Principle Violations:**
- Principle 1 (Measure First): [-X points] [Reason]
- Principle 2 (Boring Patterns): [-X points] [Reason]
- Principle 3 (Build for Known Scale): [-X points] [Reason]
- Principle 4 (Optimize Time): [-X points] [Reason]
- Principle 5 (File Discipline): [-X points] [Reason]

**Code Quality Issues:**
- Clarity: [-X points] [Specific issues]
- Technical Debt: [-X points] [Specific issues]
- Performance: [-X points] [Specific issues]
- Security: [-X points] [Specific issues]
- Testing: [-X points] [Specific issues]

**Architecture Issues:**
- Layer violations: [-X points] [Specific issues]
- Platform bleeding: [-X points] [Specific issues]
- Scalability: [-X points] [Specific issues]

**Total Deductions:** [Sum] points

**Final Score:** 10 - [Sum] = **[X/10]**

**Category:** [Exceptional / Excellent / Good / Needs Improvement / Unacceptable]
```

---

## Section 6: Strategic Recommendations (Action Plan)

**Format:**

```markdown
## Strategic Recommendations

### Immediate Actions (Before Commit)
**Priority:** Critical
**Timeline:** Now

1. [Action 1]
   - **Why:** [Strategic reason]
   - **How:** [Specific fix]
   - **Owner:** [cto-developer]

2. [Action 2]
   - **Why:** [Strategic reason]
   - **How:** [Specific fix]
   - **Owner:** [cto-developer]

### Short-Term Improvements (Next Sprint)
**Priority:** High
**Timeline:** This week

1. [Improvement 1]
   - **Benefit:** [ROI/value]
   - **Effort:** [Estimated hours]
   - **Owner:** [Suggested owner]

### Long-Term Considerations (Future)
**Priority:** Medium
**Timeline:** Next month

1. [Consideration 1]
   - **Strategic Impact:** [Why it matters]
   - **When to Address:** [Trigger condition]
```

---

## Section 7: Approval Decision (Clear Status)

**Format:**

```markdown
## Approval Status

**Decision:** [Icon + Text]

### ✅ Approved (Ready to Commit)
**Justification:** [Why ready - score 8-10/10, no critical issues]

**Next Steps:**
1. Commit to repository
2. Deploy to staging
3. User acceptance testing

---

### ⚠️ Approved with Notes (Can Commit, Improvements Recommended)
**Justification:** [Why acceptable - score 6-7/10, minor issues tracked]

**Next Steps:**
1. Commit as-is (acceptable quality)
2. Create tickets for improvements: [List]
3. Address in future sprint

**Technical Debt Tracked:**
- [Item 1] - [Ticket #]
- [Item 2] - [Ticket #]

---

### ❌ Revise Required (Do NOT Commit)
**Justification:** [Why blocked - score <6/10 or critical violations]

**Required Changes:**
1. [Must fix 1] - [Why critical]
2. [Must fix 2] - [Why critical]

**Resubmit for audit after revisions.**
```

---

## Communication Tone Guidelines

### With User (Strategic Context)

**Tone:** Professional, strategic, business-focused

**Good Example:**
```markdown
"This order processing code scores 7/10 (Good - Acceptable with Notes).

Strategic context:
- Works correctly for current scale (100 orders/day)
- Minor N+1 query will cause heartache at 1000+ clients
- Technical debt acceptable short-term

Recommendation: Commit now. Create ticket for optimization at 500 orders/day threshold. ROI of optimization: 2 hours work saves 5 seconds per order at scale."
```

**Avoid:**
- Too technical (overwhelming jargon)
- Too casual ("code looks okay, I guess")
- Too perfectionist ("must be 10/10 or redo")

---

### With cto-developer (Technical Feedback)

**Tone:** Direct, specific, actionable

**Good Example:**
```markdown
"Score: 6/10 (Needs improvement)

Specific issues:

1. **File:** payment_controller.py:45
   - **Issue:** No null check on partner_id
   - **Impact:** NoneType error on edge case
   - **Fix:** Add guard: `if payment.partner_id:`
   - **Why:** Principle 2 - boring pattern (Python 101 null checking)

2. **File:** order_model.py:120
   - **Issue:** N+1 query (partner accessed in loop)
   - **Impact:** 1,000 orders = 1,000 queries (known scale problem)
   - **Fix:** Prefetch: `orders.mapped('partner_id')` before loop
   - **Why:** Principle 3 - not built for known scale (1000+ clients)

Please revise and resubmit."
```

**Avoid:**
- Vague ("code could be better")
- Judgmental ("this is terrible")
- No solution ("you messed up" without fix)

---

## Report Length Guidelines

### Minimum (Simple Bug Fix)
- Executive Summary: 5 lines
- Principles Validation: 5 lines (if all pass)
- Code Quality: Brief (1-2 issues)
- Scoring: Calculation
- Approval: Decision + next steps

**Total:** ~1 page

---

### Standard (Feature Implementation)
- Executive Summary: 1 paragraph
- Principles Validation: 5 sections
- Code Quality: Detailed (strengths + improvements)
- Architecture: Brief validation
- Technical Debt: List items
- Scoring: Full breakdown
- Recommendations: 3 tiers (immediate/short/long)
- Approval: Decision + justification

**Total:** 2-3 pages

---

### Comprehensive (Critical System)
- Executive Summary: 2 paragraphs
- Principles Validation: Detailed each
- Code Quality: Exhaustive
- Architecture: Full validation
- Technical Debt: Prioritized with mitigation
- Security: Dedicated section
- Performance: Load testing results
- Scoring: Detailed breakdown
- Recommendations: Action plan with owners
- Approval: Detailed justification

**Total:** 4-5 pages

---

## Report Examples (Templates)

### Example 1: Simple Bug Fix (Approved)

```markdown
# CTO Audit Report: Null Pointer Fix (Payment Module)

**Date:** 2025-11-26
**Score:** 9/10 - Excellent
**Status:** ✅ Approved

## Executive Summary
Added null check for payment.partner_id to prevent NoneType errors. Boring pattern (Python 101), clear code, appropriate logging.

## CTO Principles Validation
✅ All 5 principles validated:
- Measure First: Bug reported with stack trace
- Boring Pattern: Standard null checking
- Build for known scale: Right-sized fix
- Optimize Time: Bug fix (high ROI)
- File Discipline: Modified existing file only

## Scoring
Base: 10
Deductions: -1 (minor: could add model-level constraint)
Final: **9/10 (Excellent)**

## Approval
✅ **Approved** - Ready to commit immediately.

Next: Deploy to production.
```

---

### Example 2: Feature (Approved with Notes)

```markdown
# CTO Audit Report: User Quota Management

**Date:** 2025-11-26
**Score:** 7/10 - Good (Acceptable with Notes)
**Status:** ⚠️ Approved with Notes

## Executive Summary
Implemented quota tracking for API usage limits. Works correctly, minor N+1 query at scale. Acceptable for current 100 users, needs optimization at 1,000 users.

## CTO Principles Validation
✅ Principle 1: Measured (API cost problem validated)
✅ Principle 2: Boring pattern (Odoo computed field)
⚠️ Principle 3: Minor concern (N+1 at 1000+ clients) [-1 point]
✅ Principle 4: Good ROI (prevents API cost overruns)
✅ Principle 5: Production code only

## Code Quality
**Strengths:**
- Clear model structure
- Validation present
- Tests included

**Areas for Improvement:**
- N+1 query in _compute_usage (file:line 45) [-1 point]
  - Fix: Prefetch message_ids before loop
  - Timeline: Optimize at 500 users

## Scoring
Base: 10
Deductions: -2 (Principle 3 concern) + -1 (N+1 query)
Final: **7/10 (Good)**

## Approval
⚠️ **Approved with Notes**

Can commit. Create ticket: "Optimize quota computation at 500 users" (#1234).

Technical debt tracked, not blocking.
```

---

### Example 3: Major Feature (Revise Required)

```markdown
# CTO Audit Report: Advanced Analytics with ML

**Date:** 2025-11-26
**Score:** 2/10 - Unacceptable
**Status:** ❌ Revise Required

## Executive Summary
Attempted to build comprehensive analytics with ML predictions. Massive over-engineering, violates multiple CTO principles, must redo with boring approach.

## CTO Principles Validation
❌ Principle 1: No measurement (why ML needed?) [-3 points]
❌ Principle 2: Custom ML vs simple analytics [-3 points]
❌ Principle 3: Temporary hack that will require painful rewrite at 1000+ clients [-2 points]
⚠️ Principle 4: Unclear ROI (no justification) [-1 point]
✅ Principle 5: Production code only

## Critical Issues
🔴 God method (200+ lines) - Redo with decomposition
🔴 Redis cluster unnecessary - Over-engineering
🔴 Raw SQL vs ORM - Maintainability concern

## Scoring
Base: 10
Deductions: -8 (principles) + -1 (god method)
Final: **2/10 (Unacceptable)**

## Required Changes
❌ **Do NOT commit**

Must redo:
1. Use Odoo QWeb reports (boring pattern)
2. Use Odoo ORM (not raw SQL)
3. Simple statistics (not ML)
4. Build for known scale (1000+ clients, foundations that don't require rewrites)

Resubmit after complete revision with CTO rigor.
```

---

**Remember:** "A good audit report gives developer clear path forward. Score + specific fixes + strategic context."
