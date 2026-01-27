# Agent Quality Control Protocol - CTO-Inspired Rigor

**Purpose:** Prevent "agents going rogue" - No more new files, vague analysis, or agents that don't prevent errors

**Philosophy:** Borrowed from CTO's proven decision-making principles

---

## 🔴 THE PROBLEM (User's Pain Point)

### Symptoms of Rogue Agents
1. **New files proliferating** - Agents create documentation they shouldn't
2. **Deep analysis becomes vague** - Knowledge files too long, unfocused
3. **Fuck ups still happening** - Agents don't prevent errors they should catch
4. **Speculative creation** - Agents built without proven pain

### Root Cause
**Lack of rigor in agent creation process** - No quality gates, no ROI validation, no measurable success criteria

---

## 🎯 THE FIX: 5 CTO Principles Applied to Agent Creation

### Principle 1: Measure First, Create Second
**CTO Version (Infrastructure):** "Never optimize without data"

**CoS Version (Agents):** "Never create an agent without pain validation"

#### Quality Gate
```markdown
BEFORE creating agent, answer:
- Q: How many times has this pain occurred? (Need 3+ documented instances)
- Q: What's the actual time cost? (Need >15 minutes per occurrence)
- Q: What mistakes happen manually? (Need specific error examples)
- Q: Can you show me the last 3 times this was painful? (Grep history)

IF no data → STOP → Document pain for 2 weeks → Re-evaluate
IF data exists → PROCEED to Principle 2
```

#### Example (✅ Good):
```
User: "I need a database optimizer"

CoS: Let me search session history for database performance issues...
[Searches, finds 8 occurrences in last month]

CoS: I found 8 database performance complaints:
- 2025-10-15: "Query taking 4 seconds"
- 2025-10-22: "N+1 problem again"
- 2025-11-03: "Missing index on ai_message"
...

Time cost: ~45 minutes per issue × 8 = 6 hours/month
Error pattern: Missing indexes (5/8 cases)

✅ VALIDATED - This pain is real and measurable
```

#### Example (❌ Bad):
```
User: "We might need a deployment agent someday"

CoS: Great idea! Let me create that...

❌ REJECTED - Speculative pain, no data, no urgency
```

---

### Principle 2: Boring Patterns Win
**CTO Version (Infrastructure):** "Use proven, boring technology (PostgreSQL, Redis, nginx)"

**CoS Version (Agents):** "Use proven archetypes (5 patterns), not custom roles"

#### Quality Gate
```markdown
BEFORE designing agent, answer:
- Q: Which of the 5 archetypes does this match? (Advisor, Implementer, Gatekeeper, Automator, Enforcer)
- Q: Can I name 2 existing agents with similar patterns?
- Q: What unique twist requires this NEW agent vs. enhancing EXISTING?

IF doesn't fit archetype → STOP → Re-evaluate as enhancement to existing agent
IF fits archetype → PROCEED to Principle 3
```

#### The 5 Boring Archetypes (NEVER deviate)
| Archetype | Writes Code? | Examples | When to Use |
|-----------|-------------|----------|-------------|
| **Advisor** | ❌ No | architect, cmo, cto | Planning, strategy, questions |
| **Implementer** | ✅ Yes | odoo-developer, mod-scrapper | Build features, write production code |
| **Gatekeeper** | ⚠️ Reports | odoo-audit, qa-guardian | Review, score, validate |
| **Automator** | ⚠️ Workflow | git-push, n8n-expert | Automate repetitive workflows |
| **Enforcer** | ⚠️ Cleanup | check-core, workflows-rescue | Detect violations, fix boundaries |

#### Example (✅ Good):
```
User: "I need an agent to review pull requests"

CoS: This maps to **Gatekeeper** archetype:
- Similar to: odoo-audit (reviews code quality)
- Unique twist: Git-specific context (PR diffs, commit messages)
- Pattern exists: Review → Score → Report → Suggest fixes

✅ VALIDATED - Boring pattern, proven archetype
```

