# Niche Agent Template - For Module-Specific Agents

**Purpose:** Template for creating hyper-focused module specialists
**Created:** 2025-10-17
**Maintained By:** Chief of Staff (/cos)

---

## 🎯 What is a Niche Agent?

**Niche Agent** = Module-specific specialist with:
- ✅ **Narrow focus** (ONE module only)
- ✅ **Shared foundation** (ai_brain + ai_sam knowledge from COS)
- ✅ **Module history** (dev docs in module folder)
- ✅ **Self-documenting** (updates own dev docs during work)

**Goal:** Reduce API costs by minimizing context

---

## 📋 Niche Agent Strategy

### The Problem (Before)
**Generic agents load EVERYTHING:**
- All 13 modules
- All 60+ models
- All techniques across ecosystem
- **Result:** High token usage, slow responses, high API costs

### The Solution (After)
**Niche agents load ONLY:**
- Shared foundation (ai_brain + ai_sam architecture) - 1 file
- THIS module's dev docs - 5 files
- **Result:** 10x less context, faster responses, lower API costs

---

## 🏗️ Knowledge Architecture

```
┌─────────────────────────────────────────────────┐
│  SHARED FOUNDATION (All Niche Agents)          │
│  sam_ai_foundation.md (in /cos recruiter/)     │
│  ↓ ai_brain + ai_sam architecture              │
│  ↓ Platform skin model                         │
│  ↓ Manifest standards                          │
└─────────────────────────────────────────────────┘
                     ↓ referenced by
┌─────────────────────────────────────────────────┐
│  MODULE DEV DOCS (Per Niche Agent)             │
│  {module}/dev docs/ (5 standard files)         │
│  ↓ 00_MODULE_OVERVIEW.md                       │
│  ↓ 01_BUILD_HISTORY.md                         │
│  ↓ 02_MODELS_DATA.md                           │
│  ↓ 03_TECHNIQUES.md                            │
│  ↓ 04_INTEGRATION.md                           │
└─────────────────────────────────────────────────┘
```

**Total:** 6 files (1 shared + 5 module-specific)

**Compare to:** Generic agent loading 20-30 files!

---

## 📁 Dev Docs Structure (Standard)

**Every niche agent has these 5 files in `{module}/dev docs/`:**

### 1. 00_MODULE_OVERVIEW.md
**Purpose:** Module structure and purpose

**Contents:**
- Module path and version
- Data models (reminder: in ai_brain!)
- Key features
- Integration points
- Current state

**Length:** ~200 lines

---

### 2. 01_BUILD_HISTORY.md
**Purpose:** Key decisions, changes, lessons learned

**Contents:**
- Major features added (reverse chronological)
- Architecture decisions (with rationale)
- Refactorings and why
- Lessons learned (painful mistakes)
- Performance optimizations

**Length:** Grows over time (start ~100 lines)

**Format:**
```markdown
### YYYY-MM-DD: Feature/Change Name

**Context:** Why was this needed?
**Change:** What was done?
**Rationale:** Why this approach?
**Impact:** What changed?
```

---

### 3. 02_MODELS_DATA.md
**Purpose:** Data models reference

**Contents:**
- Model names and locations (in ai_brain!)
- Field definitions
- Relationships
- Common queries
- Security rules
- Data sync processes

**Length:** ~300 lines

**Critical Reminder:**
```markdown
## 🎯 Critical Reminder

**ALL DATA MODELS LIVE IN AI_BRAIN!**

This module is a **Platform Skin** (UI only).
```

---

### 4. 03_TECHNIQUES.md
**Purpose:** Patterns, code snippets, best practices

**Contents:**
- Common patterns (with code)
- Performance techniques
- Anti-patterns to avoid
- Use cases (step-by-step)
- Optimization tips

**Length:** ~400 lines

**Format:**
```markdown
### Pattern X: Pattern Name

**Use Case:** When to use this

**Implementation:**
```python
# Code example
```

**Best Practices:**
- Tip 1
- Tip 2
```

---

### 5. 04_INTEGRATION.md
**Purpose:** How module connects to ecosystem

**Contents:**
- Integration with other modules
- Integration with agents
- External systems (GitHub, etc.)
- API endpoints (if applicable)
- Webhooks (if applicable)
- Integration patterns

**Length:** ~300 lines

---

## 🎯 Creating a Niche Agent (Step-by-Step)

### Step 1: Identify Module

**Criteria:**
- ✅ Active Odoo module (has __manifest__.py)
- ✅ Requires frequent development
- ✅ Complex enough to need specialist
- ✅ Benefits from focused context

**Example:** `ai_sam_intelligence`

