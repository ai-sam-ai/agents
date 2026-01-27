# Canvas Core Guardian Agent

## Overview

**Agent Name:** `canvas-core-guardian`
**Purpose:** Architectural boundary enforcer and cleanup specialist
**Created:** 2025-10-10
**Status:** ✅ Ready for implementation

---

## Problem This Agent Solves

### The Pain Points

Your SAM AI V3 Odoo project suffers from:

1. **Naming Chaos** - Legacy "skeleton" references mixed with modern "canvas" naming
2. **Platform Bleeding** - Workflow code references Memory features, SAM code references N8N
3. **Code Bloat** - Platform-specific logic sneaking into universal canvas core
4. **Import Violations** - Platforms importing from sibling platforms (forbidden!)
5. **Component Duplication** - Same sidebar/toolbar code copied across platforms

### The Pattern

When developers (human or AI) work on canvas or platform code, they:
- Don't realize they're violating architectural boundaries
- Use legacy "skeleton" names because they see them in existing code
- Copy-paste from other platforms causing cross-contamination
- Add platform-specific logic to shared canvas core

### The Impact

This leads to:
- 🔴 Harder to maintain (confusion about where code belongs)
- 🔴 Code bloat (duplicated functionality)
- 🔴 Fragile architecture (changes break unexpected things)
- 🔴 Developer frustration (scanning code becomes overwhelming)

---

## What This Agent Does

### Core Responsibilities

1. **Boundary Enforcement** - Prevents platform code from entering canvas core
2. **Naming Cleanup** - Systematically renames "skeleton" → "canvas"
3. **Import Validation** - Catches cross-platform imports
4. **Duplication Detection** - Identifies shared code that should be extracted
5. **Architecture Adherence** - Enforces "ONE Core, MANY Skins" pattern

### The "ONE Core, MANY Skins" Pattern

```
┌─────────────────────────────────────────────────┐
│  PLATFORMS (Skins - Independent Siblings)       │
│  ├─ the_ai_automator (Workflow)                │
│  ├─ ai_sam_memory (Knowledge Graphs)           │
│  └─ ai_sam_messenger (SAM Creative)            │
├─────────────────────────────────────────────────┤
│  AI_SAM (Framework - Canvas Core)              │
│  ├─ Canvas Core (universal, platform-agnostic) │
│  └─ Platform Loader (dynamic renderers)        │
├─────────────────────────────────────────────────┤
│  AI_BRAIN (Data Layer - Foundation)            │
│  └─ 40+ models (pure data)                     │
└─────────────────────────────────────────────────┘
```

**Rules:**
- ✅ Canvas Core = Generic (works for ANY platform)
- ✅ Platforms = Specific (business logic, custom rendering)
- ❌ Canvas Core CANNOT have platform names or logic
- ❌ Platforms CANNOT import sibling platforms

---

## Agent Files

### 1. `agent.json` - Agent Configuration

Defines:
- Agent name and description
- Tools available (Read, Grep, Glob, Bash, Edit, Write, TodoWrite)
- Prompt files to load
- Model (sonnet) and color (red)

### 2. `canvas_core_rules.md` - Boundary Rules

Defines what IS and IS NOT allowed in canvas core:

**✅ Allowed:**
- Generic rendering (grid, zoom, pan, nodes, connections)
- Canvas lifecycle management
- Platform-agnostic utilities
- Event handling (generic)
- Shared UI base classes

**❌ Forbidden:**
- Platform names (n8n, workflow, memory, knowledge, poppy)
- Business logic (workflow execution, graph queries)
- Platform-specific styling
- Database queries (use ai_brain models instead)
- External API calls

### 3. `forbidden_patterns.md` - Anti-Patterns

Shows EXACTLY what to detect and fix:

1. **Platform Names in Core** - Hardcoded platform logic in canvas_engine.js
2. **Cross-Platform Imports** - Memory importing from Automator
3. **Legacy "Skeleton" Naming** - skeleton_canvas_engine.js instead of canvas_engine.js
4. **Duplicated Components** - Sidebar code copy-pasted across platforms
5. **Business Logic in Core** - Workflow execution in canvas rendering
6. **Platform CSS in Core** - .n8n-node styles in canvas_base.css

