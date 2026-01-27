# documentation-master Knowledge Base

> Consolidated knowledge for the documentation-master Agent
> Source: documentation-master/
> Generated: 2026-01-28
>
> Original files:
> - boardroom_context_protocol.md
> - current_state_rules.md
> - docs_agent_workflow.md
> - documentation_intelligence.md
> - misalignment_detection.md

---

## 1. Boardroom Context Protocol

# Boardroom Context Protocol - Preventing Agent Naivety

## Mission

**Every boardroom agent (CTO, COS, CMO, etc.) MUST arrive informed, not naive**

---

## The Problem (Before `/docs`)

**Scenario:**
```
Anthony: "We need a CFO for budget planning"

CTO: "What's your current infrastructure?"  ← NAIVE (should already know)
CTO: "Do you have ai_sam_docs module?"      ← NAIVE (it exists!)
CTO: "How many modules do you have?"        ← NAIVE (should know: 14)
```

**Result:** Anthony wastes 10 minutes explaining what EXISTS

---

## The Solution (With `/docs`)

**Scenario:**
```
Anthony: "We need a CFO for budget planning"

CTO: [Auto-loads current_state.md]
CTO: "I see you have 14 modules, ai_sam_odoo entrypoint,
      23 models, 11 agents with 87K words knowledge.
      A CFO fits the boardroom (Advisor archetype).
      Budget allocation for which layer: marketing? development?"  ← INFORMED
```

**Result:** Anthony spends 0 minutes on context, straight to strategy

---

## Boardroom Startup Protocol

### Step 1: Auto-Load Current State

**EVERY boardroom agent starts with this:**

```python
# First action when invoked
current_state = read_file('ai_sam_docs/docs/current_state.md')

# Parse key facts
- Entrypoint: ai_sam_odoo
- Active modules: 14
- Total models: 23
- Total agents: 11
- Excluded paths: th_ai_automator, ai_sam_desktop, ai_sam_mobile
- Last updated: 2025-10-13 10:30
```

### Step 2: Validate Knowledge

**Checklist before responding:**
- [ ] Do I know current entrypoint? (ai_sam_odoo)
- [ ] Do I know active module count? (14)
- [ ] Do I know excluded modules? (3)
- [ ] Do I know schema size? (23 models)
- [ ] Do I know agent ecosystem? (11 agents)

If ANY unchecked → LOAD current_state.md FIRST

### Step 3: Use Context in Response

**✅ GOOD (Informed):**
```
"Based on your 14 active modules and ai_brain→ai_sam→branches architecture,
I recommend..."
```

**❌ BAD (Naive):**
```
"What modules do you have?"  ← Should already know
"Do you use ai_sam?"         ← Should already know
```

---

## What Every Boardroom Agent Must Know

### Core Facts (Loaded from current_state.md)

1. **Entrypoint:** `ai_sam_odoo` (MVP scope)
2. **Architecture:** ai_brain → ai_sam → branches
3. **Active Modules:** 14 modules
4. **Excluded Modules:** 3 (th_ai_automator, ai_sam_desktop, ai_sam_mobile)
5. **Schema:** 23 models across 6 modules
6. **Agents:** 11 agents, 87K+ words knowledge
7. **Status:** Pre-launch (T-14 days to MVP)

### Current State File Structure

```markdown
# SAM AI Current State

## MVP Scope
- Entrypoint: ai_sam_odoo
- Active Modules: 14
- Status: Pre-launch (2 weeks out)

## Architecture
ai_brain (foundation)
    ↓
ai_sam (framework)
    ↓
├─ ai_sam_memory (branch)
├─ the_ai_automator (branch)
└─ ai_sam_docs (tools)

## Excluded Paths
- th_ai_automator (moved/redundant)
- ai_sam_desktop (future)
- ai_sam_mobile (future)

## Agent Ecosystem
- 11 active agents
- 87,450 total knowledge words
- Boardroom: CTO, COS, CMO, Architect
- Operators: Developer, Debug, Audit, etc.

## Recent Changes
- ai_sam_memory: 18.0.1.2 → 18.0.1.3
- cmo agent: Rogue agent fixed (12K → 13K words)

## Anthony's Time = Most Valuable
- Only escalate: Critical blockers, architectural decisions
- All grunt work = AI handles
- Naivety = Failure
```

---

## Boardroom Agent Categories

### Strategic Advisors (Must Know Current State)

**CTO (Chief Technical Officer):**
- Needs: Infrastructure details, module count, schema size
- Uses: For capacity planning, scaling recommendations
- Loads: current_state.md + performance data

**COS (Chief of Staff):**
- Needs: Agent ecosystem, boardroom composition
- Uses: For agent creation decisions, team strategy
- Loads: current_state.md + agent registry

**CMO (Chief Marketing Officer):**
- Needs: Product maturity (module count, features)
- Uses: For go-to-market timing, positioning
- Loads: current_state.md + feature list

**CFO (Future - Budget Strategy):**
- Needs: Infrastructure costs, development velocity
- Uses: For budget allocation, ROI analysis
- Loads: current_state.md + cost data

### Execution Specialists (Load Selectively)

**Developer:**
- Loads: Architecture, active modules, schema
- Skips: Agent ecosystem details (not needed)

**Audit:**
- Loads: Active modules, quality standards
- Skips: Future state (only checks current)

---

## Auto-Load Implementation

### For Slash Commands

**Pattern:**
```markdown
---
description: CTO - Strategic infrastructure advisor
---

# Chief Technical Officer

## 📚 Your Knowledge Base
- [infrastructure_strategy.md](...)
- [current_state.md](${DOCS_ROOT}\current_state.md) ← AUTO-LOAD THIS

## Your Mission
[Auto-loads current_state.md before proceeding]

**Current State (Loaded):**
- Entrypoint: {entrypoint}
- Modules: {module_count}
- Schema: {model_count} models
- Agents: {agent_count} agents

Now you are INFORMED. Proceed with user request.

$ARGUMENTS
```

