# Cleanup Workflow Protocol

**Last Updated:** 2025-11-07
**Purpose:** Step-by-step operational workflow for doc-sprint agent

---

## 🎯 The 6-Phase Cleanup Cycle

```
User Points → SCAN → CLASSIFY → PROPOSE → CONFIRM → EXECUTE → REPORT → Wait for Next
```

---

## 📋 PHASE 1: SCAN (Survey the Mess)

### **Objective:** Understand what files exist in the messy folder

### **Actions:**

1. **List all files recursively**
   ```bash
   find "user_provided_path" -type f
   ```

2. **Gather metadata:**
   - Filename
   - File type/extension
   - File size
   - File path (full and relative)

3. **Quick statistics:**
   - Total file count
   - File type breakdown (X .md files, Y .py files, Z .txt files)
   - Total size estimate

4. **Protected folder check:**
   - Skip: `.claude/`, `.git/`, `__pycache__/`, `node_modules/`, `chromadb/`
   - Report: "Skipped 3 system folders"

### **Output:**

```
📊 SCAN RESULTS
==================
Folder: C:\Users\total\messy_folder\
Total Files: 23 files
Size: ~15 MB

File Types:
  - 12 Markdown (.md)
  - 5 Python (.py)
  - 4 Text (.txt)
  - 2 XML (.xml)

Protected Folders Skipped: 1 (__pycache__)
```

### **User Interaction:**
- Present scan results
- Ask: "Should I proceed to classify these files? (yes/no)"
- If user says no → Stop, wait for new command
- If user says yes → Continue to Phase 2

---

## 📋 PHASE 2: CLASSIFY (Categorize Each File)

### **Objective:** Determine destination for each file

### **Actions:**

**For each file:**

1. **Check if protected/system file**
   - If yes → Category: KEEP IN PLACE
   - Skip further analysis

2. **Analyze filename**
   - Contains exact module name? → MODULE-SPECIFIC
   - Contains "SAM AI", "canvas", "odoo"? → Likely SAM AI

3. **Read file content** (first 50-100 lines)
   - Module-specific references? → MODULE-SPECIFIC
   - Ecosystem/cross-module? → GENERAL SAM AI
   - Personal/generic? → KEEP IN PLACE
   - Unclear? → FURTHER REVIEW

4. **Assign confidence level:**
   - HIGH (90%+ sure) → Proceed
   - MEDIUM (60-90%) → Include in plan, proceed if approved
   - LOW (<60%) → FURTHER REVIEW

5. **Determine destination path**
   - MODULE-SPECIFIC → `${DOCS_ROOT}\{module}_docs/`
   - GENERAL SAM AI → `${DOCS_ROOT}/`
   - FURTHER REVIEW → `${DOCS_ROOT}\aa_further_clean_up_review_required/`
   - KEEP IN PLACE → Original location

### **Output:**

**Classification Table:**

```
FILE CLASSIFICATION
===================

MODULE-SPECIFIC (12 files):
  ✅ ai_sam_workflows_notes.md → ai_sam_workflows_docs/
  ✅ memory_system_design.txt → ai_sam_memory_docs/
  ✅ lead_gen_api.py → ai_sam_lead_generator_docs/
  ... (9 more)

GENERAL SAM AI (5 files):
  ✅ canvas_core_architecture.md → ${DOCS_ROOT}/
  ✅ sam_ai_ecosystem.txt → ${DOCS_ROOT}/
  ... (3 more)

FURTHER REVIEW (3 files):
  ❓ random_notes.txt → aa_further_clean_up_review_required/
  ❓ old_draft.md → aa_further_clean_up_review_required/
  ❓ ideas_2024.txt → aa_further_clean_up_review_required/

KEEP IN PLACE (3 files):
  🚫 .claude\config.json (system file)
  🚫 personal_todo.txt (not SAM AI)
  🚫 __pycache__\cache.pyc (build artifact)
```

---

## 📋 PHASE 3: PROPOSE (Show Move Plan)

### **Objective:** Get user approval before moving anything

### **Actions:**

1. **Present complete move plan**
   - Show source → destination for each file
   - Group by destination type (module-specific, general, review, keep)
   - Highlight any concerns (conflicts, low confidence, large files)

2. **Check for destination conflicts**
   - List any files that already exist at destination
   - Propose conflict resolution (append `_1`, `_2`, etc.)

3. **Estimate impact**
   - X files will move
   - Y files will stay
   - Z folders will be created

### **Output:**

