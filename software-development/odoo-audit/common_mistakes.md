# Common Odoo Development Mistakes

## Recurring Issues to Track

### 1. Inheritance Mistakes
**Problem:** Copying entire standard model instead of inheriting
```python
# ❌ WRONG
class SaleOrder(models.Model):
    _name = 'sale.order'  # Overwrites standard model!

# ✅ CORRECT
class SaleOrder(models.Model):
    _inherit = 'sale.order'
```

### 2. Security Oversights
**Problem:** Creating models without access rights
- Every model needs `ir.model.access.csv` entry
- Sensitive data needs record rules
- Check: `security/ir.model.access.csv` has ALL custom models

### 3. SQL Injection Vulnerabilities
**Problem:** String formatting in SQL queries
```python
# ❌ WRONG
self.env.cr.execute(f"SELECT * FROM table WHERE id = {user_input}")

# ✅ CORRECT
self.env.cr.execute("SELECT * FROM table WHERE id = %s", (user_input,))
```

### 4. N+1 Query Problems
**Problem:** Loops that trigger repeated database queries
```python
# ❌ WRONG
for order in orders:
    print(order.partner_id.name)  # Query per iteration!

# ✅ CORRECT
orders_data = orders.read(['partner_id'])  # Single query
```

### 5. Hardcoded File Paths
**Problem:** Absolute paths that break on different systems
```python
# ❌ WRONG
file_path = 'C:\\Users\\myuser\\odoo\\addons\\...'

# ✅ CORRECT
import os
module_path = os.path.dirname(__file__)
file_path = os.path.join(module_path, 'data', 'file.txt')
```

### 6. Missing Dependencies
**Problem:** Using features from modules not listed in manifest
```python
# Using account.move but 'account' not in depends

# ✅ CORRECT __manifest__.py
'depends': ['base', 'account', 'sale'],
```

### 7. Wrong Field Types
**Problem:** Using Char for relational data
```python
# ❌ WRONG
partner_name = fields.Char()  # Stores name as string

# ✅ CORRECT
partner_id = fields.Many2one('res.partner')  # Relational link
```

### 8. Compute Without Store
**Problem:** Expensive computed fields recalculated constantly
```python
# ❌ WRONG (for frequently accessed fields)
total = fields.Float(compute='_compute_total')

# ✅ CORRECT
total = fields.Float(compute='_compute_total', store=True)
```

### 9. Missing @api.depends
**Problem:** Computed fields that don't update
```python
# ❌ WRONG
def _compute_total(self):
    self.total = sum(self.line_ids.mapped('price'))

# ✅ CORRECT
@api.depends('line_ids.price')
def _compute_total(self):
    self.total = sum(self.line_ids.mapped('price'))
```

### 10. Controller Business Logic
**Problem:** Complex logic in controllers instead of models
```python
# ❌ WRONG - Controller has business logic
@http.route('/calculate', type='json')
def calculate(self, values):
    result = complex_calculation(values)  # Logic here!
    return result

# ✅ CORRECT - Logic in model
@http.route('/calculate', type='json')
def calculate(self, values):
    return request.env['my.model'].calculate(values)  # Model handles it
```

## PostgreSQL Setup Issues

### Connection Problems
- **Wrong user permissions** - `odoo_user` needs CREATEDB
- **Missing password** - Check `pg_hba.conf` authentication
- **Port conflicts** - Default 5432 may be in use
- **Service not running** - Verify PostgreSQL service status

### Odoo Configuration Issues
- **db_host** - Use 'localhost' not '127.0.0.1' on Windows
- **db_user/db_password** - Must match PostgreSQL user
- **Missing addons_path** - Modules not found

## Session-Start Document Gaps

### What Should Be There (But Often Isn't)
1. **Explicit inheritance rules** - When to use `_inherit` vs `_name`
2. **Security checklist** - Mandatory for all models
3. **PostgreSQL setup verification** - Test connection steps
4. **File path conventions** - No hardcoding allowed
5. **Query optimization rules** - Always use batch operations
6. **Required manifest fields** - Don't skip any
7. **Testing expectations** - When to test before proceeding
8. **Git commit rules** - What NOT to commit (*.pyc, __pycache__)

### Drift Prevention Strategies
- **Clear architectural boundaries** - ai_brain vs ai_sam roles
- **File creation policy** - Where new files go
- **Naming conventions** - Consistent across project
- **Error handling patterns** - Standard try/except structure
- **Logging standards** - What to log and where
