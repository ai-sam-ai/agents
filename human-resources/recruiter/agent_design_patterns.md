# Agent Design Patterns (Learned from Our Session)

## What We Discovered: The Agent Archetypes

### Pattern 1: The Advisor (No Code, Just Wisdom)
**Example:** `/architect`

**Characteristics:**
- ❌ Does NOT write production code
- ✅ Asks questions, explores solutions
- ✅ Creates plans and prompts for others
- ✅ Thinks strategically, not tactically

**Tools Needed:** Read, Grep, Glob, Write (for saving plans)

**When to Use This Pattern:**
- User has vague problem, needs clarification
- Multiple solution approaches possible
- Planning before implementation
- Creating handoff documents

**Knowledge Files Needed:**
- Planning methodology
- Brainstorming frameworks
- Prompt writing guides
- Domain patterns (Odoo, canvas, etc.)

---

### Pattern 2: The Implementation Specialist
**Example:** `/developer`

**Characteristics:**
- ✅ Writes production code
- ✅ Follows established patterns
- ✅ Validates work before handover
- ✅ Excellence-driven, not "good enough"

**Tools Needed:** Bash, Read, Grep, Glob, Write, Edit, TodoWrite

**When to Use This Pattern:**
- Clear requirements exist
- User needs feature built
- Standards must be followed
- Quality validation required

**Knowledge Files Needed:**
- Development standards
- Architecture mastery
- Quality integration (QA tools)
- File management rules

---

### Pattern 3: The Quality Gatekeeper
**Example:** `odoo-audit`, `/check-core`

**Characteristics:**
- ✅ Analyzes code against standards
- ✅ Detects violations and anti-patterns
- ✅ Scores quality objectively
- ✅ Provides actionable feedback

**Tools Needed:** Read, Grep, Glob, Bash (read-only), Write (reports)

**When to Use This Pattern:**
- Code needs review before commit
- Architectural boundaries must be enforced
- Standards compliance verification
- Identifying improvement opportunities

**Knowledge Files Needed:**
- Quality standards/rubrics
- Anti-patterns catalog
- Detection commands
- Scoring methodology

---

### Pattern 4: The Automation Specialist
**Example:** `/git-push`

**Characteristics:**
- ✅ Automates repetitive workflows
- ✅ Follows established patterns
- ✅ Handles mundane tasks
- ✅ Learns from past sessions

**Tools Needed:** Bash, Read, Grep, Write

**When to Use This Pattern:**
- User repeats same task frequently
- Manual steps cause errors
- Workflow is well-defined
- Consistency is critical

**Knowledge Files Needed:**
- Workflow patterns (from history)
- Command templates
- Error handling strategies
- Configuration details

---

### Pattern 5: The Boundary Enforcer
**Example:** `/check-core` (canvas-core-guardian)

**Characteristics:**
- ✅ Enforces architectural rules
- ✅ Detects violations proactively
- ✅ Cleans up legacy issues
- ✅ Prevents architectural drift

**Tools Needed:** Read, Grep, Glob, Bash, Edit, Write, TodoWrite

**When to Use This Pattern:**
- Architecture has clear boundaries
- Cross-contamination is a risk
- Legacy naming causes confusion
- Structural integrity matters

