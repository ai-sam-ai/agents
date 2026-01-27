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
