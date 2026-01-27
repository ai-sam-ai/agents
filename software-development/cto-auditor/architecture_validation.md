# Architecture Validation - Strategic Structure Review

**Purpose:** Validate code fits architectural patterns and doesn't introduce structural debt

**Philosophy:** "Good code in wrong place is still wrong. Architecture violations compound over time."

---

## Odoo 18 Three-Layer Architecture

### The Model: ai_brain → ai_sam → branches

```
ai_brain/          (Data layer - models ONLY)
├── models/
│   ├── ai_user.py
│   ├── ai_conversation.py
│   └── ai_message.py
├── security/
│   └── ir.model.access.csv
└── __manifest__.py

ai_sam/            (Framework layer - canvas core)
├── controllers/
│   └── canvas_controller.py
├── static/src/js/
│   └── canvas_engine.js
├── views/
│   └── canvas_base_views.xml
└── __manifest__.py

branches/          (Feature modules - siblings)
├── ai_sam_memory/
├── ai_sam_workflows/
└── ai_sam_chat/
```

---

## Validation Rules

### Rule 1: Data Models in ai_brain ONLY

**Correct:**
```python
# ai_brain/models/ai_conversation.py
class AiConversation(models.Model):
    _name = 'ai.conversation'
    _description = 'AI Conversation'
```

**Incorrect:**
```python
# ai_sam_chat/models/chat_conversation.py  ❌
class ChatConversation(models.Model):
    _name = 'chat.conversation'  # Should be in ai_brain!
```

**Why:** Data models are shared across features. Must be in central layer.

**Score Impact:** -3 points (architectural violation)

---

### Rule 2: No Platform Bleeding into Canvas Core

**Correct:**
```javascript
// ai_sam/static/src/js/canvas_engine.js (Platform-agnostic)
class CanvasEngine {
    renderContent(data) {
        // Generic rendering, no platform-specific logic
    }
}
```

**Incorrect:**
```javascript
// ai_sam/static/src/js/canvas_engine.js  ❌
class CanvasEngine {
    renderMemoryPlatform(data) {  // Platform-specific!
        // Memory-specific logic in canvas core
    }
}
```

**Why:** Canvas core = ONE core, MANY skins. Platform logic belongs in branches.

**Score Impact:** -3 points (violates architecture principle)

---

### Rule 3: Branches Are Independent Siblings

**Correct:**
```python
# ai_sam_workflows/models/workflow.py
from odoo import models, fields
from odoo.addons.ai_sam import canvas_helper  # ✅ Import from framework

class Workflow(models.Model):
    _name = 'ai.workflow'
```

**Incorrect:**
```python
# ai_sam_workflows/models/workflow.py
from odoo.addons.ai_sam_memory import memory_helper  # ❌ Cross-branch import!
```

**Why:** Branches don't know about each other. Only import from ai_brain or ai_sam.

**Score Impact:** -2 points (coupling violation)

---

### Rule 4: Security Rules Required for Custom Models

**Correct:**
```csv
# security/ir.model.access.csv
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_ai_conversation_user,ai.conversation.user,model_ai_conversation,base.group_user,1,1,1,0
access_ai_conversation_manager,ai.conversation.manager,model_ai_conversation,base.group_system,1,1,1,1
```

**Incorrect:**
```python
# Created model, but NO security/ir.model.access.csv file  ❌
```

**Why:** Odoo requires explicit access rules. Missing = security gap.

**Score Impact:** -2 points (security violation)

---

### Rule 5: Odoo 18 Compliance

**Correct:**
```xml
<list string="Conversations">  <!-- Odoo 18 -->
    <field name="name"/>
</list>
```

**Incorrect:**
```xml
<tree string="Conversations">  <!-- ❌ Deprecated in Odoo 18 -->
    <field name="name"/>
</tree>
```

**Why:** Odoo 18 uses `<list>`, `<tree>` is deprecated.

**Score Impact:** -1 point (compatibility issue)

---

## Architectural Patterns Checklist

### For New Models

- [ ] Model in ai_brain/models/ (not branch)
- [ ] Security rules in security/ir.model.access.csv
- [ ] Manifest depends on 'ai_brain'
- [ ] No cross-branch dependencies

### For Controllers

- [ ] Generic controllers in ai_sam/controllers/
- [ ] Platform-specific controllers in branch/controllers/
- [ ] No platform logic in canvas core
- [ ] HTTP routes use correct auth

### For Views

- [ ] Uses `<list>` not `<tree>` (Odoo 18)
- [ ] Version format: 18.0.x.y
- [ ] Clear structure (sheet > group > fields)

### For JavaScript

- [ ] Canvas core JS in ai_sam/static/src/js/
- [ ] Platform-specific JS in branch/static/src/js/
- [ ] No tight coupling to specific platform
- [ ] Uses Odoo OWL framework patterns

---

## Scalability Validation (Principle 3: Build for 10x)

### Question: Does this scale to 10x?

**Current Scale Assessment:**
```markdown
Current: [X users, Y records, Z requests/sec]
Built for: [10X users, 10Y records, 10Z requests/sec]

Validated:
- [ ] Database queries have indexes
- [ ] No N+1 query patterns
- [ ] Pagination implemented (if list views)
- [ ] Caching considered (if needed)
- [ ] No performance bottlenecks introduced
```

