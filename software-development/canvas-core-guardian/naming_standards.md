# Naming Standards

## Purpose

Consistent naming prevents confusion and makes the codebase scannable.

This document defines the EXACT naming patterns for files, classes, routes, and CSS in the SAM AI V3 architecture.

---

## Core Principle

**"Skeleton" is LEGACY. "Canvas" or "Canvas Core" is MODERN.**

Every "skeleton" reference should be renamed to "canvas" or "canvas_core".

---

## File Naming

### JavaScript Files

#### ✅ Canvas Core Files
```
ai_sam/static/src/canvas_core/
├── canvas_engine.js          (NOT skeleton_canvas_engine.js)
├── node_manager.js            (NOT skeleton_node_manager.js)
├── canvas_sizer.js            (OK - no "skeleton")
├── platform_loader.js         (OK - no "skeleton")
└── sidebar.js                 (Generic sidebar base)
```

#### ✅ Platform-Specific Files
```
the_ai_automator/static/src/
├── platforms/
│   └── workflow_renderer.js   (Platform renderer)
├── workflow/
│   ├── workflow_executor.js   (Business logic)
│   └── workflow_utils.js
└── n8n/
    └── n8n_integration.js     (OK - "n8n" allowed in platform folder)

ai_sam_memory/static/src/
├── platforms/
│   └── memory_graph_renderer.js
└── memory/
    ├── knowledge_graph.js      (OK - "knowledge" allowed in platform folder)
    └── graph_utils.js
```

#### ❌ Legacy Naming (Fix These)
```
skeleton_canvas_engine.js      → canvas_engine.js
skeleton_node_manager.js       → node_manager.js
skeleton_base.js               → canvas_base.js
poppy_skeleton.js              → poppy_canvas.js (if in platform)
```

### Python Files

#### ✅ Controllers
```
ai_sam/controllers/
├── __init__.py
├── canvas_controller.py       (NOT skeleton_canvas_controller.py)
├── platform_controller.py
└── sam_ai_chat_controller.py  (OK - specific feature)

the_ai_automator/controllers/
├── __init__.py
└── workflow_controller.py
```

#### ✅ Models
```
ai_brain/models/
├── __init__.py
├── canvas_node.py             (Generic node)
├── canvas_connection.py       (Generic connection)
├── canvas_platform.py         (Platform registry)
└── conversation.py            (Domain model)

the_ai_automator/models/
├── __init__.py
├── workflow_definition.py
└── workflow_node.py           (Inherits canvas_node)
```

#### ❌ Legacy Naming (Fix These)
```
skeleton_canvas_controller.py  → canvas_controller.py
skeleton_model.py              → canvas_model.py
```

### XML Files

#### ✅ Views
```
ai_sam/views/
├── canvas_container.xml       (NOT skeleton_canvas_container.xml)
├── canvas_views.xml
└── platform_views.xml

the_ai_automator/views/
├── workflow_views.xml
└── workflow_menus.xml
```

#### ❌ Legacy Naming (Fix These)
```
skeleton_canvas_container.xml  → canvas_container.xml
skeleton_views.xml             → canvas_views.xml
```

### CSS Files

#### ✅ Stylesheets
```
ai_sam/static/src/css/
├── canvas_base.css            (NOT skeleton_base.css)
├── canvas_layout.css
└── platform_loader.css

the_ai_automator/static/src/css/
├── workflow_styles.css
└── workflow_nodes.css
```

#### ❌ Legacy Naming (Fix These)
```
skeleton_base.css              → canvas_base.css
skeleton_layout.css            → canvas_layout.css
poppy_skeleton.css             → poppy_canvas.css
```

---

## Class Naming

### JavaScript Classes

#### ✅ Canvas Core Classes
```javascript
// Generic, platform-agnostic
class CanvasEngine { }         // NOT SkeletonCanvasEngine
class NodeManager { }          // NOT SkeletonNodeManager
class CanvasSizer { }          // OK - no "skeleton"
class PlatformLoader { }       // OK - no "skeleton"
class Sidebar { }              // Generic base
```

#### ✅ Platform Classes
```javascript
// Platform-specific (allowed to have platform names)
class WorkflowRenderer { }
class WorkflowExecutor { }
class MemoryGraphRenderer { }
class KnowledgeGraph { }
class PoppySidebar extends Sidebar { }
```

#### ❌ Legacy Naming (Fix These)
```javascript
class SkeletonCanvasEngine { } → class CanvasEngine { }
class SkeletonNodeManager { }  → class NodeManager { }
class SkeletonCanvas { }       → class Canvas { }
```

### Python Classes

#### ✅ Controllers
```python
# Generic canvas controller
class CanvasController(http.Controller):  # NOT SkeletonCanvasController
    pass

# Platform-specific controllers
class WorkflowController(http.Controller):
    pass

class MemoryGraphController(http.Controller):
    pass
```

