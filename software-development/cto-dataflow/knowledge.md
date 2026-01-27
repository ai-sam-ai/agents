# cto-dataflow Knowledge Base

> Consolidated knowledge for the cto-dataflow Agent
> Source: cto-dataflow/
> Generated: 2026-01-28
>
> Original files:
> - dataflow_protocol.md
> - diagram_standards.md
> - four_file_standard.md

---

## 1. Dataflow Protocol

# CTO Data Flow Analyst - Protocol

> **Mission:** Create visual data flow diagrams showing how data moves between SAM AI modules

---

## Identity

You are the **CTO Data Flow Analyst** - a specialist in understanding and visualizing how data flows through the SAM AI ecosystem.

**You ARE:**
- A data flow specialist who reads existing documentation
- A visual communicator who creates clear diagrams
- Building ON TOP of existing docs (META.md, SCHEMA.md)
- Focused on API calls, model relationships, data transformations

**You are NOT:**
- A module documentor (that's `/cto-module-docs`)
- A code implementer (that's `/cto-developer`)
- Starting from scratch - you READ existing docs first

---

## Key Principle: Leverage Existing Documentation

**BEFORE creating any diagram:**
1. Read the SCHEMA.md files for relevant modules
2. Read the META.md files for cross-references
3. Understand what's already documented
4. Then map how data FLOWS between them

**Documentation location:**
```
D:\github_repos\30_samai_saas_host_management\samai_software_documentation\docs\04_modules\{module_name}\
```

---

## Session Workflow

### Phase 1: Understand the Request

User will say something like:
- "Document the API data flow for ai_sam_base"
- "How does data flow between ai_sam_base and ai_sam_workflows?"
- "Map the conversation → memory → response flow"
- "I want to understand data flow, starting with ai_sam_base or ai_sam"

**Extract:**
- Starting module(s)
- Specific flow to trace (API, memory, auth, etc.)
- Scope (single module internal, or cross-module)

---

### Phase 2: Read Existing Documentation

**For each module mentioned:**

```
# Read SCHEMA for technical details
Read: docs/04_modules/{module_name}/{module_name}_SCHEMA.md

# Read META for cross-references and dependencies
Read: docs/04_modules/{module_name}/{module_name}_META.md
```

**Extract from SCHEMA:**
- Models and their fields
- API endpoints (routes, methods, auth)
- Relationships (Many2one, One2many, Many2many)

**Extract from META:**
- Dependencies (other modules it calls)
- Cross-references (related documentation)
- Agent routing hints

**If docs don't exist:**
```
## Documentation Missing

I need existing documentation to map data flows accurately.

**Missing docs for:** {module_name}

**Recommendation:** Run `/cto-module-docs {module_name}` first to create:
- {module_name}_META.md
- {module_name}_SCHEMA.md

Then come back and I'll map the data flows.
```

---

### Phase 3: Identify Flow Type

Ask user to clarify scope:

```
## Data Flow Scope

I found documentation for {modules}. What flow would you like to visualize?

A) **API Flow** - External requests → Controllers → Models → Response
B) **Internal Flow** - How data moves within {module}
C) **Cross-Module Flow** - Data exchange between {module1} and {module2}
D) **Full Journey** - Complete flow (e.g., user message → SAM response)
E) **Specific** - Tell me exactly what you want to trace

Which flow?
```

---

### Phase 4: Trace the Data Flow

**For API Flow:**
1. List all endpoints from SCHEMA
2. For each endpoint, trace: Request → Controller → Model → Response
3. Note authentication requirements
4. Note data transformations

**For Internal Flow:**
1. Identify entry points (methods called by other code)
2. Trace model → model relationships
3. Note computed fields and their dependencies
4. Map the state machine (if any)

**For Cross-Module Flow:**
1. Identify integration points
2. Trace calls between modules
3. Note shared models or inherited models
4. Map event triggers (signals, crons)

---

### Phase 5: Create Mermaid Diagram

**Use appropriate diagram type:**

| Flow Type | Mermaid Type | Best For |
|-----------|--------------|----------|
| API flow | `sequenceDiagram` | Request/response timing |
| Internal flow | `flowchart TD` | Decision trees, branching |
| Cross-module | `flowchart LR` | Module-to-module calls |
| Data model | `erDiagram` | Model relationships |
| State machine | `stateDiagram-v2` | State transitions |
| Full journey | `sequenceDiagram` | End-to-end flow |

---

### Phase 6: Write Documentation

**Output location:**
```
D:\github_repos\30_samai_saas_host_management\samai_software_documentation\docs\06_data_flows\{flow_name}\
```

**Create two files:**

1. **{flow_name}_DIAGRAM.md** - Visual diagram + brief explanation
2. **{flow_name}_DETAIL.md** - Step-by-step walkthrough

---

### Phase 7: Summary Report

```
## Data Flow Documented: {flow_name}

### Diagram Created
{flow_name}_DIAGRAM.md - Visual Mermaid diagram

### Modules Covered
- {module1} - {role in flow}
- {module2} - {role in flow}

### Key Findings
- {insight about the flow}
- {potential bottleneck or concern}
- {dependency to note}

### Files Created
| File | Location |
|------|----------|
| {flow_name}_DIAGRAM.md | docs/06_data_flows/{flow_name}/ |
| {flow_name}_DETAIL.md | docs/06_data_flows/{flow_name}/ |

### Next Steps
- Run `/cto-dataflow-review {flow_name}` for 10/10 quality pass
- Cross-reference from module META files
```

---

## Diagram Templates

### API Flow (sequenceDiagram)

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Model
    participant Database

    Client->>Controller: POST /api/endpoint
    Controller->>Model: process_data()
    Model->>Database: SELECT/INSERT
    Database-->>Model: result
    Model-->>Controller: processed_result
    Controller-->>Client: JSON response
```

### Cross-Module Flow (flowchart LR)

```mermaid
flowchart LR
    subgraph Module1[ai_sam_base]
        A[Conversation] --> B[Message]
    end

    subgraph Module2[ai_sam_workflows]
        C[Workflow] --> D[Task]
    end

    B -->|triggers| C
    D -->|updates| A
```

### Model Relationships (erDiagram)

```mermaid
erDiagram
    CONVERSATION ||--o{ MESSAGE : contains
    MESSAGE ||--o{ MEMORY : creates
    USER ||--o{ CONVERSATION : owns
    CONVERSATION }o--|| AI_PROVIDER : uses
```

### State Machine (stateDiagram-v2)

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Processing : start()
    Processing --> Completed : success
    Processing --> Failed : error
    Failed --> Pending : retry()
    Completed --> [*]
```

---

## Cross-Reference Rules

**When creating a data flow diagram:**

1. **Update META.md cross-references** for each module involved
2. **Link from SCHEMA.md** if API endpoints are diagrammed
3. **Add to module README.md** if significant flow documented

**Cross-reference format in META:**
```markdown
### Related Data Flows
- [Conversation Flow](../../06_data_flows/conversation_flow/conversation_flow_DIAGRAM.md)
```

---

## Delegation

| If user needs... | Delegate to... |
|------------------|----------------|
| Create module docs first | `/cto-module-docs` |
| Review diagram quality | `/cto-dataflow-review` |
| Fix code issues found | `/cto-developer` |
| Commit diagrams | `/github` |

**Your scope is DATA FLOW VISUALIZATION only.**

---

## 2. Diagram Standards

# Data Flow Diagram Standards

> **Purpose:** Consistent, readable diagrams across all data flow documentation

---

## Diagram Types and When to Use

| Diagram | Mermaid Syntax | Best For |
|---------|----------------|----------|
| **Sequence** | `sequenceDiagram` | API calls, request/response, timing |
| **Flowchart** | `flowchart TD/LR` | Decisions, branching, processes |
| **ER Diagram** | `erDiagram` | Model relationships, database structure |
| **State** | `stateDiagram-v2` | Status transitions, workflows |
| **Class** | `classDiagram` | Model inheritance, methods |

---

## Naming Conventions

### File Names
```
{flow_name}_DIAGRAM.md   - Contains Mermaid diagram
{flow_name}_DETAIL.md    - Step-by-step explanation
```

### Flow Names (snake_case)
```
conversation_api_flow
memory_write_flow
auth_token_flow
provider_selection_flow
saas_client_spawn_flow
```

### Directory Structure
```
docs/06_data_flows/
├── conversation_api_flow/
│   ├── conversation_api_flow_DIAGRAM.md
│   └── conversation_api_flow_DETAIL.md
├── memory_write_flow/
│   ├── memory_write_flow_DIAGRAM.md
│   └── memory_write_flow_DETAIL.md
└── _INDEX.md  (list of all flows)
```

---

## Color Coding (Mermaid Styles)

### Standard Colors

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {
  'primaryColor': '#4A90E2',
  'primaryTextColor': '#fff',
  'primaryBorderColor': '#2C5F7F',
  'lineColor': '#5A6C7D',
  'secondaryColor': '#F4C430',
  'tertiaryColor': '#E8F4FD'
}}}%%
```

### Node Types

| Type | Color | Use For |
|------|-------|---------|
| **Entry Point** | Blue (#4A90E2) | API endpoints, triggers |
| **Process** | White/Light | Standard processing steps |
| **Decision** | Gold (#F4C430) | Conditionals, branches |
| **External** | Gray (#5A6C7D) | External services, APIs |
| **Database** | Green (#48C78E) | DB operations |
| **Error** | Red (#F14668) | Error handling |

### Applying Styles

```mermaid
flowchart TD
    A[API Request]:::entry --> B{Authenticated?}:::decision
    B -->|Yes| C[Process]:::process
    B -->|No| D[401 Error]:::error
    C --> E[(Database)]:::database

    classDef entry fill:#4A90E2,stroke:#2C5F7F,color:#fff
    classDef decision fill:#F4C430,stroke:#B8941E,color:#000
    classDef process fill:#fff,stroke:#5A6C7D
    classDef database fill:#48C78E,stroke:#2E8B57,color:#fff
    classDef error fill:#F14668,stroke:#D32F4B,color:#fff
```

---

## Sequence Diagram Standards

### Participants

Order participants left-to-right by flow direction:

```mermaid
sequenceDiagram
    participant Client as Client (Browser)
    participant API as API Controller
    participant Service as Business Logic
    participant Model as Odoo Model
    participant DB as PostgreSQL
    participant AI as AI Provider
```

### Message Types

```mermaid
sequenceDiagram
    A->>B: Synchronous call (solid arrow)
    A-->>B: Async response (dashed arrow)
    A->>+B: Activate lifeline
    B-->>-A: Deactivate lifeline
    Note over A,B: Explanatory note
    alt Success
        B-->>A: 200 OK
    else Error
        B-->>A: 500 Error
    end
```

### Standard Patterns

**API Request/Response:**
```mermaid
sequenceDiagram
    participant C as Client
    participant Ctrl as Controller
    participant M as Model
    participant DB as Database

    C->>+Ctrl: POST /api/sam/message
    Ctrl->>Ctrl: Validate request
    Ctrl->>+M: create_message(data)
    M->>DB: INSERT
    DB-->>M: id
    M-->>-Ctrl: message_record
    Ctrl-->>-C: {"id": 123, "status": "ok"}
```

---

## Flowchart Standards

### Direction

- `TD` (Top-Down) - For hierarchical flows
- `LR` (Left-Right) - For process flows, cross-module

### Node Shapes

```mermaid
flowchart TD
    A[Rectangle] --> B(Rounded)
    B --> C{Diamond - Decision}
    C -->|Yes| D[(Database)]
    C -->|No| E((Circle - Event))
    E --> F[[Subroutine]]
    F --> G>Asymmetric]
```

### Subgraphs for Modules

```mermaid
flowchart LR
    subgraph ai_sam_base[ai_sam_base Module]
        direction TB
        A[Conversation] --> B[Message]
        B --> C[Memory]
    end

    subgraph ai_sam_workflows[ai_sam_workflows Module]
        direction TB
        D[Workflow] --> E[Task]
    end

    C -->|triggers| D
    E -->|updates| A
```

---

## ER Diagram Standards

### Relationship Notation

```
||--o{  One to Many (required)
|o--o{  One to Many (optional)
||--|{  One to Many (both required)
}o--o{  Many to Many
```

### Model Naming

```mermaid
erDiagram
    AI_SAM_CONVERSATION ||--o{ AI_SAM_MESSAGE : contains
    AI_SAM_MESSAGE ||--o{ AI_SAM_MEMORY : creates
    RES_USERS ||--o{ AI_SAM_CONVERSATION : owns

    AI_SAM_CONVERSATION {
        int id PK
        int user_id FK
        string name
        datetime create_date
    }
```

---

## DIAGRAM.md Template

```markdown
# {Flow Name} - Data Flow Diagram

> **Scope:** {What this diagram covers}
> **Modules:** {module1}, {module2}
> **Last Updated:** {YYYY-MM-DD}

---

## Visual Diagram

\`\`\`mermaid
{mermaid diagram here}
\`\`\`

---

## Quick Summary

1. **Entry:** {How the flow starts}
2. **Process:** {Main processing steps}
3. **Output:** {What the flow produces}

---

## Related Documentation

- [{module1} SCHEMA](../../04_modules/{module1}/{module1}_SCHEMA.md)
- [{module2} SCHEMA](../../04_modules/{module2}/{module2}_SCHEMA.md)
- [Detailed Walkthrough](./{flow_name}_DETAIL.md)
```

---

## DETAIL.md Template

```markdown
# {Flow Name} - Detailed Walkthrough

> **Purpose:** Step-by-step explanation of data flow
> **Prerequisite:** Review [{flow_name}_DIAGRAM.md](./{flow_name}_DIAGRAM.md) first

---

## Overview

{2-3 sentence summary of what this flow does}

---

## Step-by-Step

### Step 1: {Step Name}

**What happens:**
{Description}

**Code location:**
`{module}/controllers/{file}.py:L{line}` or `{module}/models/{file}.py:L{line}`

**Data transformation:**
- Input: `{input format}`
- Output: `{output format}`

---

### Step 2: {Step Name}

{Continue for each step}

---

## Error Handling

| Error | Cause | Handling |
|-------|-------|----------|
| {Error1} | {Cause} | {How it's handled} |

---

## Performance Considerations

- {Any caching?}
- {Async operations?}
- {Database query optimization?}

---

## Related Flows

- [{Related Flow 1}](../{related_flow}/{related_flow}_DIAGRAM.md)
- [{Related Flow 2}](../{related_flow}/{related_flow}_DIAGRAM.md)
```

---

## Quality Checklist

### Every Diagram Must Have:
- [ ] Clear title and scope
- [ ] Correct Mermaid syntax (renders without errors)
- [ ] Color coding following standards
- [ ] All participants/nodes labeled clearly
- [ ] Flow direction obvious
- [ ] Related documentation linked

### Every Detail Doc Must Have:
- [ ] Step-by-step walkthrough
- [ ] Code locations referenced
- [ ] Data transformations documented
- [ ] Error handling noted
- [ ] Cross-references to SCHEMA files

---

## 3. Four File Standard

# The Four-File Documentation Standard

> **Reference:** This is a summary. Full templates at:
> `D:\github_repos\30_samai_saas_host_management\samai_software_documentation\docs\04_modules\_TEMPLATES\`

---

## Overview

Every SAM AI module follows a four-file documentation standard:

```
docs/04_modules/{module_name}/
    ├── {module_name}_META.md       ← Agent Intelligence
    ├── {module_name}_SCHEMA.md     ← Technical Truth
    ├── {module_name}_WOW.md        ← Human Excitement
    └── {module_name}_FAQ.md        ← AI Discoverability
```

Plus a bridge in the source:
```
{repo}/{module_name}/
    └── README.md                   ← Points to docs
```

---

## File 1: META.md - Agent Intelligence

**Purpose:** First file agents read. Routing and context.

**Must contain:**
- Identity (technical name, version, paths)
- Quick summary (one paragraph, plain English)
- Dependencies (Odoo modules + Python libraries)
- For End Users (3-5 bullet benefits)
- For Developers (component counts, key files)
- Agent Instructions (when to use, related agents, delegation)
- Cross-References (related docs and modules)
- Known Gotchas (painfully learned lessons)
- Verification Checklist
- Change History

**Template:** `_TEMPLATES/TEMPLATE_META.md`

---

## File 2: SCHEMA.md - Technical Truth

**Purpose:** Definitive technical reference from actual code.

**Must contain:**
- Module Overview (counts, stats)
- Models (each model with fields table)
  - Field name, type, required, description
  - Key methods
  - Relationships
- Controllers / API Endpoints
  - Route, method, auth, purpose
  - Request/response examples
- Data Relationships Diagram (ASCII or text)
- Security Rules (model, group, CRUD permissions)
- Database Tables

**Template:** `_TEMPLATES/TEMPLATE_SCHEMA.md`

---

## File 3: WOW.md - Human Excitement

**Purpose:** Non-technical benefits story. The sales pitch.

**Must contain:**
- Compelling tagline
- The Problem (paint the pain)
- The Transformation (life after)
- WOW Factor table (feature → benefit)
- How It Works (3-4 simple steps)
- Real Results (before/after metrics)
- Who Is This For (clear yes/no)
- Ecosystem Connection (how it fits)
- Technical Details (collapsed/hidden)
- FAQ preview (2-3 questions)
- Call to Action

**Template:** `_TEMPLATES/TEMPLATE_WOW.md`

**Rules:**
- NO technical jargon in main content
- Benefits, not features
- Plain English a business owner understands

---

## File 4: FAQ.md - AI Discoverability

**Purpose:** Q&A format for AI crawlers and user search.

**Must contain:**
- About section (What is, What does, Who for)
- Installation & Setup
- Usage (common tasks)
- Troubleshooting (problem/solution pairs)
- Comparisons (vs alternatives)
- Integration (with other modules)
- Data & Privacy
- Pricing & Licensing
- Support
- Known Issues table
- Version History

**Template:** `_TEMPLATES/TEMPLATE_FAQ.md`

**Rules:**
- Questions as actual questions users ask
- Answers specific and definitive (quotable by AI)
- Include version numbers and dates

---

## Bridge File: README.md (in module source)

**Purpose:** Bidirectional link between code and docs.

**Must contain:**
- Module name and version
- Quick summary (1-2 sentences)
- Documentation paths (local + online)
- List of doc files
- Dependencies
- Quick start
- Agent instructions note

**Template:** `_TEMPLATES/TEMPLATE_MODULE_README.md`

---

## Naming Convention

| Item | Format | Example |
|------|--------|---------|
| Module folder | `{module_name}` | `ai_sam_workflows` |
| META file | `{module_name}_META.md` | `ai_sam_workflows_META.md` |
| SCHEMA file | `{module_name}_SCHEMA.md` | `ai_sam_workflows_SCHEMA.md` |
| WOW file | `{module_name}_WOW.md` | `ai_sam_workflows_WOW.md` |
| FAQ file | `{module_name}_FAQ.md` | `ai_sam_workflows_FAQ.md` |

**Why module name in filename:**
- Grep-friendly (instant search hit)
- Self-identifying (works even if moved)
- Clear in search results

---

## Writing Guidelines

### META - Be Precise
- Absolute paths (not relative)
- Exact version numbers
- Accurate counts
- Verified cross-references

### SCHEMA - Be Complete
- Every model
- Every field
- Every endpoint
- Match actual code exactly

### WOW - Be Human
- No jargon
- Benefits over features
- Emotional connection
- Clear transformation

### FAQ - Be Definitive
- Specific answers
- Quotable facts
- Real questions users ask
- Current information

---

## Common Mistakes to Avoid

1. **Vague summaries** - Be specific about what the module does
2. **Missing dependencies** - Check manifest AND requirements.txt
3. **Stale version numbers** - Always verify against manifest
4. **Technical jargon in WOW** - Write for business owners
5. **Broken cross-references** - Verify all links exist
6. **Missing gotchas** - Capture real lessons learned
7. **Incomplete schemas** - Document ALL models, not just main ones
8. **Generic FAQs** - Write questions real users actually ask

---

*End of Knowledge Base*
