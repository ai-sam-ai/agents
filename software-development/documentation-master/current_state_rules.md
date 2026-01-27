# Current State Rules - MVP Scope & Exclusions

## 🎯 Primary Mission

**Protect Anthony's time by maintaining TRUTH about current vs. future state**

---

## 📍 Current State (MVP - Pre-Launch)

### Single Entrypoint Rule

**TRUTH:** SAM AI ecosystem at `${SAMAI_ROOT}\` is THE ONLY scope for `/docs`

```
✅ CURRENT SCOPE (SAM AI Ecosystem):
${SAMAI_ROOT}\

✅ ACTIVE MODULES (inside above path):
- ai_brain (foundation - data layer)
- ai_sam (framework - SAM AI core)
- ai_sam_memory (branch - graph/vector memory)
- the_ai_automator (branch - N8N workflows)
- ai_sam_docs (tools - documentation)
- ai_poppy (branch - Poppy assistant)
- ai_odoo_blogger (branch - blogging)
- ai_toolbox (utilities)
- ... (6 more active modules)

❌ EXCLUDED MODULES:
- th_ai_automator (moved out - redundant)
- ai_sam_desktop (future - not MVP)
- ai_sam_mobile (future - not MVP)
```

---

## 🚫 Excluded Paths (DO NOT REFERENCE)

### Category 1: Moved/Redundant Modules

**Path:** `th_ai_automator`
**Status:** MOVED OUT (redundant)
**Reason:** Replaced by `the_ai_automator` inside ai_sam_odoo
**Agent Rule:** NEVER reference `th_ai_automator` - it's obsolete

**Path:** `uncertain_files`
**Status:** QUARANTINE
**Reason:** Deprecated/experimental files moved here
**Agent Rule:** IGNORE this folder - it's for cleanup only

---

### Category 2: Future State (Post-MVP)

**Path:** `ai_sam_desktop`
**Status:** EXISTS but NOT ACTIVE
**Reason:** Desktop app - post-MVP implementation
**Agent Rule:** IGNORE until Anthony activates (T+2 weeks post-launch)

**Path:** `ai_sam_mobile`
**Status:** EXISTS but NOT ACTIVE
**Reason:** Mobile app - future roadmap
**Agent Rule:** IGNORE until Anthony activates (T+4 weeks post-launch)

---

### Category 3: Build Artifacts (Always Exclude)

**Paths:**
- `__pycache__` (Python bytecode)
- `.git` (version control)
- `node_modules` (JS dependencies)
- `.pytest_cache` (test artifacts)

**Agent Rule:** Never scan or reference these folders

---

## 📋 Agent Reference Rules

### Rule 1: Module References (STRICT)

**✅ ALLOWED:**
```python
# Reference active modules only
- ai_brain
- ai_sam
- ai_sam_memory
- the_ai_automator (inside ai_sam_odoo)
- ai_sam_docs
```

**❌ FORBIDDEN:**
```python
# NEVER reference these
- th_ai_automator (moved/redundant)
- ai_sam_desktop (future)
- ai_sam_mobile (future)
- ai_base (deprecated - renamed to ai_brain)
- ai_trunk (deprecated - renamed to ai_sam)
```

---

### Rule 2: Documentation References

**✅ CORRECT:**
```markdown
For memory features, see [ai_sam_memory](${SAMAI_ROOT}\ai_sam_memory)
```

**❌ WRONG:**
```markdown
For automation, see [th_ai_automator](${SAMAI_ROOT}\the_ai_automator)  ← OBSOLETE PATH!
For desktop features, see [ai_sam_desktop](...)  ← FUTURE, NOT ACTIVE!
For Odoo dev work, see [custom-modules-v18](${USER_HOME}\Odoo Projects\custom-modules-v18)  ← NOT SAM ECOSYSTEM!
```

---

### Rule 3: Dependency Validation

**Before referencing ANY module, check:**

1. **Is it in `${SAMAI_ROOT}\`?**
   - YES → Probably active (verify manifest exists)
   - NO → STOP, it's excluded (wrong ecosystem)

2. **Is it in excluded list?**
   - YES → DO NOT REFERENCE
   - NO → Proceed to step 3

3. **Does `__manifest__.py` exist?**
   - YES → Active module, safe to reference
   - NO → Not a module, don't reference

---

## 🔄 Future State Transition (When Anthony Says)

### Activation Protocol

**When Anthony says:** "Activate ai_sam_desktop"

**What `/docs` does:**
1. Remove `ai_sam_desktop` from excluded list
2. Discover its modules (if any)
3. Learn its architecture
4. Update `current_state.md`
5. Notify boardroom: "ai_sam_desktop now ACTIVE"

**What agents do:**
- Start referencing ai_sam_desktop
- Include in analysis/recommendations
- Treat as part of current state

---

### Pre-Activation Rules (Current State)

**Until Anthony activates:**
- ai_sam_desktop = IGNORE
- ai_sam_mobile = IGNORE
- Any other future folder = IGNORE

**Why:** MVP focus. Anthony's time is most valuable. Future features distract from launch.

---

## 📊 Current vs. Future State Summary

| Path | Status | When Active | Agent Rule |
|------|--------|-------------|------------|
| `${SAMAI_ROOT}\` | ✅ ACTIVE | NOW (MVP) | /docs scans here |
| `${USER_HOME}\Odoo Projects\custom-modules-v18\` | ❌ OUT OF SCOPE | N/A | /docs NEVER scans here |
| `ai_sam_desktop` (inside SAM folder) | ⏸️ FUTURE | Post-MVP (T+2w) | Ignore for now |
| `ai_sam_mobile` (inside SAM folder) | ⏸️ FUTURE | Post-MVP (T+4w) | Ignore for now |
| `uncertain_files` | 🗑️ QUARANTINE | N/A | Never reference |

---

## 🎯 Agent Decision Tree

```
Agent needs to reference a module:
  ↓
