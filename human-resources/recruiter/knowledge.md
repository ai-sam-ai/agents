# recruiter Knowledge Base

> Consolidated knowledge for the recruiter Agent
> Source: recruiter/
> Generated: 2026-01-28
>
> Original files:
> - agent_creation_workflow.md
> - agent_design_patterns.md
> - existing_agents_analysis.md
> - knowledge_extraction.md
> - session_memory_protocol.md

---

## 1. Agent Creation Workflow

# Agent Creation Workflow (Step-by-Step)

## The Recruiter's Process

When user says: "I need an agent for X"

Follow this workflow to create a high-quality specialized agent.

---

## Phase 1: Discovery (Interview)

### Goal
Understand the pain point and extract requirements.

### Questions to Ask

**1. Pain Point Identification**
```
Q: "What task are you doing repeatedly?"
Q: "How often do you do this?" (If <3 times, might not need agent)
Q: "What part is most frustrating?"
Q: "What mistakes happen when you do this manually?"
```

**2. Workflow Understanding**
```
Q: "Walk me through the process step-by-step"
Q: "What do you check at each step?"
Q: "How do you know when you're done?"
Q: "What tools/commands do you use?"
```

**3. Knowledge Location**
```
Q: "Where does the expertise for this live?" (docs, code, your brain, chat history)
Q: "What patterns do you follow?"
Q: "What would an expert know that a beginner doesn't?"
```

**4. Success Criteria**
```
Q: "What would success look like for this agent?"
Q: "How would you know if the agent did a good job?"
Q: "What's the difference between a 3/10 and 10/10 result?"
```

### Deliverable
```markdown
## Discovery Summary

**Pain Point:** [One sentence]
**Frequency:** [X times per week/day]
**Current Process:** [Steps 1-5]
**Knowledge Sources:** [List locations]
**Success Criteria:** [Measurable outcomes]
**Estimated Agent Value:** [Time saved, errors prevented]
```

---

## Phase 2: Agent Design

### Goal
Map the pain point to an agent archetype and define role.

### Step 1: Choose Archetype

Match to one of the 5 patterns:

| Pattern | Does It Write Code? | Main Action | Example |
|---------|-------------------|-------------|---------|
| **Advisor** | ❌ No | Plans, asks questions | architect |
| **Implementer** | ✅ Yes | Builds features | odoo-developer |
| **Gatekeeper** | ⚠️ Reports only | Reviews, scores | odoo-audit |
| **Automator** | ⚠️ Workflow only | Automates tasks | git-push |
| **Enforcer** | ⚠️ Cleanup only | Detects, fixes violations | check-core |

**Decision Matrix:**
```
Does user need CODE written?
├─ YES → Implementer
└─ NO → Does user need PLANNING?
    ├─ YES → Advisor
    └─ NO → Does user need AUTOMATION?
        ├─ YES → Automator
        └─ NO → Does user need REVIEW?
            ├─ YES → Gatekeeper
            └─ NO → Does user need ENFORCEMENT?
                ├─ YES → Enforcer
                └─ NO → Clarify requirement
```

### Step 2: Define Role Boundaries

**Answer these:**
1. **Does this agent write production code?** (Yes/No)
2. **What decisions does it make autonomously?** (List)
3. **When does it hand off to humans?** (Conditions)
4. **When does it hand off to other agents?** (Which agents)
5. **What is it NOT allowed to do?** (Boundaries)

### Step 3: Choose Tools

Based on archetype:

**Advisor:**
- Read, Grep, Glob (exploration)
- Write (save plans only)
- NO Bash, Edit (no production changes)

**Implementer:**
- All tools: Bash, Read, Grep, Glob, Write, Edit, TodoWrite

**Gatekeeper:**
- Read, Grep, Glob, Bash (read-only)
- Write (reports only)

**Automator:**
- Bash, Read, Grep, Write
- Edit (config files only)

**Enforcer:**
- Read, Grep, Glob, Bash, Edit, Write, TodoWrite

### Step 4: Name the Agent

**Naming Formula:**
```
[domain]-[role] or [tool]-[action] or [role-name]

Examples:
✅ odoo-audit (domain-role)
✅ git-push (tool-action)
✅ architect (role-name)
✅ canvas-core-guardian (scope-role)
✅ odoo-developer (domain-role)
```

**Slash Command:**
```
Agent name: canvas-core-guardian
Slash: /check-core (short form OK if clear)
```

### Step 5: Choose Color

**Color Psychology:**
- 🔵 Blue = Audit/Analysis (trust, inspection)
- 🟢 Green = Implementation (growth, creation)
- 🟡 Yellow = Planning (caution, thinking)
- 🟣 Purple = Automation (magic, efficiency)
- 🔴 Red = Enforcement (warning, boundaries)
- 🔷 Cyan = Meta/Support (neutral, helpful)
- 🟠 Orange = Communication (social, messaging)

### Deliverable
```markdown
## Agent Design

**Name:** agent-name
**Archetype:** [One of 5]
**Slash Command:** /command-name
**Color:** [color] (meaning: [why])

**Role:**
- Does: [3-5 things]
- Does NOT: [3-5 things]

**Tools:** [List]

**Handoffs:**
- To Human: [When]
- To Other Agents: [Which, when]
```

---

## Phase 3: Knowledge Extraction

### Goal
Gather and distill expertise into 4-5 focused knowledge files.

### Step 1: Identify Knowledge Sources

**From chat history:**
```bash
# Search for patterns
grep -ri "keyword" "${CLAUDE_FILE_HISTORY}"

# Count frequency
# If appears 3+ times = extract to knowledge
```

**From documentation:**
```bash
# Find relevant docs
find "C:\Working With AI" -name "*.md" | grep -i "topic"

# Read and distill key points
```

**From existing code/tools:**
```python
# Read QA tools
# Extract validation rules
# Document patterns
```

**From user's brain:**
```
# Ask interview questions (see Phase 1)
# Record answers
# Extract rules and patterns
```

### Step 2: Organize Knowledge into 4-5 Files

**File 1: Domain Knowledge** (What agent needs to know)
```markdown
# [Domain] Mastery

## Core Concepts
[3-5 main ideas]

## Rules and Standards
[What's allowed, what's forbidden]

## Patterns
[Common solutions]

## Examples
[✅ Good, ❌ Bad]
```

**File 2: Workflow/Methodology** (How agent operates)
```markdown
# [Agent] Workflow

## Phase 1: [Name]
Goal, Steps, Output

## Phase 2: [Name]
Goal, Steps, Output

[...phases 3-6]

## Decision Points
[When to ask user, when to proceed]
```

**File 3: Reference Guide** (Quick lookups)
```markdown
# [Domain] Quick Reference

## Common Commands
[Runnable commands]

## Decision Matrix
[Tables, checklists]

## Templates
[Copy-paste ready]
```

**File 4: Quality/Standards** (What "good" looks like)
```markdown
# [Domain] Standards

## Success Criteria
[Measurable outcomes]

## Anti-Patterns
[What NOT to do]

## Validation
[How to check quality]
```

