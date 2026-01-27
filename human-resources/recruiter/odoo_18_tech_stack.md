# Odoo 18 Tech Stack - Shared Knowledge for All Niche Skin Agents

**Purpose:** Odoo 18 requirements, tech stack, and error prevention
**Used By:** ALL niche module agents (mod_intelligence, mod_workflows, mod_memory, etc.)
**Last Updated:** 2025-10-17

---

## 🎯 Critical: Read This First!

**This file contains PAINFULLY LEARNED LESSONS from 100+ debug sessions.**

These are the mistakes that:
- ❌ Break installations
- ❌ Block upgrades
- ❌ Cause runtime errors
- ❌ Force debugging sessions

**Learn from others' pain. Don't repeat these mistakes!**

---

## 🖥️ Our Tech Stack

### **Odoo Version**
- **Odoo 18.0** (latest stable)
- Breaking changes from Odoo 17 (see below)
- OWL framework (modern JavaScript)

### **Python**
- **Python 3.12**
- Type hints recommended
- Async/await supported

### **Database**
- **PostgreSQL 15**
- User: `odoo_user`
- Database: per-instance
- Connection: `postgresql://odoo_user:password@localhost:5432/database_name`

### **Path Structure**
- **SAM AI Root:** `C:\Working With AI\ai_sam\ai_sam\`
- **Foundation:** `ai_brain\`, `ai_sam\`
- **Modules:** `ai_sam_{module_name}\`

---

## 🚨 CRITICAL ERROR PATTERNS (Must Prevent!)

### 1. Odoo 18 Breaking Change: `<tree>` → `<list>`

**❌ WRONG (Odoo 17 style):**
```xml
<record id="view_conversation_tree" model="ir.ui.view">
    <field name="arch" type="xml">
        <tree string="Conversations">
            <field name="name"/>
        </tree>
    </field>
</record>

<record id="action_conversations" model="ir.actions.act_window">
    <field name="view_mode">form,tree</field>
</record>
```

**✅ CORRECT (Odoo 18 style):**
```xml
<record id="view_conversation_tree" model="ir.ui.view">
    <field name="arch" type="xml">
        <list string="Conversations">
            <field name="name"/>
        </list>
    </field>
</record>

<record id="action_conversations" model="ir.actions.act_window">
    <field name="view_mode">form,list</field>
</record>
```

**Why It Matters:** Odoo 18 validation errors, views won't render

**Prevention:**
- Search for `<tree` in your XML before committing
- Use `<list>` for all list views
- Check `view_mode` fields (use `list` not `tree`)

---

### 2. Version Format (Odoo 18 Requirement)

**❌ WRONG:**
```python
'version': '1.0.0'      # Generic format
'version': '1.0'        # Too short
'version': '17.0.1.0'   # Wrong Odoo version
```

**✅ CORRECT:**
```python
'version': '18.0.1.0'          # Standard format
'version': '18.0.1.0.0'        # With patch number (OK)
'version': '18.0.2.5'          # Incremented (OK)
```

**Format Rule:** `18.0.MAJOR.MINOR[.PATCH]`

**Prevention:**
- ALWAYS start with `18.0.`
- Use semantic versioning after
- Check manifest before committing

---

### 3. Missing Security Rules

**❌ WRONG:**
```python
# models/ai_graph_node.py
class AiGraphNode(models.Model):
    _name = 'ai.graph.node'
    _description = 'AI Graph Node'

    name = fields.Char(string='Name', required=True)

# security/ir.model.access.csv - MISSING or model not included!
```

**✅ CORRECT:**
```python
# models/ai_graph_node.py
class AiGraphNode(models.Model):
    _name = 'ai.graph.node'
    _description = 'AI Graph Node'

    name = fields.Char(string='Name', required=True)
