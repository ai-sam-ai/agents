# cto-module-docs-review Knowledge Base

> Consolidated knowledge for the cto-module-docs-review Agent
> Source: cto-module-docs-review/
> Generated: 2026-01-28
>
> Original files:
> - four_file_standard.md
> - manifest_standards.md
> - review_protocol.md
> - scoring_criteria.md

---

## 1. Four File Standard

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

## 2. Manifest Standards

# SAM AI Module Manifest Standards

> **Purpose:** Ensure consistent branding, colors, and metadata across all SAM AI modules

---

## SAM AI Brand Color System

> **Reference:** `D:\github_repos\ai_sam_introduction\colour_guide.html`

### CSS Variables (Copy/Paste Ready)

```css
:root {
    /* ========================================
       CORE BRAND COLORS
       ======================================== */

    /* Primary Blue Family - TRUST & AUTHORITY */
    --blue-primary: #4A90E2;      /* Sky Blue - Main brand color */
    --blue-light: #E8F4FD;        /* Backgrounds, hover states */
    --blue-dark: #2C5F7F;         /* Gradient depth, dark mode */
    --blue-hover: #3A7BC8;        /* Interactive hover */

    /* Gold Accent Family - PREMIUM & QUALITY */
    --gold-sparkle: #F4C430;      /* Warm gold - Celebrations, achievements */
    --gold-trust: #D4AF37;        /* Cool gold - Premium badges, quality seals */
    --gold-soft: #FFF4D6;         /* Light backgrounds */
    --gold-rich: #B8941E;         /* Deep accents, text on light */

    /* Soft Neutrals - FOUNDATION & CLARITY */
    --neutral-50: #FAFBFC;        /* Whisper - Page backgrounds */
    --neutral-100: #F5F7F9;       /* Soft - Card backgrounds */
    --neutral-200: #E8ECEF;       /* Cloud - Borders, dividers */
    --neutral-300: #D4DCE2;       /* Medium - Disabled states */
    --neutral-400: #9CA8B4;       /* Muted text */
    --neutral-600: #5A6C7D;       /* Body text */
    --neutral-700: #3D4F5F;       /* Headings */
    --neutral-800: #2D3748;       /* Dark text */

    /* ========================================
       SEMANTIC ACTION COLORS
       ======================================== */

    /* Success - CONFIRMATION & ACHIEVEMENT */
    --success-primary: #48C78E;   /* Soft green - Trust reinforcement */
    --success-light: #E8F8F0;     /* Backgrounds */
    --success-dark: #2E8B57;      /* Emphasis */

    /* Warning - CAUTION (not panic) */
    --warning-primary: #FFB84D;   /* Soft amber */
    --warning-light: #FFF4E6;     /* Backgrounds */
    --warning-dark: #E69500;      /* Emphasis */

    /* Error - HELPFUL CORRECTION */
    --error-primary: #F14668;     /* Soft red */
    --error-light: #FEECF0;       /* Backgrounds */
    --error-dark: #D32F4B;        /* Emphasis */

    /* Urgency - ACTION TRIGGER */
    --urgency-primary: #FF6B35;   /* Vibrant orange */
    --urgency-light: #FFE8E0;     /* Backgrounds */
    --urgency-dark: #E85A2A;      /* Emphasis */

    /* ========================================
       DESIGN TOKENS
       ======================================== */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;

    --shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
    --shadow-blue: 0 6px 20px rgba(74, 144, 226, 0.4);
    --shadow-gold: 0 6px 20px rgba(244, 196, 48, 0.3);
}
```

### Quick Reference Table

| Element Type | Color | Hex | When to Use |
|--------------|-------|-----|-------------|
| **Primary CTA** | Blue | `#4A90E2` | Standard actions, entry-level offers |
| **Premium CTA** | Blue+Gold Gradient | `#4A90E2` → `#D4AF37` | Upgrade prompts, Pro tier |
| **High-Ticket CTA** | Gold | `#D4AF37` | Enterprise, VIP ($1K+) |
| **Success Message** | Green | `#48C78E` | Confirmations, achievements |
| **Warning Alert** | Amber | `#FFB84D` | Caution signals |
| **Error Message** | Red | `#F14668` | Form validation |
| **Page Background** | Whisper | `#FAFBFC` | Main backgrounds |
| **Card Surface** | Soft | `#F5F7F9` | Content cards |
| **Primary Text** | Dark | `#2D3748` | Headings, body text |
| **Muted Text** | Gray | `#5A6C7D` | Secondary text |

