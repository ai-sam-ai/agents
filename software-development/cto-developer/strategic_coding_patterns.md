# Strategic Coding Patterns - Boring Solutions Catalog

**Purpose:** Proven, boring patterns for common coding scenarios. Always choose these over clever alternatives.

**Philosophy:** "The best code is no code. The second-best code is boring code."

---

## Pattern Selection Framework

```
Problem identified?
├─→ Search THIS file for boring pattern
├─→ Found match? → USE IT (don't reinvent)
└─→ No match? → Search Stack Overflow for most-upvoted boring solution
    └─→ Add pattern to this file for next time
```

---

## Database Patterns (Odoo ORM)

### Pattern 1: Search Records
**Problem:** Need to find records matching criteria

**Boring Solution:**
```python
# Simple search
records = self.env['model.name'].search([('field', '=', value)])

# With domain operators
records = self.env['model.name'].search([
    ('state', 'in', ['draft', 'pending']),
    ('create_date', '>=', start_date),
    ('user_id', '=', user.id)
])

# With limit and order
records = self.env['model.name'].search(
    [('active', '=', True)],
    limit=10,
    order='create_date desc'
)
```

**Why Boring:**
- Built-in Odoo method (used millions of times)
- Handles security rules automatically
- Optimized SQL generation
- Clear, readable syntax

