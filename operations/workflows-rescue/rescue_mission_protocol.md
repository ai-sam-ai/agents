# Workflows Rescue Mission Protocol

**Agent**: workflows-rescue
**Mission**: Prevent debug hell by mapping ALL functionality top-down with breakpoint markers
**Context**: ai_sam_workflows underwent 93% code reduction, now reinstalling with CTO
**Risk**: "So much functionality will be broken" - need proactive identification
**Output**: workflow_bible.html - Complete system map with (BREAKPOINT) markers

---

## 🎯 Mission Objective

Create a comprehensive HTML documentation file that:
1. **Inventories** ALL user-facing functionality (complete feature list)
2. **Maps** each feature through 3-layer architecture (UI → MVP Server → Data)
3. **Identifies** breakpoints where 93% code reduction likely broke things
4. **Prioritizes** breakpoints by severity (CRITICAL, HIGH, MEDIUM, LOW)
5. **Provides** testing hints for proactive debugging
6. **Consolidates** scattered documentation into single source of truth

**This is NOT documentation - this is SURVIVAL.**

---

## 🚨 The Context (What Happened)

### The Victory
- ✅ 93% code reduction in ai_sam_workflows
- ✅ 100%+ complexity drop
- ✅ "Lighter" data load
- ✅ Massive architectural improvement

### The Challenge
- ⚠️ Just managed to reinstall (barely)
- ⚠️ Commenting out conflicting code to reach UI
- ⚠️ **STRONG SUSPICION**: Much functionality broken
- ⚠️ Without due diligence = "horrendously long debug period"
- ⚠️ Risk of "extreme pain and suffering"

### The Solution
- 🎯 Deep due diligence BEFORE testing
- 🎯 Map ALL functionality top-down
- 🎯 Mark suspected breakpoints
- 🎯 Create HTML Bible for visual hierarchy
- 🎯 Proactive testing checklist

---

## 📋 Your 7-Phase Workflow

### Phase 1: Functionality Inventory (Start at User Experience Level)
**Goal**: Catalog EVERY user-facing feature - MOST IMPORTANT START POINT

**Actions**:
1. Scan UI code (XML views, menus, buttons, wizards)
2. Read JavaScript files (user interactions, keyboard shortcuts)
3. Check controllers (HTTP endpoints, form actions)
4. List EVERY feature user can access
5. Categorize by module area (node management, canvas, workflow execution, etc.)

**Prioritization**:
- **CRITICAL**: Core workflows (Add Node, Save Workflow, Execute Workflow)
- **HIGH**: Frequently used features
- **MEDIUM**: Secondary features
- **LOW**: Admin/config features

**Output**: Complete feature inventory (Markdown list for now, HTML later)

**Example Output**:
```markdown
## Feature Inventory

### CRITICAL Features
1. **Add Node** (+Node menu button)
   - Location: UI menu
   - User action: Click +Node button
   - Expected: Node overlay appears

2. **Save Workflow** (Save button)
   - Location: Canvas toolbar
   - User action: Click Save
   - Expected: Workflow persists to database

### HIGH Features
[...]
```

---

### Phase 2: Three-Layer Architecture Mapping
**Goal**: Understand NEW architecture (post-93% reduction)

**The 3 Layers**:
```
Layer 1: User Interface & Keyboard Actions
  Location: ai_sam_workflows (UI) + ai_sam (shared JS)
  What: Buttons, menus, canvas, overlays, forms

Layer 2: MVP Server (90% implemented)
  Location: ai_sam (90% of new code)
  Components:
    - API Management (HTTP endpoints, routing)
    - Execution Engine (NOT YET implemented)

Layer 3: Data Layer
  Location: ai_brain (data models)
  Components:
    - Raw JSON data storage
    - Odoo models → PostgreSQL tables
```

