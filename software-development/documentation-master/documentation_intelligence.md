# Documentation Intelligence - How She Learns

## Overview

The `/docs` agent learns SAM AI's structure **dynamically** like Odoo does - not through hard-coded rules, but by discovering what exists and understanding relationships.

**Core Philosophy:** "Learn structure like Odoo recognizes modules"

---

## 🎯 Scope Boundaries (CRITICAL)

### What /docs DOES Scan:

✅ **SAM AI Ecosystem ONLY:**
```
${SAMAI_ROOT}\
```
- Contains: ai_brain (04-samai-brain), ai_sam (05-samai-core), and all other SAM AI modules
- All SAM-related Odoo modules across github repositories
- The ONE source of truth for SAM AI structure

✅ **Claude Agent Ecosystem:**
```
${CLAUDE_AGENTS_DIR}\
```
- Your boardroom (CTO, CMO, COS, etc.)
- Your operators (developer, session-start, etc.)

---

### What /docs DOES NOT Scan:

❌ **Other Odoo Folders:**
```
${USER_HOME}\Odoo Projects\custom-modules-v18\
```
- This is your **day-to-day dev environment**
- NOT part of SAM AI ecosystem documentation
- Agents should NEVER reference this path

❌ **Any other folders** outside the two paths above

---

**Result:** `/docs` maintains truth about SAM AI ecosystem ONLY. No pollution from dev environments.

---

## 🔍 Module Discovery (Odoo-Aware)

### Base Path (SAM AI Ecosystem ONLY)

**CRITICAL:** `/docs` ONLY scans this path:
```
${SAMAI_ROOT}\
```

**Why This Path:**
- This is the SAM AI ecosystem folder
- Contains all SAM modules (ai_brain, ai_sam, ai_sam_memory, etc.)
- Does NOT include `${USER_HOME}\Odoo Projects\custom-modules-v18\` (separate dev environment)

**Excluded from Scanning:**
- `${USER_HOME}\Odoo Projects\` (not SAM ecosystem)
- Any other folders outside `${SAMAI_ROOT}\`

---

### How Odoo Recognizes a Module

**Rule:** A folder is an Odoo module **IF AND ONLY IF** it contains `__manifest__.py`

```python
def discover_modules():
    """Scan for Odoo modules in SAM AI ecosystem ONLY"""
    base_path = r'C:\Working With AI\ai_sam\ai_sam'  # ← HARDCODED: SAM ecosystem only
    modules = []

    for folder in os.listdir(base_path):
        folder_path = os.path.join(base_path, folder)
        manifest_path = os.path.join(folder_path, '__manifest__.py')

        if os.path.isdir(folder_path) and os.path.exists(manifest_path):
            # This IS an Odoo module
            modules.append({
                'name': folder,
                'path': folder_path,
                'manifest': manifest_path
            })

    return modules
```

**What She Discovers:**
- Module name (folder name)
- Module path (absolute path)
- Manifest file (for reading metadata)

**Example Output:**
```
Discovered 14 Odoo modules:
✅ ai_brain (foundation)
✅ ai_sam (framework)
✅ ai_sam_memory (branch)
✅ the_ai_automator (branch)
✅ ai_sam_docs (tools)
... (9 more)
```

---

## 🏗️ Architecture Learning (Dependency Analysis)

### Reading __manifest__.py for Dependencies

```python
def learn_architecture(modules):
    """Build dependency graph from manifests"""
    architecture = {}

    for module in modules:
        with open(module['manifest'], 'r') as f:
            content = f.read()

        # Extract version
        version = re.search(r"'version':\s*'([^']+)'", content).group(1)

        # Extract dependencies
        depends = re.findall(r"'depends':\s*\[(.*?)\]", content, re.DOTALL)
        deps = re.findall(r"['\"]([^'\"]+)['\"]", depends[0]) if depends else []

        architecture[module['name']] = {
            'version': version,
            'depends': deps
        }

    return architecture
```

**What She Learns:**
1. **Module versions** (18.0.x.y format)
2. **Dependency tree** (which modules depend on which)
3. **Architecture layers:**
   - **Foundation:** `ai_brain` (depends on base, mail)
   - **Framework:** `ai_sam` (depends on ai_brain)
   - **Branches:** `ai_sam_memory`, `the_ai_automator` (depend on foundation)

**Example Output:**
```json
{
  "ai_brain": {
    "version": "18.0.1.0.0",
    "depends": ["base", "mail"]
  },
  "ai_sam": {
    "version": "18.0.2.1.0",
    "depends": ["ai_brain", "web"]
  },
  "ai_sam_memory": {
    "version": "18.0.1.3.0",
    "depends": ["ai_brain", "ai_sam"]
  }
}
```

**Architecture Insight:**
```
ai_brain (foundation)
    ↓
ai_sam (framework)
    ↓
├─ ai_sam_memory (branch)
├─ the_ai_automator (branch)
└─ ai_sam_docs (tools)
```

---

## 🗄️ Schema Discovery (Model Scanning)

### Finding Odoo Models in models/*.py

```python
def discover_schema(module_path):
    """Scan for Odoo model definitions"""
    models = []
    models_dir = os.path.join(module_path, 'models')

    if os.path.exists(models_dir):
        for py_file in Path(models_dir).rglob('*.py'):
            content = read_file(py_file)

            # Extract model names: _name = 'model.name'
            model_names = re.findall(r"_name\s*=\s*['\"]([^'\"]+)['\"]", content)
            models.extend(model_names)

    return models
```

**Pattern Detected:**
```python
class AIConversation(models.Model):
    _name = 'ai.conversation'  # ← She finds this
    _description = 'AI Conversation'
