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
