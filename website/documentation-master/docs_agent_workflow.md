# `/docs` Agent Workflow - 7-Phase Process

## Overview

The Documentation Master executes a systematic 7-phase workflow to maintain SAM AI ecosystem truth and protect Anthony's time.

---

## Phase 1: DISCOVER (Learn Current State)

### Goal
Understand what EXISTS right now (modules, schema, agents, architecture)

### Actions
1. **Discover Modules** (Odoo-aware scanning)
   ```python
   modules = env['documentation.intelligence'].discover_modules()
   # Scans: ${SAMAI_ROOT}\
   # Returns: All modules with __manifest__.py in SAM ecosystem
   ```

2. **Learn Architecture** (dependency graph)
   ```python
   architecture = env['documentation.intelligence'].learn_architecture(modules)
   # Returns: ai_brain → ai_sam → branches
   ```

3. **Discover Schema** (models in each module)
   ```python
   schema = {}
   for module in modules:
       schema[module] = discover_schema(module['path'])
   # Returns: 23 models across 6 modules
   ```

4. **Discover Agents** (Claude agent ecosystem)
   ```python
   agents = env['documentation.intelligence'].discover_agents()
   # Returns: 11 agents, 87K+ words knowledge
   ```

### Output
```json
{
  "timestamp": "2025-10-13T10:30:00",
  "modules": 14,
  "models": 23,
  "agents": 11,
  "agent_words": 87450
}
```

**Duration:** 30-60 seconds

---

## Phase 2: DETECT (Find What Changed)

### Goal
Compare current state to previous state, identify changes

### Actions
1. **Load Previous State**
   ```python
   previous = load_state('ai_sam_docs/docs/last_known_state.json')
   ```

2. **Compare States**
   ```python
   changes = detect_changes(current, previous)
   # Detects: version changes, schema changes, agent updates
   ```

3. **Categorize Changes**
   - Module version bumps
   - Schema additions/removals
   - Agent knowledge updates
   - Architecture modifications

### Output
```json
{
  "modules_changed": [
    {"module": "ai_sam_memory", "from": "18.0.1.2", "to": "18.0.1.3"}
  ],
  "schema_changed": [
    {"module": "ai_sam_memory", "added": ["ai.memory.config"]}
  ],
  "agents_changed": [
    {"agent": "cmo", "prev_words": 12450, "curr_words": 13200}
  ]
}
```

**Duration:** 10-20 seconds

---

## Phase 3: MISALIGN (Detect Problems)

### Goal
Find misalignments that cause agent naivety or waste Anthony's time

### Actions
1. **Scan Agent Knowledge for Wrong References**
   ```python
   excluded = ['th_ai_automator', 'ai_sam_desktop', 'ai_sam_mobile']

   for agent in agents:
       for md_file in agent['knowledge_files']:
           if any(excluded_path in content for excluded_path in excluded):
               # MISALIGNMENT: Wrong module reference
               flag_for_removal(agent, md_file, excluded_path)
   ```

2. **Check File Locations**
   ```python
   # Example: index.html should be in static/src/
   if file == 'index.html' and 'static/src/' not in path:
       # MISALIGNMENT: File in wrong location
       flag_file(file, path, expected='static/src/')
   ```

3. **Detect Future State Leaks**
   ```python
   if os.path.exists('ai_sam_desktop'):
       # EXISTS but NOT ACTIVE (future)
       document_as_excluded('ai_sam_desktop', reason='Post-MVP')
   ```

### Output
```json
{
  "wrong_references": [
    {
      "agent": "developer",
      "file": "odoo_patterns.md",
      "wrong_reference": "th_ai_automator",
      "fix": "Remove reference (moved/redundant)"
    }
  ],
  "redundant_files": [
    {
      "file": "ai_sam_odoo/index.html",
      "issue": "Misaligned location",
      "suggestion": "Move to static/src/"
    }
  ],
  "future_leaks": [
    {
      "path": "ai_sam_desktop",
      "status": "EXISTS but NOT ACTIVE",
      "instruction": "Agents IGNORE until Anthony activates"
    }
  ]
}
```

**Duration:** 20-40 seconds

---

## Phase 4: CORRECT (Auto-Fix Safe Issues)

### Goal
Fix what CAN be fixed without Anthony's approval

