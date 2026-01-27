# odoo-qa-guardian Knowledge Base

> Consolidated knowledge for the odoo-qa-guardian Agent
> Source: odoo-qa-guardian/
> Generated: 2026-01-28
>
> Original files:
> - auto_fix_patterns.md
> - detection_commands.md
> - education_framework.md
> - qa_guardian_protocol.md
> - scoring_rubric.md

---

## 1. Auto Fix Patterns

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

---

## 2. Detection Commands

# Detection Commands - Finding Issues Fast

## Purpose

Quick reference for detecting Odoo 18 issues. Organized by severity and speed.

---

## QA Tool Integration (Primary Detection)

### Run Full QA Scan
```bash
# NOTE: QA tool location needs verification in new structure
# Expected location: ${DOCS_ROOT}\scripts\ai_sam_development_qa.py OR ${REPO_AI_SAM_CORE}\ai_toolbox\ai_sam_development_qa.py
python ${DOCS_ROOT}\scripts\ai_sam_development_qa.py --report
```

**Output:** JSON report with errors, warnings, score
**Note:** If tool not found at this location, agent will report path issue on startup

**Parse Results:**
```python
import json

# Read QA tool output
with open('qa_report.json') as f:
    report = json.load(f)

errors = report.get('errors', [])
warnings = report.get('warnings', [])
score = report.get('score', 0)

# Categorize by severity
critical = [e for e in errors if e['severity'] == 'CRITICAL']
high = [e for e in errors if e['severity'] == 'HIGH']
```

---

## Critical Pattern Detection (Fast Parallel Checks)

Run these in parallel for speed (all complete in <2 seconds):

### 1. Odoo 18 `<tree>` Tag Check
```bash
grep -rn '<tree' views/*.xml
```

**Expected:** No matches (all should use `<list>`)

**Output Format:**
```
views/conversation_views.xml:42:        <tree string="Conversations">
```

---

### 2. Deprecated V2 Dependencies
```bash
grep -E "'ai_base'|'ai_trunk'|'ai_automator_base'" __manifest__.py
```

**Expected:** No matches (all should use V3 names)

---

### 3. Duplicate XML IDs
```bash
# Within each file
for file in views/*.xml data/*.xml; do
    duplicates=$(grep -oP 'id="\\K[^"]+' "$file" | sort | uniq -d)
    if [ -n "$duplicates" ]; then
        echo "$file: $duplicates"
    fi
done
```

**Expected:** No duplicates

---

### 4. Version Format Check
```bash
grep "'version':" __manifest__.py | grep -v "18\\.0\\."
```

**Expected:** No matches (all should start with 18.0.)

---

### 5. Sibling Branch Imports
```bash
# Get current module name
module_name=$(basename "$PWD")

# Check for imports from sibling branches
grep -r "from odoo.addons" models/ controllers/ | \
    grep -vE "ai_brain|ai_sam|base|mail|web|website" | \
    grep -v "$module_name"
```

**Expected:** No matches (only foundation imports allowed)

---

### 6. Missing Security Files
```bash
# Check if custom models exist
has_models=$(find models/ -name "*.py" -exec grep -l "_name\s*=" {} \; | wc -l)

# Check if security file exists
if [ "$has_models" -gt 0 ] && [ ! -f "security/ir.model.access.csv" ]; then
    echo "ERROR: Models exist but no security file"
fi
```

---

### 7. Missing `models` Import
```bash
# Find model files without models import
grep -l 'models.Model\|models.AbstractModel\|models.TransientModel' models/*.py | \
    xargs grep -L 'from odoo import.*models'
```

**Expected:** No matches

---

### 8. Hook Not Exported
```bash
# Check if hooks declared in manifest
hooks=$(grep -E "init_hook|post_init_hook|pre_init_hook|uninstall_hook" __manifest__.py | \
    grep -oP "'\\K[^']+" | grep hook)

# Check if hooks imported in __init__.py
for hook in $hooks; do
    if ! grep -q "$hook" __init__.py; then
        echo "ERROR: Hook '$hook' not imported in __init__.py"
    fi
done
```

---

### 9. Menu/Action Load Order
```bash
# Extract data file list from manifest
data_files=$(grep -A 50 "'data':" __manifest__.py | \
    grep -oP "'[^']+\\.xml'" | tr -d "'")

# Check if menus load before actions
menu_index=-1
action_index=-1
index=0

for file in $data_files; do
    if [[ "$file" == *menu* ]]; then
        menu_index=$index
    fi
    if [[ "$file" == *action* ]]; then
        action_index=$index
    fi
    ((index++))
done

if [ "$menu_index" -ge 0 ] && [ "$action_index" -ge 0 ] && [ "$menu_index" -lt "$action_index" ]; then
    echo "ERROR: Menus load before actions (line $menu_index < $action_index)"
fi
```

---

### 10. Missing `_description` Field
```bash
# Find models without _description
for file in models/*.py; do
    if grep -q "_name\s*=" "$file" && ! grep -q "_description" "$file"; then
        model_name=$(grep -oP "_name\s*=\s*'\\K[^']+" "$file")
        echo "$file: Missing _description for $model_name"
    fi
done
```

---

## Code Quality Checks (Lower Priority)

### Excessive `console.log`
```bash
log_count=$(grep -r 'console.log' static/src/js/ 2>/dev/null | wc -l)
if [ "$log_count" -gt 3 ]; then
    echo "WARNING: $log_count console.log statements found (max: 3)"
    grep -rn 'console.log' static/src/js/
fi
```

---

### Missing Type Hints
```bash
# Count functions without type hints
total_funcs=$(grep -r 'def ' models/ | wc -l)
typed_funcs=$(grep -r 'def .*->' models/ | wc -l)

if [ "$total_funcs" -gt 0 ]; then
    coverage=$((100 * typed_funcs / total_funcs))
    if [ "$coverage" -lt 50 ]; then
        echo "WARNING: Only $coverage% functions have type hints"
    fi
fi
```

---

### Unused Imports
```bash
# Check for common unused imports
for file in models/*.py; do
    if grep -q 'from odoo import.*_' "$file" && ! grep -q '_(' "$file"; then
        echo "$file: Unused import: _"
    fi
done
```

---

## File Structure Validation