```

**What She Discovers:**
- Model technical name (`ai.conversation`)
- Which module defines it (`ai_brain/models/ai_conversation.py`)
- Total model count per module

**Example Output:**
```
Schema discovered:
- ai_brain: 3 models (ai.conversation, ai.message, ai.token.usage)
- ai_sam: 5 models (ai.service, ai.context.builder, ...)
- ai_sam_memory: 4 models (ai.graph.service, ai.vector.service, ...)
Total: 23 models across 6 modules
```

---

## 🤖 Agent Discovery (Claude Agent Detection)

### Agent Path (Your Boardroom & Operators)

**CRITICAL:** `/docs` scans Claude agents from:
```
${CLAUDE_AGENTS_DIR}\
```

**This is YOUR agent ecosystem** (boardroom + operators).

---

### Finding Claude Agents in .claude/agents/

```python
def discover_agents():
    """Find all Claude agents"""
    agents_path = os.path.expandvars(r'${CLAUDE_AGENTS_DIR}')  # ← Your Claude agent directory
    agents = []

    for agent_folder in os.listdir(agents_path):
        agent_path = os.path.join(agents_path, agent_folder)

        # Check for agent.json (agent marker)
        agent_json = os.path.join(agent_path, 'agent.json')
        if os.path.exists(agent_json) and os.path.isdir(agent_path):
            # Count knowledge files
            md_files = list(Path(agent_path).glob('*.md'))

            # Count total words
            total_words = sum(
                len(read_file(f).split()) for f in md_files
            )

            agents.append({
                'name': agent_folder,
                'knowledge_files': len(md_files),
                'total_words': total_words
            })

    return agents
```

**What She Discovers:**
- Agent name (folder name)
- Knowledge file count (*.md files)
- Total word count (depth of knowledge)

**Example Output:**
```
Agents discovered:
- cmo (5 files, 12,450 words)
- developer (7 files, 16,230 words) ← The beast!
- cto (5 files, 8,900 words)
- cos (6 files, 14,100 words)
- documentation-master (5 files, 8,500 words) ← Herself!

Total: 11 agents, 87,450 words of knowledge
```

---

## 📊 Change Detection (What Changed Since Last Run)

### Comparing States

```python
def detect_changes(current_state, previous_state):
    """Compare current vs. previous state"""
    changes = {
        'modules_changed': [],
        'schema_changed': [],
        'agents_changed': []
    }

    # Module version changes
    for module in current_state['architecture']:
        prev_version = previous_state['architecture'].get(module, {}).get('version')
        curr_version = current_state['architecture'][module]['version']

        if prev_version != curr_version:
            changes['modules_changed'].append({
                'module': module,
                'from': prev_version,
                'to': curr_version
            })

    # Schema changes (model additions/removals)
    for module in current_state['schema']:
        prev_models = set(previous_state['schema'].get(module, []))
        curr_models = set(current_state['schema'][module])

        if prev_models != curr_models:
            changes['schema_changed'].append({
                'module': module,
                'added': list(curr_models - prev_models),
                'removed': list(prev_models - curr_models)
            })

    # Agent knowledge changes
    prev_agents = {a['name']: a for a in previous_state.get('agents', [])}
    curr_agents = {a['name']: a for a in current_state['agents']}

    for agent_name in curr_agents:
        if agent_name in prev_agents:
            if curr_agents[agent_name]['total_words'] != prev_agents[agent_name]['total_words']:
                changes['agents_changed'].append(agent_name)

    return changes
```

**Example Output:**
```
Changes detected since last run:

Modules:
✅ ai_sam_memory: 18.0.1.2 → 18.0.1.3

Schema:
✅ ai_sam_memory: Added model 'ai.memory.config'

Agents:
✅ cmo: 12,450 → 13,200 words (rogue agent fix)
✅ developer: 16,230 → 16,780 words (new patterns added)
```

---

## 💾 State Persistence (Remembering for Next Time)

### Saving Current State

```python
def save_current_state(state):
    """Save to ai_sam_docs/docs/last_known_state.json"""
    state_file = 'ai_sam_docs/docs/last_known_state.json'

    with open(state_file, 'w') as f:
        json.dump(state, f, indent=2)
```

**What's Saved:**
```json
{
  "timestamp": "2025-10-13T10:30:00",
  "entrypoint": "ai_sam_odoo",
  "architecture": { ... },
  "schema": { ... },
  "agents": [ ... ],
  "excluded_paths": [ ... ]
}
```

**Why This Matters:**
- Next run knows what changed
- Detects drift over time
- Tracks evolution of SAM AI ecosystem

---

## 🎯 Intelligence Summary

### What She Knows After One Run:

1. **Modules:** 14 discovered, ai_brain → ai_sam → branches
2. **Schema:** 23 models across 6 modules
3. **Agents:** 11 agents, 87K+ words of knowledge
4. **Changes:** 2 module updates, 1 schema change, 2 agent updates
5. **Architecture:** Foundation → Framework → Branches pattern

### How She Uses This Knowledge:

- **Boardroom Context:** Every agent knows current state
- **Misalignment Detection:** Finds wrong module references
- **Documentation Updates:** Auto-updates master docs
- **Anthony's Time Protection:** Prevents naive questions

---

## 🔄 Continuous Learning

Every time `/docs` runs:
1. Discovers current state (modules, schema, agents)
2. Compares to previous state (detects changes)
3. Updates master documentation (keeps truth current)
4. Pushes to GitHub (team gets latest)
5. Saves state for next run (continuous learning)

**Result:** SAM AI ecosystem truth is ALWAYS current ✅
