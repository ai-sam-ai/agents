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
