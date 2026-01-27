# SAM AI Packaging Knowledge (Living Document - Auto-Updated)

**Purpose:** SAM AI-specific dependencies, module structure, installation requirements

**UPDATE PROTOCOL:** This file is auto-scanned and updated EVERY session by reading actual repos

**Last Scanned:** 2025-11-12 16:00:00

**Source Repos:**
- `${REPO_AI_BRAIN}\ai_brain\` (ai_brain core module)
- `${REPO_AI_SAM_CORE}\` (ai_sam framework + 6 intelligence modules)
- `${REPO_ODOO_15_CORE}\` (Odoo core modules source)

---

## 🔒 STRATEGIC INTENT: LEAN SAAS INSTALLER (LOCKED)

**Date Locked:** 2025-11-12
**Business Owner Decision:** Final, all agents must respect

### Core Business Principle: Minimize Infrastructure Bloat

**WHY THIS MATTERS:**
- SAM AI is a **SaaS offering** → Every customer = one server instance
- **Bloated installer** = Higher server requirements (RAM/CPU/Storage)
- **Higher server requirements** = Higher hosting costs per customer
- **Higher hosting costs** = Less competitive pricing OR lower profit margins
- **Our competitive advantage** = Lean, focused AI assistant (not full ERP)

**Business Impact:**
```
Bloated Installer (example):
- 2GB installation
- 4GB RAM minimum
- Hosting: $40/month per customer
- 100 customers = $4,000/month hosting cost