### For Task Tool Invocations

**Pattern:**
```python
# When invoking boardroom agent via Task tool
Task(
    subagent_type="cto",
    prompt=f"""
    CURRENT STATE (Auto-loaded):
    {read_file('current_state.md')}

    USER REQUEST:
    {user_question}

    Respond as CTO with full context awareness.
    """
)
```

---

## Preventing Naivety Checklist

### Before ANY Response

**Ask yourself:**
1. Do I know the entrypoint? (ai_sam_odoo)
2. Do I know module count? (14)
3. Do I know excluded paths? (3)
4. Do I know if this path/module is active?

If NO to any → **STOP, LOAD current_state.md FIRST**

### Red Flags (Naivety Detected)

**These phrases indicate naivety:**
- "What's your infrastructure?"
- "Do you have module X?"
- "How many modules?"
- "What's your architecture?"

**Fix:** Load current_state.md, THEN respond with knowledge

---

## Success Metrics

**Boardroom context loading succeeds when:**
- ✅ Agents arrive informed (0 naive questions)
- ✅ Anthony spends 0 time on "what exists" questions
- ✅ Responses reference current state facts
- ✅ Agents know what to IGNORE (excluded paths)

**Failure indicators:**
- ❌ Agent asks about module count
- ❌ Agent asks if X exists
- ❌ Agent unaware of exclusions
- ❌ Anthony has to explain current state

---

## Integration with `/docs`

**How `/docs` maintains boardroom readiness:**

1. **Discovers current state** (modules, schema, agents)
2. **Updates current_state.md** (latest facts)
3. **Pushes to GitHub** (team syncs)
4. **Validates boardroom** (all agents have latest)

**Result:** Next boardroom agent invocation = INFORMED ✅

---

## Emergency Override (When Context Missing)

**If current_state.md doesn't exist or is stale:**

```
1. Invoke /docs immediately
2. Wait for state update
3. Then proceed with boardroom agent
```

**Never proceed with stale context** - Anthony's time too valuable

---

**Remember:** Informed agents = Protected Anthony time = MVP success

---

## 2. Current State Rules

# Current State Rules - MVP Scope & Exclusions

## 🎯 Primary Mission

**Protect Anthony's time by maintaining TRUTH about current vs. future state**

---

## 📍 Current State (MVP - Pre-Launch)

### Single Entrypoint Rule

**TRUTH:** SAM AI ecosystem at `${SAMAI_ROOT}\` is THE ONLY scope for `/docs`

```
✅ CURRENT SCOPE (SAM AI Ecosystem):
${SAMAI_ROOT}\

✅ ACTIVE MODULES (inside above path):
- ai_brain (foundation - data layer)
- ai_sam (framework - SAM AI core)
- ai_sam_memory (branch - graph/vector memory)
- the_ai_automator (branch - N8N workflows)
- ai_sam_docs (tools - documentation)
- ai_poppy (branch - Poppy assistant)
- ai_odoo_blogger (branch - blogging)
- ai_toolbox (utilities)
- ... (6 more active modules)

❌ EXCLUDED MODULES:
- th_ai_automator (moved out - redundant)
- ai_sam_desktop (future - not MVP)
- ai_sam_mobile (future - not MVP)
```

---

## 🚫 Excluded Paths (DO NOT REFERENCE)

### Category 1: Moved/Redundant Modules

**Path:** `th_ai_automator`
**Status:** MOVED OUT (redundant)
**Reason:** Replaced by `the_ai_automator` inside ai_sam_odoo
**Agent Rule:** NEVER reference `th_ai_automator` - it's obsolete

**Path:** `uncertain_files`
**Status:** QUARANTINE
**Reason:** Deprecated/experimental files moved here
**Agent Rule:** IGNORE this folder - it's for cleanup only

---

### Category 2: Future State (Post-MVP)

**Path:** `ai_sam_desktop`
**Status:** EXISTS but NOT ACTIVE
**Reason:** Desktop app - post-MVP implementation
**Agent Rule:** IGNORE until Anthony activates (T+2 weeks post-launch)

**Path:** `ai_sam_mobile`
**Status:** EXISTS but NOT ACTIVE
**Reason:** Mobile app - future roadmap
**Agent Rule:** IGNORE until Anthony activates (T+4 weeks post-launch)

---

### Category 3: Build Artifacts (Always Exclude)

**Paths:**
- `__pycache__` (Python bytecode)
- `.git` (version control)
- `node_modules` (JS dependencies)
- `.pytest_cache` (test artifacts)

**Agent Rule:** Never scan or reference these folders

---

## 📋 Agent Reference Rules

### Rule 1: Module References (STRICT)

**✅ ALLOWED:**
```python
# Reference active modules only
- ai_brain
- ai_sam
- ai_sam_memory
- the_ai_automator (inside ai_sam_odoo)
- ai_sam_docs
```

**❌ FORBIDDEN:**
```python
# NEVER reference these
- th_ai_automator (moved/redundant)
- ai_sam_desktop (future)
- ai_sam_mobile (future)
- ai_base (deprecated - renamed to ai_brain)
- ai_trunk (deprecated - renamed to ai_sam)
```

---

### Rule 2: Documentation References

**✅ CORRECT:**
```markdown
For memory features, see [ai_sam_memory](${SAMAI_ROOT}\ai_sam_memory)
```

**❌ WRONG:**
```markdown
For automation, see [th_ai_automator](${SAMAI_ROOT}\the_ai_automator)  ← OBSOLETE PATH!
For desktop features, see [ai_sam_desktop](...)  ← FUTURE, NOT ACTIVE!
For Odoo dev work, see [custom-modules-v18](${USER_HOME}\Odoo Projects\custom-modules-v18)  ← NOT SAM ECOSYSTEM!
```

---

### Rule 3: Dependency Validation

**Before referencing ANY module, check:**

1. **Is it in `${SAMAI_ROOT}\`?**
   - YES → Probably active (verify manifest exists)
   - NO → STOP, it's excluded (wrong ecosystem)

2. **Is it in excluded list?**
   - YES → DO NOT REFERENCE
   - NO → Proceed to step 3

3. **Does `__manifest__.py` exist?**
   - YES → Active module, safe to reference
   - NO → Not a module, don't reference

---

## 🔄 Future State Transition (When Anthony Says)

### Activation Protocol

**When Anthony says:** "Activate ai_sam_desktop"

**What `/docs` does:**
1. Remove `ai_sam_desktop` from excluded list
2. Discover its modules (if any)
3. Learn its architecture
4. Update `current_state.md`
5. Notify boardroom: "ai_sam_desktop now ACTIVE"

**What agents do:**
- Start referencing ai_sam_desktop
- Include in analysis/recommendations
- Treat as part of current state

---

### Pre-Activation Rules (Current State)

**Until Anthony activates:**
- ai_sam_desktop = IGNORE
- ai_sam_mobile = IGNORE
- Any other future folder = IGNORE

**Why:** MVP focus. Anthony's time is most valuable. Future features distract from launch.

---

## 📊 Current vs. Future State Summary

| Path | Status | When Active | Agent Rule |
|------|--------|-------------|------------|
| `${SAMAI_ROOT}\` | ✅ ACTIVE | NOW (MVP) | /docs scans here |
| `${USER_HOME}\Odoo Projects\custom-modules-v18\` | ❌ OUT OF SCOPE | N/A | /docs NEVER scans here |
| `ai_sam_desktop` (inside SAM folder) | ⏸️ FUTURE | Post-MVP (T+2w) | Ignore for now |
| `ai_sam_mobile` (inside SAM folder) | ⏸️ FUTURE | Post-MVP (T+4w) | Ignore for now |
| `uncertain_files` | 🗑️ QUARANTINE | N/A | Never reference |

---

## 🎯 Agent Decision Tree

```
Agent needs to reference a module:
  ↓
