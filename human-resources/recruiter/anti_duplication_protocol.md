# 🚨 ANTI-DUPLICATION PROTOCOL (MANDATORY FOR ALL IMPLEMENTER AGENTS)

**Version:** 1.0.0
**Applies to:** /developer, /sam_core_chat, /mod_sam, /mod_*, /odoo-architect, and ANY agent that writes code
**Status:** CRITICAL - NON-NEGOTIABLE

---

## ⚠️ THE PROBLEM WE'RE SOLVING

**User's pain point (caught multiple times):**
> "I just caught/prevented more duplication issues about to happen"

**Root cause:**
- Agents create NEW files without checking if compatible files ALREADY exist
- Result: Duplicate models, controllers, views, security rules across modules
- Impact: Code bloat, maintenance nightmare, architectural violations

**Example disasters prevented:**
- Agent wants to create `new_feature_controller.py` when `existing_controller.py` can be enhanced
- Agent creates `res.partner` fields in wrong module (should use ai_brain)
- Agent creates duplicate security rules when existing ones can be extended

---

## 🛑 MANDATORY STOP-VERIFY PROTOCOL

### Rule 1: SEARCH FIRST, CREATE NEVER (Until Verified)

**BEFORE creating ANY new file, you MUST:**

```
STEP 1: STOP - Do NOT create the file yet!

STEP 2: SEARCH for compatible existing files
- Use Glob to find similar files (controllers, models, views, security)
- Use Grep to search for similar functionality
- Check module structure (ai_brain vs. ai_sam vs. platform skins)

STEP 3: ANALYZE - Can existing file be enhanced?
- Found similar controller? → Enhance it (add method)
- Found similar model? → Add fields to it
- Found similar view? → Extend it (inheritance)
- Found similar security rule? → Reference it or extend

STEP 4: PRESENT PLAN TO USER
- "I found X existing files that might be compatible"
- "Option A: Enhance existing file [name] (recommended)"
- "Option B: Create new file (only if truly needed)"
- "Which approach do you prefer?"

STEP 5: WAIT FOR USER APPROVAL
- Do NOT proceed until user confirms
- If user says "enhance existing" → Do that
- If user says "create new" → Then and ONLY then create
```

---

## 🔍 SEARCH PATTERNS (Examples)

### Before Creating a Controller

**DON'T:**
```python
# Agent thinks: "I need a controller for X feature"
# Agent does: Create new_feature_controller.py
```

**DO:**
```bash
# Agent MUST first search:
Glob: **/controllers/*.py
Grep: "class.*Controller" in ai_sam/controllers/
Grep: "route.*X_feature" (check if endpoint exists)

# Agent MUST present findings:
"I found 3 existing controllers:
1. sam_ai_chat_controller.py (handles chat endpoints)
2. canvas_controller.py (handles canvas operations)
3. workflow_controller.py (handles workflows)

ANALYSIS:
- Option A: Add new route to sam_ai_chat_controller.py (if chat-related)
- Option B: Create new controller (if truly independent feature)

Which approach?"
```

---

### Before Creating a Model

**DON'T:**
```python
# Agent thinks: "I need a model to store X data"
# Agent does: Create models/x_data.py in current module
```

**DO:**
```bash
# Agent MUST first check:
1. Does model belong in ai_brain? (ALL data models go there!)
2. Does similar model already exist?

Grep: "class X" in ai_brain/models/
Grep: "_name = 'x.data'" (check for existing model)
Read: ai_brain/models/00_MODULE_OVERVIEW.md (model categories)

# Agent MUST present findings:
"DATA MODEL LOCATION CHECK:
- This is a data model (stores X data)
- Per architecture: ALL data models go in ai_brain
- Searched ai_brain/models/ for similar models
- Found: existing_model.py has 80% overlap

RECOMMENDATION:
- Option A: Add fields to existing_model.py (extends existing)
- Option B: Create new model in ai_brain (if truly unique)

CRITICAL: If I create new model, it MUST go in ai_brain, NOT [current_module]

Which approach?"
```

---

### Before Creating a View

**DON'T:**
```python
# Agent thinks: "I need a form view for X"
# Agent does: Create views/x_form.xml
```

**DO:**
```bash
# Agent MUST first check:
Glob: **/views/*.xml
Grep: "model=\"x.model\"" (check if view exists for this model)
Grep: "x_form_view" (check for similar view IDs)

# Agent MUST present findings:
"VIEW SEARCH RESULTS:
- Found existing view: x_list_view.xml (list view for x.model)
- Found inherited view: x_form_inherit.xml (another module extends it)

RECOMMENDATION:
- Option A: Add form view to existing x_list_view.xml file (keep views together)
- Option B: Create view inheritance (if modifying existing base view)
- Option C: Create new file (if completely new model)

Which approach?"
```

---

### Before Creating Security Rules

**DON'T:**
```python
# Agent thinks: "I need access rules for X model"
# Agent does: Create security/ir.model.access.csv with new rules
```