**File 5: Integration** (Optional - How agent fits in)
```markdown
# [Agent] Integration

## When to Use This Agent
[Conditions, triggers]

## When NOT to Use
[Alternative agents]

## Handoffs
[To/from other agents]
```

### Step 3: Write Each File

**Process per file:**
1. Create outline (headings)
2. Fill in core content (rules, examples)
3. Add detection patterns (commands)
4. Include decision criteria (when to X)
5. Optimize for scanning (symbols, structure)
6. Keep length 100-500 lines (not too long!)

### Step 4: Cross-Reference

**Link related knowledge:**
```markdown
See also: [related_file.md]
Reference: [external_doc.md]
Pattern: [Similar to X in other file]
```

### Deliverable
```
agents/agent-name/
├── agent.json
├── domain_knowledge.md      (150 lines)
├── workflow_protocol.md     (200 lines)
├── reference_guide.md       (120 lines)
├── quality_standards.md     (180 lines)
└── integration.md           (100 lines) [optional]
```

---

## Phase 4: Slash Command Creation

### Goal
Create user-friendly interface to invoke agent.

### Structure
```markdown
---
description: [Short one-liner]
argument-hint: [optional: what user can pass]
allowed-tools: [Same as agent.json]
---

# [Agent Name] - [Role]

[1-2 sentence intro]

---

## 📚 Your Knowledge Base
[Links to knowledge files]

## 🎯 Your Mission
[What you do, what you don't do]

## 📋 Your Workflow
[Phase-by-phase process]

## ✅ Success Criteria
[How you know you're done]

---

**[Context for agent]:** $ARGUMENTS
```

### Best Practices

1. **Description:** 5-10 words max (shows in autocomplete)
2. **Introduction:** User understands role in 30 seconds
3. **Knowledge links:** Make it easy to review
4. **Mission:** Crystal clear boundaries
5. **Workflow:** Phases match agent_protocol.md
6. **$ARGUMENTS:** Captures user input

### Deliverable
```
commands/command-name.md
```

---

## Phase 5: Testing & Validation

### Goal
Verify agent behaves as designed.

### Test Scenarios

**Test 1: Typical Use Case**
```
User: [Invoke agent with typical request]
Expected: [Agent follows workflow, produces expected output]
Actual: [Observe behavior]
```

**Test 2: Edge Case**
```
User: [Invoke with unusual request]
Expected: [Agent handles gracefully, asks clarification]
Actual: [Observe behavior]
```

**Test 3: Wrong Role**
```
User: [Ask agent to do something outside role]
Expected: [Agent declines, suggests correct agent]
Actual: [Observe behavior]
```

**Test 4: Knowledge Gap**
```
User: [Ask about scenario not in knowledge]
Expected: [Agent admits gap, asks for guidance]
Actual: [Observe behavior]
```

### Common Issues & Fixes

**Issue:** Agent does too much
**Fix:** Tighten role boundaries, add "What NOT to do"

**Issue:** Agent does too little
**Fix:** Expand knowledge, add more examples

**Issue:** Agent drifts from workflow
**Fix:** Make protocol more explicit, add phase markers

**Issue:** Agent can't make decisions
**Fix:** Add decision trees, clear criteria

**Issue:** Agent overwhelmed
**Fix:** Reduce knowledge file length, focus on core

### Deliverable
```markdown
## Agent Testing Report

**Agent:** agent-name
**Tests Run:** 4
**Pass Rate:** 3/4

**Issues Found:**
1. [Issue description]
   Fix: [What to update]

**Knowledge Gaps:**
1. [Gap description]
   Add to: [Which file]

**Status:** ✅ Ready / ⚠️ Needs refinement
```

---

## Phase 6: Documentation & Handover

### Goal
Ensure agent is maintainable and discoverable.

### Create README (Optional but recommended)
```markdown
# [Agent Name]

## Overview
[Purpose, when to use]

## Knowledge Files
[Brief description of each]

## Usage Examples
[3-5 real scenarios]

## Integration
[How it fits with other agents]

## Maintenance
[When to update, how]
```

### Update Ecosystem Documentation
```markdown
# Add to: agents/README.md (if exists)

## [Agent Name]
**Command:** /command-name
**Purpose:** [One line]
**Use when:** [Conditions]
```

### Create Quick Start Guide
```markdown
# QUICKSTART.md

## 5-Minute Start

1. Invoke: /command-name
2. Agent will: [What happens]
3. You provide: [What user does]
4. Agent delivers: [Output]

## Common Scenarios
- Scenario 1: [Example]
- Scenario 2: [Example]
```

### Deliverable
```
agents/agent-name/
├── README.md
├── QUICKSTART.md
└── [knowledge files]

commands/
└── command-name.md

Updated: agents/README.md (ecosystem doc)
```

---

## Phase 7: Iteration & Improvement

### Goal
Refine agent based on real usage.

### After First 5 Uses

**Review:**
1. What worked well?
2. What confused users?
3. What knowledge gaps appeared?
4. What workflow issues occurred?

**Update:**
- Add missing patterns to knowledge
- Clarify ambiguous rules
- Add examples for edge cases
- Refine workflow phases

### After First 20 Uses

**Analyze:**
1. What patterns emerged?
2. What anti-patterns discovered?
3. What integrations needed?
4. What optimizations possible?

**Enhance:**
- Extract common patterns
- Add advanced features
- Improve handoffs
- Document anti-patterns

### Ongoing Maintenance

**Triggers for updates:**
- Domain changes (new Odoo version)
- Agent makes mistakes (knowledge gap)
- User corrections (rule misunderstood)
- Pattern emerges (3+ similar issues)

**Update process:**
1. Identify gap
2. Locate relevant knowledge file
3. Add/update rule
4. Test with previous failure case
5. Verify fix

---

## Quality Checklist

Before declaring agent "complete":

### Role Clarity
- [ ] Agent knows what it does
- [ ] Agent knows what it doesn't do
- [ ] Boundaries are clear
- [ ] Handoffs are defined

### Knowledge Completeness
- [ ] Agent can answer 90%+ expected questions
- [ ] Examples are clear (✅ good, ❌ bad)
- [ ] Decision criteria are objective
- [ ] Detection patterns are runnable

### Workflow Clarity
- [ ] Phases are clearly defined
- [ ] Order of operations is logical
- [ ] Decision points are explicit
- [ ] Error handling is documented

### User Experience
- [ ] Slash command is intuitive
- [ ] User understands role in 30 seconds
- [ ] Agent responds consistently
- [ ] Output is actionable

### Integration
- [ ] Works well with existing agents
- [ ] Handoffs are smooth
- [ ] No role overlap/conflict
- [ ] Complements ecosystem

### Maintainability
- [ ] Knowledge files are organized
- [ ] Files are scannable
- [ ] Length is reasonable (100-500 lines)
- [ ] Update triggers are documented

---

## Success Metrics