Is it in ${SAMAI_ROOT}\?
  ├─ NO → STOP - Out of scope for /docs ❌
  │   (Example: custom-modules-v18 = not SAM ecosystem)
  └─ YES → Is it in excluded list?
      ├─ YES → DO NOT REFERENCE (moved/future)
      └─ NO → Does __manifest__.py exist?
          ├─ YES → SAFE TO REFERENCE ✅
          └─ NO → DO NOT REFERENCE (not a module)
```

---

## 🔥 Critical Rules (Never Break These)

1. **ONLY scan `${SAMAI_ROOT}\`** (SAM AI ecosystem)
2. **NEVER scan `${USER_HOME}\Odoo Projects\`** (separate dev environment)
3. **NEVER reference `th_ai_automator`** (moved/obsolete)
4. **IGNORE `ai_sam_desktop` and `ai_sam_mobile`** (future, not active)
5. **When uncertain, ASK `/docs` first** (not Anthony - protect his time)
6. **Use `__manifest__.py` as module validator** (if missing = not a module)

---

## 💡 Why These Rules Exist

**Problem:** Agents referenced moved/future modules → wasted Anthony's time with naive questions

**Solution:** Strict current state rules → agents only reference what's ACTUALLY active

**Result:** Anthony focuses on MVP completion, not explaining what exists vs. what doesn't

---

## 🚨 If You Violate These Rules

**What happens:**
- `/docs` detects wrong reference in next scan
- Flags as misalignment
- Auto-removes from agent knowledge (or reports to Anthony)
- Other agents load corrected state

**Prevention:** Before ANY module reference, validate against current_state.md

---

## ✅ Quick Validation Checklist

Before `/docs` scans any path:
- [ ] Is it `${SAMAI_ROOT}\`?
- [ ] Is it NOT `${USER_HOME}\Odoo Projects\`?

Before referencing any module:
- [ ] Is it inside `${SAMAI_ROOT}\`?
- [ ] Is it NOT in excluded list?
- [ ] Does `__manifest__.py` exist?
- [ ] Is it documented in `current_state.md`?

If all YES → SAFE TO REFERENCE ✅
If any NO → DO NOT REFERENCE ❌

---

**Remember:** Current state = MVP only. Future state = Anthony activates when ready.

---

## 3. Docs Agent Workflow

# `/docs` Agent Workflow - 7-Phase Process

## Overview

The Documentation Master executes a systematic 7-phase workflow to maintain SAM AI ecosystem truth and protect Anthony's time.

---

## Phase 1: DISCOVER (Learn Current State)

### Goal
Understand what EXISTS right now (modules, schema, agents, architecture)

### Actions
1. **Discover Modules** (Odoo-aware scanning)
   ```python
   modules = env['documentation.intelligence'].discover_modules()
   # Scans: ${SAMAI_ROOT}\
   # Returns: All modules with __manifest__.py in SAM ecosystem
   ```

2. **Learn Architecture** (dependency graph)
   ```python
   architecture = env['documentation.intelligence'].learn_architecture(modules)
   # Returns: ai_brain → ai_sam → branches
   ```

3. **Discover Schema** (models in each module)
   ```python
   schema = {}
   for module in modules:
       schema[module] = discover_schema(module['path'])
   # Returns: 23 models across 6 modules
   ```

4. **Discover Agents** (Claude agent ecosystem)
   ```python
   agents = env['documentation.intelligence'].discover_agents()
   # Returns: 11 agents, 87K+ words knowledge
   ```

### Output
```json
{
  "timestamp": "2025-10-13T10:30:00",
  "modules": 14,
  "models": 23,
  "agents": 11,
  "agent_words": 87450
}
```

**Duration:** 30-60 seconds

---

## Phase 2: DETECT (Find What Changed)

### Goal
Compare current state to previous state, identify changes

### Actions
1. **Load Previous State**
   ```python
   previous = load_state('ai_sam_docs/docs/last_known_state.json')
   ```

2. **Compare States**
   ```python
   changes = detect_changes(current, previous)
   # Detects: version changes, schema changes, agent updates
   ```

3. **Categorize Changes**
   - Module version bumps
   - Schema additions/removals
   - Agent knowledge updates
   - Architecture modifications

### Output
```json
{
  "modules_changed": [
    {"module": "ai_sam_memory", "from": "18.0.1.2", "to": "18.0.1.3"}
  ],
  "schema_changed": [
    {"module": "ai_sam_memory", "added": ["ai.memory.config"]}
  ],
  "agents_changed": [
    {"agent": "cmo", "prev_words": 12450, "curr_words": 13200}
  ]
}
```

**Duration:** 10-20 seconds

---

## Phase 3: MISALIGN (Detect Problems)

### Goal
Find misalignments that cause agent naivety or waste Anthony's time

### Actions
1. **Scan Agent Knowledge for Wrong References**
   ```python
   excluded = ['th_ai_automator', 'ai_sam_desktop', 'ai_sam_mobile']

   for agent in agents:
       for md_file in agent['knowledge_files']:
           if any(excluded_path in content for excluded_path in excluded):
               # MISALIGNMENT: Wrong module reference
               flag_for_removal(agent, md_file, excluded_path)
   ```

2. **Check File Locations**
   ```python
   # Example: index.html should be in static/src/
   if file == 'index.html' and 'static/src/' not in path:
       # MISALIGNMENT: File in wrong location
       flag_file(file, path, expected='static/src/')
   ```

3. **Detect Future State Leaks**
   ```python
   if os.path.exists('ai_sam_desktop'):
       # EXISTS but NOT ACTIVE (future)
       document_as_excluded('ai_sam_desktop', reason='Post-MVP')
   ```

### Output
```json
{
  "wrong_references": [
    {
      "agent": "developer",
      "file": "odoo_patterns.md",
      "wrong_reference": "th_ai_automator",
      "fix": "Remove reference (moved/redundant)"
    }
  ],
  "redundant_files": [
    {
      "file": "ai_sam_odoo/index.html",
      "issue": "Misaligned location",
      "suggestion": "Move to static/src/"
    }
  ],
  "future_leaks": [
    {
      "path": "ai_sam_desktop",
      "status": "EXISTS but NOT ACTIVE",
      "instruction": "Agents IGNORE until Anthony activates"
    }
  ]
}
```

**Duration:** 20-40 seconds

---

## Phase 4: CORRECT (Auto-Fix Safe Issues)

### Goal
Fix what CAN be fixed without Anthony's approval

### Actions
1. **Auto-Remove Wrong Module References** (SAFE)
   ```python
   for wrong_ref in misalignments['wrong_references']:
       # Remove lines mentioning excluded modules
       update_agent_knowledge(
           agent=wrong_ref['agent'],
           file=wrong_ref['file'],
           remove_text=wrong_ref['wrong_reference']
       )
       log_fix(f"Removed {wrong_ref['wrong_reference']} from {wrong_ref['file']}")
   ```

2. **Document Future State Exclusions** (SAFE)
   ```python
   for future_leak in misalignments['future_leaks']:
       update_file('ai_sam_docs/docs/excluded_paths.md', {
           'path': future_leak['path'],
           'reason': 'Future (post-MVP)',
           'instruction': 'Agents MUST ignore'
       })
   ```

3. **Flag for Anthony's Decision** (ESCALATE)
   ```python
   requires_anthony = []
   for redundant in misalignments['redundant_files']:
       # File moves/deletions need approval
       requires_anthony.append({
           'file': redundant['file'],
           'suggestion': redundant['suggestion'],
           'decision_needed': 'Move? Delete? Keep?'
       })
   ```

### Output
```markdown
AUTO-FIXES APPLIED ✅:
- Removed "th_ai_automator" from developer/odoo_patterns.md
- Documented ai_sam_desktop as EXCLUDED (future)
- Documented ai_sam_mobile as EXCLUDED (future)