**DO:**
```bash
# Agent MUST first check:
Read: security/ir.model.access.csv (check existing rules)
Grep: "model_x_model" (check if rules exist)
Check: Which module owns the model? (rules go in same module!)

# Agent MUST present findings:
"SECURITY RULE CHECK:
- Model: x.model (defined in ai_brain/models/)
- Existing security: Found 3 rules in ai_brain/security/ir.model.access.csv
- Current rules: admin (full), user (read/write), public (read)

RECOMMENDATION:
- Option A: Enhance existing rules (add group or permissions)
- Option B: Create new rule (if new group access needed)

CRITICAL: Security rules MUST be in same module as model (ai_brain)

Which approach?"
```

---

## 📋 FILE TYPE CHECKLIST

Before creating ANY of these, you MUST search and verify:

- [ ] **Python Files (.py)**
  - Models: Search ai_brain/models/ first
  - Controllers: Search ai_sam/controllers/ or module/controllers/
  - Services: Check if service exists in ai_sam/

- [ ] **XML Files (.xml)**
  - Views: Search module/views/ for similar views
  - Data files: Check module/data/ for similar records
  - Templates: Search module/static/src/xml/

- [ ] **JavaScript Files (.js)**
  - Widgets: Search ai_sam/static/src/core/ (universal widgets)
  - Module-specific: Search module/static/src/js/

- [ ] **Security Files**
  - ir.model.access.csv: Must be in same module as model
  - security.xml: Check if group/rule already exists

- [ ] **CSS Files (.css, .scss)**
  - Universal styles: ai_sam/static/src/css/
  - Module-specific: module/static/src/css/

---

## 🎯 DECISION TREE: Enhance vs. Create

```
Need to add functionality
      ↓
Search for existing files (Glob + Grep)
      ↓
Found similar file?
  ├─ YES → Can it be enhanced? (add method/field/view)
  │   ├─ YES → ENHANCE EXISTING (recommended)
  │   │   └─ Present plan to user → Get approval → Implement
  │   └─ NO → Why not? (explain to user)
  │       └─ Present both options → User decides
  └─ NO → Still STOP and verify!
      ↓
  Present to user:
  "I searched [locations] for similar files.
   Found: [none | X files but not compatible]
   Recommendation: Create new file [path]
   Reason: [why new file is needed]

   Should I proceed?"
      ↓
  Wait for user approval
      ↓
  If approved → Create
  If not → Discuss alternatives
```

---

## 🚨 RED FLAGS (When to DEFINITELY STOP)

**STOP immediately and ask user if you're about to:**

1. **Create a model outside ai_brain**
   ```
   ❌ BAD: ai_sam/models/new_model.py
   ❌ BAD: ai_sam_workflows/models/workflow_data.py
   ✅ GOOD: ai_brain/models/workflow_data.py
   ```
   **WHY:** ALL data models go in ai_brain (architecture rule)

2. **Create duplicate controller endpoints**
   ```
   ❌ BAD: Create new_controller.py with route /sam/chat/send
   ✅ GOOD: Found existing route, enhance sam_ai_chat_controller.py
   ```

3. **Create security rules in wrong module**
   ```
   ❌ BAD: ai_sam/security/ rules for ai_brain models
   ✅ GOOD: ai_brain/security/ rules for ai_brain models
   ```

4. **Create views for models you didn't check location of**
   ```
   ❌ BAD: Create view in module A for model in module B
   ✅ GOOD: Check model location first, create view in same module
   ```

5. **Create any file when similar file found in search**
   ```
   ❌ BAD: Grep found "x_controller.py", agent creates "new_x_controller.py"
   ✅ GOOD: Grep found "x_controller.py", agent enhances it
   ```

---

## 💬 COMMUNICATION TEMPLATE

**When presenting findings to user:**

```markdown
## 🔍 SEARCH RESULTS (Before Creating File)

**What I want to create:**
- File: [path/to/new_file.py]
- Purpose: [what it does]
- Type: [model/controller/view/security/etc]

**What I searched:**
- Location 1: [path] via [Glob/Grep]
- Location 2: [path] via [Glob/Grep]
- Location 3: [path] via [Glob/Grep]

**What I found:**
- ✅ Found: [existing_file.py] - [similarity description]
- ✅ Found: [another_file.py] - [similarity description]
- ❌ Not found: [what wasn't found]

**ANALYSIS:**

**Option A: Enhance Existing (RECOMMENDED)**
- File: [existing_file.py]
- Change: Add [method/field/view/etc]
- Why: [reason - avoid duplication, follows architecture]

**Option B: Create New File**
- File: [new_file.py]
- Why needed: [justification]
- Risk: [potential duplication or architectural concern]

**Which option do you prefer?**
```

---

## 🎓 EXAMPLES FROM REAL SESSIONS

### Example 1: User Caught Duplication (Chat Controller)

**What agent was about to do:**
```python
# Create: ai_sam/controllers/chat_message_controller.py
# Purpose: Handle chat message endpoints
```

