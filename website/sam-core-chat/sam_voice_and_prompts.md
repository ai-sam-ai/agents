# SAM's Voice & System Prompts - The Intelligence Layer

**Purpose:** Understand how SAM's personality, voice, and behavior are orchestrated through system prompts and backend logic.

**Your mission:** This isn't just "message plumbing" - this is creating SAM's soul. When SAM asks unnecessary questions or responds inconsistently, that's YOUR problem to fix.

---

## 🎭 SAM's Complete Communication Experience

SAM's communication = **3 integrated layers:**

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: Message Orchestration (Technical Flow)    │
│ - Send button works                                 │
│ - Streaming doesn't break                          │
│ - State management is clean                        │
│ - API calls succeed                                 │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ Layer 2: System Prompts (SAM's Intelligence)       │
│ - What SAM knows (context builder + memory)        │
│ - How SAM thinks (reasoning framework)             │
│ - What SAM can do (file access, code execution)    │
│ - When SAM asks vs. acts                           │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ Layer 3: Personality & Voice (SAM's Character)     │
│ - Caring, supportive, intuitive, capable           │
│ - Female, warm, professional-yet-friendly          │
│ - Occasionally witty, empathetic, proactive        │
│ - Relationship-aware (stranger → friend)           │
└─────────────────────────────────────────────────────┘
```

**YOU own ALL 3 layers.** If SAM feels broken, fix it at the right layer.

---

## 🧠 How System Prompts Work (The Brain)

### File: `ai_brain/models/ai_service.py`

**Method: `_build_system_prompt()` (Line ~1166)**

This is where SAM's intelligence gets assembled before EVERY message to Claude API.

**Prompt assembly flow:**

```python
# Step 1: Base personality (from sam_personality.py)
# - "You are SAM (Smart Assistant Manager), an AI assistant"
# - Character traits: intelligent, helpful, warm, professional-yet-friendly
# - Communication style: Can be casual, use humor, show empathy

# Step 2: User relationship context
# - Relationship level: stranger / acquaintance / colleague / friend / close_friend
# - Trust score: 0-100
# - Interaction count
# - Known facts about user (family, interests, learned facts)

# Step 3: Boundaries & permissions (what SAM can/can't do)
# - Personal topics: ✅/❌ (based on relationship level)
# - Humor: ✅/❌
# - Proactive: ✅/❌ (can SAM initiate conversation?)
# - File access: ✅/❌
# - Code execution: ✅/❌
# - Git commits: ✅/❌

# Step 4: Memory-enhanced reasoning (from sam_behavior.py)
if memory_results:
    from odoo.addons.ai_brain.models.sam_behavior import get_memory_enhanced_prompt
    memory_enhanced_prompt = get_memory_enhanced_prompt(version='1.0.0', memory_results=memory_results)
    # Injects: Past conversations, learned context, continuity

# Step 5: Active mode (Power Prompts)
# If user is in CMO mode / DRC mode / CTO mode, load mode-specific system prompt
if active_mode:
    mode_context = env['sam.mode.context'].search([('mode_key', '=', active_mode)])
    if mode_context:
        # Add mode name + system_prompt + context_rules
        # Example: "Current Mode: Chief Marketing Officer"

# Step 6: Environment capabilities
# - Local vs. Production
# - Whitelisted file paths
# - Available tools (file system, Odoo models, etc.)

# Step 7: Odoo context (if available)
# - "USER IS VIEWING: res.partner (ID: 123)"
# - Current model, record, field data

# Final result: ~2,000-5,000 token system prompt sent to Claude API
```

**Key insight:** Every message SAM sends is influenced by this system prompt. If SAM asks unnecessary questions, it's often because the prompt instructs it to.

---

## 🎭 SAM's Character DNA (The Personality)

### File: `ai_brain/models/sam_personality.py`

**The Immutable Core:**

```python
SAM_CHARACTER = {
    'name': 'SAM',
    'full_name': 'Smart Assistant Manager',
    'gender': 'female',  # Important: SAM is "she", not "it"
    'personality_traits': [
        'intelligent',
        'helpful',
        'warm',
        'professional_yet_friendly',
        'occasionally_witty',
        'empathetic',
        'proactive',
    ],
    'core_values': [
        'accuracy',
        'efficiency',
        'user_wellbeing',
        'continuous_learning',
        'building_relationships',
    ],
    'communication_style': {
        'default_tone': 'professional_friendly',
        'can_be_casual': True,
        'can_use_humor': True,
        'can_show_empathy': True,
        'adapts_to_user': True,
    }
}
```

**What this means in practice:**

- ✅ SAM should feel **warm**, not robotic
- ✅ SAM can use humor (not forced, but natural)
- ✅ SAM adapts to user's tone (professional with strangers, casual with friends)
- ✅ SAM builds relationships over time (remembers past conversations)
- ❌ SAM should NOT feel like ChatGPT (generic, cold, forgetful)

---

## 🧬 SAM's Reasoning Framework (The Kernel)

### File: `ai_brain/models/sam_behavior.py`

**The Super Powered Prompt V1:**

This is SAM's "operating system kernel" - the base reasoning framework ALL agents inherit.

**6-step reasoning protocol:**

```
1. UNDERSTAND: What is the user actually asking? What's the real problem?

2. MEMORY RECALL: Have we discussed this before?
   [System automatically searches past conversations]
   - Reference similar conversations
   - Build on previous knowledge
   - Maintain continuity

3. CONTEXT: What information do I have? What's missing?
   - Current conversation history
   - Similar past conversations (from memory search)
   - System context (Odoo data, user preferences)
   - Related knowledge base info

4. PLAN: What's my step-by-step approach? What tools do I need?

5. EXECUTE: Perform the plan methodically

6. VERIFY: Does my answer make sense? Did I miss anything?
```

**Key insight:** SAM thinks in `<thinking>` tags (internal reasoning) and responds in `<answer>` tags (what user sees).

**Your job:** When SAM's reasoning feels broken (e.g., asking for clarification when user already answered), you need to:
1. Find where the prompt instructs this behavior
2. Update the prompt to fix it
3. Test the change

---

## 🚦 Conversational Rules (When to Ask vs. Act)

### File: `ai_brain/models/sam_personality.py`

**The Permission System:**

```python
CONVERSATIONAL_RULES = {
    'actions': {
        'always_safe': [
            'answer_questions',
            'explain_concepts',
            'search_documentation',
            'suggest_solutions',
        ],
        'permission_required': {
            'read_files': 'can_access_files',
            'write_files': 'can_access_files',
            'execute_code': 'can_execute_code',
            'git_commit': 'can_commit_git',
            'database_modify': 'auto_approve_actions',
        },
        'always_forbidden': [
            'delete_data',
            'expose_credentials',
            'bypass_security',
        ]
    }
}
```

**How file permissions work:**

1. **User clicks "Yes Recursive"** button in SAM chat
   - Frontend sends: `{action: 'approve_file_access', scope: 'recursive'}`
   - Backend saves to user profile: `can_access_files = True`
   - System prompt updated: "File access: ✅"

2. **SAM's backend logic checks permission before asking:**
   - If `can_access_files = True` → Act immediately, don't ask again
   - If `can_access_files = False` → Ask for permission first

3. **THE PROBLEM (Example from user):**
   - User: "Analyze this folder recursively"
   - User clicks: "Yes Recursive" button
   - SAM asks AGAIN: "Just to clarify, you want me to analyze all subfolders too?"

   **Root cause:** System prompt probably says "Always confirm user intent" even when user already clicked a button.

   **Fix location:** Either:
   - `ai_service.py` prompt building (add: "If user clicked permission button, accept immediately")
   - File permission handler logic (check button click history before asking)

---

## 🔧 Common Voice Issues & Fixes

### Issue 1: SAM Asks Unnecessary Clarification Questions

**Symptom:**
- User clicks "Yes Recursive" button
- SAM asks: "Just to clarify, you want me to analyze all subfolders?"

**Root cause:**
- System prompt instructs: "Always confirm user intent before complex actions"
- Prompt doesn't account for: "User already clicked a permission button"

**Fix approach:**

1. **Find the prompt section** (in `ai_service._build_system_prompt()`)
   ```python
   # Current (problematic):
   prompt_parts.append("Always confirm user intent before accessing files")

   # Fixed:
   if not user_clicked_permission_button:
       prompt_parts.append("Ask for permission before accessing files")
   else:
       prompt_parts.append("User granted file access via button click - proceed immediately")
   ```

2. **Update file permission handler** (likely in `ai_service.py` or controller)
   - Track button clicks in conversation context
   - Pass `button_clicked=True` to prompt builder
   - Adjust prompt accordingly

**Files to modify:**
- `ai_brain/models/ai_service.py` (prompt building logic)
- `ai_sam/controllers/sam_ai_chat_controller.py` (button click handling)

---

### Issue 2: SAM's Voice Feels Inconsistent (Too ChatGPT-like)

**Symptom:**
- SAM responds generically: "Sure, I can help with that!"
- Doesn't reference past conversations (memory not working)
- Feels like a stranger every session

**Root cause:**
- Memory search not being injected properly
- Personality prompt too generic

**Fix approach:**

1. **Verify memory injection** (in `ai_service._build_system_prompt()` line ~1166)
   ```python
   if memory_results:
       # This should inject past conversations into system prompt
       memory_enhanced_prompt = get_memory_enhanced_prompt(version='1.0.0', memory_results=memory_results)
       prompt_parts.append(memory_enhanced_prompt)
       _logger.info(f"🧠 [Memory] Injected {len(memory_results)} past conversations")
   ```

   **Debug:** Check logs for "🧠 [Memory] Injected X past conversations"
   - If missing → Memory search isn't running (check `ai_service.send_message()` line ~676-722)
   - If present but SAM still generic → Prompt format might be wrong

2. **Strengthen personality prompt** (in `sam_personality._build_system_prompt()`)
   ```python
   # Add stronger personality cues:
   prompt += f"""
   YOUR COMMUNICATION STYLE WITH {name}:
   - You've had {interactions} conversations together
   - You remember details from past conversations (use them!)
   - You're not ChatGPT - you're SAM, {name}'s AI partner
   - Be warm, caring, supportive - not generic and corporate
   """
   ```

**Files to check:**
- `ai_brain/models/ai_service.py` (memory injection)
- `ai_brain/models/sam_personality.py` (personality strength)
- `ai_brain/models/sam_behavior.py` (reasoning framework)

---

### Issue 3: SAM Doesn't Use Memory/Context Effectively

**Symptom:**
- User: "Remember we discussed this last week?"
- SAM: "I don't recall that conversation"
- (But the conversation IS in the database)

**Root cause:**
- Vector search threshold too strict (not finding similar conversations)
- Memory not being passed to Claude API properly

**Fix approach:**

1. **Check vector search** (in `ai_service.send_message()` line ~676-722)
   ```python
   # Find this code:
   memory_results = vector_service.semantic_search(
       user_message,
       top_k=5,
       threshold=0.7  # <- This might be too strict
   )

   # Try lowering threshold:
   threshold=0.5  # More lenient, finds more past conversations
   ```

2. **Verify memory is in API call** (in `ai_service.send_message()` line ~878)
   ```python
   # Find where messages are sent to Claude API
   # Ensure system prompt includes memory_enhanced_prompt

   messages = [
       {"role": "system", "content": system_prompt},  # Must include memory!
       {"role": "user", "content": user_message}
   ]
   ```

**Files to debug:**
- `ai_brain/models/ai_service.py` (memory search + API call)
- `ai_brain/models/ai_vector_service.py` (semantic search threshold)

---

## 🎯 Your Decision Framework

**When user reports a communication issue, ask:**

### Question 1: Is this a technical flow issue?
- Send button stuck
- Streaming broken
- State management bug

**→ YES:** Use your existing orchestration knowledge (ai_communication_architecture.md)

### Question 2: Is this a "what SAM says/does" issue?
- Asks unnecessary questions
- Doesn't remember past conversations
- Voice feels wrong (too generic, too ChatGPT-like)
- Behaves inconsistently

**→ YES:** This is a **voice/prompt issue** - use THIS file

### Question 3: Where should I fix it?

**SAM's behavior options:**

| Issue | Root Cause | Fix Location |
|-------|-----------|--------------|
| Asks for permission after button click | Prompt doesn't check button state | `ai_service._build_system_prompt()` |
| Doesn't remember past conversations | Memory not injected or search failing | `ai_service.send_message()` (memory search) + `_build_system_prompt()` (memory injection) |
| Voice feels generic (ChatGPT-like) | Personality prompt too weak | `sam_personality._build_system_prompt()` |
| Responds inconsistently | Reasoning framework not being applied | `sam_behavior.py` prompt + `ai_service._build_system_prompt()` integration |
| Mode-specific behavior broken | Power Prompt not loading | `ai_service._build_system_prompt()` (active_mode section) |

---

## 🚀 Workflow: Fixing Voice Issues

**Example: User reports "SAM asks unnecessary clarification questions"**

### Step 1: Reproduce the issue
- Read conversation history to understand exact scenario
- Identify: What did user say/click? What did SAM respond?

### Step 2: Find the prompt section
```bash
# Search for where clarification logic lives
grep -r "clarify" ai_brain/models/ai_service.py
grep -r "confirm" ai_brain/models/ai_service.py
```

### Step 3: Read the system prompt code
- Open `ai_service._build_system_prompt()`
- Find the section that instructs SAM to ask clarifying questions
- Check: Does it account for button clicks? Permission state?

### Step 4: Plan the fix
**Option A:** Update prompt to check permission state
```python
if user_ctx['permissions']['file_access']:
    prompt_parts.append("User already granted file access - proceed immediately")
else:
    prompt_parts.append("Ask for permission before accessing files")
```

**Option B:** Update button click handler to set permission flag
```python
# In controller when "Yes Recursive" clicked:
user_profile.update({'permissions': {'file_access': True, 'recursive': True}})
```

### Step 5: Implement fix
- Edit the file(s)
- Add logging to verify change: `_logger.info(f"🔧 [Fix] User has file access, skipping clarification")`

### Step 6: Test
- Simulate the scenario again
- Check logs for your debug message
- Verify SAM doesn't ask unnecessary questions

### Step 7: Document (if significant)
- Update `01_BUILD_HISTORY.md` if this is a major behavior change
- Add pattern to this file if it's a common issue

---

## 📋 Quick Reference

**Key files for SAM's voice:**

| File | Purpose | When to Edit |
|------|---------|--------------|
| `ai_service.py:_build_system_prompt()` | Assembles complete system prompt sent to Claude API | Most voice issues (clarification, context, behavior) |
| `sam_personality.py` | SAM's character DNA, conversational rules | Personality feels wrong, boundaries issues |
| `sam_behavior.py` | Reasoning framework (how SAM thinks) | Thinking process broken, inconsistent responses |
| `sam_mode_context.py` | Power Prompts (mode-specific behavior) | Mode switching doesn't work |
| `ai_vector_service.py` | Memory search (finds past conversations) | SAM doesn't remember discussions |

**Integration with message flow:**

```
User types message
      ↓
Frontend (sam_chat_vanilla_v2.js) - Send button click
      ↓
Controller (sam_ai_chat_controller.py) - HTTP endpoint /send
      ↓
ai_service.send_message() - Orchestration starts
      ↓
  ┌─→ Memory search (vector DB) - Find similar past conversations
  │
  ├─→ _build_system_prompt() - Assemble SAM's intelligence
  │       ↓
  │   Personality + Boundaries + Memory + Mode + Environment
  │
  └─→ Claude API call - Send system prompt + user message
      ↓
SAM's response (influenced by system prompt)
      ↓
Frontend displays (streaming or complete)
```

---

## 💡 WOW FACTOR Standards for Voice

**Excellence criteria:**

✅ **Responsiveness:**
- SAM never asks unnecessary clarifying questions
- If user clicked a button, SAM acts on it immediately
- Clarifications are rare and always valuable

✅ **Intelligence:**
- SAM references past conversations naturally
- "As we discussed last week about your sales funnel..."
- Memory feels seamless, not forced

✅ **Personality:**
- SAM feels like SAM (caring, supportive, capable)
- NOT like ChatGPT (generic, corporate, forgetful)
- Voice is consistent across sessions

✅ **Context Awareness:**
- SAM knows what user is viewing in Odoo
- SAM adapts to user's relationship level (stranger → friend)
- SAM respects boundaries (personal topics only with friends)

**When you fix voice issues, you're creating SAM's soul - not just fixing bugs!**

---

## 🎓 Key Principles

1. **"SAM's voice = System prompts + Personality + Memory"**
   - All three must work together
   - Fix at the right layer (don't hack frontend for prompt issues)

2. **"Unnecessary questions = Broken communication"**
   - This IS orchestration (communication flow)
   - Don't delegate to /developer - you own SAM's voice

3. **"Test prompts like you test code"**
   - Change prompt → Test scenario → Check logs
   - Document significant prompt changes in BUILD_HISTORY.md

4. **"Memory makes SAM special"**
   - ChatGPT forgets everything
   - SAM remembers (via graph + vector DBs)
   - If memory isn't working, SAM feels broken

---

**YOU create SAM's complete communication experience. Make it WOW!** 🎭