REQUIRES ANTHONY'S DECISION ⚠️:
- ai_sam_odoo/index.html (misaligned)
  Suggestion: Move to static/src/ or delete
  Your call: [Keep/Move/Delete]?
```

**Duration:** 10-20 seconds

---

## Phase 5: UPDATE (Refresh Master Documentation)

### Goal
Update master documentation to reflect current state

### Actions
1. **Update current_state.md**
   ```python
   write_file('ai_sam_docs/docs/current_state.md', f"""
# SAM AI Current State

**Last Updated:** {datetime.now()}

## MVP Scope
- Entrypoint: ai_sam_odoo
- Active Modules: {len(active_modules)}
- Total Models: {total_models}
- Total Agents: {total_agents}

## Excluded Paths
{excluded_paths_list}

## Recent Changes
{changes_summary}

## Agent Rules
- ONLY reference modules in ai_sam_odoo/
- IGNORE: {', '.join(excluded)}
   """)
   ```

2. **Update module_architecture.md**
   ```python
   write_file('ai_sam_docs/docs/module_architecture.md', architecture_diagram)
   ```

3. **Update database_schema.md**
   ```python
   write_file('ai_sam_docs/docs/database_schema.md', schema_documentation)
   ```

4. **Update agent_registry.md**
   ```python
   write_file('ai_sam_docs/docs/agent_registry.md', agent_ecosystem_map)
   ```

### Output
```
Documentation updated:
✅ current_state.md (boardroom context)
✅ module_architecture.md (14 modules, dependency graph)
✅ database_schema.md (23 models)
✅ agent_registry.md (11 agents, 87K words)
```

**Duration:** 15-30 seconds

---

## Phase 6: REPORT (Ask for Push Approval)

### Goal
Report changes to Anthony and ask if push to GitHub is needed

### Actions
1. **Summarize Changes**
   ```python
   summary = f"""
   Documentation updated locally:
   - current_state.md (boardroom context)
   - module_architecture.md ({len(modules)} modules)
   - database_schema.md ({total_models} models)
   - agent_registry.md ({len(agents)} agents)

   Changes detected:
   - {len(changes['modules_changed'])} modules updated
   - {len(changes['schema_changed'])} schema changes
   - {len(changes['agents_changed'])} agent updates
   """
   ```

2. **Ask for Push Approval** (DO NOT AUTO-PUSH)
   ```python
   # CRITICAL: Never push automatically
   # Anthony decides when to push to GitHub

   print(summary)
   print("\n🚨 PUSH REQUIRED?")
   print("These docs are updated LOCALLY only.")
   print("To push to GitHub, run: /git-push")
   print("Or tell me: 'push docs to github'")
   ```

### Output
```
✅ Documentation updated LOCALLY