**What agent SHOULD have done:**
```bash
# Search first:
Grep: "route.*chat.*send" in ai_sam/controllers/
# Found: sam_ai_chat_controller.py already has /sam/chat/send endpoint

# Present to user:
"I found sam_ai_chat_controller.py already handles chat endpoints.
 Option A: Add new method to existing controller (recommended)
 Option B: Create new controller (explain why new is needed)

 Which approach?"
```

**User's feedback:**
> "I just caught/prevented more duplication issues about to happen"

**Lesson:** ALWAYS search before creating!

---

### Example 2: Model in Wrong Location

**What agent was about to do:**
```python
# Create: ai_sam_workflows/models/workflow_step_data.py
# Purpose: Store workflow step data
```

**What agent SHOULD have done:**
```bash
# Architecture check:
# Q: Is this a data model (stores data)?
# A: YES
# Q: Where do ALL data models go?
# A: ai_brain (per architecture rule)

# Search in correct location:
Grep: "workflow.*step" in ai_brain/models/
# Check if model exists

# Present to user:
"ARCHITECTURE CHECK:
 - workflow_step_data is a data model (stores data)
 - Per ai_brain + ai_sam architecture: ALL data models → ai_brain
 - Searched ai_brain/models/ for existing workflow models
 - Found: [existing models or none]

 Recommendation: Create in ai_brain/models/ (if new) or enhance existing

 Proceed?"
```

**Lesson:** Check architecture rules BEFORE creating!

---

## 🔧 IMPLEMENTATION CHECKLIST

**For ALL implementer agents, add to protocol:**

### Phase 0.5: ANTI-DUPLICATION CHECK (Before Phase 1: PLAN)

```markdown
**MANDATORY: Before planning ANY code changes, execute this:**

1. **Identify what files you might create**
   - Models? Controllers? Views? Security? Other?

2. **Search for existing files (use tools)**
   - Glob: Find files by pattern
   - Grep: Search for similar functionality
   - Read: Check module structure docs

3. **Analyze findings**
   - Can existing file be enhanced?
   - Is new file truly needed?
   - Is file going in correct module? (ai_brain vs. ai_sam)

4. **Present options to user**
   - Option A: Enhance existing (default recommendation)
   - Option B: Create new (explain why needed)

5. **WAIT for user approval before proceeding**
   - Do NOT create files until user confirms approach
```

---

## 📊 SUCCESS METRICS

**You're following this protocol when:**

- ✅ You search BEFORE creating (every time)
- ✅ You present options to user (enhance vs. create)
- ✅ You wait for approval before creating files
- ✅ User NEVER has to catch duplication (you catch it first!)
- ✅ Code stays DRY (Don't Repeat Yourself)
- ✅ Architecture rules followed (models in ai_brain, etc.)

**You're NOT following this protocol when:**

- ❌ User says: "I just caught duplication issues"
- ❌ You create files without searching first
- ❌ You find existing file but create new one anyway (without asking)
- ❌ You put models in wrong module (not ai_brain)
- ❌ You create duplicate controllers/views/security

---

## 🎯 MANTRAS FOR IMPLEMENTER AGENTS

1. **"Search first, create never (until verified)"**
   - ALWAYS search for existing files before creating

2. **"When in doubt, ask user"**
   - Present options, let user decide

3. **"Enhance > Create"**
   - Default recommendation: enhance existing file

4. **"All data models live in ai_brain"**
   - Architecture rule, no exceptions

5. **"Stop and verify = Save user's time"**
   - Better to ask now than fix duplication later

---

## 🚀 ROLLOUT PLAN

**This protocol must be added to:**

1. ✅ /sam_core_chat (implementer agent)
2. ✅ /mod_sam (implementer agent)
3. ✅ /developer (primary code writer)
4. ⏳ /mod_* agents (all niche module agents)
5. ⏳ /odoo-architect (creates new features)
6. ⏳ Any future implementer agents

**Format:** Add to startup protocol as Phase 0.5 (after team onboarding, before planning)

---

## 💡 WHY THIS MATTERS

**From user's perspective:**
- Prevents duplication nightmares
- Maintains clean architecture
- Saves refactoring time
- Builds trust in agents ("they think before acting")

**From agent's perspective:**
- Clear decision framework (search → analyze → ask → create)
- Reduces user corrections ("I caught duplication again!")
- Follows WOW FACTOR standard (excellence, not "meh")

**From codebase perspective:**
- DRY (Don't Repeat Yourself)
- Architecture integrity (models in ai_brain)
- Maintainability (fewer files, less complexity)

---

## 🎓 REMEMBER

**BEFORE creating ANY file:**
1. 🔍 SEARCH (Glob + Grep)
2. 📊 ANALYZE (Enhance vs. Create)
3. 💬 PRESENT (Options to user)
4. ⏸️ WAIT (For user approval)
5. ✅ CREATE (Only after approval)

**Never skip this protocol. Ever. The user is counting on you to catch duplication BEFORE it happens!**

---

**Version 1.0.0 - Mandatory for all implementer agents**
