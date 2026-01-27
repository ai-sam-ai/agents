# Misalignment Detection & Auto-Correction

## What Are Misalignments?

**Misalignments** = Things that waste Anthony's time by causing agent naivety or errors

### 3 Types of Misalignments

1. **Wrong Module References** - Agents cite moved/future modules
2. **Redundant Files** - Files in wrong locations (e.g., index.html misplaced)
3. **Future State Leaks** - Folders exist but shouldn't be touched yet

---

## Type 1: Wrong Module References

### Detection Pattern

Scan agent knowledge files (`*.md`) for excluded module names:

```python
excluded = ['th_ai_automator', 'ai_sam_desktop', 'ai_sam_mobile']

for agent in agents:
    for md_file in agent['knowledge_files']:
        content = read_file(md_file)

        for excluded_module in excluded:
            if excluded_module in content:
                # MISALIGNMENT FOUND
                flag_for_removal(agent, md_file, excluded_module)
```

### Examples

**❌ Wrong Reference Detected:**
```
Agent: developer
File: odoo_patterns.md
Line 42: "For automation, see th_ai_automator module"
Issue: References MOVED module (obsolete)
Fix: Remove all references to th_ai_automator
```

**✅ Auto-Correction:**
- Remove lines mentioning `th_ai_automator`
- Update agent knowledge file
- Log fix applied

---

## Type 2: Redundant Files

### Detection Pattern

Check for files in wrong locations:

```python
# Rule: index.html should be in static/src/
for root, dirs, files in os.walk(base_path):
    for file in files:
        if file == 'index.html':
            if 'static/src/' not in root:
                # MISALIGNMENT: Wrong location
                flag_file(file, root, expected='static/src/')
```

### Examples

**❌ Misaligned File:**
```
File: ai_sam_odoo/index.html
Issue: Located in module root (should be static/src/)
Suggestion: Move to ai_sam_odoo/static/src/index.html
Decision Needed: Anthony (move? delete? keep?)
```

**⚠️ Escalation:**
- File moves require Anthony's approval
- Report findings, don't auto-fix
- Provide clear suggestion

---

## Type 3: Future State Leaks

### Detection Pattern

Folders that exist but aren't active:

```python
future_folders = ['ai_sam_desktop', 'ai_sam_mobile']

for folder in future_folders:
    if os.path.exists(os.path.join(base_path, folder)):
        # EXISTS but NOT ACTIVE
        document_as_excluded(folder, reason='Future, post-MVP')
```

### Examples

**⚠️ Future Leak Detected:**
```
Path: ai_sam_desktop/
Status: EXISTS but NOT ACTIVE
Reason: Desktop app (future implementation)
Agent Instruction: IGNORE this path until Anthony activates
```

**✅ Auto-Documentation:**
- Add to `excluded_paths.md`
- Update `current_state.md` with exclusion
- Notify boardroom agents

---

## Auto-Correction Logic

### Decision Tree

```
Misalignment detected:
  ↓
Type 1: Wrong module reference?
  ├─ YES → Auto-remove from agent knowledge ✅
  └─ NO → Type 2: Redundant file?
      ├─ YES → Report to Anthony (needs approval) ⚠️
      └─ NO → Type 3: Future leak?
          └─ YES → Document as excluded ✅
```

### Auto-Fix Rules

**Safe to auto-fix (no approval needed):**
- Remove wrong module references from agent knowledge
- Document future paths as excluded
- Update `current_state.md` with exclusions

**Requires Anthony's approval:**
- Move files to different locations
- Delete files entirely
- Structural changes to modules

---

## Detection Commands

### Scan Agent Knowledge for Wrong References

```bash
# Find all references to excluded modules in agent knowledge
grep -r "th_ai_automator" ~/.claude/agents/*/\*.md
grep -r "ai_sam_desktop" ~/.claude/agents/*/\*.md
grep -r "ai_sam_mobile" ~/.claude/agents/*/\*.md
```

### Find Misaligned Files

```bash
# Find index.html files NOT in static/src/
find ai_sam_odoo -name "index.html" ! -path "*/static/src/*"
```

### Check Future State Leaks

```bash
# Check if future folders exist
ls -d ai_sam_desktop ai_sam_mobile 2>/dev/null
```

---

## Reporting to Anthony

### Format

```markdown
## Misalignments Detected

### AUTO-FIXED ✅
- Removed "th_ai_automator" from developer/odoo_patterns.md
- Documented ai_sam_desktop as EXCLUDED (future)

### REQUIRES YOUR DECISION ⚠️
- ai_sam_odoo/index.html (misaligned location)
  Suggestion: Move to static/src/ or delete
  Your call: [Keep/Move/Delete]?
```

### Escalation Criteria

**Escalate to Anthony when:**
- File moves/deletions needed
- Structural changes required
- Ambiguous cases (unclear if future/redundant)
- Breaking changes potential

**Do NOT escalate when:**
- Simple reference removal (auto-fix)
- Documentation updates (auto-fix)
- Exclusion documentation (auto-fix)

---

## Prevention Strategies

### 1. Boardroom Context Loading

Every agent reads `current_state.md` on startup:
- Knows excluded paths
- Won't reference wrong modules
- Prevention > Correction

### 2. Validation Before Reference

Agent decision tree:
```
Before referencing module X:
  1. Check: Is X in current_state.md active list?
  2. If NO → Check: Is X in excluded list?
  3. If YES (excluded) → DO NOT REFERENCE
```

### 3. Continuous Scanning

`/docs` runs daily (or on-demand):
- Detects new misalignments
- Auto-corrects safe issues
- Reports urgent items to Anthony

---

## Success Criteria

**Misalignment detection succeeds when:**
- ✅ Agents stop referencing moved/future modules
- ✅ Anthony isn't asked about non-existent paths
- ✅ Boardroom arrives with current state knowledge
- ✅ Auto-fixes > Manual fixes (>80% auto-corrected)

**Failure indicators:**
- ❌ Agents still reference `th_ai_automator`
- ❌ Anthony asked "does X exist?" repeatedly
- ❌ Naivety persists despite `/docs` running

---

## Integration with QA Tool

**Synergy with `ai_sam_development_qa.py`:**

QA tool detects:
- Code issues (syntax, patterns)
- Manifest problems (dependencies)
- Security violations

`/docs` detects:
- Wrong module references in agent knowledge
- Structural misalignments (file locations)
- Future state confusion

**Together:** Complete ecosystem health monitoring
