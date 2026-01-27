# Documentation Scoring Criteria

> **Standard:** Every file must achieve 10/10 before documentation is complete

---

## Scoring Scale

| Score | Meaning | Action |
|-------|---------|--------|
| 10/10 | Perfect - Ready for production | None needed |
| 9/10 | Excellent - Minor polish | Quick fixes |
| 8/10 | Good - Missing some details | Add missing content |
| 7/10 | Acceptable - Noticeable gaps | Significant additions |
| 6/10 | Below standard - Multiple issues | Major revision |
| 5/10 | Poor - Fundamental problems | Near rewrite |
| <5/10 | Unacceptable - Start over | Full rewrite |

**Target: 10/10 for every file**

---

## META.md Scoring (Agent Intelligence)

### 10/10 Requirements

| Criterion | Weight | 10/10 Standard |
|-----------|--------|----------------|
| **Paths** | 15% | All paths absolute, verified to exist |
| **Version** | 10% | Exactly matches __manifest__.py |
| **Dependencies** | 15% | Complete Odoo AND Python deps |
| **Model Count** | 10% | Matches actual code (±0) |
| **Controller Count** | 10% | Matches actual routes (±0) |
| **Agent Instructions** | 20% | Specific, actionable, no ambiguity |
| **Cross-References** | 10% | All links valid, files exist |
| **Gotchas** | 5% | Real pitfalls documented |
| **Verification Date** | 5% | Current (within 30 days) |

### Scoring Examples

**10/10:**
- Every path verified with `Glob` or `Read`
- Version "18.0.2.53" matches manifest exactly
- Lists all 12 dependencies correctly
- "54 models" matches grep count
- Agent instructions: "When user asks about memory, check sam.ai.memory model"

**7/10:**
- Paths exist but some relative instead of absolute
- Version correct
- Missing 2 Python dependencies
- Model count says "50+" (vague)
- Agent instructions generic: "Handle memory-related queries"

**5/10:**
- Some paths don't exist
- Version outdated
- Dependencies incomplete
- Model count wrong
- No useful agent instructions

---

## SCHEMA.md Scoring (Technical Truth)

### 10/10 Requirements

| Criterion | Weight | 10/10 Standard |
|-----------|--------|----------------|
| **Models Complete** | 25% | Every model documented (regular, abstract, transient) |
| **Fields Complete** | 20% | Every field has type, description |
| **Relationships** | 15% | All Many2one, One2many, Many2many mapped |
| **API Endpoints** | 20% | Every route documented with method, auth |
| **Code Examples** | 10% | Working examples for common operations |
| **Security Rules** | 10% | ir.model.access.csv documented |

### Scoring Examples

**10/10:**
- All 54 models documented
- Every field: `name = fields.Char(string='Name', required=True)`
- Relationship diagram shows all connections
- All 77 endpoints with curl examples
- Security matrix complete

**7/10:**
- Main models documented, missing abstract/transient
- Most fields documented, some missing descriptions
- Main relationships shown, missing some Many2many
- Key endpoints documented, missing minor ones
- No code examples

**5/10:**
- Only major models documented
- Fields listed without types
- Relationships incomplete
- Many endpoints missing
- No security documentation

---

## WOW.md Scoring (Human Excitement)

### 10/10 Requirements

| Criterion | Weight | 10/10 Standard |
|-----------|--------|----------------|
| **Zero Jargon** | 25% | No technical terms in main content |
| **Benefits Focus** | 25% | Transformation, not features |
| **Audience Clear** | 15% | Who this is for is obvious |
| **Problem/Solution** | 15% | Clear pain → relief narrative |
| **Ecosystem Context** | 10% | SAM AI connection clear |
| **Emotional Impact** | 10% | Reader feels excited |

### Scoring Examples

**10/10:**
- "Never explain context again" (not "persistent memory model")
- "Save 30% of your time" (not "optimized API calls")
- "For busy business owners who..."
- "You're tired of repeating yourself → SAM remembers"
- "Part of SAM AI ecosystem"
- Reader thinks "I want this!"

**7/10:**
- Mostly non-technical but some jargon slips in
- Mix of features and benefits
- Audience implied but not stated
- Problem mentioned but not felt
- SAM AI mentioned but not connected
- Reader thinks "Sounds useful"

**5/10:**
- Technical throughout
- Feature list disguised as benefits
- No clear audience
- No problem statement
- No ecosystem context
- Reader thinks "What does this do?"

---

## FAQ.md Scoring (AI Discoverability)

