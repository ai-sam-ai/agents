# Odoo 18 Error Prevention - Don't Make These Mistakes!

## Purpose

This file contains painfully-learned lessons extracted from 100+ debug sessions. These are the mistakes that cause bugs, break installations, and force debugging. **Learn from others' pain.**

**Philosophy:** "An ounce of prevention is worth a pound of debugging."

---

## CRITICAL ERROR PATTERNS (Must Prevent!)

### 1. ir.actions Model Type Conflicts

**THE MISTAKE:**
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

**WHY IT BREAKS:**
Odoo CANNOT change model type of existing ir.actions record. The external ID is already linked to one model in the database.

**THE FIX:**
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

**PREVENTION CHECKLIST:**
- [ ] Before changing action model type, check if ID already exists
- [ ] Use git history to see if action was previously defined
- [ ] Consider new ID instead of reusing old one

**Severity:** CRITICAL (blocks upgrade)
**QA Tool Detection:** Lines 197-233 in ai_sam_development_qa.py

---

### 2. Odoo 18 Breaking Change: `<tree>` → `<list>`

**THE MISTAKE:**
```xml
<!-- ❌ WRONG (Odoo 17 style) -->
<record id="view_conversation_tree" model="ir.ui.view">
    <field name="model">ai.conversation</field>
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

**WHY IT BREAKS:**
Odoo 18 renamed `<tree>` to `<list>` for list views. Using `<tree>` causes validation errors.

**THE FIX:**
```xml
<!-- ✅ CORRECT (Odoo 18 style) -->
<record id="view_conversation_tree" model="ir.ui.view">
    <field name="model">ai.conversation</field>
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

**PREVENTION CHECKLIST:**
- [ ] Search for `<tree` in your XML files BEFORE committing
- [ ] Check `view_mode` fields (use `list` not `tree`)
- [ ] Run: `grep -r '<tree' views/*.xml` and fix all matches

**Severity:** CRITICAL (Odoo 18 incompatibility)
**QA Tool Detection:** Lines 180-189 in ai_sam_development_qa.py

---

### 3. Sibling Branch Dependencies (Architecture Violation)

**THE MISTAKE:**
```python
# ai_sam_memory/models/memory_service.py
from odoo.addons.the_ai_automator.models.workflow import N8NWorkflow
# ❌ CRITICAL: Branch importing from sibling branch!

class MemoryService(models.Model):
    _name = 'ai.memory.service'

    def trigger_workflow(self):
        workflow = N8NWorkflow()  # ❌ Sibling dependency!
```

**WHY IT BREAKS:**
Branch modules are **independent siblings**, not parent-child. They can ONLY depend on ai_brain and ai_sam, never each other.

**THE FIX:**
```python
# Solution: Move shared code to ai_brain (foundation)

# ai_brain/models/workflow_base.py
class WorkflowBase(models.AbstractModel):
    _name = 'workflow.base'
    # Shared workflow logic

# ai_sam_memory/models/memory_service.py
from odoo.addons.ai_brain.models.workflow_base import WorkflowBase
# ✅ Foundation import (allowed)

class MemoryService(models.Model):
    _name = 'ai.memory.service'

    def trigger_workflow(self):
        # Access via foundation or use Odoo environment
        self.env['workflow.base'].execute()
```

**PREVENTION CHECKLIST:**
- [ ] Before importing from `odoo.addons.X`, check if X is a sibling branch
- [ ] Allowed imports: `ai_brain`, `ai_sam`, standard Odoo modules
- [ ] Forbidden imports: `the_ai_automator`, `ai_sam_memory`, `ai_poppy`, etc.
- [ ] If you need shared code, propose moving it to ai_brain

**Severity:** CRITICAL (architecture violation)
**QA Tool Detection:** Lines 371-425 in ai_sam_development_qa.py

---

### 4. Missing Security Rules