Is it in ${SAMAI_ROOT}\?
  ├─ NO → STOP - Out of scope for /docs ❌
  │   (Example: custom-modules-v18 = not SAM ecosystem)
  └─ YES → Is it in excluded list?
      ├─ YES → DO NOT REFERENCE (moved/future)
      └─ NO → Does __manifest__.py exist?
          ├─ YES → SAFE TO REFERENCE ✅
          └─ NO → DO NOT REFERENCE (not a module)
```

---

## 🔥 Critical Rules (Never Break These)

1. **ONLY scan `${SAMAI_ROOT}\`** (SAM AI ecosystem)
2. **NEVER scan `${USER_HOME}\Odoo Projects\`** (separate dev environment)
3. **NEVER reference `th_ai_automator`** (moved/obsolete)
4. **IGNORE `ai_sam_desktop` and `ai_sam_mobile`** (future, not active)
5. **When uncertain, ASK `/docs` first** (not Anthony - protect his time)
6. **Use `__manifest__.py` as module validator** (if missing = not a module)

---

## 💡 Why These Rules Exist

**Problem:** Agents referenced moved/future modules → wasted Anthony's time with naive questions

**Solution:** Strict current state rules → agents only reference what's ACTUALLY active

**Result:** Anthony focuses on MVP completion, not explaining what exists vs. what doesn't

---

## 🚨 If You Violate These Rules

**What happens:**
- `/docs` detects wrong reference in next scan
- Flags as misalignment
- Auto-removes from agent knowledge (or reports to Anthony)
- Other agents load corrected state

**Prevention:** Before ANY module reference, validate against current_state.md

---

## ✅ Quick Validation Checklist

Before `/docs` scans any path:
- [ ] Is it `${SAMAI_ROOT}\`?
- [ ] Is it NOT `${USER_HOME}\Odoo Projects\`?

Before referencing any module:
- [ ] Is it inside `${SAMAI_ROOT}\`?
- [ ] Is it NOT in excluded list?
- [ ] Does `__manifest__.py` exist?
- [ ] Is it documented in `current_state.md`?

If all YES → SAFE TO REFERENCE ✅
If any NO → DO NOT REFERENCE ❌

---

**Remember:** Current state = MVP only. Future state = Anthony activates when ready.
