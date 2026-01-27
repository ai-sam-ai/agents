# Code Quality Standards - What "Good" Looks Like

**Purpose:** Define objective quality criteria for CTO Developer's code output

**Philosophy:** "Quality is not optional. Pride in workmanship is mandatory."

---

## Quality Scoring Rubric

**Score your own work before handoff:**

### 10/10 - Exceptional
- ✅ Solves root cause (not symptom)
- ✅ Uses boring, proven pattern
- ✅ Zero technical debt introduced
- ✅ Comprehensive tests included
- ✅ Clear code (no comments needed for obvious logic)
- ✅ Follows all 5 CTO principles
- ✅ Performance measured and acceptable

### 8-9/10 - Excellent
- ✅ Solves problem correctly
- ✅ Boring pattern used
- ✅ Minimal technical debt
- ✅ Basic tests included
- ✅ Code is clear
- ⚠️ Minor improvement opportunities exist

### 6-7/10 - Good
- ✅ Problem solved
- ⚠️ Some technical debt added
- ⚠️ Tests incomplete
- ⚠️ Code could be clearer
- ⚠️ One CTO principle weakly applied

### 4-5/10 - Acceptable (Needs Improvement)
- ✅ Feature works
- ❌ Technical debt added
- ❌ No tests
- ❌ Code unclear
- ❌ Multiple CTO principles ignored

### 0-3/10 - Unacceptable (Redo)
- ❌ Doesn't solve problem
- ❌ Clever hack used
- ❌ Significant technical debt
- ❌ No tests
- ❌ CTO principles violated

**Minimum acceptable score: 6/10** (Good)

**Target score: 8-9/10** (Excellent)

**Only achieve 10/10 when:**
- Critical path code (authentication, payments, data integrity)
- Performance-sensitive (measured bottleneck)
- User explicitly requests exceptional quality

---

## Code Clarity Standards

### Naming Conventions

**Variables:**
```python
# ✅ GOOD (Clear intent)
user_email = "user@example.com"
order_total = calculate_total(items)
is_valid = validate_input(data)
max_retries = 3

# ❌ BAD (Unclear abbreviations)
ue = "user@example.com"
ot = calc(items)
v = validate(d)
mr = 3
```

**Functions:**
```python
# ✅ GOOD (Verb + noun, clear action)
def calculate_order_total(items):
    ...

def send_confirmation_email(user):
    ...

def validate_credit_card(card_number):
    ...

# ❌ BAD (Unclear purpose)
def process(data):
    ...

def handle(x):
    ...

def do_stuff():
    ...
```

**Classes:**
```python
# ✅ GOOD (Noun, clear entity)
class OrderProcessor:
    ...

class EmailService:
    ...

class PaymentValidator:
    ...

# ❌ BAD (Vague or verb)
class Manager:
    ...

class Handler:
    ...

class DoThings:
    ...
```

---

### Function Length

**Target: <50 lines per function**

```python
# ✅ GOOD (Short, focused)
def calculate_tax(amount, rate):
    """Calculate tax on given amount"""
    return amount * rate

def apply_discount(price, discount_percent):
    """Apply percentage discount to price"""
    discount = price * (discount_percent / 100)
    return price - discount

# ❌ BAD (Too long, does too much)
def process_order(order_data):
    # 200 lines of validation, calculation, database ops, email sending
    ...
```

**If function >50 lines:** Extract helper functions

```python
# Before (80 lines)
def process_order(order):
    # validation (20 lines)
    # inventory check (20 lines)
    # pricing (20 lines)
    # invoice creation (20 lines)

# After (4 focused functions)
def process_order(order):
    validate_order(order)
    check_inventory(order)
    pricing = calculate_pricing(order)
    return create_invoice(order, pricing)

def validate_order(order):
    # 20 lines

def check_inventory(order):
    # 20 lines

def calculate_pricing(order):
    # 20 lines

def create_invoice(order, pricing):
    # 20 lines
```

---

### Nesting Depth

**Maximum: 3 levels**

```python
# ✅ GOOD (2 levels)
def process_item(item):
    if item.is_valid:
        if item.quantity > 0:
            return item.price * item.quantity
    return 0

# ❌ BAD (5 levels - hard to follow)
def process_order(order):
    if order.is_valid:
        if order.items:
            for item in order.items:
                if item.in_stock:
                    if item.quantity > 0:
                        # Deep nesting!
                        ...

# ✅ BETTER (Early returns, flat structure)
def process_order(order):
    if not order.is_valid:
        return False

    if not order.items:
        return False

    for item in order.items:
        if not item.in_stock or item.quantity <= 0:
            continue
        process_item(item)

    return True
```

---

### Comments (When to Use)

**DO comment when:**
- Complex algorithm (not obvious)
- Business logic reasoning
- Workarounds for external bugs
- Performance optimizations

```python
# ✅ GOOD (Explains WHY, not WHAT)
# Use bulk_create to avoid N+1 queries for 1000+ records
records = Model.objects.bulk_create(items)

# We must validate BEFORE saving because Odoo's constraint
# doesn't catch this edge case (bug #12345)
if not self._validate_custom_rule():
    raise ValidationError("Custom validation failed")

# Performance: Prefetch related to avoid 50+ queries
records = self.env['model'].search([]).mapped('partner_id')
```

