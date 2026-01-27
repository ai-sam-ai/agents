# Three-Layer Architecture (Post-93% Reduction)

**Context**: ai_sam_workflows underwent 93% code reduction, transitioning to new MVP Server architecture
**Impact**: Code relocated (90% to ai_sam, 10% ai_sam_workflows, small amount ai_brain)
**Critical**: Old architecture patterns NO LONGER VALID - flows must be remapped

---

## 🏗️ Architecture Overview

### OLD Architecture (Pre-Reduction)
```
UI (ai_sam_workflows)
   ↓
Controller (ai_sam_workflows)
   ↓
Model (ai_brain)
   ↓
Database (PostgreSQL)
```

**Problem**: Tightly coupled, heavy codebase, complexity

---

### NEW Architecture (Post-93% Reduction)
```
┌─────────────────────────────────────────────────────┐
│ LAYER 1: User Interface & Keyboard Actions         │
│ Location: ai_sam_workflows (UI) + ai_sam (shared)  │
│ What users see and interact with                   │
└─────────────────────────────────────────────────────┘
                      ↓ API Calls
┌─────────────────────────────────────────────────────┐
│ LAYER 2: MVP Server (90% implemented)              │
│ Location: ai_sam (90% of NEW code lives here)      │
│                                                     │
│ Component A: API Management                        │
│   - HTTP endpoints, routing, validation            │
│   - Status: 90% implemented                        │
│                                                     │
│ Component B: Execution Engine                      │
│   - Workflow processing, node execution            │
│   - Status: NOT YET implemented ⚠️                 │
└─────────────────────────────────────────────────────┘
                      ↓ Data Calls
┌─────────────────────────────────────────────────────┐
│ LAYER 3: Data Layer                                │
│ Location: ai_brain (data models)                   │
│ Raw JSON storage + Odoo models → PostgreSQL tables │
└─────────────────────────────────────────────────────┘
```

**Benefits**: Decoupled, lighter codebase, clear separation of concerns

---

## 📂 Layer 1: User Interface & Keyboard Actions

### Purpose
Everything users see and interact with - buttons, menus, canvas, overlays, forms

### File Locations

**UI Components (ai_sam_workflows)**:
- `views/*.xml` - Odoo views (menus, forms, tree views)
- `static/src/xml/*.xml` - QWeb templates (overlays, modals)
- `wizards/*.py` - Wizard forms (multi-step processes)

**Shared JavaScript (ai_sam)**:
- `static/src/js/canvas_engine.js` - Canvas rendering
- `static/src/js/node_overlay.js` - Node management UI
- `static/src/js/workflow_designer.js` - Drag-drop interface

### Key User Actions
1. **Click +Node button** - Add node to canvas
2. **Drag node** - Position on canvas
3. **Connect nodes** - Create workflow flow
4. **Click Save** - Persist workflow
5. **Click Execute** - Run workflow
6. **Right-click node** - Context menu (edit, delete, configure)
7. **Keyboard shortcuts** - Ctrl+S (save), Delete (remove node), etc.

### Transition to Layer 2
**Method**: AJAX calls to API endpoints

**Example**:
```javascript
// Layer 1 (UI) - User clicks +Node
function addNode() {
    // OLD: Direct model access (REMOVED in 93% reduction)
    // this.model.create({name: 'New Node'});

    // NEW: API call to Layer 2 (MVP Server)
    fetch('/api/node/create', {
        method: 'POST',
        body: JSON.stringify({node_type: 'action'})
    });
}
```

**BREAKPOINT RISK**: Old UI code still expects direct model access, NEW architecture requires API calls

---

## ⚙️ Layer 2: MVP Server (Minimum Viable Product Server)

### Purpose
Business logic, API management, workflow execution engine

### File Locations (ai_sam - 90% of NEW code)

**API Management (90% implemented)**:
- `controllers/workflow_api_controller.py` - Workflow CRUD endpoints
- `controllers/node_api_controller.py` - Node management endpoints
- `controllers/execution_api_controller.py` - Workflow execution endpoints
- `services/api_validator.py` - Request validation
- `services/api_response.py` - Response formatting

**Execution Engine (NOT YET implemented ⚠️)**:
- `services/execution_engine.py` - **TODO**: Workflow processor
- `services/node_executor.py` - **TODO**: Individual node execution
- `services/execution_logger.py` - **TODO**: Execution tracking

### Component A: API Management (90% Complete)

**Responsibilities**:
1. Receive HTTP requests from Layer 1 (UI)
2. Validate request data (authentication, permissions, schema)
3. Route to appropriate service/model
4. Format response (JSON)
5. Handle errors gracefully

