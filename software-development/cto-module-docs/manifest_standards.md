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