**DON'T comment when:**
- Code is self-explanatory
- Variable names are clear
- Standard patterns

```python
# ❌ BAD (Obvious comments)
# Increment counter
counter = counter + 1

# Loop through items
for item in items:
    ...

# Return the result
return result
```

---

## Technical Debt Prevention

### Debt Type 1: Hard-Coded Values

```python
# ❌ BAD (Magic numbers)
if user.age > 18:
    ...

if status == 3:
    ...

# ✅ GOOD (Named constants)
MINIMUM_AGE = 18
if user.age > MINIMUM_AGE:
    ...

STATUS_ACTIVE = 3
if status == STATUS_ACTIVE:
    ...

# ✅ BETTER (Odoo Selection field)
state = fields.Selection([
    ('draft', 'Draft'),
    ('active', 'Active'),
    ('archived', 'Archived')
])
```

---

### Debt Type 2: Tight Coupling

```python
# ❌ BAD (Directly coupled to implementation)
class OrderProcessor:
    def __init__(self):
        self.email_service = GmailService()  # Tied to Gmail!

    def send_confirmation(self, user):
        self.email_service.send(user.email, "Confirmed")

# ✅ GOOD (Dependency injection, any email service)
class OrderProcessor:
    def __init__(self, email_service):
        self.email_service = email_service  # Any email service

    def send_confirmation(self, user):
        self.email_service.send(user.email, "Confirmed")
```

---

### Debt Type 3: No Error Handling

```python
# ❌ BAD (Assumes success)
def read_config():
    with open('config.ini') as f:
        return f.read()  # What if file doesn't exist?

# ✅ GOOD (Handles errors)
def read_config():
    try:
        with open('config.ini') as f:
            return f.read()
    except FileNotFoundError:
        _logger.error("Config file not found")
        return DEFAULT_CONFIG
```

---

### Debt Type 4: Copy-Paste Code

```python
# ❌ BAD (Duplicated logic)
def process_order_a(order):
    validate(order)
    calculate_total(order)
    send_email(order.user)

def process_order_b(order):
    validate(order)
    calculate_total(order)
    send_email(order.user)

# ✅ GOOD (Extracted common function)
def process_order_common(order):
    validate(order)
    calculate_total(order)
    send_email(order.user)

def process_order_a(order):
    process_order_common(order)
    # A-specific logic

def process_order_b(order):
    process_order_common(order)
    # B-specific logic
```

---

## Testing Standards

### Test Coverage Expectations

**Critical paths: 100% coverage**
- Authentication
- Payments
- Data integrity
- Security rules

**Standard features: 80% coverage**
- Business logic
- Calculated fields
- Constraints

**Low-risk: 50% coverage**
- UI views
- Simple CRUD

### Test Quality Checklist

```markdown
- [ ] Test names describe what's tested (not generic "test1")
- [ ] One assertion focus per test (not testing 5 things)
- [ ] Tests are independent (can run in any order)
- [ ] Tests use fixtures/setup (not duplicate setup code)
- [ ] Edge cases tested (null, empty, boundary values)
- [ ] Error conditions tested (invalid input raises expected error)
```

---

## Performance Standards

### Response Time Targets

**API Endpoints:**
- p50 latency: <500ms
- p95 latency: <2s
- p99 latency: <5s

**Database Queries:**
- Simple queries: <50ms
- Complex queries: <500ms
- Report queries: <2s

**Page Load:**
- First paint: <1s
- Interactive: <2s
- Full load: <3s

### Performance Red Flags

```python
# 🔴 RED FLAG: N+1 queries
for record in records:
    partner_name = record.partner_id.name  # Query per iteration!

# 🔴 RED FLAG: No pagination
records = self.env['model'].search([])  # Could be 100,000 records!

# 🔴 RED FLAG: Inefficient list building
result = []
for item in large_list:
    result.append(transform(item))  # Use list comprehension instead

# 🔴 RED FLAG: Repeated computation in loop
for record in records:
    total = sum([item.price for item in record.items])  # Recompute every time!
```

---

## Security Standards

### Security Checklist

```markdown
- [ ] All custom models have security rules (ir.model.access.csv)
- [ ] User input is validated (constraints, domain checks)
- [ ] No raw SQL with user input (SQL injection risk)
- [ ] Passwords/secrets not hard-coded (use environment variables)
- [ ] File paths validated (no directory traversal)
- [ ] API endpoints have authentication checks
```

### Common Security Mistakes

```python
# ❌ BAD (SQL injection vulnerability)
query = f"SELECT * FROM users WHERE name = '{user_input}'"
self.env.cr.execute(query)

# ✅ GOOD (Parameterized query)
self.env.cr.execute("SELECT * FROM users WHERE name = %s", (user_input,))

# ❌ BAD (No access control)
@http.route('/api/delete_user', type='json', auth='none')
def delete_user(self, user_id):
    user = self.env['res.users'].browse(user_id)
    user.unlink()

# ✅ GOOD (Authentication required)
@http.route('/api/delete_user', type='json', auth='user')
def delete_user(self, user_id):
    if not self.env.user.has_group('base.group_system'):
        raise AccessError("Insufficient permissions")
    user = self.env['res.users'].browse(user_id)
    user.unlink()
```