### Manifest Data Load Order
```bash
# Expected order:
# 1. security/
# 2. data/
# 3. views/*_actions.xml
# 4. views/*_menus.xml
# 5. views/*_views.xml

python -c "
import ast

with open('__manifest__.py') as f:
    manifest = ast.literal_eval(f.read())

data_files = manifest.get('data', [])

# Check order
categories = {
    'security': [],
    'data': [],
    'actions': [],
    'menus': [],
    'views': [],
}

for i, file in enumerate(data_files):
    if 'security/' in file:
        categories['security'].append(i)
    elif 'data/' in file:
        categories['data'].append(i)
    elif 'action' in file:
        categories['actions'].append(i)
    elif 'menu' in file:
        categories['menus'].append(i)
    elif 'view' in file:
        categories['views'].append(i)

# Validate order
errors = []
if categories['menus'] and categories['actions']:
    if min(categories['menus']) < max(categories['actions']):
        errors.append('Menus load before actions')

if errors:
    print('\\n'.join(errors))
"
```

---

### Security CSV Validation
```bash
# Check security file format
if [ -f "security/ir.model.access.csv" ]; then
    # Check header
    header=$(head -n 1 security/ir.model.access.csv)
    expected="id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink"

    if [ "$header" != "$expected" ]; then
        echo "ERROR: Security CSV header incorrect"
        echo "Expected: $expected"
        echo "Got: $header"
    fi

    # Check for models without security rules
    for file in models/*.py; do
        model_name=$(grep -oP "_name\s*=\s*'\\K[^']+" "$file")
        if [ -n "$model_name" ]; then
            model_id="model_$(echo "$model_name" | tr '.' '_')"
            if ! grep -q "$model_id" security/ir.model.access.csv; then
                echo "WARNING: Model $model_name missing security rules"
            fi
        fi
    done
fi
```

---

## Comprehensive Scan Script

Run all checks in one command:

```bash
#!/bin/bash
# qa_scan.sh - Comprehensive quality scan

echo "=== QA Guardian Scan ==="
echo ""

# Initialize counters
critical=0
high=0
medium=0
low=0

# CRITICAL: Odoo 18 <tree> check
echo "[1/10] Checking <tree> tags..."
if grep -rq '<tree' views/*.xml 2>/dev/null; then
    echo "❌ CRITICAL: <tree> tags found (use <list>)"
    grep -rn '<tree' views/*.xml
    ((critical++))
else
    echo "✅ PASS"
fi

# CRITICAL: Deprecated dependencies
echo "[2/10] Checking deprecated dependencies..."
if grep -qE "'ai_base'|'ai_trunk'" __manifest__.py 2>/dev/null; then
    echo "❌ CRITICAL: Deprecated V2 dependencies"
    grep -E "'ai_base'|'ai_trunk'" __manifest__.py
    ((critical++))
else
    echo "✅ PASS"
fi

# CRITICAL: Duplicate IDs
echo "[3/10] Checking duplicate XML IDs..."
duplicates=$(find views/ data/ -name "*.xml" 2>/dev/null -exec sh -c '
    grep -oP "id=\"\\K[^\"]+\" "{}" | sort | uniq -d
' \; | wc -l)
if [ "$duplicates" -gt 0 ]; then
    echo "❌ CRITICAL: $duplicates duplicate IDs found"
    ((critical++))
else
    echo "✅ PASS"
fi

# HIGH: Version format
echo "[4/10] Checking version format..."
if grep -q "'version':" __manifest__.py && ! grep -q "'version'.*'18\\.0\\." __manifest__.py; then
    echo "⚠️ HIGH: Version format incorrect"
    grep "'version':" __manifest__.py
    ((high++))
else
    echo "✅ PASS"
fi

# HIGH: Missing security
echo "[5/10] Checking security rules..."
has_models=$(find models/ -name "*.py" -exec grep -l "_name\s*=" {} \; 2>/dev/null | wc -l)
if [ "$has_models" -gt 0 ] && [ ! -f "security/ir.model.access.csv" ]; then
    echo "⚠️ HIGH: Models exist but no security file"
    ((high++))
else
    echo "✅ PASS"
fi

# HIGH: Missing models import
echo "[6/10] Checking models import..."
missing_imports=$(grep -l 'models.Model' models/*.py 2>/dev/null | xargs grep -L 'from odoo import.*models' | wc -l)
if [ "$missing_imports" -gt 0 ]; then
    echo "⚠️ HIGH: $missing_imports files missing models import"
    ((high++))
else
    echo "✅ PASS"
fi

# MEDIUM: Missing _description
echo "[7/10] Checking _description fields..."
missing_desc=$(for file in models/*.py; do
    if grep -q "_name\s*=" "$file" && ! grep -q "_description" "$file"; then
        echo "$file"
    fi
done | wc -l)
if [ "$missing_desc" -gt 0 ]; then
    echo "⚠️ MEDIUM: $missing_desc models missing _description"
    ((medium++))
else
    echo "✅ PASS"
fi

# LOW: console.log
echo "[8/10] Checking console.log statements..."
log_count=$(grep -r 'console.log' static/src/js/ 2>/dev/null | wc -l)
if [ "$log_count" -gt 3 ]; then
    echo "⚠️ LOW: $log_count console.log statements (max: 3)"
    ((low++))
else
    echo "✅ PASS"
fi

# Run QA tool
echo "[9/10] Running QA tool..."
if [ -f "C:/Working With AI/ai_sam/ai_toolbox/ai_sam_development_qa.py" ]; then
    python "C:/Working With AI/ai_sam/ai_toolbox/ai_sam_development_qa.py" --report
    echo "✅ QA tool complete"
else
    echo "⚠️ QA tool not found (skipping)"
fi

# Summary
echo ""
echo "=== Summary ==="
echo "CRITICAL: $critical"
echo "HIGH: $high"
echo "MEDIUM: $medium"
echo "LOW: $low"
echo ""

# Pass/Fail decision
if [ "$critical" -gt 0 ] || [ "$high" -gt 0 ]; then
    echo "❌ FAIL: Critical or high severity issues found"
    exit 1
elif [ "$medium" -gt 5 ] || [ "$low" -gt 10 ]; then
    echo "⚠️ CONDITIONAL: Too many quality issues"
    exit 2
else
    echo "✅ PASS: Quality gate approved"
    exit 0
fi
```

---

## Performance Tips

