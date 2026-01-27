# File Classification Guide

**Last Updated:** 2025-11-07
**Purpose:** Decision tree for classifying scattered files into destinations

---

## 🎯 The Four Categories

Every file gets classified into ONE of these:

1. **MODULE-SPECIFIC** → `${DOCS_ROOT}\{module_name}_docs/`
2. **GENERAL SAM AI** → `${DOCS_ROOT}/` (root level)
3. **FURTHER REVIEW** → `${DOCS_ROOT}\aa_further_clean_up_review_required/`
4. **KEEP IN PLACE** → Stay where it is (don't move)

---

## 🔍 Classification Decision Tree

### **STEP 1: Quick Exclusion Check**

**Is it a system/protected folder?**
- `.claude/` → KEEP IN PLACE
- `.git/` → KEEP IN PLACE
- `__pycache__/` → KEEP IN PLACE
- `node_modules/` → KEEP IN PLACE
- `chromadb/`, `chroma_data/` → KEEP IN PLACE

**If YES → KEEP IN PLACE (skip further analysis)**

---

### **STEP 2: Filename Analysis**

**Does filename contain module name exactly?**

**Module Name Patterns:**
- `ai_sam_workflows` → MODULE-SPECIFIC (ai_sam_workflows_docs)
- `ai_sam_memory` → MODULE-SPECIFIC (ai_sam_memory_docs)
- `ai_sam_lead_generator` → MODULE-SPECIFIC (ai_sam_lead_generator_docs)
- `ai_sam_intelligence` → MODULE-SPECIFIC (ai_sam_intelligence_docs)
- `ai_sam_creatives` → MODULE-SPECIFIC (ai_sam_creatives_docs)
- `ai_sam_socializer` → MODULE-SPECIFIC (ai_sam_socializer_docs)
- `ai_sam_members` → MODULE-SPECIFIC (ai_sam_members_docs)
- `ai_sam_messenger` → MODULE-SPECIFIC (ai_sam_messenger_docs)
- `ai_sam_ui` → MODULE-SPECIFIC (ai_sam_ui_docs)
- `ai_sam_qrcodes` → MODULE-SPECIFIC (ai_sam_qrcodes_docs)
- `ai_youtube_transcribe` → MODULE-SPECIFIC (ai_youtube_transcribe_docs)
- `ai_sam_claude_mcp` → MODULE-SPECIFIC (ai_sam_claude_mcp_docs)
- `github_app` → MODULE-SPECIFIC (github_app_docs)

**General SAM AI Patterns (NOT module-specific):**
- `ai_sam` (without suffix) → Could be core framework OR general
- `sam_ai` → General SAM AI (GENERAL SAM AI)
- `canvas_core` → General (affects all modules)
- `odoo_18` → General (framework-wide)

**Examples:**
```
✅ ai_sam_workflows_architecture.md → MODULE-SPECIFIC (ai_sam_workflows_docs)
✅ lead_generator_notes.txt → MODULE-SPECIFIC (ai_sam_lead_generator_docs)
✅ memory_system_design.md → MODULE-SPECIFIC (ai_sam_memory_docs)
✅ canvas_core_rules.md → GENERAL SAM AI
✅ sam_ai_ecosystem.txt → GENERAL SAM AI
❓ random_notes.md → Need content analysis
```

**If module name in filename → MODULE-SPECIFIC (that module)**
**If general SAM AI keywords → GENERAL SAM AI**
**If unclear → Continue to STEP 3**

---

### **STEP 3: Content Analysis**

**Read first 50-100 lines of file. Look for:**

#### **A. Module-Specific Indicators**

**Direct Module References:**
- Mentions specific module by name (e.g., "ai_sam_workflows module")
- References module's models (e.g., "workflow.template model")
- Discusses module-specific features (e.g., "N8N node library")
- Code imports from module (e.g., `from ai_sam_workflows import`)

**Path References:**
- `ai_sam/ai_sam_workflows/` → MODULE-SPECIFIC (ai_sam_workflows_docs)
- `07-samai-sites-and-socials/ai_sam_lead_generator/` → MODULE-SPECIFIC (ai_sam_lead_generator_docs)

**If 3+ module-specific indicators → MODULE-SPECIFIC (that module)**

---

#### **B. General SAM AI Indicators**

**Ecosystem-Level Topics:**
- Canvas core architecture (affects all modules)
- SAM AI personality/behavior (framework-wide)
- Odoo 18 integration strategy (all modules)
- Multi-module workflows (not one specific module)
- SAM AI business strategy/vision

**Path References:**
- `C:\Working With AI\ai_sam\` (general workspace)
- References multiple modules (memory + workflows + intelligence)

**Examples:**
```
✅ "The canvas skeleton pattern affects all platform modules..." → GENERAL SAM AI
✅ "SAM AI ecosystem overview: ai_brain, ai_sam, plus 12 branches..." → GENERAL SAM AI
✅ "Odoo 18 best practices for all SAM AI modules..." → GENERAL SAM AI
```

**If ecosystem-level content → GENERAL SAM AI**

---

#### **C. Non-SAM-AI Content**

**Personal/Generic:**
- Personal todos unrelated to SAM AI
- Generic development notes (not SAM-specific)
- Windows configuration files
- Temporary files (`.tmp`, `.log`)

**If personal/generic → KEEP IN PLACE**

---

#### **D. Unclear/Ambiguous**

**Red Flags:**
- Vague filename (`notes.txt`, `draft.md`, `ideas.txt`)
- No clear module references in content
- Mixed content (multiple topics)
- Old/outdated content (unclear if still relevant)
- Encrypted/binary files (can't read content)

**If unclear → FURTHER REVIEW**

---

### **STEP 4: File Type Considerations**

**Documentation Files (High Confidence):**
- `.md` (Markdown) → Likely moveable (check content)
- `.txt` (Text) → Likely moveable (check content)
- `.rst`, `.adoc` → Documentation (check content)

**Code Files (Medium Confidence):**
- `.py` (Python) → Check imports/content
- `.js` (JavaScript) → Check references
- `.xml` (Odoo views) → Likely SAM AI (check content)

**Config Files (Low Confidence):**
- `.json` → Check content (could be SAM AI or system)
- `.yaml`, `.yml` → Check content
- `.ini`, `.conf` → Usually system (KEEP IN PLACE unless SAM AI-specific)

**Data/Binary Files:**
- `.db`, `.sqlite` → Database files (KEEP IN PLACE)
- `.pdf`, `.docx` → Check filename for module references
- `.png`, `.jpg` → Images (check filename)

**Temporary/Build Files:**
- `.log`, `.tmp`, `.cache` → KEEP IN PLACE
- `__pycache__/`, `.pyc` → KEEP IN PLACE

---

## 📋 Classification Examples (Real-World)

### **MODULE-SPECIFIC Examples:**

```
✅ ai_sam_workflows_n8n_integration.md
   → Filename: ai_sam_workflows
   → MODULE-SPECIFIC: ai_sam_workflows_docs/

✅ lead_gen_scraper_api_notes.txt
   → Content: "ai_sam_lead_generator module uses ScraperAPI..."
   → MODULE-SPECIFIC: ai_sam_lead_generator_docs/

✅ memory_graph_db_setup.py
   → Content: "from ai_sam_memory.models import..."
   → MODULE-SPECIFIC: ai_sam_memory_docs/

✅ socializer_blog_post_models.xml
   → Filename: socializer
   → MODULE-SPECIFIC: ai_sam_socializer_docs/

✅ qrcode_generator_design.md
   → Filename: qrcode
   → MODULE-SPECIFIC: ai_sam_qrcodes_docs/
```

---

### **GENERAL SAM AI Examples:**

```
✅ canvas_core_architecture.md
   → Content: "Canvas core affects all platform modules..."
   → GENERAL SAM AI: ${DOCS_ROOT}/

✅ sam_ai_ecosystem_overview.txt
   → Content: "SAM AI consists of ai_brain foundation + 14 modules..."
   → GENERAL SAM AI: ${DOCS_ROOT}/

✅ odoo_18_migration_strategy.md
   → Content: "All SAM AI modules need Odoo 18 compliance..."
   → GENERAL SAM AI: ${DOCS_ROOT}/

✅ three_layer_architecture.md
   → Content: "ai_brain → ai_sam → branches pattern..."
   → GENERAL SAM AI: ${DOCS_ROOT}/
```

---

### **FURTHER REVIEW Examples:**

```
❓ notes_2024.txt
   → Filename: vague
   → Content: Mixed topics, unclear purpose
   → FURTHER REVIEW: aa_further_clean_up_review_required/

❓ random_ideas.md
   → Filename: generic
   → Content: No clear module references
   → FURTHER REVIEW: aa_further_clean_up_review_required/

❓ old_draft.py
   → Filename: unclear
   → Content: Incomplete code, unknown context
   → FURTHER REVIEW: aa_further_clean_up_review_required/

❓ meeting_notes_oct.txt
   → Filename: vague
   → Content: Business discussions, no technical specifics
   → FURTHER REVIEW: aa_further_clean_up_review_required/
```

---

### **KEEP IN PLACE Examples:**

```
🚫 .claude/config.json
   → System folder
   → KEEP IN PLACE

🚫 personal_todo.txt
   → Content: "Buy groceries, call dentist..."
   → Personal (not SAM AI)
   → KEEP IN PLACE

🚫 windows_settings.ini
   → System configuration
   → KEEP IN PLACE

🚫 chroma_data/
   → Database folder
   → KEEP IN PLACE

🚫 __pycache__/
   → Python cache
   → KEEP IN PLACE
```

---

## 🎯 Edge Cases & Handling

### **Case 1: File References Multiple Modules**

**Example:** `ai_sam_workflows_and_memory_integration.md`

**Decision:**
- If primary focus on ONE module → That module's docs
- If equal focus → GENERAL SAM AI (cross-module integration)
- Ask user if unclear

---

### **Case 2: Duplicate Filenames**

**Example:** File `notes.md` already exists in destination

**Action:**
- Append `_1`, `_2`, etc. (`notes_1.md`)
- Report conflict in summary
- User decides later (merge or keep separate)

---

### **Case 3: Very Old/Outdated Content**

**Example:** File dated 2023, references deprecated features

**Decision:**
- Still classify by content (module-specific vs. general)
- Flag as "potentially outdated" in report
- User decides whether to keep/archive later

---

### **Case 4: Partial Module Name Match**

**Example:** `sam_workflow_ideas.txt` (missing "ai_" and "_s")

**Decision:**
- Check content for confirmation
- If content confirms ai_sam_workflows → MODULE-SPECIFIC
- If unclear → FURTHER REVIEW

---

## ✅ Classification Confidence Levels

**HIGH CONFIDENCE (Move without asking):**
- Exact module name in filename
- 5+ module-specific indicators in content
- File type strongly suggests SAM AI (.xml views, .py models)

**MEDIUM CONFIDENCE (Show in plan, proceed if approved):**
- Partial module name match
- 2-4 module-specific indicators
- General SAM AI keywords present

**LOW CONFIDENCE (Flag for review):**
- Vague filename
- 0-1 indicators
- Mixed/unclear content
- → `aa_further_clean_up_review_required/`

---

## 🚀 Quick Reference Checklist

**For each file, ask:**

1. ☐ Is it a system/protected folder? → KEEP IN PLACE
2. ☐ Does filename contain exact module name? → MODULE-SPECIFIC
3. ☐ Does content reference specific module 3+ times? → MODULE-SPECIFIC
4. ☐ Does content discuss ecosystem/cross-module topics? → GENERAL SAM AI
5. ☐ Is it personal/generic content? → KEEP IN PLACE
6. ☐ Still unclear? → FURTHER REVIEW

**Follow this checklist in order. First match wins.**

---

**Remember:** When in doubt, choose FURTHER REVIEW. User can reclassify later.
