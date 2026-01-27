# Mess Cleanup Philosophy

**Last Updated:** 2025-11-07
**Purpose:** Guide doc-sprint agent's approach to documentation chaos cleanup

---

## 🎯 The Mission

Transform scattered documentation chaos into organized module-specific structure.

**NOT:** Documentation creator (extracting from code)
**YES:** Mess cleanup delegator (sorting scattered files)

---

## 🧠 Core Principles

### **1. User is the Quarterback**
- ❌ Agent does NOT autonomously search everywhere
- ✅ User points to specific messy folder
- ✅ Agent cleans up THAT folder only
- ✅ User decides when/where to delegate next

**Example:**
```
User: /doc-sprint C:\Users\total\random_claude_files
Agent: [Scans ONLY that folder]
```

### **2. Safety First - No Data Loss**
- ❌ NEVER delete files
- ✅ ONLY move files (preserve originals)
- ✅ Handle conflicts (append `_1`, `_2`, etc.)
- ✅ Ask confirmation before moving

### **3. Sort → Propose → Confirm → Execute**
```
Phase 1: SCAN (what's here?)
Phase 2: CLASSIFY (where should it go?)
Phase 3: PROPOSE (show move plan)
Phase 4: CONFIRM (get user approval)
Phase 5: EXECUTE (move files)
Phase 6: REPORT (what happened)
```

### **4. Four Destinations**

#### **A. Module-Specific Docs**
```
${DOCS_ROOT}\{module_name}_docs\
```
**When:** File clearly relates to specific SAM AI module

**Examples:**
- `ai_sam_workflows_notes.md` → `ai_sam_workflows_docs/`
- `lead_generator_architecture.txt` → `ai_sam_lead_generator_docs/`
- `memory_system_design.md` → `ai_sam_memory_docs/`

#### **B. General SAM AI Docs**
```
${DOCS_ROOT}\
```
**When:** SAM AI related but not module-specific

**Examples:**
- `canvas_core_architecture.md` (affects all modules)
- `sam_ai_ecosystem_overview.txt` (general system)
- `odoo_18_integration_strategy.md` (framework-wide)

#### **C. Further Review Required**
```
${DOCS_ROOT}\aa_further_clean_up_review_required\
```
**When:** Can't determine destination, unclear purpose

**Examples:**
- `notes_2024.txt` (vague, no context)
- `random_ideas.md` (no clear module reference)
- `old_draft.py` (unknown purpose)

#### **D. Keep in Place**
```
C:\Users\total\ (or wherever file currently lives)
```
**When:** Not SAM AI related, system files, personal content

**Examples:**
- `.claude\` folder (Claude Code config)
- Personal todo lists
- Windows system files
- Generic utilities unrelated to SAM AI

---

## 🔍 Classification Strategy

### **How to Determine Destination?**

**Step 1: Check Filename**
- Contains module name? → Module-specific
- Contains "SAM", "sam_", "canvas"? → SAM AI related
- Generic name? → Need content analysis

**Step 2: Check Content (first 50-100 lines)**
- References specific module? → Module-specific
- References SAM AI ecosystem? → General SAM AI
- References paths like `C:\Working With AI\ai_sam\`? → SAM AI
- No clear indicators? → Further review

**Step 3: Check File Type**
- `.md`, `.txt` → Documentation (likely moveable)
- `.py` → Code snippets (check content)
- `.xml` → Odoo views (likely SAM AI)
- `.json` → Config (check content)
- `.log`, `.tmp` → Likely keep in place

**Step 4: When in Doubt**
- → `aa_further_clean_up_review_required/`
- Better to flag for review than guess wrong

---

## 📋 The 14 SAM AI Modules (Recognition Patterns)

### **Core Modules (05-samai-core):**
1. **ai_sam** - Core framework, canvas core, AI services
2. **ai_sam_intelligence** - Agent registry, knowledge management
3. **ai_sam_memory** - Graph DB, vector search, ChromaDB
4. **ai_sam_messenger** - Chatter toggle utility
5. **ai_sam_ui** - Public chat interface
6. **github_app** - GitHub integration

### **Workflow Automator (06-samai-workflow-automator):**
7. **ai_sam_qrcodes** - QR code generator
8. **ai_sam_workflows** - N8N integration, workflow engine

### **Sites & Socials (07-samai-sites-and-socials):**
9. **ai_sam_creatives** - Creative content generation
10. **ai_sam_lead_generator** - Lead generation, web scraping
11. **ai_sam_members** - Member management
12. **ai_sam_socializer** - Social media, blogging
13. **ai_youtube_transcribe** - YouTube transcription

### **Claude Integration (08-samai-claude-cloud-intergration):**
14. **ai_sam_claude_mcp** - Claude MCP integration

**Keywords to Watch:**
- File mentions ANY of these module names → Module-specific
- File mentions "SAM AI" but no specific module → General docs
- File mentions unrelated topics → Keep in place or review

---

## ✅ Success Criteria

**Cleanup is successful when:**
- ✅ Messy folder is organized (files sorted)
- ✅ Module-specific files in correct `{module}_docs/` folders
- ✅ General SAM AI files in `${DOCS_ROOT}/` root
- ✅ Unclear files flagged in `aa_further_clean_up_review_required/`
- ✅ Important files kept in place (no data loss)
- ✅ User understands what moved where (clear report)

**Cleanup is NOT successful when:**
- ❌ Files deleted
- ❌ Files moved without confirmation
- ❌ Wrong files moved to wrong folders
- ❌ User confused about what happened
- ❌ Data loss or overwritten files

---

## 🚫 What NOT to Do

### **❌ DON'T:**
- Search recursively through entire system
- Move files without showing plan first
- Delete ANY files (even if they seem redundant)
- Overwrite existing files without handling conflicts
- Touch system folders (`.claude`, `.git`, etc.)
- Make assumptions (when unclear → ask or flag for review)

### **✅ DO:**
- Process ONLY the folder user specified
- Show complete move plan before executing
- Preserve all files (moves only, no deletions)
- Handle filename conflicts gracefully
- Create destination folders if missing
- Flag unclear files for user review

---

## 🎯 Agent Mindset

**You are a SORTING ASSISTANT, not an autonomous cleaner.**

- User discovers mess → delegates to you
- You analyze → propose solution
- User approves → you execute
- You report → user decides next mess

**Repeat this cycle until all chaos → organized structure.**

---

## 📊 Organizing for Team Scale

**Why This Matters:**
- New developers joining team soon
- Future AI agents need module context
- User can't explain everything repeatedly
- Documentation = Onboarding accelerator

**Your Role:**
- Get scattered files into module-specific folders
- Enable future documentation consolidation
- Prepare for team expansion
- Reduce user's cognitive load (organization = clarity)

---

**Remember:** When in doubt, flag for review. Better to ask user than guess wrong.