Files changed:
- ai_sam_docs/docs/current_state.md
- ai_sam_docs/docs/module_architecture.md
- ai_sam_docs/docs/database_schema.md
- ai_sam_docs/docs/agent_registry.md

🚨 PUSH TO GITHUB?
These changes are LOCAL only.

Options:
1. Run /git-push to commit and push
2. Tell me "push docs to github"
3. Leave local for now (manual push later)

Your call.
```

**Duration:** 2-3 seconds (no git operations)

---

## Phase 7: VALIDATE (Ensure Boardroom Readiness)

### Goal
Verify all boardroom agents can load current state

### Actions
1. **Test current_state.md Accessibility**
   ```python
   if not os.path.exists('ai_sam_docs/docs/current_state.md'):
       raise Error("Current state file missing!")
   ```

2. **Validate Content Completeness**
   ```python
   required_sections = [
       'Entrypoint',
       'Active Modules',
       'Excluded Paths',
       'Agent Ecosystem'
   ]

   for section in required_sections:
       if section not in current_state_content:
           raise Error(f"Missing section: {section}")
   ```

3. **Create Intelligence Report**
   ```python
   report = env['documentation.intelligence'].create({
       'name': f"Intelligence Analysis - {timestamp}",
       'total_modules': len(modules),
       'total_models': total_models,
       'total_agents': len(agents),
       'changes_detected': json.dumps(changes),
       'auto_fixes_applied': json.dumps(fixes),
       'requires_anthony': json.dumps(escalations)
   })
   ```

### Output
```
✅ Validation Complete

Boardroom Readiness:
- current_state.md exists: YES
- All required sections: YES
- Accessible to agents: YES
- GitHub sync: COMPLETE

Next boardroom agent will arrive INFORMED ✅

Intelligence Report ID: 42
View: /web#id=42&model=documentation.intelligence
```

**Duration:** 5-10 seconds

---

## Complete Workflow Summary

| Phase | Duration | Can Fail? | Output |
|-------|----------|-----------|--------|
| 1. Discover | 30-60s | ❌ No | Current state snapshot |
| 2. Detect | 10-20s | ❌ No | Changes identified |
| 3. Misalign | 20-40s | ❌ No | Problems found |
| 4. Correct | 10-20s | ⚠️ Partial | Auto-fixes + escalations |
| 5. Update | 15-30s | ❌ No | Docs refreshed |
| 6. Report | 2-3s | ❌ No | Ask push approval |
| 7. Validate | 5-10s | ⚠️ Yes | Readiness confirmed |

**Total Duration:** ~2-3 minutes

**Success Rate:** 100% (no automatic git operations)

---

## Invocation Methods

### Manual Trigger (User Invokes)
```
/docs
```

### Scheduled Trigger (Daily Cron)
```python
# Run every morning at 8 AM
@cron('0 8 * * *')
def run_daily_intelligence():
    env['documentation.intelligence'].run_intelligence_analysis()
```

### Event-Driven Trigger (On Change)
```python
# After module upgrade
@on_module_upgrade
def run_post_upgrade_intelligence():
    env['documentation.intelligence'].run_intelligence_analysis()