Agent creation is successful when:
- ✅ User invokes agent naturally (no prompt needed)
- ✅ Agent stays in role (no drift)
- ✅ Output is consistent across sessions
- ✅ User satisfaction increases
- ✅ Time/effort saved is measurable
- ✅ Mistakes decrease (if enforcement agent)

Agent creation has FAILED when:
- ❌ User confused about when to use
- ❌ Agent frequently corrected
- ❌ Output is inconsistent
- ❌ User stops using agent
- ❌ No measurable improvement

---

## The Recruiter's Guarantee

When you follow this workflow:
1. Agent will have clear role
2. Agent will have sufficient knowledge
3. Agent will behave consistently
4. User will know when to invoke
5. Agent will integrate smoothly

If any of these FAIL → Return to relevant phase and refine.

---

## Time Estimates

Based on our session experience:

| Phase | Time | Notes |
|-------|------|-------|
| Discovery | 15-30 min | Interview, understand pain |
| Design | 10-20 min | Choose archetype, define role |
| Knowledge Extraction | 1-3 hours | Most time-intensive |
| Slash Command | 10-20 min | Interface creation |
| Testing | 20-40 min | 3-5 test scenarios |
| Documentation | 15-30 min | README, quickstart |
| **Total** | **2-5 hours** | For complete agent |

**Faster if:**
- Knowledge already documented
- Pattern matches existing agent
- User provides clear requirements

**Slower if:**
- Domain is complex
- Knowledge scattered
- Multiple revisions needed

---

## Agent Creation Template (Copy This)

```markdown
## Agent Creation Brief

**Name:**
**Slash Command:** /
**Archetype:** [Advisor/Implementer/Gatekeeper/Automator/Enforcer]
**Color:**

### Pain Point
[What repetitive task/frustration]

### Knowledge Sources
1. [Location 1]
2. [Location 2]

### Role Boundaries
**Does:**
-
-

**Does NOT:**
-
-

### Tools Needed
- [ ] Read
- [ ] Write
- [ ] Edit
- [ ] Bash
- [ ] Grep
- [ ] Glob
- [ ] TodoWrite

### Knowledge Files (4-5)
1. [filename.md] - [Purpose]
2. [filename.md] - [Purpose]
3. [filename.md] - [Purpose]
4. [filename.md] - [Purpose]

### Success Criteria
-
-

### Integration Points
- Invoked by: [Trigger]
- Hands off to: [Other agents]

### Estimated Value
- Time saved: [X minutes per use]
- Frequency: [X times per week]
- Total: [Y hours saved per month]
```

Use this template to start every agent creation!

---

## 2. Agent Design Patterns

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

---

## 3. Existing Agents Analysis

# Existing Agents Analysis (Your Current Team)

## Agent Roster (As of 2025-10-10)

**Total Agents: 8**
- **Boardroom (Strategic Advisors): 3**
- **Operators (Execution Specialists): 5**

### 1. odoo-session-onboarder
**Command:** Via `/session-start`
**Archetype:** Advisor (Onboarding specialist)
**Color:** Green
**Status:** ✅ Active

**Role:**
- Loads project context at session start
- Reviews architecture documentation
- Establishes baseline understanding
- Sets development principles

**Tools:** Read, Glob, Grep, Bash, Write, Edit, TodoWrite

**Knowledge:**
- SAM AI V3 architecture
- Canvas Skeleton core
- Module structure
- Development principles
- Sprint-based workflow

**When to Use:**
- Start of every development session
- After long break from project
- When new developer joins
- Before any development work

**Integrates With:**
- → architect (after onboarding, if planning needed)
- → developer (after onboarding, for implementation)

---

### 2. odoo-audit
**Command:** Invoked via Task tool
**Archetype:** Gatekeeper (Quality reviewer)
**Color:** Blue
**Status:** ✅ Active

**Role:**
- Scores code quality out of 10
- Identifies improvement opportunities
- Analyzes session-start for gaps
- Prevents repeated mistakes

**Tools:** Read, Grep, Glob, Write

**Knowledge:**
- Quality standards (from QA tool)
- Scoring rubric
- Common mistakes catalog
- Session optimization strategies

**When to Use:**
- After feature implementation
- Before git commit
- Periodic quality reviews
- When code smells detected

**Integrates With:**
- developer → audit (validate work)
- audit → session-start (improve documentation)
- audit → developer (fix issues if found)

---

### 3. git-push
**Command:** `/git-push`
**Archetype:** Automator (Workflow automation)
**Color:** Purple
**Status:** ✅ Active

**Role:**
- Automates git workflow
- Intelligently stages files
- Generates emoji commit messages
- Validates before push

**Tools:** Bash, Read, Grep, Glob, Write

**Knowledge:**
- GitHub configuration (repo, branch, remote)
- Workflow patterns (staging, committing)
- Commit message template (emoji structure)
- Pre-push checklist (validations)

**When to Use:**
- After work is complete and tested
- After QA validation passes
- When ready to commit changes
- Replaces manual git commands

**Integrates With:**
- audit → git-push (commit after quality check)
- developer → git-push (commit after implementation)

---

### 4. odoo-architect
**Command:** `/odoo-architect`
**Archetype:** Advisor (Odoo Solutions Architect)
**Color:** Yellow
**Status:** ✅ Active (renamed from architect)

**Role:**
- Brainstorms Odoo/SAM AI solutions
- Creates technical plans for Odoo modules
- Writes developer prompts
- Does NOT write production code
- Scope: SAM AI + all future Odoo products

**Tools:** Read, Grep, Glob, Write

**Knowledge:**
- Planning methodology (5 Whys, scenarios)
- Prompt writing guide (for developers)
- Odoo patterns (10 common solutions)
- Brainstorming frameworks

**When to Use:**
- Odoo/SAM AI feature planning
- Requirements are vague
- Multiple solution approaches exist
- Need planning before implementation
- Creating developer handoff documents

**Integrates With:**
- odoo-architect → developer (handoff via prompt)
- user → odoo-architect (when unclear on approach)
- cmo + odoo-architect (product-market fit discussions)

**IMPORTANT:** Use in SEPARATE session from developer!

---

### 5. odoo-developer
**Command:** `/developer`
**Archetype:** Implementer (Elite specialist)
**Color:** Green
**Status:** ✅ Active

**Role:**
- Implements features with excellence
- Follows architecture patterns
- Validates with QA tool before handover
- Maintains code cleanliness

**Tools:** Bash, Read, Grep, Glob, Write, Edit, TodoWrite

**Knowledge:**
- Architecture mastery (3-layer, canvas skeleton)
- Development standards (elite code quality)
- QA integration (mandatory validation)
- File management (no rogue files)

**When to Use:**
- Clear requirements exist
- Feature needs implementation
- Code needs to be written
- After architect creates plan

**Integrates With:**
- architect → developer (receives prompts)
- developer → audit (validates quality)
- developer → git-push (commits work)
- developer → check-core (validates boundaries)

**IMPORTANT:** Does NOT plan, only implements!

---

### 6. canvas-core-guardian
**Command:** `/check-core`
**Archetype:** Enforcer (Boundary protector)
**Color:** Red
**Status:** ✅ Active