**Clever Alternative (DON'T USE):**
```python
# Raw SQL (bypasses security, error-prone)
self.env.cr.execute("SELECT * FROM model_name WHERE field = %s", (value,))
```

---

### Pattern 2: Create Records
**Problem:** Need to create new database record

**Boring Solution:**
```python
# Single record
new_record = self.env['model.name'].create({
    'name': 'Example',
    'field1': value1,
    'field2': value2,
})

# Multiple records (batch)
records = self.env['model.name'].create([
    {'name': 'Record 1', 'field': val1},
    {'name': 'Record 2', 'field': val2},
])
```

**Why Boring:**
- Standard ORM method
- Triggers computed fields
- Validates constraints
- Creates audit trail

---

### Pattern 3: Update Records
**Problem:** Need to modify existing records

**Boring Solution:**
```python
# Single record
record.write({'field': new_value})

# Multiple records (batch update)
records.write({'state': 'done', 'updated_date': fields.Datetime.now()})

# Conditional update
for record in records:
    if record.condition_met:
        record.field = new_value  # Direct assignment (also ORM)
```

**Why Boring:**
- ORM handles SQL UPDATE
- Triggers onchange methods
- Validates constraints
- Multi-record batch support

---

### Pattern 4: Computed Fields
**Problem:** Field value depends on other fields

**Boring Solution:**
```python
from odoo import models, fields, api

class MyModel(models.Model):
    _name = 'my.model'

    price = fields.Float()
    quantity = fields.Integer()
    total = fields.Float(compute='_compute_total', store=True)

    @api.depends('price', 'quantity')
    def _compute_total(self):
        for record in self:
            record.total = record.price * record.quantity
```

**Why Boring:**
- Declarative pattern (Odoo standard)
- Auto-recomputes when dependencies change
- `store=True` for performance (database persistence)
- Clear dependency tracking

**Clever Alternative (DON'T USE):**
```python
# Manual calculation on every access (slow, error-prone)
def get_total(self):
    return self.price * self.quantity
```

---

### Pattern 5: Avoid N+1 Queries
**Problem:** Loop causing multiple database queries

**Boring Solution:**
```python
# ❌ BAD (N+1 queries)
for record in records:
    partner_name = record.partner_id.name  # Query per iteration

# ✅ GOOD (Single query with prefetch)
records_with_partners = records.mapped('partner_id')  # Prefetch
for record in records:
    partner_name = record.partner_id.name  # Uses cache

# ✅ BETTER (Read all at once)
partner_names = records.mapped('partner_id.name')
```

**Why Boring:**
- Uses Odoo's prefetch mechanism
- Reduces database round trips
- Standard optimization pattern

---

## View Patterns (Odoo XML)

### Pattern 6: List View (Odoo 18)
**Problem:** Need to display records in table

**Boring Solution:**
```xml
<record id="view_model_list" model="ir.ui.view">
    <field name="name">model.name.list</field>
    <field name="model">model.name</field>
    <field name="arch" type="xml">
        <list string="Model List">
            <field name="name"/>
            <field name="state"/>
            <field name="create_date"/>
        </list>
    </field>
</record>
```

**Why Boring:**
- `<list>` tag (Odoo 18 standard, not deprecated `<tree>`)
- Simple field display
- Default sorting and filtering

**Clever Alternative (DON'T USE):**
```xml
<!-- Using deprecated <tree> tag (Odoo 18 shows warning) -->
<tree string="Model List">
    ...
</tree>
```

---

### Pattern 7: Form View
**Problem:** Need to create/edit record

**Boring Solution:**
```xml
<record id="view_model_form" model="ir.ui.view">
    <field name="name">model.name.form</field>
    <field name="model">model.name</field>
    <field name="arch" type="xml">
        <form string="Model Form">
            <sheet>
                <group>
                    <group>
                        <field name="name"/>
                        <field name="state"/>
                    </group>
                    <group>
                        <field name="date"/>
                        <field name="user_id"/>
                    </group>
                </group>
            </sheet>
        </form>
    </field>
</record>
```

**Why Boring:**
- Standard structure (sheet > group > fields)
- Two-column layout (group within group)
- Clear hierarchy

---

### Pattern 8: Action Definition
**Problem:** Need menu item to open view

**Boring Solution:**
```xml
<!-- Action -->
<record id="action_model_name" model="ir.actions.act_window">
    <field name="name">Model Name</field>
    <field name="res_model">model.name</field>
    <field name="view_mode">list,form</field>
</record>

<!-- Menu -->
<menuitem id="menu_model_name"
          name="Model Name"
          action="action_model_name"
          parent="parent_menu_id"
          sequence="10"/>
```

**Why Boring:**
- Standard action type (`ir.actions.act_window`)
- Clear view mode sequence (list first, then form)
- Menu hierarchy (parent reference)

---

## Python Patterns (General)

### Pattern 9: Input Validation
**Problem:** Need to validate user input

**Boring Solution:**
```python
from odoo import models, api, exceptions

class MyModel(models.Model):
    _name = 'my.model'

    @api.constrains('email')
    def _check_email_format(self):
        for record in self:
            if record.email and '@' not in record.email:
                raise exceptions.ValidationError("Invalid email format")

    @api.constrains('quantity')
    def _check_positive_quantity(self):
        for record in self:
            if record.quantity < 0:
                raise exceptions.ValidationError("Quantity must be positive")
```

**Why Boring:**
- `@api.constrains` decorator (Odoo standard)
- Validates on create/write automatically
- Clear error messages
- Database-level constraint

**Clever Alternative (DON'T USE):**
```python
# Manual validation in every method (error-prone, incomplete)
def some_method(self):
    if self.quantity < 0:
        raise Exception("Bad quantity")
```

---

### Pattern 10: Error Handling
**Problem:** Operation might fail, need graceful handling

**Boring Solution:**
```python
# Specific exception handling
try:
    result = risky_operation()
except FileNotFoundError as e:
    _logger.error(f"File not found: {e}")
    raise exceptions.UserError("Required file is missing")
except PermissionError as e:
    _logger.error(f"Permission denied: {e}")
    raise exceptions.AccessError("Insufficient permissions")

# Catch-all for unexpected errors
try:
    result = complex_operation()
except Exception as e:
    _logger.exception("Unexpected error in complex_operation")
    raise exceptions.UserError("Operation failed. Please contact support.")
```

**Why Boring:**
- Specific exceptions (not generic `except:`)
- User-friendly error messages
- Logging for debugging
- Re-raise with context

**Clever Alternative (DON'T USE):**
```python
# Silent failure (hides errors)
try:
    result = risky_operation()
except:
    result = None  # User doesn't know something went wrong!
```

---

### Pattern 11: Looping with Clear Logic
**Problem:** Need to process list of items

**Boring Solution:**
```python
# Simple iteration
for item in items:
    process(item)

# With index (if needed)
for index, item in enumerate(items):
    print(f"Processing item {index}: {item}")

# List comprehension (for simple transformations)
processed = [transform(item) for item in items]

# Filter with condition
valid_items = [item for item in items if item.is_valid]
```

**Why Boring:**
- Pythonic idioms (widely recognized)
- Clear intent
- Readable by any Python developer

**Clever Alternative (DON'T USE):**
```python
# Nested list comprehensions (hard to read)
result = [[x for x in row if x > 0] for row in matrix if sum(row) > threshold]

# Map/filter chain (less clear than loop)
result = list(map(transform, filter(lambda x: x.is_valid, items)))
```

---

## Installer/Exe Patterns (Python)

### Pattern 12: File Operations
**Problem:** Need to read/write/check files

**Boring Solution:**
```python
from pathlib import Path

# Check file exists
config_file = Path("config.ini")
if config_file.exists():
    content = config_file.read_text()

# Create directory (handles already exists)
output_dir = Path("output")
output_dir.mkdir(parents=True, exist_ok=True)

# Write file (overwrites)
output_file = output_dir / "result.txt"
output_file.write_text("Hello World")

# Read lines
for line in config_file.read_text().splitlines():
    process(line)
```

**Why Boring:**
- `pathlib.Path` (Python 3.4+ standard)
- Cross-platform (Windows/Linux/Mac)
- Clear method names
- Handles errors gracefully

**Clever Alternative (DON'T USE):**
```python
# String concatenation for paths (breaks on Windows)
path = "output/" + filename  # ❌ Wrong on Windows

# Old-style open/close (error-prone)
f = open("file.txt")
content = f.read()
f.close()  # Might not execute if error occurs
```

---

### Pattern 13: Running Commands
**Problem:** Need to execute external command

**Boring Solution:**
```python
import subprocess

# Simple command (raises exception on error)
result = subprocess.run(
    ["python", "-m", "pip", "install", "package"],
    check=True,  # Raises CalledProcessError if non-zero exit
    capture_output=True,
    text=True
)
print(result.stdout)

# Command with error handling
try:
    subprocess.run(["command", "arg"], check=True)
    print("✅ Success")
except subprocess.CalledProcessError as e:
    print(f"❌ Failed: {e}")
    print(f"Output: {e.stderr}")
```

**Why Boring:**
- `subprocess.run()` (Python 3.5+ standard)
- `check=True` for automatic error detection
- Clear success/failure handling

**Clever Alternative (DON'T USE):**
```python
# os.system (returns only exit code, no output capture)
os.system("command arg")  # ❌ Can't capture output

# Shell=True (security risk if user input involved)
subprocess.run("command arg", shell=True)  # ❌ Vulnerable to injection
```

---

### Pattern 14: Configuration Files
**Problem:** Need to store/read configuration

**Boring Solution:**
```python
import configparser
from pathlib import Path

# Write config
config = configparser.ConfigParser()
config['DEFAULT'] = {
    'ServerURL': 'https://example.com',
    'Port': '8080'
}
config['Database'] = {
    'Host': 'localhost',
    'User': 'admin'
}

with open('config.ini', 'w') as f:
    config.write(f)

# Read config
config = configparser.ConfigParser()
config.read('config.ini')

server_url = config['DEFAULT']['ServerURL']
db_host = config['Database']['Host']
```

**Why Boring:**
- `.ini` format (widely used, human-readable)
- `configparser` (Python standard library)
- Key-value sections (organized)

**Clever Alternative (DON'T USE):**
```python
# Custom parser (reinventing wheel)
with open('config.txt') as f:
    for line in f:
        key, value = line.split('=')  # ❌ Breaks on edge cases
```

---

## Performance Patterns

### Pattern 15: Caching (Simple)
**Problem:** Expensive computation called repeatedly with same input

**Boring Solution:**
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_calculation(n):
    # Complex computation
    return result

# Call multiple times (cached after first)
result1 = expensive_calculation(10)  # Computes
result2 = expensive_calculation(10)  # Returns cached
```

**Why Boring:**
- `@lru_cache` decorator (Python stdlib)
- Automatic cache management (LRU eviction)
- Thread-safe

---

### Pattern 16: Batch Processing
**Problem:** Processing many items individually is slow

**Boring Solution:**
```python
# ❌ BAD (One at a time)
for record_id in record_ids:
    record = self.env['model.name'].browse(record_id)
    record.write({'state': 'done'})

# ✅ GOOD (Batch)
records = self.env['model.name'].browse(record_ids)
records.write({'state': 'done'})  # Single SQL UPDATE

# ✅ GOOD (Bulk create)
self.env['model.name'].create([
    {'name': f'Record {i}'} for i in range(100)
])  # Single INSERT with multiple rows
```

**Why Boring:**
- Reduces database round trips
- Uses Odoo's batch capabilities
- Standard optimization pattern

---

## Testing Patterns

### Pattern 17: Simple Unit Test
**Problem:** Need to verify function behavior

**Boring Solution:**
```python
from odoo.tests import TransactionCase

class TestMyModel(TransactionCase):

    def setUp(self):
        super().setUp()
        self.Model = self.env['my.model']

    def test_create_record(self):
        """Test record creation with valid data"""
        record = self.Model.create({'name': 'Test'})
        self.assertTrue(record.exists())
        self.assertEqual(record.name, 'Test')

    def test_validation_error(self):
        """Test constraint raises error on invalid data"""
        with self.assertRaises(exceptions.ValidationError):
            self.Model.create({'quantity': -1})
```

**Why Boring:**
- `TransactionCase` (Odoo test base class)
- Clear test names (describe what's tested)
- One assertion focus per test
- Database rollback automatic

---

## Anti-Patterns (What NOT to Do)

### Anti-Pattern 1: God Method
**Problem:** One method does everything

```python
# ❌ BAD (400 lines, does everything)
def process_order(self, order_data):
    # Validate input (50 lines)
    # Check inventory (100 lines)
    # Calculate pricing (80 lines)
    # Create invoices (70 lines)
    # Send notifications (50 lines)
    # Update analytics (50 lines)
    return result

# ✅ GOOD (Decomposed)
def process_order(self, order_data):
    self._validate_order(order_data)
    self._check_inventory(order_data)
    pricing = self._calculate_pricing(order_data)
    invoice = self._create_invoice(order_data, pricing)
    self._send_notifications(invoice)
    self._update_analytics(invoice)
    return invoice
```

---

### Anti-Pattern 2: Magic Numbers
**Problem:** Unclear constants in code

```python
# ❌ BAD
if user.status == 3:
    send_email(user)

# ✅ GOOD
STATUS_ACTIVE = 3  # Constant at module level
if user.status == STATUS_ACTIVE:
    send_email(user)

# ✅ BETTER (Use Selection field)
state = fields.Selection([
    ('draft', 'Draft'),
    ('active', 'Active'),
    ('archived', 'Archived')
])

if user.state == 'active':
    send_email(user)
```

---

### Anti-Pattern 3: Premature Optimization
**Problem:** Optimizing before measuring

```python
# ❌ BAD (Complex caching without proof it's needed)
class ComplexCache:
    def __init__(self):
        self.cache = {}
        self.ttl = {}
        self.access_count = {}

    def get(self, key):
        # 50 lines of cache logic
        ...

# ✅ GOOD (Simple solution first, measure, then optimize)
results = compute()  # Just compute it
# Later, if measured slow:
@lru_cache(maxsize=128)
def compute():
    ...
```

---

## Pattern Selection Decision Tree

```
Need to solve problem?
│
├─→ Is there a boring pattern in THIS file?
│   └─→ YES → Use it (don't modify)
│
├─→ Is there a built-in function/method?
│   └─→ YES → Use it (don't reimplement)
│
├─→ Is there a Stack Overflow answer with 1000+ upvotes?
│   └─→ YES → Use it (boring = validated by community)
│
└─→ Must write custom solution?
    ├─→ Keep it simple (< 50 lines)
    ├─→ Use clear names
    ├─→ Add to this file for future reference
    └─→ Document why boring pattern didn't exist
```

---

**Remember:** "Every line of code is a liability. Write the minimum boring code to solve the measured problem."
