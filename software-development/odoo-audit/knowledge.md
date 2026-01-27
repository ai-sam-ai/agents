# odoo-audit Knowledge Base

> Consolidated knowledge for the odoo-audit Agent
> Source: odoo-audit/
> Generated: 2026-01-28
>
> Original files:
> - common_mistakes.md
> - quality_standards.md
> - scoring_rubric.md
> - session_optimization.md

---

## 1. Common Mistakes

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

---

## 2. Quality Standards

# Odoo 18 Quality Standards

## Module Structure
- `__manifest__.py` - Complete metadata (version, author, dependencies)
- `models/` - All Python model files
- `views/` - XML view definitions
- `security/` - `ir.model.access.csv` and record rules
- `data/` - Demo/default data files
- `static/` - JS/CSS/images organized by type
- `controllers/` - HTTP controllers
- `wizards/` - Transient models

## Code Quality Rules

### Models (`models/`)
- ✅ Use `_inherit` to extend, never copy standard models
- ✅ Always define `_name`, `_description`, `_order`
- ✅ Use proper field types (Many2one, One2many, etc.)
- ✅ Add `help` text for complex fields
- ✅ Use `@api.depends` for computed fields
- ✅ Use `@api.constrains` for validation
- ❌ No SQL injection - always use parameterized queries
- ❌ No direct `cr.execute()` without proper escaping
- ❌ Avoid heavy computation in `@api.onchange`

### Security (`security/`)
- ✅ `ir.model.access.csv` for ALL custom models
- ✅ Record rules for row-level security
- ✅ Proper group assignments (user, manager, admin)
- ❌ Never grant full access without justification

### Views (`views/`)
- ✅ Form, tree, search views for each model
- ✅ Proper view inheritance using `inherit_id`
- ✅ Meaningful `arch` structure (groups, notebooks, pages)
- ✅ Use `groups` attribute for field-level security
- ❌ No duplicate view definitions
- ❌ No hardcoded IDs - use `ref()`

### JavaScript (`static/src/js/`)
- ✅ Use Odoo OWL framework properly
- ✅ Proper RequireJS/ES6 module structure
- ✅ Register widgets/components correctly
- ✅ Clean event handling (no memory leaks)
- ❌ No jQuery for new code (Odoo 18 uses OWL)
- ❌ No global variables

### Controllers (`controllers/`)
- ✅ Proper route decorators (`@http.route`)
- ✅ Authentication (`auth='user'` or `auth='public'`)
- ✅ CSRF protection where needed
- ✅ JSON responses for APIs
- ❌ No business logic in controllers (belongs in models)

### Performance
- ✅ Use `search_read()` instead of `search()` + `read()`
- ✅ Batch operations with `create()`, `write()`
- ✅ Proper indexing on searchable fields
- ✅ Use `prefetch` for related fields
- ❌ No N+1 queries in loops
- ❌ Avoid unnecessary `flush()` calls

### Dependencies (`__manifest__.py`)
- ✅ Minimal dependencies listed
- ✅ Correct dependency versions
- ✅ No circular dependencies
- ❌ No unused dependencies

## Anti-Patterns to Flag
1. **Database Commits in Loops** - Batch instead
2. **Missing Translations** - Use `_()` for user-facing strings
3. **Hardcoded Paths** - Use Odoo resource APIs
4. **Copy-Paste Code** - Extract to shared methods
5. **God Models** - Models with 50+ fields/methods
6. **Magic Numbers** - Use named constants
7. **Missing Error Handling** - Wrap external calls
8. **Unused Imports** - Clean up imports
9. **Inconsistent Naming** - Follow PEP8
10. **Missing Docstrings** - Document complex methods

---

## 3. Scoring Rubric

# Odoo Module Scoring Rubric (1-10)

## Scoring Breakdown

### 10/10 - Production Excellence
- Perfect module structure
- Complete security (access rights + record rules)
- Comprehensive tests (80%+ coverage)
- No anti-patterns detected
- Performance optimized
- Full documentation
- Zero technical debt

### 8-9/10 - Production Ready
- Proper module structure
- Security implemented
- Most best practices followed
- Minor optimization opportunities
- Basic documentation
- 1-3 small issues

### 6-7/10 - Functional But Needs Work
- Module works correctly
- Basic security present
- Several anti-patterns found
- Performance concerns
- Missing documentation
- 4-8 medium issues

### 4-5/10 - Development Stage
- Core functionality works
- Security gaps exist
- Many anti-patterns
- Performance problems
- Poor documentation
- 9-15 issues

### 2-3/10 - Prototype Quality
- Basic features only
- Significant security holes
- Code smells everywhere
- No optimization
- No documentation
- 16+ issues

### 1/10 - Broken/Incomplete
- Missing critical components
- Won't install or crashes
- No security
- Unusable state

## Scoring Categories (Weight)

### 1. Structure & Organization (15%)
- Proper folder structure
- Clean file organization
- Logical naming conventions
- Manifest completeness

### 2. Security (25%)
- Access rights coverage
- Record rules
- Input validation
- CSRF/SQL injection prevention

### 3. Code Quality (20%)
- Follows Odoo conventions
- No anti-patterns
- Clean inheritance
- Proper decorators
- Error handling

### 4. Performance (15%)
- Query optimization
- No N+1 queries
- Proper indexing
- Efficient algorithms