```
🎯 PROPOSED MOVE PLAN
=====================

MOVES TO EXECUTE:

Module-Specific Docs (12 files):
  C:\Users\total\messy_folder\ai_sam_workflows_notes.md
  → ${DOCS_ROOT}\ai_sam_workflows_docs\ai_sam_workflows_notes.md

  C:\Users\total\messy_folder\memory_design.txt
  → ${DOCS_ROOT}\ai_sam_memory_docs\memory_design.txt

  ... (10 more moves)

General SAM AI Docs (5 files):
  C:\Users\total\messy_folder\canvas_core.md
  → ${DOCS_ROOT}\canvas_core.md

  ... (4 more moves)

Review Required (3 files):
  C:\Users\total\messy_folder\random_notes.txt
  → ${DOCS_ROOT}\aa_further_clean_up_review_required\random_notes.txt

  ... (2 more moves)

KEEP IN PLACE (3 files):
  - .claude\config.json
  - personal_todo.txt
  - __pycache__\

FOLDERS TO CREATE:
  - ai_sam_workflows_docs/ (will be created)
  - aa_further_clean_up_review_required/ (will be created)

CONFLICTS:
  ⚠️ notes.md already exists at destination
      → Will rename to notes_1.md

READY TO PROCEED?
```

---

## 📋 PHASE 4: CONFIRM (Get User Approval)

### **Objective:** User explicitly approves the move plan

### **Actions:**

1. **Ask for approval**
   ```
   Proceed with this move plan? Options:
   - "yes" = Execute all moves as shown
   - "no" = Cancel, don't move anything
   - "adjust" = Let me modify the plan
   ```

2. **Handle response:**
   - **YES** → Continue to Phase 5 (Execute)
   - **NO** → Stop, report "Cleanup cancelled, no files moved"
   - **ADJUST** → Listen to user's adjustments, re-propose

### **User Interaction Examples:**

**Example 1: Full Approval**
```
User: yes
Agent: ✅ Approved. Executing move plan...
```

**Example 2: Cancellation**
```
User: no, not ready yet
Agent: ✅ Cancelled. No files were moved. Ready when you are.
```

**Example 3: Adjustment**
```
User: adjust - don't move notes.md, keep it in place
Agent: ✅ Updated plan:
  - notes.md → KEEP IN PLACE (per user request)
  - Remaining 22 files → proceed as planned
Proceed with adjusted plan? (yes/no)
```

---

## 📋 PHASE 5: EXECUTE (Move Files)

### **Objective:** Safely move files to destinations

### **Actions:**

**For each file in approved move plan:**

1. **Skip if KEEP IN PLACE**

2. **Create destination folder if needed**
   ```python
   if not folder_exists(destination_folder):
       create_folder(destination_folder)
       log("Created folder: {destination_folder}")
   ```

3. **Handle filename conflicts**
   ```python
   if file_exists(destination_path):
       destination_path = append_suffix(destination_path)  # file_1.md
       log("Conflict resolved: renamed to {new_name}")
   ```

4. **Execute safe move**
   ```python
   # Copy-then-delete approach (safer than direct move)
   copy(source, destination)
   verify_copy_successful(source, destination)
   delete(source)
   log("Moved: {filename} → {destination}")
   ```

5. **Handle errors gracefully**
   ```python
   try:
       move_file(source, destination)
   except Exception as e:
       log("❌ ERROR moving {filename}: {error}")
       skip_and_continue()
   ```

### **Progress Updates:**

```
🔄 EXECUTING MOVES...
=====================

✅ [1/20] ai_sam_workflows_notes.md → ai_sam_workflows_docs/
✅ [2/20] memory_design.txt → ai_sam_memory_docs/
✅ [3/20] canvas_core.md → ${DOCS_ROOT}/
⚠️ [4/20] notes.md → notes_1.md (conflict resolved)
✅ [5/20] lead_gen_api.py → ai_sam_lead_generator_docs/
...
✅ [20/20] Complete!
```

---

## 📋 PHASE 6: REPORT (Summary & Next Steps)

### **Objective:** Clear communication of what happened

### **Actions:**

1. **Generate summary statistics**
   - Total files processed
   - Successful moves
   - Conflicts handled
   - Errors encountered
   - Folders created

2. **Group results by destination**
   - MODULE-SPECIFIC: List files per module
   - GENERAL SAM AI: List files
   - FURTHER REVIEW: List files
   - KEEP IN PLACE: List files
   - ERRORS: List failed operations

3. **Highlight user action items**
   - Files in `aa_further_clean_up_review_required/` need your review
   - Conflicts resolved (check merged/duplicate files)
   - Errors to investigate