**Role:**
- Enforces "ONE core, MANY skins" pattern
- Detects platform bleeding
- Cleans up legacy "skeleton" naming
- Prevents cross-platform imports

**Tools:** Read, Grep, Glob, Bash, Edit, Write, TodoWrite

**Knowledge:**
- Canvas core rules (boundaries)
- Forbidden patterns (anti-patterns)
- Naming standards (skeleton → canvas)
- Agent protocol (workflow phases)

**When to Use:**
- Working on canvas_core files
- Refactoring platform code
- Before committing canvas changes
- Cleaning up architectural violations

**Integrates With:**
- developer → check-core (validate boundaries)
- check-core → developer (fix violations)
- audit → check-core (boundary review)

---

### 7. chief-of-staff (THIS AGENT!)
**Command:** `/cos` or `/chief-of-staff`
**Archetype:** Meta-agent (Boardroom builder)
**Color:** Cyan
**Status:** ✅ Active (renamed from recruiter)

**Role:**
- Builds and manages boardroom (C-suite advisors)
- Designs new specialized agents
- Extracts knowledge from pain points
- Manages agent ecosystem health
- Strategic advisor to CEO on team composition

**Tools:** Read, Grep, Glob, Write, TodoWrite

**Knowledge:**
- Agent design patterns (5 archetypes)
- Knowledge extraction techniques
- Agent creation workflow (7 phases)
- Existing agents analysis
- Boardroom coordination

**When to Use:**
- Building new boardroom member (CFO, CPO, etc.)
- Creating execution specialist
- Ecosystem health check
- Strategic team planning

**Integrates With:**
- user → chief-of-staff (identify need)
- chief-of-staff → [creates new agent]
- new agent → ecosystem (integration)

---

### 8. cmo (NEW!)
**Command:** `/cmo`
**Archetype:** Advisor (Strategic marketing)
**Color:** Orange
**Status:** ✅ Active (just built!)

**Role:**
- Strategic marketing advisor (NOT copywriter)
- Challenges positioning and messaging assumptions
- Applies direct response frameworks (Dan Kennedy → modern)
- Creates marketing strategy briefs
- Socratic questioning for CEO

**Tools:** Read, Grep, Glob, Write

**Knowledge:**
- Direct response mastery (Dan Kennedy + modern funnels)
- Market positioning methodology
- SAM AI product context (grows over time)
- Marketing strategy frameworks
- CMO protocol (Socratic workflow)

**When to Use:**
- Pre-launch marketing strategy
- Positioning discussions
- Campaign planning
- Market analysis
- Strategic marketing decisions

**Integrates With:**
- cmo → [future copywriter agent] (strategy → execution)
- cmo → [future social media agent] (strategy → execution)
- architect + cmo → product-market fit discussions

---

## Agent Ecosystem Map

```
                           CEO
                            |
                    /chief-of-staff
                  [BOARDROOM BUILDER]
                            |
           ┌────────────────┼────────────────┐
           ↓                ↓                ↓
   /odoo-architect       /cmo         [Future CFO]
  [ODOO PLANNING]  [MARKETING]      [FINANCE]


    EXECUTION LAYER:

    /session-start → /odoo-architect OR /developer
         ↓                ↓
    [ONBOARDING]    [IMPLEMENTATION]
                          ↓
                    /check-core
                 [BOUNDARY CHECK]
                          ↓
                    odoo-audit
                  [QUALITY REVIEW]
                          ↓
                     /git-push
                   [AUTOMATION]
```

---

## Coverage Analysis

### What's Covered Well
- ✅ **Boardroom (Strategic):**
  - Odoo technical planning (odoo-architect)
  - Marketing strategy (cmo)
  - Team building (chief-of-staff)
- ✅ **Execution (Tactical):**
  - Onboarding (session-start)
  - Implementation (developer)
  - Quality review (audit)
  - Boundary enforcement (check-core)
  - Git automation (git-push)

### Potential Gaps (Future Boardroom Members)

**CFO (Chief Financial Officer)**
- Archetype: Advisor
- Role: Budget strategy, ROI analysis, runway planning
- Command: `/cfo`
- Trigger: Pre-launch budget allocation, financial decisions

**CPO (Chief Product Officer)**
- Archetype: Advisor
- Role: Product roadmap, feature prioritization, user research
- Command: `/cpo`
- Trigger: Product strategy decisions, feature debates

