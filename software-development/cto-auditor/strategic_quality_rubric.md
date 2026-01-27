# Strategic Quality Rubric - CTO-Grade Scoring Guide

**Purpose:** Objective quality scoring that validates CTO principles, not just syntax

**Philosophy:** "Quality without strategy is perfectionism. Strategy without quality is recklessness."

---

## Scoring Philosophy

### Traditional Auditor vs CTO Auditor

**Traditional Auditor:**
```
Code works? ✅
Syntax clean? ✅
No obvious bugs? ✅
Score: 8/10 (Good job!)
```

**CTO Auditor:**
```
Code works? ✅
But... is it a clever hack? (Violates Principle 2)
But... is it over-engineered? (Violates Principle 3)
But... was the problem measured? (Violates Principle 1)
But... creates technical debt? (Future maintenance burden)
Score: 5/10 (Works, but strategically poor - REDO with boring pattern)
```

**The Difference:**
- Traditional: "Does it work?"
- CTO: "Does it work AND respect strategic principles?"

---

## The 10-Point Scale (Strategic Interpretation)

### 10/10: CTO Gold Standard (Rare)

**Criteria:**
- ✅ All 5 CTO principles perfectly applied
- ✅ Boring pattern with precedent cited
- ✅ Zero technical debt
- ✅ Comprehensive tests (100% coverage of critical paths)
- ✅ Code clarity exceptional
- ✅ Performance measured and optimized
- ✅ Architecture fits perfectly

**When to Award:**
- Critical path code (authentication, payments, data integrity)
- Performance bottleneck solved with measurement
- Should be model/example for other developers
- User explicitly requested "exceptional quality"

**Example:**
```python
@api.depends('line_ids.subtotal')
def _compute_total(self):
    """Compute order total from line subtotals.

    Uses Odoo ORM prefetch to avoid N+1 queries.
    Tested with 1,000 order lines: 0.05s performance.
    """
    for order in self:
        order.total = sum(order.line_ids.mapped('subtotal'))

@api.constrains('total')
def _check_positive_total(self):
    """Prevent negative order totals (business rule)."""
    for order in self:
        if order.total < 0:
            raise ValidationError(_("Order total cannot be negative"))
```

**Why 10/10:**
- Principle 1: Problem measured (N+1 query identified, performance tested)
- Principle 2: Boring pattern (Odoo @api.depends standard, millions of uses)
- Principle 3: Right-sized (foundations scale to 1000+ clients without rewrites)
- Principle 4: High ROI (prevents bugs, optimizes performance)
- Principle 5: Production code only (no README created)
- Tests: Comprehensive (constraint tested, performance validated)
- Clarity: Clear docstrings, business context explained

---

### 8-9/10: Excellent (Production Ready)

**Criteria:**
- ✅ 4-5 CTO principles applied
- ✅ Boring pattern used
- ✅ Minimal technical debt
- ✅ Basic tests included
- ✅ Code clarity good
- ⚠️ Minor polish opportunities exist

**When to Award:**
- Standard production code (not critical path)
- All principles respected
- Minor improvement opportunities (not blocking)
- Ready to commit

**Example:**
```python
def calculate_shipping_cost(self, order):
    """Calculate shipping based on order weight."""
    COST_PER_KG = 5.0
    base_cost = order.total_weight * COST_PER_KG
    return base_cost
```

**Why 8/10 (not 10/10):**
- ✅ Boring pattern (simple calculation)
- ✅ Clear constant (COST_PER_KG)
- ⚠️ Minor improvement: Could add constraint for negative weight
- ⚠️ Minor improvement: Could test edge cases (zero weight)
- Overall: Excellent, minor polish opportunities

---

### 6-7/10: Good (Acceptable with Notes)

**Criteria:**
- ✅ Problem solved correctly
- ⚠️ 3-4 CTO principles applied
- ⚠️ Some technical debt added
- ⚠️ Tests incomplete
- ⚠️ Code could be clearer

**When to Award:**
- Works but has improvement areas
- One principle weakly applied
- Technical debt acceptable short-term
- Can commit with notes for future improvement

**Example:**
```python
def process_payment(data):
    result = []
    for item in data:
        if item:
            x = calculate(item)
            if x > 0:
                result.append(x)
    return result
```