### **Output:**

```
✅ CLEANUP COMPLETE
===================

📊 SUMMARY:
  Total Files Scanned: 23
  Successful Moves: 20 files
  Kept in Place: 3 files
  Errors: 0

📂 DESTINATION BREAKDOWN:

MODULE-SPECIFIC DOCS:
  ✅ ai_sam_workflows_docs/: 5 files
     - ai_sam_workflows_notes.md
     - workflow_engine_design.txt
     - n8n_integration.py
     - workflow_ui.xml
     - node_library.md

  ✅ ai_sam_memory_docs/: 3 files
     - memory_design.txt
     - graph_db_setup.md
     - vector_search.py

  ✅ ai_sam_lead_generator_docs/: 4 files
     - lead_gen_api.py
     - scraper_config.json
     - odoo_detection.md
     - scoring_algorithm.txt

GENERAL SAM AI DOCS:
  ✅ ${DOCS_ROOT}/ (root): 5 files
     - canvas_core.md
     - ecosystem_overview.txt
     - three_layer_architecture.md
     - odoo_18_strategy.md
     - sam_ai_vision.txt

FURTHER REVIEW REQUIRED:
  ❓ aa_further_clean_up_review_required/: 3 files
     - random_notes.txt (unclear purpose)
     - old_draft.md (outdated, needs review)
     - ideas_2024.txt (mixed topics)

KEPT IN PLACE:
  🚫 .claude\config.json (system)
  🚫 personal_todo.txt (personal)
  🚫 __pycache__\ (build artifacts)

⚠️ CONFLICTS HANDLED: 2 files
  - notes.md → notes_1.md
  - draft.txt → draft_1.md
  (Review later to merge/deduplicate)

📁 FOLDERS CREATED: 2
  - ai_sam_workflows_docs/
  - aa_further_clean_up_review_required/

🎯 NEXT STEPS:
  1. Review files in aa_further_clean_up_review_required/
  2. Check renamed files (notes_1.md) for merging
  3. Point me to next messy folder when ready!

Ready for next cleanup? Just say: /doc-sprint C:\path\to\next\mess
```

---

## 🔄 Repeat Cycle

**After Phase 6 complete:**
- Agent waits for next command
- User discovers another messy folder
- User invokes: `/doc-sprint C:\path\to\new\mess`
- Agent starts Phase 1 again

**This cycle repeats until all documentation chaos is organized.**

---

## 🚫 Error Handling

### **Common Errors & Handling:**

**Error 1: Source Path Doesn't Exist**
```
❌ ERROR: Path not found: C:\Users\total\nonexistent\
Action: Report error, ask user to verify path
```

**Error 2: Permission Denied**
```
❌ ERROR: Can't read file: protected_file.txt (permission denied)
Action: Skip file, report in summary, continue with others
```

**Error 3: Destination Disk Full**
```
❌ ERROR: Can't move file: disk full
Action: Stop execution, report error, rollback if needed
```

**Error 4: File Locked/In Use**
```
❌ ERROR: Can't move file: file is open in another program
Action: Skip file, report error, continue with others
```

**Error 5: Invalid Destination Path**
```
❌ ERROR: Can't create folder: invalid path characters
Action: Flag file for FURTHER REVIEW instead
```

---

## ✅ Success Criteria (Per Cleanup)

**Cleanup successful when:**
- ✅ All files classified
- ✅ User approved move plan
- ✅ Files moved to correct destinations
- ✅ No data loss (files moved, not deleted)
- ✅ Conflicts handled gracefully
- ✅ Clear report provided
- ✅ User knows what to do next

**Cleanup NOT successful when:**
- ❌ Files deleted instead of moved
- ❌ Files moved without confirmation
- ❌ Wrong destination (misclassified)
- ❌ Errors not reported
- ❌ User confused about what happened

---

## 🎯 Agent Mindset During Workflow

**Phase 1 (SCAN):** "Let me understand the mess"
**Phase 2 (CLASSIFY):** "Where does each piece belong?"
**Phase 3 (PROPOSE):** "Here's my plan, what do you think?"
**Phase 4 (CONFIRM):** "I won't move anything until you approve"
**Phase 5 (EXECUTE):** "Executing carefully, safety first"
**Phase 6 (REPORT):** "Here's exactly what I did"

**Always remember:**
- User is decision-maker
- Agent is executor
- Safety over speed
- Clear communication always

---

**Next cleanup ready? Waiting for: `/doc-sprint {path}`**