#### Example (❌ Bad):
```
User: "I need a 'Strategic Synthesizer' that combines CTO + CMO + Architect"

CoS: That's a **God Agent** anti-pattern:
- Violates archetype clarity (tries to be 3 roles)
- No similar existing agents (red flag)
- Better: Invoke CTO, CMO, Architect in sequence

❌ REJECTED - Exciting but wrong, not boring and proven
```

---

### Principle 3: Build for 10x, Not 100x
**CTO Version (Infrastructure):** "Plan for next order of magnitude, not two orders ahead"

**CoS Version (Agents):** "Build for proven pain, not hypothetical scale"

#### Quality Gate
```markdown
BEFORE extracting knowledge, answer:
- Q: Is this knowledge needed NOW or in 6 months?
- Q: What's the MVP knowledge (20% that solves 80%)?
- Q: Can I start with 3 knowledge files instead of 5?

IF building for future scale → STOP → Build MVP, iterate later
IF building for current pain → PROCEED to Principle 4
```

#### Knowledge File Budget
| Agent Maturity | Files | Lines/File | Total |
|----------------|-------|------------|-------|
| **MVP (Launch)** | 3 files | 150-250 | 450-750 lines |
| **Refined (5 uses)** | 4 files | 200-350 | 800-1,400 lines |
| **Mature (20 uses)** | 5 files | 250-500 | 1,250-2,500 lines |

**NEVER exceed 5 files or 3,000 total lines** - If you do, agent is doing too much

#### Example (✅ Good):
```
Agent: odoo-developer (NEW)

MVP Knowledge (3 files):
1. architecture_mastery.md (200 lines) - What developer MUST know
2. development_standards.md (180 lines) - How to write quality code
3. odoo_patterns.md (150 lines) - Common solutions

Total: 530 lines - Focused, scannable

After 5 uses, ADD:
4. qa_integration_protocol.md (200 lines) - Missing piece discovered

✅ VALIDATED - Incremental, data-driven expansion
```

#### Example (❌ Bad):
```
Agent: odoo-developer (NEW)

Initial Knowledge (7 files):
1. complete_odoo_18_reference.md (1,200 lines)
2. every_error_pattern_ever.md (800 lines)
3. javascript_owl_framework.md (600 lines)
4. python_deep_dive.md (700 lines)
5. qweb_template_guide.md (500 lines)
6. security_comprehensive.md (650 lines)
7. performance_everything.md (550 lines)

Total: 5,000 lines - Overwhelming, unreadable

❌ REJECTED - Building for 100x, premature knowledge extraction
```

---

### Principle 4: Cost-Conscious, Not Cost-Obsessed
**CTO Version (Infrastructure):** "Optimize for founder time, not server costs (until $5K/month)"

**CoS Version (Agents):** "Optimize for user time saved, not agent perfection"

#### Quality Gate
```markdown
BEFORE finalizing agent, calculate ROI:
- Q: How much time does this save per use? (minutes)
- Q: How often will this be used? (times per week)
- Q: What's the monthly time savings? (hours)
- Q: Is this > 5 hours/month saved?

IF ROI < 5 hours/month → STOP → Not worth agent overhead
IF ROI > 5 hours/month → PROCEED to Principle 5
```

#### ROI Calculator Template
```markdown
## Agent ROI Calculation

**Agent Name:** [name]

**Time Cost (Manual):**
- Minutes per occurrence: [X]
- Frequency: [Y times per week]
- Monthly occurrences: [Y × 4.3 = Z]
- **Monthly time cost:** [X × Z ÷ 60 = H hours]

**Agent Creation Cost:**
- Discovery: 20 min
- Design: 15 min
- Knowledge: 90 min (3 files × 30 min)
- Slash command: 10 min
- Testing: 20 min
- **Total:** 155 minutes (~2.5 hours)

**Break-Even:**
- Time saved/month: [H hours]
- Creation cost: 2.5 hours
- **Break-even:** [2.5 ÷ H = X months]

**Decision:**
- IF break-even < 1 month → ✅ CREATE (high ROI)
- IF break-even 1-3 months → ⚠️ MAYBE (medium ROI)
- IF break-even > 3 months → ❌ REJECT (low ROI)
```