Each pattern includes:
- ❌ BAD example (what's wrong)
- ✅ GOOD example (how to fix)
- 🔍 Detection commands (grep patterns)
- 🛠️ Fix instructions (step-by-step)

### 4. `naming_standards.md` - Naming Conventions

Defines EXACT naming patterns:

**Files:**
- `canvas_engine.js` NOT `skeleton_canvas_engine.js`
- `canvas_controller.py` NOT `skeleton_canvas_controller.py`

**Classes:**
- `CanvasEngine` NOT `SkeletonCanvasEngine`
- `NodeManager` NOT `SkeletonNodeManager`

**Routes:**
- `/canvas/render` NOT `/skeleton/render`

**CSS:**
- `.canvas-container` NOT `.skeleton-container`

**Models:**
- `canvas.node` NOT `skeleton.node`

### 5. `agent_protocol.md` - Session Workflow

Defines how the agent operates:

**Phase 1: Analyze** (Read-Only)
- Scan for violations using grep
- Create TodoWrite task list
- Categorize by risk (low/medium/high)

**Phase 2: Report**
- Present findings clearly
- Show risk assessment
- Provide action plan

**Phase 3: Get Approval**
- For high-risk changes, ask user first

**Phase 4: Execute**
- Start with safest changes (comments)
- Progress to renames (files, classes)
- Finish with structural (imports, extraction)

**Phase 5: Validate**
- Run grep to verify violations fixed
- Check imports still work

**Phase 6: Final Report**
- Summary of changes
- Files modified
- Validation results

---

## How to Use This Agent

### For Agent Creators

**To implement this agent in Claude Code:**

1. **Copy the agent directory:**
   ```
   ${CLAUDE_AGENTS_DIR}\canvas-core-guardian\
   ```

2. **Agent should auto-register** (if Claude Code supports agent.json format)

3. **Test invocation:**
   ```
   User: "Run canvas-core-guardian to check canvas_engine.js"
   ```

4. **Verify it loads all 4 prompt files:**
   - canvas_core_rules.md
   - forbidden_patterns.md
   - naming_standards.md
   - agent_protocol.md

### For Developers Using This Agent

**Invoke when:**
- Working on canvas_core files
- Refactoring platform code
- Adding shared components
- Cleaning up architecture violations
- Reviewing pull requests

**Example invocations:**

```
User: "Run canvas-core-guardian to validate canvas_engine.js has no platform logic"

User: "Use canvas-core-guardian to rename all skeleton files to canvas"

User: "Check with canvas-core-guardian if this sidebar should be in canvas_core or platform"

User: "Run canvas-core-guardian to find all cross-platform imports"
```

**Do NOT use when:**
- Adding new platform features (use `odoo-developer`)
- Writing business logic (use `odoo-developer`)
- Planning architecture (use `architect`)
- Running QA audits (use `odoo-audit`)

---

## Integration with Existing Agents

### Agent Workflow

```
1. architect (planning)
   ↓ Creates cleanup strategy

2. canvas-core-guardian (boundary enforcement)
   ↓ Validates boundaries, renames files

3. odoo-developer (implementation)
   ↓ Implements features within boundaries

4. odoo-audit (quality review)
   ↓ Reviews code quality

5. git-push (automation)
   ↓ Commits and pushes
```

### Collaboration

**canvas-core-guardian + odoo-developer:**
- Guardian: "This code has platform logic, belongs in the_ai_automator"
- Developer: "Moving to platform folder"
- Guardian: "Verified - canvas core stays clean ✅"

**odoo-audit → canvas-core-guardian:**
- Audit: "Found boundary violations in canvas_engine.js"
- Guardian: "Investigating... extracting to platform"
- Audit: "Re-scan shows violations resolved ✅"

---

## Detection Commands (Quick Reference)

Run these to find violations:

```bash
# 1. Platform names in core
grep -rE "n8n|workflow|memory|knowledge|poppy|automator" ai_sam/static/src/canvas_core/

# 2. Skeleton references
grep -ri "skeleton" ai_sam/
find ai_sam/ -iname "*skeleton*"

# 3. Cross-platform imports
grep -r "from the_ai_automator" ai_sam_memory/
grep -r "from ai_sam_memory" the_ai_automator/

# 4. Duplicate code
find ai_sam/ -name "*sidebar*.js" -o -name "*toolbar*.js"

# 5. Business logic in core
grep -r "execute\|query\|save.*workflow" ai_sam/static/src/canvas_core/

# 6. Platform CSS in core
grep -rE "\.n8n-|\.workflow-|\.memory-" ai_sam/static/src/css/canvas_base.css
```

---

## Expected Outcomes

### After Using This Agent

✅ **Zero "skeleton" references** in codebase
✅ **Zero platform names** in canvas_core files
✅ **Zero cross-platform imports** between platforms
✅ **Shared components** extracted to canvas_core base classes
✅ **File/folder structure** matches naming standards
✅ **Clear separation** between core (generic) and platforms (specific)

### Benefits

- 🟢 **Easier maintenance** - Clear boundaries, no confusion
- 🟢 **Reduced bloat** - Shared code extracted once
- 🟢 **Faster development** - Developers know exactly where code belongs
- 🟢 **Better AI assistance** - AI agents don't get confused by legacy names
- 🟢 **Scalable architecture** - Adding new platforms is clean

---

## Phased Cleanup Plan (Recommended)

If starting from scratch, use this approach:

### Phase 1: Audit (1 sprint - 2 hours)
**Goal:** Document current violations

**Tasks:**
1. Run detection commands
2. Create inventory of violations
3. Categorize by risk
4. Document target state

**Deliverable:** `CANVAS_CORE_CLEANUP_AUDIT.md`

### Phase 2: Create Canvas Core Structure (1 sprint - 3 hours)
**Goal:** Establish clean canvas_core/ folder

**Tasks:**
1. Create `ai_sam/static/src/canvas_core/` directory
2. Copy skeleton files → canvas_core with new names
3. Update internal references (remove "skeleton")
4. Keep old files temporarily (for backward compatibility)

**Deliverable:** Working canvas_core/ folder

### Phase 3: Migrate Platforms (3 sprints - 2 hours each)
**Goal:** Update each platform to use canvas_core

**Sprint 3A: Memory Platform**
- Update imports: skeleton → canvas_core
- Remove workflow/automator references
- Test memory platform

**Sprint 3B: Workflow Platform**
- Update imports: skeleton → canvas_core
- Remove memory references
- Test workflow platform

**Sprint 3C: SAM Creative Platform**
- Update imports: skeleton → canvas_core
- Remove cross-platform refs
- Test SAM platform

### Phase 4: Delete Legacy (1 sprint - 1 hour)
**Goal:** Remove old skeleton files

**Tasks:**
1. Verify all platforms using canvas_core
2. Delete skeleton_* files
3. Run full test suite

### Phase 5: Extract Shared Components (1 sprint - 3 hours)
**Goal:** Extract duplicated sidebars/toolbars

**Tasks:**
1. Create generic sidebar.js in canvas_core
2. Update platform sidebars to extend generic
3. Remove duplicated code

---

## Success Metrics

Agent is successful when:

1. **Zero violations found** by detection commands
2. **Human can scan code** and instantly understand boundaries
3. **New platforms can be added** without modifying core
4. **Developer friction reduced** (clear where code belongs)
5. **Code reviews are faster** (boundaries are obvious)

---

## Maintenance

### When to Update This Agent

Update agent knowledge when:

1. **New platform added** - Add platform name to forbidden list
2. **Architecture evolves** - Update canvas_core_rules.md
3. **New anti-patterns discovered** - Add to forbidden_patterns.md
4. **Naming conventions change** - Update naming_standards.md

### Version History

- **v1.0** (2025-10-10) - Initial creation
  - Canvas core boundary rules
  - Skeleton → canvas naming standards
  - Cross-platform import detection
  - Duplication detection

---

## Contact & Support

**Created by:** Architect Agent (Claude Code)
**Date:** 2025-10-10
**Project:** SAM AI V3 Odoo
**Status:** Ready for implementation

**Questions?** Ask the `architect` agent for clarification or updates.

---

## Next Steps

**For you (the human):**

1. ✅ **Review this agent definition** - Does it match your needs?
2. ⏭️ **Test the agent** - Try invoking it on a sample file
3. ⏭️ **Run Phase 1 Audit** - Use agent to document current violations
4. ⏭️ **Execute cleanup plan** - Follow phased approach (sprints)
5. ⏭️ **Integrate into workflow** - Use agent for ongoing boundary enforcement

**Ready to proceed?**

Let me know if you want to:
- A) Adjust the agent design
- B) Create the Phase 1 Audit prompt
- C) Test the agent on a specific file
- D) Something else

---

## Files in This Directory

```
canvas-core-guardian/
├── README.md                   ← You are here
├── agent.json                  ← Agent configuration
├── canvas_core_rules.md        ← Boundary rules (what's allowed/forbidden)
├── forbidden_patterns.md       ← Anti-patterns with examples
├── naming_standards.md         ← Naming conventions
└── agent_protocol.md           ← Session workflow
```

**All files are ready for handover to Agent Creator.**