### 10/10 Requirements

| Criterion | Weight | 10/10 Standard |
|-----------|--------|----------------|
| **Question Count** | 15% | Minimum 10 Q&A pairs, ideally 15+ |
| **Question Format** | 15% | All written as actual questions with "?" |
| **Answer Quality** | 25% | Specific, definitive, no hedging |
| **Troubleshooting** | 20% | Common issues with solutions |
| **Comparisons** | 15% | Fair "vs" alternatives |
| **Version Currency** | 10% | References current version |

### Scoring Examples

**10/10:**
- 15 Q&A pairs covering all aspects
- "How do I configure the API key?" (proper question)
- "Set it in Settings → SAM AI → API Configuration" (specific)
- "Error: Connection refused" → "Check firewall port 8069"
- "SAM AI vs ChatGPT" with fair comparison table
- "Current version: 18.0.2.53"

**7/10:**
- 8 Q&A pairs
- Most are questions, some are statements
- Answers mostly specific but some vague
- Basic troubleshooting
- Mentions alternatives but no comparison
- Version mentioned somewhere

**5/10:**
- 5 or fewer Q&As
- Many not in question format
- Vague answers: "It depends"
- No troubleshooting
- No comparisons
- No version info

---

## README.md Scoring (Bridge File)

### 10/10 Requirements

| Criterion | Weight | 10/10 Standard |
|-----------|--------|----------------|
| **Docs Link** | 30% | Correct URL to sme.ec/documentation |
| **Quick Start** | 25% | Accurate, tested steps |
| **Installation** | 25% | Complete, working instructions |
| **Support Contact** | 20% | sam@sme.ec, correct website |

### Scoring Examples

**10/10:**
- Links to exact documentation URL
- Quick start works if followed exactly
- Installation covers dependencies
- Support email and website correct

**7/10:**
- Links to general docs, not specific module
- Quick start mostly works
- Installation missing minor step
- Support info present but incomplete

---

## index.html Scoring (Odoo Apps Page)

### 10/10 Requirements

| Criterion | Weight | 10/10 Standard |
|-----------|--------|----------------|
| **SAM AI Colors** | 20% | Blue #4A90E2, Gold #F4C430, NOT purple #714B67 |
| **All Sections** | 20% | Header, Features, Stats, How It Works, Getting Started, Footer |
| **Docs Link** | 15% | Links to sme.ec/documentation/modules/{slug} |
| **Version Current** | 15% | Matches __manifest__.py |
| **Content Quality** | 15% | Matches WOW.md benefits focus |
| **Responsive** | 15% | Works on mobile (CSS grid/flexbox) |

### Scoring Examples

**10/10:**
- Uses CSS variables with SAM AI colors
- All sections present and complete
- "View Documentation" links to correct URL
- Version badge shows current version
- Benefits-focused content
- Grid layout adapts to screen size

**7/10:**
- Mostly correct colors, one or two wrong
- Missing one section
- Docs link present but generic
- Version slightly outdated
- Mix of features and benefits
- Works on desktop, slight mobile issues

**5/10:**
- Uses old Odoo purple (#714B67)
- Multiple sections missing
- No docs link
- Wrong version
- Technical content
- Broken on mobile

---

## Overall Score Calculation

```
Overall = (META × 0.2) + (SCHEMA × 0.25) + (WOW × 0.2) + (FAQ × 0.15) + (README × 0.1) + (index.html × 0.1)
```

**Weights reflect importance:**
- SCHEMA highest (25%) - developers depend on it
- META high (20%) - agents route based on it
- WOW high (20%) - end user first impression
- FAQ moderate (15%) - AI discoverability
- README/index.html lower (10% each) - bridge files

---

## Red Flags (Automatic -2 Points)

Regardless of other criteria, deduct 2 points for:

- **Wrong version** - Mismatch with __manifest__.py
- **Broken links** - Cross-references to non-existent files
- **Wrong colors** - Using old Odoo purple in index.html
- **Missing models** - SCHEMA doesn't match code reality
- **Technical jargon in WOW** - Defeats the purpose

---

## Quick Score Guide

When reviewing, ask these questions:

**META:** "Can an agent make routing decisions from this?"
**SCHEMA:** "Can a developer implement from this alone?"
**WOW:** "Would a non-technical person get excited?"
**FAQ:** "Would an AI assistant answer questions correctly from this?"
**README:** "Can someone find the full docs from this?"
**index.html:** "Does this look like SAM AI brand?"

If any answer is "no" → not 10/10 yet.