**THE MISTAKE:**
```python
# models/ai_graph_node.py
class AiGraphNode(models.Model):
    _name = 'ai.graph.node'  # ✓ Model defined
    _description = 'AI Graph Node'

    name = fields.Char(string='Name', required=True)

# security/ir.model.access.csv
# ❌ File doesn't exist or model not included!
```

**WHY IT BREAKS:**
Custom models without security rules throw AccessError when users try to access records.

**THE FIX:**
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

**PREVENTION CHECKLIST:**
- [ ] Every custom model MUST have security rules
- [ ] Minimum: User + Manager rows in ir.model.access.csv
- [ ] Load security BEFORE views in __manifest__.py
- [ ] Test with non-admin user to verify access

**Severity:** HIGH (breaks functionality)
**QA Tool Detection:** Lines 891-919 in ai_sam_development_qa.py

---

### 5. Version Format Error (Odoo 18)

**THE MISTAKE:**
```python
# __manifest__.py
{
    'name': 'AI Memory',
    'version': '1.0.0',  # ❌ Wrong format!
}
```

**WHY IT BREAKS:**
Odoo 18 requires version format: `18.0.x.y` or `18.0.x.y.z`

**THE FIX:**
```python
# __manifest__.py
{
    'name': 'AI Memory',
    'version': '18.0.1.0',  # ✅ Correct format
}
```

**PREVENTION CHECKLIST:**
- [ ] Always start version with `18.0.`
- [ ] Use semantic versioning after: `18.0.MAJOR.MINOR[.PATCH]`
- [ ] Run: `grep "'version'" __manifest__.py` and verify format

**Severity:** HIGH (installation warning/error)
**QA Tool Detection:** Lines 340-350 in ai_sam_development_qa.py

---

### 6. Deprecated V2 Module Names

**THE MISTAKE:**
```python
# __manifest__.py
'depends': [
    'base',
    'ai_base',    # ❌ V2 name (deprecated)
    'ai_trunk',   # ❌ V2 name (deprecated)
]
```

**WHY IT BREAKS:**
V3 architecture renamed foundation modules. Old names don't exist.

**THE FIX:**
```python
# __manifest__.py
'depends': [
    'base',
    'ai_brain',   # ✅ V3 name (correct)
    'ai_sam',     # ✅ V3 name (correct)
]
```

**V2 → V3 Mapping:**
- `ai_base` → `ai_brain`
- `ai_trunk` → `ai_sam`
- `ai_automator_base` → `the_ai_automator`

**PREVENTION CHECKLIST:**
- [ ] Search dependencies for deprecated names
- [ ] Run: `grep -E "'ai_base'|'ai_trunk'" __manifest__.py`
- [ ] Always use V3 names (ai_brain, ai_sam)

**Severity:** CRITICAL (blocks installation)
**QA Tool Detection:** Lines 435-442 in ai_sam_development_qa.py

---

### 7. Menu/Action Dependency Ordering

**THE MISTAKE:**
```python
# __manifest__.py
'data': [
    'views/menus.xml',      # ❌ Loads first (references actions that don't exist yet!)
    'views/actions.xml',    # ❌ Loads second (too late!)
]
```

**WHY IT BREAKS:**
Odoo loads files sequentially. Menus reference actions, so actions MUST load first.

**THE FIX:**
```python
# __manifest__.py (CORRECT ORDER!)
'data': [
    'security/ir.model.access.csv',  # 1. Security (always first)
    'views/actions.xml',              # 2. Actions (before menus)
    'views/menus.xml',                # 3. Menus (reference actions)
    'views/model_views.xml',          # 4. Views (last)
]
```

**LOAD ORDER RULES:**
1. Security (`security/`)
2. Data (`data/`)
3. Actions (`views/*_actions.xml`)
4. Menus (`views/*_menus.xml`)
5. Views (`views/*_views.xml`)
6. Reports/Templates

