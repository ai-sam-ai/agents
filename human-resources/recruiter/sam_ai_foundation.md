# SAM AI Foundation - Shared Knowledge for All Niche Agents

**Purpose:** Consolidated ai_brain + ai_sam architecture knowledge
**Used By:** All module-specific "niche" agents (mod_intelligence, mod_workflows, mod_memory, etc.)
**Last Updated:** 2025-10-17

---

## 🎯 Three-Layer Architecture (V3)

**THE Foundation** - Every niche agent must understand this:

```
┌─────────────────────────────────────────────────────┐
│   BRANCHES (Platform Skins - UI only)              │
│   ai_sam_memory, ai_sam_workflows, etc.            │
│   ↓ NO DATA MODELS (just views, JS, CSS)           │
└─────────────────────────────────────────────────────┘
                     ↓ depends on
┌─────────────────────────────────────────────────────┐
│   AI_SAM (Framework Layer)                          │
│   ↓ Canvas core, controllers, services             │
│   ↓ NO DATA MODELS (framework code only)           │
└─────────────────────────────────────────────────────┘
                     ↓ depends on
┌─────────────────────────────────────────────────────┐
│   AI_BRAIN (Data Layer - Foundation)                │
│   ↓ ALL DATA MODELS live here                      │
│   ↓ NEVER UNINSTALL (data stays forever)           │
└─────────────────────────────────────────────────────┘
```

---

## 🏛️ ai_brain - The Data Foundation

**Path:** `C:\Working With AI\ai_sam\ai_sam\ai_brain\`

**Philosophy:** "The Brain" - Permanent data storage, never uninstall

### What Lives in ai_brain

**✅ ALL data models** (60+ models total):
- Canvas, nodes, connections, executions
- Conversations, messages, token usage
- User profiles, settings, AI services
- Workflow data (even though ai_sam_workflows is the UI)
- Memory data (even though ai_sam_memory is the UI)
- Agent registry, knowledge management

**❌ NO views, NO controllers, NO JavaScript**

### Key ai_brain Models

**Workflow System:**
- `canvas` - Universal workflow/canvas storage
- `nodes` - Node instances
- `connections` - Node connections
- `executions` - Execution history (audit trail)
- `workflow_types`, `workflow.template`, `workflow.business.unit`
- `api_credentials` - API keys (sensitive!)

**AI Services:**
- `ai.service` - Claude API integration
- `ai.service.config` - API configuration
- `ai.service.provider` - Provider registry
- `ai.context.builder` - All-knowing context builder
- `ai.token.usage` - Token/cost tracking

**Conversation System:**
- `ai.conversation` - Chat threads
- `ai.message` - Individual messages
- `sam.chat.session` - Chat sessions
- `sam.chat.message` - Session messages

**Memory System:**
- `ai.graph.service` - Apache AGE graph DB
- `ai.vector.service` - ChromaDB vector search
- `ai.conversation.import` - Import wizards
- `ai.document.extractor` - Document extraction
- `ai.extractor.plugin` - Learned patterns

**Agent System:**
- `ai.agent.definition` - Agent configs
- `ai.agent.execution` - Execution logs
- `ai.agent.knowledge` - Knowledge files
- `ai.agent.registry` - Agent registry

**SAM Personality:**
- `sam.personality` - SAM's core personality
- `sam.user.profile` - User relationships
- `sam.user.settings` - User preferences
- `sam.mode.context` - Power Prompts

---

## 🧠 ai_sam - The Framework

**Path:** `C:\Working With AI\ai_sam\ai_sam\ai_sam\`

**Philosophy:** Framework that all branches depend on

### What Lives in ai_sam

**✅ Framework code:**
- Canvas skeleton core (universal engine)
- Platform loader (dynamic skin injection)
- Controllers (query engines)
- Services (Claude API, context builder)
- Universal JavaScript (chat widget, token counter)

**❌ NO data models (those are in ai_brain)**

### Key ai_sam Components

**Controllers (Query Engines):**
- `sam_ai_chat_controller.py` - Chat endpoints
- `sam_session_controller.py` - Session management
- `sam_developer_mode.py` - Developer tools
- `skeleton_canvas_controller.py` - Canvas API
- `memory_graph_controller.py` - Memory API

**Services:**
- `ai_service.py` - Claude API wrapper
- `ai_context_builder.py` - Context assembly
- `ai_voice_service.py` - Whisper integration
- `ai_registry_watcher.py` - Module monitor

**JavaScript (Universal):**
- `sam_ai_chat_widget.js` - Global chat
- `sam_ai_token_counter.js` - Cost display
- `skeleton_canvas_engine.js` - Canvas core
- `platform_loader.js` - Dynamic loading

---

## 🌿 Platform Skins (Branches)

**Philosophy:** UI-only modules, data stays in ai_brain

### What Makes a Platform Skin

**✅ Contains:**
- Views (XML) - Platform-specific forms
- JavaScript Renderers - Platform-specific canvas rendering
- CSS Styles - Platform-specific styling
- Optional: Platform-specific controllers (UI logic only)

**❌ Does NOT contain:**
- Data models (those are in ai_brain)

### Examples

**ai_sam_workflows:**
- N8N-style workflow UI
- Node-based canvas renderer
- Workflow import/export controllers
- **Data:** All in ai_brain (canvas, nodes, executions)

**ai_sam_memory:**
- Knowledge graph visualization
- Apache AGE + ChromaDB UI
- Conversation import UI
- **Data:** All in ai_brain (memory config, extractions)

**ai_sam_intelligence:**
- Agent registry UI
- Documentation intelligence views
- Knowledge file browser
- **Data:** All in ai_brain (agent.registry, agent.knowledge)

---

## 🎯 The Golden Rules

### Rule 1: Data Safety
> "If losing it would make a customer angry, it belongs in ai_brain"

**Test:**
- Workflow definitions? → ai_brain (customer data!)
- Execution history? → ai_brain (audit trail!)
- UI theme preference? → Platform skin (safe to lose)

### Rule 2: Platform Skin Uninstallable
> "Debug UI issues 1 platform at a time"

**Workflow:**
1. User uninstalls ai_sam_workflows (UI broken)
2. Data remains safe in ai_brain
3. User debugs, fixes, reinstalls
4. All workflows still there!

### Rule 3: Controllers Split
> "Universal operations → ai_sam | Platform-specific → Skin"

**Examples:**
- Canvas CRUD (used by all) → ai_sam controller
- N8N JSON import (only workflows) → ai_sam_workflows controller
- Both access ai_brain directly for data

### Rule 4: Dependency Flow
```
Skins → ai_sam → ai_brain → base
```

**You can:**
- Query ai_brain from ai_sam controllers ✅
- Query ai_brain from platform skin controllers ✅
- Build web forms that query ai_brain directly ✅

**You cannot:**
- Put data models in ai_sam ❌
- Put data models in platform skins ❌
- Uninstall ai_brain ❌

---

## 📁 Module Structure Reference

### ai_brain Structure
```
ai_brain/
├── models/               ← ALL DATA MODELS
│   ├── ai_service.py
│   ├── canvas.py
│   ├── nodes.py
│   └── ... (60+ models)
├── data/
│   └── SAM_AI_MASTER_SYSTEM_PROMPT_V2.md
└── security/
    └── ir.model.access.csv
