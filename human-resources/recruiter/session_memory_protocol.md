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