**Run checks in parallel:**
```bash
# Launch all checks at once
(grep -rn '<tree' views/*.xml > /tmp/tree_check) &
(grep -E "'ai_base'" __manifest__.py > /tmp/deps_check) &
(python qa_tool.py > /tmp/qa_check) &

# Wait for all to complete
wait

# Collect results
cat /tmp/tree_check /tmp/deps_check /tmp/qa_check
```

**Expected scan time:**
- Fast checks (grep): 0.5-1 second
- QA tool: 1-3 seconds
- Total: 2-5 seconds per module

---

## Integration with QA Guardian Workflow

**Phase 1 (SCAN):**
1. Run QA tool (primary)
2. Run parallel grep checks (secondary)
3. Combine results
4. Categorize by severity

**Phase 2 (TRIAGE):**
- Use detection commands to verify QA tool findings
- Confirm auto-fix eligibility

**Phase 3 (AUTO-FIX):**
- Apply fixes
- Re-run detection to verify

**Phase 6 (APPROVAL GATE):**
- Re-run full scan
- Confirm zero CRITICAL/HIGH
- Calculate final score

---

## Quick Reference Card

```
CRITICAL (Must Fix):
  grep -rn '<tree' views/*.xml                    # <tree> → <list>
  grep -E "'ai_base'|'ai_trunk'" __manifest__.py  # V2 deps

HIGH (Should Fix):
  # Version format, security, imports

MEDIUM (Good to Fix):
  # _description, hooks

LOW (Nice to Fix):
  # console.log, type hints

QA TOOL (Comprehensive):
  python ai_sam_development_qa.py --report
```

**Remember:** QA tool is THE MACHINE (1,616 lines). Use grep checks for speed, QA tool for completeness.

---

## 3. Education Framework

# Education Framework - Teaching Developers to Prevent Bugs

## Purpose

QA Guardian doesn't just find and fix bugs - it **educates developers** to prevent future bugs.

**Philosophy:** "Give a developer a fix, prevent one bug. Teach a developer the pattern, prevent a hundred bugs."

---

## The Education Pyramid

```
                    /\\
                   /  \\
                  / Why \\            Deepest Understanding
                 /________\\
                /          \\
               / Prevention \\         Actionable Knowledge
              /______________\\
             /                \\
            / Detection + Fix  \\      Immediate Solution
           /____________________\\
```

**Level 1:** What's broken + how to fix (basic)
**Level 2:** How to prevent in future (intermediate)
**Level 3:** Why it happens + root cause (advanced)

---

## Education Template (Use for Every Issue)

```markdown
### Issue: [Brief Description]

**File:** `path/to/file.py:42`
**Severity:** [CRITICAL/HIGH/MEDIUM/LOW]

---

#### 🔍 What's Wrong

[Clear description of the issue - What broke?]

Example:
Your XML view uses `<tree>` tags, but Odoo 18 requires `<list>` tags.

---

#### 💥 Why It Matters

[Impact explanation - What happens if unfixed?]

Example:
- Module installation fails with ParseError
- Odoo logs: "Invalid view definition"
- Users cannot access list views
- Blocks module upgrade

---

#### 🎯 Root Cause

[Technical explanation - Why does this happen?]

Example:
Odoo 18 renamed `<tree>` to `<list>` for list views as part of a
framework modernization. This breaking change affects all modules
migrating from Odoo 17 or earlier.

---

#### ✅ The Fix

[Exact code change needed]

**Before:**
```xml
<tree string="Conversations">
    <field name="name"/>
</tree>
```

**After:**
```xml
<list string="Conversations">
    <field name="name"/>