---

### Step 2: Create Dev Docs Folder

**Location:** `{module_path}/dev docs/`

**Command:**
```bash
mkdir "C:\Working With AI\ai_sam\ai_sam\{module_name}\dev docs"
```

**Example:**
```bash
mkdir "C:\Working With AI\ai_sam\ai_sam\ai_sam_intelligence\dev docs"
```

---

### Step 3: Seed Dev Docs Files

**Use COS to create initial versions:**

1. **00_MODULE_OVERVIEW.md:**
   - Module path, version
   - Purpose (3 core functions)
   - Structure (folder layout)
   - Data models (in ai_brain!)
   - Integration points

2. **01_BUILD_HISTORY.md:**
   - Initial entry (creation date)
   - Architecture decisions from manifest
   - Any known lessons learned

3. **02_MODELS_DATA.md:**
   - List all models (from ai_brain!)
   - Field definitions
   - Common queries
   - Security notes

4. **03_TECHNIQUES.md:**
   - Common patterns (if any exist)
   - Placeholder sections for future

5. **04_INTEGRATION.md:**
   - Known integrations
   - Data flow diagrams
   - API endpoints (if applicable)

**Tool:** `/cos` can generate these seeds from module analysis

---

### Step 4: Create Agent Directory

**Location:** `~/.claude/agents/{agent-name}/`

**Naming Convention:** `mod-{module_last_part}`

**Examples:**
- `ai_sam_intelligence` → `mod-intelligence`
- `ai_sam_workflows` → `mod-workflows`
- `ai_sam_memory` → `mod-memory`

**Command:**
```bash
mkdir "${CLAUDE_AGENTS_DIR}\mod-intelligence"
```

---

### Step 5: Create Slash Command

**File:** `~/.claude/commands/{command_name}.md`

**Template Structure:**
```markdown
---
description: {module} specialist - {brief description}
argument-hint: [optional: specific question or task]
allowed-tools: Read, Grep, Glob, Write, Edit, Bash, TodoWrite
---

# 🎯 {Module Name} Specialist - /{command}

## 🚀 STARTUP PROTOCOL (MANDATORY)

**BEFORE ANY WORK**, load current truth:

1. **Read Foundation**:
   - [sam_ai_foundation.md](file://${CLAUDE_AGENTS_DIR}/recruiter/sam_ai_foundation.md)

2. **Read Module Knowledge**:
   - [00_MODULE_OVERVIEW.md](file://path/to/module/dev docs/00_MODULE_OVERVIEW.md)
   - [01_BUILD_HISTORY.md](file://path/to/module/dev docs/01_BUILD_HISTORY.md)
   - [02_MODELS_DATA.md](file://path/to/module/dev docs/02_MODELS_DATA.md)
   - [03_TECHNIQUES.md](file://path/to/module/dev docs/03_TECHNIQUES.md)
   - [04_INTEGRATION.md](file://path/to/module/dev docs/04_INTEGRATION.md)

## 🎯 What You Do
{Module-specific tasks}

## ❌ What You DON'T Do
- Work on OTHER modules
- Make architectural decisions
- Create data models (in ai_brain!)

## 🔄 Your Workflow
{4-phase workflow}

$ARGUMENTS
```

**Example:** See `/mod_intelligence` command

---

### Step 6: Create agent.json

**File:** `~/.claude/agents/{agent-name}/agent.json`

**Template:**
```json
{
  "name": "{agent-name}",
  "description": "{module} specialist - {detailed description}. Niche agent focused ONLY on this module.",
  "tools": ["Read", "Grep", "Glob", "Write", "Edit", "Bash", "TodoWrite"],
  "promptFiles": [],
  "model": "sonnet",
  "color": "{color}"
}
```

**Color Guide:**
- Purple: Intelligence/analysis modules
- Blue: Data/storage modules
- Green: UI/frontend modules
- Orange: Integration modules

---

### Step 7: Test Agent

**Invocation:**
```
/mod_{module_name}
```

**Test Checklist:**
- [ ] Agent loads foundation knowledge
- [ ] Agent loads module dev docs
- [ ] Agent stays focused on THIS module
- [ ] Agent updates BUILD_HISTORY.md after work
- [ ] Agent provides module-specific answers
- [ ] No reference to other modules (unless integration)

---

## 🎯 Niche Agent Naming Convention

### Command Format
**Pattern:** `/mod_{module_last_part}`

**Examples:**
- `ai_sam_intelligence` → `/mod_intelligence`
- `ai_sam_workflows` → `/mod_workflows`
- `ai_sam_memory` → `/mod_memory`
- `ai_sam_creatives` → `/mod_creatives`

