# Functionality Inventory Guide

**Purpose**: Catalog EVERY user-facing feature in ai_sam_workflows
**Why Critical**: Can't test what you don't know exists - complete inventory prevents missed breakpoints
**Method**: Top-down from user experience (what users see and do)

---

## 🎯 Inventory Goals

### Primary Goal
**100% feature coverage** - Leave NO functionality undocumented

### Secondary Goals
1. **Prioritize by business criticality** (CRITICAL, HIGH, MEDIUM, LOW)
2. **Group by functional area** (node management, canvas operations, workflow execution, etc.)
3. **Document expected behavior** (what should happen when working)
4. **Identify user entry points** (menus, buttons, shortcuts, forms)

---

## 📂 Where to Find Features

### Source 1: UI Menus (`views/*.xml`)
**Location**: `C:\Working With AI\ai_sam\ai_sam\ai_sam_workflows\views\`

**Look for**:
```xml
<menuitem id="menu_item_id"
          name="Menu Name"
          action="action_id"/>
```

**Extract**:
- Menu hierarchy (parent → child)
- Menu labels (user-visible names)
- Actions (what happens when clicked)

**Example**:
```xml
<menuitem id="menu_workflows" name="Workflows" sequence="10"/>
<menuitem id="menu_canvas" name="Canvas Designer" parent="menu_workflows" action="action_canvas_view"/>
<menuitem id="menu_nodes" name="Node Library" parent="menu_workflows" action="action_node_library"/>
```

**Inventory Entry**:
```markdown
### Menu: Workflows > Canvas Designer
- **Action**: Opens canvas view
- **Priority**: CRITICAL (core feature)
- **User Entry Point**: Main menu
```

---

### Source 2: Buttons & Actions (`views/*.xml`)
**Location**: Same as Source 1

**Look for**:
```xml
<button name="button_action_name"
        string="Button Label"
        type="object"/>
```

**Extract**:
- Button labels
- Action methods (Python function called)
- Context (where button appears: form, tree, wizard)

**Example**:
```xml
<button name="action_add_node"
        string="+Node"
        type="object"
        class="btn-primary"/>
```

**Inventory Entry**:
```markdown
### Button: +Node (Add Node)
- **Location**: Canvas toolbar
- **Action**: `action_add_node()` method
- **Priority**: CRITICAL (core workflow)
- **Expected Behavior**: Opens node selection overlay
```

---

### Source 3: JavaScript Interactions (`static/src/js/*.js`)
**Location**: `C:\Working With AI\ai_sam\ai_sam\ai_sam_workflows\static\src\js\` AND `C:\Working With AI\ai_sam\ai_sam\ai_sam\static\src\js\`

**Look for**:
- Event listeners (click, drag, drop, keypress)
- Function calls (user-triggered actions)
- UI updates (canvas rendering, overlays)

**Example**:
```javascript
// Canvas node drag-and-drop
canvas.on('node:drag', function(node) {
    updateNodePosition(node.id, node.x, node.y);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 's') {
        saveWorkflow();
    }
});
```

**Inventory Entry**:
```markdown
### Interaction: Drag Node
- **Trigger**: Mouse drag on canvas node
- **Action**: `updateNodePosition()`
- **Priority**: HIGH (frequent use)
- **Expected Behavior**: Node moves with mouse, position saves on drop

### Keyboard Shortcut: Ctrl+S
- **Trigger**: Ctrl+S key combination
- **Action**: `saveWorkflow()`
- **Priority**: HIGH (saves work)
- **Expected Behavior**: Workflow persists to database, confirmation message
```

---

### Source 4: Context Menus (Right-Click)
**Location**: JavaScript files (event listeners)

**Look for**:
```javascript
node.on('contextmenu', function(e) {
    showContextMenu(node, e.clientX, e.clientY);
});
```

**Extract**:
- Context menu items
- Actions per item
- Conditions (when item appears)

**Example**:
```javascript
function showContextMenu(node) {
    return [
        {label: 'Edit Node', action: () => editNode(node)},
        {label: 'Delete Node', action: () => deleteNode(node)},
        {label: 'Duplicate Node', action: () => duplicateNode(node)}
    ];
}
```

**Inventory Entry**:
```markdown
### Context Menu: Node Right-Click
- **Trigger**: Right-click on canvas node
- **Actions**:
  - Edit Node → `editNode()` [HIGH priority]
  - Delete Node → `deleteNode()` [HIGH priority]
  - Duplicate Node → `duplicateNode()` [MEDIUM priority]
- **Expected Behavior**: Menu appears at cursor, action executes on click
```

---

### Source 5: Wizards & Forms (`wizards/*.py`, `views/*_wizard.xml`)
**Location**: `C:\Working With AI\ai_sam\ai_sam\ai_sam_workflows\wizards\`

**Look for**:
- Multi-step processes (wizards)
- Form submissions (create, edit)
- Validation logic

**Example**:
```python
class WorkflowImportWizard(models.TransientModel):
    _name = 'workflow.import.wizard'

    def action_import(self):
        # Import workflow from JSON
        pass
```

**Inventory Entry**:
```markdown
### Wizard: Import Workflow
- **Trigger**: Menu > Workflows > Import
- **Steps**:
  1. Upload JSON file
  2. Validate structure
  3. Map to existing node types
  4. Confirm import
- **Priority**: MEDIUM (admin feature)
- **Expected Behavior**: Workflow imported to canvas, nodes created
```

---

### Source 6: Automated Actions (Scheduled Tasks, Triggers)
**Location**: `models/*.py` (computed fields, onchange methods)

**Look for**:
```python
@api.onchange('field_name')
def _onchange_field_name(self):
    # Triggered when field changes
    pass

@api.depends('field1', 'field2')
def _compute_field3(self):
    # Computed automatically
    pass
```

**Extract**:
- Trigger conditions
- Automated behaviors
- Side effects

**Example**:
```python
@api.onchange('node_type')
def _onchange_node_type(self):
    """When node type changes, load default configuration"""
    if self.node_type:
        self.config_json = self._get_default_config(self.node_type)
```

**Inventory Entry**:
```markdown
### Automated: Node Type Configuration
- **Trigger**: User selects node type in overlay
- **Action**: `_onchange_node_type()` loads default config
- **Priority**: HIGH (affects node creation)
- **Expected Behavior**: Config JSON populated with defaults for selected type
```

---

## 🎯 Feature Prioritization Matrix

### CRITICAL Priority
**Criteria**: Core workflow functionality, used in 80%+ of sessions, system unusable if broken

**Examples**:
- Add Node (+Node button)
- Save Workflow (Ctrl+S, Save button)
- Execute Workflow (Run button)
- Canvas rendering (view workflows)

**Test First**: These MUST work for system to be functional

---

### HIGH Priority
**Criteria**: Frequently used, significant impact if broken, but workarounds exist

**Examples**:
- Edit Node (context menu)
- Delete Node (context menu, Delete key)
- Drag & Drop nodes (reposition)
- Connect nodes (create flow)
- Node configuration (settings overlay)

**Test Second**: Important for usability, but system partially functional without

---

### MEDIUM Priority
**Criteria**: Occasionally used, moderate impact if broken, alternative methods available

**Examples**:
- Duplicate Node (context menu)
- Workflow templates (create from template)
- Import Workflow (wizard)
- Export Workflow (download JSON)
- Node search/filter (find in library)

**Test Third**: Nice to have, limited impact if temporarily broken

---

### LOW Priority
**Criteria**: Rarely used, minimal impact if broken, admin/config features

**Examples**:
- Workflow tags (categorize)
- Workflow sharing (permissions)
- Execution history (logs)
- Node library management (add custom nodes)
- System settings (preferences)

**Test Last**: Can defer if time-constrained

---

## 📋 Inventory Template

Use this template for each feature:

```markdown
### [Feature Name]

**Priority**: [CRITICAL / HIGH / MEDIUM / LOW]

**User Entry Point**:
- Menu: [Path to menu item]
- Button: [Button label + location]
- Shortcut: [Keyboard combination]
- Context Menu: [Right-click where]
- Other: [Describe]

**Trigger Action**:
- Method: `function_name()` or `model.method_name()`
- File: `path/to/file.py` or `path/to/file.js`
- Layer: [Layer 1 (UI) / Layer 2 (MVP Server) / Layer 3 (Data)]

**Expected Behavior** (when working):
1. [Step 1: User does X]
2. [Step 2: System responds Y]
3. [Step 3: Result Z]

**Expected Failure** (if broken):
- [Error message, blank screen, 404, etc.]
- [User impact: can't proceed, data loss, etc.]

**Related Features**:
- [Feature that depends on this]
- [Feature that this depends on]

**Notes**:
- [Any special considerations]
- [Known issues in old architecture]
```

---

## 🔍 Inventory Process (Step-by-Step)

### Step 1: Scan All UI Entry Points
**Time**: 30-60 minutes

**Actions**:
1. Read all `views/*.xml` files
2. List all menus
3. List all buttons
4. List all form actions
5. List all wizards

**Output**: Raw list of UI elements

---

### Step 2: Scan All JavaScript Interactions
**Time**: 30-60 minutes

**Actions**:
1. Read all `static/src/js/*.js` files (ai_sam_workflows)
2. Read shared JS files (ai_sam)
3. List all event listeners
4. List all keyboard shortcuts
5. List all AJAX/fetch calls

**Output**: Raw list of user interactions

---

### Step 3: Group by Functional Area
**Time**: 15-30 minutes

**Functional Areas**:
- **Node Management**: Add, edit, delete, duplicate, configure nodes
- **Canvas Operations**: Drag, drop, zoom, pan, connect nodes
- **Workflow Management**: Create, save, load, delete workflows
- **Workflow Execution**: Run, pause, stop, view results
- **Node Library**: Browse, search, filter node types
- **Import/Export**: Upload, download workflows (JSON)
- **Execution History**: View logs, results, errors
- **Administration**: Settings, permissions, custom nodes

**Output**: Organized feature groups

---

### Step 4: Assign Priority Levels
**Time**: 15-30 minutes

**Process**:
- For each feature, ask: "Can system function without this?"
- If NO → CRITICAL
- If "Partially, with pain" → HIGH
- If "Yes, but annoying" → MEDIUM
- If "Yes, easily" → LOW

**Output**: Prioritized feature list

---

### Step 5: Document Expected Behavior
**Time**: 1-2 hours (most time-intensive)

**Process**:
- For each CRITICAL feature: Write detailed expected behavior
- For each HIGH feature: Write moderate expected behavior
- For MEDIUM/LOW: Write brief expected behavior

**Output**: Complete inventory with behavioral documentation

---

## ✅ Inventory Completeness Checklist

Before declaring inventory complete:

**UI Coverage**:
- [ ] All menus documented
- [ ] All buttons documented
- [ ] All forms documented
- [ ] All wizards documented

**Interaction Coverage**:
- [ ] All JavaScript events documented
- [ ] All keyboard shortcuts documented
- [ ] All context menus documented
- [ ] All drag-and-drop interactions documented

**Functional Coverage**:
- [ ] Node management features (100%)
- [ ] Canvas operations (100%)
- [ ] Workflow management (100%)
- [ ] Workflow execution (100%)
- [ ] Node library (100%)
- [ ] Import/export (100%)
- [ ] Execution history (100%)
- [ ] Administration (100%)

**Priority Distribution** (healthy mix):
- [ ] CRITICAL: 5-10 features (core must-haves)
- [ ] HIGH: 10-20 features (frequent use)
- [ ] MEDIUM: 15-30 features (occasional use)
- [ ] LOW: 10-20 features (rare use)

**Documentation Quality**:
- [ ] Every feature has priority assigned
- [ ] Every feature has user entry point documented
- [ ] Every feature has expected behavior described
- [ ] Every feature has expected failure noted

---

## 📊 Example: Partial Inventory (Add Node Feature)

```markdown
### Add Node (+Node Button)

**Priority**: CRITICAL

**User Entry Point**:
- Button: "+Node" in canvas toolbar (top-left)
- Keyboard Shortcut: Ctrl+N
- Context Menu: Right-click on canvas → "Add Node"

**Trigger Action**:
- Method: `addNode()` JavaScript function
- File: `ai_sam/static/src/js/node_overlay.js`
- Layer: Layer 1 (UI) → calls Layer 2 (API)

**Expected Behavior** (when working):
1. User clicks +Node button
2. Node selection overlay appears (modal dialog)
3. Overlay displays N8N node library (1,500+ nodes)
4. User searches/filters nodes by category
5. User clicks node type to add
6. Overlay closes
7. Node appears on canvas at default position
8. Node is selected (highlighted)

**Expected Failure** (if broken):
- Clicking +Node does nothing (JavaScript error)
- Overlay appears but shows "Loading..." forever (API 404)
- Overlay appears but node library empty (data fetch failed)
- Overlay closes but node doesn't appear on canvas (creation failed)
- Error message: "Cannot load node library" (Execution Engine missing)

**Related Features**:
- Node Library (loads available node types)
- Canvas Rendering (displays newly added node)
- Node Configuration (edit node after adding)

**Notes**:
- OLD architecture: Direct model access (`this.model.create()`)
- NEW architecture: API call (`POST /api/node/create`)
- BREAKPOINT RISK: UI might still use old direct access method
```

---

## 🎯 Deliverable Format

**Inventory Output** (Markdown for now, HTML later):

```markdown
# AI Sam Workflows - Complete Feature Inventory

**Status**: Post-93% Reduction (Reinstall Phase)
**Last Updated**: [Date]
**Coverage**: [X CRITICAL, Y HIGH, Z MEDIUM, W LOW features]

---

## CRITICAL Features (Must Work Immediately)

### 1. Add Node
[Full documentation as template above]

### 2. Save Workflow
[Full documentation]

[... continue for all CRITICAL features]

---

## HIGH Priority Features

[... continue for all HIGH features]

---

## MEDIUM Priority Features

[... continue for all MEDIUM features]

---

## LOW Priority Features

[... continue for all LOW features]

---

## Summary Statistics

- **Total Features**: [N]
- **CRITICAL**: [X] (must work for system functionality)
- **HIGH**: [Y] (important for usability)
- **MEDIUM**: [Z] (nice to have)
- **LOW**: [W] (can defer)

**Testing Estimate**:
- CRITICAL: [X * 10 min] = [N hours]
- HIGH: [Y * 5 min] = [N hours]
- Total testing time: [N hours]
```

---

**Start with CRITICAL features. If time-constrained, CRITICAL + HIGH = Minimum Viable Inventory.** 🎯
