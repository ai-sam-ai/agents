# Message Orchestration Patterns

**Purpose:** Best practices for SAM AI message handling, context management, and flow control
**Last Updated:** 2025-10-24
**Maintained By:** sam-message-orchestrator agent

---

## 🎯 The Golden Rule

**SAM chat experience should match Claude Code experience** (or exceed it)

What this means:
- ✅ Responsive (streaming, not blocking)
- ✅ Context-aware (remembers conversation)
- ✅ Intelligent routing (Odoo questions → Odoo intelligence, general → Claude)
- ✅ Error recovery (graceful fallbacks)
- ✅ Personality consistency (SAM's 4 traits always present)

---

## 📋 Pattern 1: State Management (Frontend)

### ✅ GOOD: Proxy Reactivity

```javascript
// sam_chat_vanilla_v2.js
this.initReactiveState();  // Sets up automatic DOM updates

// When state changes, DOM automatically updates
this.state.isProcessing = true;   // Send button disables
this.state.isProcessing = false;  // Send button re-enables
```

**Why Good:**
- No manual DOM manipulation
- State is single source of truth
- Automatic UI sync

---

### ❌ BAD: Manual DOM Manipulation

```javascript
// AVOID THIS
document.querySelector('.send-button').disabled = true;
this.state.isProcessing = true;  // State and DOM out of sync!
```

**Why Bad:**
- State and DOM can diverge
- Bugs are hard to track
- Not reactive

---

### 🔥 CRITICAL: Error Recovery Pattern

```javascript
async sendMessage() {
    try {
        this.state.isProcessing = true;  // Disable send button

        const response = await rpc('/sam_ai/chat/send', {
            message: this.state.inputText,
            // ... other params
        });

        if (!response.success) {
            // ⚠️ MUST set isProcessing = false on error!
            this.state.isProcessing = false;
            this.showError(response.error);
            return;
        }

        // Handle success
        this.addMessage(response.assistant_message);

    } catch (error) {
        // ⚠️ MUST set isProcessing = false on exception!
        this.state.isProcessing = false;
        this.showError('Failed to send message');
        console.error(error);
    } finally {
        // ✅ BEST: Always reset in finally block
        this.state.isProcessing = false;
    }
}
```

**Key Points:**
- ALWAYS reset `isProcessing` in `finally` block
- Handle both API errors AND exceptions
- Never leave user stuck with disabled button

---

## 📋 Pattern 2: Streaming vs. Non-Streaming

### When to Use Streaming (`/send_streaming`)

**Use Cases:**
- ✅ Long responses (>500 characters expected)
- ✅ User-facing chat (better UX)
- ✅ Real-time feel needed

**Implementation:**
```javascript
async sendMessageStreaming() {
    const eventSource = new EventSource('/sam_ai/chat/send_streaming?' + params);

    eventSource.addEventListener('chunk', (e) => {
        const data = JSON.parse(e.data);
        this.appendToLastMessage(data.text);  // Character-by-character
    });

    eventSource.addEventListener('done', (e) => {
        this.state.isProcessing = false;  // ✅ Re-enable send button
        eventSource.close();
    });

    eventSource.addEventListener('error', (e) => {
        this.state.isProcessing = false;  // ✅ Re-enable on error
        eventSource.close();
    });
}
```

---

### When to Use Non-Streaming (`/send`)

**Use Cases:**
- ✅ Short responses expected
- ✅ Bulk operations (not user-facing)
- ✅ Simpler error handling needed

**Implementation:**
```javascript
async sendMessage() {
    const response = await rpc('/sam_ai/chat/send', {
        message: this.state.inputText,
        conversation_id: this.state.conversationId,
    });

    if (response.success) {
        this.addMessage(response.assistant_message);
    }
}
```

---

## 📋 Pattern 3: Context Awareness (Backend)

### ✅ GOOD: Environment-Aware System Prompts

```python
# ai_service.py
def _build_system_prompt(self, environment=None):
    """Build system prompt based on where user is in Odoo"""

    base_prompt = "You are SAM, an intelligent AI business partner..."

    if environment and environment.get('is_local'):
        # User is in Odoo (not public chat)
        active_mode = environment.get('active_mode', 'general')

        if active_mode == 'odoo_intelligence':
            return base_prompt + "\n\nYou are in Odoo Intelligence mode. Help with database queries, record lookups, and business logic."
        elif active_mode == 'developer':
            return base_prompt + "\n\nYou are in Developer mode. Provide technical Odoo development assistance."

    return base_prompt
```

**Why Good:**
- SAM adapts to user's context
- Responses are more relevant
- Less "I don't have access to that" responses

---

### ❌ BAD: Generic Prompts Everywhere

```python
# AVOID THIS
system_prompt = "You are a helpful assistant."  # Too generic!
```

**Why Bad:**
- SAM loses personality
- Responses are generic ChatGPT-like
- No Odoo-specific intelligence

---

## 📋 Pattern 4: Conversation History Management

### ✅ GOOD: Sliding Window (Recent Messages)

```python
# ai_service.py
def send_message(self, conversation_id, user_message, ...):
    # Get ALL messages
    all_messages = conversation.message_ids.sorted('create_date')

    # Calculate total tokens
    total_tokens = sum(msg.token_count for msg in all_messages)

    # If exceeding context window (200K), keep only recent
    if total_tokens > 150000:  # Leave 50K buffer
        # Keep system message + last 20 messages
        messages = [all_messages[0]] + all_messages[-20:]
    else:
        messages = all_messages

    # Build message array for Claude
    claude_messages = [
        {'role': msg.role, 'content': msg.content}
        for msg in messages if msg.role != 'system'
    ]
```

**Why Good:**
- Stays within Claude's 200K token limit
- Keeps recent context (most relevant)
- System prompt always included

---

### ❌ BAD: Send ALL Messages Always

```python
# AVOID THIS
messages = conversation.message_ids  # Could be 300K tokens!
```

**Why Bad:**
- Exceeds Claude's context window → API error
- Slow (more tokens = more cost + time)
- Old messages less relevant anyway

---

## 📋 Pattern 5: "Out of Context" Shutdown (User's Favorite!)

### ✅ GOOD: Intelligent Routing + Graceful Refusal

```python
# ai_service.py
def send_message(self, conversation_id, user_message, ...):
    # 🎯 ROUTE intelligently
    routing_result = self._route_message(user_message, environment)

    if routing_result['handler'] == 'odoo_intelligence':
        # User asking about Odoo data → Use Odoo Intelligence
        try:
            return self._handle_odoo_intelligence(...)
        except Exception as e:
            # Fallback to Claude if Odoo Intelligence fails
            _logger.warning(f"Odoo Intelligence failed, falling back to Claude: {e}")
            # Continue to Claude API below

    # Default: Claude API
    return self._call_claude_api(...)
```

**System Prompt Enhancement:**
```python
# Add to system prompt
"""
IMPORTANT BOUNDARIES:
- If user asks about specific Odoo records you don't have access to, say:
  "I don't have access to that specific record. Let me route you to Odoo Intelligence."

- If user asks about topics outside your expertise, acknowledge limits:
  "That's outside my current knowledge. I can connect you with..."

- NEVER make up data you don't have access to.
- NEVER pretend to know something you don't.
"""
```

**Why Good:**
- SAM is honest (builds trust)
- Routes to specialized handlers
- User loved this behavior (explicitly mentioned)

---

### ❌ BAD: Hallucinate or Generic Response

```python
# AVOID THIS
# SAM just makes up an answer when it doesn't have data
response = "Your order total is $1,234.56"  # But it doesn't know!
```

**Why Bad:**
- Destroys user trust
- Provides wrong information
- User expects Claude Code-level accuracy

---

## 📋 Pattern 6: Error Handling (3 Layers)

### Layer 1: Frontend Error Handling

```javascript
// sam_chat_vanilla_v2.js
try {
    const response = await rpc('/sam_ai/chat/send', {...});

    if (!response.success) {
        // API returned error
        this.showErrorMessage(response.error || 'Unknown error');
        return;
    }

} catch (error) {
    // Network error, RPC failure, etc.
    this.showErrorMessage('Failed to connect to SAM AI. Please check your connection.');
    console.error('[SAM Chat] Error:', error);
}
```

---

### Layer 2: Controller Error Handling

```python
# sam_ai_chat_controller.py
@http.route('/sam_ai/chat/send', ...)
def send_message(self, message, ...):
    try:
        result = ai_service.send_message(...)
        return result

    except Exception as e:
        _logger.error(f"SAM AI chat error: {e}", exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'message': 'I encountered an error. Please try again.'
        }
```

---

### Layer 3: AI Service Error Handling

```python
# ai_service.py
def _call_claude_api(self, config, messages, ...):
    max_attempts = 3

    for attempt in range(max_attempts):
        try:
            response = requests.post(
                self.api_endpoint,
                headers=headers,
                json=payload,
                timeout=60
            )

            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:
                # Rate limit → Retry with backoff
                time.sleep(2 ** attempt)  # 1s, 2s, 4s
                continue
            else:
                # Other error → Raise
                raise UserError(f'Claude API error: {response.status_code}')

        except requests.Timeout:
            if attempt < max_attempts - 1:
                continue  # Retry
            else:
                raise UserError('Claude API timeout')
```

**Why 3 Layers:**
- Frontend: User-friendly messages
- Controller: Logging + API response format
- AI Service: Retry logic + detailed error handling

---

## 📋 Pattern 7: Memory Integration (Optional Enhancement)

### ✅ GOOD: Relevant Memory Injection

```python
# ai_service.py
def send_message(self, conversation_id, user_message, ...):
    # 🧠 Search memory BEFORE calling Claude
    memory_results = None

    if self.env['ir.module.module'].search([('name', '=', 'ai_sam_memory'), ('state', '=', 'installed')]):
        # Memory module installed → Use it!
        memory_service = self.env['ai.graph.service']
        memory_results = memory_service.search_relevant_context(
            query=user_message,
            user_id=self.env.uid,
            limit=5  # Top 5 relevant past conversations
        )

    # Include memory in system prompt or messages
    if memory_results:
        system_prompt += f"\n\nRELEVANT PAST CONTEXT:\n{memory_results}"

    # Call Claude with enriched context
    return self._call_claude_api(config, messages, memory=memory_results)
```

**Why Good:**
- SAM "remembers" past conversations
- More personalized responses
- Differentiator from ChatGPT (user's goal!)

---

### ❌ BAD: Ignore Memory Completely

```python
# AVOID THIS
# Just call Claude without checking memory
return self._call_claude_api(config, messages)  # No memory!
```

**Why Bad:**
- SAM forgets everything (just like ChatGPT)
- Loses competitive advantage
- User has to repeat context

---

## 📋 Pattern 8: Token Cost Optimization

### ✅ GOOD: Track + Optimize Costs

```python
# ai_service.py
def send_message(self, conversation_id, user_message, ...):
    # Calculate tokens BEFORE calling API
    input_tokens = self.count_tokens(messages)

    _logger.info(f"📊 Sending {input_tokens} tokens to Claude API")

    # Call API
    response = self._call_claude_api(...)

    # Track usage
    self.env['ai.token.usage'].create({
        'conversation_id': conversation_id,
        'input_tokens': input_tokens,
        'output_tokens': response.get('output_tokens', 0),
        'model': config.model_name,
        'cost': self.calculate_cost(input_tokens, output_tokens, model),
    })
```

**Cost Alerts:**
```python
# If conversation getting expensive, warn user
total_cost = sum(conversation.token_usage_ids.mapped('cost'))

if total_cost > 1.00:  # $1 threshold
    _logger.warning(f"💰 Conversation {conversation_id} cost: ${total_cost:.2f}")
    # Could inject message: "This conversation has used $1 in API credits."
```

---

### ❌ BAD: No Token Tracking

```python
# AVOID THIS
# Just call API, don't track costs
response = self._call_claude_api(...)
# ❌ No cost tracking! User has no idea how much they're spending!
```

**Why Bad:**
- Costs can spiral out of control
- No visibility into expensive conversations
- Can't optimize

---

## 📋 Pattern 9: Personality Consistency (SAM's 4 Traits)

### ✅ GOOD: SAM Personality Enforcement

**From `/sam` agent knowledge:**
- **Caring** - Shows empathy, remembers user challenges
- **Supportive** - Encourages, celebrates wins
- **Intuitive** - Reads between lines, asks clarifying questions
- **Capable** - Confidently delegates to specialists

**System Prompt Integration:**
```python
system_prompt = """
You are SAM (Strategic AI Manager), an intelligent AI business partner.

YOUR PERSONALITY (ALWAYS):
- Caring: Show genuine interest in user's challenges and goals
- Supportive: Encourage progress, celebrate wins
- Intuitive: Ask clarifying questions, detect unspoken needs
- Capable: Know when to delegate to specialists (CMO, CTO, Architect, Developer)

VOICE MODULATION:
When shifting modes, announce it visually:
- "🎯 Putting on my CMO hat..." (marketing questions)
- "⚙️ Switching to Developer mode..." (technical questions)
- "💼 Let me think strategically..." (business strategy)

DELEGATION PROTOCOL:
If question requires:
- Marketing strategy → Suggest /cmo agent
- Technical architecture → Suggest /odoo-architect agent
- Implementation → Suggest /developer agent
- Debugging → Suggest /debug agent
```

---

### ❌ BAD: Generic ChatGPT Personality

```python
# AVOID THIS
system_prompt = "You are a helpful assistant."  # ❌ No SAM personality!
```

**Why Bad:**
- SAM loses unique identity
- Just another ChatGPT clone
- User wants SAM to be DIFFERENT (explicitly stated goal)

---

## 🎯 The "Very Good Session" Pattern (What User Loved)

### What Made /mod_sam Session Excellent:

1. **Startup Protocol Executed** ✅
   - Loaded `current_state.md` first
   - Verified SAM AI path
   - Read session history

2. **Deep Analysis Request Handled** ✅
   - User asked: "Reverse engineer Send button JS, why disabled?"
   - Agent didn't give surface answer
   - Did DEEP dive (exactly what user wanted)

3. **Stayed in Scope** ✅
   - When orchestration question came up, /mod_sam said:
     "This is outside my specialization (core infrastructure)"
   - Recommended creating sam-message-orchestrator specialist
   - DIDN'T hallucinate an answer outside expertise!

4. **Self-Aware Delegation** ✅
   - Agent knew its boundaries
   - Suggested right specialist for the job
   - This is "out of context" shutdown user loved!

---

## 🔥 Replicating Excellence Checklist

For sam-message-orchestrator to match /mod_sam quality:

- ✅ **Startup Protocol:** Read `current_state.md` + search session history FIRST
- ✅ **Deep Analysis:** Don't give surface answers, go DEEP
- ✅ **Scope Awareness:** Know your boundaries (AI orchestration ONLY)
- ✅ **Delegation:** Route questions outside scope to right specialist
- ✅ **Honesty:** "I don't know" is better than hallucination
- ✅ **Plan → Clarify → Implement:** User wants this workflow (Q4 answer)
- ✅ **Self-Mapping:** Agent should map tech stack ITSELF (Q3 answer)

---

**End of Message Orchestration Patterns**