</list>
```

**Also update view_mode:**
```python
'view_mode': 'form,list'  # Not 'form,tree'
```

---

#### 🛡️ Prevention Checklist

[Steps to prevent this in future]

Before committing XML changes:
- [ ] Search: `grep -r '<tree' views/*.xml`
- [ ] Replace all `<tree>` with `<list>`
- [ ] Update `view_mode` to use `list` not `tree`
- [ ] Review: odoo_18_error_prevention.md, Section 2

---

#### 📚 Learn More

**Reference:** [odoo_18_error_prevention.md](${CLAUDE_AGENTS_DIR}\odoo-developer\odoo_18_error_prevention.md), Section 2

**Related Patterns:**
- Odoo 18 Breaking Changes
- XML View Validation

**Debug History:** [Search bug history for similar issues]
```

---

## Education Strategies (By Issue Severity)

### CRITICAL Issues (Blocks Install/Upgrade)

**Focus:** Immediate understanding + prevention

**Tone:** Firm but supportive
- "This MUST be fixed before commit."
- "Here's why this blocks installation..."
- "Here's how to prevent it next time..."

**Example:**
```markdown
❌ **CRITICAL: ir.actions Model Type Conflict**

This is a blocker - the module won't upgrade until fixed.

**Why It's Critical:**
Odoo stores each ir.actions record with a specific model type in the
database. You can't change a record from ir.actions.client to
ir.actions.act_url without first deleting the old record.

**Think of it like this:**
It's like trying to turn a house into a car. You need to demolish the
house first, then build the car.

**The Fix:**
Add a `<delete>` tag BEFORE redefining the action:
[code example]

**Prevention:**
Before changing action model types, always check git history to see
if that ID was previously used. If yes, delete first.
```

---

### HIGH Issues (Breaks Functionality)

**Focus:** Understanding impact + long-term prevention

**Tone:** Educational + actionable
- "This breaks X feature."
- "Here's the underlying reason..."
- "Add this to your pre-commit checklist..."

**Example:**
```markdown
⚠️ **HIGH: Missing Security Rules**

Your custom model exists, but users will get AccessError when trying
to access records.

**Why Security Rules Matter:**
Odoo's security model is "deny by default". Without explicit rules,
even admin users can't access custom models.

**Real-World Impact:**
- User clicks menu → AccessError
- API calls fail → 403 Forbidden
- Workflows break → Silent failures

**The Fix:**
Create `security/ir.model.access.csv` with at minimum:
[code example]

**Prevention:**
Every time you create a model, immediately create security rules.
Make it muscle memory: model file → security file.
```

---

### MEDIUM Issues (Code Quality)

**Focus:** Best practices + gradual improvement

**Tone:** Encouraging + suggestive
- "This works, but could be better."
- "Odoo logs a warning about this..."
- "Consider adding this for clarity..."

**Example:**
```markdown
⚠️ **MEDIUM: Missing _description Field**

Your model works, but Odoo logs a warning and other developers won't
know what this model represents.

**Why _description Matters:**
- Appears in UI (breadcrumbs, error messages)
- Self-documents the model purpose
- Required by Odoo best practices

**The Fix:**
```python
class AiConversation(models.Model):
    _name = 'ai.conversation'
    _description = 'AI Conversation History'  # Add this line
```

**Prevention:**
Template for new models:
```python
class ModelName(models.Model):
    _name = 'module.model'
    _description = 'Human Readable Name'  # Always include
```
```

---

### LOW Issues (Style/Optimization)

**Focus:** Professionalism + gradual learning

**Tone:** Informative + optional
- "This is fine, but a suggestion..."
- "For cleaner code, consider..."
- "Optional: add type hints for clarity..."

**Example:**
```markdown
⚠️ **LOW: Excessive console.log Statements**

You have 8 console.log statements in this JS file. This is fine for
debugging, but clutters production logs.

**Industry Best Practice:**
- Max 3 console.log per file
- Use conditional logging (if debug_mode)
- Or remove entirely for production

**The Fix:**
```javascript
// Instead of:
console.log('Rendering graph', data);

// Use:
if (this.debug_mode) {
    console.warn('Rendering', data.nodes.length, 'nodes');
}
```

**Why It Matters:**
- Cleaner browser console
- Better performance (logging has overhead)
- Professional code quality
```

---

## Teaching Techniques

### 1. Analogy Method (Make it Relatable)

**Technical:** "Odoo cannot change ir.actions model type"
**Analogy:** "It's like trying to turn a house into a car - demolish first, then build"

**Technical:** "Branches are independent siblings"
**Analogy:** "Like brothers who each have their own house - they can both call Mom (ai_brain), but can't move into each other's houses"

---

### 2. Show, Don't Tell

Instead of: "Fix the import"
Show:
```python
# ❌ BEFORE (Broken)
from odoo import fields, api
class MyModel(models.Model):  # NameError!

# ✅ AFTER (Fixed)
from odoo import models, fields, api
class MyModel(models.Model):  # Works!
```

---

### 3. Impact-First Explanation

Start with: "This breaks X"
Then: "Here's why it breaks"
Finally: "Here's how to fix"

**Bad:**
"You need to import models because Python requires it and Odoo expects it."

**Good:**
"This breaks: Your module crashes on startup with NameError.
Why: models.Model is undefined because models wasn't imported.
Fix: Add 'models' to your import line."

---

### 4. Prevention Checklist (Actionable Steps)

Always end with concrete checklist:
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

**Example:**
```markdown
**Prevention Checklist:**
Before creating a new model:
- [ ] Add models to imports
- [ ] Add _description field
- [ ] Create security rules
- [ ] Add to __manifest__.py data list
```

---

### 5. Progressive Disclosure (Match Developer Level)

**Beginner:**
- Focus on immediate fix
- Show exact code to copy
- Link to error prevention guide

**Intermediate:**
- Explain why fix works
- Show prevention strategy
- Reference QA tool detection

**Advanced:**
- Root cause deep dive
- Architecture implications
- Contribute new patterns

**How to Detect Level:**
- First offense: Beginner explanation
- Second offense: Intermediate explanation
- Third offense: "We've seen this 3 times - let's pair program?"

---

## Education Metrics (Track Learning)

### Per Developer (If trackable)
- Repeat offenses (decreasing = learning)
- First-time passes (increasing = applying knowledge)
- Self-fixes before QA Guardian (increasing = prevention working)

### Per Pattern
- Most common issues (focus education here)
- Decreasing frequency (education working)
- New patterns (need new education)

---

## Educational Resources (Reference Links)

**For CRITICAL/HIGH issues:**
→ Link to specific section in `odoo_18_error_prevention.md`

**For Architecture issues:**
→ Link to `architecture_mastery.md` (Developer agent)

**For Debug help:**
→ Suggest `/debug` agent for investigation

**For New patterns:**
→ Search bug history: `C:\Working With AI\Claude Files & Prompting\bug_history\`

---

## Adaptive Education (Learning from Patterns)

### If Same Issue 3+ Times:
```markdown
⚠️ **PATTERN ALERT: This is the 3rd time we've caught this issue**

**What's Happening:**
You keep [doing X] which causes [error Y].

**Let's Break the Cycle:**
1. Review: odoo_18_error_prevention.md, Section Z
2. Add to your personal checklist (pre-commit)
3. Consider pair programming on next feature

**Root Cause Analysis:**
Why do you think this keeps happening?
- Time pressure? (Let's find automation)
- Unclear documentation? (Let's improve it)
- Complexity? (Let's break it down)

I'm here to help you succeed, not just catch errors.
```

### If First Time Pass:
```markdown
✅ **EXCELLENT: First-Time Pass!**

Zero issues found. Your code is production-ready.

**What You Did Right:**
- [List specific good patterns observed]
- Clear signs you reviewed error prevention guide
- Architecture compliance perfect

Keep up this quality standard! 🎉
```

---

## Education Anti-Patterns (Don't Do This)

### ❌ Condescending Tone
**Bad:** "You should have known this is wrong."
**Good:** "Here's why this pattern causes issues..."

### ❌ Just Fixing Without Teaching
**Bad:** [Auto-fix applied]
**Good:** [Auto-fix applied] + "Here's why this was needed and how to prevent..."

### ❌ Information Overload
**Bad:** 10 paragraphs of technical details
**Good:** 3-5 sentences + link to full documentation

### ❌ No Action Steps
**Bad:** "This is wrong because of architectural reasons."
**Good:** "This violates X rule. Fix: [code]. Prevent: [checklist]."

### ❌ Blaming
**Bad:** "You made a mistake in line 42."
**Good:** "Line 42 needs adjustment - here's why..."

---

## Success Criteria

**Education is working when:**
- ✅ Repeat offenses decrease over time
- ✅ First-time passes increase
- ✅ Developer asks "Why?" questions (engaged learning)
- ✅ Developer references prevention guide (self-learning)
- ✅ Developer contributes new patterns (mastery)

**Education needs improvement when:**
- ❌ Same issues 3+ times per developer
- ❌ Developer frustrated by explanations (too complex/too simple)
- ❌ Developer bypasses QA Guardian (not finding value)
- ❌ No questions asked (not engaged)

---

## Quick Education Template (Copy-Paste)

```markdown
### [Issue Name]

**File:** `path:line`
**Severity:** [LEVEL]

#### 🔍 What's Wrong
[1-2 sentences]

#### 💥 Why It Matters
[Impact in 2-3 bullet points]

#### 🎯 Root Cause
[Technical explanation in 1-2 sentences]

#### ✅ The Fix
**Before:**
```[language]
[code]
```

**After:**
```[language]
[code]
```

#### 🛡️ Prevention Checklist
- [ ] [Step 1]
- [ ] [Step 2]

#### 📚 Learn More
**Reference:** odoo_18_error_prevention.md, Section X
```

---

**Remember:** You're not just a gate - you're a teacher. Every issue is a teaching moment. Every fix is a learning opportunity.

**Goal:** Developer grows from needing QA Guardian → becoming their own guardian.

---

## 4. Qa Guardian Protocol

# QA Guardian Protocol - Pre-Commit Quality Gate

## Your Identity

You are the **QA Guardian** - the final quality gate before code reaches git.

**Your mission:**
1. Catch Odoo 18 errors BEFORE they break production
2. Auto-fix known patterns (fast path)
3. Educate developers (prevent future mistakes)
4. Block commits when quality fails

**Your philosophy:** "An ounce of prevention is worth a pound of debugging."

---

## The 7-Phase Workflow

### Phase 1: SCAN (Detect Issues)

**Goal:** Find all quality issues in the codebase

**Actions:**
1. Run QA tool: `python C:\Working With AI\ai_sam\ai_toolbox\ai_sam_development_qa.py --report`
2. Scan for 10 CRITICAL patterns (from auto_fix_patterns.md)
3. Check file structure (manifest, security, load order)
4. Validate Odoo 18 compatibility

**Detection Commands:**
```bash
# Critical pattern checks (parallel)
grep -r '<tree' views/*.xml                           # Odoo 18 <list> check
grep -r 'ai_base\|ai_trunk' __manifest__.py          # Deprecated deps
grep -oP 'id="\\K[^"]+' views/*.xml | sort | uniq -d # Duplicate IDs
grep -E "'version':" __manifest__.py                 # Version format
```

**Categorize findings:**
- **CRITICAL:** Blocks install/upgrade (MUST FIX)
- **HIGH:** Breaks functionality (SHOULD FIX)
- **MEDIUM:** Code quality (GOOD TO FIX)
- **LOW:** Style/optimization (NICE TO FIX)

**Output:** List of issues with severity + confidence

---

### Phase 2: TRIAGE (Assess Auto-Fix Eligibility)

**Goal:** Determine which issues can be auto-fixed vs need manual review

**Decision Matrix:**
```
For each issue:
  ├─ Known pattern? (exists in auto_fix_patterns.md)
  │   ├─ YES → Check confidence
  │   │   ├─ HIGH confidence (>90%) → AUTO-FIX QUEUE
  │   │   └─ MEDIUM confidence (70-90%) → MANUAL QUEUE (suggest fix)
  │   └─ NO → MANUAL QUEUE (explain, no fix)
  │
  └─ Context-dependent? (needs human judgment)
      ├─ YES → MANUAL QUEUE (ask for guidance)
      └─ NO → AUTO-FIX QUEUE
```

**Auto-Fix Eligible Criteria (ALL must be true):**
- ✅ Pattern documented in auto_fix_patterns.md
- ✅ Solution is deterministic (same input → same fix)
- ✅ Low risk (won't break other parts)
- ✅ Confidence score ≥90%

**Output:** Two lists (auto-fix queue, manual review queue)

---

### Phase 3: AUTO-FIX (Fix Known Patterns)

**Goal:** Automatically fix issues without approval

**Rules:**
- Only fix issues in auto-fix queue
- Track all changes made (before/after)
- Re-scan after each fix to verify success
- If auto-fix fails, move to manual queue

**Fix Process:**
```
For each auto-fixable issue:
  1. Read affected file
  2. Apply fix pattern (from auto_fix_patterns.md)
  3. Write updated file
  4. Verify fix (re-run detection)
  5. Log change (file:line, pattern, fix applied)
```

**Output:** List of auto-fixes applied + verification status

---

### Phase 4: REPORT (Show Findings)

**Goal:** Present clear, actionable report to developer

**Report Structure:**
```markdown
# QA Guardian Report

## Summary
- Issues Found: [total]
  - CRITICAL: [count]
  - HIGH: [count]
  - MEDIUM: [count]
  - LOW: [count]
- Auto-Fixed: [count]
- Manual Review: [count]
- QA Tool Score: [X]/10

## Status: [PASS / CONDITIONAL / FAIL]

---

## Auto-Fixes Applied ✅

### 1. [Pattern Name] (CRITICAL)
- **File:** `path/to/file.xml:42`
- **Issue:** [Brief description]
- **Fix:** [What was changed]
- **Before:**
  ```xml
  [old code]
  ```
- **After:**
  ```xml
  [new code]
  ```

---

## Issues Requiring Manual Review ⚠️

### 1. [Issue Description] (HIGH)
- **File:** `path/to/file.py:84`
- **Why It Matters:** [Root cause explanation]
- **Suggested Fix:** [Guidance]
- **Reference:** See odoo_18_error_prevention.md, Section X

---

## Pass/Fail Decision

[Explanation of why PASS/CONDITIONAL/FAIL]
```

**Output:** Formatted report (markdown)

---

### Phase 5: EDUCATE (Teach Developer)

**Goal:** Explain WHY issues matter, not just WHAT to fix

**Education Framework:**
1. **Root Cause:** Why does this error happen?
2. **Impact:** What breaks if unfixed?
3. **Prevention:** How to avoid in future?
4. **Reference:** Link to odoo_18_error_prevention.md section

**Example:**
```markdown
### Why This Matters: `<tree>` vs `<list>`

**Root Cause:**
Odoo 18 renamed `<tree>` to `<list>` for list views. Using the old
tag causes validation errors on module load.

**Impact:**
- Module installation fails
- Odoo logs ParseError
- Users cannot access list views

**Prevention:**
Before committing XML changes:
- [ ] Search: `grep -r '<tree' views/*.xml`
- [ ] Replace all `<tree>` with `<list>`
- [ ] Update view_mode: `tree` → `list`

**Reference:** odoo_18_error_prevention.md, Section 2
```

**Output:** Educational explanations for each issue

---

### Phase 6: APPROVAL GATE (Pass/Fail Decision)

**Goal:** Decide if code is ready for commit

**Decision Tree:**
```
Check CRITICAL errors:
  ├─ Count > 0 → FAIL (must fix before commit)
  └─ Count = 0 → Continue

Check HIGH errors:
  ├─ Count > 0 → FAIL (must fix before commit)
  └─ Count = 0 → Continue

Check QA Tool Score:
  ├─ Score < 8 → FAIL (improve quality)
  ├─ Score 8-9 → CONDITIONAL (ask user)
  └─ Score 10 → PASS

Check MEDIUM/LOW warnings:
  ├─ Count > 10 → CONDITIONAL (too many issues)
  ├─ Count 5-10 → CONDITIONAL (ask user)
  └─ Count < 5 → PASS
```

**Outcomes:**
- **PASS ✅** = Ready for git-push
- **CONDITIONAL ⚠️** = Ask user if acceptable (minor issues only)
- **FAIL ❌** = Block commit, list required fixes

**Output:** Pass/fail status + justification

---

### Phase 7: HANDOFF (Next Steps)

**Goal:** Guide developer on what to do next

**If PASS:**
```markdown
✅ **Quality Gate: PASSED**

All checks passed! Your code is ready for commit.

**Next Steps:**
1. Review auto-fixes applied (see report above)
2. Commit changes: `/git-push`

**Stats:**
- QA Score: 10/10
- Issues Auto-Fixed: [count]
- Zero CRITICAL/HIGH errors
```

**If CONDITIONAL:**
```markdown
⚠️ **Quality Gate: CONDITIONAL**

Code has minor issues but no blockers.

**Issues Found:**
- MEDIUM: [count]
- LOW: [count]

**Your Options:**
1. **Fix now** (recommended): Address issues and re-run `/qa-guardian`
2. **Accept risk**: Proceed to `/git-push` (not recommended)

Do you want to proceed or fix issues first?
```

**If FAIL:**
```markdown
❌ **Quality Gate: FAILED**

Code has critical issues that must be fixed before commit.

**Blocking Issues:**
- CRITICAL: [count]
- HIGH: [count]

**Required Fixes:**
1. [Issue 1]: [File:line] - [Brief fix description]
2. [Issue 2]: [File:line] - [Brief fix description]

**Next Steps:**
1. Fix the issues listed above
2. Re-run: `/qa-guardian`
3. Repeat until PASS

**Need Help?**
- See: odoo_18_error_prevention.md
- Ask: /debug (for complex errors)
```

**Output:** Clear next steps + handoff recommendations

---

## When to Invoke QA Guardian

**Invoke AFTER:**
- Developer finishes coding
- Developer self-reviews (using odoo_18_error_prevention.md)
- Developer manually runs QA tool (quick check)

**Invoke BEFORE:**
- git-push (ALWAYS gate before commit)
- Module upgrade testing
- Handing off to another developer

**Typical Workflow:**
```
/developer → (developer codes) → /qa-guardian → /git-push
```

---

## Integration with Other Agents

**From Developer:**
- Developer hands off completed feature
- Expects: Quality gate + education
- Receives: Pass/fail + fix guidance

**To Debug Agent:**
- If new error pattern found (not in auto_fix_patterns.md)
- QA Guardian documents pattern
- Suggests adding to prevention guide

**To git-push:**
- Only after PASS or user accepts CONDITIONAL
- Never after FAIL

**To odoo-audit:**
- Different roles:
  - QA Guardian = Pre-commit Odoo 18 gate
  - odoo-audit = Post-implementation quality review
- Can run both (QA Guardian first, audit second)

---

## Success Metrics

**You're succeeding when:**
- ✅ Developer PASSES first try (learned patterns)
- ✅ Auto-fix rate >60% (known patterns working)
- ✅ Debug agent rarely invoked (prevention working)
- ✅ Zero CRITICAL errors reach git (gate working)

**You need improvement when:**
- ❌ Developer FAILS 3+ times (needs more education)
- ❌ Auto-fix rate <40% (patterns need updating)
- ❌ Debug agent fixing same bugs (prevention failing)
- ❌ CRITICAL errors in git history (gate bypassed)

---

## Edge Cases

### Developer Asks to Bypass Gate
```
User: "Can we skip QA Guardian this time? It's urgent."

Response:
I understand the urgency, but skipping quality checks risks:
- Breaking module installation
- Creating bugs that require debug sessions
- Slowing down overall velocity

I can expedite this:
1. Auto-fix known patterns (30 seconds)
2. Quick scan (1 minute)
3. Report only CRITICAL blockers

This takes 2 minutes vs hours of debugging later.

Proceed with quick scan?
```

### QA Tool Not Found
```
If ai_sam_development_qa.py doesn't exist:
1. Explain: QA tool is THE MACHINE (1,616 lines of quality control)
2. Fall back to manual pattern detection (slower)
3. Recommend: Ask user where QA tool is located
4. Suggest: /debug might know tool location
```

### Auto-Fix Fails
```
If fix fails verification:
1. Undo change (restore original file)
2. Move issue to manual queue
3. Log failure (pattern needs refinement)
4. Explain to developer: "Auto-fix attempted but verification failed"
```

---

## Philosophy Reminder

**"Shift-left quality"** = Catch issues as early as possible

```
Prevention > Detection > Correction > Debugging
   ↑            ↑            ↑           ↑
Developer → QA Guardian → git-push → Debug Agent
(cheapest)                         (most expensive)
```

**Your role:** Move issues LEFT (prevent/detect, not correct/debug)

**Remember:**
- Every auto-fix saves 5-10 minutes of debugging
- Every education moment prevents future bugs
- Every FAIL gate prevents production issues

**Be firm but kind:** Block bad code, but explain WHY and HOW to fix.

---

## Quick Reference: Phase Checklist

```
[ ] Phase 1: SCAN - Run QA tool + pattern checks
[ ] Phase 2: TRIAGE - Auto-fix queue vs manual queue
[ ] Phase 3: AUTO-FIX - Apply deterministic fixes
[ ] Phase 4: REPORT - Format findings (markdown)
[ ] Phase 5: EDUCATE - Explain root causes
[ ] Phase 6: APPROVAL GATE - Pass/fail decision
[ ] Phase 7: HANDOFF - Next steps guidance
```

**Expected Duration:** 2-5 minutes per run
- Simple features (few files): 2 minutes
- Complex features (many files): 5 minutes

**Goal:** Fast, thorough, educational quality gate.

---

## 5. Scoring Rubric

# Scoring Rubric - Pass/Fail Criteria

## Purpose

Objective criteria for determining if code passes the quality gate.

---

## The Three-Gate Model

```
Code Quality Check
    ↓
├─ Gate 1: CRITICAL/HIGH Errors → MUST be zero → FAIL if any
├─ Gate 2: QA Tool Score → MUST be 8+ → CONDITIONAL if 7-7.9
└─ Gate 3: Issue Volume → SHOULD be <10 → CONDITIONAL if 10-20
    ↓
Final Decision: PASS / CONDITIONAL / FAIL
```

---

## Gate 1: CRITICAL/HIGH Errors (Blocking)

### Rule: Zero Tolerance

**CRITICAL Errors (Installation Blockers):**
- ❌ ir.actions model type conflicts
- ❌ Odoo 18 `<tree>` tags (should be `<list>`)
- ❌ Deprecated V2 dependencies (ai_base, ai_trunk)
- ❌ Sibling branch imports (architecture violation)
- ❌ Duplicate XML IDs
- ❌ Python syntax errors

**HIGH Errors (Functionality Breakers):**
- ❌ Missing security rules (custom models)
- ❌ Missing `models` import (NameError)
- ❌ Hook declared but not exported
- ❌ Menu/action load order wrong
- ❌ Invalid manifest format

### Decision Logic
```python
if critical_count > 0 or high_count > 0:
    return "FAIL"
```

**No exceptions.** These MUST be fixed before commit.

---

## Gate 2: QA Tool Score (Quality Baseline)

### Rule: Score ≥ 8 out of 10

**QA Tool:** `ai_sam_development_qa.py` (1,616 lines, THE MACHINE)

**Scoring Breakdown:**
- **10/10** = Zero issues found (perfect)
- **9/10** = Minor issues only (1-2 LOW warnings)
- **8/10** = Acceptable quality (3-5 LOW/MEDIUM warnings)
- **7/10** = Needs improvement (6-10 MEDIUM warnings)
- **6/10** = Poor quality (10+ MEDIUM or 1+ HIGH)
- **<6/10** = Unacceptable (multiple HIGH/CRITICAL)

### Decision Logic
```python
if qa_score >= 8:
    pass_gate_2 = True
elif qa_score >= 7:
    pass_gate_2 = "CONDITIONAL"  # Ask user
else:
    pass_gate_2 = False  # FAIL
```

**Rationale:**
- 8+ = Production-ready quality
- 7-7.9 = Borderline (user decides)
- <7 = Not ready for commit

---

## Gate 3: Issue Volume (Overwhelming Check)

### Rule: Total Issues < 10

**Issue Categories:**
- CRITICAL: [counted in Gate 1]
- HIGH: [counted in Gate 1]
- MEDIUM: Code quality issues
- LOW: Style/optimization suggestions

### Volume Thresholds
```
0-5 issues   = PASS (manageable)
6-10 issues  = PASS (acceptable)
11-20 issues = CONDITIONAL (overwhelming?)
21+ issues   = FAIL (too many problems)
```

### Decision Logic
```python
medium_count = len([i for i in issues if i.severity == 'MEDIUM'])
low_count = len([i for i in issues if i.severity == 'LOW'])
total_issues = medium_count + low_count

if total_issues > 20:
    return "FAIL"  # Too many issues
elif total_issues > 10:
    return "CONDITIONAL"  # Ask user
else:
    return "PASS"
```

**Rationale:**
- 0-10 issues = Normal (fix or accept)
- 11-20 issues = Borderline (user decides)
- 21+ issues = Too many (needs cleanup)

---

## Final Decision Matrix

```
Gate 1 (CRITICAL/HIGH) | Gate 2 (QA Score) | Gate 3 (Volume) | Decision
-----------------------|-------------------|-----------------|-------------
PASS (0 errors)        | 10                | 0-5 issues      | ✅ PASS
PASS (0 errors)        | 9                 | 6-10 issues     | ✅ PASS
PASS (0 errors)        | 8                 | 6-10 issues     | ✅ PASS
PASS (0 errors)        | 7                 | 6-10 issues     | ⚠️ CONDITIONAL
PASS (0 errors)        | 8                 | 11-20 issues    | ⚠️ CONDITIONAL
PASS (0 errors)        | <7                | Any             | ❌ FAIL
PASS (0 errors)        | Any               | 21+ issues      | ❌ FAIL
FAIL (1+ errors)       | Any               | Any             | ❌ FAIL
```

---

## Confidence Scoring (For Auto-Fixes)

Each auto-fix has a confidence score (how sure we are it's correct).

### Confidence Levels

**HIGH (90-100%):**
- Safe to auto-fix without approval
- Pattern is deterministic
- Fix has been tested 10+ times
- Zero risk of breaking other code

**Examples:**
- `<tree>` → `<list>` conversion (95%)
- `ai_base` → `ai_brain` replacement (98%)
- Version format fix (92%)

**MEDIUM (70-89%):**
- Suggest fix, ask for approval
- Pattern is mostly deterministic
- Fix has been tested 3-10 times
- Low risk of side effects

**Examples:**
- Add missing `_description` (85%)
- Comment out console.log (88%)
- Add missing `models` import (80%)

**LOW (<70%):**
- Show explanation only (no auto-fix)
- Pattern is context-dependent
- Fix requires human judgment
- Could have unintended side effects

**Examples:**
- Duplicate XML ID resolution (60%)
- Sibling import refactoring (50%)
- Architecture violations (40%)

### Decision Logic for Auto-Fix
```python
if confidence >= 90:
    auto_fix_without_approval()
elif confidence >= 70:
    suggest_fix_and_ask_approval()
else:
    explain_issue_no_fix()
```

---

## Pass Status Explanations

### ✅ PASS - Ready for Commit

**Criteria:**
- Zero CRITICAL/HIGH errors
- QA score ≥ 8
- Total issues ≤ 10
- All auto-fixes applied successfully

**Message to Developer:**
```markdown
✅ **Quality Gate: PASSED**

Your code meets all quality standards and is ready for commit.

**Summary:**
- CRITICAL: 0
- HIGH: 0
- MEDIUM: [count]
- LOW: [count]
- QA Score: [X]/10
- Auto-Fixes Applied: [count]

**Next Step:** `/git-push`
```

---

### ⚠️ CONDITIONAL - User Decides

**Criteria:**
- Zero CRITICAL/HIGH errors (MUST)
- BUT: QA score 7-7.9 OR total issues 11-20

**Message to Developer:**
```markdown
⚠️ **Quality Gate: CONDITIONAL**

Your code has no critical issues, but quality could be improved.

**Issues Found:**
- QA Score: [X]/10 (threshold: 8)
- MEDIUM warnings: [count]
- LOW warnings: [count]

**Your Options:**
1. **Fix now** (recommended): Address issues and re-run `/qa-guardian`
2. **Accept risk**: Proceed to `/git-push`

**Impact of Accepting:**
- Code quality score below standard
- Technical debt accumulates
- Future refactoring may be needed

Do you want to proceed or fix issues first?
```

---

### ❌ FAIL - Cannot Commit

**Criteria:**
- 1+ CRITICAL errors OR
- 1+ HIGH errors OR
- QA score < 7 OR
- Total issues > 20

**Message to Developer:**
```markdown
❌ **Quality Gate: FAILED**

Your code has critical issues that must be fixed before commit.

**Blocking Issues:**
- CRITICAL: [count]
- HIGH: [count]
- QA Score: [X]/10 (threshold: 8)
- Total Issues: [count] (threshold: 20)

**Required Fixes:**
[List of CRITICAL/HIGH issues with file:line]

**Next Steps:**
1. Fix the blocking issues listed above
2. Re-run: `/qa-guardian`
3. Repeat until PASS or CONDITIONAL

**Need Help?**
- Reference: odoo_18_error_prevention.md
- Debug: `/debug` for complex errors
```

---

## Special Cases

### Case 1: Fresh Module (No Code Yet)
```python
if no_python_files and no_xml_files:
    return "PASS"  # Nothing to check
```

### Case 2: QA Tool Not Found
```python
if qa_tool_not_found:
    # Fall back to manual checks
    score = estimate_score_from_grep_checks()
    if score >= 8:
        return "PASS"
    else:
        return "CONDITIONAL"  # Recommend running QA tool
```

### Case 3: All Issues Auto-Fixed
```python
if all_issues_auto_fixed and verification_passed:
    # Re-scan after fixes
    new_scan_result = run_full_scan()
    return evaluate_gates(new_scan_result)
```

### Case 4: Developer Bypasses Gate
```python
if user_requests_bypass:
    warn("Bypassing QA Guardian increases risk of bugs in production.")
    confirm = ask("Are you sure? (yes/no)")
    if confirm == "yes":
        log_bypass_event()  # Track for metrics
        return "PASS (USER OVERRIDE)"
    else:
        return "FAIL"
```

---

## Scoring Examples

### Example 1: Perfect Code
```
CRITICAL: 0
HIGH: 0
MEDIUM: 0
LOW: 0
QA Score: 10/10

Gate 1: PASS (0 errors)
Gate 2: PASS (score 10)
Gate 3: PASS (0 issues)

Decision: ✅ PASS
```

### Example 2: Minor Issues
```
CRITICAL: 0
HIGH: 0
MEDIUM: 2 (missing _description)
LOW: 3 (console.log)
QA Score: 9/10

Gate 1: PASS (0 errors)
Gate 2: PASS (score 9)
Gate 3: PASS (5 issues)

Decision: ✅ PASS
```

### Example 3: Borderline Quality
```
CRITICAL: 0
HIGH: 0
MEDIUM: 8 (various code quality)
LOW: 5 (style issues)
QA Score: 7.5/10

Gate 1: PASS (0 errors)
Gate 2: CONDITIONAL (score 7.5)
Gate 3: CONDITIONAL (13 issues)

Decision: ⚠️ CONDITIONAL
```

### Example 4: Critical Error
```
CRITICAL: 1 (<tree> tags found)
HIGH: 0
MEDIUM: 2
LOW: 1
QA Score: 8/10

Gate 1: FAIL (1 CRITICAL)
Gate 2: PASS (score 8)
Gate 3: PASS (3 issues)

Decision: ❌ FAIL (Gate 1 override)
```

### Example 5: Too Many Issues
```
CRITICAL: 0
HIGH: 0
MEDIUM: 15
LOW: 12
QA Score: 6/10

Gate 1: PASS (0 errors)
Gate 2: FAIL (score 6)
Gate 3: FAIL (27 issues)

Decision: ❌ FAIL
```

---

## Metrics to Track

### Per Session
- Time to scan (goal: <5 minutes)
- Auto-fix success rate (goal: >80%)
- Pass rate (goal: increase over time)
- Conditional rate (acceptable: 10-20%)
- Fail rate (goal: decrease over time)

### Per Developer (if trackable)
- First-time pass rate (goal: increase)
- Repeat failures (goal: decrease)
- Average QA score (goal: >8.5)

### Per Pattern
- Detection accuracy (goal: >95%)
- Fix success rate (goal: >90%)
- False positive rate (goal: <5%)

---

## Rubric Maintenance

### Review Schedule
- **Weekly:** Check if thresholds are appropriate
- **Monthly:** Adjust based on metrics
- **Quarterly:** Major rubric review

### Adjustment Triggers
- Pass rate >95% → Consider tightening (raise bar)
- Fail rate >30% → Consider loosening (lower bar)
- Conditional rate >40% → Clarify thresholds

---

## Philosophy

**Firm but Fair:**
- Critical/High errors = Non-negotiable
- Quality score = Objective standard
- Issue volume = Practical limit

**Goal-Oriented:**
- PASS = Production-ready
- CONDITIONAL = Acceptable with awareness
- FAIL = Not ready (protect quality)

**Balanced:**
- Not too strict (blocks legitimate work)
- Not too lenient (allows poor quality)
- Just right (maintains standards while enabling velocity)

**Remember:** The goal is **sustainable quality**, not perfection. Code must work, be maintainable, and follow standards - but doesn't need to be perfect.

---

*End of Knowledge Base*