**PREVENTION CHECKLIST:**
- [ ] Check __manifest__.py `data` array order
- [ ] Security always first
- [ ] Actions before menus
- [ ] Views last

**Severity:** HIGH (installation fails)
**QA Tool Detection:** Lines 519-625 in ai_sam_development_qa.py

---

### 8. Missing Python Imports

**THE MISTAKE:**
```python
# models/ai_conversation.py
from odoo import fields, api  # ❌ Missing 'models'

class AiConversation(models.Model):  # NameError: models not defined!
    _name = 'ai.conversation'
```

**WHY IT BREAKS:**
Odoo models must inherit from `models.Model`, but `models` not imported.

**THE FIX:**
```python
# models/ai_conversation.py
from odoo import models, fields, api  # ✅ Include 'models'

class AiConversation(models.Model):  # ✅ Works now
    _name = 'ai.conversation'
    _description = 'AI Conversation'
```

**COMMON IMPORTS NEEDED:**
```python
# Most model files need:
from odoo import models, fields, api

# If using exceptions:
from odoo.exceptions import UserError, ValidationError

# If using _():
from odoo import _

# If using http:
from odoo import http
```

**PREVENTION CHECKLIST:**
- [ ] Every model file imports `models`
- [ ] Every controller imports `http`
- [ ] Import exceptions when raising errors
- [ ] Don't import unused modules (QA tool warns)

**Severity:** HIGH (runtime error)
**QA Tool Detection:** Lines 287-290 in ai_sam_development_qa.py

---

### 9. Duplicate XML IDs

**THE MISTAKE:**
```xml
<record id="action_memory_view" model="ir.actions.act_window">
    <field name="name">Memory View</field>
</record>

<record id="action_memory_view" model="ir.actions.client">
    <!-- ❌ DUPLICATE ID! ParseError on install -->
</record>
```

**WHY IT BREAKS:**
XML IDs must be unique across all files loaded by the module.

**THE FIX:**
```xml
<record id="action_memory_view_window" model="ir.actions.act_window">
    <field name="name">Memory View</field>
</record>

<record id="action_memory_view_client" model="ir.actions.client">
    <!-- ✅ Unique IDs -->
</record>
```

**PREVENTION CHECKLIST:**
- [ ] Use descriptive IDs (not generic like `action_view`)
- [ ] Include model/purpose in ID name
- [ ] Search before creating: `grep -r 'id="action_memory"' views/`
- [ ] Run: `grep -oP 'id="\\K[^"]+' views/*.xml | sort | uniq -d` (finds duplicates)

**Severity:** CRITICAL (blocks installation)
**QA Tool Detection:** Lines 192-195 in ai_sam_development_qa.py

---

### 10. Hook Not Exported

**THE MISTAKE:**
```python
# __manifest__.py
{
    'post_init_hook': 'initialize_memory_graph',
}

# __init__.py
from . import models
from . import controllers
# ❌ Hook function not imported!
```

**WHY IT BREAKS:**
Manifest declares hook but function not accessible at module level.

**THE FIX:**
```python
# __manifest__.py
{
    'post_init_hook': 'initialize_memory_graph',
}

# __init__.py
from . import models
from . import controllers
from .hooks import initialize_memory_graph  # ✅ Hook exported

# hooks.py
def initialize_memory_graph(cr, registry):
    """Initialize memory graph on module install."""
    # Hook implementation
    pass
```

**PREVENTION CHECKLIST:**
- [ ] If manifest declares hook, import it in __init__.py
- [ ] Create dedicated hooks.py file for hook functions
- [ ] Test hook by uninstalling/reinstalling module
- [ ] Hook signature: `def hook_name(cr, registry):`

**Severity:** HIGH (installation fails)
**QA Tool Detection:** Lines 457-517 in ai_sam_development_qa.py

---

## ODOO 18 SPECIFIC BEST PRACTICES

