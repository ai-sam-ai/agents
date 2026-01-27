# Destination Routing Rules

**Last Updated:** 2025-11-07
**Purpose:** Path mapping and folder structure for doc-sprint cleanup operations

---

## 🗺️ The Four Destination Types

### **1. MODULE-SPECIFIC DOCS**
```
${DOCS_ROOT}\{module_name}_docs\
```

### **2. GENERAL SAM AI DOCS**
```
${DOCS_ROOT}\
```

### **3. FURTHER REVIEW REQUIRED**
```
${DOCS_ROOT}\aa_further_clean_up_review_required\
```

### **4. KEEP IN PLACE**
```
{original_location}
```

---

## 📂 Module-Specific Folder Mapping

### **Core Modules (05-samai-core):**

```
ai_sam → ai_sam_docs/
ai_sam_intelligence → ai_sam_intelligence_docs/
ai_sam_memory → ai_sam_memory_docs/
ai_sam_messenger → ai_sam_messenger_docs/
ai_sam_ui → ai_sam_ui_docs/
github_app → github_app_docs/
```

### **Workflow Automator (06-samai-workflow-automator):**

```
ai_sam_qrcodes → ai_sam_qrcodes_docs/
ai_sam_workflows → ai_sam_workflows_docs/
```

### **Sites & Socials (07-samai-sites-and-socials):**

```
ai_sam_creatives → ai_sam_creatives_docs/
ai_sam_lead_generator → ai_sam_lead_generator_docs/
ai_sam_members → ai_sam_members_docs/
ai_sam_socializer → ai_sam_socializer_docs/
ai_youtube_transcribe → ai_youtube_transcribe_docs/
```

### **Claude Integration (08-samai-claude-cloud-intergration):**

```
ai_sam_claude_mcp → ai_sam_claude_mcp_docs/
```

---

## 🎯 Routing Decision Logic

### **MODULE-SPECIFIC Routing:**

**If file classified as MODULE-SPECIFIC:**

1. Identify module name from classification
2. Map to folder: `{module_name}_docs/`
3. Full path: `${DOCS_ROOT}\{module_name}_docs\`
4. Create folder if doesn't exist
5. Move file to that folder

**Example:**
```
File: ai_sam_workflows_notes.md
Module: ai_sam_workflows
Destination: ${DOCS_ROOT}\ai_sam_workflows_docs\ai_sam_workflows_notes.md
```

---

### **GENERAL SAM AI Routing:**

**If file classified as GENERAL SAM AI:**

1. Destination: Root of `${DOCS_ROOT}/`
2. Full path: `${DOCS_ROOT}\{filename}`
3. Move file to root level (not in any module subfolder)

**Example:**
```
File: canvas_core_architecture.md
Classification: GENERAL SAM AI (affects all modules)
Destination: ${DOCS_ROOT}\canvas_core_architecture.md
```

---

### **FURTHER REVIEW Routing:**

**If file classified as FURTHER REVIEW:**

1. Destination: `aa_further_clean_up_review_required/`
2. Full path: `${DOCS_ROOT}\aa_further_clean_up_review_required\{filename}`
3. Create folder if doesn't exist
4. Move file to review folder

**Example:**
```
File: random_notes.txt
Classification: FURTHER REVIEW (unclear purpose)
Destination: ${DOCS_ROOT}\aa_further_clean_up_review_required\random_notes.txt
```

---

### **KEEP IN PLACE:**

**If file classified as KEEP IN PLACE:**

1. Destination: Original location (no move)
2. Report in summary: "Kept in place (not SAM AI related)"

**Example:**
```
File: C:\Users\total\personal_todo.txt
Classification: KEEP IN PLACE (personal content)
Action: No move (stays at C:\Users\total\personal_todo.txt)
```

---

## 🛠️ Folder Creation Rules

### **Create Folders As Needed:**

**Before moving file, check if destination folder exists:**

```python
# Pseudo-code
if destination_folder_does_not_exist:
    create_folder(destination_folder)
    report("Created folder: {destination_folder}")
```

**Folders to potentially create:**
- `${DOCS_ROOT}\{module_name}_docs/` (14 possible modules)
- `${DOCS_ROOT}\aa_further_clean_up_review_required/` (review folder)

**Never create:**
- System folders (`.claude`, `.git`, etc.)
- Random nested structures
- Folders outside `${DOCS_ROOT}/`

---

## 📝 Filename Conflict Handling

### **If destination file already exists:**

**Strategy: Append suffix, don't overwrite**

```
Original: notes.md
Destination already has: notes.md
New filename: notes_1.md

If notes_1.md also exists:
New filename: notes_2.md

Continue incrementing until unique filename found.
```

**Report conflict:**
```
⚠️ CONFLICT: notes.md already exists at destination
   Renamed to: notes_1.md
   Review later to merge/deduplicate
