# SAM AI Manifest Standards

**Last Updated**: 2025-10-16
**Purpose**: Standardized __manifest__.py metadata for ALL SAM AI modules
**Applies To**: All modules in `${SAMAI_ROOT}\`

---

## 🎯 Standardized Fields

When creating or updating ANY SAM AI module manifest, use these exact values:

```python
# -*- coding: utf-8 -*-
{
    'name': '[Module Display Name]',
    'version': '18.0.X.X.X',
    'category': '[Appropriate Category]',
    'license': 'LGPL-3',
    'summary': '[One-line description]',
    'description': """[Multi-line description]""",

    # STANDARDIZED FIELDS (COPY EXACTLY)
    'author': 'Anthony Gardiner - Odoo Consulting & Claude AI',
    'maintainer': 'Anthony Gardiner <anthony@sme.ec>',
    'website': 'https://sme.ec',
    'images': ['static/description/icon.png'],  # SAM icon - use this exact path

    'depends': [...],
    'data': [...],
    'assets': {...},

    'installable': True,
    'application': [True/False],
    'auto_install': False,
}
```

---

## ✅ Required Standards

### Author Field
**ALWAYS use:**
```python
'author': 'Anthony Gardiner - Odoo Consulting & Claude AI',
```

**❌ NEVER use:**
- `'author': 'Anthony Gardiner'` (too short)
- `'author': 'SME'` (wrong)
- `'author': 'Better Business Builders'` (wrong)

### Maintainer Field
**ALWAYS use:**
```python
'maintainer': 'Anthony Gardiner <anthony@sme.ec>',
```

**❌ NEVER use:**
- `'maintainer': 'Anthony Gardiner <https://sme.e>'` (broken email)
- Missing maintainer field entirely

### Website Field
**ALWAYS use:**
```python
'website': 'https://sme.ec',
```

**❌ NEVER use:**
- `'website': 'https://samai.com'` (wrong site)
- `'website': ''` (empty)

### Images Field (SAM Icon)
**ALWAYS use:**
```python
'images': ['static/description/icon.png'],
```

**Icon Requirements:**
- ✅ File must exist at: `[module]/static/description/icon.png`
- ✅ Use the standard SAM AI icon (copied from `ai_sam/static/description/Sam.png`)
- ✅ All 13 modules now have this icon installed

**❌ NEVER use:**
- `'images': ['static/description/Sam.png']` (wrong filename)
- `'images': []` (empty array)
- Missing images field entirely

### License Field
**ALWAYS use:**
```python
'license': 'LGPL-3',
```

**❌ NEVER use:**
- `'license': 'AGPL-3'` (wrong license for SAM AI ecosystem)

---

## 📋 Verification Checklist

Before committing ANY manifest changes:

- [ ] Author = `'Anthony Gardiner - Odoo Consulting & Claude AI'`
- [ ] Maintainer = `'Anthony Gardiner <anthony@sme.ec>'`
- [ ] Website = `'https://sme.ec'`
- [ ] Images = `['static/description/icon.png']`
- [ ] License = `'LGPL-3'`
- [ ] Icon file exists at `static/description/icon.png`

If ALL checkboxes = YES → ✅ Safe to commit
If ANY checkbox = NO → ❌ Fix before committing

---

## 🗂️ All 13 SAM AI Modules

These modules have been standardized (2025-10-16):

1. **ai_brain** - Core data layer (foundation)
2. **ai_sam** - SAM AI Core Framework
3. **ai_sam_intelligence** - Agent registry & knowledge management
4. **ai_sam_memory** - Knowledge graph platform
5. **ai_sam_workflows** - N8N workflow automation
6. **ai_sam_creatives** - Creative content platform
7. **ai_sam_socializer** - Social media & blogging
8. **ai_sam_messenger** - Messenger toggle utility
9. **ai_sam_members** - Member management
10. **ai_sam_docs** - Documentation & dev tools
11. **ai_sam_ui** - Public chat interface
12. **github_app** - GitHub integration
13. **ai_sam_qrcodes** - QR code generator

---

## 🚨 Critical Rules

### 1. NEVER Deviate Without Approval
These standards are ecosystem-wide. If you need to use different values:
1. Ask Anthony first
2. Document the exception in this file
3. Update current_state.md

### 2. Check Before Creating New Modules
When creating a NEW SAM AI module:
- Start with the template above
- Copy icon from `ai_sam/static/description/Sam.png` → `[new_module]/static/description/icon.png`
- Verify all 5 standard fields match exactly

### 3. Update This File If Standards Change
If Anthony changes the standard (e.g., new website domain):
1. Update this manifest_standards.md
2. Run the standardization script: `C:\Users\total\update_manifests.py`
3. Update current_state.md
4. Commit all changes together

---

## 🛠️ Automation Script

**Location**: `C:\Users\total\update_manifests.py`

**Purpose**: Batch update all 13 manifests with standardized metadata

**Usage**:
```bash
python C:\Users\total\update_manifests.py
```

**What it does**:
- Scans all 13 SAM AI modules
- Fixes author, maintainer, website, images, license fields
- Preserves all other manifest content
- Reports changes made

**When to use**:
- After creating new modules
- After manually editing manifests
- If standards change ecosystem-wide
- During quarterly manifest audits

---

## 📞 Questions?

- **Standards Question**: Ask SAM AI (`/sam`)
- **Implementation Question**: Ask Developer (`/developer`)
- **Documentation Update**: Ask Documentation Master (`/docs`)

**Remember**: Consistency across the ecosystem prevents "agent naivety" and ensures all dev agents build modules correctly.

---

**End of Manifest Standards** ✅