**Why 6/10:**
- ✅ Works functionally
- ⚠️ Unclear naming (process_payment, data, x)
- ⚠️ No validation (what if data is not list?)
- ⚠️ No tests mentioned
- ⚠️ Could use list comprehension (more Pythonic)
- Technical debt: Names need clarity, validation missing

**Recommendation:**
"Acceptable for commit with notes. Add TODO: Improve naming, add validation. Technical debt tracked."

---

### 4-5/10: Needs Improvement (Revise Before Commit)

**Criteria:**
- ✅ Feature works
- ❌ Only 1-2 CTO principles applied
- ❌ Significant technical debt
- ❌ No tests or inadequate
- ❌ Code unclear

**When to Award:**
- Works but violates multiple principles
- Technical debt concerning
- Must revise before commit

**Example:**
```python
def do_stuff(x):
    try:
        y = []
        for i in x:
            y.append(i*2)
        return y
    except:
        return []
```

**Why 4/10:**
- ❌ Terrible naming (do_stuff, x, y, i)
- ❌ Silent error handling (catches ALL exceptions)
- ❌ No docstring
- ❌ No validation
- ❌ Principle 2 violated (not using list comprehension - boring pattern)
- Technical debt: Entire function needs rewrite

**Recommendation:**
"Revise required before commit. Specific issues: naming, error handling, use list comprehension."

---

### 0-3/10: Unacceptable (REDO Required)

**Criteria:**
- ❌ Doesn't solve problem / partially broken
- ❌ CTO principles ignored
- ❌ Clever hacks, massive technical debt
- ❌ No tests
- ❌ Security issues
- ❌ Architecture violations

**When to Award:**
- Critical violations (security, architecture)
- Clever hack instead of boring pattern
- Must redo with CTO rigor

**Example:**
```python
def login(username, password):
    query = f"SELECT * FROM users WHERE name='{username}' AND pass='{password}'"
    self.env.cr.execute(query)
    return True
```