```

```csv
# security/ir.model.access.csv (REQUIRED!)
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_ai_graph_node_user,AI Graph Node User,model_ai_graph_node,base.group_user,1,1,1,1
access_ai_graph_node_manager,AI Graph Node Manager,model_ai_graph_node,base.group_system,1,1,1,1
```

```python
# __manifest__.py (MUST INCLUDE!)
'data': [
    'security/ir.model.access.csv',  # Load FIRST
    'views/graph_views.xml',
]
```

**Why It Matters:** AccessError when users try to access records

**Prevention:**
- **EVERY custom model MUST have security rules**
- Minimum: User + Manager rows
- Load security BEFORE views in manifest
- Test with non-admin user

---

### 4. Deprecated V2 Module Names

**❌ WRONG:**
```python
'depends': [
    'base',
    'ai_base',    # V2 name (deprecated)
    'ai_trunk',   # V2 name (deprecated)
]
```

**✅ CORRECT:**
```python
'depends': [
    'base',
    'ai_brain',   # V3 name
    'ai_sam',     # V3 name
]
```

**V2 → V3 Mapping:**
- `ai_base` → `ai_brain`
- `ai_trunk` → `ai_sam`
- `ai_automator_base` → `the_ai_automator` (if needed)

**Prevention:**
- ALWAYS use V3 names
- Search dependencies before committing
- Never reference V2 modules

---

### 5. Sibling Branch Dependencies (Architecture Violation)

**❌ WRONG:**
```python
# ai_sam_memory/models/memory_service.py
from odoo.addons.the_ai_automator.models.workflow import N8NWorkflow
# ❌ CRITICAL: Branch importing from sibling branch!

from odoo.addons.ai_sam_workflows.models.canvas import Canvas
# ❌ CRITICAL: Cross-branch import!
```

**✅ CORRECT:**
```python
# ai_sam_memory/models/memory_service.py
from odoo.addons.ai_brain.models.workflow_base import WorkflowBase
# ✅ Foundation import (allowed)

from odoo.addons.ai_sam.controllers.canvas_controller import CanvasController
# ✅ Framework import (allowed)
```

**Allowed Imports:**
- ✅ `odoo.addons.ai_brain.*` (foundation)
- ✅ `odoo.addons.ai_sam.*` (framework)
- ✅ Standard Odoo modules (`base`, `web`, `mail`, etc.)

**Forbidden Imports:**
- ❌ `odoo.addons.ai_sam_memory.*` (sibling)
- ❌ `odoo.addons.ai_sam_workflows.*` (sibling)
- ❌ `odoo.addons.the_ai_automator.*` (sibling)
- ❌ Any other `ai_sam_*` module (all are siblings!)

**Why It Matters:** Violates V3 architecture, breaks modularity

**Prevention:**
- Before importing from `odoo.addons.X`, check if X is a sibling
- If you need shared code, propose moving it to ai_brain
- Use Odoo environment for cross-module access: `self.env['model.name']`

---

### 6. ir.actions Model Type Conflicts

**❌ WRONG (Breaks Upgrades):**
```xml
<!-- Version 1 (already installed) -->
<record id="action_memory_view" model="ir.actions.client">
    <field name="tag">MemoryCanvas</field>
</record>

<!-- Version 2 (BREAKS UPGRADE!) -->
<record id="action_memory_view" model="ir.actions.act_url">
    <field name="url">/memory/graph</field>
</record>
```

**✅ CORRECT (Two Options):**
```xml
<!-- Option 1: Delete old record first -->
<delete model="ir.actions.client" id="action_memory_view" search="[]"/>
<record id="action_memory_view" model="ir.actions.act_url">
    <field name="url">/memory/graph</field>
</record>

<!-- Option 2: Use different ID -->
<record id="action_memory_view_v2" model="ir.actions.act_url">
    <field name="url">/memory/graph</field>
</record>
<menuitem id="menu_memory" action="action_memory_view_v2"/>
```

**Why It Matters:** Odoo CANNOT change model type of existing records, blocks upgrades

**Prevention:**
- Check if ID already exists before changing action type
- Use git history to see if action was previously defined
- Consider new ID instead of reusing

---

### 7. Missing Python Imports

**❌ WRONG:**
```python
# models/ai_conversation.py
from odoo import fields, api  # Missing 'models'!