```

### ai_sam Structure
```
ai_sam/
├── models/               ← EMPTY (no data models)
├── controllers/          ← Universal query engines
├── static/src/
│   ├── core/            ← Canvas skeleton
│   ├── js/              ← Universal widgets
│   └── css/             ← Universal styles
└── views/               ← Universal container views
```

### Platform Skin Structure (Template)
```
ai_sam_{module}/
├── models/               ← EMPTY (no data models!)
├── controllers/          ← Optional: Platform UI logic
├── views/               ← Platform-specific views
├── static/src/
│   └── {module}/        ← Platform renderer
│       ├── {module}_renderer.js
│       ├── {module}_toolbar.js
│       └── {module}_styles.css
├── data/                ← Seed data (reinstallable)
└── security/            ← View access only
```

---

## 🔑 Key Paths (Always Use These)

**SAM AI Ecosystem Root:**
```
C:\Working With AI\ai_sam\ai_sam\
```

**Foundation Modules:**
```
C:\Working With AI\ai_sam\ai_sam\ai_brain\
C:\Working With AI\ai_sam\ai_sam\ai_sam\
```

**Platform Skins:**
```
C:\Working With AI\ai_sam\ai_sam\ai_sam_memory\
C:\Working With AI\ai_sam\ai_sam\ai_sam_workflows\
C:\Working With AI\ai_sam\ai_sam\ai_sam_intelligence\
... (10 more skins)
```

**Excluded Paths (DO NOT REFERENCE):**
- ❌ `ai_sam_odoo` (path doesn't exist)
- ❌ `custom-modules-v18` (out of scope)
- ❌ `ai_sam_desktop`, `ai_sam_mobile` (no __manifest__.py yet)

---

## 🗄️ Database Schema Essentials

### Odoo Model Naming Conventions

**Technical Name (model):** `ai.agent.registry`
**Python Class:** `AiAgentRegistry`
**Table Name:** `ai_agent_registry`

### Common Field Patterns

**Odoo Base Fields (auto-added):**
- `id` - Primary key
- `create_date` - Creation timestamp
- `write_date` - Last update timestamp
- `create_uid` - Created by (user)
- `write_uid` - Last updated by (user)

**Odoo 18 Security:**
- Every custom model MUST have security rules
- File: `security/ir.model.access.csv`
- Minimum: User + Manager access rows

---

## 🔄 Common Operations

### Query ai_brain from Any Module

```python
# From ai_sam controller
Canvas = request.env['canvas']
workflows = Canvas.search([('canvas_type', '=', 'workflow')])

