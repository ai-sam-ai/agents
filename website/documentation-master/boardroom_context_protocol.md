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