**Knowledge Files Needed:**
- Boundary rules (what's allowed/forbidden)
- Forbidden patterns (anti-patterns)
- Naming standards
- Detection/cleanup workflows

---

## Agent Anatomy (What Every Agent Needs)

### 1. agent.json (Configuration)
```json
{
  "name": "agent-name",
  "description": "What this agent does + when to use it",
  "tools": ["Read", "Write", ...],
  "promptFiles": ["file1.md", "file2.md"],
  "model": "sonnet",
  "color": "blue"
}
```

**Color Meanings (Observed Pattern):**
- 🔵 Blue = Audit/Analysis (odoo-audit)
- 🟢 Green = Implementation (odoo-developer)
- 🟡 Yellow = Planning (architect)
- 🟣 Purple = Automation (git-push)
- 🔴 Red = Enforcement (canvas-core-guardian)
- 🔷 Cyan = Meta/Support (recruiter)

---

### 2. Knowledge Files (4-5 files typical)

**File 1: Domain Knowledge**
- What the agent needs to know about the subject matter
- Patterns, rules, standards
- Examples: `architecture_mastery.md`, `canvas_core_rules.md`

**File 2: Methodology**
- HOW the agent operates
- Workflow, decision trees
- Examples: `planning_methodology.md`, `agent_protocol.md`

**File 3: Reference Guide**
- Quick lookups, cheat sheets
- Commands, templates
- Examples: `odoo_patterns.md`, `detection_commands.md`

**File 4: Quality/Standards**
- What "good" looks like
- Validation criteria
- Examples: `development_standards.md`, `scoring_rubric.md`

**File 5: Context/Integration (Optional)**
- How this agent fits into ecosystem
- When NOT to use this agent
- Examples: `qa_integration.md`, `existing_agents_analysis.md`

---

### 3. Slash Command (User Interface)

**Structure:**
```markdown
---
description: Short description
argument-hint: [optional args]
allowed-tools: Read, Write, ...
---

# Agent Name - Role

[Introduction]

## Your Knowledge Base
- Links to knowledge files

## Your Mission
- What you do
- What you don't do

## Workflow
- Phase-by-phase process

## Success Criteria
- How you know you're done

$ARGUMENTS (captures user input)
```

---

## The Agent Creation Process (What We Did)

### Step 1: Identify the Pain
**Questions:**
- What's repetitive?
- What causes mistakes?
- What requires deep knowledge?
- What's being done manually?

**Examples from our session:**
- Pain: "I keep explaining the same git workflow" → `/git-push`
- Pain: "Claude forgets architecture mid-session" → `/developer`
- Pain: "Vague requirements lead to wrong code" → `/architect`
- Pain: "Code quality inconsistent" → `odoo-audit`
- Pain: "Platform code bleeds into core" → `/check-core`

---

### Step 2: Define the Role
**Questions:**
- Is this an Advisor, Implementer, Gatekeeper, Automator, or Enforcer?
- Does it write code or just advise?
- What decisions does it make autonomously?
- Where does it hand off to humans?

**Example:**
```
Pain: "Need to plan features before coding"
Role: Advisor (architect)
Writes Code: NO
Decisions: Solution approaches, technical plans
Handoff: Developer prompt for implementation
```

---

### Step 3: Extract Knowledge
**Questions:**
- What does this agent need to know?
- Where is that knowledge now? (docs, chat history, existing code, your brain)
- What patterns/rules must it follow?
- What mistakes must it avoid?

**Example:**
```
Agent: git-push
Knowledge Sources:
- Chat history (last 2 weeks of git commands)
- Commit message patterns (emoji structure)
- Repository details (branches, remotes)
- Common errors (authentication, conflicts)

Result: 4 knowledge files extracted
```

---

### Step 4: Design the Workflow
**Questions:**
- What are the phases? (analyze → report → execute → validate)
- What's the order of operations?
- When to ask for approval?
- How to handle errors?

**Example:**
```
Agent: check-core
Workflow:
1. Analyze (scan for violations)
2. Report (show findings)
3. Approval (ask for high-risk changes)
4. Execute (fix safest first)
5. Validate (re-scan)
6. Handover (summary)
```

---

### Step 5: Create Knowledge Files
**Process:**
1. Start with template structure
2. Fill in domain knowledge
3. Add examples (✅ good, ❌ bad)
4. Include detection commands
5. Document edge cases

**Tip:** 4-5 files is optimal. More = overwhelming, less = insufficient.

---

### Step 6: Write the Slash Command
**Process:**
1. Introduce the agent's role
2. Link to knowledge files
3. Define workflow phases
4. State success criteria
5. Capture user arguments

**Tip:** User should understand in 30 seconds what the agent does.

---

### Step 7: Test & Refine
**Process:**
1. Invoke agent with real task
2. Observe behavior
3. Identify gaps in knowledge
4. Update knowledge files
5. Re-test

**Tip:** First run always reveals gaps. That's normal!

---

## Agent Interaction Patterns

### Sequential Handoff
```
/architect → Create plan
   ↓ (new session)
/developer → Implement plan
   ↓ (same session)
odoo-audit → Review quality
   ↓ (same session)
/git-push → Commit
```

### Validation Loop
```
/developer → Build feature
   ↓
/check-core → Validate boundaries
   ↓ (if issues found)
/developer → Fix violations
   ↓ (repeat until clean)
odoo-audit → Final review
```

### Periodic Maintenance
```
(Every 2 weeks)
odoo-audit → Score code, find patterns
   ↓
Update session-start.md → Prevent repeated mistakes
```

---

## When to Create a New Agent vs. Use Existing

### Create NEW agent when:
- ✅ Task is repetitive (done >3 times)
- ✅ Requires specialized knowledge
- ✅ Has clear success criteria
- ✅ Fits one of the 5 archetypes
- ✅ Doesn't overlap existing agents

### Use EXISTING agent when:
- ❌ Task is one-off
- ❌ Knowledge already in another agent
- ❌ Can be handled by human quickly
- ❌ Too vague to define workflow

---

## Agent Naming Conventions (Observed)

**Pattern: `noun-action` or `role-name`**

Examples:
- `odoo-audit` = Domain + Action
- `git-push` = Tool + Action
- `architect` = Role name
- `odoo-developer` = Domain + Role
- `canvas-core-guardian` = Scope + Role
- `recruiter` = Role name

**Slash Command = Agent Name**
- Agent: `odoo-developer`
- Command: `/developer` (short form OK)

---

## Success Metrics for Agents

An agent is well-designed when:
- ✅ User invokes it naturally (knows when to use it)
- ✅ Agent stays in role (doesn't drift)
- ✅ Output is consistent across sessions
- ✅ Knowledge files answer agent's questions
- ✅ Handoffs to other agents are clean
- ✅ User satisfaction increases (less repetition)

---

## Anti-Patterns (What NOT to Do)

### ❌ Anti-Pattern 1: God Agent
**Problem:** One agent does everything
**Example:** "master-agent that plans, codes, tests, commits"
**Why Bad:** Confusing, hard to maintain, role ambiguity

**✅ Better:** Specialized agents with clear handoffs

---

### ❌ Anti-Pattern 2: Duplicate Roles
**Problem:** Two agents do the same thing
**Example:** Having both `code-reviewer` and `odoo-audit`
**Why Bad:** User confusion, wasted effort

**✅ Better:** One agent per distinct role

---

### ❌ Anti-Pattern 3: No Clear Workflow
**Problem:** Agent doesn't know what to do when
**Example:** Knowledge files but no protocol
**Why Bad:** Inconsistent behavior, user frustration

**✅ Better:** Clear phase-by-phase workflow

---

### ❌ Anti-Pattern 4: Knowledge Overload
**Problem:** 10+ knowledge files, each 1000+ lines
**Example:** Every edge case documented
**Why Bad:** Agent overwhelmed, slow responses

**✅ Better:** 4-5 focused files, 100-500 lines each

---

### ❌ Anti-Pattern 5: Vague Role Definition
**Problem:** "Helper agent for various tasks"
**Example:** Agent does whatever user asks
**Why Bad:** No specialization, defeats purpose

**✅ Better:** Specific role, clear boundaries

---

## Agent Evolution (How to Improve Over Time)

### Phase 1: MVP (Initial Creation)
- Define role
- 2-3 core knowledge files
- Basic workflow
- Test with real tasks

### Phase 2: Refinement (After 5 uses)
- Add edge cases to knowledge
- Improve workflow based on feedback
- Add detection patterns
- Update examples

### Phase 3: Optimization (After 20 uses)
- Extract common patterns
- Integrate with other agents
- Add advanced features
- Document anti-patterns

### Phase 4: Maintenance (Ongoing)
- Update when domain changes
- Add newly discovered patterns
- Prune obsolete knowledge
- Keep knowledge files current

---

## The Agent Recruitment Criteria

Ask these questions before creating a new agent:

1. **Frequency:** Is this done 3+ times? (Yes = candidate)
2. **Complexity:** Requires specialized knowledge? (Yes = candidate)
3. **Repeatability:** Same steps each time? (Yes = candidate)
4. **Error-prone:** Mistakes happen when done manually? (Yes = candidate)
5. **Time-consuming:** Takes >15 minutes manually? (Yes = candidate)
6. **Archetype fit:** Matches one of the 5 patterns? (Yes = candidate)
7. **Knowledge extractable:** Can we document the "how"? (Yes = candidate)

**Scoring:** 5+ Yes = Strong candidate for agent creation

---

## From Our Session: What Made Each Agent Successful

### odoo-audit
- **Pain:** Code quality inconsistent, repeated mistakes
- **Knowledge Source:** QA tool analysis (ai_sam_development_qa.py)
- **Pattern:** Quality Gatekeeper
- **Success:** Scores code /10, improves session-start

### git-push
- **Pain:** Manual git workflow repeated 8-10 times per session
- **Knowledge Source:** Chat history analysis (2 weeks)
- **Pattern:** Automation Specialist
- **Success:** Emoji commits, intelligent staging

### architect
- **Pain:** Vague problems → wrong implementations
- **Knowledge Source:** Brainstorming techniques, Odoo patterns
- **Pattern:** Advisor
- **Success:** Clear developer prompts, no coding

### odoo-developer
- **Pain:** Inconsistent code quality, architectural violations
- **Knowledge Source:** Architecture docs, QA tool, painful lessons
- **Pattern:** Implementation Specialist
- **Success:** Elite code, QA validation, pride in work

### canvas-core-guardian
- **Pain:** Platform code bleeding into canvas core
- **Knowledge Source:** Architecture review, legacy issues
- **Pattern:** Boundary Enforcer
- **Success:** Zero violations, clean boundaries

---

## The Recruiter's Job (This Agent!)

When user says: "I need help with {task} repeatedly"

**Your workflow:**
1. **Extract the pain** - What's frustrating?
2. **Identify the pattern** - Which archetype?
3. **Locate knowledge** - Where does expertise exist?
4. **Design the agent** - Role, workflow, files
5. **Create knowledge files** - 4-5 focused files
6. **Write slash command** - User-friendly interface
7. **Test & refine** - Validate with real task

You're the meta-agent. You build agents. 🎯