**Why 0/10:**
- 🔴 CRITICAL: SQL injection vulnerability (user input directly in query)
- ❌ No password hashing (plaintext comparison)
- ❌ No authentication framework (reinventing wheel)
- ❌ Principle 2 violated (clever custom auth vs Odoo's boring auth framework)
- ❌ Security violation

**Recommendation:**
"REDO REQUIRED. Critical security violation (SQL injection). Use Odoo's built-in authentication framework (boring pattern)."

---

## Deduction Guide (How to Calculate Score)

### Base Score: 10 Points

**Start at 10/10, deduct points for violations:**

### CTO Principle Violations

**Principle 1: Measure First, Act Second**
- No measurement: -3 points
- Weak measurement: -1 point
- Example: Feature built without proving pain exists

**Principle 2: Boring Patterns Win**
- Clever hack (critical path): -3 points
- Clever hack (non-critical): -2 points
- Reinventing wheel: -2 points
- Example: Custom parser when configparser exists

**Principle 3: Build for Known Scale (1000+ Clients)**
- Massive over-engineering: -2 points
- Moderate over-engineering: -1 point
- Example: Kubernetes for 100 users

**Principle 4: Optimize User Time**
- Terrible ROI (>12 months break-even): -2 points
- Poor ROI (6-12 months): -1 point
- Example: 40 hours to save $20/month

**Principle 5: File Discipline**
- Created forbidden file: -3 points
- File in wrong location: -1 point
- Example: Implementer created README.md

---

### Code Quality Issues

**Clarity:**
- Unclear naming: -0.5 points
- Function >100 lines: -1 point
- Nesting >4 levels: -1 point
- No docstrings on complex logic: -0.5 points

**Technical Debt:**
- Magic numbers: -0.5 points
- Tight coupling: -1 point
- No error handling: -1 point
- Copy-paste code: -1 to -2 points

**Performance:**
- N+1 queries: -1 to -2 points
- No pagination: -1 point
- Inefficient algorithms: -1 to -2 points

**Security:**
- SQL injection: -3 points (CRITICAL)
- No access control: -3 points (CRITICAL)
- Hard-coded secrets: -2 points

**Architecture:**
- Boundary violation: -2 to -3 points
- Missing security rules: -2 points
- Wrong layer placement: -2 points

---

## Scoring Examples (Real-World)

### Example 1: E-commerce Order Processing

**Code Submitted:**
```python
class SaleOrder(models.Model):
    _inherit = 'sale.order'

    def action_confirm(self):
        """Confirm order and process payment."""
        # Validate stock
        for line in self.order_line:
            if line.product_id.qty_available < line.product_uom_qty:
                raise ValidationError(f"Insufficient stock for {line.product_id.name}")

        # Process payment
        payment = self.env['payment.transaction'].create({
            'partner_id': self.partner_id.id,
            'amount': self.amount_total,
            'currency_id': self.currency_id.id,
        })
        payment.process()

        # Confirm order
        return super().action_confirm()
```

**CTO Audit:**

**Principle Validation:**
- Principle 1 (Measure): ✅ Solving real problem (order confirmation flow)
- Principle 2 (Boring): ✅ Odoo inheritance pattern (standard)
- Principle 3 (Known Scale): ✅ Right-sized (foundations for 1000+ clients)
- Principle 4 (ROI): ✅ Core business logic (high value)
- Principle 5 (Files): ✅ Production code only

**Code Quality:**
- ✅ Clear method name
- ✅ Validation present
- ⚠️ N+1 query in stock validation loop (-1 point)
- ⚠️ No error handling for payment.process() (-1 point)

**Score: 8/10 (Excellent)**

**Recommendation:**
"Production ready. Minor improvements:
1. Prefetch product_id to avoid N+1: `self.order_line.mapped('product_id')`
2. Add try/except around payment.process() for error handling

Can commit as-is. Add TODO for optimizations."

---

### Example 2: Custom Report Generator

**Code Submitted:**
```python
def generate_advanced_analytics_report_with_ai_predictions(self, start_date, end_date):
    """Generate comprehensive analytics report with machine learning predictions."""
    # Initialize distributed cache cluster
    redis_cluster = RedisCluster(nodes=['node1', 'node2', 'node3'])

    # Query with complex joins and subqueries
    self.env.cr.execute("""
        WITH recursive_cte AS (
            ...complex 50-line SQL...
        )
        SELECT * FROM recursive_cte
        JOIN multiple_tables...
    """)

    # Process with custom ML model
    data = self.env.cr.fetchall()
    predictions = self.custom_ml_model.predict(data)

    # Generate report with 15 different visualizations
    ...200 more lines...

    return report
```

**CTO Audit:**

**Principle Validation:**
- Principle 1 (Measure): ❌ No evidence this complexity is needed (-3 points)
- Principle 2 (Boring): ❌ Custom ML model vs simpler analytics (-2 points)
- Principle 3 (Known Scale): ❌ Temporary hack that will cause heartache at 1000+ clients (-2 points)
- Principle 4 (ROI): ⚠️ Unclear ROI (how much time does this save?)
- Principle 5 (Files): ✅ Production code

**Code Quality:**
- ❌ God method (200+ lines) (-1 point)
- ❌ Raw SQL (complex, hard to maintain) (-1 point)
- ❌ Redis cluster (unnecessary infrastructure) (-1 point)

**Score: 0/10 (Unacceptable - REDO)**

**Recommendation:**
"REDO with CTO rigor. Violations:
1. Principle 1: Measure FIRST - What problem are we solving? How complex does this need to be?
2. Principle 2: Boring pattern - Use Odoo's report system, not custom ML
3. Principle 3: Temporary hack that will require painful rewrite at 1000+ clients

Start over:
- Use Odoo QWeb reports (boring pattern)
- Use Odoo ORM (not raw SQL)
- Simple statistics (not ML predictions)
- Build foundations that scale to 1000+ clients without rewrites"

---

### Example 3: Bug Fix (Null Pointer)

**Code Submitted:**
```python
# File: payment_controller.py, line 45
def process_payment(self, payment_id):
    payment = self.env['payment.transaction'].browse(payment_id)
    # Added null check (bug fix)
    if payment.partner_id:
        partner_name = payment.partner_id.name
        _logger.info(f"Processing payment for {partner_name}")
    else:
        _logger.warning("Payment has no partner")

    # Process payment...
    payment.process()
```

**CTO Audit:**

**Principle Validation:**
- Principle 1 (Measure): ✅ Bug measured (NoneType error reported)
- Principle 2 (Boring): ✅ Standard null check (Python 101)
- Principle 3 (Known Scale): ✅ Right-sized fix (foundations for 1000+ clients)
- Principle 4 (ROI): ✅ Bug fix (high value, prevents errors)
- Principle 5 (Files): ✅ Modified existing file only

**Code Quality:**
- ✅ Clear code
- ✅ Logging added (good debugging)
- ✅ Edge case handled

**Score: 9/10 (Excellent)**

**Recommendation:**
"Excellent bug fix. Clean, clear, boring solution. Ready to commit.

Minor: Consider adding constraint at model level to prevent null partner_id in future:
```python
@api.constrains('partner_id')
def _check_partner(self):
    if not self.partner_id:
        raise ValidationError('Partner required')
```

But current fix is production-ready as-is."

---

## Strategic Scoring Principles

### Principle A: Context Matters

**Same code, different contexts, different scores:**

**Context 1: Prototype/MVP**
- Clever hack acceptable (speed over perfection)
- Score: 7/10 (Good - acceptable for MVP)

**Context 2: Production Critical Path**
- Clever hack unacceptable (reliability over speed)
- Score: 3/10 (Redo with boring pattern)

**Adjust scoring based on:**
- Code criticality (authentication > UI text)
- Project stage (MVP > mature product)
- Team maturity (junior dev > senior dev)

---

### Principle B: Strategic Lens, Not Perfectionism

**Perfectionism:**
"This code is 8/10, but it could be 10/10 with more polish. Score: 8/10."

**Strategic Lens:**
"This code is 8/10. For this use case (non-critical, low-risk), 8/10 is excellent ROI. Spending 4 more hours to reach 10/10 is poor ROI. Approve as-is."

**Key Insight:**
- 10/10 is expensive (time cost)
- 8/10 is often optimal (good enough)
- Context determines target score

---

### Principle C: Trend Matters

**Single code review: 6/10**
- Acceptable (one-time acceptable debt)

**Three reviews, all 6/10:**
- Pattern detected (developer not improving)
- Recommendation: Training, pairing, or escalation

**Monitor trends:**
- Improving? (5 → 7 → 8) = Good
- Stagnant? (6 → 6 → 6) = Concern
- Declining? (8 → 6 → 4) = Intervention needed

---

## Scoring Calibration Examples

### Calibration 1: Simple CRUD

**Code:** Basic create/read/update/delete for model

**Typical Score: 7-8/10**
- Why not 10/10? CRUD is routine, not exceptional
- Why not 6/10? Standard boring pattern, works correctly

---

### Calibration 2: Complex Business Logic

**Code:** Multi-step workflow with validations

**Typical Score: 6-9/10 (wide range)**
- 9/10: All validation, tests, clear logic
- 7/10: Works, minor gaps in validation
- 6/10: Works, but technical debt added

---

### Calibration 3: Performance Optimization

**Code:** N+1 query fix

**Typical Score: 8-10/10**
- 10/10: Measured BEFORE/AFTER, tests included, boring pattern
- 8/10: Fixed correctly, but no measurement
- Why high scores? Solving measured problem with boring solution

---

## Final Scoring Checklist

**Before assigning score, verify:**

- [ ] All 5 CTO principles evaluated
- [ ] Code quality assessed (clarity, debt, performance, security)
- [ ] Architecture validated (fits structure, no violations)
- [ ] Context considered (critical path? MVP? Production?)
- [ ] Deductions calculated objectively
- [ ] Score justified with strategic reasoning
- [ ] Recommendations actionable

**Score Formula:**
```
Final Score = 10 - (Principle violations + Code quality issues + Architecture issues)

Minimum passing: 6/10 (Good - acceptable with notes)
Target: 8/10 (Excellent - production ready)
Exceptional: 10/10 (Gold standard - rare)
```

---

**Remember:** "Strategic scoring validates CTO principles first, code quality second. A clever hack that works perfectly still scores low if it violates Principle 2."
