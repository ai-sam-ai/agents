# Prompt Writing Guide for Developer Sessions

## Purpose
Write prompts that developers (human or AI) can execute flawlessly.

## The Perfect Developer Prompt

### Structure
```markdown
# [Feature/Task Name]

## Context (Why)
[1-3 paragraphs explaining the business/technical problem]

## Goal (What)
[1-2 sentences: clear, measurable outcome]

## Approach (How)
[High-level technical strategy]

## Implementation Details

### Step 1: [Component Name]
**What:** [What to build]
**Why:** [Reasoning]
**How:** [Specific instructions]

**Code Location:** `path/to/file.py`

**Example/Pattern:**
```python
# Show a small example if helpful
```

### Step 2: [Next Component]
[Repeat structure]

## Files Affected
**Create:**
- `new/file/path.py` - Purpose
- `another/new/file.xml` - Purpose

**Modify:**
- `existing/file.py` - Add method X
- `manifest.py` - Update dependencies

## Validation
- [ ] Specific test 1
- [ ] Specific test 2
- [ ] Specific test 3

## Success Criteria
- User can do X
- System behaves Y
- Performance is Z

## Notes & Warnings
- Watch out for X
- Don't forget Y
- Remember to update Z
```

## Prompt Writing Principles

### 1. Context First
**Bad:** "Add a field to the model"
**Good:** "Users need to track project budgets. Currently, projects have no budget field, causing manual tracking in spreadsheets. Add a budget field to the project model so users can see it in the form view."

**Why:** Context prevents misunderstandings and helps developer make better decisions.

### 2. Specific, Not Vague
**Bad:** "Make it better"
**Good:** "Reduce query time from 2s to <200ms by replacing the loop with a batch read()"

**Why:** Vague prompts lead to vague implementations.

### 3. Examples Over Explanations
**Bad:** "Use the computed field pattern"
**Good:**
```python
@api.depends('line_ids.amount')
def _compute_total(self):
    for record in self:
        record.total = sum(record.line_ids.mapped('amount'))
```

**Why:** Code examples are unambiguous.

### 4. Testable Outcomes
**Bad:** "The feature should work"
**Good:**
- [ ] Form loads without console errors
- [ ] Clicking save creates database record
- [ ] Field validation shows error for negative values

**Why:** Clear validation prevents incomplete work.

### 5. Reference Existing Code
**Bad:** "Create a wizard"
**Good:** "Create a wizard similar to `ai_brain/wizards/context_wizard.py` but for managing workflows instead of contexts"

**Why:** Developers learn patterns from existing code.

## Prompt Templates

### Template 1: New Model
```markdown
# Create [Model Name] Model

## Context
[Why this model is needed]

## Model Definition
**File:** `models/my_model.py`

**Fields:**
- `name` (Char, required) - Display name
- `description` (Text) - Detailed description
- `partner_id` (Many2one: res.partner) - Related customer
- `total` (Float, computed) - Calculated from line_ids

**Methods:**
- `_compute_total()` - Sum of line amounts

**Inheritance:** Inherits from `mail.thread` for messaging

## Security
**File:** `security/ir.model.access.csv`

Add rows for:
- `model_my_model_user` - Read access
- `model_my_model_manager` - Full access

## Views
**File:** `views/my_model_views.xml`

Create:
1. Form view - All fields, notebook with tab for lines
2. Tree view - name, partner_id, total
3. Search view - Filter by partner

## Manifest
Update `__manifest__.py`:
- Add `'mail'` to depends
- Add `'data': ['security/ir.model.access.csv', 'views/my_model_views.xml']`

## Validation
- [ ] Install module without errors
- [ ] Create new record via UI
- [ ] Computed field updates correctly
- [ ] Messaging tab appears (from mail.thread)
```

### Template 2: Add Feature to Existing Model
```markdown
# Add [Feature Name] to [Model Name]

## Context
[Current limitation and why feature is needed]

## Changes Required

### 1. Model Changes
**File:** `models/existing_model.py`

**Add fields:**
- `new_field` (Selection) - Choices: [('a', 'A'), ('b', 'B')]

**Add methods:**
```python
def action_do_something(self):
    """Button action to process records"""
    for record in self:
        # Implementation here
        pass
