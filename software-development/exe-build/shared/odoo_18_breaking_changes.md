# Odoo 18 Breaking Changes - Migration Guide

**Created:** 2025-11-13
**Purpose:** Prevent repeated Odoo 17 → 18 migration errors across all agents
**Scope:** SAM AI Desktop Installer (Odoo 18.0 Community Edition)

---

## 🚨 CRITICAL: We Are Building for Odoo 18

**Target Version:** Odoo 18.0 (Released October 2024)
**Previous Version:** Odoo 17.0 (Released November 2023)

**DO NOT use Odoo 17 patterns - they will cause runtime errors!**

---

## 📋 Breaking Changes Checklist

### 1. ⚠️ XML Views: `<tree>` → `<list>` (CRITICAL)

**What changed:**
- Odoo 17: Used `<tree>` for list views
- Odoo 18: Renamed to `<list>` (more semantically correct)

**Why it breaks:**
- `<tree>` still works but is DEPRECATED
- Future Odoo versions may remove `<tree>` entirely
- Best practice: Use `<list>` in new Odoo 18 code

**Examples:**

❌ **Odoo 17 Pattern (OLD - Don't use):**
```xml
<record id="view_ai_conversation_tree" model="ir.ui.view">
    <field name="name">ai.conversation.tree</field>
    <field name="model">ai.conversation</field>
    <field name="arch" type="xml">
        <tree string="Conversations">
            <field name="user_id"/>
            <field name="create_date"/>
        </tree>
    </field>
</record>
```

✅ **Odoo 18 Pattern (NEW - Use this):**
```xml
<record id="view_ai_conversation_list" model="ir.ui.view">
    <field name="name">ai.conversation.list</field>
    <field name="model">ai.conversation</field>
    <field name="arch" type="xml">
        <list string="Conversations">
            <field name="user_id"/>
            <field name="create_date"/>
        </list>
    </field>
</record>
```

**Detection Pattern:**
```bash
# Find all uses of <tree> in XML files
grep -r "<tree" --include="*.xml" D:/SAMAI-18-SaaS/github-repos/
```

**Auto-Fix:**
```bash
# Replace <tree> with <list> in all XML views
sed -i 's/<tree/<list/g' file.xml
sed -i 's/<\/tree>/<\/list>/g' file.xml
```

---

### 2. ⚠️ Python Hooks: Signature Change (CRITICAL)

**What changed:**
- Odoo 17: `post_init_hook(cr, registry)`
- Odoo 18: `post_init_hook(env)`

**Why it breaks:**
- Odoo 18 changed hook signature to simplify API
- Old signature causes `TypeError: missing 1 required positional argument: 'registry'`
- Affects: `post_init_hook`, `post_update_hook`, `uninstall_hook`

**Examples:**

❌ **Odoo 17 Pattern (OLD - Don't use):**
```python
from odoo import api, SUPERUSER_ID

def post_init_hook(cr, registry):
    """Post-installation hook."""
    env = api.Environment(cr, SUPERUSER_ID, {})

    # Do initialization
    env['ai.brain'].search([]).initialize()
```

✅ **Odoo 18 Pattern (NEW - Use this):**
```python
# No imports needed - env is provided

def post_init_hook(env):
    """Post-installation hook."""
    # env is already an Environment object
    # No need to create it manually

    # Do initialization
    env['ai.brain'].search([]).initialize()
```

**Detection Pattern:**
```bash
# Find old hook signatures
grep -r "def post_init_hook(cr, registry)" --include="*.py"
grep -r "def post_update_hook(cr, registry)" --include="*.py"
grep -r "def uninstall_hook(cr, registry)" --include="*.py"
```

**Affected Files (SAM AI):**
- `D:/SAMAI-18-SaaS/github-repos/04-samai-brain/ai_brain/hooks.py`
- `D:/SAMAI-18-SaaS/github-repos/05-samai-core/ai_sam_intelligence/hooks.py`
- Any other modules with `post_init_hook` or `post_update_hook`

**Fixed in:** Issue #17 (2025-11-13)

---

### 3. ⚠️ Module Version Format: 17.0.x.y → 18.0.x.y (HIGH)

**What changed:**
- Odoo 17 modules: Version `17.0.1.0`, `17.0.2.5`, etc.
- Odoo 18 modules: Version `18.0.1.0`, `18.0.2.5`, etc.

**Why it matters:**
- Odoo uses version to determine module compatibility
- Wrong version = module won't load
- Format: `{ODOO_VERSION}.{MODULE_MAJOR}.{MODULE_MINOR}`

**Examples:**

❌ **Odoo 17 Version (OLD - Don't use):**
```python
{
    'name': 'AI Brain',
    'version': '17.0.1.0',  # ← WRONG for Odoo 18
    'category': 'AI',
    ...
}
```

✅ **Odoo 18 Version (NEW - Use this):**
```python
{
    'name': 'AI Brain',
    'version': '18.0.1.0',  # ← Correct for Odoo 18
    'category': 'AI',
    ...
}
```

**Detection Pattern:**
```bash
# Find all Odoo 17 versions in manifests
grep -r "'version'.*'17\.0" --include="__manifest__.py"
```

**Auto-Fix:**
```bash
# Replace 17.0 with 18.0 in all manifests
sed -i "s/'version': '17\.0/'version': '18.0/g" __manifest__.py
```

---

### 4. ⚠️ OWL Framework: Major Changes (MEDIUM)

**What changed:**
- Odoo 18 uses OWL 2.0 (complete rewrite)
- Component lifecycle methods changed
- Props/state handling updated

**Common Issues:**
- `setup()` lifecycle method changed
- `useState` hook replaced with `reactive()`
- `Component.env` access patterns different

**Examples:**

❌ **OWL 1.0 (Odoo 17 - OLD):**
```javascript
const { Component, useState } = owl;

class MyComponent extends Component {
    setup() {
        this.state = useState({
            value: 0
        });
    }
}
```

✅ **OWL 2.0 (Odoo 18 - NEW):**
```javascript
const { Component, reactive } = owl;

class MyComponent extends Component {
    setup() {
        this.state = reactive({
            value: 0
        });
    }
}
```

**Reference:** SAM AI uses minimal custom JS, so this is lower priority

---

### 5. ⚠️ Dependencies: Python Package Changes (MEDIUM)

**What changed:**
- Odoo 18 updated required Python packages
- Some packages deprecated, new ones added
- Minimum versions increased

**Key Changes:**
- `Werkzeug`: 2.0.x → 3.0.x
- `Babel`: 2.9.1 → 2.12.1
- `lxml`: 4.9.2 → 5.1.0
- `Pillow`: 9.4.0 → 10.2.0

**SAM AI Impact:**
- Must use compatible versions in `requirements.txt`
- Python 3.10+ required (Odoo 18 dropped Python 3.8 support)

**Detection:**
```bash
# Check requirements.txt for old package versions
cat requirements.txt | grep -E "Werkzeug==2\.|Babel==2\.9|lxml==4\.|Pillow==9\."
```

---

### 6. ⚠️ Model Field Changes (LOW - Mostly Backwards Compatible)

**What changed:**
- Some field parameters renamed
- New field types added
- Default behaviors changed

**Example:**
```python
# Odoo 17:
user_id = fields.Many2one('res.users', string='User', ondelete='cascade')

# Odoo 18 (same, but ondelete='restrict' is now default):
user_id = fields.Many2one('res.users', string='User')  # ondelete='restrict' implied
```

**SAM AI Impact:** Minimal - most field definitions are compatible

---

### 7. ⚠️ Security Rules: Changes to ir.model.access (LOW)

**What changed:**
- Format mostly unchanged
- Better validation of access rules
- Stricter enforcement of model naming

**SAM AI Impact:** Existing security rules work fine

---

## 🔍 Detection Strategy

### Quick Scan Command (Run Before Building)
```powershell
# Run from: D:\SAMAI-18-SaaS\github-repos\

Write-Host "🔍 Scanning for Odoo 17 patterns..."

# 1. Check for <tree> in XML
$treeIssues = Get-ChildItem -Recurse -Include "*.xml" | Select-String "<tree"
if ($treeIssues) {
    Write-Host "❌ Found <tree> tags (should be <list>):" -ForegroundColor Red
    $treeIssues | Format-Table -AutoSize
}

# 2. Check for old hook signatures
$hookIssues = Get-ChildItem -Recurse -Include "*.py" | Select-String "def post_init_hook\(cr, registry\)"
if ($hookIssues) {
    Write-Host "❌ Found old hook signatures:" -ForegroundColor Red
    $hookIssues | Format-Table -AutoSize
}

# 3. Check for version 17.0 in manifests
$versionIssues = Get-ChildItem -Recurse -Include "__manifest__.py" | Select-String "'version': '17\.0"
if ($versionIssues) {
    Write-Host "❌ Found Odoo 17 versions:" -ForegroundColor Red
    $versionIssues | Format-Table -AutoSize
}

Write-Host "✅ Scan complete!" -ForegroundColor Green
```

---

## 🛠️ Automated Fix Script

```powershell
# Auto-fix common Odoo 17 → 18 issues
# Run from: D:\SAMAI-18-SaaS\github-repos\

Write-Host "🔧 Applying Odoo 18 fixes..."

# Fix 1: Replace <tree> with <list> in XML files
Get-ChildItem -Recurse -Include "*.xml" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "<tree") {
        $content = $content -replace "<tree", "<list"
        $content = $content -replace "</tree>", "</list>"
        Set-Content $_.FullName $content
        Write-Host "✅ Fixed: $($_.FullName)" -ForegroundColor Green
    }
}

# Fix 2: Update manifest versions 17.0 → 18.0
Get-ChildItem -Recurse -Include "__manifest__.py" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "'version': '17\.0") {
        $content = $content -replace "'version': '17\.0", "'version': '18.0"
        Set-Content $_.FullName $content
        Write-Host "✅ Fixed version: $($_.FullName)" -ForegroundColor Green
    }
}

Write-Host "✅ Auto-fix complete!" -ForegroundColor Green
Write-Host "⚠️  Manual review required for hook signatures (post_init_hook)" -ForegroundColor Yellow
```

---

## 📊 SAM AI Specific Issues (Fixed & Pending)

### ✅ **FIXED Issues:**

1. **Issue #17: Hook Signatures** (Fixed 2025-11-13)
   - `ai_brain/hooks.py`: Updated to `post_init_hook(env)`
   - `ai_sam_intelligence/hooks.py`: Updated to `post_init_hook(env)`

### ⚠️ **PENDING Review:**

2. **XML Views: `<tree>` → `<list>` Migration**
   - Status: Needs comprehensive scan
   - Impact: 8 modules × ~5-10 views each = 40-80 files
   - Priority: MEDIUM (deprecated but still works)

3. **Module Versions: 17.0 → 18.0**
   - Status: Needs verification in all 8 modules
   - Impact: All `__manifest__.py` files
   - Priority: HIGH (affects module loading)

4. **JavaScript/OWL Updates**
   - Status: Needs review of custom JS files
   - Impact: SAM AI chat interface (sam_chat_vanilla_v2.js)
   - Priority: LOW (minimal custom OWL usage)

---

## 🎯 Integration with Agents

### For /exe-diagnose:
**Add to diagnostic checks:**
```markdown
## Odoo 18 Compatibility Check

1. Scan for `<tree>` in XML files
   - Should be: `<list>`
   - Files affected: [list]

2. Scan for old hook signatures
   - Pattern: `def post_init_hook(cr, registry)`
   - Should be: `def post_init_hook(env)`
   - Files affected: [list]

3. Check module versions
   - Pattern: `'version': '17.0`
   - Should be: `'version': '18.0`
   - Files affected: [list]
```

### For /exe-update:
**Add pre-compilation validation:**
```markdown
## Before Compilation - Odoo 18 Validation

Run Odoo 18 compatibility scan:
- ✅ All hooks use Odoo 18 signature
- ✅ All manifests have version 18.0.x.y
- ✅ No `<tree>` tags in XML (use `<list>`)

If issues found → STOP and fix before compiling
```

### For /developer:
**Add to pre-commit checks:**
```markdown
## New Code Requirements - Odoo 18

When writing new Odoo code:
- ✅ Use `<list>` not `<tree>` in XML views
- ✅ Use `post_init_hook(env)` not `post_init_hook(cr, registry)`
- ✅ Set version to `18.0.x.y` in manifest
- ✅ Use Python 3.10+ compatible syntax
```

---

## 📚 Quick Reference Card

### Odoo 17 → 18 Cheat Sheet

| Component | Odoo 17 (OLD) | Odoo 18 (NEW) | Priority |
|-----------|---------------|---------------|----------|
| **XML List Views** | `<tree>` | `<list>` | MEDIUM |
| **Hook Signature** | `(cr, registry)` | `(env)` | CRITICAL |
| **Module Version** | `17.0.x.y` | `18.0.x.y` | HIGH |
| **OWL Framework** | OWL 1.0 | OWL 2.0 | LOW |
| **Python Version** | 3.8+ | 3.10+ | HIGH |
| **Werkzeug** | 2.0.x | 3.0.x | MEDIUM |

---

## 🚨 Common Error Messages (and What They Mean)

### Error 1: Hook TypeError
```
TypeError: post_init_hook() missing 1 required positional argument: 'registry'
```
**Cause:** Using Odoo 17 hook signature `(cr, registry)` in Odoo 18
**Fix:** Change to `(env)` signature

---

### Error 2: Module Load Failure
```
Module ai_brain: version 17.0.1.0 is incompatible with this Odoo 18 server
```
**Cause:** Manifest has wrong version number
**Fix:** Change `'version': '17.0.1.0'` to `'version': '18.0.1.0'`

---

### Error 3: XML View Deprecated Warning
```
DeprecationWarning: <tree> is deprecated in Odoo 18, use <list> instead
```
**Cause:** Using `<tree>` instead of `<list>` in XML views
**Fix:** Replace all `<tree>` with `<list>` in view definitions

---

## ✅ Pre-Build Checklist

Before compiling SAM AI installer, verify:

- [ ] All `__manifest__.py` files have `version: '18.0.x.y'`
- [ ] All hooks use `post_init_hook(env)` signature (not `cr, registry`)
- [ ] All XML views use `<list>` (not `<tree>`)
- [ ] Python dependencies compatible with Odoo 18
- [ ] No Python 3.8-specific code (use 3.10+ features)

---

## 🎓 Learning Resources

**Official Odoo 18 Documentation:**
- [Odoo 18 Release Notes](https://www.odoo.com/odoo-18-release-notes)
- [Odoo 18 Migration Guide](https://www.odoo.com/documentation/18.0/developer/howtos/upgrade_custom_db.html)
- [OWL 2.0 Documentation](https://github.com/odoo/owl)

**SAM AI Specific:**
- All modules target: Odoo 18.0 Community Edition
- Python version: 3.10+ (bundled with installer)
- Database: PostgreSQL 15

---

## 📝 Maintenance Protocol

**When to update this file:**
1. New Odoo 18 breaking change discovered
2. SAM AI module encounters Odoo 17 pattern
3. Installer build fails due to compatibility issue
4. New Odoo 18.x minor version released with changes

**Responsibility:** All exe-build agents + /developer agent

---

**End of Odoo 18 Breaking Changes Guide**

**Remember:** SAM AI is built for Odoo 18. When in doubt, use Odoo 18 patterns!
