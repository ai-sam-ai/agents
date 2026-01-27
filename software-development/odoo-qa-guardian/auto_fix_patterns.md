# Auto-Fix Patterns - Deterministic Fixes for Known Issues

## Purpose

This file defines issues that QA Guardian can fix automatically (no approval needed). Each pattern includes detection logic + fix logic + verification.

**Criteria for inclusion:**
- ✅ Deterministic (same input → same output)
- ✅ Low risk (won't break other code)
- ✅ High confidence (>90% success rate)
- ✅ Previously tested (worked in debug sessions)

---

## Pattern 1: Odoo 18 `<tree>` → `<list>` Conversion

**Severity:** CRITICAL
**Confidence:** 95% (very safe transformation)

### Detection
```bash
# Find <tree> tags in XML view definitions
grep -rn '<tree' views/*.xml
```

**Pattern Match:**
```xml
<tree string="...">
```

### Fix Logic
```python
# Replace <tree> with <list>
old_content = read_file(xml_file)
new_content = old_content.replace('<tree', '<list').replace('</tree>', '</list>')
write_file(xml_file, new_content)

# Also check view_mode in actions
if 'view_mode' in xml_file:
    new_content = new_content.replace("'tree'", "'list'")
    new_content = new_content.replace('"tree"', '"list"')
```

### Verification
```bash
# Confirm no <tree> tags remain
if grep -q '<tree' views/*.xml; then
    echo "Fix failed - <tree> tags still present"
    exit 1
fi
```

### Example
```xml
<!-- BEFORE -->
<record id="view_conversation_tree" model="ir.ui.view">
    <field name="arch" type="xml">
        <tree string="Conversations">
            <field name="name"/>
        </tree>
    </field>
</record>

<!-- AFTER -->
<record id="view_conversation_tree" model="ir.ui.view">
    <field name="arch" type="xml">
        <list string="Conversations">
            <field name="name"/>
        </list>
    </field>
</record>
```

---

## Pattern 2: Deprecated V2 Dependencies

**Severity:** CRITICAL
**Confidence:** 98% (mapping is 1:1)

### Detection
```bash
# Check for V2 module names in dependencies
grep -E "'ai_base'|'ai_trunk'|'ai_automator_base'" __manifest__.py
```

**Pattern Match:**
```python
'depends': ['base', 'ai_base']
'depends': ['base', 'ai_trunk']
```

### Fix Logic
```python
# V2 → V3 mapping
replacements = {
    "'ai_base'": "'ai_brain'",
    "'ai_trunk'": "'ai_sam'",
    "'ai_automator_base'": "'the_ai_automator'",
}

manifest_content = read_file('__manifest__.py')
for old, new in replacements.items():
    manifest_content = manifest_content.replace(old, new)

write_file('__manifest__.py', manifest_content)
```

### Verification
```bash
# Confirm no V2 names remain
if grep -qE "'ai_base'|'ai_trunk'" __manifest__.py; then
    echo "Fix failed - V2 names still present"
    exit 1
fi
```

### Example
```python
# BEFORE
'depends': [
    'base',
    'ai_base',
    'ai_trunk',
]

# AFTER
'depends': [
    'base',
    'ai_brain',
    'ai_sam',
]
```

---

## Pattern 3: Wrong Odoo 18 Version Format

**Severity:** HIGH
**Confidence:** 92% (format is standard)

### Detection
```bash
# Check version doesn't start with 18.0.
grep "'version':" __manifest__.py | grep -v "18\\.0\\."
```

**Pattern Match:**
```python
'version': '1.0.0'  # Wrong
'version': '1.0'    # Wrong
```

### Fix Logic
```python
# Extract current version
manifest = read_file('__manifest__.py')
version_match = re.search(r"'version':\s*'([^']+)'", manifest)

if version_match:
    current_version = version_match.group(1)

    # Convert to Odoo 18 format
    if not current_version.startswith('18.0.'):
        # If version is X.Y.Z, convert to 18.0.X.Y
        parts = current_version.split('.')
        if len(parts) >= 2:
            new_version = f"18.0.{parts[0]}.{parts[1]}"
        else:
            new_version = "18.0.1.0"  # Default

        manifest = manifest.replace(
            f"'version': '{current_version}'",
            f"'version': '{new_version}'"
        )
        write_file('__manifest__.py', manifest)
```

### Verification
```bash
# Confirm version starts with 18.0.
if ! grep -q "'version'.*'18\\.0\\." __manifest__.py; then
    echo "Fix failed - version format incorrect"
    exit 1
fi
```

### Example
```python
# BEFORE
'version': '1.0.0',

# AFTER
'version': '18.0.1.0',
```

---

## Pattern 4: Missing `_description` Field

**Severity:** MEDIUM
**Confidence:** 85% (requires model name inference)

### Detection
```bash
# Find models with _name but no _description
grep -l '_name\s*=' models/*.py | xargs grep -L '_description'
```

**Pattern Match:**
```python
class AiConversation(models.Model):
    _name = 'ai.conversation'
    # _description missing
```

### Fix Logic
```python
# Read model file
model_content = read_file(model_file)

# Extract model name
model_name_match = re.search(r"_name\s*=\s*'([^']+)'", model_content)
if model_name_match:
    model_name = model_name_match.group(1)

    # Generate description from model name
    # ai.conversation → AI Conversation
    description = model_name.replace('.', ' ').replace('_', ' ').title()

    # Insert _description after _name
    model_content = re.sub(
        r"(_name\s*=\s*'[^']+'\n)",
        rf"\1    _description = '{description}'\n",
        model_content
    )

    write_file(model_file, model_content)
```

### Verification
```bash
# Confirm _description exists
if ! grep -q '_description' "$model_file"; then
    echo "Fix failed - _description not added"
    exit 1
fi
```

### Example
```python
# BEFORE
class AiConversation(models.Model):
    _name = 'ai.conversation'

    name = fields.Char()

# AFTER
class AiConversation(models.Model):
    _name = 'ai.conversation'
    _description = 'Ai Conversation'

    name = fields.Char()
```

---

## Pattern 5: Missing `models` Import

**Severity:** HIGH
**Confidence:** 90% (safe if models.Model detected)

### Detection
```bash
# Find model files without models import
grep -l 'models.Model' models/*.py | xargs grep -L 'from odoo import.*models'
```

**Pattern Match:**
```python
from odoo import fields, api  # Missing models

class MyModel(models.Model):
```

### Fix Logic
```python
# Read model file
content = read_file(model_file)

# Check if imports exist
if 'from odoo import' in content:
    # Add 'models' to existing import
    content = re.sub(
        r'from odoo import ((?!models)[^\\n]+)',
        r'from odoo import models, \1',
        content
    )
else:
    # Add new import line at top (after docstring if present)
    lines = content.split('\n')
    insert_index = 0

    # Skip docstring
    if lines[0].startswith('"""') or lines[0].startswith("'''"):
        for i, line in enumerate(lines):
            if i > 0 and ('"""' in line or "'''" in line):
                insert_index = i + 1
                break

    lines.insert(insert_index, 'from odoo import models, fields, api')
    content = '\n'.join(lines)

write_file(model_file, content)
```

### Verification
```bash
# Confirm models import exists
if ! grep -q 'from odoo import.*models' "$model_file"; then
    echo "Fix failed - models import not added"
    exit 1
fi
```

### Example
```python
# BEFORE
from odoo import fields, api

class AiConversation(models.Model):
    _name = 'ai.conversation'

# AFTER
from odoo import models, fields, api

class AiConversation(models.Model):
    _name = 'ai.conversation'
```

---

## Pattern 6: Excessive `console.log` Statements

**Severity:** LOW
**Confidence:** 88% (safe removal if >3 found)

### Detection
```bash
# Count console.log in JS files
log_count=$(grep -r 'console.log' static/src/js/ | wc -l)
if [ "$log_count" -gt 3 ]; then
    echo "Excessive console.log: $log_count found"
fi
```

### Fix Logic
```python
# Read JS file
js_content = read_file(js_file)

# Count console.log occurrences
log_count = js_content.count('console.log')

if log_count > 3:
    # Strategy: Comment out (not delete - easier to review)
    js_content = re.sub(
        r'(\s*)(console\\.log\\([^)]*\\);)',
        r'\1// \2  // TODO: Remove debug log',
        js_content
    )

    write_file(js_file, js_content)
```

### Verification
```bash
# Confirm console.log count reduced
new_count=$(grep -c 'console.log' "$js_file" || true)
if [ "$new_count" -gt 3 ]; then
    echo "Warning: Still $new_count console.log statements"
fi
```

### Example
```javascript
// BEFORE
function renderGraph(data) {
    console.log('Rendering graph', data);
    console.log('Nodes:', data.nodes);
    console.log('Edges:', data.edges);
    console.log('Config:', this.config);
    // ... rendering logic
}

// AFTER
function renderGraph(data) {
    // console.log('Rendering graph', data);  // TODO: Remove debug log
    // console.log('Nodes:', data.nodes);  // TODO: Remove debug log
    // console.log('Edges:', data.edges);  // TODO: Remove debug log
    // console.log('Config:', this.config);  // TODO: Remove debug log
    // ... rendering logic
}
```

---

## Pattern 7: Duplicate XML IDs (Same File)

**Severity:** CRITICAL
**Confidence:** 80% (can detect, fix requires context)

### Detection
```bash
# Find duplicate IDs within each XML file
for file in views/*.xml; do
    duplicates=$(grep -oP 'id="\\K[^"]+' "$file" | sort | uniq -d)
    if [ -n "$duplicates" ]; then
        echo "Duplicates in $file: $duplicates"
    fi
done
```

### Fix Logic
```python
# This is SEMI-AUTO (needs user input for naming)

# Read XML file
xml_content = read_file(xml_file)

# Find duplicate IDs
ids = re.findall(r'id="([^"]+)"', xml_content)
duplicates = [id for id in ids if ids.count(id) > 1]

if duplicates:
    print(f"Found duplicate IDs: {duplicates}")
    print("Auto-fix strategy: Append _v2, _v3, etc.")

    # For each duplicate, append version number
    for dup_id in set(duplicates):
        occurrences = xml_content.count(f'id="{dup_id}"')

        # Replace 2nd+ occurrences
        counter = 0
        def replacer(match):
            nonlocal counter
            counter += 1
            if counter == 1:
                return match.group(0)  # Keep first
            else:
                return f'id="{dup_id}_v{counter}"'

        xml_content = re.sub(
            rf'id="{re.escape(dup_id)}"',
            replacer,
            xml_content
        )

    write_file(xml_file, xml_content)
```

### Verification
```bash
# Confirm no duplicate IDs remain
duplicates=$(grep -oP 'id="\\K[^"]+' "$xml_file" | sort | uniq -d)
if [ -n "$duplicates" ]; then
    echo "Fix failed - duplicates still exist: $duplicates"
    exit 1
fi
```

**Note:** This fix is SEMI-AUTO because it requires checking if renamed IDs break menu/action references. Use with CAUTION or move to manual queue.

---

## Auto-Fix Workflow

```
For each pattern:
1. RUN DETECTION → Find matches
2. CHECK CONFIDENCE → ≥90% required
3. APPLY FIX → Execute fix logic
4. RUN VERIFICATION → Confirm fix worked
5. LOG RESULT → Track success/failure
```

**If verification fails:**
- Undo change (restore backup)
- Move to manual queue
- Log pattern failure (needs refinement)

---

## Pattern Priority (Fix Order)

Fix in this order for maximum safety:

1. **Pattern 2:** Deprecated dependencies (breaks imports)
2. **Pattern 1:** `<tree>` → `<list>` (Odoo 18 blocker)
3. **Pattern 5:** Missing models import (runtime error)
4. **Pattern 3:** Version format (install warning)
5. **Pattern 4:** Missing _description (Odoo warning)
6. **Pattern 6:** console.log cleanup (style)
7. **Pattern 7:** Duplicate IDs (CAUTION - semi-auto)

---

## Adding New Patterns

When Debug Agent fixes a bug repeatedly:

1. **Document pattern:** Error type + detection + fix
2. **Test fix:** Verify deterministic + low risk
3. **Calculate confidence:** Based on test success rate
4. **Add to this file:** Include all sections (detection, fix, verification, example)
5. **Update QA Guardian:** Pattern automatically available

**Template:**
```markdown
## Pattern X: [Name]

**Severity:** [CRITICAL/HIGH/MEDIUM/LOW]
**Confidence:** [%] (description)

### Detection
[Bash command to find issue]

### Fix Logic
[Python/Bash code to fix]

### Verification
[Command to confirm fix worked]

### Example
[Before/after code]
```

---

## Pattern Statistics

Track these metrics:
- Auto-fix success rate per pattern (goal: >90%)
- Most common patterns (prioritize education)
- Pattern failures (need refinement)
- New patterns needed (debug agent insights)

**Monthly Review:**
- Remove patterns with <70% success rate
- Refine patterns with 70-90% success rate
- Keep patterns with >90% success rate
- Add new patterns from debug history

---

## Philosophy

**"The best fix is the one you never have to make."**

Auto-fix patterns serve two purposes:
1. **Immediate:** Fix issues fast (save developer time)
2. **Long-term:** Educate developer (prevent future issues)

**Every auto-fix should include education:**
- Explain WHY issue matters
- Show prevention checklist
- Reference error prevention guide

**Goal:** Developer learns → fewer fixes needed over time → QA Guardian becomes "always PASS" gate.