```

---

## Error Handling

### If Phase Fails

**Phase 1-3 Failure (Discovery/Detection):**
- Log error
- Use previous state
- Notify Anthony

**Phase 4 Failure (Correction):**
- Skip auto-fixes
- Escalate all to Anthony
- Continue to Phase 5

**Phase 6 Failure (Git Push):**
- Save changes locally
- Retry push (3 attempts)
- Alert Anthony if all fail

**Phase 7 Failure (Validation):**
- Rollback changes
- Use previous state
- Alert Anthony

---

## Success Criteria

**`/docs` workflow succeeds when:**
- ✅ Discovers all active modules (14)
- ✅ Detects changes since last run
- ✅ Identifies misalignments (0-5 typical)
- ✅ Auto-fixes >80% of issues
- ✅ Updates all master docs
- ✅ Pushes to GitHub successfully
- ✅ Boardroom agents load current state

**Failure indicators:**
- ❌ Missing modules in discovery
- ❌ Misalignments not detected
- ❌ Auto-fixes fail
- ❌ Docs not updated
- ❌ Git push fails
- ❌ Boardroom agents still naive

---

## Integration with Ecosystem

**Before `/docs` existed:**
- Agents naive about infrastructure
- Anthony wasted time explaining
- Documentation stale
- No change tracking

**After `/docs` runs:**
- Agents arrive informed
- Anthony's time protected
- Documentation current
- Changes tracked automatically

---

**Result:** SAM AI ecosystem maintains TRUTH, Anthony focuses on MVP ✅

---

## 4. Documentation Intelligence

# Documentation Intelligence - How She Learns

## Overview

The `/docs` agent learns SAM AI's structure **dynamically** like Odoo does - not through hard-coded rules, but by discovering what exists and understanding relationships.

**Core Philosophy:** "Learn structure like Odoo recognizes modules"

---

## 🎯 Scope Boundaries (CRITICAL)

### What /docs DOES Scan:

✅ **SAM AI Ecosystem ONLY:**
```
${SAMAI_ROOT}\
```
- Contains: ai_brain (04-samai-brain), ai_sam (05-samai-core), and all other SAM AI modules
- All SAM-related Odoo modules across github repositories
- The ONE source of truth for SAM AI structure

✅ **Claude Agent Ecosystem:**
```
${CLAUDE_AGENTS_DIR}\
```
- Your boardroom (CTO, CMO, COS, etc.)
- Your operators (developer, session-start, etc.)

---

### What /docs DOES NOT Scan:

❌ **Other Odoo Folders:**
```
${USER_HOME}\Odoo Projects\custom-modules-v18\
```
- This is your **day-to-day dev environment**
- NOT part of SAM AI ecosystem documentation
- Agents should NEVER reference this path

❌ **Any other folders** outside the two paths above

---

**Result:** `/docs` maintains truth about SAM AI ecosystem ONLY. No pollution from dev environments.

---

## 🔍 Module Discovery (Odoo-Aware)

### Base Path (SAM AI Ecosystem ONLY)

**CRITICAL:** `/docs` ONLY scans this path:
```
${SAMAI_ROOT}\
```

**Why This Path:**
- This is the SAM AI ecosystem folder
- Contains all SAM modules (ai_brain, ai_sam, ai_sam_memory, etc.)
- Does NOT include `${USER_HOME}\Odoo Projects\custom-modules-v18\` (separate dev environment)

**Excluded from Scanning:**
- `${USER_HOME}\Odoo Projects\` (not SAM ecosystem)
- Any other folders outside `${SAMAI_ROOT}\`

---

### How Odoo Recognizes a Module

**Rule:** A folder is an Odoo module **IF AND ONLY IF** it contains `__manifest__.py`

```python
def discover_modules():
    """Scan for Odoo modules in SAM AI ecosystem ONLY"""
    base_path = r'C:\Working With AI\ai_sam\ai_sam'  # ← HARDCODED: SAM ecosystem only
    modules = []

    for folder in os.listdir(base_path):
        folder_path = os.path.join(base_path, folder)
        manifest_path = os.path.join(folder_path, '__manifest__.py')

        if os.path.isdir(folder_path) and os.path.exists(manifest_path):
            # This IS an Odoo module
            modules.append({
                'name': folder,
                'path': folder_path,
                'manifest': manifest_path
            })

    return modules
```

**What She Discovers:**
- Module name (folder name)
- Module path (absolute path)
- Manifest file (for reading metadata)

**Example Output:**
```
Discovered 14 Odoo modules:
✅ ai_brain (foundation)
✅ ai_sam (framework)
✅ ai_sam_memory (branch)
✅ the_ai_automator (branch)
✅ ai_sam_docs (tools)
... (9 more)
```

---

## 🏗️ Architecture Learning (Dependency Analysis)

### Reading __manifest__.py for Dependencies

```python
def learn_architecture(modules):
    """Build dependency graph from manifests"""
    architecture = {}

    for module in modules:
        with open(module['manifest'], 'r') as f:
            content = f.read()

        # Extract version
        version = re.search(r"'version':\s*'([^']+)'", content).group(1)

        # Extract dependencies
        depends = re.findall(r"'depends':\s*\[(.*?)\]", content, re.DOTALL)
        deps = re.findall(r"['\"]([^'\"]+)['\"]", depends[0]) if depends else []

        architecture[module['name']] = {
            'version': version,
            'depends': deps
        }

    return architecture
```

**What She Learns:**
1. **Module versions** (18.0.x.y format)
2. **Dependency tree** (which modules depend on which)
3. **Architecture layers:**
   - **Foundation:** `ai_brain` (depends on base, mail)
   - **Framework:** `ai_sam` (depends on ai_brain)
   - **Branches:** `ai_sam_memory`, `the_ai_automator` (depend on foundation)

**Example Output:**
```json
{
  "ai_brain": {
    "version": "18.0.1.0.0",
    "depends": ["base", "mail"]
  },
  "ai_sam": {
    "version": "18.0.2.1.0",
    "depends": ["ai_brain", "web"]
  },
  "ai_sam_memory": {
    "version": "18.0.1.3.0",
    "depends": ["ai_brain", "ai_sam"]
  }
}
```

**Architecture Insight:**
```
ai_brain (foundation)
    ↓
ai_sam (framework)
    ↓
├─ ai_sam_memory (branch)
├─ the_ai_automator (branch)
└─ ai_sam_docs (tools)
```

---

## 🗄️ Schema Discovery (Model Scanning)

### Finding Odoo Models in models/*.py

```python
def discover_schema(module_path):
    """Scan for Odoo model definitions"""
    models = []
    models_dir = os.path.join(module_path, 'models')

    if os.path.exists(models_dir):
        for py_file in Path(models_dir).rglob('*.py'):
            content = read_file(py_file)

            # Extract model names: _name = 'model.name'
            model_names = re.findall(r"_name\s*=\s*['\"]([^'\"]+)['\"]", content)
            models.extend(model_names)

    return models
```

**Pattern Detected:**
```python
class AIConversation(models.Model):
    _name = 'ai.conversation'  # ← She finds this
    _description = 'AI Conversation'