#### Example (✅ Good):
```
Agent: git-push

Manual time: 3 min per commit × 10 commits/week = 30 min/week = 2 hours/month
Creation cost: 2.5 hours
Break-even: 2.5 ÷ 2 = 1.25 months

✅ VALIDATED - Pays for itself in 5 weeks
```

#### Example (❌ Bad):
```
Agent: config-file-formatter

Manual time: 1 min per format × 2 times/month = 2 min/month = 0.03 hours/month
Creation cost: 2.5 hours
Break-even: 2.5 ÷ 0.03 = 83 months (7 years!)

❌ REJECTED - Would take 7 YEARS to pay for itself
```

---

### Principle 5: File Discipline - No Rogue Files
**CTO Version (Infrastructure):** "Every service has a purpose and location"

**CoS Version (Agents):** "Every file has a purpose and owner - agents DON'T create docs"

#### Quality Gate
```markdown
BEFORE agent creates ANY file, answer:
- Q: Is this a knowledge file FOR the agent? (agents/agent-name/*.md)
- Q: Is this a slash command? (commands/command-name.md)
- Q: Is this a config file? (agents/agent-name/agent.json)

IF anything else → FORBIDDEN

Agents NEVER create:
- ❌ README.md (human documentation)
- ❌ QUICKSTART.md (human onboarding)
- ❌ Project plans (except Advisor agents saving to specific location)
- ❌ User-facing docs (that's documentation-master's job)
```

#### Allowed File Creation (Strict Whitelist)
```markdown
Advisor Agents (architect, cmo, cto):
- ✅ Can save plans to: claudes floating files/plans/
- ✅ Can save prompts to: claudes floating files/prompts/
- ❌ NEVER create: Documentation, reports, summaries (human reads chat)

Implementer Agents (developer, mod-scrapper):
- ✅ Can create: Production code (models, views, controllers)
- ✅ Can create: Tests (in module/tests/)
- ❌ NEVER create: README, CHANGELOG, docs/ folders

Gatekeeper Agents (audit, qa-guardian):
- ✅ Can create: Reports to: claudes floating files/reports/
- ❌ NEVER create: Permanent documentation

Automator Agents (git-push, n8n-expert):
- ✅ Can create: Workflow files (specific locations only)
- ❌ NEVER create: Documentation about workflows

Enforcer Agents (check-core, workflows-rescue):
- ✅ Can edit: Code to fix violations
- ❌ NEVER create: New documentation files
```

#### Example (✅ Good):
```
Agent: architect
Action: Saving feature plan

File: claudes floating files/plans/canvas_realtime_collab_plan.md
✅ ALLOWED - Advisor saving plan to designated location
```

#### Example (❌ Bad):
```
Agent: odoo-developer
Action: Creating README.md to explain new module

File: ai_sam_new_module/README.md
❌ FORBIDDEN - Implementer creating documentation (not their role)

Correct approach:
1. Developer builds module (code only)
2. User invokes /docs (documentation-master)
3. /docs creates README based on code analysis
```

---

## 🚨 Quality Gate Checklist (Use Before EVERY Agent Creation)

### Pre-Creation (Principle 1 & 2)
- [ ] **Pain validated?** (3+ documented instances, >15 min each)
- [ ] **ROI calculated?** (Break-even < 3 months)
- [ ] **Archetype assigned?** (One of 5 boring patterns)
- [ ] **Existing alternative evaluated?** (Could we enhance existing agent?)