**Endpoint Pattern**:
```python
# Example: Create Node API Endpoint
@http.route('/api/node/create', type='json', auth='user', methods=['POST'])
def create_node(self, **kwargs):
    """
    Layer 2 (API Management) - Handle node creation
    """
    # Validate request
    node_type = kwargs.get('node_type')
    if not node_type:
        return {'error': 'node_type required'}

    # Call Layer 3 (Data Layer)
    node_model = request.env['ai_brain.nodes']
    node = node_model.create({
        'name': f'New {node_type} Node',
        'node_type': node_type
    })

    # Return response
    return {'id': node.id, 'name': node.name}
```

**BREAKPOINT RISK**:
- Endpoints might not exist yet (commented out during reinstall)
- UI still calling old endpoints (renamed in new architecture)
- Validation logic might be incomplete

---

### Component B: Execution Engine (NOT IMPLEMENTED ⚠️)

**Intended Responsibilities**:
1. Process workflow execution requests
2. Execute nodes in correct sequence
3. Pass data between nodes
4. Handle execution errors
5. Log execution results

**Current Status**: **CRITICAL GAP** - NOT YET IMPLEMENTED

**CRITICAL BREAKPOINT**:
- If user clicks "Execute Workflow" → UI calls `/api/workflow/execute`
- API endpoint might exist (Layer 2A - API Management)
- But Execution Engine (Layer 2B) doesn't process it yet
- **Result**: Workflow doesn't run, or errors silently

**Temporary Workaround**:
- Execution might fall back to old direct model execution (if commented code still exists)
- Or execution simply fails (if old code removed)

---

## 💾 Layer 3: Data Layer

### Purpose
Persistent storage - models, JSON data, database tables

### File Locations (ai_brain)

**Workflows-Relevant Models**:
- `models/canvas.py` - Workflow canvas (container)
- `models/nodes.py` - Workflow nodes (tasks)
- `models/connections.py` - Node connections (flow)
- `models/executions.py` - Execution history (logs)
- `models/workflow_types.py` - Workflow categories
- `models/node_types.py` - N8N node library (1,500+ nodes)

**Data Storage**:
- **PostgreSQL tables** - Structured data (canvas, nodes, connections, executions)
- **JSON fields** - Unstructured data (node configuration, execution context)

### Data Flow Example

**Create Node Flow (Layer 2 → Layer 3)**:
```python
# Layer 2 (MVP Server) calls Layer 3 (Data Layer)
node_model = request.env['ai_brain.nodes']  # Get Odoo model
node = node_model.create({                  # Create database record
    'name': 'HTTP Request Node',
    'node_type': 'n8n-nodes-base.httpRequest',
    'canvas_id': canvas_id,
    'position_x': 100,
    'position_y': 200,
    'config_json': json.dumps({
        'method': 'GET',
        'url': 'https://api.example.com'
    })
})
# Returns: node record (with ID)
```

**Database Result**:
```sql
INSERT INTO ai_brain_nodes (name, node_type, canvas_id, position_x, position_y, config_json)
VALUES ('HTTP Request Node', 'n8n-nodes-base.httpRequest', 42, 100, 200, '{"method":"GET","url":"https://api.example.com"}');
```

**BREAKPOINT RISK**:
- Data structure might have changed (JSON schema)
- Model fields might be renamed/removed
- Relationships might be broken (foreign keys)

---

## 🔗 Layer Interactions (Critical Transitions)

### Transition 1: Layer 1 → Layer 2 (UI → MVP Server)
**Method**: HTTP API calls (AJAX, fetch)

**Example**: Add Node
```javascript
// Layer 1 (UI)
fetch('/api/node/create', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        canvas_id: this.canvasId,
        node_type: 'n8n-nodes-base.httpRequest'
    })
});
```

**BREAKPOINT RISKS**:
- ❌ Endpoint doesn't exist (404 Not Found)
- ❌ Endpoint renamed (old UI calling old endpoint)
- ❌ Request format changed (validation fails)
- ❌ Authentication broken (unauthorized)

---

### Transition 2: Layer 2 → Layer 3 (MVP Server → Data Layer)
**Method**: Odoo ORM calls (`request.env['model.name']`)

**Example**: Create Node
```python
# Layer 2 (MVP Server)
node_model = request.env['ai_brain.nodes']
node = node_model.create({...})
```

**BREAKPOINT RISKS**:
- ❌ Model doesn't exist (ImportError)
- ❌ Model fields changed (missing field error)
- ❌ Permissions broken (AccessError)
- ❌ JSON schema invalid (validation error)

---

### Transition 3: Layer 3 → Database (Data Layer → PostgreSQL)
**Method**: Odoo ORM → SQL (automatic)

**Example**: Create Node
```python
# Layer 3 (Data Layer) - Odoo ORM
node = node_model.create({...})

# ↓ Odoo translates to SQL (automatic)

# PostgreSQL
INSERT INTO ai_brain_nodes (...) VALUES (...);
```