### 5. Maintainability (15%)
- Documentation
- Code clarity
- DRY principle
- Testability

### 6. Functionality (10%)
- Features work correctly
- Edge cases handled
- User experience

## Example Scoring

**Module Score: 7.2/10**

Breakdown:
- Structure: 14/15 (93%) - Minor: Missing demo data
- Security: 20/25 (80%) - Missing record rules for 2 models
- Code Quality: 16/20 (80%) - 3 anti-patterns found
- Performance: 11/15 (73%) - N+1 query in report generation
- Maintainability: 10/15 (67%) - Sparse documentation
- Functionality: 9/10 (90%) - Works well, one edge case bug

**Issues Found:** 7 total
- 2 High (security gaps)
- 3 Medium (performance, anti-patterns)
- 2 Low (documentation)

---

## 4. Session Optimization

# Session-Start Document Optimization Guide

## Purpose
Analyze [session-start.md](C:\Users\total\.claude\commands\session-start.md) and identify gaps that lead to repeated mistakes and Claude drift.

## What to Check

### 1. Missing Constraint Rules
**Look for:** Mistakes that happen repeatedly across sessions
**Action:** Add explicit "NEVER" or "ALWAYS" rules

Example:
```markdown
### Code Creation Rules
- ✅ ALWAYS use `_inherit` to extend Odoo models
- ❌ NEVER create models with `_name` matching standard models
- ✅ ALWAYS add security rules for custom models
```

### 2. Environmental Setup Gaps
**Look for:** PostgreSQL/Odoo connection issues recurring
**Action:** Add verification steps

Example:
```markdown
### PostgreSQL Verification Required
Before proceeding, verify:
1. PostgreSQL service running: `sc query postgresql-x64-15`
2. User exists with CREATEDB: `psql -U postgres -c "\du odoo_user"`
3. Test connection: `psql -U odoo_user -d postgres -c "SELECT 1"`
```

### 3. Vague Architecture Guidelines
**Look for:** Confusion about where code belongs
**Action:** Add decision trees

Example:
```markdown
### File Placement Decision Tree
- Data model definition → `ai_brain/models/`
- Business logic method → `ai_brain/models/` (same model file)
- HTTP endpoint → `ai_sam/controllers/`
- JavaScript widget → `ai_sam/static/src/js/`
- View definition → `ai_sam/views/`
```

### 4. Weak Anti-Pattern Warnings
**Look for:** Same code smells appearing repeatedly
**Action:** Elevate to prominent warnings with examples

Example:
```markdown
## 🚨 CRITICAL: SQL Injection Prevention
❌ NEVER do this:
```python
cr.execute(f"DELETE FROM table WHERE id = {user_id}")
```

✅ ALWAYS do this:
```python
cr.execute("DELETE FROM table WHERE id = %s", (user_id,))
```
```

### 5. Missing Context Anchors
**Look for:** Claude forgetting project specifics mid-session
**Action:** Add prominent reminders about unique aspects

Example:
```markdown
## 🎯 THIS PROJECT IS UNIQUE
- We use **Canvas Skeleton Architecture** (ONE core, MANY skins)
- All new files go to `claudes floating files/` FIRST
- We score work out of 10 before proceeding
- We update session-start when patterns emerge
```

### 6. Insufficient Testing Triggers
**Look for:** Bugs discovered after implementation
**Action:** Add "must test before" checkpoints

Example:
```markdown
### Testing Checkpoints
Before marking complete, MUST test:
- [ ] Module installs without errors
- [ ] All models have security rules
- [ ] No SQL injection vulnerabilities
- [ ] Browser console has no errors
- [ ] Forms load and save correctly
```

### 7. Unclear Success Criteria
**Look for:** Ambiguous task completion definitions
**Action:** Define "done" explicitly

Example:
```markdown
### Definition of Done
A task is ONLY complete when:
1. Code written and tested
2. No errors in logs
3. Security verified
4. Documentation updated
5. Session-start updated if new patterns found
```

## Audit Output Format

When auditing, provide:

### Session-Start Gap Analysis
```markdown
## 🔍 Gaps Found in session-start.md

### Critical Gaps (Add Immediately)
1. **Missing: SQL Injection Prevention**
   - Found 3 instances of unsafe `cr.execute()` in current code
   - Recommendation: Add to mandatory code quality section

2. **Missing: Security Rule Requirement**
   - 2 models created without access rights in past sessions
   - Recommendation: Add to checklist before model creation

### Medium Priority Gaps
3. **Weak: File Path Conventions**
   - Current: Brief mention
   - Found: 5 instances of hardcoded paths in past 3 sessions
   - Recommendation: Upgrade to prominent warning with examples

### Drift Prevention Improvements
4. **Add: Mid-Session Context Anchors**
   - Claude forgets Canvas Skeleton architecture after 50+ exchanges
   - Recommendation: Add visual reminder at top of document

### Proposed Additions
[Specific markdown to add to session-start.md]
```

## Success Metrics

Session-start optimization is successful when:
- ✅ Same mistake doesn't repeat across sessions
- ✅ Claude maintains context through long sessions
- ✅ New developers onboard faster
- ✅ Fewer "wait, why did we do it this way?" moments
- ✅ Code review catches issues BEFORE implementation

---

*End of Knowledge Base*
