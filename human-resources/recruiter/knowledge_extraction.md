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