### Actions
1. **Auto-Remove Wrong Module References** (SAFE)
   ```python
   for wrong_ref in misalignments['wrong_references']:
       # Remove lines mentioning excluded modules
       update_agent_knowledge(
           agent=wrong_ref['agent'],
           file=wrong_ref['file'],
           remove_text=wrong_ref['wrong_reference']
       )
       log_fix(f"Removed {wrong_ref['wrong_reference']} from {wrong_ref['file']}")
   ```

2. **Document Future State Exclusions** (SAFE)
   ```python
   for future_leak in misalignments['future_leaks']:
       update_file('ai_sam_docs/docs/excluded_paths.md', {
           'path': future_leak['path'],
           'reason': 'Future (post-MVP)',
           'instruction': 'Agents MUST ignore'
       })
   ```

3. **Flag for Anthony's Decision** (ESCALATE)
   ```python
   requires_anthony = []
   for redundant in misalignments['redundant_files']:
       # File moves/deletions need approval
       requires_anthony.append({
           'file': redundant['file'],
           'suggestion': redundant['suggestion'],
           'decision_needed': 'Move? Delete? Keep?'
       })
   ```

### Output
```markdown
AUTO-FIXES APPLIED ✅:
- Removed "th_ai_automator" from developer/odoo_patterns.md
- Documented ai_sam_desktop as EXCLUDED (future)
- Documented ai_sam_mobile as EXCLUDED (future)

REQUIRES ANTHONY'S DECISION ⚠️:
- ai_sam_odoo/index.html (misaligned)
  Suggestion: Move to static/src/ or delete
  Your call: [Keep/Move/Delete]?
```

**Duration:** 10-20 seconds

---

## Phase 5: UPDATE (Refresh Master Documentation)

### Goal
Update master documentation to reflect current state

### Actions
1. **Update current_state.md**
   ```python
   write_file('ai_sam_docs/docs/current_state.md', f"""
# SAM AI Current State

**Last Updated:** {datetime.now()}

## MVP Scope
- Entrypoint: ai_sam_odoo
- Active Modules: {len(active_modules)}
- Total Models: {total_models}
- Total Agents: {total_agents}

## Excluded Paths
{excluded_paths_list}

## Recent Changes
{changes_summary}

## Agent Rules
- ONLY reference modules in ai_sam_odoo/
- IGNORE: {', '.join(excluded)}
   """)
   ```

2. **Update module_architecture.md**
   ```python
   write_file('ai_sam_docs/docs/module_architecture.md', architecture_diagram)
   ```

3. **Update database_schema.md**
   ```python
   write_file('ai_sam_docs/docs/database_schema.md', schema_documentation)
   ```

4. **Update agent_registry.md**
   ```python
   write_file('ai_sam_docs/docs/agent_registry.md', agent_ecosystem_map)
   ```

### Output
```
Documentation updated:
✅ current_state.md (boardroom context)
✅ module_architecture.md (14 modules, dependency graph)
✅ database_schema.md (23 models)
✅ agent_registry.md (11 agents, 87K words)
```

**Duration:** 15-30 seconds

---

## Phase 6: REPORT (Ask for Push Approval)

### Goal
Report changes to Anthony and ask if push to GitHub is needed

### Actions
1. **Summarize Changes**
   ```python
   summary = f"""
   Documentation updated locally:
   - current_state.md (boardroom context)
   - module_architecture.md ({len(modules)} modules)
   - database_schema.md ({total_models} models)
   - agent_registry.md ({len(agents)} agents)

   Changes detected:
   - {len(changes['modules_changed'])} modules updated
   - {len(changes['schema_changed'])} schema changes
   - {len(changes['agents_changed'])} agent updates
   """
   ```

2. **Ask for Push Approval** (DO NOT AUTO-PUSH)
   ```python
   # CRITICAL: Never push automatically
   # Anthony decides when to push to GitHub

   print(summary)
   print("\n🚨 PUSH REQUIRED?")
   print("These docs are updated LOCALLY only.")
   print("To push to GitHub, run: /git-push")
   print("Or tell me: 'push docs to github'")
   ```

### Output
```
✅ Documentation updated LOCALLY

Files changed:
- ai_sam_docs/docs/current_state.md
- ai_sam_docs/docs/module_architecture.md
- ai_sam_docs/docs/database_schema.md
- ai_sam_docs/docs/agent_registry.md

🚨 PUSH TO GITHUB?
These changes are LOCAL only.

Options:
1. Run /git-push to commit and push
2. Tell me "push docs to github"
3. Leave local for now (manual push later)

Your call.
```