**Rationale:**
- "mod" = module specialist (clear purpose)
- Short form (easy to type)
- Consistent pattern (predictable)

### Agent Folder Format
**Pattern:** `mod-{module_last_part}`

**Examples:**
- `/mod_intelligence` → `mod-intelligence/`
- `/mod_workflows` → `mod-workflows/`

**Rationale:** Matches slash command naming

---

## 📊 Cost Comparison

### Generic Agent (Before)
**Context Loaded:**
- 20-30 knowledge files
- All modules, all patterns
- ~50K tokens per session
- **Cost per session:** ~$0.15

### Niche Agent (After)
**Context Loaded:**
- 6 knowledge files (1 shared + 5 module)
- Only THIS module's patterns
- ~5K tokens per session
- **Cost per session:** ~$0.015

**Savings:** ~90% reduction in API costs! 🎉

---

## 🔄 Maintenance Protocol

### When to Update Dev Docs

**After every significant change:**
- ✅ New feature added
- ✅ Bug fixed (with lesson learned)
- ✅ Performance optimization
- ✅ Integration point changed
- ✅ Architecture decision made

**Which file to update:**
- **BUILD_HISTORY.md** → Always (record the change)
- **TECHNIQUES.md** → If new pattern discovered
- **INTEGRATION.md** → If integration changed
- **MODELS_DATA.md** → If model query patterns added
- **MODULE_OVERVIEW.md** → If structure changed (rare)

---

### Agent Self-Documentation

**Niche agents update their own dev docs:**

**In slash command workflow:**
```markdown
### Phase 4: Handover
1. Summarize what was done
2. Highlight any new learnings
3. Suggest next steps
4. **Update relevant dev docs** (BUILD_HISTORY.md)
```

**Example entry:**
```markdown
### 2025-10-17: Added Performance Caching

**Context:** Agent sync was slow (59 files scanned every time)
**Change:** Implemented content hash comparison (skip unchanged files)
**Rationale:** Only process changed files (90% files unchanged daily)
**Impact:** Sync time: 5s → 0.5s (10x faster)

See 03_TECHNIQUES.md Pattern 3 for implementation.
```

---

## ✅ Niche Agent Checklist

**Before declaring agent complete:**

- [ ] Dev docs folder created (`{module}/dev docs/`)
- [ ] All 5 dev doc files seeded (00-04)
- [ ] Agent directory created (`~/.claude/agents/mod-{name}/`)
- [ ] Slash command created (`/mod_{name}`)
- [ ] agent.json configured
- [ ] Foundation knowledge referenced (sam_ai_foundation.md)
- [ ] Module dev docs linked in slash command
- [ ] Startup protocol enforced (read foundation FIRST)
- [ ] Agent tested (answers module-specific questions)
- [ ] Agent scope limited (ONE module only)
- [ ] Self-documentation workflow included (updates BUILD_HISTORY.md)

---

## 🚀 Future Niche Agents (Candidates)

**High Priority:**
1. `/mod_workflows` - ai_sam_workflows specialist
2. `/mod_memory` - ai_sam_memory specialist
3. `/mod_docs` - ai_sam_docs specialist

**Medium Priority:**
4. `/mod_creatives` - ai_sam_creatives specialist
5. `/mod_socializer` - ai_sam_socializer specialist

**Lower Priority:**
6. `/mod_members` - ai_sam_members specialist
7. `/mod_ui` - ai_sam_ui specialist

**Creation Order:** Based on development frequency and complexity

---

## 📖 Template Files Location

**This Template:**
`~/.claude/agents/recruiter/niche_agent_template.md`

**Shared Foundation:**
`~/.claude/agents/recruiter/sam_ai_foundation.md`

**Example Agent:**
`/mod_intelligence` (ai_sam_intelligence specialist)

**Example Dev Docs:**
`C:\Working With AI\ai_sam\ai_sam\ai_sam_intelligence\dev docs\`

---

## 🎯 Success Metrics

**Niche agent strategy succeeds when:**
- ✅ API costs reduced by 50%+ (fewer tokens per session)
- ✅ Response time improved (less context to process)
- ✅ Agent focus maintained (no scope creep)
- ✅ Self-documentation working (BUILD_HISTORY.md stays current)
- ✅ Knowledge reuse (shared foundation, no duplication)
- ✅ Easy to create new agents (template + COS = 1 hour)

---

**Last Updated:** 2025-10-17
**Created By:** Chief of Staff (/cos)
**First Implementation:** `/mod_intelligence` (ai_sam_intelligence)

**Ready to scale across all SAM AI modules!** 🚀