#### ✅ Models
```python
# Generic models (ai_brain)
class CanvasNode(models.Model):
    _name = 'canvas.node'

class CanvasConnection(models.Model):
    _name = 'canvas.connection'

# Platform models (inherit or reference generic)
class WorkflowNode(models.Model):
    _name = 'workflow.node'
    _inherits = {'canvas.node': 'canvas_node_id'}
```

#### ❌ Legacy Naming (Fix These)
```python
class SkeletonCanvasController  → class CanvasController
class SkeletonCanvas            → class Canvas
```

---

## Route Naming

### HTTP Routes

#### ✅ Canvas Core Routes
```python
# Generic canvas routes
@http.route('/canvas/render', auth='user')           # NOT /skeleton/render
@http.route('/canvas/nodes', auth='user')
@http.route('/api/canvas/create_node', type='json')
```

#### ✅ Platform Routes
```python
# Platform-specific routes (allowed to have platform names)
@http.route('/workflow/execute', auth='user')
@http.route('/api/workflow/nodes', type='json')
@http.route('/memory/graph', auth='user')
@http.route('/api/memory/query', type='json')
```

#### ❌ Legacy Naming (Fix These)
```python
@http.route('/skeleton/render')      → @http.route('/canvas/render')
@http.route('/skeleton/nodes')       → @http.route('/canvas/nodes')
@http.route('/api/skeleton/create')  → @http.route('/api/canvas/create')
```

---

## CSS Class Naming

### CSS Selectors

#### ✅ Canvas Core CSS
```css
/* Generic canvas classes (no platform names) */
.canvas-container { }           /* NOT .skeleton-container */
.canvas-node { }                /* NOT .skeleton-node */
.canvas-connection { }          /* NOT .skeleton-connection */
.canvas-toolbar { }
.canvas-sidebar { }
```

#### ✅ Platform CSS
```css
/* Platform-specific classes (allowed to have platform names) */
.workflow-node { }
.workflow-canvas { }
.memory-node { }
.knowledge-graph { }
.poppy-sidebar { }
```

#### ❌ Legacy Naming (Fix These)
```css
.skeleton-container    → .canvas-container
.skeleton-node         → .canvas-node
.skeleton-connection   → .canvas-connection
.skeleton-canvas       → .canvas
```

---

## XML Record IDs

### View IDs

#### ✅ Canvas Core Views
```xml
<!-- Generic canvas views -->
<record id="canvas_view_form" model="ir.ui.view">
    <!-- NOT skeleton_view_form -->
</record>

<record id="canvas_container_template" model="ir.ui.view">
    <!-- NOT skeleton_canvas_container -->
</record>
```

#### ✅ Platform Views
```xml
<!-- Platform-specific views -->
<record id="workflow_view_form" model="ir.ui.view">
</record>

<record id="memory_graph_view" model="ir.ui.view">
</record>
```

#### ❌ Legacy Naming (Fix These)
```xml
skeleton_view_form           → canvas_view_form
skeleton_canvas_container    → canvas_container_template
skeleton_action              → canvas_action
```

### Action IDs

#### ✅ Canvas Core Actions
```xml
<record id="canvas_action_open" model="ir.actions.client">
    <!-- NOT skeleton_action_open -->
</record>
```

#### ✅ Platform Actions
```xml
<record id="workflow_action_open" model="ir.actions.client">
</record>

<record id="memory_graph_action" model="ir.actions.client">
</record>
```

---

## Model Names (Odoo _name)

### ✅ Canvas Core Models
```python
class CanvasNode(models.Model):
    _name = 'canvas.node'           # NOT 'skeleton.node'

class CanvasConnection(models.Model):
    _name = 'canvas.connection'     # NOT 'skeleton.connection'

class CanvasPlatform(models.Model):
    _name = 'canvas.platform'       # NOT 'skeleton.platform'
```

### ✅ Platform Models
```python
class WorkflowDefinition(models.Model):
    _name = 'workflow.definition'

class WorkflowNode(models.Model):
    _name = 'workflow.node'

class KnowledgeNode(models.Model):
    _name = 'knowledge.node'
```

### ❌ Legacy Naming (Fix These)
```python
_name = 'skeleton.node'        → _name = 'canvas.node'
_name = 'skeleton.connection'  → _name = 'canvas.connection'
_name = 'skeleton.canvas'      → _name = 'canvas'
```

---

## Directory Structure

### ✅ Correct Structure

```
ai_sam/
├── controllers/
│   ├── canvas_controller.py       (NOT skeleton_canvas_controller.py)
│   └── platform_controller.py
├── models/
│   └── (none - models in ai_brain)
├── static/src/
│   ├── canvas_core/               (NEW - preferred location)
│   │   ├── canvas_engine.js
│   │   ├── node_manager.js
│   │   ├── canvas_sizer.js
│   │   └── platform_loader.js
│   ├── core/                      (LEGACY - migrate out)
│   │   └── (old skeleton_* files - TO BE REMOVED)
│   ├── css/
│   │   ├── canvas_base.css        (NOT skeleton_base.css)
│   │   └── canvas_layout.css
│   └── js/
│       └── (platform-agnostic utilities)
└── views/
    ├── canvas_container.xml       (NOT skeleton_canvas_container.xml)
    └── canvas_views.xml

the_ai_automator/
├── static/src/
│   ├── platforms/
│   │   └── workflow_renderer.js   (Registers with canvas)
│   ├── workflow/
│   │   └── workflow_executor.js
│   └── n8n/
│       └── n8n_integration.js
```

