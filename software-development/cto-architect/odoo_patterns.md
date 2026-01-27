# Odoo 18 Architectural Patterns

## Common Solutions to Common Problems

### Pattern 1: Wizard for Multi-Step Process
**When to use:** User needs to complete several steps with validation between each

**Structure:**
```
wizards/
  my_wizard.py       # TransientModel
views/
  my_wizard_views.xml  # Form with steps
```

**Example:** Import data, configure settings, generate reports

**Pros:** Clean UX, step validation, cancellable
**Cons:** More code than single form

---

### Pattern 2: Computed Field
**When to use:** Field value derived from other fields

**Example:**
```python
total = fields.Float(compute='_compute_total', store=True)

@api.depends('line_ids.amount')
def _compute_total(self):
    for record in self:
        record.total = sum(record.line_ids.mapped('amount'))
```

**Store=True:** Use if field is searched/filtered often
**Store=False:** Use if rarely needed, changes frequently

---

### Pattern 3: Server Action + Scheduled Action
**When to use:** Background processing, periodic tasks

**Server Action:** User-triggered (button click)
**Scheduled Action:** Time-triggered (cron)

**Example:** Send daily report emails, cleanup old records

---

### Pattern 4: Controller + JSON Endpoint
**When to use:** External API, AJAX from frontend

**Structure:**
```python
@http.route('/my/api/endpoint', type='json', auth='user')
def my_endpoint(self, **kwargs):
    # Business logic in model
    result = request.env['my.model'].process_data(kwargs)
    return {'status': 'success', 'data': result}
```

**Auth options:** 'user' (logged in), 'public' (anyone)

---

### Pattern 5: OWL Component for Rich UI
**When to use:** Interactive frontend (drag-drop, canvas, graphs)

**Structure:**
```
static/src/
  components/
    my_component/
      my_component.js   # OWL component
      my_component.xml  # Template
      my_component.scss # Styles
```

**Example:** Canvas editor, dashboard widgets, interactive forms

---

### Pattern 6: Inheritance - Extend Existing Model
**When to use:** Add fields/methods to standard Odoo models

**Example:**
```python
class ResPartner(models.Model):
    _inherit = 'res.partner'

    custom_field = fields.Char("My Field")

    def my_method(self):
        # New functionality
        pass
```

**Never:** Copy entire standard model
**Always:** Use `_inherit`

---

### Pattern 7: Related Field
**When to use:** Surface field from related record

**Example:**
```python
partner_id = fields.Many2one('res.partner')
partner_email = fields.Char(related='partner_id.email', store=True)
```

**Store=True:** Creates DB column, faster reads
**Store=False:** Computed on-the-fly

---

### Pattern 8: Constrains for Validation
**When to use:** Enforce business rules

**Example:**
```python
@api.constrains('start_date', 'end_date')
def _check_dates(self):
    for record in self:
        if record.end_date < record.start_date:
            raise ValidationError("End date must be after start date")
```

**Runs:** On create/write of constrained fields

---

### Pattern 9: Onchange for UI Feedback
**When to use:** Update fields based on user input (before save)

**Example:**
```python
@api.onchange('partner_id')
def _onchange_partner_id(self):
    if self.partner_id:
        self.email = self.partner_id.email
```

**Use sparingly:** Can slow down UI if complex

---

### Pattern 10: Selection Field for Status
**When to use:** Workflow states

**Example:**
```python
state = fields.Selection([
    ('draft', 'Draft'),
    ('confirmed', 'Confirmed'),
    ('done', 'Done'),
    ('cancelled', 'Cancelled')
], default='draft')
```

**Combine with:** `states` attribute on fields to show/hide

---

## Odoo Architecture Layers

```
┌─────────────────────────────────────┐
│  Views (XML) - UI Layer             │
├─────────────────────────────────────┤
│  Controllers - HTTP Endpoints       │
├─────────────────────────────────────┤
│  Models - Business Logic            │
├─────────────────────────────────────┤
│  ORM - Database Abstraction         │
├─────────────────────────────────────┤
│  PostgreSQL - Data Storage          │
└─────────────────────────────────────┘
```

**Principle:** Business logic in models, not controllers

---

## Decision Matrix: Which Pattern?

| Need | Pattern | Complexity |
|------|---------|-----------|
| Multi-step user process | Wizard | Medium |
| Derived value | Computed Field | Low |
| Background task | Scheduled Action | Low |
| External API | Controller | Medium |
| Rich UI interaction | OWL Component | High |
| Extend standard model | Inheritance | Low |
| Show related data | Related Field | Low |
| Enforce rule | Constrains | Low |
| Live form update | Onchange | Low |
| Workflow stages | Selection + States | Low |

---

## Your Project-Specific Patterns

### Pattern A: Three-Layer Architecture
```
ai_brain (data) → ai_sam (framework) → branches (features)
```

**Rule:**
- ai_brain = Models ONLY (no views, controllers)
- ai_sam = Framework (controllers, JS, common views)
- Branches = Specific features

### Pattern B: Canvas Skeleton Architecture
```
Skeleton Core (universal) + Platform Skins (unique)
```

**Rule:**
- Skeleton = Platform-agnostic (sizing, rendering)
- Platforms = Specific renderers (Poppy, Memory, Automator)
- New platform = New renderer class, NO core changes

### Pattern C: Floating Files Organization
```
claudes floating files/
  bat/
  json/
  misc/
  py/
  xml/
  prompts/  # Save reusable prompts here!
```

**Rule:** New experimental files go here first, organized by type

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Business Logic in Controllers
**Bad:**
```python
@http.route('/process', type='json')
def process(self, data):
    # Complex logic here (100 lines)
    return result
```

**Good:**
```python
@http.route('/process', type='json')
def process(self, data):
    return request.env['my.model'].process(data)  # Logic in model
```

### ❌ Anti-Pattern 2: SQL Instead of ORM
**Bad:**
```python
self.env.cr.execute("SELECT * FROM my_table WHERE id = %s" % record_id)
```

**Good:**
```python
record = self.env['my.model'].browse(record_id)
```

**Exception:** Complex queries where ORM is inefficient (rare)

### ❌ Anti-Pattern 3: Overriding Instead of Inheriting
**Bad:** Copy entire standard model and modify

**Good:** Inherit and add/override specific parts

### ❌ Anti-Pattern 4: God Models
**Bad:** Single model with 100+ fields and 50+ methods

**Good:** Split into related models with proper relations

### ❌ Anti-Pattern 5: Hardcoded Values
**Bad:**
```python
if user.id == 42:  # Hardcoded admin user
```

**Good:**
```python
if user.has_group('base.group_system'):
```

---

## Quick Reference: Common Tasks

### Add field to existing model
→ **Pattern 6: Inheritance**

### Multi-step wizard for user
→ **Pattern 1: Wizard**

### Auto-calculate total from lines
→ **Pattern 2: Computed Field**

### Daily email report
→ **Pattern 3: Scheduled Action**

### JavaScript widget
→ **Pattern 5: OWL Component**

### Validate date range
→ **Pattern 8: Constrains**

### Update email when partner changes
→ **Pattern 9: Onchange**

### Workflow (draft → confirmed → done)
→ **Pattern 10: Selection + States**