Lean Installer (target):
- 500MB installation
- 2GB RAM minimum
- Hosting: $15/month per customer
- 100 customers = $1,500/month hosting cost
- SAVINGS: $2,500/month = $30,000/year
```

**Strategic Decision:** Bundle ONLY what SAM AI needs, nothing more.

---

### 📋 APPROVED MODULES (What SAM AI Actually Needs)

**Odoo Core (Required):**
- `base` - Odoo foundation (models, ORM, security)
- `web` - Web interface framework
- `mail` - Messaging, notifications, activity tracking
- `discuss` - Real-time chat (SAM AI conversations)
- `contacts` - Partner/user management

**SAM AI Modules (Required):**
- `ai_brain` - Core AI data models (conversations, memory, context)
- `ai_sam` - Canvas framework (universal rendering engine)
- `ai_sam_memory` - Knowledge graphs, vector search
- `the_ai_automator` - N8N workflow integration
- `ai_sam_messenger` - SAM Creative chat interface
- `ai_sam_intelligence` - Agent registry, documentation intelligence
- `ai_sam_workflows` - Workflow automation specialist
- `ai_sam_lead_generator` - Lead generation, web scraping

**TOTAL TARGET: ~12 modules, ~500MB installation**

---

### ❌ FORBIDDEN MODULES (Bloat - Do NOT Bundle)

**HR Modules (NOT NEEDED):**
- `hr` - Human resources management
- `hr_contract` - Employee contracts
- `hr_work_entry` - Time tracking
- `hr_work_entry_contract` - Contract time tracking
- `hr_holidays` - Leave management
- `hr_attendance` - Attendance tracking
- `hr_payroll` - Payroll processing
- **Impact:** +200MB, +512MB RAM, NOT used by SAM AI

**Inventory/Supply Chain (NOT NEEDED):**
- `stock` - Inventory management
- `stock_account` - Inventory accounting
- `purchase` - Procurement
- `sale_stock` - Sales + inventory integration
- **Impact:** +150MB, +256MB RAM, NOT used by SAM AI

**Manufacturing (NOT NEEDED):**
- `mrp` - Manufacturing resource planning
- `mrp_account` - Manufacturing accounting
- `quality_control` - Quality management
- **Impact:** +100MB, +256MB RAM, NOT used by SAM AI

**E-commerce (NOT NEEDED):**
- `website` - Website builder
- `website_sale` - E-commerce
- `payment_*` - Payment processing
- **Impact:** +300MB, +512MB RAM, NOT used by SAM AI

**Accounting (MAYBE - Evaluate):**
- `account` - Full accounting system
- **If SAM AI doesn't track finances:** DON'T bundle
- **If SAM AI needs basic invoicing:** Evaluate minimal subset
- **Decision:** TBD based on SAM AI requirements

---

### 🎯 DECISION FRAMEWORK: "Should We Bundle This Module?"

**Ask these questions:**

1. **Does SAM AI directly call this module's functionality?**
   - YES → Consider bundling
   - NO → DON'T bundle

2. **Is this module a dependency of an approved module?**
   - YES → Check if approved module actually needs it
   - NO → DON'T bundle

3. **What's the size/performance impact?**
   - < 10MB, < 50MB RAM → Acceptable if needed
   - > 50MB, > 256MB RAM → Strong justification required

4. **Can we achieve same goal with lighter alternative?**
   - YES → Use lighter alternative
   - NO → Bundle if truly required

**Example Decision Process:**

```
Module: hr_work_entry_contract (example from user's selection)

Q1: Does SAM AI call HR work entry/contract functions?
A1: NO - SAM AI is an AI assistant, not HR management system

Q2: Is it a dependency of ai_brain or ai_sam?
A2: NO - Neither ai_brain nor ai_sam depend on HR modules

Q3: Size/performance impact?
A3: ~50MB + dependencies, +256MB RAM minimum

Q4: Lighter alternative?
A4: N/A - functionality not needed at all

DECISION: ❌ DO NOT BUNDLE
RATIONALE: Adds cost with zero value to SAM AI users
```

---

### 🚨 AGENT PROTOCOLS: HOW TO RESPECT THIS DECISION

**For /exe-diagnose:**
When analyzing build scripts and module lists:
- Check: Are we bundling modules from FORBIDDEN list?
- If YES → Document as "BLOAT ISSUE" in CURRENT_STATE.md
- Severity: HIGH (impacts hosting costs)

**For /exe-update:**
When implementing fixes:
- If fix involves adding module dependency → Check APPROVED list first
- If module not approved → Flag for user review before bundling
- Never auto-bundle HR/inventory/manufacturing modules

**For /exe-approval:**
Quality gate check should include:
- **Check 6: Bloat Validation**
  - Read build scripts
  - List all modules being bundled
  - Compare against APPROVED list
  - If unapproved modules found → NO-GO
  - Report: "Bloat detected: [module list], estimated impact: +[size]MB, +[RAM]MB"

**If Strategic Intent Needs Override:**
User must explicitly say: "Override lean SaaS principle, bundle [module] because [business justification]"
- Document override in CURRENT_STATE.md
- Update APPROVED list
- Track size/performance impact

---

## 🧠 SAM AI Architecture Overview (For Installer Context)

### The Three-Layer Design

```
┌─────────────────────────────────────────────┐
│  LAYER 3: BRANCH MODULES (Features)         │
│  ├─ ai_sam_memory (Knowledge graphs)        │
│  ├─ the_ai_automator (N8N workflows)        │
│  ├─ ai_sam_messenger (SAM Creative chat)    │
│  └─ [other branches...]                     │
├─────────────────────────────────────────────┤
│  LAYER 2: AI_SAM (Framework - Canvas Core)  │
│  ├─ Canvas engine (universal rendering)     │
│  ├─ Platform loader (dynamic renderers)     │
│  ├─ Controllers (HTTP endpoints)            │
│  └─ Common utilities                         │
├─────────────────────────────────────────────┤
│  LAYER 1: AI_BRAIN (Data Models)            │
│  ├─ 40+ models (pure data, no views)        │
│  ├─ ai.conversation, ai.message, etc.       │
│  └─ Graph/Vector DB integrations            │
└─────────────────────────────────────────────┘
```

**Installation Order (CRITICAL):**
1. PostgreSQL (infrastructure)
2. Python + Odoo 18 (platform)
3. **Odoo Core Modules** (base, mail, web, discuss, etc.) - MUST be FLAT in addons/
4. ai_brain (LAYER 1 - foundation - depends on Odoo core)
5. ai_sam (LAYER 2 - depends on ai_brain)
6. Branch modules (LAYER 3 - depend on ai_sam)

**Installer must respect this order or SAM AI won't work!**

**CRITICAL DISCOVERY (2025-11-12):**
- Odoo core modules MUST be bundled FLAT in `addons/` directory
- Source: `${REPO_ODOO_15_CORE}\`
- Structure: `addons\mail\`, `addons\base\`, `addons\web\` (NOT `addons\18.0\mail\`)
- Previous installer mistake: Nested in `addons\18.0\` subdirectory causing module lookup failure

---

## 📦 LAYER 1: ai_brain Module (Core Data Models)

### Location:
```
${REPO_AI_BRAIN}\ai_brain\
```

### Manifest (__manifest__.py):

**Last Scanned:** 2025-11-12 16:00:00

```python
{
    'name': 'AI Brain - V3 Foundation',
    'version': '18.0.7.3.0',
    'category': 'Productivity/AI',
    'depends': [
        'base',
        'mail',
        'web',
    ],
    'data': [
        'security/sam_member_security.xml',
        'security/ir.model.access.csv',
        'data/ai_service_type_data.xml',
        'data/knowledge_domain_data.xml',
        'data/ai_memory_search_log_cron.xml',
    ],
    'post_init_hook': 'post_init_hook',
    'post_update_hook': 'post_update_hook',
    'installable': True,
    'application': True,
    'auto_install': False,
}
```

**Key Note:** ai_brain has NO SAM AI dependencies - only depends on Odoo core (base, mail, web)

### Key Files to Bundle:

**Models (Python):**
```
04-samai-brain/
  └─ models/
      ├─ ai_conversation.py
      ├─ ai_message.py
      ├─ ai_service.py
      ├─ ai_agent.py
      ├─ [Agent: scan and list all models]
```

**Security Rules (MANDATORY):**
```
04-samai-brain/
  └─ security/
      └─ ir.model.access.csv
```

**Data Files:**
```
04-samai-brain/
  └─ data/
      └─ [Agent: scan and list]
```

### Python Dependencies (Beyond Odoo):

**Agent TODO:** Check if requirements.txt exists in 04-samai-brain

```
# Expected packages (Agent should scan and verify):
psycopg2-binary   # PostgreSQL adapter
anthropic         # Claude API client
requests          # HTTP client
[Agent: scan requirements.txt and list all]
```

### Known Installation Gotchas:

**Issue 1:** ai_brain MUST install before ai_sam
- **Why:** ai_sam depends on ai_brain models
- **Symptom:** If installed out of order, import errors

**Issue 2:** Security rules are mandatory
- **Why:** Odoo 18 requires access control for all custom models
- **Symptom:** Module loads but models inaccessible

**Issue 3:** [Agent: Add gotchas discovered during diagnostics]

---

## 📦 LAYER 2: ai_sam Module (Framework Core)

### Location:
```
${REPO_AI_SAM_CORE}\ai_sam\
```

### Manifest (__manifest__.py):

**Last Scanned:** 2025-11-12 16:00:00

```python
{
    'name': 'SAM AI Core - V3 Framework',
    'version': '18.0.6.5.0',
    'category': 'Productivity/AI',
    'depends': [
        'base',
        'web',
        'ai_brain',  # CRITICAL: Must depend on Layer 1
    ],
    'data': [
        'security/ir.model.access.csv',
        'security/sam_user_settings_security.xml',
        'data/sam_mode_context_data.xml',
        'data/cleanup_orphaned_memory_menus.xml',
        'data/memory/memory_graph_platform.xml',
        'views/canvas_container.xml',
        # ... (50+ view files - see full manifest for complete list)
        'views/sam_ai_menus_consolidated.xml',
    ],
    'assets': {
        'web.assets_web': [
            'ai_sam/static/src/config/sam_config.js',
            'ai_sam/static/src/config/sam_logger.js',
        ],
        'web.assets_backend': [
            'ai_sam/static/src/js/sam_chat_vanilla_v2.js',
            'ai_sam/static/src/js/sam_chat_vanilla_v2_action.js',
            'ai_sam/static/src/chat_ui/sam_chat_bubble.js',
            # ... (extensive JS/CSS assets - canvas engine, chat UI, etc.)
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'sequence': 95,
    'post_init_hook': 'post_init_hook',
}
```

**Key Note:** ai_sam depends on ai_brain + Odoo core. Contains 1,079 files including 300+ vendor icons.

### Key Files to Bundle:

**Controllers (Python):**
```
05-samai-core/
  └─ controllers/
      ├─ sam_ai_chat_controller.py
      ├─ [Agent: scan and list all controllers]
```

**Static Assets (JS/CSS) - CRITICAL for UI:**
```
05-samai-core/
  └─ static/
      └─ src/
          ├─ js/
          │   ├─ canvas_engine.js
          │   ├─ sam_chat_vanilla_v2.js
          │   └─ [Agent: scan and list all JS]
          ├─ css/
          │   └─ [Agent: scan and list all CSS]
          └─ xml/
              └─ [Agent: scan and list QWeb templates]
```

**Views (XML):**
```
05-samai-core/
  └─ views/
      ├─ sam_ai_views.xml
      └─ [Agent: scan and list all views]
```

### Python Dependencies:

**Agent TODO:** Check if requirements.txt exists in 05-samai-core

```
# Expected (Agent should scan):
[Agent: List packages if requirements.txt exists]
```

### Known Installation Gotchas:

**Issue 1:** Static assets must be in correct location
- **Why:** Odoo 18 OWL framework expects specific paths
- **Symptom:** UI loads but blank (JS not found)

**Issue 2:** Canvas engine requires ai_brain models
- **Why:** Queries ai.conversation, ai.message models
- **Symptom:** Runtime errors if ai_brain not installed first

**Issue 3:** [Agent: Add gotchas discovered during diagnostics]

---

## 📦 LAYER 3: Branch Modules (Optional Features)

**Agent TODO:** Scan github-repos folder for all modules beyond 04/05

### Module List (Auto-Detected):

```
[Agent: Find all folders with __manifest__.py]
[Agent: List name, version, dependencies for each]

Expected modules:
- ai_sam_memory
- the_ai_automator
- ai_sam_messenger
- ai_sam_lead_generator
- [etc...]
```

### Installation Strategy:

**🔒 LOCKED DECISION (2025-11-12): OPTION C - EVERYTHING**

Bundle ALL 8 modules from ONLY 2 repositories:
- **04-samai-brain:** 1 module (ai_brain)
- **05-samai-core:** 7 modules (ai_sam + 6 intelligence suite)
  - ai_sam
  - ai_sam_cache_manager
  - ai_sam_github_installer
  - ai_sam_intelligence
  - ai_sam_memory
  - ai_sam_messenger
  - ai_sam_ui

**Rationale:**
- Complete SAM AI desktop experience out-of-box
- Installer size: ~600-700MB (acceptable for desktop app)
- No post-install module management required
- Production-ready solution

---

## 🔗 Complete Dependency Tree (Auto-Generated)

**Agent TODO:** Build full dependency graph every Phase 1

```
Infrastructure Layer:
├─ PostgreSQL 15+
├─ Python 3.10+
└─ Odoo 18.0

Python Packages:
├─ anthropic (Claude API)
├─ psycopg2-binary (PostgreSQL)
├─ requests (HTTP client)
└─ [Agent: Scan all requirements.txt files and merge]

SAM AI Core (Must install in this order):
├─ 1. ai_brain (no SAM AI dependencies)
└─ 2. ai_sam (depends on: ai_brain)

SAM AI Branches (Can install any order after core):
├─ ai_sam_memory (depends on: ai_brain, ai_sam)
├─ the_ai_automator (depends on: ai_brain, ai_sam)
└─ [Agent: Scan and map all branch dependencies]
```

---

## 🔄 Installation Sequence (For Installer Script)

### Phase 1: Infrastructure
```powershell
# Install PostgreSQL portable
# Install Python portable
# Install Odoo 18 (to custom path)
```

### Phase 2: Database Initialization
```powershell
# Initialize PostgreSQL database
# Create SAM AI database: sam_ai
# Create Odoo user: odoo_user
```

### Phase 3: Odoo Configuration
```powershell
# Create odoo.conf with:
# - Database connection (PostgreSQL)
# - Addons path (ai_brain, ai_sam, branches)
# - Admin password
# - Port 8069
```

### Phase 4: Module Installation (CRITICAL ORDER)
```bash
# Start Odoo
# Install ai_brain FIRST (foundation)
odoo-bin -d sam_ai --init=ai_brain

# Install ai_sam SECOND (depends on ai_brain)
odoo-bin -d sam_ai --init=ai_sam

# Install branches THIRD (optional)
odoo-bin -d sam_ai --init=ai_sam_memory,the_ai_automator
```

### Phase 5: Service Registration
```powershell
# Register Odoo as Windows service
# Set startup type: Automatic
# Start service
```

### Phase 6: Validation
```powershell
# Test http://localhost:8069
# Verify modules loaded
# Verify database accessible
```

---

## 📂 Files to Bundle in Installer

### From 04-samai-brain (COMPLETE module):
```
[Agent: List all files in 04-samai-brain recursively]
Expected structure:
├─ __init__.py
├─ __manifest__.py
├─ models/
│   ├─ __init__.py
│   └─ [all .py files]
├─ security/
│   └─ ir.model.access.csv
├─ views/
│   └─ [all .xml files]
└─ data/
    └─ [all .xml files]

Total files: [Agent: Count]
Total size: [Agent: Calculate]
```

### From 05-samai-core (COMPLETE module):
```
[Agent: List all files in 05-samai-core recursively]
Expected structure:
├─ __init__.py
├─ __manifest__.py
├─ controllers/
│   └─ [all .py files]
├─ models/
│   └─ [all .py files]
├─ static/
│   └─ src/
│       ├─ js/ [all .js files]
│       ├─ css/ [all .css files]
│       └─ xml/ [all .xml files]
└─ views/
    └─ [all .xml files]

Total files: [Agent: Count]
Total size: [Agent: Calculate]
```

### Branch Modules (If bundling):
```
[Agent: List all files for each branch module]
```

---

## ⚠️ Known Issues & Workarounds (Painfully Learned)

### Issue 1: Module Installation Order
**Problem:** Installing ai_sam before ai_brain causes import errors
**Solution:** Installer must enforce order (ai_brain → ai_sam → branches)
**Detection:** Check __manifest__.py depends field

### Issue 2: Static Assets Not Loading
**Problem:** Odoo 18 OWL can't find JS/CSS files
**Solution:** Ensure static/src/ structure exactly matches Odoo convention
**Detection:** Browser console shows 404 errors for .js files

### Issue 3: Security Rules Missing
**Problem:** Models defined but not accessible in UI
**Solution:** Every custom model MUST have ir.model.access.csv entry
**Detection:** Odoo log shows "Access Denied" errors

### Issue 4: Database Connection Failure
**Problem:** Odoo can't connect to PostgreSQL after install
**Solution:** odoo.conf must have correct db_host, db_port, db_user, db_password
**Detection:** Odoo log shows "could not connect to server"

### Issue 5: Wrong Directory Structure in Installer (2025-11-12 Discovery)
**Problem:** Previous installer bundled Odoo core modules in nested `addons\18.0\` subdirectory
**Solution:** Bundle Odoo core modules FLAT in `addons\` directory from source: `${REPO_ODOO_15_CORE}\`
**Detection:** Check installation structure - should be `addons\mail\` NOT `addons\18.0\mail\`
**Impact:** Odoo cannot find core modules, causing KeyError crashes for 'mail.mail', 'discuss.channel.member', etc.

---

## 🔄 Auto-Update Protocol (Agent's Responsibility)

### Every Phase 1 (Review Current State):

**Step 1: Scan ai_brain Module**
```bash
# Read manifest
cat "${REPO_AI_BRAIN}\__manifest__.py"

# Extract version, dependencies, data files
# Update this document sections:
# - LAYER 1: ai_brain Module > Manifest
# - LAYER 1: ai_brain Module > Key Files to Bundle

# Count files
find "${REPO_AI_BRAIN}" -type f | wc -l
# Update: "Total files: [count]"

# Check for requirements.txt
test -f "${REPO_AI_BRAIN}\requirements.txt"
# If exists: Parse and update Python Dependencies section
```

**Step 2: Scan ai_sam Module**
```bash
# Read manifest
cat "${REPO_AI_SAM_CORE}\__manifest__.py"

# Extract version, dependencies, assets
# Update this document sections:
# - LAYER 2: ai_sam Module > Manifest
# - LAYER 2: ai_sam Module > Key Files to Bundle

# Count files
find "${REPO_AI_SAM_CORE}" -type f | wc -l
# Update: "Total files: [count]"

# List static assets
find "${REPO_AI_SAM_CORE}\static\src" -name "*.js" -o -name "*.css"
# Update: Static Assets section
```

**Step 3: Scan Branch Modules**
```bash
# Find all modules
find "${SAMAI_ROOT}" -name "__manifest__.py" -not -path "*/04-samai-brain/*" -not -path "*/05-samai-core/*"

# For each branch:
# - Read __manifest__.py
# - Extract name, version, depends
# - Update LAYER 3: Branch Modules section
```

**Step 4: Build Dependency Tree**
```python
# Parse all __manifest__.py 'depends' fields
# Create hierarchical tree
# Update: Complete Dependency Tree section
```

**Step 5: Update "Last Scanned" Timestamp**
```markdown
**Last Scanned:** 2025-11-12 14:35:00
```

**Step 6: Flag Changes**
If any significant changes detected:
- New module added/removed
- Version changed
- Dependencies changed
- New Python packages required

**Report to user:**
"⚠️ SAM AI modules changed since last session:
- ai_brain version: 1.0.4 → 1.0.5
- New dependency detected: chromadb (vector database)
- Installer may need updates"

---

## 📋 Quick Reference - Packaging Checklist

**Before compiling installer, verify:**

- [ ] ai_brain module scanned (up to date)
- [ ] ai_sam module scanned (up to date)
- [ ] Branch modules scanned (if bundling)
- [ ] Python dependencies merged from all requirements.txt
- [ ] Installation sequence respects dependency order
- [ ] All security/ir.model.access.csv files present
- [ ] All static assets (JS/CSS) present
- [ ] odoo.conf template includes all addon paths
- [ ] Service registration script references correct paths

---

## 🎯 Key Takeaways for Installer

1. **Order matters:** ai_brain → ai_sam → branches (enforced by installer)
2. **Security mandatory:** ir.model.access.csv for every module
3. **Static assets critical:** UI won't work without JS/CSS properly bundled
4. **Auto-update this doc:** Every Phase 1 scan repos for changes
5. **Report changes:** Tell user if SAM AI structure changed

---

**End of SAM AI Packaging Knowledge**

**Agent: Remember to update this file every Phase 1!**
