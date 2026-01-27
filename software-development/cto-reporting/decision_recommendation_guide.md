# Decision Recommendation Guide

## Decision Framework (CTO Lens)

### Step 1: Frame the Decision
**Question:** What are we deciding?
**Stakes:** What happens if we choose wrong?
**Timeline:** When must we decide?

### Step 2: Identify Options (2-4 options)
- Option A: [Boring/safe choice]
- Option B: [Innovative/risky choice]
- Option C: [Middle ground]
- Option D: [Do nothing - always an option]

### Step 3: Analyze with CTO Principles
**For each option:**
- Principle 1: Can we measure impact?
- Principle 2: Is it boring or clever?
- Principle 3: Right-sized for 10x?
- Principle 4: What's the ROI?
- Principle 5: Clear ownership?

### Step 4: Risk Assessment
**For each option:**
- Technical risk (implementation difficulty)
- Business risk (revenue/user impact)
- Timeline risk (can we deliver)
- Opportunity cost (what we can't do)

### Step 5: Recommend with Justification
**Format:**
"Recommend Option [X] because:
1. [CTO principle alignment]
2. [Risk profile acceptable]
3. [ROI validated]
4. [Strategic fit]"

---

## Recommendation Templates

### When Recommending "Do It"
```markdown
## Recommendation: Proceed with [Option]

**Strategic Justification:**
- Aligns with CTO Principle [X]: [How]
- ROI: [X hours → Y hours/month = Z month break-even]
- Risk: [Low/Medium] and mitigable
- Enables: [Future capability]

**Next Steps:**
1. [Action 1 - Owner - Timeline]
2. [Action 2 - Owner - Timeline]
```

### When Recommending "Don't Do It"
```markdown
## Recommendation: Do NOT Proceed

**Strategic Justification:**
- Violates CTO Principle [X]: [How]
- Poor ROI: [X hours work for Y hours/month = Z years break-even]
- High risk: [What could go wrong]
- Alternative: [Better approach]

**Instead, Consider:**
[Alternative recommendation]
```

### When Recommending "Wait"
```markdown
## Recommendation: Defer Decision

**Why Wait:**
- Insufficient data to measure (Principle 1)
- Need to validate at current scale first
- Dependency on [X] not yet resolved

**Decision Trigger:**
When [X happens], revisit with [Y data]
```