```

---

## 🚫 Protected Paths (Never Move These)

### **System Folders:**
```
.claude/
.git/
__pycache__/
node_modules/
.vscode/
.idea/
```

### **Database Folders:**
```
chromadb/
chroma_data/
postgres_data/
```

### **Build/Cache Folders:**
```
dist/
build/
*.egg-info/
.pytest_cache/
```

### **Protected Files:**
```
.gitignore
.env
.env.local
requirements.txt (if in project root)
package.json (if in project root)
```

**If user points to folder containing these → Skip them, process other files**

---

## 📊 Path Validation Rules

### **Before Moving, Validate:**

**Source Path:**
- ✅ Exists
- ✅ Readable
- ✅ Not a protected folder
- ✅ File size reasonable (<100MB per file)

**Destination Path:**
- ✅ Within `${DOCS_ROOT}\`
- ✅ Not overwriting without conflict handling
- ✅ Parent folder exists or can be created

**If validation fails:**
- Skip file
- Report error in summary
- Continue processing other files

---

## 🎯 Move Operation Best Practices

### **Safe Move Process:**

**Step 1: Validate source and destination**
**Step 2: Check for filename conflicts**
**Step 3: Create destination folder if needed**
**Step 4: Copy file to destination (not move yet)**
**Step 5: Verify copy successful**
**Step 6: Delete original (completing the move)**
**Step 7: Log operation**

**Why copy-then-delete instead of direct move?**
- Safer (can recover if copy fails)
- Validates operation succeeded
- Better error handling

---

## 📋 Routing Examples (Complete Paths)

### **Example 1: Module-Specific File**

```
SOURCE: C:\Users\total\messy_folder\ai_sam_workflows_architecture.md

CLASSIFICATION: MODULE-SPECIFIC (ai_sam_workflows)

DESTINATION: ${DOCS_ROOT}\ai_sam_workflows_docs\ai_sam_workflows_architecture.md

ACTION:
1. Check if ai_sam_workflows_docs/ exists (create if not)
2. Check if ai_sam_workflows_architecture.md already exists (handle conflict if needed)
3. Move file
4. Report: "✅ MOVED: ai_sam_workflows_architecture.md → ai_sam_workflows_docs/"
```

---

### **Example 2: General SAM AI File**

```
SOURCE: C:\Users\total\claude_files\canvas_core_design.md

CLASSIFICATION: GENERAL SAM AI (ecosystem-level)

DESTINATION: ${DOCS_ROOT}\canvas_core_design.md

ACTION:
1. ${DOCS_ROOT}/ already exists (root level)
2. Check for conflicts
3. Move file to root
4. Report: "✅ MOVED: canvas_core_design.md → ${DOCS_ROOT}/ (general)"
```

---

### **Example 3: Further Review File**

```
SOURCE: C:\Users\total\temp\random_ideas.txt

CLASSIFICATION: FURTHER REVIEW (unclear purpose)

DESTINATION: ${DOCS_ROOT}\aa_further_clean_up_review_required\random_ideas.txt

ACTION:
1. Check if aa_further_clean_up_review_required/ exists (create if not)
2. Check for conflicts
3. Move file
4. Report: "❓ REVIEW: random_ideas.txt → aa_further_clean_up_review_required/"
```

---

### **Example 4: Keep in Place**

```
SOURCE: C:\Users\total\.claude\config.json

CLASSIFICATION: KEEP IN PLACE (system file)

DESTINATION: C:\Users\total\.claude\config.json (no move)

ACTION:
1. Skip this file (no move operation)
2. Report: "🚫 KEPT: .claude\config.json (system file, not moved)"
```

---

## 🔄 Batch Processing Logic

**When user points to folder with multiple files:**

```
For each file in folder:
    1. Skip if protected/system file
    2. Classify file
    3. Determine destination
    4. Add to move plan

Show complete move plan to user
Wait for confirmation

If user approves:
    For each file in move plan:
        Execute move (with conflict handling)
        Log result

Report summary
```

---

## ✅ Success Validation

**After move operation, verify:**
- ✅ File exists at destination
- ✅ File size matches original
- ✅ Original file removed (if move completed)
- ✅ No errors during operation

**If any validation fails:**
- ❌ Report error
- ❌ Attempt rollback if possible
- ❌ Flag for manual review

---

## 📊 Summary Report Format

**After cleanup operation:**

```
📊 CLEANUP SUMMARY
==================

Messy Folder: C:\Users\total\some_folder\
Total Files Scanned: 23

MOVED TO MODULE DOCS: 12 files
  ✅ ai_sam_workflows_docs/: 5 files
  ✅ ai_sam_memory_docs/: 3 files
  ✅ ai_sam_lead_generator_docs/: 4 files

MOVED TO GENERAL DOCS: 5 files
  ✅ ${DOCS_ROOT}/: 5 files (ecosystem-level)

FLAGGED FOR REVIEW: 3 files
  ❓ aa_further_clean_up_review_required/: 3 files

KEPT IN PLACE: 3 files
  🚫 .claude\config.json (system)
  🚫 personal_notes.txt (not SAM AI)
  🚫 __pycache__/ (build folder)

CONFLICTS HANDLED: 2 files
  ⚠️ notes.md → notes_1.md (conflict resolved)
  ⚠️ draft.txt → draft_1.txt (conflict resolved)

ERRORS: 0 files
```

---

**Key Principle:** Every file has ONE clear destination. If unclear, → `aa_further_clean_up_review_required/`