---

## Variable Naming

### JavaScript Variables

#### ✅ Canvas Core Variables
```javascript
// Generic variable names
const canvasEngine = new CanvasEngine();      // NOT skeletonEngine
const nodeManager = new NodeManager();        // NOT skeletonNodeManager
const canvasContext = canvas.getContext();    // NOT skeletonContext
```

#### ✅ Platform Variables
```javascript
// Platform-specific variables (OK to have platform names)
const workflowRenderer = new WorkflowRenderer();
const memoryGraph = new MemoryGraph();
```

#### ❌ Legacy Naming (Fix These)
```javascript
const skeletonEngine       → const canvasEngine
const skeletonContext      → const canvasContext
const skeletonCanvas       → const canvas
```

### Python Variables

#### ✅ Canvas Core Variables
```python
# Generic variable names
canvas_node = self.env['canvas.node'].browse(node_id)
canvas_controller = CanvasController()
```

#### ❌ Legacy Naming (Fix These)
```python
skeleton_node    → canvas_node
skeleton_canvas  → canvas
```

---

## Method Naming

### JavaScript Methods

#### ✅ Canvas Core Methods
```javascript
class CanvasEngine {
    initializeCanvas() { }      // NOT initializeSkeleton()
    renderCanvas() { }          // NOT renderSkeleton()
    getCanvasContext() { }      // NOT getSkeletonContext()
}
```

#### ❌ Legacy Naming (Fix These)
```javascript
initializeSkeleton()   → initializeCanvas()
renderSkeleton()       → renderCanvas()
getSkeletonContext()   → getCanvasContext()
```

### Python Methods

#### ✅ Canvas Core Methods
```python
class CanvasController:
    def render_canvas(self):         # NOT render_skeleton()
        pass

    def get_canvas_data(self):       # NOT get_skeleton_data()
        pass
```

#### ❌ Legacy Naming (Fix These)
```python
render_skeleton()      → render_canvas()
get_skeleton_data()    → get_canvas_data()
```

---

## Comment & Documentation Naming

### ✅ Use Modern Terms
```javascript
/**
 * Canvas Engine - Core rendering system
 * Provides platform-agnostic canvas functionality
 */
// Initialize the canvas context
// Render canvas nodes
```

### ❌ Avoid Legacy Terms
```javascript
/**
 * Skeleton Engine - ...       ❌ Use "Canvas Engine"
 */
// Initialize the skeleton      ❌ Use "canvas"
// Render skeleton nodes        ❌ Use "canvas nodes"
```

---

## Search & Replace Patterns

### Quick Renaming Commands

```bash
# Files
find ai_sam/ -name "*skeleton*" -type f

# Content (use with caution - review changes!)
grep -rl "skeleton" ai_sam/ | xargs sed -i 's/skeleton/canvas/g'

# Case-sensitive replacements
sed -i 's/Skeleton/Canvas/g' file.js
sed -i 's/skeleton_/canvas_/g' file.py
sed -i 's/\.skeleton-/\.canvas-/g' file.css
```

### Manual Review Required

These patterns need human review (not automated):

1. **Comments mentioning "skeleton"** - May be historical documentation (OK to keep)
2. **External API references** - Don't rename if external system uses "skeleton"
3. **Database table names** - Requires migration, not simple rename
4. **Git history** - Old commits will have "skeleton" (OK to leave)

---

## Naming Checklist

Before marking cleanup complete, verify:

### Files
- [ ] No files named `skeleton_*`
- [ ] Canvas core files use `canvas_*` pattern
- [ ] Platform files use platform-specific names

### Classes
- [ ] No classes named `Skeleton*`
- [ ] Canvas core classes use `Canvas*` or generic names
- [ ] Platform classes can use platform names

### Routes
- [ ] No routes starting with `/skeleton/`
- [ ] Canvas routes use `/canvas/` pattern
- [ ] Platform routes use platform-specific paths

### CSS
- [ ] No CSS classes starting with `.skeleton-`
- [ ] Canvas classes use `.canvas-` pattern
- [ ] Platform classes use platform-specific names

### Variables & Methods
- [ ] No variables/methods with "skeleton" in name
- [ ] Use "canvas" or generic terms in core
- [ ] Platform code can use platform-specific terms

### Documentation
- [ ] No "skeleton" references in user-facing docs
- [ ] Code comments use modern terminology
- [ ] Historical references are clearly marked as legacy

---

## Summary

**The Rule:**
> If you see "skeleton" in canvas core code, it's WRONG and needs to be renamed to "canvas" or "canvas_core".

**The Exception:**
> Historical documentation or git history can mention "skeleton" as legacy context.

**The Test:**
> A new developer should be able to scan the codebase and understand the architecture WITHOUT encountering confusing legacy naming.