# From platform skin controller
Canvas = self.env['canvas']
my_canvas = Canvas.create({'name': 'New Workflow'})

# From web form model
Canvas = self.env['canvas']
results = Canvas.search_read([...])
```

### Access Context Builder

```python
# Universal context assembly
context_prompt = self.env['ai.context.builder'].build_context_prompt({
    'model': 'canvas',
    'record_id': 42,
    'include_system': True
})
```

### Call Claude API

```python
# Through ai_service
ai_service = self.env['ai.service']
response = ai_service.send_message({
    'message': 'Hello SAM',
    'conversation_id': conv_id
})
```

---

## 🚀 For Niche Agents: What You Must Know

**When building for your specific module:**

1. **ALL YOUR DATA** lives in ai_brain (not your module!)
2. **YOUR MODULE** is just UI (views, JS, optional controllers)
3. **YOUR CONTROLLERS** query ai_brain directly (no abstraction needed)
4. **YOUR MODELS** don't exist (they're in ai_brain already)

**Example: ai_sam_intelligence**
- Models: `ai.agent.registry`, `ai.agent.knowledge` → **in ai_brain**
- Views: Agent registry, knowledge browser → **in ai_sam_intelligence**
- Controllers: Agent sync, intelligence reports → **in ai_sam_intelligence**

---

## 📋 Manifest Standards (Odoo 18)

**ALL SAM AI modules use these standards:**

```python
{
    'name': 'SAM AI - {Module Name}',
    'version': '18.0.{major}.{minor}.{patch}',
    'author': 'Anthony Gardiner - Odoo Consulting & Claude AI',
    'maintainer': 'Anthony Gardiner <anthony@sme.ec>',
    'website': 'https://sme.ec',
    'license': 'LGPL-3',
    'category': 'Productivity/AI',
    'depends': ['base', 'ai_brain', 'ai_sam'],
    'images': ['static/description/icon.png'],
}
```

**Version Format:** `18.0.x.y` (Odoo 18 requirement)

---

## 🎯 Quick Decision Trees

### "Where does this file go?"

**Is it a data model?**
→ YES: ai_brain/models/
→ NO: Continue...

**Is it universal framework code?**
→ YES: ai_sam/
→ NO: Continue...

**Is it platform-specific UI?**
→ YES: ai_sam_{module}/
→ NO: Ask for guidance

### "Where does this controller go?"

**Used by 2+ platforms?**
→ YES: ai_sam/controllers/ (query engine)
→ NO: Continue...

**Platform-specific UI logic?**
→ YES: ai_sam_{module}/controllers/
→ NO: Might not need controller

### "Can I uninstall this module?"

**Is it ai_brain?**
→ NO: Never uninstall (data layer)

**Is it ai_sam?**
→ ONLY if no skins installed

**Is it a platform skin?**
→ YES: Safe to uninstall (data protected)

---

## 🔗 Related Documentation

**Full Architecture:**
- `SAM_AI_V3_ARCHITECTURE.md` (670 lines, complete system)
- `PLATFORM_SKIN_MODEL.md` (678 lines, skin pattern)

**Current State:**
- `current_state.md` (387 lines, single source of truth)

**Module Specifics:**
- Each module has README.md in its root
- Dev docs in `{module}/dev docs/` (niche agent specific)

---

## ✅ Foundation Knowledge Complete

**You now understand:**
- ✅ Three-layer architecture (ai_brain → ai_sam → skins)
- ✅ Where data lives (ai_brain, always)
- ✅ Where framework lives (ai_sam)
- ✅ Where UI lives (platform skins)
- ✅ How to query data (from anywhere)
- ✅ Why this matters (data safety, debug isolation)

**Next:** Module-specific knowledge in your dev docs!

---

**Last Updated:** 2025-10-17
**Maintained By:** Chief of Staff (/cos)
**Used By:** All niche module agents (mod_intelligence, mod_workflows, etc.)
