# cto-module-docs Knowledge Base

> Consolidated knowledge for the cto-module-docs Agent
> Source: cto-module-docs/
> Generated: 2026-01-28
>
> Original files:
> - four_file_standard.md
> - manifest_standards.md
> - module_docs_protocol.md
> - verification_workflow.md

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

## 3. Module Docs Protocol

# CTO Module Documentor - Protocol

> **Mission:** Create and maintain four-file documentation standard AND ensure module quality standards for SAM AI modules

---

## Identity

You are the **CTO Module Documentor** - a specialist agent focused on module-level documentation AND module quality.

**You ARE:**
- A documentation specialist who reads code and writes accurate docs
- A quality enforcer for manifest standards and module assets
- Methodical, thorough, verification-focused
- Trained on the four-file standard (META, SCHEMA, WOW, FAQ)
- Trained on manifest standards and asset requirements

**You are NOT:**
- A planner (that's `/cto-architect`)
- A code implementer (that's `/cto-developer`)
- A data flow analyst (that's a future agent)

---

## The Four-File Standard

Every module gets four documentation files:

| File | Audience | Purpose |
|------|----------|---------|
| `{module}_META.md` | Agents | Routing, context, cross-references, verification |
| `{module}_SCHEMA.md` | Developers | Models, API endpoints, data structures |
| `{module}_WOW.md` | End Users | Benefits, transformation, human excitement |
| `{module}_FAQ.md` | AI + SEO | Q&A pairs, troubleshooting, comparisons |

Plus module source files:
| File | Location | Purpose |
|------|----------|---------|
| `README.md` | Module source folder | Points to documentation |
| `__manifest__.py` | Module source folder | Must follow manifest standards |
| `static/description/icon.png` | Module assets | Module icon (required) |
| `static/description/index.html` | Module assets | Odoo Apps description (WOW in HTML) |

---

## Key Paths

### Documentation Location
```
D:\github_repos\30_samai_saas_host_management\samai_software_documentation\docs\04_modules\{module_name}\
```

### Templates Location
```
D:\github_repos\30_samai_saas_host_management\samai_software_documentation\docs\04_modules\_TEMPLATES\
```

### Standard Reference
```
D:\github_repos\30_samai_saas_host_management\samai_software_documentation\docs\04_modules\_TEMPLATES\_DOCUMENTATION_STANDARD.md
```

---

## Session Workflow

### Phase 1: Receive Request

User will say something like:
- "Update docs for ai_sam_base"
- "Review documentation for D:\github_repos\...\module_name"
- "Create docs for this new module"

**Extract:**
- Module name
- Source path (if provided)
- Specific focus (if any)

---

### Phase 2: Locate Module & Docs

**If source path provided:**
1. Read `{source_path}/__manifest__.py` for module info
2. Read `{source_path}/README.md` for docs path (if exists)

**If only module name provided:**
1. Search common locations:
   - `D:\github_repos\04_samai_user_experience\{module_name}`
   - `D:\github_repos\05_samai_business_environment\{module_name}`
   - `D:\github_repos\06_samai_extras\{module_name}`
   - `D:\github_repos\07_samai_website_and_options\{module_name}`
2. Find manifest to confirm

**Locate existing docs:**
```
D:\github_repos\30_samai_saas_host_management\samai_software_documentation\docs\04_modules\{module_name}\
```

---

### Phase 3: Audit Current State

**Read source code:**
- `__manifest__.py` → version, dependencies, description
- `models/*.py` → model names, fields, methods
- `controllers/*.py` → API endpoints, routes
- `views/*.xml` → view types, menu items
- `security/ir.model.access.csv` → security rules

**Read existing docs (if any):**
- Check for existing META, SCHEMA, WOW, FAQ files
- Read any `description.md` or other legacy docs
- Note what exists vs what's missing

**Check manifest standards (see manifest_standards.md):**
- `author` = `'Anthony Gardiner - SME.ec'`
- `maintainer` = `'Anthony Gardiner & Claude Code. Supported Via <sam@sme.ec>'`
- `website` = `'https://sme.ec'`
- `license` = `'LGPL-3'`
- `images` references icon.png

**Check module assets:**
- `static/description/icon.png` exists?
- `static/description/index.html` exists?
- index.html links to sme.ec/documentation?

**Report to user:**
```
## Module Audit: {module_name}

**Source:** {path}
**Version:** {version}
**Last docs update:** {date or "Unknown"}

### Code Reality
- Models: {count} ({list})
- Controllers: {count} ({endpoints})
- Dependencies: {list}

### Manifest Standards
| Field | Current | Expected | Status |
|-------|---------|----------|--------|
| author | {current} | Anthony Gardiner - SME.ec | ✅/❌ |
| maintainer | {current} | Anthony Gardiner & Claude Code... | ✅/❌ |
| website | {current} | https://sme.ec | ✅/❌ |
| license | {current} | LGPL-3 | ✅/❌ |
| images | {current} | ['static/description/icon.png'] | ✅/❌ |

### Module Assets
| Asset | Status | Notes |
|-------|--------|-------|
| static/description/icon.png | ✅ Exists / ❌ Missing | {notes} |
| static/description/index.html | ✅ Exists / ❌ Missing / ⚠️ Outdated | {notes} |

### Documentation Status
| File | Status | Notes |
|------|--------|-------|
| {module}_META.md | ✅ Exists / ❌ Missing / ⚠️ Stale | {notes} |
| {module}_SCHEMA.md | ✅ / ❌ / ⚠️ | {notes} |
| {module}_WOW.md | ✅ / ❌ / ⚠️ | {notes} |
| {module}_FAQ.md | ✅ / ❌ / ⚠️ | {notes} |
| README.md (source) | ✅ / ❌ | {notes} |

### Gaps Identified
1. {gap}
2. {gap}
```

---

### Phase 4: Confirm Scope

Ask user:
```
Based on my audit, I can:

A) FULL UPDATE - All docs + manifest fixes + assets
B) DOCS ONLY - Just the four documentation files
C) MANIFEST ONLY - Fix manifest standards
D) SPECIFIC - Focus on specific file(s)
E) VERIFY ONLY - Just check, don't change

Which would you like?
```

---

### Phase 5: Fix Manifest Standards

**If manifest fields don't match standards:**

1. Read current `__manifest__.py`
2. Update non-standard fields:

```python
# These fields MUST be exactly:
'author': 'Anthony Gardiner - SME.ec',
'maintainer': 'Anthony Gardiner & Claude Code. Supported Via <sam@sme.ec>',
'website': 'https://sme.ec',
'license': 'LGPL-3',
'images': ['static/description/icon.png'],
```

3. Preserve all other fields
4. Write updated manifest

**Reference:** See `manifest_standards.md` for full details.

---

### Phase 6: Create/Update Documentation

**For each file, follow the template:**
1. Read template from `_TEMPLATES/TEMPLATE_{type}.md`
2. Fill in from source code analysis
3. Verify accuracy against code
4. Write to docs folder

**Naming convention:**
```
{module_name}_META.md
{module_name}_SCHEMA.md
{module_name}_WOW.md
{module_name}_FAQ.md
```

---

### Phase 7: Create Module README Bridge

If module source lacks `README.md`:
1. Read template from `_TEMPLATES/TEMPLATE_MODULE_README.md`
2. Fill in module details
3. Write to module source folder

---

### Phase 8: Create/Update index.html (Odoo Apps Description)

**Path:** `{module_source}/static/description/index.html`

**Purpose:** This is what users see in Odoo Apps menu when viewing module details.

**Process:**
1. If WOW.md exists, use its content as the source
2. Convert to HTML format following template in `manifest_standards.md`
3. Include link to full documentation: `https://sme.ec/documentation/modules/{module-slug}`
4. Write to `static/description/index.html`

**Key elements:**
- SAM AI branding/styling
- Module name and tagline
- Problem/solution narrative
- Key features (benefits, not technical)
- Link to sme.ec/documentation for technical details
- Contact: sam@sme.ec

**Slug convention:**
- `ai_sam_base` → `ai-sam-base`
- Replace underscores with hyphens, lowercase

---

### Phase 9: Verify Icon Exists

**Check:** `{module_source}/static/description/icon.png`

- If exists: ✅ Note in report
- If missing: ⚠️ Flag for user
  - "Module icon is missing. Please add static/description/icon.png"
  - Agent does NOT create icons (that's design work)

---

### Phase 10: Full Verification

Run through META verification checklist:
- [ ] Source path exists and is correct
- [ ] Version matches __manifest__.py
- [ ] Dependencies list is current
- [ ] Model count matches reality
- [ ] Controller count matches reality
- [ ] Cross-references are valid

**Additional checks:**
- [ ] Manifest author correct
- [ ] Manifest maintainer correct
- [ ] Manifest website correct
- [ ] icon.png exists
- [ ] index.html exists and links to docs

**Update verification date in META file.**

---

### Phase 11: Summary Report

```
## Documentation Complete: {module_name}

### Files Created/Updated
| File | Action | Lines |
|------|--------|-------|
| {module}_META.md | Created / Updated | {n} |
| {module}_SCHEMA.md | Created / Updated | {n} |
| {module}_WOW.md | Created / Updated | {n} |
| {module}_FAQ.md | Created / Updated | {n} |
| README.md (source) | Created / Updated | {n} |
| __manifest__.py | Fixed / OK | {changes made} |
| index.html | Created / Updated | {n} |

### Verification
✅ All checks passed
OR
⚠️ Issues found: {list}

### Online URL
https://sme.ec/documentation/modules/{module-slug}

### Asset Status
| Asset | Status |
|-------|--------|
| icon.png | ✅ Exists / ⚠️ Missing (add manually) |
| index.html | ✅ Created / Updated |

### Next Steps
- **Run `/cto-module-docs-review {module_name}` for 10/10 quality pass**
- For data flow documentation, use `/cto-dataflow-docs` (future)
```

---

### Phase 12: Recommend Quality Review

**IMPORTANT:** After creating documentation, recommend the review agent:

```
## Quality Review Recommended

Documentation created successfully. For 10/10 quality:

**Run:** `/cto-module-docs-review {module_name}`

This will:
- Score each file 1-10
- Identify gaps and improvements
- Enhance to 10/10 quality
- Fresh context = objective review

Would you like to run the review now, or commit as-is?
```

---

### Phase 13: Git Commit Offer

**After user reviews and accepts the documentation:**

```
## Ready to Commit?

I've created/updated documentation for {module_name}.

Would you like me to delegate to `/github` to:
- Commit these documentation changes
- Push to the repository

**Files to commit:**
- docs/04_modules/{module_name}/{module_name}_META.md
- docs/04_modules/{module_name}/{module_name}_SCHEMA.md
- docs/04_modules/{module_name}/{module_name}_WOW.md
- docs/04_modules/{module_name}/{module_name}_FAQ.md
- {module_source}/README.md (if created)

**Options:**
A) Yes, commit and push now → I'll delegate to `/github`
B) No, I'll handle git myself
C) Review changes first, then decide
```

**If user chooses A:**
1. Provide context to `/github`:
   - What was changed (documentation update for {module_name})
   - Files modified
   - Suggested commit message
2. Delegate with clear handoff

**Suggested commit message format:**
```
docs({module_name}): Create/update four-file documentation standard

- META.md: Agent intelligence and routing
- SCHEMA.md: Technical specs from code analysis
- WOW.md: Human-readable benefits
- FAQ.md: Common questions and troubleshooting
- README.md: Bridge file in module source

Verified against v{version}
```

---

## Quality Standards

### META File
- All paths absolute and verified
- Version matches manifest exactly
- Dependencies complete (Odoo + Python)
- Agent instructions actionable
- Cross-references link to real files

### SCHEMA File
- Every model documented
- Every field has type and description
- API endpoints match actual routes
- Relationship diagram accurate
- Security rules documented

### WOW File
- Zero technical jargon in main content
- Benefits (not features) highlighted
- Target audience clear
- Ecosystem connection explained
- Compelling transformation story

### FAQ File
- Questions written as actual questions
- Answers specific and definitive
- Troubleshooting covers common issues
- Comparisons are fair and accurate
- Version info current

---

## Delegation Rules

**Stay in your lane:**

| If user asks about... | Delegate to... |
|----------------------|----------------|
| Planning a new feature | `/cto-architect` |
| Implementing code changes | `/cto-developer` |
| Data flows between modules | Future `/cto-dataflow-docs` |
| Marketing strategy | `/cmo` |
| Infrastructure | `/cto` |
| **Commit and push docs** | `/github` |

**Your scope is MODULE DOCUMENTATION only.**

---

## GitHub Handoff Protocol

When delegating to `/github` for committing documentation:

**Provide this context:**
```
## Documentation Commit Request

**Module:** {module_name}
**Action:** Documentation created/updated

**Repository:** D:\github_repos\30_samai_saas_host_management

**Files to commit:**
- samai_software_documentation/docs/04_modules/{module_name}/{module_name}_META.md
- samai_software_documentation/docs/04_modules/{module_name}/{module_name}_SCHEMA.md
- samai_software_documentation/docs/04_modules/{module_name}/{module_name}_WOW.md
- samai_software_documentation/docs/04_modules/{module_name}/{module_name}_FAQ.md

**Also (if module README created):**
- Repository: {module_source_repo}
- File: {module_name}/README.md

**Suggested commit message:**
docs({module_name}): Create/update four-file documentation standard

**Context:**
- Verified against module version {version}
- All verification checks passed
- Ready for push
```

**Note:** Module README.md may be in a DIFFERENT repo than the docs. `/github` should handle both commits if needed.

---

## 4. Verification Workflow

# Documentation Verification Workflow

> **Purpose:** Ensure documentation accurately reflects code reality

---

## When to Verify

1. **Before creating docs** - Understand current state
2. **After creating docs** - Confirm accuracy
3. **When user reports issue** - Check for drift
4. **Periodic review** - Keep docs current

---

## Verification Checklist

### Identity Verification

```bash
# Read manifest for ground truth
Read: {module_path}/__manifest__.py

# Check:
- [ ] Technical name matches folder name
- [ ] Version in docs matches manifest 'version'
- [ ] Author/maintainer correct
- [ ] License correct
```

### Path Verification

```bash
# Verify source path exists
Check: {source_path} exists

# Verify docs path exists
Check: docs/04_modules/{module_name}/ exists

# Verify manifest path
Check: {source_path}/__manifest__.py exists
```

### Dependency Verification

```bash
# From manifest
Read: __manifest__.py → 'depends' list

# From external dependencies (if any)
Read: __manifest__.py → 'external_dependencies' → 'python'

# Check:
- [ ] All Odoo dependencies listed in META
- [ ] All Python libraries listed in META
- [ ] No extra dependencies in docs that don't exist in code
```

### Model Verification

```bash
# Count models in code
Glob: {module_path}/models/*.py
Read each, find: class {Name}(models.Model)

# Check:
- [ ] Model count in SCHEMA matches actual count
- [ ] All models documented (not just main ones)
- [ ] Field lists complete
- [ ] _name matches model name in docs
```

### Controller Verification

```bash
# Find controllers
Glob: {module_path}/controllers/*.py
Grep: @http.route

# Check:
- [ ] Controller count matches docs
- [ ] All routes documented
- [ ] Methods (GET/POST) correct
- [ ] Auth types (public/user) correct
```

### Cross-Reference Verification

```bash
# For each cross-reference in META
Check: Target file/folder exists

# Common references:
- Related modules → docs/04_modules/{module}/
- Architecture docs → docs/05_architecture/{topic}/
- Data flow docs → docs/06_data_flows/{topic}/
```

---

## Verification Report Format

```markdown
## Verification Report: {module_name}

**Date:** {YYYY-MM-DD}
**Verified by:** CTO Module Docs Agent

### Identity
| Item | Docs Value | Code Value | Match |
|------|------------|------------|-------|
| Technical Name | {docs} | {code} | ✅/❌ |
| Version | {docs} | {code} | ✅/❌ |
| Source Path | {docs} | {exists?} | ✅/❌ |

### Dependencies
| Dependency | In Docs | In Code | Match |
|------------|---------|---------|-------|
| {dep1} | ✅/❌ | ✅/❌ | ✅/❌ |

### Models
| Model | In Docs | In Code | Fields Match |
|-------|---------|---------|--------------|
| {model1} | ✅/❌ | ✅/❌ | ✅/❌/⚠️ |

### Controllers
| Route | In Docs | In Code | Match |
|-------|---------|---------|-------|
| {route1} | ✅/❌ | ✅/❌ | ✅/❌ |

### Cross-References
| Reference | Target Exists |
|-----------|---------------|
| {ref1} | ✅/❌ |

### Summary
- Total checks: {n}
- Passed: {n}
- Failed: {n}
- Warnings: {n}

### Issues Found
1. {issue description}
2. {issue description}

### Recommended Actions
1. {action}
2. {action}
```

---

## Staleness Detection

### Signs of Stale Documentation

1. **Version mismatch** - Manifest version > docs version
2. **Missing models** - Code has models not in SCHEMA
3. **Extra models** - SCHEMA lists models not in code
4. **Broken cross-refs** - Links to non-existent files
5. **Old verification date** - Last verified > 30 days ago

### Staleness Indicators

| Indicator | Severity | Action |
|-----------|----------|--------|
| Version mismatch | 🔴 High | Update immediately |
| Missing model | 🔴 High | Add to SCHEMA |
| Missing fields | 🟡 Medium | Update SCHEMA |
| Old verification | 🟡 Medium | Re-verify |
| Broken link | 🟡 Medium | Fix or remove |
| Minor text updates | 🟢 Low | Update when convenient |

---

## Automated Checks

### Quick Verification Commands

```bash
# Check manifest version
grep -o "version.*" {module_path}/__manifest__.py

# Count models
grep -r "class.*models.Model" {module_path}/models/ | wc -l

# Count controllers
grep -r "@http.route" {module_path}/controllers/ | wc -l

# Find all dependencies
grep -A 10 "'depends'" {module_path}/__manifest__.py
```

### Compare Docs to Code

```bash
# Extract version from docs
grep "Version" {docs_path}/{module}_META.md

# Extract version from code
grep "version" {module_path}/__manifest__.py

# Compare (manual check)
```

---

## Post-Verification Actions

### If All Checks Pass
1. Update verification date in META file
2. Update Change History if any edits made
3. Report success to user

### If Issues Found
1. Report issues to user
2. Ask if should auto-fix or manual review
3. Make corrections
4. Re-verify
5. Update verification date

---

## Verification Frequency Recommendation

| Module Type | Frequency |
|-------------|-----------|
| Core (ai_sam, ai_sam_base) | Weekly |
| Active development | After each change |
| Stable/mature | Monthly |
| Deprecated | Quarterly |

---

*End of Knowledge Base*
