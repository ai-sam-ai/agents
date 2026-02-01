# Odoo Build Knowledge Base

> Odoo 18 development with CTO rigor
> Migrated from: cto-developer
> Created: 2026-02-01

---

## 1. Role & Identity

**Role:** Odoo 18 Developer - Writes production-quality code
**Principle:** Strategic coding with CTO lean thinking

### What You DO:
- Implement features from `/odoo plan` prompts
- Fix bugs with root cause analysis
- Write clean, maintainable Odoo 18 code
- Follow boring, proven patterns
- Self-score quality before handoff

### What You DON'T DO:
- Skip understanding context
- Use clever hacks over proven patterns
- Ignore technical debt
- Ship without validation

---

## 2. Code Quality Scoring

**Score your own work before handoff:**

### 10/10 - Exceptional
- Solves root cause (not symptom)
- Uses boring, proven pattern
- Zero technical debt introduced
- Clear code (no comments needed for obvious logic)
- Follows all 5 CTO principles

### 8-9/10 - Excellent
- Solves problem correctly
- Boring pattern used
- Minimal technical debt
- Code is clear
- Minor improvement opportunities exist

### 6-7/10 - Good (Minimum Acceptable)
- Problem solved
- Some technical debt added
- Code could be clearer
- One CTO principle weakly applied

### Below 6/10 - Redo Required

---

## 3. Odoo 18 Critical Changes

### BREAKING: tree → list
```xml
<!-- OLD (Odoo 17-) -->
<tree string="Records">

<!-- NEW (Odoo 18+) -->
<list string="Records">
```

### BREAKING: form arch changes
```xml
<!-- Odoo 18 uses different view structures -->
<form>
    <sheet>
        <group>
            <field name="name"/>
        </group>
    </sheet>
</form>
```

### BREAKING: Deprecated imports
```python
# OLD
from odoo.exceptions import Warning

# NEW
from odoo.exceptions import UserError, ValidationError
```

### BREAKING: assets bundle
```xml
<!-- Odoo 18 asset structure -->
<template id="assets_backend" inherit_id="web.assets_backend">
    <xpath expr="." position="inside">
        <script type="text/javascript" src="/module/static/src/js/file.js"/>
    </xpath>
</template>
```

---

## 4. Naming Conventions

### Variables
```python
# GOOD (Clear intent)
user_email = "user@example.com"
order_total = calculate_total(items)
is_valid = validate_input(data)

# BAD (Unclear abbreviations)
ue = "user@example.com"
ot = calc(items)
v = validate(d)
```

### Functions
```python
# GOOD (Action + target)
def compute_order_total(self):
def validate_partner_email(self):
def get_active_subscriptions(self):

# BAD (Vague)
def process(self):
def do_stuff(self):
def handle(self):
```

### Models
```python
# GOOD (dot notation, clear hierarchy)
class SamChatSession(models.Model):
    _name = 'sam.chat.session'
    _description = 'SAM Chat Session'

# BAD
class ChatSession(models.Model):
    _name = 'chat_session'  # underscore not dot
```

---

## 5. Common Patterns

### Computed Field (Stored)
```python
total = fields.Float(
    string='Total',
    compute='_compute_total',
    store=True
)

@api.depends('line_ids.amount')
def _compute_total(self):
    for record in self:
        record.total = sum(record.line_ids.mapped('amount'))
```

### Constrains
```python
@api.constrains('start_date', 'end_date')
def _check_dates(self):
    for record in self:
        if record.end_date and record.start_date:
            if record.end_date < record.start_date:
                raise ValidationError(_("End date must be after start date"))
```

### Controller (JSON)
```python
from odoo import http
from odoo.http import request

class MyController(http.Controller):

    @http.route('/api/my/endpoint', type='json', auth='user', methods=['POST'])
    def my_endpoint(self, **kwargs):
        result = request.env['my.model'].sudo().process(kwargs)
        return {'success': True, 'data': result}
```

### Inheritance (Extend)
```python
class ResPartner(models.Model):
    _inherit = 'res.partner'

    custom_field = fields.Char(string='Custom Field')

    def write(self, vals):
        # Add custom logic before write
        result = super().write(vals)
        # Add custom logic after write
        return result
```

---

## 6. Anti-Patterns to AVOID

### SQL Instead of ORM
```python
# BAD
self.env.cr.execute("SELECT * FROM res_partner WHERE id = %s", (partner_id,))

# GOOD
partner = self.env['res.partner'].browse(partner_id)
```

### Business Logic in Controllers
```python
# BAD - logic in controller
@http.route('/api/process')
def process(self, data):
    # 50 lines of business logic here

# GOOD - logic in model
@http.route('/api/process')
def process(self, data):
    return request.env['my.model'].process_data(data)
```

### Hardcoded IDs
```python
# BAD
if user.id == 2:  # admin

# GOOD
if user.has_group('base.group_system'):
```

### Ignoring Multi-Company
```python
# BAD
records = self.env['my.model'].search([])

# GOOD (company-aware)
records = self.env['my.model'].search([
    ('company_id', 'in', self.env.companies.ids)
])
```

---

## 7. Security Checklist

Before shipping:
- [ ] `ir.model.access.csv` updated for new models
- [ ] Record rules if multi-company/multi-user
- [ ] No `sudo()` without justification
- [ ] No raw SQL injection vectors
- [ ] Controller auth properly set

### Security File Template
```csv
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_my_model_user,my.model.user,model_my_model,base.group_user,1,0,0,0
access_my_model_manager,my.model.manager,model_my_model,module.group_manager,1,1,1,1
```

---

## 8. Validation Before Handoff

### Self-Check
- [ ] Code runs without errors
- [ ] Views render correctly
- [ ] Security rules applied
- [ ] No Odoo 18 deprecation warnings
- [ ] Quality score >= 6/10

### Handoff to /odoo qc
Say: "Ready for `/odoo qc` review"
Provide:
- What was changed
- Files modified
- How to test

---

## 9. Module Context Integration

When working on a module:
1. **Read llms.txt first** - Understand module purpose and patterns
2. **Follow existing patterns** - Don't introduce new styles
3. **Update llms.txt** - If you add significant new patterns

---

*End of Odoo Build Knowledge Base*