**Actions**:
1. Read ai_sam_workflows code (UI layer)
2. Read ai_sam code (MVP Server layer - 90% of new architecture)
3. Read ai_brain models (Data layer - only workflows-relevant models)
4. Map relationships between layers
5. Document API endpoints (what exists, what's missing)

**Focus**: Only workflows-relevant code (not entire SAM AI ecosystem)

**Output**: Architecture map (text format for now, visual in HTML later)

---

### Phase 3: Feature Flow Mapping (Upside-Down Org Chart)
**Goal**: For EACH feature, trace top-down flow through all 3 layers

**Process** (per feature):
```
[USER ACTION: Click +Node button]
    ↓
[Layer 1: UI Code]
    File: ai_sam_workflows/views/menu.xml
    Code: <button action="add_node_action"/>
    Triggers: JavaScript function addNode()
    ↓
[Layer 2: MVP Server - API Call]
    Expected endpoint: POST /api/node/create
    Handler: ai_sam/controllers/node_controller.py
    Logic: Validate, process, prepare data
    ↓ (BREAKPOINT: Does this endpoint exist?)
[Layer 2: MVP Server - Execution Engine]
    Expected: Node validation, library lookup
    Status: NOT IMPLEMENTED YET
    ↓ (CRITICAL BREAKPOINT: Execution Engine missing!)
[Layer 3: Data Layer]
    Model: ai_brain.nodes
    Action: Create record in nodes table
    JSON: Store node configuration
    ↓ (BREAKPOINT: Data structure changed?)
[DATABASE: PostgreSQL]
    Table: nodes
    Action: INSERT record
```

**Actions**:
1. Pick one CRITICAL feature (e.g., Add Node)
2. Start at UI (user click)
3. Follow code execution downward
4. Document each layer's file, function, expected behavior
5. Mark suspected breakpoints (where code might be broken)
6. Repeat for ALL features (CRITICAL first, then HIGH, MEDIUM, LOW)

**Output**: Flow maps for every feature (detailed Markdown)

---

### Phase 4: Breakpoint Identification & Risk Analysis
**Goal**: Mark WHERE things are likely broken + WHY + HOW to test

**Breakpoint Categories**:

**(CRITICAL BREAKPOINT)**: System unusable if broken
- Example: Add Node fails → can't build workflows
- Example: Execution Engine missing → workflows don't run
- Priority: Fix IMMEDIATELY

**(HIGH BREAKPOINT)**: Major functionality impaired
- Example: Save fails → can't persist work
- Example: API endpoint missing → feature dead
- Priority: Fix within 1-2 days

**(MEDIUM BREAKPOINT)**: Feature degraded but workarounds exist
- Example: Node overlay UI broken but manual entry works
- Example: Performance slow but functional
- Priority: Fix within 1 week

**(LOW BREAKPOINT)**: Minor issues, cosmetic, admin features
- Example: Icon missing
- Example: Tooltip incorrect
- Priority: Fix when convenient

**For Each Breakpoint, Document**:
```markdown
### (CRITICAL BREAKPOINT): Add Node Overlay
- **Location**: Layer 1 → Layer 2 transition
- **Issue**: Old overlay expects direct model access, NEW architecture requires MVP Server API call
- **Root Cause**: 93% code reduction removed old controller, new API not wired to UI
- **Expected Failure**: Click +Node → overlay fails to load OR overlay loads but can't fetch node library
- **Testing**:
  1. Click +Node button in UI
  2. Check browser console for errors
  3. Expected error: "404 Not Found: /api/node/create"
- **Quick Fix Hint**: Wire UI addNode() function to new API endpoint (if endpoint exists)
```

**Actions**:
1. Review each feature flow map
2. Identify transition points (layer boundaries)
3. Mark suspected breakpoints
4. Classify severity
5. Write testing hints
6. Suggest quick fix approach (if obvious)

**Output**: Breakpoint analysis document (Markdown)

---

### Phase 5: Documentation Archaeology
**Goal**: Consolidate scattered docs, extract value, archive obsolete

**Source Locations**:
1. `C:\Working With AI\ai_sam\ai_sam\dev docs` (main docs)
2. `C:\Working With AI\ai_sam\ai_sam\ai_sam_workflows\dev_docs` (workflows-specific)
3. Session history (recent /cto, /mod_workflows sessions)
4. Inline code comments (new architecture notes)

**Process**:
1. Read all docs in source locations
2. Identify still-relevant information (new architecture, MVP Server, API patterns)
3. Extract key insights (API endpoints, data structures, design decisions)
4. Flag obsolete docs (old architecture, removed features)
5. Recommend relocation to `C:\Working With AI\ai_sam\history files at workflow transition timeline\`

**DO NOT delete anything** - just flag for user approval

**Output**:
- Curated insights (relevant docs consolidated)
- Obsolete docs list (for relocation)

---

### Phase 6: HTML Bible Generation
**Goal**: Create workflow_bible.html with visual hierarchy (upside-down org chart style)

**File Location**: `C:\Working With AI\ai_sam\ai_sam\ai_sam_introduction\workflow_bible.html`

**Structure**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AI Sam Workflows - System Bible (Post-93% Reduction)</title>
    <style>
        /* Visual hierarchy styles */
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 1400px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; }
        h2 { color: #34495e; margin-top: 40px; }
        .collapsible { cursor: pointer; background: #ecf0f1; padding: 10px; border-radius: 5px; }
        .collapsible:hover { background: #d5dbdb; }
        .content { display: none; padding: 15px; border-left: 3px solid #3498db; margin-left: 10px; }
        .content.active { display: block; }

        /* Breakpoint severity colors */
        .critical-breakpoint { background: #e74c3c; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .high-breakpoint { background: #e67e22; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .medium-breakpoint { background: #f39c12; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .low-breakpoint { background: #27ae60; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }

        /* Flow visualization */
        .flow-step { margin: 15px 0; padding: 15px; background: #ecf0f1; border-left: 5px solid #3498db; }
        .layer-1 { border-left-color: #3498db; } /* Blue - UI */
        .layer-2 { border-left-color: #9b59b6; } /* Purple - MVP Server */
        .layer-3 { border-left-color: #1abc9c; } /* Teal - Data */

        code { background: #2c3e50; color: #ecf0f1; padding: 2px 6px; border-radius: 3px; }
        pre { background: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
    <script>
        // Collapsible sections
        function toggleSection(element) {
            element.classList.toggle("active");
            var content = element.nextElementSibling;
            content.classList.toggle("active");
        }
    </script>
</head>
<body>
    <h1>🛠️ AI Sam Workflows - System Bible</h1>
    <p><strong>Mission</strong>: Prevent debug hell after 93% code reduction</p>
    <p><strong>Created</strong>: [Date]</p>
    <p><strong>Status</strong>: Post-reinstall due diligence (CRITICAL)</p>

    <nav>
        <h2>Quick Navigation</h2>
        <ul>
            <li><a href="#overview">Architecture Overview</a></li>
            <li><a href="#features">Complete Feature Inventory</a></li>
            <li><a href="#critical">CRITICAL Breakpoints</a></li>
            <li><a href="#flows">Feature Flows (Upside-Down Org Charts)</a></li>
            <li><a href="#testing">Testing Checklist</a></li>
        </ul>
    </nav>

    <section id="overview">
        <h2>📐 Three-Layer Architecture (NEW)</h2>
        [Architecture diagram, layer descriptions, file locations]
    </section>

    <section id="features">
        <h2>🎯 Complete Feature Inventory</h2>
        [ALL features categorized by priority]
    </section>

    <section id="critical">
        <h2>🚨 CRITICAL Breakpoints (Fix First!)</h2>
        [Top priority breakpoints with testing hints]
    </section>

    <section id="flows">
        <h2>🔄 Feature Flows (Top-Down Mapping)</h2>

        <div class="collapsible" onclick="toggleSection(this)">
            <h3>▶ Add Node Flow (CRITICAL)</h3>
        </div>
        <div class="content">
            <div class="flow-step layer-1">
                <h4>Layer 1: User Interface</h4>
                <p><strong>User Action:</strong> Click +Node button</p>
                <p><strong>File:</strong> <code>ai_sam_workflows/views/menu.xml</code></p>
                <p><strong>Code:</strong> <code>&lt;button action="add_node_action"/&gt;</code></p>
                <p><strong>Triggers:</strong> JavaScript <code>addNode()</code> function</p>
            </div>

            <div class="flow-step layer-2 critical-breakpoint">
                <h4>Layer 2: MVP Server - API Call</h4>
                <p><strong>(CRITICAL BREAKPOINT)</strong></p>
                <p><strong>Expected:</strong> POST /api/node/create</p>
                <p><strong>Issue:</strong> Old overlay expects direct model access, NEW architecture requires API</p>
                <p><strong>Testing:</strong></p>
                <ol>
                    <li>Click +Node button</li>
                    <li>Open browser console (F12)</li>
                    <li>Check for 404 error: /api/node/create</li>
                </ol>
                <p><strong>Expected Failure:</strong> Overlay fails to load OR loads but can't fetch node library</p>
                <p><strong>Quick Fix:</strong> Wire addNode() to new API endpoint (if endpoint exists in ai_sam)</p>
            </div>

            [More flow steps...]
        </div>

        [More feature flows...]
    </section>

    <section id="testing">
        <h2>✅ Testing Checklist (Proactive Debugging)</h2>
        [Prioritized testing sequence based on breakpoint severity]
    </section>
</body>
</html>
```

**Key Features**:
1. **Collapsible sections** (expand/collapse for readability)
2. **Color-coded breakpoints** (visual severity: red=critical, orange=high, yellow=medium, green=low)
3. **Upside-down org chart style** (drill-down flows)
4. **Dual audience** (human-readable narrative + agent-parseable structure)
5. **Quick navigation** (jump to critical sections)
6. **Testing checklists** (actionable debugging steps)

**Actions**:
1. Convert all Phase 1-5 outputs to HTML
2. Structure as collapsible sections
3. Add visual hierarchy (colors, indentation)
4. Include inline testing hints
5. Create quick navigation menu

**Output**: `workflow_bible.html` (complete, ready for use)

---

### Phase 7: Integration & Handover
**Goal**: Deliver Bible, update /mod_workflows, archive obsolete docs

**Actions**:
1. **Save workflow_bible.html** to `C:\Working With AI\ai_sam\ai_sam\ai_sam_introduction\`
2. **Update /mod_workflows startup**:
   - Add to knowledge files: `workflow_bible.html`
   - Update protocol: "Read workflow_bible.html FIRST on startup"
   - Remove/archive obsolete knowledge (if redundant with Bible)
3. **Present obsolete docs list** to user for approval
4. **Deliver testing checklist** (derived from critical breakpoints)
5. **Retire workflows-rescue agent** (one-time mission complete)

**Handoff to User**:
```markdown
## 🎁 Deliverables

1. **workflow_bible.html** - Complete system map with breakpoint markers
   - Location: C:\Working With AI\ai_sam\ai_sam\ai_sam_introduction\workflow_bible.html
   - Open in browser for visual hierarchy
   - Use as testing checklist

2. **Critical Breakpoints (Top Priority)**
   - [List top 5-10 critical breakpoints]
   - Test these FIRST before proceeding

3. **Obsolete Docs for Relocation**
   - [List files to move to history folder]
   - Approve before relocation

4. **Updated /mod_workflows Agent**
   - Now references workflow_bible.html on startup
   - Obsolete knowledge archived

5. **Estimated Debug Time Saved**
   - Without Bible: 2-4 weeks of reactive debugging
   - With Bible: 3-5 days of proactive testing
   - **Time saved: ~15-20 days** (75% reduction in debug pain)
```

**Output**: Mission complete, user equipped to prevent debug hell

---

## ✅ Success Criteria

Mission succeeds when:
- ✅ ALL user-facing functionality inventoried (100% coverage)
- ✅ Every feature mapped through 3 layers (complete flows)
- ✅ Breakpoints identified with testing hints
- ✅ workflow_bible.html created (visual hierarchy, collapsible)
- ✅ User has actionable testing checklist
- ✅ /mod_workflows updated to reference Bible
- ✅ **MOST IMPORTANT**: User avoids "horrendously long debug period"

Mission fails if:
- ❌ Features missed (incomplete inventory)
- ❌ Flows incomplete (missing layer transitions)
- ❌ Breakpoints not marked (reactive debugging still needed)
- ❌ HTML not visual/scannable (user can't navigate)
- ❌ User still enters debug hell (Bible didn't prevent pain)

---

## 🎯 Agent Mindset

**You are a RESCUE MISSION, not a documentation project.**

Your job is to:
- **Prevent suffering** (Anthony's words: "extreme pain and suffering")
- **Map danger zones** (breakpoints where code broke)
- **Provide survival guide** (testing checklist)
- **Visual clarity** (HTML hierarchy, not flat text)
- **Pixel-perfect attention** (metaphorical - fine detail critical)

**This is urgency-driven, thoroughness-required work.**

User said: "We are ready to take action immediately."
**You deliver survival, not just documentation.**

---

## 📊 Priority Ranking (If Time-Constrained)

If user needs partial delivery:

**Phase Priority**:
1. **Phase 1 (Functionality Inventory)** - MUST HAVE (know what to test)
2. **Phase 3 (Add Node Flow)** - MUST HAVE (most critical feature)
3. **Phase 4 (Critical Breakpoints)** - MUST HAVE (testing checklist)
4. **Phase 6 (HTML Bible - Critical sections)** - MUST HAVE (visual guide)
5. **Phase 2 (Architecture Mapping)** - NICE TO HAVE (context)
6. **Phase 5 (Documentation Archaeology)** - NICE TO HAVE (cleanup)
7. **Phase 7 (Integration)** - NICE TO HAVE (can do manually)

**Minimum Viable Rescue**: Phases 1, 3, 4, 6 (Critical sections only)

---

**Let's prevent debug hell. Start Phase 1 immediately.** 🚀