```

**What She Discovers:**
- Model technical name (`ai.conversation`)
- Which module defines it (`ai_brain/models/ai_conversation.py`)
- Total model count per module

**Example Output:**
```
Schema discovered:
- ai_brain: 3 models (ai.conversation, ai.message, ai.token.usage)
- ai_sam: 5 models (ai.service, ai.context.builder, ...)
- ai_sam_memory: 4 models (ai.graph.service, ai.vector.service, ...)
Total: 23 models across 6 modules
```

---

## 🤖 Agent Discovery (Claude Agent Detection)

### Agent Path (Your Boardroom & Operators)

**CRITICAL:** `/docs` scans Claude agents from:
```
${CLAUDE_AGENTS_DIR}\
```

**This is YOUR agent ecosystem** (boardroom + operators).

---

### Finding Claude Agents in .claude/agents/

```python
def discover_agents():
    """Find all Claude agents"""
    agents_path = os.path.expandvars(r'${CLAUDE_AGENTS_DIR}')  # ← Your Claude agent directory
    agents = []

    for agent_folder in os.listdir(agents_path):
        agent_path = os.path.join(agents_path, agent_folder)

        # Check for agent.json (agent marker)
        agent_json = os.path.join(agent_path, 'agent.json')
        if os.path.exists(agent_json) and os.path.isdir(agent_path):
            # Count knowledge files
            md_files = list(Path(agent_path).glob('*.md'))

            # Count total words
            total_words = sum(
                len(read_file(f).split()) for f in md_files
            )

            agents.append({
                'name': agent_folder,
                'knowledge_files': len(md_files),
                'total_words': total_words
            })

    return agents
```

**What She Discovers:**
- Agent name (folder name)
- Knowledge file count (*.md files)
- Total word count (depth of knowledge)

**Example Output:**
```
Agents discovered:
- cmo (5 files, 12,450 words)
- developer (7 files, 16,230 words) ← The beast!
- cto (5 files, 8,900 words)
- cos (6 files, 14,100 words)
- documentation-master (5 files, 8,500 words) ← Herself!

Total: 11 agents, 87,450 words of knowledge
```

---

## 📊 Change Detection (What Changed Since Last Run)

### Comparing States

```python
def detect_changes(current_state, previous_state):
    """Compare current vs. previous state"""
    changes = {
        'modules_changed': [],
        'schema_changed': [],
        'agents_changed': []
    }

    # Module version changes
    for module in current_state['architecture']:
        prev_version = previous_state['architecture'].get(module, {}).get('version')
        curr_version = current_state['architecture'][module]['version']

        if prev_version != curr_version:
            changes['modules_changed'].append({
                'module': module,
                'from': prev_version,
                'to': curr_version
            })

    # Schema changes (model additions/removals)
    for module in current_state['schema']:
        prev_models = set(previous_state['schema'].get(module, []))
        curr_models = set(current_state['schema'][module])

        if prev_models != curr_models:
            changes['schema_changed'].append({
                'module': module,
                'added': list(curr_models - prev_models),
                'removed': list(prev_models - curr_models)
            })

    # Agent knowledge changes
    prev_agents = {a['name']: a for a in previous_state.get('agents', [])}
    curr_agents = {a['name']: a for a in current_state['agents']}

    for agent_name in curr_agents:
        if agent_name in prev_agents:
            if curr_agents[agent_name]['total_words'] != prev_agents[agent_name]['total_words']:
                changes['agents_changed'].append(agent_name)

    return changes
```

**Example Output:**
```
Changes detected since last run:

Modules:
✅ ai_sam_memory: 18.0.1.2 → 18.0.1.3

Schema:
✅ ai_sam_memory: Added model 'ai.memory.config'

Agents:
✅ cmo: 12,450 → 13,200 words (rogue agent fix)
✅ developer: 16,230 → 16,780 words (new patterns added)
```

---

## 💾 State Persistence (Remembering for Next Time)

### Saving Current State

```python
def save_current_state(state):
    """Save to ai_sam_docs/docs/last_known_state.json"""
    state_file = 'ai_sam_docs/docs/last_known_state.json'

    with open(state_file, 'w') as f:
        json.dump(state, f, indent=2)
```

**What's Saved:**
```json
{
  "timestamp": "2025-10-13T10:30:00",
  "entrypoint": "ai_sam_odoo",
  "architecture": { ... },
  "schema": { ... },
  "agents": [ ... ],
  "excluded_paths": [ ... ]
}
```

**Why This Matters:**
- Next run knows what changed
- Detects drift over time
- Tracks evolution of SAM AI ecosystem

---

## 🎯 Intelligence Summary

### What She Knows After One Run:

1. **Modules:** 14 discovered, ai_brain → ai_sam → branches
2. **Schema:** 23 models across 6 modules
3. **Agents:** 11 agents, 87K+ words of knowledge
4. **Changes:** 2 module updates, 1 schema change, 2 agent updates
5. **Architecture:** Foundation → Framework → Branches pattern

### How She Uses This Knowledge:

- **Boardroom Context:** Every agent knows current state
- **Misalignment Detection:** Finds wrong module references
- **Documentation Updates:** Auto-updates master docs
- **Anthony's Time Protection:** Prevents naive questions

---

## 🔄 Continuous Learning

Every time `/docs` runs:
1. Discovers current state (modules, schema, agents)
2. Compares to previous state (detects changes)
3. Updates master documentation (keeps truth current)
4. Pushes to GitHub (team gets latest)
5. Saves state for next run (continuous learning)

**Result:** SAM AI ecosystem truth is ALWAYS current ✅

---

## 5. Misalignment Detection

# Misalignment Detection & Auto-Correction

## What Are Misalignments?

**Misalignments** = Things that waste Anthony's time by causing agent naivety or errors

### 3 Types of Misalignments

1. **Wrong Module References** - Agents cite moved/future modules
2. **Redundant Files** - Files in wrong locations (e.g., index.html misplaced)
3. **Future State Leaks** - Folders exist but shouldn't be touched yet

---

## Type 1: Wrong Module References

### Detection Pattern

Scan agent knowledge files (`*.md`) for excluded module names:

```python
excluded = ['th_ai_automator', 'ai_sam_desktop', 'ai_sam_mobile']

