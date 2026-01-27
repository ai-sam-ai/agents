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