```

### 2. View Changes
**File:** `views/existing_model_views.xml`

**Modify form view (xpath):**
```xml
<field name="arch" type="xml">
    <xpath expr="//field[@name='existing_field']" position="after">
        <field name="new_field"/>
    </xpath>
    <xpath expr="//sheet" position="inside">
        <button name="action_do_something" type="object" string="Do Something"/>
    </xpath>
</field>
```

## Validation
- [ ] New field appears in form
- [ ] Button works without errors
- [ ] Data saves correctly
```

### Template 3: Bug Fix
```markdown
# Fix [Bug Description]

## Problem
**Symptom:** [What's happening]
**Expected:** [What should happen]
**Root Cause:** [Why it's broken]

## Solution
[High-level fix strategy]

## Implementation

### File: `path/to/buggy_file.py`

**Find this code (around line X):**
```python
# Buggy code here
```

**Replace with:**
```python
# Fixed code here
```

**Why this fixes it:**
[Explanation of the fix]

## Validation
- [ ] Reproduce original bug (should fail)
- [ ] Apply fix
- [ ] Test again (should pass)
- [ ] Test edge cases: [list them]
```

### Template 4: Performance Optimization
```markdown
# Optimize [Component Name] Performance

## Current State
**Performance:** [Current metrics - e.g., "2.5s per request"]
**Bottleneck:** [Where the slowness is]

## Target
**Performance Goal:** [e.g., "<200ms per request"]

## Optimization Strategy
[Approach - e.g., "Replace N+1 queries with batch read"]

## Implementation

### Change 1: [What to optimize]
**File:** `path/to/file.py`

**Before:**
```python
# Slow code
for record in records:
    print(record.partner_id.name)  # N+1 query!
```

**After:**
```python
# Fast code
records_data = records.read(['partner_id'])  # Single query
```

## Measurement
**Before optimization:**
- [ ] Measure: `python -m cProfile script.py`
- [ ] Record baseline: X seconds

**After optimization:**
- [ ] Measure again
- [ ] Compare: Should be Y% faster
```

## Prompt Quality Checklist

Before handing prompt to developer, verify:

- [ ] **Clear goal** - Single sentence describing outcome
- [ ] **Sufficient context** - Developer understands "why"
- [ ] **Specific files** - Exact paths mentioned
- [ ] **Code examples** - Patterns shown, not just described
- [ ] **Validation steps** - How to verify it works
- [ ] **No ambiguity** - Every instruction is clear
- [ ] **Right scope** - Not too big, not too small
- [ ] **Dependencies noted** - What must exist first
- [ ] **Risks mentioned** - What could go wrong
- [ ] **Exit criteria** - When is it "done"

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Over-Specification
**Bad:** "On line 42, change the variable name from `x` to `result`, then on line 45..."

**Why bad:** Too prescriptive, doesn't allow developer judgment

**Better:** "Rename variables for clarity (e.g., `x` → `result`)"

### ❌ Anti-Pattern 2: Under-Specification
**Bad:** "Make the UI better"

**Why bad:** No clear direction

**Better:** "Add visual feedback when save button is clicked (e.g., spinner icon, disable button)"

### ❌ Anti-Pattern 3: Assuming Knowledge
**Bad:** "Use the decorator pattern"

**Why bad:** Developer may not know it

**Better:** "Add `@api.depends('field_x')` decorator (see existing examples in `models/canvas.py:42`)"

### ❌ Anti-Pattern 4: No Validation
**Bad:** [Gives instructions, no testing steps]

**Why bad:** How do you know it works?

**Better:** [Always include validation checklist]

### ❌ Anti-Pattern 5: Solution-Focused Only
**Bad:** [Only describes solution, no context]

**Why bad:** Developer doesn't understand the "why"

**Better:** [Start with context, then solution]

## Advanced: Interactive Prompts

For complex features, create prompts with decision points:

```markdown
## Implementation Path

**Choose your approach:**

### Option A: Simple but Limited
[Instructions for simple version]
**Use if:** Time is critical, basic functionality OK

### Option B: Complete but Complex
[Instructions for full version]
**Use if:** Need all features, have time for testing

**Recommended:** Start with A, upgrade to B later if needed
```

## Saving Prompts

Always save good prompts for reuse:
```
C:\Working With AI\ai_sam\claudes floating files\prompts\
```

**Name format:** `YYYY-MM-DD_feature-name_v1.md`

This builds a library of reusable patterns!
