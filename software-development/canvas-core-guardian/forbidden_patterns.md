# Forbidden Code Patterns

## Purpose

This document shows you EXACTLY what to look for and fix when enforcing canvas core boundaries.

Each pattern has:
- ❌ BAD example (what's wrong)
- ✅ GOOD example (how to fix it)
- 🔍 How to detect it (grep/search patterns)
- 🛠️ How to fix it (step-by-step)

---

## Pattern 1: Platform Names in Canvas Core

### ❌ BAD - Hardcoded Platform Logic

```javascript
// In ai_sam/static/src/canvas_core/canvas_engine.js
class CanvasEngine {
    renderNode(node) {
        if (node.platform === 'n8n') {
            return this.renderWorkflowNode(node);
        } else if (node.platform === 'memory') {
            return this.renderMemoryNode(node);
        } else if (node.platform === 'poppy') {
            return this.renderPoppyNode(node);
        }
    }

    renderWorkflowNode(node) {
        // N8N-specific rendering
    }
}
```

**Problem:** Canvas core has hardcoded knowledge of specific platforms.

### ✅ GOOD - Platform Renderer Pattern

```javascript
// In ai_sam/static/src/canvas_core/canvas_engine.js
class CanvasEngine {
    renderNode(node) {
        const renderer = this.platformLoader.getRenderer(node.platform);
        return renderer.renderNode(node);
    }
}

// In the_ai_automator/static/src/platforms/workflow_renderer.js
export class WorkflowRenderer {
    renderNode(node) {
        // N8N-specific rendering
    }
}

// Registered via XML:
// <record id="platform_n8n" model="canvas.platform">
//     <field name="name">n8n</field>
//     <field name="renderer_class">WorkflowRenderer</field>
// </record>
```

### 🔍 How to Detect

```bash
# Search for platform names in canvas core
grep -rE "n8n|workflow|memory|knowledge|poppy|automator" ai_sam/static/src/canvas_core/
grep -rE "n8n|workflow|memory|knowledge|poppy|automator" ai_sam/static/src/core/
grep -rE "n8n|workflow|memory|knowledge|poppy|automator" ai_sam/controllers/canvas_controller.py
```

### 🛠️ How to Fix

1. Identify platform-specific logic blocks
2. Extract to platform renderer class
3. Move to platform directory
4. Replace with platform loader call
5. Register platform renderer via XML

---

## Pattern 2: Cross-Platform Imports

### ❌ BAD - Sibling Platform Import

```python
# In ai_sam_memory/models/knowledge_node.py
from the_ai_automator.models.workflow_node import WorkflowNode

class KnowledgeNode(models.Model):
    _name = 'knowledge.node'

    related_workflow = fields.Many2one('workflow.node')  # Cross-platform!
```

**Problem:** Platforms are independent siblings. They should NEVER import each other.

### ✅ GOOD - Shared Through ai_brain

```python
# In ai_brain/models/canvas_node.py (shared foundation)
class CanvasNode(models.Model):
    _name = 'canvas.node'
    _description = 'Generic Canvas Node'

    platform = fields.Selection([
        ('n8n', 'Workflow'),
        ('memory', 'Knowledge Graph'),
    ])
    node_type = fields.Char()

# In ai_sam_memory/models/knowledge_node.py
from odoo import models, fields

class KnowledgeNode(models.Model):
    _name = 'knowledge.node'
    _inherits = {'canvas.node': 'canvas_node_id'}  # Inherit from shared

    canvas_node_id = fields.Many2one('canvas.node', required=True, ondelete='cascade')
    # Knowledge-specific fields
```

### 🔍 How to Detect

```bash
# In memory platform, search for automator imports
grep -r "from the_ai_automator" ai_sam_memory/
grep -r "import.*automator" ai_sam_memory/

# In automator platform, search for memory imports
grep -r "from ai_sam_memory" the_ai_automator/
grep -r "import.*memory" the_ai_automator/

# Check all platforms for cross-imports
grep -r "from ai_sam_" ai_sam_memory/ | grep -v "from ai_sam\.models"
```

### 🛠️ How to Fix

1. Identify the shared data structure
2. Create/move model to ai_brain
3. Have platforms inherit or reference shared model
4. Remove cross-platform imports
5. Update related fields to reference ai_brain model

---

## Pattern 3: Legacy "Skeleton" Naming

### ❌ BAD - Skeleton References

```javascript
// File: ai_sam/static/src/core/skeleton_canvas_engine.js
class SkeletonCanvasEngine {
    initializeSkeleton() {
        this.skeletonContext = this.getSkeletonCanvas();
    }
}

// Import:
import { SkeletonCanvasEngine } from './skeleton_canvas_engine.js';
```

```python
# File: ai_sam/controllers/skeleton_canvas_controller.py
class SkeletonCanvasController(http.Controller):
    @http.route('/skeleton/render', auth='user')
    def render_skeleton(self):
        pass
```

```xml
<!-- File: ai_sam/views/skeleton_canvas_container.xml -->
<record id="skeleton_canvas_view" model="ir.ui.view">
    <field name="name">skeleton.canvas.view</field>
</record>
```

**Problem:** "Skeleton" is legacy naming. Should be "canvas" or "canvas_core".

### ✅ GOOD - Modern Canvas Naming

```javascript
// File: ai_sam/static/src/canvas_core/canvas_engine.js
class CanvasEngine {
    initializeCanvas() {
        this.canvasContext = this.getCanvas();
    }
}

// Import:
import { CanvasEngine } from './canvas_engine.js';
```

```python
# File: ai_sam/controllers/canvas_controller.py
class CanvasController(http.Controller):
    @http.route('/canvas/render', auth='user')
    def render_canvas(self):
        pass
```

```xml
<!-- File: ai_sam/views/canvas_container.xml -->
<record id="canvas_view" model="ir.ui.view">
    <field name="name">canvas.view</field>
</record>
```

### 🔍 How to Detect

```bash
# Find all "skeleton" references
grep -ri "skeleton" ai_sam/

# Find skeleton in file names
find ai_sam/ -iname "*skeleton*"

# Find skeleton in class names
grep -r "class.*Skeleton" ai_sam/

# Find skeleton in routes
grep -r "/skeleton/" ai_sam/

# Find skeleton in CSS
grep -r "\.skeleton-" ai_sam/static/src/css/
```

### 🛠️ How to Fix (Systematic Approach)

#### Step 1: Rename Files
```bash
# Old → New
skeleton_canvas_engine.js       → canvas_engine.js
skeleton_node_manager.js        → node_manager.js
skeleton_canvas_controller.py   → canvas_controller.py
skeleton_base.css               → canvas_base.css
skeleton_canvas_container.xml   → canvas_container.xml
```

#### Step 2: Update Class Names
```javascript
// In each file:
SkeletonCanvasEngine → CanvasEngine
SkeletonNodeManager  → NodeManager
```

#### Step 3: Update Imports
```javascript
// Find all files importing skeleton files:
grep -r "skeleton_canvas_engine" ai_sam/

// Update each:
import { SkeletonCanvasEngine } from './skeleton_canvas_engine.js';
// to:
import { CanvasEngine } from './canvas_engine.js';
```

#### Step 4: Update Routes
```python
@http.route('/skeleton/render', ...) → @http.route('/canvas/render', ...)
```

#### Step 5: Update CSS Classes
```css
.skeleton-container → .canvas-container
.skeleton-node → .canvas-node
```

#### Step 6: Update XML IDs
```xml
skeleton_canvas_view → canvas_view
skeleton_action → canvas_action
```

---

## Pattern 4: Duplicated Sidebar/Toolbar Code

### ❌ BAD - Copy-Pasted Components

```javascript
// In ai_sam/static/src/js/poppy_sidebar.js
class PoppySidebar {
    constructor(container) {
        this.container = container;
        this.isCollapsed = false;
    }

    render() {
        const html = `
            <div class="sidebar">
                <div class="sidebar-header">
                    <button class="collapse-btn">≡</button>
                </div>
                <div class="sidebar-content">
                    <!-- Poppy-specific content -->
                </div>
            </div>
        `;
        this.container.innerHTML = html;
        this.attachEvents();
    }

    attachEvents() {
        this.container.querySelector('.collapse-btn').addEventListener('click', () => {
            this.toggle();
        });
    }

    toggle() {
        this.isCollapsed = !this.isCollapsed;
        // Toggle logic
    }
}

// In ai_sam/static/src/js/memory/memory_sidebar.js
class MemorySidebar {
    constructor(container) {
        this.container = container;
        this.isCollapsed = false;
    }

    render() {
        const html = `
            <div class="sidebar">
                <div class="sidebar-header">
                    <button class="collapse-btn">≡</button>
                </div>
                <div class="sidebar-content">
                    <!-- Memory-specific content (DIFFERENT) -->
                </div>
            </div>
        `;
        this.container.innerHTML = html;
        this.attachEvents();  // SAME CODE!
    }

    attachEvents() {
        this.container.querySelector('.collapse-btn').addEventListener('click', () => {
            this.toggle();
        });
    }

    toggle() {
        this.isCollapsed = !this.isCollapsed;
        // Toggle logic (SAME CODE!)
    }
}
```

**Problem:** 80% of the code is duplicated. Only content differs.

### ✅ GOOD - Shared Base Class

```javascript
// In ai_sam/static/src/canvas_core/sidebar.js (SHARED)
export class Sidebar {
    constructor(container) {
        this.container = container;
        this.isCollapsed = false;
    }

    render() {
        const html = `
            <div class="sidebar">
                <div class="sidebar-header">
                    <button class="collapse-btn">≡</button>
                    ${this.renderHeader()}
                </div>
                <div class="sidebar-content">
                    ${this.renderContent()}
                </div>
            </div>
        `;
        this.container.innerHTML = html;
        this.attachEvents();
    }

    renderHeader() {
        // Override in platform
        return '';
    }

    renderContent() {
        // Override in platform
        return '';
    }

    attachEvents() {
        this.container.querySelector('.collapse-btn').addEventListener('click', () => {
            this.toggle();
        });
    }

    toggle() {
        this.isCollapsed = !this.isCollapsed;
        this.container.classList.toggle('collapsed', this.isCollapsed);
    }
}

// In ai_sam_messenger/static/src/poppy/poppy_sidebar.js (PLATFORM-SPECIFIC)
import { Sidebar } from '../../canvas_core/sidebar.js';

export class PoppySidebar extends Sidebar {
    renderContent() {
        return `
            <div class="poppy-tools">
                <!-- Poppy-specific tools -->
            </div>
        `;
    }
}

// In ai_sam_memory/static/src/memory/memory_sidebar.js (PLATFORM-SPECIFIC)
import { Sidebar } from '../../canvas_core/sidebar.js';

export class MemorySidebar extends Sidebar {
    renderContent() {
        return `
            <div class="memory-tools">
                <!-- Memory-specific tools -->
            </div>
        `;
    }
}
```

### 🔍 How to Detect

```bash
# Find similar class names across platforms
find ai_sam/ -name "*sidebar*.js" -o -name "*toolbar*.js"

# Compare files for similarity
diff ai_sam/static/src/js/poppy_sidebar.js ai_sam/static/src/js/memory/memory_sidebar.js
```

### 🛠️ How to Fix

1. Identify the shared logic (constructor, events, toggle)
2. Create base class in canvas_core
3. Extract platform-specific parts to hooks/methods
4. Have platform sidebars extend base
5. Remove duplicated code

---

## Pattern 5: Business Logic in Canvas Core

### ❌ BAD - Workflow Execution in Core

```javascript
// In ai_sam/static/src/canvas_core/canvas_engine.js
class CanvasEngine {
    async executeWorkflow(nodes) {
        for (const node of nodes) {
            if (node.type === 'trigger') {
                await this.executeTrigger(node);
            } else if (node.type === 'action') {
                await this.executeAction(node);
            }
        }
    }

    async executeTrigger(node) {
        // Workflow execution logic
        const result = await fetch('/api/n8n/execute', {
            method: 'POST',
            body: JSON.stringify(node)
        });
        return result.json();
    }
}
```

**Problem:** Workflow execution is business logic. It belongs in the_ai_automator platform, NOT canvas core.

### ✅ GOOD - Core Only Renders

```javascript
// In ai_sam/static/src/canvas_core/canvas_engine.js
class CanvasEngine {
    renderNodes(nodes) {
        nodes.forEach(node => {
            const renderer = this.platformLoader.getRenderer(node.platform);
            renderer.renderNode(node);
        });
    }

    // NO execution logic!
}

// In the_ai_automator/static/src/workflow/workflow_executor.js
export class WorkflowExecutor {
    async executeWorkflow(nodes) {
        for (const node of nodes) {
            if (node.type === 'trigger') {
                await this.executeTrigger(node);
            } else if (node.type === 'action') {
                await this.executeAction(node);
            }
        }
    }

    async executeTrigger(node) {
        const result = await fetch('/api/workflow/execute', {
            method: 'POST',
            body: JSON.stringify(node)
        });
        return result.json();
    }
}
```

### 🔍 How to Detect

```bash
# Search for business operations in core
grep -r "execute\|query\|save\|delete\|fetch.*api" ai_sam/static/src/canvas_core/

# Search for API calls
grep -r "fetch\|axios\|ajax" ai_sam/static/src/canvas_core/
```

### 🛠️ How to Fix

1. Identify business logic methods
2. Move to appropriate platform
3. Remove from canvas core
4. Canvas core emits events instead
5. Platform listens and handles business logic

---

## Pattern 6: Platform-Specific Styling in Core CSS

### ❌ BAD - Platform Styles in Core

```css
/* In ai_sam/static/src/css/canvas_base.css */

/* Generic canvas styles */
.canvas-container {
    width: 100%;
    height: 100vh;
}

/* ❌ BAD - N8N-specific styling */
.n8n-node {
    background: #4CAF50;
    border-radius: 8px;
}

.workflow-connection {
    stroke: blue;
    stroke-width: 2px;
}

/* ❌ BAD - Memory-specific styling */
.memory-node {
    background: #FF5722;
    border-radius: 50%;
}

.knowledge-connection {
    stroke: red;
    stroke-dasharray: 5,5;
}
```

**Problem:** Platform-specific styles pollute core CSS.

### ✅ GOOD - Platform Styles in Platform Files

```css
/* In ai_sam/static/src/css/canvas_base.css (CORE ONLY) */

.canvas-container {
    width: 100%;
    height: 100vh;
}

.canvas-node {
    position: absolute;
    cursor: pointer;
    /* Generic node styles only */
}

.canvas-connection {
    stroke: #333;
    stroke-width: 2px;
    /* Generic connection styles only */
}
```

```css
/* In the_ai_automator/static/src/css/workflow_styles.css */

.workflow-node {
    background: #4CAF50;
    border-radius: 8px;
}

.workflow-connection {
    stroke: blue;
}
```

```css
/* In ai_sam_memory/static/src/css/memory_styles.css */

.memory-node {
    background: #FF5722;
    border-radius: 50%;
}

.knowledge-connection {
    stroke: red;
    stroke-dasharray: 5,5;
}
```

### 🔍 How to Detect

```bash
# Search for platform-specific CSS classes in core
grep -rE "\.n8n-|\.workflow-|\.memory-|\.knowledge-|\.poppy-" ai_sam/static/src/css/canvas_base.css
grep -rE "\.n8n-|\.workflow-|\.memory-|\.knowledge-|\.poppy-" ai_sam/static/src/css/skeleton_base.css
```

### 🛠️ How to Fix

1. Identify platform-specific CSS rules
2. Extract to platform CSS file
3. Remove from core CSS
4. Ensure platforms import their own styles

---

## Detection Commands (Quick Reference)

```bash
# Run these to find violations

# 1. Platform names in core
grep -rE "n8n|workflow|memory|knowledge|poppy|automator" ai_sam/static/src/canvas_core/

# 2. Skeleton references
grep -ri "skeleton" ai_sam/
find ai_sam/ -iname "*skeleton*"

# 3. Cross-platform imports
grep -r "from the_ai_automator" ai_sam_memory/
grep -r "from ai_sam_memory" the_ai_automator/

# 4. Duplicate code (manual review)
find ai_sam/ -name "*sidebar*.js" -o -name "*toolbar*.js"

# 5. Business logic in core
grep -r "execute\|query\|save.*workflow\|delete.*workflow" ai_sam/static/src/canvas_core/

# 6. Platform CSS in core
grep -rE "\.n8n-|\.workflow-|\.memory-" ai_sam/static/src/css/canvas_base.css
```

---

## Summary: Your Anti-Pattern Radar

When reviewing code, ask:

1. **Platform names in core?** → Extract to platform renderer
2. **Cross-platform imports?** → Use shared ai_brain models
3. **"Skeleton" references?** → Rename to "canvas"
4. **Duplicated components?** → Extract to shared base class
5. **Business logic in rendering?** → Move to platform
6. **Platform CSS in core?** → Move to platform CSS

If you find ANY of these patterns, **flag and fix immediately**.