for agent in agents:
    for md_file in agent['knowledge_files']:
        content = read_file(md_file)

        for excluded_module in excluded:
            if excluded_module in content:
                # MISALIGNMENT FOUND
                flag_for_removal(agent, md_file, excluded_module)
```

### Examples

**❌ Wrong Reference Detected:**
```
Agent: developer
File: odoo_patterns.md
Line 42: "For automation, see th_ai_automator module"
Issue: References MOVED module (obsolete)
Fix: Remove all references to th_ai_automator
```

**✅ Auto-Correction:**
- Remove lines mentioning `th_ai_automator`
- Update agent knowledge file
- Log fix applied

---

## Type 2: Redundant Files

### Detection Pattern

Check for files in wrong locations:

```python
# Rule: index.html should be in static/src/
for root, dirs, files in os.walk(base_path):
    for file in files:
        if file == 'index.html':
            if 'static/src/' not in root:
                # MISALIGNMENT: Wrong location
                flag_file(file, root, expected='static/src/')
```

### Examples

**❌ Misaligned File:**
```
File: ai_sam_odoo/index.html
Issue: Located in module root (should be static/src/)
Suggestion: Move to ai_sam_odoo/static/src/index.html
Decision Needed: Anthony (move? delete? keep?)
```

**⚠️ Escalation:**
- File moves require Anthony's approval
- Report findings, don't auto-fix
- Provide clear suggestion

---

## Type 3: Future State Leaks

### Detection Pattern

Folders that exist but aren't active:

```python
future_folders = ['ai_sam_desktop', 'ai_sam_mobile']

for folder in future_folders:
    if os.path.exists(os.path.join(base_path, folder)):
        # EXISTS but NOT ACTIVE
        document_as_excluded(folder, reason='Future, post-MVP')
```

### Examples

**⚠️ Future Leak Detected:**
```
Path: ai_sam_desktop/
Status: EXISTS but NOT ACTIVE
Reason: Desktop app (future implementation)
Agent Instruction: IGNORE this path until Anthony activates
```

**✅ Auto-Documentation:**
- Add to `excluded_paths.md`
- Update `current_state.md` with exclusion
- Notify boardroom agents

---

## Auto-Correction Logic

### Decision Tree

```
Misalignment detected:
  ↓
Type 1: Wrong module reference?
  ├─ YES → Auto-remove from agent knowledge ✅
  └─ NO → Type 2: Redundant file?
      ├─ YES → Report to Anthony (needs approval) ⚠️
      └─ NO → Type 3: Future leak?
          └─ YES → Document as excluded ✅
```

### Auto-Fix Rules

**Safe to auto-fix (no approval needed):**
- Remove wrong module references from agent knowledge
- Document future paths as excluded
- Update `current_state.md` with exclusions

**Requires Anthony's approval:**
- Move files to different locations
- Delete files entirely
- Structural changes to modules

---

## Detection Commands

### Scan Agent Knowledge for Wrong References

```bash
# Find all references to excluded modules in agent knowledge
grep -r "th_ai_automator" ~/.claude/agents/*/\*.md
grep -r "ai_sam_desktop" ~/.claude/agents/*/\*.md
grep -r "ai_sam_mobile" ~/.claude/agents/*/\*.md
```

### Find Misaligned Files

```bash
# Find index.html files NOT in static/src/
find ai_sam_odoo -name "index.html" ! -path "*/static/src/*"
```

### Check Future State Leaks

```bash
# Check if future folders exist
ls -d ai_sam_desktop ai_sam_mobile 2>/dev/null
```

---

## Reporting to Anthony

### Format

```markdown
## Misalignments Detected

### AUTO-FIXED ✅
- Removed "th_ai_automator" from developer/odoo_patterns.md
- Documented ai_sam_desktop as EXCLUDED (future)

### REQUIRES YOUR DECISION ⚠️
- ai_sam_odoo/index.html (misaligned location)
  Suggestion: Move to static/src/ or delete
  Your call: [Keep/Move/Delete]?
```

### Escalation Criteria

**Escalate to Anthony when:**
- File moves/deletions needed
- Structural changes required
- Ambiguous cases (unclear if future/redundant)
- Breaking changes potential

**Do NOT escalate when:**
- Simple reference removal (auto-fix)
- Documentation updates (auto-fix)
- Exclusion documentation (auto-fix)

---

## Prevention Strategies

### 1. Boardroom Context Loading

Every agent reads `current_state.md` on startup:
- Knows excluded paths
- Won't reference wrong modules
- Prevention > Correction

### 2. Validation Before Reference

Agent decision tree:
```
Before referencing module X:
  1. Check: Is X in current_state.md active list?
  2. If NO → Check: Is X in excluded list?
  3. If YES (excluded) → DO NOT REFERENCE
```

### 3. Continuous Scanning

`/docs` runs daily (or on-demand):
- Detects new misalignments
- Auto-corrects safe issues
- Reports urgent items to Anthony

---

## Success Criteria

**Misalignment detection succeeds when:**
- ✅ Agents stop referencing moved/future modules
- ✅ Anthony isn't asked about non-existent paths
- ✅ Boardroom arrives with current state knowledge
- ✅ Auto-fixes > Manual fixes (>80% auto-corrected)

**Failure indicators:**
- ❌ Agents still reference `th_ai_automator`
- ❌ Anthony asked "does X exist?" repeatedly
- ❌ Naivety persists despite `/docs` running

---

## Integration with QA Tool

**Synergy with `ai_sam_development_qa.py`:**

QA tool detects:
- Code issues (syntax, patterns)
- Manifest problems (dependencies)
- Security violations

`/docs` detects:
- Wrong module references in agent knowledge
- Structural misalignments (file locations)
- Future state confusion

**Together:** Complete ecosystem health monitoring

---

*End of Knowledge Base*