class AiConversation(models.Model):  # NameError: models not defined!
    _name = 'ai.conversation'
```

**✅ CORRECT:**
```python
# models/ai_conversation.py
from odoo import models, fields, api  # Include 'models'

class AiConversation(models.Model):  # Works!
    _name = 'ai.conversation'
    _description = 'AI Conversation'
```

**Common Imports Needed:**
```python
# Most model files need:
from odoo import models, fields, api

# If using exceptions:
from odoo.exceptions import UserError, ValidationError

# If using translation:
from odoo import _

# If building controllers:
from odoo import http
```

**Prevention:**
- Every model file imports `models`
- Every controller imports `http`
- Import exceptions when raising errors
- Don't import unused modules (QA tool warns)

---

### 8. Menu/Action Dependency Ordering

**❌ WRONG:**
```python
# __manifest__.py
'data': [
    'views/menus.xml',      # ❌ Loads first (references actions that don't exist yet!)
    'views/actions.xml',    # ❌ Loads second (too late!)
]
```

**✅ CORRECT:**
```python
# __manifest__.py (CORRECT ORDER!)
'data': [
    'security/ir.model.access.csv',  # 1. Security (always first)
    'views/actions.xml',              # 2. Actions (before menus)
    'views/menus.xml',                # 3. Menus (reference actions)
    'views/model_views.xml',          # 4. Views (last)
]
```

**Load Order Rules:**
1. Security (`security/`)
2. Data (`data/`)
3. Actions (`views/*_actions.xml`)
4. Menus (`views/*_menus.xml`)
5. Views (`views/*_views.xml`)
6. Reports/Templates

**Prevention:**
- Check manifest `data` array order
- Security always first
- Actions before menus
- Views last

---

### 9. Missing `_description` Field

**❌ WRONG (Odoo logs warning):**
```python
class AiConversation(models.Model):
    _name = 'ai.conversation'
    # Missing _description
```

**✅ CORRECT:**
```python
class AiConversation(models.Model):
    _name = 'ai.conversation'
    _description = 'AI Conversation History'
```

**Prevention:**
- ALWAYS add `_description` after `_name`
- Use descriptive text (shows in UI)
- QA tool warns if missing

---

### 10. Duplicate XML IDs

**❌ WRONG:**
```xml
<record id="action_memory_view" model="ir.actions.act_window">
    <field name="name">Memory View</field>
</record>

<record id="action_memory_view" model="ir.actions.client">
    <!-- ❌ DUPLICATE ID! ParseError on install -->
</record>
```

**✅ CORRECT:**
```xml
<record id="action_memory_view_window" model="ir.actions.act_window">
    <field name="name">Memory View</field>
</record>

<record id="action_memory_view_client" model="ir.actions.client">
    <!-- ✅ Unique IDs -->
</record>
```

**Prevention:**
- Use descriptive IDs (include model/purpose)
- Search before creating: `grep -r 'id="action_memory"' views/`
- Find duplicates: `grep -oP 'id="\K[^"]+' views/*.xml | sort | uniq -d`

---

## 📋 PRE-COMMIT CHECKLIST (Run EVERY Time!)

**Before handing off to QA Guardian or git-push:**

### XML Files
- [ ] No `<tree>` tags (use `<list>`)
- [ ] view_mode uses `list` not `tree`
- [ ] No duplicate IDs
- [ ] Actions defined before menus
- [ ] No ir.actions model type conflicts

### Python Files
- [ ] All models import `models`
- [ ] Every model has `_description`
- [ ] No sibling branch imports
- [ ] Security rules exist for custom models
- [ ] Type hints on functions (recommended)

### Manifest
- [ ] Version starts with `18.0.`
- [ ] Dependencies use V3 names (ai_brain, ai_sam)
- [ ] Data files in correct load order
- [ ] Hooks imported in __init__.py (if used)

### Platform Skin Rules (CRITICAL!)
- [ ] NO data models in THIS module (they're in ai_brain!)
- [ ] Only views, JS, CSS, controllers (UI only)
- [ ] Module is uninstallable without data loss

---

## 🎯 Odoo 18 Best Practices

### 1. Model Definition
```python
class AiConversation(models.Model):
    _name = 'ai.conversation'                    # Required
    _description = 'AI Conversation History'      # Required (Odoo 18)
    _order = 'create_date desc'                   # Recommended
    _rec_name = 'name'                           # If not 'name' field

    name = fields.Char(string='Name', required=True)
```

### 2. Field Definitions
```python
# Use string parameter (UI labels)
name = fields.Char(string='Conversation Name', required=True)

# Use help parameter (tooltips)
status = fields.Selection([
    ('draft', 'Draft'),
    ('active', 'Active'),
], string='Status', help='Current conversation status')

# Use compute with store (performance)
message_count = fields.Integer(
    string='Message Count',
    compute='_compute_message_count',
    store=True  # Cache in database
)

@api.depends('message_ids')
def _compute_message_count(self):
    for record in self:
        record.message_count = len(record.message_ids)
```

### 3. Security Rules
```csv
# Minimum required (in security/ir.model.access.csv)
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_{model}_user,{Model} User,model_{model},base.group_user,1,1,1,1
access_{model}_manager,{Model} Manager,model_{model},base.group_system,1,1,1,1
```

### 4. XML View Structure
```xml
<odoo>
    <record id="view_{model}_form" model="ir.ui.view">
        <field name="name">{model}.form</field>
        <field name="model">{model}</field>
        <field name="arch" type="xml">
            <form string="{Model Name}">
                <sheet>
                    <group>
                        <field name="name"/>
                    </group>
                </sheet>
            </form>
        </field>
    </record>
</odoo>
```

---

## ⚠️ Error Severity Guide

**CRITICAL** = Blocks install/upgrade (MUST FIX)
- ir.actions conflicts
- Deprecated dependencies
- Sibling imports
- Odoo 18 incompatibilities (`<tree>` tags)
- Duplicate XML IDs

**HIGH** = Breaks functionality (SHOULD FIX)
- Missing security rules
- Import errors
- Hook issues
- Menu/action ordering

**MEDIUM** = Code quality (GOOD TO FIX)
- Missing `_description`
- Wrong version format
- Data models in platform skins (architecture violation)

**LOW** = Style/optimization (NICE TO FIX)
- Excessive console.log
- Missing type hints
- Unused imports

---

## 🔧 Quick Reference

### Common Commands
```bash
# Find <tree> tags (Odoo 18 violation)
grep -rn '<tree' views/*.xml

# Find duplicate XML IDs
grep -oP 'id="\K[^"]+' views/*.xml | sort | uniq -d

# Check version format
grep "'version':" __manifest__.py

# Check deprecated dependencies
grep -E "'ai_base'|'ai_trunk'" __manifest__.py

# Find models without _description
grep -l '_name\s*=' models/*.py | xargs grep -L '_description'
```

### Quick Fixes
```bash
# Replace <tree> with <list>
find views/ -name "*.xml" -exec sed -i 's/<tree/<list/g; s/<\/tree>/<\/list>/g' {} +

# Update version to Odoo 18 format
# (Manual: change 'version': 'X.Y.Z' to 'version': '18.0.X.Y')
```

---

## ✅ Success Criteria

**You're coding well when:**
- ✅ QA tool approves first try (no issues)
- ✅ Module installs/upgrades without errors
- ✅ Zero CRITICAL errors
- ✅ No architecture violations
- ✅ Score ≥8/10 from QA tool

**You need to review this file when:**
- ❌ QA tool finds 3+ issues
- ❌ Installation fails
- ❌ Same bug type repeated
- ❌ Score <7/10

---

**Remember:** These patterns were learned through pain. Save yourself debugging time by preventing them from the start!

**Goal:** Move from **reactive debugging** to **proactive quality**.

---

**Last Updated:** 2025-10-17
**Source:** Developer + QA Guardian agent knowledge
**Maintained By:** Chief of Staff (/cos)
**Used By:** ALL niche module agents
