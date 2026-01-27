# Data Flow Scoring Criteria

> **Standard:** Every diagram must achieve 10/10 before considered complete

---

## Scoring Scale

| Score | Meaning | Action |
|-------|---------|--------|
| 10/10 | Perfect - Production ready | None needed |
| 9/10 | Excellent - Minor polish | Quick fixes |
| 8/10 | Good - Missing some details | Add content |
| 7/10 | Acceptable - Noticeable gaps | Significant additions |
| 6/10 | Below standard - Multiple issues | Major revision |
| <6/10 | Unacceptable | Near rewrite |

---

## DIAGRAM.md Scoring (Visual)

### 10/10 Requirements

| Criterion | Weight | 10/10 Standard |
|-----------|--------|----------------|
| **Mermaid Syntax** | 15% | Renders perfectly, no errors |
| **Accuracy** | 25% | 100% match with SCHEMA (endpoints, models, methods) |
| **Completeness** | 20% | Every step in flow shown, no gaps |
| **Clarity** | 20% | Anyone can understand at a glance |
| **Styling** | 10% | SAM AI colors, proper node shapes |
| **Cross-refs** | 10% | Links to DETAIL, SCHEMA files |

### Scoring Examples

**10/10:**
```markdown
# Conversation API Flow - Diagram

> **Scope:** Client message → SAM response
> **Modules:** ai_sam_base
> **Last Updated:** 2024-01-25

## Visual Diagram

\`\`\`mermaid
sequenceDiagram
    participant C as Client
    participant Ctrl as ChatController
    participant Conv as ai.sam.conversation
    participant Msg as ai.sam.message
    participant AI as AIProvider

    C->>+Ctrl: POST /api/sam/chat/message
    Ctrl->>Conv: get_or_create()
    Conv->>+Msg: create(content)
    Msg->>+AI: generate_response()
    AI-->>-Msg: response
    Msg-->>-Conv: message_record
    Conv-->>Ctrl: conversation_data
    Ctrl-->>-C: {"message_id": 123}
\`\`\`

## Related Documentation
- [ai_sam_base SCHEMA](../../04_modules/ai_sam_base/ai_sam_base_SCHEMA.md)
- [Detailed Walkthrough](./conversation_api_flow_DETAIL.md)
```

**7/10:**
- Diagram renders but missing 2 steps
- Uses generic participant names ("Server" instead of model)
- No color coding
- Missing related documentation links

**5/10:**
- Mermaid syntax errors (won't render)
- Endpoint names don't match SCHEMA
- Half the steps missing
- No context or scope

---

## DETAIL.md Scoring (Explanation)

### 10/10 Requirements

| Criterion | Weight | 10/10 Standard |
|-----------|--------|----------------|
| **Completeness** | 25% | Every diagram step has explanation |
| **Code References** | 20% | Actual file:line for each step |
| **Data Transformations** | 20% | Input/output format for each step |
| **Error Handling** | 15% | All error cases documented |
| **Cross-refs** | 10% | Links to diagram, SCHEMA files |
| **Readability** | 10% | Developer can follow without prior knowledge |

### Scoring Examples

**10/10:**
```markdown
### Step 3: Create Message Record

**What happens:**
The conversation model creates a new message record with the user's content,
associates it with the conversation, and triggers AI processing.

**Code location:**
`ai_sam_base/models/sam_message.py:L145-L168`

**Data transformation:**
- Input: `{"content": "Hello SAM", "conversation_id": 42}`
- Output: `ai.sam.message` record with fields:
  - `id`: Auto-generated
  - `content`: User message
  - `role`: "user"
  - `conversation_id`: FK to conversation
  - `create_date`: Current timestamp

**Validation:**
- Content must be non-empty
- Conversation must exist and belong to user
- User must have permission
```

**7/10:**
- Steps explained but vaguely ("the message is created")
- No code references
- Input/output not specified
- Basic error handling

**5/10:**
- Missing several step explanations
- No code references at all
- No data transformation info
- No error handling section

---

## Accuracy Verification Scoring

### Against SCHEMA.md

| Check | Points | How to Verify |
|-------|--------|---------------|
| Endpoint routes | 2 | Compare with SCHEMA API section |
| HTTP methods | 1 | GET/POST/PUT/DELETE match |
| Auth requirements | 1 | public/user match |
| Model names | 2 | Exact match with SCHEMA |
| Field names | 2 | Used fields exist in SCHEMA |
| Relationships | 2 | Match SCHEMA erDiagram |

**Total: 10 points**

**Deductions:**
- -2 for each wrong endpoint
- -2 for each wrong model name
- -1 for each wrong field
- -1 for each wrong relationship direction

---

## Red Flags (Automatic -2 Points)

- **Mermaid won't render** - Syntax error
- **Endpoint doesn't exist** - Not in SCHEMA
- **Wrong model name** - Misspelled or outdated
- **Missing diagram** - DIAGRAM.md empty/missing
- **No code references** - DETAIL.md has zero file:line

---

## Quick Score Guide

When reviewing, ask:

**DIAGRAM.md:**
- "Does this render?" (syntax)
- "Do these endpoints exist in SCHEMA?" (accuracy)
- "Can I follow the flow?" (clarity)
- "Is anything missing?" (completeness)
- "Does it look like SAM AI?" (styling)

**DETAIL.md:**
- "Is every step explained?" (completeness)
- "Can I find this code?" (references)
- "What goes in and comes out?" (transformations)
- "What if something fails?" (errors)

If any answer is unsatisfactory → not 10/10 yet.

---

## Overall Score Calculation

```
Overall = (DIAGRAM × 0.6) + (DETAIL × 0.4)
```

Diagram weighted higher because:
- It's the primary visual artifact
- More people will view diagram than detail
- Errors in diagram more visible

---

## Quality Philosophy

> A data flow diagram is only useful if it's **accurate** and **understandable**.

An inaccurate diagram is worse than no diagram - it misleads.
An unclear diagram wastes time - people still have to read code.

Your job: Ensure every diagram is both accurate AND clear.

10/10 or keep improving.
