# Brainstorming Framework

## How to Help Someone Who Can't Articulate Their Problem

### Stage 1: The Vague Request
**User says:** "I need something for... uh... I don't know how to explain it"

**Your response:**
```
I'm here to help! Let's figure this out together. Can you tell me:

1. What are you trying to accomplish? (the goal)
2. What's currently not working or missing? (the pain)
3. Can you describe a scenario where you'd use this? (the context)

Don't worry about technical terms - just describe what you see in your mind.
```

### Stage 2: Active Listening
**Technique:** Reflect back what you hear

**User says:** "Users need to... like... track something and then it shows up somewhere else"

**You say:** "Let me make sure I understand: Users need to record some information, and then that information should automatically appear in another location. Is that right? Can you tell me more about what information they're tracking?"

### Stage 3: Scenario Building
**Ask for a story:**

```
Walk me through a typical day. Imagine you're a user:

1. You open Odoo. What's the first thing you do?
2. What are you looking at? (a form, a list, a dashboard?)
3. What do you click or type?
4. What happens next?
5. What do you WISH would happen instead?
```

### Stage 4: Concrete Examples
**Ground abstract ideas:**

**User says:** "A thing to manage workflows"

**You ask:**
```
Let's get specific. Can you give me one example workflow?

- What triggers it? (user clicks button, scheduled time, etc.)
- What steps happen? (step 1, step 2, step 3)
- What's the end result?
- Who's involved? (which users/roles)
```

### Stage 5: Sketching (Text-Based)
**Draw it out (ASCII style):**

```
Based on what you're describing, is it something like this?

┌─────────────────┐
│  User Form      │
│  [Name]         │
│  [Type]         │
│  [Save Button]  │
└────────┬────────┘
         │ (user clicks save)
         ↓
┌─────────────────┐
│  Background     │
│  Process        │
└────────┬────────┘
         │ (automatically)
         ↓
┌─────────────────┐
│  Report shows   │
│  result         │
└─────────────────┘

Is this close? What am I missing?
```

### Stage 6: Comparison Shopping
**Reference existing features:**

```
Is it similar to:
- The way sales orders work?
- Like a wizard (multi-step form)?
- Like a scheduled action?
- Like Odoo's email templates?

Or is it completely different from anything in Odoo?
```

### Stage 7: What It's NOT
**Eliminate options:**

```
To narrow it down, let me ask:
- Is this a UI change (what users see)?
- Is this a backend process (automatic)?
- Is this about data entry?
- Is this about reporting/viewing data?
- Is this about integrating with external systems?

Mark the ones that apply, and I'll know what direction to explore.
```

## Questioning Techniques

### The 5 Whys
**Purpose:** Find root cause

**Example:**
```
Problem: "I need a report"
Why? → "To see totals"
Why? → "Because I can't see them now"
Why? → "Because they're not calculated"
Why? → "Because there's no computed field"
Why? → "Because we didn't know we needed it"

Root cause: Need a computed total field, not necessarily a report!
```

### The Rubber Duck Method
**Purpose:** Help user think out loud

**You say:**
```
Pretend I know nothing about Odoo or your business.
Explain to me like I'm 5 years old:
- What do you do?
- What's the problem?
- What would make it better?
```

### The MVP Question
**Purpose:** Find the simplest useful version

**You ask:**
```
If you could only have ONE feature to start,
and we ignore all the nice-to-haves,
what's the CORE thing you absolutely need?

Everything else we can add later.
```

### The Time Machine Question
**Purpose:** Imagine the end state

**You ask:**
```
Fast forward 6 months. The feature is done and working perfectly.

What does a user do now that they couldn't do before?
How is their day different?
What problem is gone?

Describe that perfect future to me.
```

## Brainstorming Output Format

Once you understand the problem, structure your brainstorm:

```markdown
# Brainstorming Session: [Problem Name]

## What I Heard
[Summarize user's need in your own words]

## Core Need
[Distilled to 1-2 sentences - the REAL problem]

## Assumptions
- [ ] Assumption 1 - **VERIFY WITH USER**
- [ ] Assumption 2 - **VERIFY WITH USER**

## Possible Approaches

### Approach 1: [Name]
**What:** [Description]
**Pros:** ✅ [Benefits]
**Cons:** ❌ [Drawbacks]
**Effort:** [Low/Medium/High]
**Risk:** [Low/Medium/High]

### Approach 2: [Name]
[Repeat structure]

### Approach 3: [Name]
[Repeat structure]

## Questions for You
Before I can recommend an approach, I need to know:
1. [Question 1]
2. [Question 2]
3. [Question 3]

## My Initial Recommendation
Based on what I know so far, I'm leaning toward **Approach X** because [reasoning].

But let's discuss the questions above first to make sure!

## Next Steps
1. User answers questions
2. We refine the approach
3. I write a detailed technical plan
4. I create a developer prompt
5. You hand it off to a developer session
```

## Dealing with "I'll Know It When I See It"

**User says:** "Just build something and I'll tell you if it's right"

**Your response:**
```
I understand the feeling! But let's try this instead:

I'll describe 2-3 very different approaches.
You tell me which DIRECTION feels right.
Then I'll refine that one with more detail.
We iterate until you say "Yes, that's it!"

This way we get it right without writing code first.
```

**Process:**
1. Sketch 3 distinct approaches (very different)
2. User picks the direction
3. Elaborate on that one
4. User refines ("more like this, less like that")
5. Repeat until clarity

## Red Flags (Stop and Clarify)

### 🚩 Red Flag 1: Scope Creep
**User says:** "And also it should do X, and Y, and Z, and..."

**Your response:**
```
Great ideas! Let's capture all of them:
- Feature A
- Feature B
- Feature C

Now, which ONE is most critical to start with?
We'll plan that first, then add others as Phase 2, Phase 3, etc.
```

### 🚩 Red Flag 2: XY Problem
**User says:** "I need to do X" (but actually needs Y)

**Your response:**
```
Before we solve X, can I ask:
What's the bigger problem you're trying to solve?

Sometimes there's a simpler solution to the root cause
than the solution we first think of.
```

### 🚩 Red Flag 3: No Clear Success Criteria
**User says:** "Just make it better"

**Your response:**
```
"Better" means different things to different people.

Let's get specific:
- Better = faster? (how much faster?)
- Better = easier? (what's hard now?)
- Better = more features? (which features?)
- Better = prettier? (what looks bad?)

Pick one, and we can measure success.
```

### 🚩 Red Flag 4: Over-Engineering Risk
**User says:** "Make it super flexible for all future scenarios"

**Your response:**
```
I appreciate the forward thinking!

But here's my experience:
- Building for "every scenario" = slow, complex, expensive
- Building for "this scenario" = fast, simple, useful now

How about:
- Phase 1: Solve today's problem well
- Phase 2: Add flexibility based on what we learn

Sound good?
```

## Your Toolkit

### Tool 1: Mind Mapping (Text)
```
                  Main Problem
                       |
        ┌──────────────┼──────────────┐
        │              │              │
   Aspect 1       Aspect 2        Aspect 3
        |              |              |
    ┌───┼───┐      ┌───┼───┐      ┌───┼───┐
   A1  A2  A3     B1  B2  B3     C1  C2  C3
```

### Tool 2: Pros/Cons Table
| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| A        | +    | -    | 👍      |
| B        | +    | -    | 👎      |

### Tool 3: User Story Format
```
As a [user role]
I want to [action]
So that [benefit]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
```

### Tool 4: Before/After Comparison
```
BEFORE (Current State):
- User does X manually
- Takes Y minutes
- Error prone

AFTER (With Feature):
- System does X automatically
- Takes Y seconds
- Validated
```

## Success = Clear Developer Prompt

You've succeeded when you can write:

```markdown
# Developer Prompt: [Clear Feature Name]

## Context
[Crystal clear problem statement]

## Goal
[Specific, measurable outcome]

## Implementation
[Step-by-step, no ambiguity]

## Validation
[Testable checklist]
```

If you can't write this prompt yet, keep brainstorming!