**Red Flags:**
- ❌ Built for 100x (over-engineered)
- ❌ No indexes on queried fields
- ❌ N+1 queries
- ❌ No pagination on large datasets
- ❌ Complex computation on every request

**Score Impact:** -1 to -2 points (scalability concern)

---

## Integration Validation

### Question: How does this integrate with existing code?

**Check:**
- [ ] Uses existing patterns (doesn't reinvent)
- [ ] Extends framework correctly (inheritance, not copy-paste)
- [ ] Respects existing interfaces
- [ ] No breaking changes to existing modules
- [ ] Backward compatible (if applicable)

**Red Flags:**
- ❌ Duplicates existing functionality
- ❌ Breaks existing interfaces
- ❌ Incompatible with existing patterns
- ❌ Forces changes to other modules

**Score Impact:** -1 to -2 points (integration issues)

---

## Naming Conventions Validation

### Odoo Model Naming

**Correct:**
```python
_name = 'ai.conversation'       # ✅ Dot-separated, lowercase
_name = 'ai.workflow.step'      # ✅ Hierarchy clear
```

**Incorrect:**
```python
_name = 'AiConversation'        # ❌ CamelCase
_name = 'ai_conversation'       # ❌ Underscore
```

### File Naming

**Correct:**
```
models/ai_conversation.py       # ✅ Snake_case, matches model
views/ai_conversation_views.xml # ✅ Clear purpose
```

**Incorrect:**
```
models/AiConversation.py        # ❌ CamelCase
views/views.xml                 # ❌ Too generic
```

---

## Architecture Violation Examples

### Example 1: Data Model in Wrong Layer

**Violation:**
```python
# ai_sam_memory/models/memory_node.py  ❌
class MemoryNode(models.Model):
    _name = 'memory.node'
```

**Why Wrong:** Data models should be in ai_brain (shared layer)

**Correct:**
```python
# ai_brain/models/ai_memory_node.py  ✅
class AiMemoryNode(models.Model):
    _name = 'ai.memory.node'
```

**Score Impact:** -3 points

---

### Example 2: Platform Bleeding

**Violation:**
```javascript
// ai_sam/static/src/js/canvas_engine.js  ❌
class CanvasEngine {
    renderMemoryGraph() {
        // Memory platform-specific rendering in canvas core!
    }

    renderWorkflowDiagram() {
        // Workflow platform-specific rendering in canvas core!
    }
}
```

**Why Wrong:** Canvas core should be platform-agnostic

**Correct:**
```javascript
// ai_sam/static/src/js/canvas_engine.js  ✅
class CanvasEngine {
    render(platformData, renderer) {
        // Generic, delegates to platform-specific renderer
        return renderer.render(platformData);
    }
}

// ai_sam_memory/static/src/js/memory_renderer.js  ✅
class MemoryRenderer {
    render(data) {
        // Memory-specific rendering
    }
}
```

**Score Impact:** -3 points

---

### Example 3: Cross-Branch Dependency

**Violation:**
```python
# ai_sam_workflows/models/workflow.py  ❌
from odoo.addons.ai_sam_memory.models.memory_node import MemoryNode

class Workflow(models.Model):
    def execute(self):
        memory = MemoryNode.search([...])  # Cross-branch!
```

**Why Wrong:** Branches should be independent

**Correct:**
```python
# ai_sam_workflows/models/workflow.py  ✅
from odoo import models, fields

class Workflow(models.Model):
    def execute(self):
        memory = self.env['ai.memory.node'].search([...])  # Via ai_brain
```

**Score Impact:** -2 points

---

## Architecture Decision Matrix

### Where Should This Code Go?

```
Need to create...?
├─→ Data model (Customer, Order, User)
│   → ai_brain/models/
│
├─→ Generic controller (Canvas rendering)
│   → ai_sam/controllers/
│
├─→ Platform-specific controller (Memory graph API)
│   → ai_sam_memory/controllers/
│
├─→ Canvas core JavaScript (Engine, renderer interface)
│   → ai_sam/static/src/js/
│
├─→ Platform-specific JavaScript (Memory visualization)
│   → ai_sam_memory/static/src/js/
│
├─→ Generic views (Canvas base templates)
│   → ai_sam/views/
│
└─→ Platform-specific views (Memory node form)
    → ai_sam_memory/views/
```

---

## Architecture Audit Template

```markdown
## Architecture Validation

**Files Reviewed:** [List]

### Layer Compliance
- [ ] Models in ai_brain? (or justified exception)
- [ ] Framework code in ai_sam?
- [ ] Platform code in branches?
- [ ] No cross-branch dependencies?

### Odoo Compliance
- [ ] Security rules present (custom models)?
- [ ] Uses `<list>` not `<tree>` (Odoo 18)?
- [ ] Version format 18.0.x.y?
- [ ] Naming conventions followed?

### Scalability (10x Rule)
- [ ] Queries have indexes?
- [ ] No N+1 patterns?
- [ ] Pagination where needed?
- [ ] Built for current + 10x?

### Integration
- [ ] Uses existing patterns?
- [ ] No duplication?
- [ ] Backward compatible?
- [ ] Clear integration points?

**Violations Found:**
- [Violation 1]: [Impact: -X points]
- [Violation 2]: [Impact: -X points]

**Architecture Score:** X/10 (based on violations)
```

---

**Remember:** "Good code in wrong place is still wrong. Validate architecture FIRST, then code quality."