---

## Odoo-Specific Quality Standards

### Model Standards

```python
class MyModel(models.Model):
    _name = 'my.model'  # ✅ Required
    _description = 'My Model'  # ✅ Required (Odoo 18)
    _order = 'create_date desc'  # ✅ Recommended

    name = fields.Char(required=True)  # ✅ Required field explicit
    active = fields.Boolean(default=True)  # ✅ Archive functionality

    # ✅ Constraints defined
    @api.constrains('quantity')
    def _check_quantity(self):
        for record in self:
            if record.quantity < 0:
                raise ValidationError("Quantity must be positive")

    # ✅ Onchange for UX
    @api.onchange('product_id')
    def _onchange_product(self):
        if self.product_id:
            self.price = self.product_id.list_price
```

### View Standards

```xml
<!-- ✅ GOOD -->
<record id="view_my_model_form" model="ir.ui.view">
    <field name="name">my.model.form</field>
    <field name="model">my.model</field>
    <field name="arch" type="xml">
        <form string="My Model">
            <sheet>
                <group>
                    <field name="name"/>
                    <field name="state"/>
                </group>
            </sheet>
        </form>
    </field>
</record>

<!-- ❌ BAD (No structure) -->
<form>
    <field name="name"/>
    <field name="state"/>
</form>
```

---

## Code Review Self-Checklist

**Before marking implementation complete:**

### Functionality
- [ ] Solves stated problem (not different problem)
- [ ] Edge cases handled (null, empty, max values)
- [ ] Error messages clear (user understands what went wrong)
- [ ] No regressions (existing functionality still works)

### CTO Principles
- [ ] Principle 1: Problem measured (data validated need)
- [ ] Principle 2: Boring pattern used (proven solution)
- [ ] Principle 3: Built for known scale (1000+ clients, foundations that don't require rewrites)
- [ ] Principle 4: ROI positive (break-even <3 months)
- [ ] Principle 5: Only allowed files created (no READMEs)

### Code Quality
- [ ] Functions <50 lines
- [ ] Nesting <3 levels
- [ ] Clear naming (no abbreviations)
- [ ] Comments only for non-obvious logic
- [ ] No technical debt added

### Testing
- [ ] Critical paths tested (100% coverage)
- [ ] Edge cases tested
- [ ] Error conditions tested
- [ ] Tests pass

### Performance
- [ ] No N+1 queries
- [ ] Pagination where needed
- [ ] Response time acceptable (<2s p95)

### Security
- [ ] Input validated
- [ ] Security rules defined (custom models)
- [ ] No hard-coded secrets

---

## Quality Scoring Examples

### Example 1: Score 10/10

```python
@api.depends('line_ids.subtotal')
def _compute_total(self):
    """Compute order total from line subtotals"""
    for order in self:
        order.total = sum(order.line_ids.mapped('subtotal'))

@api.constrains('total')
def _check_positive_total(self):
    """Ensure order total is non-negative"""
    for order in self:
        if order.total < 0:
            raise ValidationError("Order total cannot be negative")
```

**Why 10/10:**
- ✅ Clear purpose (computed field + validation)
- ✅ Boring pattern (Odoo @api.depends standard)
- ✅ Efficient (uses mapped() to avoid N+1)
- ✅ Validated (constraint prevents bad data)
- ✅ Clear names and docstrings
- ✅ No technical debt

---

### Example 2: Score 6/10 (Acceptable but needs improvement)

```python
def process(data):
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
- ⚠️ Unclear function name ("process" too generic)
- ⚠️ Unclear variable name ("x")
- ⚠️ No validation
- ⚠️ No docstring
- ⚠️ Could use list comprehension (more pythonic)

**Improved version (8/10):**
```python
def calculate_positive_totals(items):
    """Calculate totals for valid items, returning only positive values"""
    totals = []
    for item in items:
        if not item:
            continue
        total = calculate_item_total(item)
        if total > 0:
            totals.append(total)
    return totals
```

---

### Example 3: Score 3/10 (Unacceptable - Redo)

```python
def x(d):
    try:
        r = []
        for i in d:
            r.append(i*2)
        return r
    except:
        return []
```

**Why 3/10:**
- ❌ Terrible naming (x, d, r, i)
- ❌ Silent error handling (catches ALL exceptions)
- ❌ No docstring
- ❌ No validation
- ❌ Unclear purpose
- ❌ Should use list comprehension

**Proper version (9/10):**
```python
def double_values(numbers):
    """Double each number in the list"""
    if not isinstance(numbers, list):
        raise TypeError("Expected list of numbers")
    return [num * 2 for num in numbers]
```

---

**Remember:** "Quality is not optional. Pride in workmanship is mandatory. Score your own work honestly before handoff."