**Duration:** 2-3 seconds (no git operations)

---

## Phase 7: VALIDATE (Ensure Boardroom Readiness)

### Goal
Verify all boardroom agents can load current state

### Actions
1. **Test current_state.md Accessibility**
   ```python
   if not os.path.exists('ai_sam_docs/docs/current_state.md'):
       raise Error("Current state file missing!")
   ```

2. **Validate Content Completeness**
   ```python
   required_sections = [
       'Entrypoint',
       'Active Modules',
       'Excluded Paths',
       'Agent Ecosystem'
   ]

   for section in required_sections:
       if section not in current_state_content:
           raise Error(f"Missing section: {section}")
   ```

3. **Create Intelligence Report**
   ```python
   report = env['documentation.intelligence'].create({
       'name': f"Intelligence Analysis - {timestamp}",
       'total_modules': len(modules),
       'total_models': total_models,
       'total_agents': len(agents),
       'changes_detected': json.dumps(changes),
       'auto_fixes_applied': json.dumps(fixes),
       'requires_anthony': json.dumps(escalations)
   })
   ```

### Output
```
✅ Validation Complete

Boardroom Readiness:
- current_state.md exists: YES
- All required sections: YES
- Accessible to agents: YES
- GitHub sync: COMPLETE

Next boardroom agent will arrive INFORMED ✅

Intelligence Report ID: 42
View: /web#id=42&model=documentation.intelligence
```

**Duration:** 5-10 seconds

---

## Complete Workflow Summary

| Phase | Duration | Can Fail? | Output |
|-------|----------|-----------|--------|
| 1. Discover | 30-60s | ❌ No | Current state snapshot |
| 2. Detect | 10-20s | ❌ No | Changes identified |
| 3. Misalign | 20-40s | ❌ No | Problems found |
| 4. Correct | 10-20s | ⚠️ Partial | Auto-fixes + escalations |
| 5. Update | 15-30s | ❌ No | Docs refreshed |
| 6. Report | 2-3s | ❌ No | Ask push approval |
| 7. Validate | 5-10s | ⚠️ Yes | Readiness confirmed |

**Total Duration:** ~2-3 minutes

**Success Rate:** 100% (no automatic git operations)

---

## Invocation Methods

### Manual Trigger (User Invokes)
```
/docs
```

### Scheduled Trigger (Daily Cron)
```python
# Run every morning at 8 AM
@cron('0 8 * * *')
def run_daily_intelligence():
    env['documentation.intelligence'].run_intelligence_analysis()
```

### Event-Driven Trigger (On Change)
```python
# After module upgrade
@on_module_upgrade
def run_post_upgrade_intelligence():
    env['documentation.intelligence'].run_intelligence_analysis()
```

---

## Error Handling

### If Phase Fails

**Phase 1-3 Failure (Discovery/Detection):**
- Log error
- Use previous state
- Notify Anthony

**Phase 4 Failure (Correction):**
- Skip auto-fixes
- Escalate all to Anthony
- Continue to Phase 5

**Phase 6 Failure (Git Push):**
- Save changes locally
- Retry push (3 attempts)
- Alert Anthony if all fail

**Phase 7 Failure (Validation):**
- Rollback changes
- Use previous state
- Alert Anthony

---

## Success Criteria

**`/docs` workflow succeeds when:**
- ✅ Discovers all active modules (14)
- ✅ Detects changes since last run
- ✅ Identifies misalignments (0-5 typical)
- ✅ Auto-fixes >80% of issues
- ✅ Updates all master docs
- ✅ Pushes to GitHub successfully
- ✅ Boardroom agents load current state

**Failure indicators:**
- ❌ Missing modules in discovery
- ❌ Misalignments not detected
- ❌ Auto-fixes fail
- ❌ Docs not updated
- ❌ Git push fails
- ❌ Boardroom agents still naive

---

## Integration with Ecosystem

**Before `/docs` existed:**
- Agents naive about infrastructure
- Anthony wasted time explaining
- Documentation stale
- No change tracking

**After `/docs` runs:**
- Agents arrive informed
- Anthony's time protected
- Documentation current
- Changes tracked automatically

---

**Result:** SAM AI ecosystem maintains TRUTH, Anthony focuses on MVP ✅