**BREAKPOINT RISKS**:
- ❌ Table doesn't exist (database schema not updated)
- ❌ Column doesn't exist (migration not run)
- ❌ Constraint violation (foreign key, unique, not null)

---

## 🚨 Critical Breakpoint Zones (High Risk Areas)

### Zone 1: Old UI Code Calling Old Endpoints
**Problem**: 93% code reduction removed old endpoints, but UI still references them

**Example**:
```javascript
// OLD (removed in reduction)
this.rpc('/ai_sam_workflows/node/create', {...});

// NEW (should be)
fetch('/api/node/create', {...});
```

**Impact**: 404 errors, broken functionality

---

### Zone 2: Execution Engine Gap
**Problem**: Execution Engine NOT YET implemented, but UI assumes it exists

**Example**:
- User clicks "Execute Workflow"
- UI calls `/api/workflow/execute`
- API endpoint exists (Layer 2A)
- But Execution Engine (Layer 2B) doesn't process it
- **Result**: Workflow doesn't run

**Impact**: Core functionality broken

---

### Zone 3: Data Structure Mismatches
**Problem**: JSON schemas changed, old code expects old format

**Example**:
```python
# OLD JSON format (pre-reduction)
node_config = {
    'settings': {'method': 'GET'},
    'params': {'url': 'https://...'}
}

# NEW JSON format (post-reduction)
node_config = {
    'method': 'GET',
    'url': 'https://...'
}

# If old code reads 'settings' key → KeyError
```

**Impact**: Runtime errors, data loss

---

### Zone 4: Commented-Out Code
**Problem**: Code commented out during reinstall, but still referenced elsewhere

**Example**:
```python
# OLD (working code)
def execute_workflow(canvas_id):
    # ...execution logic...

# NEW (commented out to allow reinstall)
# def execute_workflow(canvas_id):
#     # ...execution logic...

# ELSEWHERE (still calling it)
result = execute_workflow(42)  # NameError!
```

**Impact**: NameError, AttributeError at runtime

---

## 📐 Architecture Benefits (Why 93% Reduction)

### Before (Heavy Codebase)
- ❌ Tight coupling (UI, logic, data mixed)
- ❌ Duplicate code (same logic in multiple places)
- ❌ Complex dependencies (hard to modify)
- ❌ Monolithic structure (all in ai_sam_workflows)

### After (Light Codebase)
- ✅ Clear separation (UI, API, Data layers)
- ✅ Reusable services (DRY principle)
- ✅ Independent modules (easy to modify)
- ✅ Distributed structure (ai_sam_workflows, ai_sam, ai_brain)

### Code Distribution
- **10%** in ai_sam_workflows (UI only)
- **90%** in ai_sam (API Management, Execution Engine)
- **Small amount** in ai_brain (data models only)

---

## 🎯 Mapping Strategy (For Rescue Mission)

When mapping feature flows:

### Step 1: Identify Layer 1 Entry Point
**Question**: What does user click/type?
**Find**: UI code (views, JavaScript)

### Step 2: Find Layer 2 API Call
**Question**: What endpoint does UI call?
**Find**: API endpoint definition (controllers)
**Breakpoint Check**: Does endpoint exist? Renamed? Commented out?

### Step 3: Trace Layer 2 Logic
**Question**: What does API endpoint do?
**Find**: Business logic (services, processing)
**Breakpoint Check**: Is Execution Engine implemented? Complete?

### Step 4: Identify Layer 3 Data Call
**Question**: What models/tables are accessed?
**Find**: Odoo model calls (`request.env['model']`)
**Breakpoint Check**: Model exists? Fields match? Permissions OK?

### Step 5: Verify Database Schema
**Question**: Does table structure support operation?
**Find**: Database schema (migration files, SQL)
**Breakpoint Check**: Table exists? Columns match? Constraints valid?

---

## ✅ Architecture Checklist (Per Feature)

When mapping a feature, verify:

**Layer 1 (UI)**:
- [ ] UI element exists (button, menu, form)
- [ ] JavaScript/QWeb code is NOT commented out
- [ ] Event handlers wired correctly (onclick, submit)
- [ ] API calls use NEW endpoints (not old RPC calls)

**Layer 2 (MVP Server)**:
- [ ] API endpoint exists (not commented out)
- [ ] Route path matches UI call
- [ ] Request validation implemented
- [ ] Execution Engine logic complete (if needed)
- [ ] Response format matches UI expectations

**Layer 3 (Data Layer)**:
- [ ] Model imported correctly
- [ ] Model fields match data structure
- [ ] JSON schema valid
- [ ] Permissions configured (security rules)
- [ ] Database table exists (migration run)

**If ANY checkbox fails → BREAKPOINT identified** ⚠️

---

**Use this architecture map as reference when tracing feature flows top-down.** 🏗️
