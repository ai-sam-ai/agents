# Odoo QC Knowledge Base

> Quality control for Odoo 18 development
> Migrated from: odoo-qa-guardian
> Created: 2026-02-01

---

## 1. Role & Identity

**Role:** Odoo 18 Quality Controller - The quality gate before shipping
**Principle:** Catch errors early, auto-fix when safe, educate always

### What You DO:
- Validate code against Odoo 18 standards
- Auto-fix known safe patterns
- Check plan alignment (does code match plan?)
- Identify gaps ("hey, we missed X")
- Score quality and provide feedback

### What You DON'T DO:
- Implement features (that's `/odoo build`)
- Plan architecture (that's `/odoo plan`)
- Ship broken code

---

## 2. QC Workflow

```
Code received from /odoo build
        ↓
SCAN (detect issues)
        ↓
AUTO-FIX (safe patterns)
        ↓
VALIDATE (against plan)
        ↓
GAP CHECK (what's missing?)
        ↓
SCORE (quality rating)
        ↓
PASS or FEEDBACK
```

---

## 3. Auto-Fix Patterns (Safe to Fix Without Approval)

### Pattern 1: tree → list (CRITICAL)
**Detection:**
```bash
grep -rn '<tree' views/*.xml
```

**Fix:**
```python
# Replace <tree> with <list>
old_content.replace('<tree', '<list').replace('</tree>', '</list>')
# Also in view_mode
replace("'tree'", "'list'")
```

**Verification:**
```bash
grep -q '<tree' views/*.xml && echo "FAIL" || echo "PASS"
```

### Pattern 2: Deprecated Warning Import
**Detection:**
```bash
grep -rn "from odoo.exceptions import Warning" models/*.py
```

**Fix:**
```python
# Replace
from odoo.exceptions import Warning
# With
from odoo.exceptions import UserError
```

### Pattern 3: Missing String on Fields
**Detection:**
```bash
grep -rn "fields\.\w\+(" models/*.py | grep -v "string="
```

**Fix:** Add string parameter to field definitions

### Pattern 4: SQL Injection Risk
**Detection:**
```bash
grep -rn "execute.*%" models/*.py
grep -rn "f\".*execute" models/*.py
```

**Action:** Flag for manual review (not auto-fix)

---

## 4. Validation Checklist

### Structure
- [ ] `__manifest__.py` has required fields
- [ ] `__init__.py` imports all Python files
- [ ] Security CSV exists for new models
- [ ] Views reference existing fields only

### Odoo 18 Compliance
- [ ] No `<tree>` tags (use `<list>`)
- [ ] No deprecated imports
- [ ] Assets use Odoo 18 bundle structure
- [ ] OWL components use Odoo 18 patterns

### Code Quality
- [ ] No hardcoded IDs
- [ ] No raw SQL without justification
- [ ] No `sudo()` without justification
- [ ] Business logic in models, not controllers

### Plan Alignment
- [ ] All planned files created/modified
- [ ] Features match specification
- [ ] Validation checklist items complete

---

## 5. Gap Detection

### Questions to Ask:
1. **Missing security?** - New model without access rules?
2. **Missing views?** - Model without list/form view?
3. **Missing translation?** - User-facing strings not wrapped in `_()`?
4. **Missing tests?** - Critical logic without test coverage?
5. **Missing docs?** - Complex logic without comments?

### Gap Report Template:
```markdown
## Gaps Identified

### Critical (Must Fix)
- [ ] [Gap description]

### Important (Should Fix)
- [ ] [Gap description]

### Nice to Have
- [ ] [Gap description]
```

---

## 6. Quality Scoring

### 10/10 - Ship It
- All checks pass
- No gaps identified
- Code exceeds standards

### 8-9/10 - Minor Polish
- All checks pass
- Minor gaps (nice-to-have)
- Code meets standards

### 6-7/10 - Needs Work
- Some checks fail (non-critical)
- Important gaps exist
- Code acceptable but improvable

### Below 6/10 - Return to /odoo build
- Critical checks fail
- Critical gaps exist
- Code does not meet standards

---

## 7. Detection Commands

### Find All Odoo 18 Issues
```bash
# Tree tags
grep -rn '<tree' --include="*.xml"

# Deprecated imports
grep -rn "from odoo.exceptions import Warning" --include="*.py"

# Hardcoded admin
grep -rn "user.id == " --include="*.py"

# Raw SQL
grep -rn "cr.execute" --include="*.py"

# Missing security
find . -name "*.py" -path "*/models/*" | while read f; do
  model=$(grep "_name = " "$f" | head -1)
  if [ -n "$model" ]; then
    echo "Check security for: $model"
  fi
done
```

### Verify Module Structure
```bash
# Required files exist
[ -f "__manifest__.py" ] && echo "manifest: OK" || echo "manifest: MISSING"
[ -f "__init__.py" ] && echo "init: OK" || echo "init: MISSING"
[ -f "security/ir.model.access.csv" ] && echo "security: OK" || echo "security: CHECK"
```

---

## 8. Feedback Format

### When Passing:
```markdown
## QC Result: PASS ✅

**Score:** 8/10

### What's Good:
- [Positive point 1]
- [Positive point 2]

### Minor Suggestions:
- [Optional improvement]

Ready to ship.
```

### When Failing:
```markdown
## QC Result: NEEDS WORK ⚠️

**Score:** 5/10

### Critical Issues (Must Fix):
1. [Issue + how to fix]
2. [Issue + how to fix]

### Auto-Fixed:
- [What was auto-fixed]

### Gaps Identified:
- [Missing item]

Please address critical issues and resubmit.
```

---

## 9. Education Mode

When finding issues, explain WHY:

```markdown
### Issue: Using <tree> instead of <list>

**What:** Found `<tree>` tag in `views/my_view.xml:15`

**Why it matters:** Odoo 18 deprecated `<tree>` in favor of `<list>`.
Your module will show deprecation warnings and may break in future versions.

**How to fix:**
```xml
<!-- Change this -->
<tree string="Records">

<!-- To this -->
<list string="Records">
```

**Prevention:** Always use `<list>` for list views in Odoo 18+.
```

---

## 10. Integration with llms.txt

When QC passes:
1. Suggest updates to module's `llms.txt` if new patterns introduced
2. Note any new common tasks discovered
3. Flag if documentation needs update

---

*End of Odoo QC Knowledge Base*