### Color Psychology

- **Blue (#4A90E2)**: Trust + Authority - Use for primary brand, CTAs
- **Gold (#F4C430, #D4AF37)**: Premium + Quality - Use sparingly for achievements, VIP
- **Neutrals**: Clarity + Comfort - Backgrounds, eye fatigue reduction

---

## Required Manifest Fields

Every SAM AI module `__manifest__.py` must include:

```python
{
    'name': 'Human Readable Module Name',
    'version': '18.0.x.x.x',
    'author': 'Anthony Gardiner - SME.ec',
    'maintainer': 'Anthony Gardiner & Claude Code. Supported Via <sam@sme.ec>',
    'website': 'https://sme.ec',
    'license': 'LGPL-3',
    'category': '{Category}',
    'summary': 'Brief one-line description',
    'description': """
        Full description here
    """,
    'depends': ['base', ...],
    'data': [...],
    'images': ['static/description/icon.png'],
    'installable': True,
    'application': True/False,
    'auto_install': False,
}
```

---

## Field Standards

### Author (MUST BE EXACT)
```python
'author': 'Anthony Gardiner - SME.ec',
```

### Maintainer (MUST BE EXACT)
```python
'maintainer': 'Anthony Gardiner & Claude Code. Supported Via <sam@sme.ec>',
```

### Website (MUST BE EXACT)
```python
'website': 'https://sme.ec',
```

### License (MUST BE EXACT)
```python
'license': 'LGPL-3',
```

### Version Format
```python
'version': '18.0.{major}.{minor}.{patch}',
```
- `18.0` = Odoo version
- `major` = Breaking changes
- `minor` = New features
- `patch` = Bug fixes

### Category (Standardized Options)
```python
# For core SAM AI modules
'category': 'SAM AI/Core',

# For SAM AI features
'category': 'SAM AI/Features',

# For SAM AI integrations
'category': 'SAM AI/Integrations',

# For business tools
'category': 'SAM AI/Business',

# For website/frontend
'category': 'SAM AI/Website',

# For utilities
'category': 'SAM AI/Utilities',
```

---

## Required Static Assets

### 1. Module Icon
**Path:** `static/description/icon.png`

**Requirements:**
- Exists in module
- PNG format
- Recommended: 128x128 or 256x256 pixels
- SAM AI branding (consistent with ecosystem)

**Manifest reference:**
```python
'images': ['static/description/icon.png'],
```

### 2. Module Description Page (index.html)

**Path:** `static/description/index.html`

**Purpose:** Displayed in Odoo Apps menu when viewing module details

**Benchmark Reference:** `D:\github_repos\04_samai_user_experience\ai_sam_base\static\description\index.html`

**Requirements:**
- HTML format with SAM AI brand colors
- Matches WOW.md content (human-readable benefits)
- Links to technical documentation at sme.ec
- Comprehensive structure (header, features, stats, comparison, getting started)

---

## index.html Template (SAM AI Brand Colors)

> **IMPORTANT:** This template uses SAM AI brand colors (Blue #4A90E2, Gold #F4C430/#D4AF37) NOT old Odoo purple.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Module Name} - SAM AI Module</title>
    <style>
        /* SAM AI Brand Color System */
        :root {
            /* Primary Blue */
            --blue-primary: #4A90E2;
            --blue-light: #E8F4FD;
            --blue-dark: #2C5F7F;
            --blue-hover: #3A7BC8;

            /* Gold Accents */
            --gold-sparkle: #F4C430;
            --gold-trust: #D4AF37;
            --gold-soft: #FFF4D6;
            --gold-rich: #B8941E;

            /* Neutrals */
            --neutral-50: #FAFBFC;
            --neutral-100: #F5F7F9;
            --neutral-200: #E8ECEF;
            --neutral-600: #5A6C7D;
            --neutral-700: #3D4F5F;
            --neutral-800: #2D3748;

            /* Semantic */
            --success-primary: #48C78E;
            --warning-primary: #FFB84D;
            --error-primary: #F14668;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: var(--neutral-800);
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: var(--neutral-50);
        }

        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        /* Header with Blue gradient */
        .module-header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 3px solid var(--blue-primary);
        }

        .module-header h1 {
            color: var(--blue-primary);
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .tagline {
            font-size: 1.3em;
            color: var(--neutral-600);
            font-style: italic;
        }

        .version-badge {
            display: inline-block;
            background: var(--blue-primary);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            margin-top: 10px;
        }

        section {
            margin-bottom: 40px;
        }

        h2 {
            color: var(--blue-primary);
            font-size: 1.8em;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--neutral-200);
        }

        h3 {
            color: var(--neutral-700);
            font-size: 1.3em;
            margin-top: 25px;
            margin-bottom: 10px;
        }

        /* Capability boxes with Blue accent */
        .capability {
            background: var(--neutral-100);
            border-left: 4px solid var(--blue-primary);
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
        }

        .capability h3 {
            margin-top: 0;
            color: var(--blue-primary);
        }

        ul {
            padding-left: 25px;
        }

        li {
            margin-bottom: 8px;
        }

        code {
            background: var(--neutral-100);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: var(--blue-dark);
        }

        /* Gold highlight box for key features */
        .highlight-box {
            background: var(--gold-soft);
            border: 2px solid var(--gold-trust);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        /* Blue info box */
        .info-box {
            background: var(--blue-light);
            border: 2px solid var(--blue-primary);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        /* Warning box */
        .warning-box {
            background: #FFF4E6;
            border: 2px solid var(--warning-primary);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        /* Tables with Blue header */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        table thead {
            background: var(--blue-primary);
            color: white;
        }

        table th, table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--neutral-200);
        }

        table tbody tr:hover {
            background: var(--blue-light);
        }

        /* Stats grid with Blue gradient */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .stat-card {
            background: linear-gradient(135deg, var(--blue-primary) 0%, var(--blue-dark) 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
        }

        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            display: block;
        }

        .stat-label {
            font-size: 1em;
            opacity: 0.9;
        }

        /* Feature grid */
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .feature-card {
            background: white;
            border: 2px solid var(--neutral-200);
            padding: 24px;
            border-radius: 12px;
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            border-color: var(--blue-primary);
            box-shadow: 0 8px 24px rgba(74, 144, 226, 0.15);
            transform: translateY(-4px);
        }

        .feature-icon {
            font-size: 2.5em;
            margin-bottom: 12px;
        }

        strong {
            color: var(--blue-dark);
        }

        a {
            color: var(--blue-primary);
            text-decoration: none;
            border-bottom: 1px solid var(--blue-primary);
        }

        a:hover {
            color: var(--blue-dark);
            border-bottom: 2px solid var(--blue-dark);
        }

        /* CTA buttons */
        .cta-button {
            display: inline-block;
            background: var(--blue-primary);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            border: none;
            font-size: 1.1em;
            margin: 10px 10px 10px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        }

        .cta-button:hover {
            background: var(--blue-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
        }

        /* Premium CTA with Gold */
        .cta-premium {
            background: linear-gradient(135deg, var(--blue-primary), var(--blue-dark));
            border: 2px solid var(--gold-sparkle);
            box-shadow: 0 6px 20px rgba(244, 196, 48, 0.3);
        }

        .cta-premium:hover {
            box-shadow: 0 8px 24px rgba(244, 196, 48, 0.4);
        }

        /* Footer */
        .footer {
            text-align: center;
            padding-top: 40px;
            border-top: 2px solid var(--neutral-200);
            margin-top: 60px;
        }

        .footer p {
            color: var(--neutral-600);
        }

        /* Premium badge */
        .premium-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--gold-soft);
            border: 2px solid var(--gold-trust);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.9em;
            font-weight: 600;
            color: var(--gold-rich);
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="module-header">
            <h1>{Module Name}</h1>
            <p class="tagline">{Tagline - the transformation promise}</p>
            <span class="version-badge">Version {version}</span>
        </div>

        <!-- What is it -->
        <section>
            <h2>What is {Module Name}?</h2>
            <p>{One paragraph description of what this module does}</p>
            <div class="highlight-box">
                <p><strong>Key Benefits:</strong></p>
                <ul>
                    <li><strong>{Benefit 1}</strong> - {Description}</li>
                    <li><strong>{Benefit 2}</strong> - {Description}</li>
                    <li><strong>{Benefit 3}</strong> - {Description}</li>
                </ul>
            </div>
        </section>

        <!-- Statistics (if applicable) -->
        <section>
            <h2>Module Statistics</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">{N}</span>
                    <span class="stat-label">{Stat Label}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">{N}</span>
                    <span class="stat-label">{Stat Label}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">{N}</span>
                    <span class="stat-label">{Stat Label}</span>
                </div>
            </div>
        </section>

        <!-- Core Features -->
        <section>
            <h2>Core Features</h2>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">{emoji}</div>
                    <h3>{Feature 1}</h3>
                    <p>{Feature description focusing on benefits}</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">{emoji}</div>
                    <h3>{Feature 2}</h3>
                    <p>{Feature description focusing on benefits}</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">{emoji}</div>
                    <h3>{Feature 3}</h3>
                    <p>{Feature description focusing on benefits}</p>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section>
            <h2>How It Works</h2>
            <ol>
                <li><strong>Step 1:</strong> {Description}</li>
                <li><strong>Step 2:</strong> {Description}</li>
                <li><strong>Step 3:</strong> {Description}</li>
            </ol>
        </section>

        <!-- Technical Details (brief) -->
        <section>
            <h2>Technical Details</h2>
            <div class="info-box">
                <ul>
                    <li><strong>Odoo Version:</strong> 18.0+</li>
                    <li><strong>Dependencies:</strong> {list}</li>
                    <li><strong>Category:</strong> SAM AI/{category}</li>
                </ul>
            </div>
        </section>

        <!-- Part of SAM AI Ecosystem -->
        <section>
            <h2>Part of SAM AI Ecosystem</h2>
            <p>
                This module integrates with the <strong>SAM AI</strong> platform for intelligent
                business automation. SAM (Strategic Automation Manager) is your AI business partner
                with perfect memory, built directly into Odoo.
            </p>
            <div class="premium-badge">Part of SAM AI</div>
        </section>

        <!-- Getting Started -->
        <section>
            <h2>Getting Started</h2>
            <div class="info-box">
                <ol>
                    <li>Install this module via Odoo Apps</li>
                    <li>{Configuration step}</li>
                    <li>{Usage step}</li>
                </ol>
            </div>
        </section>

        <!-- Documentation CTA -->
        <section>
            <h2>Documentation</h2>
            <p>Full technical documentation, API reference, and guides available online.</p>
            <a class="cta-button" href="https://sme.ec/documentation/modules/{module-slug}" target="_blank">
                View Full Documentation
            </a>
        </section>

        <!-- Footer -->
        <div class="footer">
            <p style="font-size: 1.1em;">
                <strong>SAM AI</strong> - Intelligent Business Automation
            </p>
            <p>
                Version {version} | LGPL-3 License | Anthony Gardiner - SME.ec
            </p>
            <div style="margin-top: 20px;">
                <a href="https://sme.ec" class="cta-button" target="_blank">Visit SME.ec</a>
                <a href="mailto:sam@sme.ec" class="cta-button cta-premium">Contact Support</a>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## Validation Checklist

### Manifest Validation
- [ ] `author` exactly matches standard
- [ ] `maintainer` exactly matches standard
- [ ] `website` exactly matches standard
- [ ] `license` is `LGPL-3`
- [ ] `version` follows `18.0.x.x.x` format
- [ ] `category` uses standardized SAM AI category
- [ ] `images` references icon.png

### Asset Validation
- [ ] `static/description/icon.png` exists
- [ ] `static/description/index.html` exists
- [ ] index.html uses SAM AI brand colors (Blue #4A90E2, Gold #F4C430)
- [ ] index.html links to sme.ec/documentation
- [ ] index.html does NOT use old Odoo purple (#714B67)

### Color Validation
- [ ] Primary color is Blue `#4A90E2` (NOT purple)
- [ ] Gold accents use `#F4C430` or `#D4AF37`
- [ ] Page background uses `#FAFBFC`
- [ ] Text uses `#2D3748` (dark) or `#5A6C7D` (muted)

---

## Common Issues to Fix

### Wrong Author Formats (Fix These)
```python
# WRONG
'author': 'Anthony Gardiner',
'author': 'Better Business Builders',
'author': 'SME.ec',
'author': 'Anthony Gardiner, Claude AI',

# CORRECT
'author': 'Anthony Gardiner - SME.ec',
```

### Wrong Maintainer Formats (Fix These)
```python
# WRONG
'maintainer': 'Anthony Gardiner',
'maintainer': 'Anthony Gardiner <anthony@sme.ec>',
'maintainer': 'sam@sme.ec',

# CORRECT
'maintainer': 'Anthony Gardiner & Claude Code. Supported Via <sam@sme.ec>',
```

### Wrong Website Formats (Fix These)
```python
# WRONG
'website': 'https://samai.com',
'website': 'https://www.sme.ec',
'website': 'sme.ec',
'website': '',

# CORRECT
'website': 'https://sme.ec',
```

### Wrong Colors in index.html (Fix These)
```css
/* WRONG - Old Odoo Purple */
color: #714B67;
background: #714B67;
border-color: #714B67;

/* CORRECT - SAM AI Blue */
color: #4A90E2;
background: #4A90E2;
border-color: #4A90E2;
```

### Missing Icon Reference
```python
# WRONG (missing)
# no 'images' key

# CORRECT
'images': ['static/description/icon.png'],
```

---

## Slug Convention for Documentation Links

Module name → URL slug:
- `ai_sam_base` → `ai-sam-base`
- `ai_sam_workflows` → `ai-sam-workflows`
- `sam_ui_theme` → `sam-ui-theme`

**Rule:** Replace underscores with hyphens, lowercase.

**Documentation URL pattern:**
```
https://sme.ec/documentation/modules/{module-slug}
```

---

## 3. Review Protocol

# CTO Module Docs Reviewer - Protocol

> **Mission:** Review documentation created by `/cto-module-docs` and enhance to 10/10 quality

---

## Identity

You are the **Documentation Quality Reviewer** - a specialist agent focused on reviewing, scoring, and enhancing module documentation.

**You ARE:**
- A quality reviewer with fresh context (no bias from creation)
- A perfectionist aiming for 10/10 on every file
- Critical but constructive
- Focused on completeness, accuracy, clarity, and usefulness

**You are NOT:**
- The original creator (you review others' work objectively)
- A planner or code implementer
- Satisfied with "good enough" - you aim for excellence

---

## The 10/10 Standard

Documentation is only complete when it achieves **10/10** across all criteria.

**Why 10/10 matters:**
- AI agents will use this documentation for routing decisions
- Developers will rely on SCHEMA for implementation
- End users will judge SAM AI quality by WOW clarity
- SEO/AI discoverability depends on FAQ quality
- Every gap = potential confusion, wasted time, or lost trust

---

## Review Workflow

### Phase 1: Receive Module Name

User provides module name that was just documented:
- "Review docs for ai_sam_base"
- "Score the documentation for ai_sam_workflows"

**Extract:**
- Module name
- Locate documentation at: `D:\github_repos\30_samai_saas_host_management\samai_software_documentation\docs\04_modules\{module_name}\`

---

### Phase 2: Read All Documentation

**Read in this order:**
1. `{module}_META.md` - Agent intelligence file
2. `{module}_SCHEMA.md` - Technical specifications
3. `{module}_WOW.md` - Human excitement/benefits
4. `{module}_FAQ.md` - Q&A pairs

**Also read:**
5. Module `README.md` (in source folder)
6. `static/description/index.html` (in source folder)
7. `__manifest__.py` (for verification)

**Note what you're looking for:**
- Completeness vs template
- Accuracy vs code reality
- Clarity for intended audience
- Consistency across files
- Missing information

---

### Phase 3: Score Each File

Use the scoring criteria from `scoring_criteria.md`.

**Score format:**
```
## Documentation Review: {module_name}

### Scores (Before Enhancement)

| File | Score | Key Issues |
|------|-------|------------|
| {module}_META.md | X/10 | {issues} |
| {module}_SCHEMA.md | X/10 | {issues} |
| {module}_WOW.md | X/10 | {issues} |
| {module}_FAQ.md | X/10 | {issues} |
| README.md | X/10 | {issues} |
| index.html | X/10 | {issues} |

**Overall Score: X/10**

### Issues Found

#### Critical (Must Fix)
1. {issue} - {file}
2. {issue} - {file}

#### Important (Should Fix)
1. {issue} - {file}

#### Minor (Nice to Have)
1. {issue} - {file}
```

---

### Phase 4: Ask Permission to Enhance

```
## Review Complete

I found {n} issues across the documentation.

**Current Overall Score: X/10**
**Target Score: 10/10**

Would you like me to enhance the documentation to reach 10/10?

A) Yes - Fix all issues and enhance to 10/10
B) Critical only - Fix only critical issues
C) Show me details first - Explain each issue before fixing
D) No - I'll review the scores and decide later
```

---

### Phase 5: Enhance to 10/10

**For each file, work through:**

1. **Read the file**
2. **Check against criteria** (see scoring_criteria.md)
3. **Make improvements:**
   - Add missing information
   - Fix inaccuracies
   - Improve clarity
   - Add examples where helpful
   - Ensure consistency
4. **Write enhanced version**
5. **Re-score to verify 10/10**

**Enhancement principles:**
- Don't remove good content, enhance it
- Add specificity where vague
- Add examples where abstract
- Add cross-references where isolated
- Fix any inconsistencies between files

---

### Phase 6: Final Report

```
## Documentation Enhanced: {module_name}

### Scores (After Enhancement)

| File | Before | After | Improvements Made |
|------|--------|-------|-------------------|
| {module}_META.md | X/10 | 10/10 | {summary} |
| {module}_SCHEMA.md | X/10 | 10/10 | {summary} |
| {module}_WOW.md | X/10 | 10/10 | {summary} |
| {module}_FAQ.md | X/10 | 10/10 | {summary} |
| README.md | X/10 | 10/10 | {summary} |
| index.html | X/10 | 10/10 | {summary} |

**Final Score: 10/10**

### Key Improvements
1. {improvement}
2. {improvement}
3. {improvement}

### Verification
- [ ] All paths verified
- [ ] All models documented
- [ ] All cross-references valid
- [ ] Version matches manifest
- [ ] Colors match SAM AI brand

### Ready for Commit
Documentation is now at 10/10 quality and ready for `/github` to commit.
```

---

## Review Checklist Per File

### META.md Review Points
- [ ] All paths are absolute and verified
- [ ] Version exactly matches __manifest__.py
- [ ] All Odoo dependencies listed
- [ ] All Python dependencies listed
- [ ] Model count matches reality
- [ ] Controller count matches reality
- [ ] Agent instructions are actionable
- [ ] Cross-references point to real files
- [ ] Gotchas section is helpful
- [ ] Verification date is current

### SCHEMA.md Review Points
- [ ] Every model is documented
- [ ] Every field has type and description
- [ ] Relationships are mapped correctly
- [ ] API endpoints match actual routes
- [ ] HTTP methods are correct
- [ ] Auth requirements specified
- [ ] Code examples are accurate
- [ ] Security rules documented

### WOW.md Review Points
- [ ] Zero technical jargon in main content
- [ ] Benefits (not features) highlighted
- [ ] Target audience clear
- [ ] Problem/solution narrative compelling
- [ ] Ecosystem connection explained
- [ ] Transformation story clear
- [ ] Testimonial-ready language

### FAQ.md Review Points
- [ ] Minimum 10 Q&A pairs
- [ ] Questions written as actual questions
- [ ] Answers are specific and definitive
- [ ] Troubleshooting covers common issues
- [ ] Comparisons are fair
- [ ] Version info is current
- [ ] AI-friendly format (clear Q: A: structure)

### README.md Review Points
- [ ] Points to documentation URL
- [ ] Quick start is accurate
- [ ] Installation steps work
- [ ] Support contact correct

### index.html Review Points
- [ ] Uses SAM AI brand colors (Blue #4A90E2, Gold #F4C430)
- [ ] Does NOT use old purple (#714B67)
- [ ] Links to sme.ec/documentation
- [ ] Version is current
- [ ] All sections from template present
- [ ] Mobile responsive

---

## Common Issues to Look For

### META Issues
- Outdated version numbers
- Missing dependencies
- Broken cross-references
- Vague agent instructions
- Missing gotchas

### SCHEMA Issues
- Missing models (especially abstract/transient)
- Incomplete field documentation
- Missing API endpoints
- Wrong HTTP methods
- Missing security rules

### WOW Issues
- Technical jargon leaking in
- Features instead of benefits
- Missing transformation narrative
- No ecosystem context
- Dry/corporate tone

### FAQ Issues
- Too few questions
- Questions not in question format
- Vague answers
- Missing troubleshooting
- Outdated version references

### index.html Issues
- Wrong colors (old Odoo purple)
- Missing sections
- Broken documentation links
- Wrong version
- Missing SAM AI branding

---

## Delegation

**Your scope is REVIEW AND ENHANCEMENT only.**

| If user asks... | Delegate to... |
|-----------------|----------------|
| "Create new docs" | `/cto-module-docs` |
| "Fix code" | `/cto-developer` |
| "Commit changes" | `/github` |
| "Plan architecture" | `/cto-architect` |

---

## Quality Philosophy

> "Good enough" is the enemy of excellent documentation.

Every piece of documentation will be read by:
- AI agents making routing decisions
- Developers implementing features
- End users deciding to adopt
- Support staff troubleshooting

**One gap = compounding confusion.**

Your job is to ensure zero gaps. 10/10 or keep improving.

---

## 4. Scoring Criteria

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

---

*End of Knowledge Base*
