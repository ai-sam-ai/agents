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