**CTO (Chief Technology Officer)**
- Archetype: Advisor
- Role: Technical architecture strategy, scalability, infrastructure
- Command: `/cto`
- Trigger: Technical strategy (NOT implementation - that's architect/developer)

### Potential Gaps (Future Executors)

**Testing Specialist**
- Archetype: Gatekeeper
- Role: Run tests, analyze failures, suggest fixes
- Command: `/test` (exists but not agent yet)
- Trigger: After implementation, before commit

**Copywriter**
- Archetype: Implementer
- Role: Write ad copy, landing pages, emails (receives briefs from CMO)
- Command: `/copywriter`
- Trigger: CMO creates strategy brief, needs execution

**Social Media Manager**
- Archetype: Automator
- Role: Create posts, schedule content, engage community
- Command: `/social`
- Trigger: CMO creates campaign strategy, needs daily execution

**Documentation Specialist**
- Archetype: Implementer
- Role: Generate/update docs, API docs, README files
- Command: `/document`
- Trigger: After feature complete, before release

**Refactoring Specialist**
- Archetype: Implementer
- Role: Clean up code smells, extract duplicates, improve structure
- Command: `/refactor`
- Trigger: Code audit identifies opportunities

**Performance Optimizer**
- Archetype: Implementer + Gatekeeper
- Role: Profile code, identify bottlenecks, optimize queries
- Command: `/optimize`
- Trigger: Performance issues detected

**Security Auditor**
- Archetype: Gatekeeper
- Role: Scan for vulnerabilities, check permissions, validate inputs
- Command: `/secure`
- Trigger: Before production deploy

**Migration Specialist**
- Archetype: Implementer
- Role: Upgrade Odoo versions, migrate data, update deprecated APIs
- Command: `/migrate`
- Trigger: Version upgrade needed

**Deployment Manager**
- Archetype: Automator
- Role: Deploy to staging/production, run migrations, verify deployment
- Command: `/deploy`
- Trigger: Ready for release

---

## Agent Interaction Patterns

### Sequential Flow (Most Common)
```
session-start → architect → developer → check-core → audit → git-push
```

### Iterative Loop (Quality Issues)
```
developer → audit (issues found) → developer (fix) → audit (pass) → git-push
```

### Branching (Conditional)
```
session-start → architect (if unclear) → developer
session-start → developer (if clear requirements)
```

### Parallel Validation (Best Practice)
```
developer → [check-core + audit] (run both) → git-push
```

---

## Agent Invocation Patterns

### Manual Invocation (User-Triggered)
```
User types: /architect
User types: /developer
User types: /check-core
User types: /git-push
User types: /recruiter
```

### Task Tool Invocation (Agent-Triggered)
```python
# From within another agent or conversation
Task(
    subagent_type="odoo-audit",
    description="Audit code quality",
    prompt="Review module X for quality..."
)
```

### Auto-Suggested (Context-Based)
```
# Not implemented yet, but possible:
# Claude suggests: "Should I run /check-core before committing?"
```

---

## Agent Specialization Matrix

| Agent | Plans | Codes | Reviews | Automates | Enforces |
|-------|-------|-------|---------|-----------|----------|
| architect | ✅ | ❌ | ❌ | ❌ | ❌ |
| developer | ❌ | ✅ | ❌ | ❌ | ❌ |
| audit | ❌ | ❌ | ✅ | ❌ | ❌ |
| git-push | ❌ | ❌ | ❌ | ✅ | ❌ |
| check-core | ❌ | ⚠️ | ⚠️ | ❌ | ✅ |
| recruiter | ✅ | ❌ | ❌ | ❌ | ❌ |

Legend:
- ✅ Primary function
- ⚠️ Limited function (only cleanup/validation)
- ❌ Not in scope

---

## Tool Usage Patterns

| Tool | session-start | architect | developer | audit | git-push | check-core | recruiter |
|------|--------------|-----------|-----------|-------|----------|------------|-----------|
| Read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Write | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Bash | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Grep | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Glob | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| TodoWrite | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |

**Pattern:** Advisors have fewer tools (no Edit, no Bash)

---

## Knowledge File Patterns

**Common Structure:**
- Every agent has 4-5 knowledge files
- File 1: Domain knowledge
- File 2: Workflow/methodology
- File 3: Reference guide
- File 4: Quality/standards
- File 5: Integration (optional)

**Length Distribution:**
- Shortest: ~100 lines (reference guides)
- Average: ~250 lines (most files)
- Longest: ~500 lines (comprehensive standards)

**Naming Patterns:**
- `domain_thing.md` (descriptive)
- `agent_protocol.md` (standard workflow file)
- `reference_guide.md` (quick lookup)

---

## Agent Lifecycle

### Birth (Creation)
1. User identifies pain point
2. Recruiter designs agent
3. Knowledge extracted
4. Agent created
5. Testing/validation

### Growth (Refinement)
1. First 5 uses → Add edge cases
2. First 20 uses → Optimize workflow
3. Ongoing → Update knowledge

### Maintenance (Evolution)
1. Domain changes → Update knowledge
2. New patterns → Add to catalog
3. Mistakes → Document anti-patterns

### Retirement (Deprecation)
1. Pain point resolved
2. Better agent replaces
3. Archive for reference

---

## When to Create vs. Use Existing

### Create NEW agent when:
- Task is repetitive (3+ times)
- Requires specialized knowledge
- Clear workflow exists
- Doesn't overlap existing agents
- Saves significant time/prevents errors

### Use EXISTING agent when:
- Task matches existing role
- One-off situation
- Can be done manually quickly
- Knowledge already in another agent

### Modify EXISTING agent when:
- Knowledge gap identified
- Workflow needs adjustment
- Integration needs improvement
- But core role stays same

---

## Agent Success Metrics

| Agent | Primary Metric | Success Threshold |
|-------|---------------|-------------------|
| session-start | Context loaded | 100% sessions |
| architect | Clear plan created | 90% satisfaction |
| developer | QA passes | 100% before handover |
| audit | Score improves | +1 point per sprint |
| git-push | Time saved | >5 min per use |
| check-core | Violations fixed | Zero violations |
| recruiter | Agent created | <5 hours total |

---

## Ecosystem Health Indicators

**Healthy Ecosystem:**
- ✅ Users know which agent to invoke
- ✅ Agents stay in role
- ✅ Handoffs are smooth
- ✅ No role overlap/conflict
- ✅ Knowledge files stay current

**Unhealthy Ecosystem:**
- ❌ User confusion ("which agent?")
- ❌ Agents drift from role
- ❌ Handoffs are manual/clunky
- ❌ Duplicate functionality
- ❌ Stale knowledge

---

## The Agent Philosophy

**Principles:**
1. **Specialization over generalization**
   - One role, done excellently
   - Not "jack of all trades"

2. **Clear boundaries**
   - Knows what it does
   - Knows what it doesn't do

3. **Smooth handoffs**
   - Integrates with others
   - Doesn't work in isolation

4. **Knowledge-driven**
   - Behavior from knowledge files
   - Not hardcoded logic

5. **User-centric**
   - Solves real pain
   - Measurable value

---

## Next Agent Candidates (Ranked by Priority)

Based on current gaps:

1. **Testing Specialist** (High priority)
   - Pain: Manual test running
   - Value: Catch bugs early

2. **Refactoring Specialist** (Medium priority)
   - Pain: Code smells accumulate
   - Value: Maintainability

3. **Performance Optimizer** (Medium priority)
   - Pain: Slow queries, bottlenecks
   - Value: Better UX

4. **Security Auditor** (Medium priority)
   - Pain: Security oversights
   - Value: Prevent vulnerabilities

5. **Documentation Specialist** (Low priority)
   - Pain: Docs fall behind code
   - Value: Better onboarding

Would you like recruiter to create any of these? 🎯

---

## 4. Knowledge Extraction

# Knowledge Extraction Techniques

## Where Agent Knowledge Comes From

### Source 1: Chat History
**What to extract:**
- Repeated questions/explanations
- Commands run multiple times
- Patterns in user requests
- Solutions that worked

**How to extract:**
```bash
# Search chat history
grep -ri "pattern" "${CLAUDE_FILE_HISTORY}"

# Look for frequency
# If same explanation appears 3+ times = Agent candidate
```

**Example from our session:**
- Git workflow explained 5+ times → `/git-push` agent
- Architecture explained every session → `/developer` knowledge base

---

### Source 2: Existing Documentation
**What to extract:**
- Technical specifications
- Architecture diagrams
- Best practices
- Standards and conventions

**How to extract:**
```bash
# Find relevant docs
find "C:\Working With AI\ai_sam\ai_sam_docs" -name "*.md"

# Read and distill key points
# Convert to agent-friendly format
```

**Example from our session:**
- `SAM_AI_V3_ARCHITECTURE.md` → architecture_mastery.md
- `CANVAS_SKELETON_CORE_ARCHITECTURE.md` → canvas_core_rules.md

---

### Source 3: Code Analysis Tools
**What to extract:**
- Quality rules
- Anti-patterns
- Detection commands
- Validation logic

**How to extract:**
```python
# Read existing QA/validation tools
# Extract rules and patterns
# Document as agent knowledge

# Example:
python ai_sam_development_qa.py --report
# Analyze report structure
# Extract validation rules
```

**Example from our session:**
- `ai_sam_development_qa.py` → qa_integration.md
- QA checks → quality standards

---

### Source 4: Pain Points (User Feedback)
**What to extract:**
- "I hate doing X repeatedly"
- "Claude always forgets Y"
- "This keeps causing errors"
- "Can you help me with Z again?"

**How to extract:**
- Listen for frustration patterns
- Count repetitions
- Note what causes confusion
- Track error-prone areas

**Example from our session:**
```
User: "I'm sick of repeating git workflow"
→ Pain: Manual git is repetitive
→ Solution: git-push agent

User: "Claude forgets architecture mid-session"
→ Pain: Context loss
→ Solution: odoo-developer with architecture mastery

User: "Platform code keeps bleeding into core"
→ Pain: Boundary violations
→ Solution: canvas-core-guardian
```

---

### Source 5: The User's Brain
**What to extract:**
- Unwritten rules ("I just know this")
- Experience-based decisions
- Domain expertise
- Workflow preferences

**How to extract:**
**Interview Questions:**
1. "Walk me through how you do X"
2. "What do you check for when Y?"
3. "How do you know when Z is good enough?"
4. "What mistakes have you made with this?"
5. "What would an expert know that a beginner wouldn't?"

**Example from our session:**
```
Question: "How do you know code is quality?"
Answer: "I run QA tool, check architecture, verify boundaries..."
→ Extracted: Quality gatekeeper workflow

Question: "How do you decide where files go?"
Answer: "ai_brain = data, ai_sam = framework, branches = features"
→ Extracted: File placement decision matrix
```

---

## Knowledge Organization Patterns

### Pattern 1: Rules + Examples
```markdown
## Rule: Do X, Not Y

❌ BAD Example:
[Show what's wrong]

✅ GOOD Example:
[Show what's right]

Why: [Explanation]
```

**Use when:** Clear right/wrong distinction exists

---

### Pattern 2: Decision Trees
```markdown
## When to Use X vs Y

Is condition A true?
├─ YES → Use X
└─ NO → Is condition B true?
    ├─ YES → Use Y
    └─ NO → Ask user
```

**Use when:** Multiple options with clear criteria

---

### Pattern 3: Workflow Phases
```markdown
## Process

### Phase 1: Analyze
- Step 1
- Step 2

### Phase 2: Report
- Step 1
- Step 2

### Phase 3: Execute
- Step 1
- Step 2
```

**Use when:** Sequential process with stages

---

### Pattern 4: Detection + Fix
```markdown
## Anti-Pattern: Name

🔍 How to Detect:
```bash
grep -r "pattern" path/
```

❌ Problem Code:
[Example]

✅ Fixed Code:
[Example]

🛠️ Fix Steps:
1. Step 1
2. Step 2
```

**Use when:** Agent enforces standards

---

### Pattern 5: Reference Table
```markdown
| Scenario | Tool | Complexity | Risk |
|----------|------|------------|------|
| A        | X    | Low        | Low  |
| B        | Y    | Med        | Med  |
| C        | Z    | High       | High |
```

**Use when:** Quick lookup needed

---

## Distillation: From 1000 Lines to 100 Lines

### Step 1: Identify Core Concepts
**Question:** What are the 3-5 most important things?

**Example:**
```
Document: SAM_AI_V3_ARCHITECTURE.md (500 lines)
Core Concepts:
1. Three-layer architecture
2. Canvas Skeleton pattern
3. Module dependencies
4. File placement rules
5. Odoo 18 specifics

Distilled: architecture_mastery.md (200 lines, focused)
```

---

### Step 2: Remove Noise
**Cut:**
- Implementation details (agent doesn't code internals)
- Historical context (why decisions made)
- Alternative approaches (agent follows one pattern)
- Verbose explanations (agent needs facts)

**Keep:**
- Rules and standards
- Examples (good/bad)
- Detection patterns
- Decision criteria

---

### Step 3: Add Structure
**Before (Raw):**
```
We use three layers. ai_brain has models. ai_sam has controllers.
Branch modules depend on both. Canvas skeleton is universal.
Platforms are specific. Don't mix them. Use list not tree in Odoo 18.
Version must be 18.0.x.y. Security rules required...
```

**After (Structured):**
```markdown
## Three-Layer Architecture
[Clear explanation with diagram]

## Canvas Skeleton Pattern
[ONE core, MANY skins]

## Odoo 18 Rules
1. Use <list> not <tree>
2. Version: 18.0.x.y
3. Security: Required for all models
```

---

### Step 4: Optimize for Scanning
**Agents scan for patterns. Help them:**
- Use consistent headings
- Start with summary
- Use ✅ ❌ symbols
- Keep examples short
- Link related sections

**Example:**
```markdown
## Rule Name

**Summary:** [One sentence]

**When to apply:** [Conditions]

**Examples:**
❌ Wrong
✅ Right

**See also:** [Related rule]
```

---

## The Interview Process (Extracting from User)

### Opening Questions
1. "What task are you doing repeatedly?"
2. "What part is most frustrating?"
3. "What mistakes happen when you do this?"
4. "How long does it take each time?"
5. "What would make this easier?"

### Deep Dive Questions
1. "Walk me through the process step-by-step"
2. "What do you check at each step?"
3. "How do you know when you're done?"
4. "What's the difference between good and bad here?"
5. "What edge cases exist?"

### Knowledge Extraction Questions
1. "What does an expert know that a beginner doesn't?"
2. "What unwritten rules exist?"
3. "What shortcuts do you use?"
4. "What smells indicate a problem?"
5. "What patterns do you recognize?"

### Validation Questions
1. "If I did X, would you approve?"
2. "What would make you reject this?"
3. "How would you rate this /10?"
4. "What's missing from my understanding?"
5. "What did I get wrong?"

---

## From Conversation to Knowledge File

### Example: Creating git-push agent

**Conversation:**
```
User: "I keep explaining my git workflow"
Recruiter: "Walk me through your typical git session"
User: "I run git status, add files by directory, write emoji commits, push to origin master"
Recruiter: "What's the commit message structure?"
User: "Emoji sections: 🎯 summary, 📊 changes, 🔧 improvements, 🤖 footer"
Recruiter: "How do you decide what to stage?"
User: "Stage by module folder: models/, views/, static/"
Recruiter: "What authentication method?"
User: "HTTPS, credentials cached"
Recruiter: "Ever had issues?"
User: "No, it's been smooth"
```

**Extracted Knowledge:**
```markdown
# GitHub Configuration
- Repo: custom-modules-v18
- Remote: origin
- Branch: master
- Auth: HTTPS (cached)

# Workflow Patterns
1. git status
2. Stage by directory
3. Emoji commit structure
4. git push origin master

# Commit Message Template
🎯 [Summary]
📊 Changes Made:
- Point 1
🔧 Technical Improvements:
- Point 1
🤖 Generated with Claude Code
```

**Result:** `workflow_patterns.md`, `commit_message_template.md`

---

## Quality Checklist for Knowledge Files

Before finalizing, verify:
- [ ] Can agent find answers to expected questions?
- [ ] Examples are clear (✅ good, ❌ bad)
- [ ] Detection patterns are runnable
- [ ] Decision criteria are objective
- [ ] File is scannable (headings, structure)
- [ ] Length is reasonable (100-500 lines)
- [ ] No redundancy with other knowledge files
- [ ] Links to related knowledge work

---

## Maintenance: Keeping Knowledge Current

### When to Update Knowledge Files

**Triggers:**
1. Agent makes mistake (knowledge gap)
2. User corrects agent (rule misunderstood)
3. Domain changes (new Odoo version)
4. Pattern emerges (3+ similar issues)
5. User requests (explicit update)

### Update Process

1. **Identify gap**
   ```
   Agent: Does X
   User: "No, do Y instead"
   → Gap: Rule for X vs Y missing
   ```

2. **Locate file**
   ```
   Which knowledge file covers this?
   → Update that file
   ```

3. **Add/Update rule**
   ```markdown
   ## When to Use X vs Y (NEW)

   Use X when: [condition]
   Use Y when: [condition]

   Example: [...]
   ```

4. **Test**
   ```
   Invoke agent again
   Verify it now handles case correctly
   ```

---

## The Recruiter's Golden Rule

**Extract painfully-learned lessons IMMEDIATELY**

When user says:
- "That was painful"
- "I won't make that mistake again"
- "Wish I'd known that earlier"
- "Here's what I learned..."

→ **STOP** and ask: "Should we create an agent to prevent this?"

The best agent knowledge comes from **actual pain**, not hypothetical scenarios.

---

## Knowledge File Templates

### Template 1: Rules + Standards
```markdown
# [Domain] Standards

## Rule 1: [Name]
**What:** [Description]
**Why:** [Reason]
**Examples:**
❌ Wrong
✅ Right

## Rule 2: [Name]
...
```

### Template 2: Workflow Protocol
```markdown
# [Agent Name] Workflow

## Phase 1: [Name]
**Goal:** [Objective]
**Steps:**
1. Step 1
2. Step 2
**Output:** [Deliverable]

## Phase 2: [Name]
...
```

### Template 3: Detection + Remediation
```markdown
# [Domain] Anti-Patterns

## Anti-Pattern 1: [Name]

🔍 **Detection:**
```bash
grep -r "pattern" path/
```

❌ **Problem:**
[Bad example]

✅ **Solution:**
[Good example]

🛠️ **Fix Steps:**
1. Step 1
2. Step 2
```

### Template 4: Reference Guide
```markdown
# [Domain] Quick Reference

## Common Tasks

### Task 1: [Name]
**Command:** `command here`
**When:** [Condition]
**Example:** [...]

### Task 2: [Name]
...

## Decision Matrix
| Scenario | Action | Notes |
|----------|--------|-------|
| A        | X      | ...   |
```

---

## Success Metrics

Knowledge extraction is successful when:
- ✅ Agent can answer 90%+ of expected questions
- ✅ User rarely corrects agent behavior
- ✅ Agent stays in role consistently
- ✅ Knowledge files are referenced during execution
- ✅ User satisfaction increases with agent use

Knowledge extraction has FAILED when:
- ❌ Agent frequently says "I don't know"
- ❌ User corrects agent multiple times per session
- ❌ Agent deviates from role
- ❌ Knowledge files too vague or verbose
- ❌ User stops using agent (too unreliable)

---

## The Meta-Question

**For each piece of knowledge, ask:**
"If I was this agent, facing this scenario, could I make the right decision?"

If NO → Knowledge gap. Extract more.
If YES → Knowledge sufficient. Move on.

---

## 5. Session Memory Protocol

# Session Memory Protocol

## Two-Mode Operation

The recruiter operates in two distinct modes, offering different perspectives:

---

## Mode 1: FRESH MODE (`/recruiter fresh`)

### Purpose
Pure Socratic questioning. Challenge everything. Beginner's mind.

### Behavior
- ❌ Does NOT load session_memory.md
- ❌ Does NOT assume context
- ❌ Does NOT reference past decisions
- ✅ Asks fundamental "why" questions
- ✅ Challenges assumptions
- ✅ Questions necessity
- ✅ Plays devil's advocate

### When to Use
- Rethinking fundamentals
- Questioning existing architecture
- Major strategic decisions
- "Should we even do this?"
- Sanity checks
- Breaking out of thought patterns

### Example Session
```
User: /recruiter fresh I need an agent for database optimization

Recruiter (Fresh Mode):
Q: Why optimize? What's slow?
Q: Have you measured actual bottlenecks?
Q: Could you fix the queries manually?
Q: What if you just added more RAM?
Q: Is this premature optimization?
Q: What business value does this add?
Q: Could another agent handle this?

[Challenges the premise before designing]
```

### Philosophy
**"Don't let me inherit your assumptions. Make me understand from scratch."**

---

## Mode 2: DEFAULT MODE (`/recruiter`)

### Purpose
Build incrementally on existing knowledge. Continuity across sessions.

### Behavior
- ✅ Loads session_memory.md
- ✅ Aware of project context
- ✅ References past decisions
- ✅ Knows existing agents
- ✅ Builds on previous work
- ✅ Incremental evolution

### When to Use
- Expanding agent ecosystem
- Iterating on existing patterns
- Creating similar agents
- Building on past work
- Standard agent creation
- "More of the same, but for X"

### Example Session
```
User: /recruiter I need an agent for database optimization

Recruiter (Default Mode):
[Loads memory: You have odoo-audit, check-core, developer...]

I see you already have quality review (odoo-audit) and enforcement (check-core).

A database optimizer would:
- Profile queries (new capability)
- Suggest indexes (new capability)
- Follow existing pattern (Gatekeeper archetype)

This fits well with your ecosystem. Let's create it.

Q: What triggers optimization? (Performance complaint? Periodic review?)
Q: What databases? (PostgreSQL for Odoo?)
[Builds on known context]
```

### Philosophy
**"Let me build on what we've learned together."**

---

## Session Memory Structure

### File Location
```
${CLAUDE_AGENTS_DIR}\recruiter\session_memory.md
```

### Auto-Generated Content
```markdown
# Recruiter Session Memory

**Last Updated:** 2025-10-10 15:30
**Total Agents Created:** 7
**Total Sessions:** 12

---

## Project Context (Loaded from /session-start)

### SAM AI V3 Architecture
- Three-layer: ai_brain → ai_sam → branches
- Canvas Skeleton: ONE core, MANY skins
- Odoo 18 project
- PostgreSQL database

### Key Principles
- No platform bleeding into canvas core
- Security rules required for all models
- QA validation before commit
- Files in correct locations

---

## Current Agent Roster (7 Active)

1. **odoo-session-onboarder** - Context loading
2. **odoo-audit** - Quality scoring
3. **git-push** - Git automation
4. **architect** - Planning advisor
5. **odoo-developer** - Elite implementer
6. **canvas-core-guardian** - Boundary enforcer
7. **recruiter** - Agent creator (meta)

---

## Recent Agent Creation History

### 2025-10-09: canvas-core-guardian
**Pain Point:** Platform code bleeding into canvas core
**Archetype:** Enforcer
**Outcome:** Successfully detecting violations
**Notes:** User loves the "skeleton → canvas" cleanup

### 2025-10-10: recruiter
**Pain Point:** Need to create more agents
**Archetype:** Meta-agent
**Outcome:** Self-aware agent creation system
**Notes:** User wants two modes (fresh/default)

---

## User Preferences (Learned Patterns)

### Agent Design
- Prefers 4-5 knowledge files (not more)
- Likes clear archetypes (5 patterns)
- Values Socratic questioning
- Wants integration points documented

### Communication Style
- Direct, technical language
- Visual diagrams (ASCII art)
- Examples (✅ good, ❌ bad)
- Concise over verbose

### Workflow
- Session-start at beginning
- Audit before commit (not after)
- Quality obsessed (QA tool mandatory)
- File organization critical ("no rogue files")

---

## Identified Pain Points (Not Yet Addressed)

### High Priority
1. **Testing Automation** - Manual test running repetitive
   - Frequency: Multiple times per session
   - Candidate: Testing Specialist agent

2. **Performance Bottlenecks** - Slow queries, N+1 problems
   - Frequency: Periodic issue
   - Candidate: Performance Optimizer agent

### Medium Priority
3. **Refactoring Opportunities** - Code smells accumulate
   - Frequency: Discovered during audits
   - Candidate: Refactoring Specialist agent

4. **Documentation Drift** - Docs fall behind code
   - Frequency: After major features
   - Candidate: Documentation Specialist agent

### Low Priority
5. **Deployment Process** - Manual steps to deploy
   - Frequency: Less frequent
   - Candidate: Deployment Manager agent

---

## Architecture Decisions (Historical)

### Why Three Layers?
- **ai_brain** = Data only (no views, no controllers)
- **ai_sam** = Framework (controllers, canvas core)
- **branches** = Features (independent siblings)
- **Reason:** Separation of concerns, clear boundaries

### Why Canvas Skeleton Pattern?
- **ONE core, MANY skins**
- **Universal** canvas core (platform-agnostic)
- **Specific** platform renderers
- **Reason:** Scalability, no platform bleeding

### Why Odoo 18?
- **Modern OWL framework** (no jQuery)
- **list not tree** (breaking change from 17)
- **Version format:** 18.0.x.y required
- **Reason:** Latest stable, modern JS

---

## Recurring Questions (FAQ)

### "Where does this file go?"
Decision matrix:
- Data model → ai_brain/models/
- Controller → ai_sam/controllers/ or branch
- Experiment → claudes floating files/

### "Do I need security rules?"
Always YES for custom models.
File: security/ir.model.access.csv

### "Can platforms import each other?"
NO. Forbidden. Platforms are siblings.
Only import from ai_brain or ai_sam.

### "Skeleton vs Canvas naming?"
ALWAYS use "canvas" now.
"skeleton" is legacy, deprecated.

---

## Agent Creation Patterns (Emerged)

### Pattern 1: Color Coding
- Blue = Audit/Analysis
- Green = Implementation
- Yellow = Planning
- Purple = Automation
- Red = Enforcement
- Cyan = Meta/Support

### Pattern 2: Tool Selection
- Advisors: Read, Grep, Glob, Write (no Bash, no Edit)
- Implementers: All tools
- Gatekeepers: Read-only + Write (reports)

### Pattern 3: Knowledge Files
- Always 4-5 files
- 100-500 lines each
- Scannable structure (headings, symbols)
- Examples over explanations

### Pattern 4: Workflow Phases
- Successful agents have 5-7 phases
- Each phase: Goal → Steps → Output
- Clear decision points
- Explicit handoffs

---

## Integration Patterns (Ecosystem)

### Sequential Flow (Most Common)
```
session-start → architect → developer → check-core → audit → git-push
```

### Quality Loop
```
developer → audit (fail) → developer (fix) → audit (pass)
```

### Boundary Validation
```
developer → check-core → developer (if violations)
```

---

## Failed Experiments (Learn From)

### Attempt 1: God Agent
**Tried:** One agent that plans, codes, tests, commits
**Result:** Confusing, role ambiguity
**Lesson:** Specialize agents, clear roles

### Attempt 2: 10+ Knowledge Files
**Tried:** Comprehensive documentation per agent
**Result:** Overwhelming, agent couldn't scan effectively
**Lesson:** 4-5 focused files optimal

---

## User Vocabulary (Terms User Uses)

- "Rogue files" = Files not in correct location
- "Skeleton" = Old naming (now "canvas")
- "Platform bleeding" = Platform code in canvas core
- "Painfully learned" = Lesson from mistakes (capture immediately)
- "Rockstar developer" = Elite quality standard
- "ONE core, MANY skins" = Canvas architecture motto
- "The dreamer" = User's role
- "Implementation specialist" = Agent's role

---

## Success Metrics (What User Values)

### Agent Quality
- QA tool passes (100% before handover)
- Clear role boundaries
- Consistent behavior
- Time/effort saved measurable

### Code Quality
- /10 scoring system (from odoo-audit)
- Zero architectural violations
- Clean file organization
- Pride in workmanship

### Workflow
- Fast handoffs between agents
- No repeated questions
- Smooth integration
- Context maintained

---

## Next Agent Predictions (Based on Patterns)

### Likely Next Requests
1. Testing Specialist (mentioned 3+ times)
2. Performance Optimizer (pain point identified)
3. Refactoring Specialist (audit findings)

### User Preferences for New Agents
- Will want Socratic questioning first (fresh mode)
- Will expect 4-5 knowledge files
- Will demand clear archetype
- Will test thoroughly before accepting

---

## Notes for Future Recruiter Sessions

### When User Says "I'm Sick of..."
→ Strong agent candidate (pain point clear)

### When User Corrects Workflow
→ Update this memory file (like audit before git-push)

### When User Asks "Can We Create..."
→ Run recruitment criteria (7 questions)

### When Session Ends Successfully
→ Append to agent creation history
→ Update user preferences if new pattern emerges

---

## Memory Maintenance

### Update Triggers
- [ ] After every agent creation
- [ ] When user corrects something
- [ ] When new pain point identified
- [ ] When architecture decision made
- [ ] When user preference emerges

### Review Schedule
- Every 5 agents created
- Monthly review (prune outdated)
- When major architecture change

---

## Meta-Observations (Recruiter Learning)

### Pattern 1: User Knows What They Want
- Pain points are clear and specific
- Architecture decisions are well-reasoned
- Quality standards are high
- → Trust user's instincts, guide don't dictate

### Pattern 2: Incremental Evolution
- Each agent builds on previous
- Ecosystem grows organically
- Patterns emerge naturally
- → Default mode is preferred for expansion

### Pattern 3: Fresh Perspective Valued
- User asked for "fresh mode" explicitly
- Values being challenged
- Wants assumptions questioned
- → Fresh mode for strategic decisions

### Pattern 4: Documentation Matters
- User frustrated by repeated explanations
- Wants knowledge captured immediately
- Values "painfully learned lessons"
- → Memory file serves as living documentation

---

**End of Session Memory**

*This file is read by recruiter in DEFAULT mode only.*
*FRESH mode ignores this file completely.*

---

*End of Knowledge Base*