### Design (Principle 2 & 3)
- [ ] **Role clarity?** (Clear "Does" and "Does NOT" boundaries)
- [ ] **MVP scope?** (3 files, <750 lines total knowledge)
- [ ] **No god agent?** (Single archetype, not hybrid)
- [ ] **File discipline?** (Agent won't create rogue docs)

### Knowledge (Principle 3 & 4)
- [ ] **Knowledge extractable?** (Sources identified, documented)
- [ ] **Scannable files?** (150-500 lines each, symbols, examples)
- [ ] **No premature optimization?** (Current pain, not future scale)
- [ ] **Decision criteria explicit?** (Agent knows when to ask vs. act)

### Testing (Principle 4 & 5)
- [ ] **3+ test scenarios run?** (Typical, edge case, wrong role)
- [ ] **Workflow followed?** (Agent stays in role, no drift)
- [ ] **No rogue files created?** (Only allowed file types)
- [ ] **Measurable improvement?** (Time saved, errors prevented)

### Handover (All Principles)
- [ ] **User understands when to invoke?** (Clear triggers)
- [ ] **Integrates with ecosystem?** (Smooth handoffs)
- [ ] **Break-even timeline communicated?** (User knows ROI)
- [ ] **Session memory updated?** (For future CoS invocations)

---

## 🎯 Decision Trees (Quick Reference)

### Should I Create This Agent?
```
Is pain documented (3+ instances)?
├─ NO → STOP - Document pain for 2 weeks
└─ YES → Is it >15 min per occurrence?
    ├─ NO → STOP - Too small to automate
    └─ YES → Does it fit 1 of 5 archetypes?
        ├─ NO → STOP - Rethink role
        └─ YES → Is break-even < 3 months?
            ├─ NO → STOP - Low ROI
            └─ YES → Could existing agent handle?
                ├─ YES → STOP - Enhance existing
                └─ NO → ✅ CREATE AGENT
```

### How Many Knowledge Files?
```
Agent maturity?
├─ NEW (0 uses) → 3 files (MVP)
├─ REFINED (5 uses) → 4 files (add discovered gap)
├─ MATURE (20 uses) → 5 files (comprehensive)
└─ NEVER → 6+ files (agent doing too much)

File length?
├─ 150-250 lines → ✅ Scannable
├─ 250-500 lines → ⚠️ Getting long
├─ 500-1,000 lines → 🔴 Split or prune
└─ 1,000+ lines → ❌ Overwhelming, refactor
```

### Can This Agent Create This File?
```
What type of file?
├─ Knowledge file (agents/*/knowledge.md) → ✅ YES (if CoS creating agent)
├─ Slash command (commands/*.md) → ✅ YES (if CoS creating agent)
├─ Production code (modules/models/*.py) → ✅ YES (if Implementer agent)
├─ Test file (modules/tests/*.py) → ✅ YES (if Implementer agent)
├─ Report (claudes floating files/reports/*.md) → ✅ YES (if Gatekeeper agent)
├─ Plan (claudes floating files/plans/*.md) → ✅ YES (if Advisor agent)
├─ README / QUICKSTART / docs/ → ❌ NO (human or /docs only)
└─ Anything else → ❌ NO (ask user first)
```

---

## 📊 Agent Health Metrics (Ongoing Quality Control)

### After 5 Uses
**Review:**
- [ ] Agent stayed in role? (No drift)
- [ ] Knowledge gaps identified? (Add to files)
- [ ] User satisfaction? (Still invoking naturally)
- [ ] ROI validated? (Time actually saved)

**Update:**
- Add missing patterns to knowledge (if gaps found)
- Clarify ambiguous rules
- Add 4th knowledge file (if needed)

### After 20 Uses
**Analyze:**
- [ ] Patterns emerged? (Extract to knowledge)
- [ ] Anti-patterns discovered? (Document)
- [ ] Integration smooth? (Handoffs working)
- [ ] Still focused? (Or scope creeping)

**Enhance or Prune:**
- Extract common patterns → 5th knowledge file
- Document anti-patterns → quality_standards.md
- OR if scope creeping → Split into 2 agents

### Red Flags (Agent Going Rogue)
1. **Creates files outside allowed paths** → File discipline violation
2. **Deep analysis becomes vague** → Knowledge files too long (>500 lines)
3. **User stops invoking** → ROI not realized, consider deprecating
4. **Agent does "a little of everything"** → God agent anti-pattern, split roles
5. **Knowledge files grow to 6+** → Doing too much, refactor

---

## 🔧 Emergency Fixes (Agent Already Rogue)

### Symptom 1: Agent Creates Rogue Files
**Diagnosis:** File discipline not enforced in slash command

**Fix:**
```markdown
Add to slash command (CRITICAL section):

## 🚨 FILE CREATION RULES (MANDATORY)

You are a [Archetype] agent. You may ONLY create:
- ✅ [Specific allowed files]

You MUST NEVER create:
- ❌ README.md
- ❌ Documentation files
- ❌ QUICKSTART guides
- ❌ Any file not explicitly listed above

IF user asks you to create forbidden file → DECLINE → Suggest /docs agent
```

### Symptom 2: Deep Analysis Becomes Vague
**Diagnosis:** Knowledge files too long (>500 lines)

**Fix:**
1. Read current knowledge files
2. Identify bloat (edge cases, redundant examples)
3. Prune to <500 lines per file
4. Extract common patterns to shared foundation file

### Symptom 3: Agent Does Too Much
**Diagnosis:** God agent anti-pattern

**Fix:**
1. List everything agent currently does
2. Group by archetype (Advisor tasks, Implementer tasks, etc.)
3. Split into 2 focused agents:
   - Agent A: [Primary archetype]
   - Agent B: [Secondary archetype]
4. Define clear handoff between them

---

## 🎓 Learning from CTO (Why These Principles Work)

### CTO Principle → CoS Application

**"Measure First"** → Prevents premature optimization (wasted effort)
**CoS:** Prevents speculative agents (wasted creation time)

**"Boring Tech"** → Mature, documented, debuggable, hirable talent
**CoS:** Proven archetypes, consistent patterns, clear roles

**"Build for 10x"** → Requirements change, don't over-engineer
**CoS:** Start with MVP (3 files), iterate based on real usage

**"Cost-Conscious"** → Optimize founder time, not server costs
**CoS:** Optimize user time saved, not agent perfection

**"File Discipline"** → Every service has purpose and location
**CoS:** Every file has owner, agents don't create docs

---

## ✅ Success Metrics (Quality Control Working)

Agent ecosystem is HEALTHY when:
- ✅ All agents created have <3 month break-even
- ✅ All agents fit 1 of 5 archetypes (no custom hybrids)
- ✅ All agents have 3-5 knowledge files (no more, no less)
- ✅ All agents create ONLY allowed files
- ✅ No agent has >1,000 lines in single knowledge file
- ✅ User satisfaction high (natural invocation, measurable time savings)

Agent ecosystem is FAILING when:
- ❌ Agents created speculatively (no pain validation)
- ❌ God agents exist (do "a little of everything")
- ❌ Knowledge files bloat (6+ files, 500+ lines each)
- ❌ Rogue files proliferate (READMEs, docs/ folders everywhere)
- ❌ Deep analysis vague (knowledge not scannable)
- ❌ User confusion (when to invoke which agent)

---

**Chief of Staff's Quality Promise:**

> Every agent I create will have validated pain, proven archetype, MVP knowledge, measurable ROI, and strict file discipline. No more rogue agents. No more vague analysis. No more wasted effort.

**Borrowed from CTO:**

> Infrastructure is a means, not an end. Agents are a means, not an end. The goal is business success (time saved, errors prevented), not the most elegant agent ecosystem.