### 1. Always Use `_description` Field
```python
# ❌ WARNING (Odoo logs warning)
class AiConversation(models.Model):
    _name = 'ai.conversation'
    # Missing _description

# ✅ CORRECT
class AiConversation(models.Model):
    _name = 'ai.conversation'
    _description = 'AI Conversation History'
```

---

### 2. Limit console.log in Production
```javascript
// ❌ BAD (debug logs in production)
function renderGraph(data) {
    console.log('Rendering graph', data);
    console.log('Nodes:', data.nodes);
    console.log('Edges:', data.edges);
}

// ✅ GOOD (conditional logging)
function renderGraph(data) {
    if (this.debug_mode) {
        console.warn('Rendering', data.nodes.length, 'nodes');
    }
}
```

**Rule:** Max 3 console.log statements per JS file.

---

### 3. Add Type Hints (Python)
```python
# ❌ NO TYPE HINTS
def get_conversations(self, limit):
    return self.search([], limit=limit)

# ✅ TYPE HINTS ADDED
from typing import List, Dict, Any

def get_conversations(self, limit: int) -> List[Dict[str, Any]]:
    return self.search([], limit=limit)
```

**QA Tool:** Warns if >50% functions lack type hints.

---

## PRE-COMMIT CHECKLIST (Run EVERY Time!)

Before handing off to QA Guardian or git-push:

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
- [ ] Type hints on functions

### Manifest
- [ ] Version starts with `18.0.`
- [ ] Dependencies use V3 names (ai_brain, ai_sam)
- [ ] Data files in correct load order
- [ ] Hooks imported in __init__.py

### QA Tool
- [ ] Run: `python ai_sam_development_qa.py --report`
- [ ] Score: 8+ out of 10
- [ ] Zero CRITICAL errors
- [ ] Address HIGH errors before commit

---

## ERROR SEVERITY GUIDE

**CRITICAL** = Blocks install/upgrade (MUST FIX)
- ir.actions conflicts
- Deprecated dependencies
- Sibling imports
- Odoo 18 incompatibilities

**HIGH** = Breaks functionality (SHOULD FIX)
- Missing security rules
- Import errors
- Hook issues
- Menu/action ordering

**MEDIUM** = Code quality (GOOD TO FIX)
- Missing _description
- Wrong version format
- Duplicate IDs

**LOW** = Style/optimization (NICE TO FIX)
- console.log excess
- Missing type hints
- Unused imports

---

## WHEN TO ASK FOR HELP

Ask user BEFORE coding if:
- [ ] Changing ir.actions model type (suggest delete approach)
- [ ] Need to share code between branches (propose ai_brain)
- [ ] Unsure about file load order
- [ ] Module structure unclear

Ask Debug Agent if:
- [ ] Error not in this guide
- [ ] QA tool reports unknown issue
- [ ] Need to search bug history

---

## INTEGRATION WITH QA GUARDIAN

After you finish coding:
1. **Self-review** using this file
2. **Run QA tool** manually (quick check)
3. **Hand off to QA Guardian** (comprehensive review)
4. **Fix issues** if QA Guardian finds any
5. **Repeat** until QA Guardian approves
6. **git-push** only after approval

**Remember:** QA Guardian is your friend, not your enemy. It catches issues BEFORE they hit production.

---

## SUCCESS METRICS

You're coding well when:
- ✅ QA Guardian approves first try (no issues)
- ✅ Debug agent rarely invoked (no new bugs)
- ✅ Zero CRITICAL errors in QA tool
- ✅ Module installs/upgrades without errors
- ✅ No architecture violations

You need to review this file when:
- ❌ QA Guardian finds 3+ issues
- ❌ Debug agent fixing same bug type repeatedly
- ❌ QA tool score below 7/10
- ❌ Installation fails
- ❌ User says "we keep making this mistake"

---

**Remember:** These patterns were learned through pain. Save yourself (and Debug agent) the trouble by preventing them from the start!

**The goal:** Move from **reactive debugging** to **proactive quality**.
