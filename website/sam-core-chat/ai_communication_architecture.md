# SAM AI Communication Architecture

**Purpose:** Complete map of how messages flow through SAM AI's backend
**Last Updated:** 2025-10-24
**Maintained By:** sam-message-orchestrator agent

---

## 🎯 The Big Picture: Message Journey

```
USER TYPES MESSAGE
     ↓
[1] Frontend (sam_chat_vanilla_v2.js)
     ↓
[2] HTTP Controller (sam_ai_chat_controller.py)
     ↓
[3] AI Service Orchestrator (ai_service.py in ai_brain)
     ↓
[4] Anthropic API (Claude)
     ↓
[5] Response flows BACK through layers
     ↓
USER SEES RESPONSE
```

---

## 📦 Layer 1: Frontend (JavaScript)

### **File:** `ai_sam/static/src/js/sam_chat_vanilla_v2.js`

**Class:** `SamChatVanilla`

**Responsibilities:**
- User interface (chat window, send button, message display)
- Client-side state management (vanilla JS proxy reactivity)
- Capture user input + attachments + tools
- Send to backend via RPC or SSE streaming

**Key State Properties:**
```javascript
this.state = {
    messages: [],           // Chat history
    inputText: "",          // Current message being typed
    isProcessing: false,    // ⚠️ Controls send button enabled/disabled
    conversationId: null,   // Current conversation ID
    contextData: {},        // Odoo context (model, record_id)
    attachments: [],        // Image uploads
    tools: {                // Tool toggles
        file: false,
        code: false,
        web: false
    },
    activeMode: 'general',  // SAM personality mode
    // ... many more
}
```

**Send Button Behavior:**
- **Enabled when:** `!isProcessing && inputText.trim() !== ""`
- **Disabled when:** `isProcessing === true` OR `inputText` is empty

**Message Send Methods:**
1. **Non-streaming:** `sendMessage()` → calls `/sam_ai/chat/send` (JSON RPC)
2. **Streaming:** `sendMessageStreaming()` → calls `/sam_ai/chat/send_streaming` (SSE)

---

## 📦 Layer 2: HTTP Controller (Python)

### **File:** `ai_sam/controllers/sam_ai_chat_controller.py`

**Class:** `SamAIChatController`

**Endpoints:**

### 1. `/sam_ai/chat/send` (JSON RPC)
**Method:** `send_message()`

**Flow:**
```python
1. Receives: message, conversation_id, context_data, environment
2. Parses context (model, record_id)
3. Delegates to ai.service model:
   - If conversation_id exists → send_message()
   - If new conversation → create_conversation()
4. Returns: { success, conversation_id, assistant_message, ... }
```

### 2. `/sam_ai/chat/send_streaming` (SSE)
**Method:** `send_message_streaming()`

**Flow:**
```python
1. Receives: Same as above
2. Returns Server-Sent Events stream:
   - event: status → "Processing..."
   - event: chunk → "Hello" "world" "!"
   - event: done → Final message
   - event: error → If something fails
3. Uses separate DB cursors to avoid "Cursor already closed" errors
```

**Key Difference:**
- `/send` = Waits for full response, then returns (slower UX)
- `/send_streaming` = Streams response character-by-character (better UX)

---

## 📦 Layer 3: AI Service Orchestrator (Python)

### **File:** `ai_brain/models/ai_service.py`

**Model:** `ai.service`

**This is the ORCHESTRATION BRAIN** - where all the magic happens.

### Core Methods:

#### 1. `create_conversation(user_message, context_model, context_id, ...)`
**Purpose:** Start new conversation

**Flow:**
```python
1. Create ai.conversation record
2. Create ai.message (role='user', content=user_message)
3. Build system prompt (environment-aware)
4. Build context (if Odoo record provided)
5. Call _call_claude_api()
6. Save assistant response as ai.message
7. Return conversation + response
```

#### 2. `send_message(conversation_id, user_message, context_data, environment)`
**Purpose:** Continue existing conversation

**Flow:**
```python
1. Load conversation
2. Save user message
3. Build message history (retrieve all ai.message records)
4. Check token limits (context window management)
5. Optionally invoke memory search (graph DB, vector search)
6. Call _call_claude_api()
7. Save assistant response
8. Track tokens + cost
9. Return response
```

#### 3. `_call_claude_api(config, messages, environment, user_context, memory_results)`
**Purpose:** Actual HTTP call to Anthropic

**Flow:**
```python
1. Validate API key exists
2. Build headers:
   - x-api-key: {ANTHROPIC_API_KEY}
   - anthropic-version: 2023-06-01
   - content-type: application/json
3. Build request body:
   - model: "claude-3-5-sonnet-20241022"
   - messages: [history]
   - system: {environment-aware prompt}
   - max_tokens: 8000
4. HTTP POST to https://api.anthropic.com/v1/messages
5. Retry logic (3 attempts, exponential backoff)
6. Handle errors:
   - Rate limits (429)
   - Timeouts
   - Connection errors
7. Parse response JSON
8. Extract assistant message
9. Return response
```

---

## 📦 Layer 4: Data Models (ai_brain)

### **File:** `ai_brain/models/ai_message.py`

**Model:** `ai.message`

**Fields:**
- `conversation_id` (Many2one to ai.conversation)
- `role` (Selection: user, assistant, system)
- `content` (Text: actual message)
- `token_count` (Integer: tokens used)
- `cost` (Float: $ cost)
- `ai_model` (Char: e.g., "claude-3-5-sonnet-20241022")
- `create_date` (Datetime: when sent)

**Purpose:** Permanent storage of conversation history

---

## 🔗 Integration Points

### 1. **Context Builder** (Optional Enhancement)
**File:** `ai_brain/models/ai_context_builder.py`

**Purpose:** When user chats from Odoo record (e.g., sale.order #123), builds rich context:
- Record data (customer name, order total, etc.)
- Related records (order lines, invoices)
- Field metadata

**Integration:** Called by `ai_service.send_message()` if `context_data` provided

---

### 2. **Memory System** (Graph + Vector Search)
**Models:**
- `ai.graph.service` (Apache AGE graph database)
- `ai.vector.service` (ChromaDB vector search)

**Purpose:** Retrieve relevant past conversations when user asks follow-up questions

**Integration:** Called by `ai_service.send_message()` before API call

---

### 3. **Token Tracking**
**Model:** `ai.token.usage`

**Purpose:** Track API costs per conversation/user/month

**Integration:** Automatically created after each `_call_claude_api()` call

---

## ⚠️ Critical Path: Send Button Issue

**Problem:** Send button shows as disabled even when message typed

**Root Causes (Possible):**

### 1. **Frontend State Out of Sync**
```javascript
// sam_chat_vanilla_v2.js
this.state.isProcessing = true;  // Set when sending
// If error occurs BEFORE response, isProcessing never set back to false
// → Send button stays disabled forever
```

**Detection:** Check browser console for errors during send

**Fix:** Ensure `isProcessing = false` in error handlers

---

### 2. **Proxy Reactivity Broken**
```javascript
// sam_chat_vanilla_v2.js line 98-99
this.initReactiveState();  // Sets up Proxy for automatic DOM updates

// If proxy fails to initialize, DOM doesn't update when state changes
```

**Detection:** `console.log(this.state.isProcessing)` vs. button disabled attribute

**Fix:** Check `initReactiveState()` implementation

---

### 3. **Event Handler Not Attached**
```javascript
// Send button click handler might not be registered
sendButton.addEventListener('click', () => this.sendMessage());
```

**Detection:** Click button → check if `sendMessage()` fires

**Fix:** Verify event handler registration in `render()` method

---

### 4. **Backend Error Not Handled**
```python
# sam_ai_chat_controller.py
except Exception as e:
    return {'success': False, 'error': str(e)}
    # Frontend might not handle this properly
```

**Detection:** Network tab → check response JSON for errors

**Fix:** Frontend should set `isProcessing = false` on error response

---

## 🔍 Debugging Protocol

### Step 1: Frontend State Check
```javascript
// Browser console
window.samChatV2Instance.state.isProcessing  // Should be false
window.samChatV2Instance.state.inputText     // Should have text
```

### Step 2: Button Attribute Check
```javascript
// Browser console
document.querySelector('.send-button').disabled  // Should be false
```

### Step 3: Event Handler Check
```javascript
// Browser console
$('.send-button').onclick  // Should show function
```

### Step 4: Network Check
- Send message
- Open Network tab
- Look for `/sam_ai/chat/send` or `/send_streaming`
- Check response (200? 500? Error?)

### Step 5: Backend Logs
```bash
# Odoo logs
tail -f /var/log/odoo/odoo.log | grep "SAM AI"
```

---

## 📊 Message Flow Timing (Normal)

```
User types "Hello SAM"
     ↓ [0ms]
Frontend captures input
     ↓ [10ms]
RPC call to /sam_ai/chat/send
     ↓ [50ms]
Controller receives, delegates to ai.service
     ↓ [100ms]
ai.service builds context, retrieves history
     ↓ [200ms]
HTTP POST to Anthropic API
     ↓ [2000-5000ms] ⏱️ SLOWEST STEP
Anthropic returns response
     ↓ [5100ms]
ai.service saves message, calculates cost
     ↓ [5200ms]
Controller returns JSON response
     ↓ [5250ms]
Frontend displays message, sets isProcessing=false
     ↓ [5260ms]
Send button re-enabled ✅
```

**Total:** ~5-6 seconds for non-streaming

**With Streaming:** Response starts at ~2 seconds (better UX)

---

## 🛠️ Configuration Files

### 1. Anthropic API Key
**Location:** System parameters OR `ai.service.config` model

**Key name:** `anthropic.api_key`

**Validation:**
```python
if not config.api_key:
    raise ValidationError('Claude API key not configured')
```

### 2. Model Selection
**Default:** `claude-3-5-sonnet-20241022`

**Configurable in:** `ai.service.config` → `model_name` field

### 3. Token Limits
**Default:** 200,000 tokens (Claude Sonnet context window)

**Managed by:** `ai.service.send_message()` → checks total conversation tokens

---

## 🚨 Common Orchestration Issues

### Issue 1: "Cursor already closed"
**Cause:** Streaming endpoint uses same DB cursor across generator yields

**Fix:** Use separate cursors per operation (already implemented in `send_message_streaming()`)

---

### Issue 2: API Rate Limits (429)
**Cause:** Too many requests to Anthropic

**Fix:** Exponential backoff retry (already implemented in `_call_claude_api()`)

---

### Issue 3: Context Window Exceeded
**Cause:** Conversation too long (>200K tokens)

**Fix:** Summarize old messages, keep recent ones (TODO: not yet implemented)

---

### Issue 4: Missing API Key
**Cause:** `anthropic.api_key` system parameter not set

**Fix:** Settings → Technical → Parameters → System Parameters → Create `anthropic.api_key`

---

## 📖 Related Files (Quick Reference)

**Frontend:**
- `ai_sam/static/src/js/sam_chat_vanilla_v2.js` - Chat UI
- `ai_sam/static/src/js/sam_chat_vanilla_v2_action.xml` - Menu action

**Backend:**
- `ai_sam/controllers/sam_ai_chat_controller.py` - HTTP endpoints
- `ai_brain/models/ai_service.py` - Orchestration brain
- `ai_brain/models/ai_message.py` - Message storage
- `ai_brain/models/ai_conversation.py` - Conversation storage

**Configuration:**
- `ai_brain/models/ai_service_config.py` - AI service config
- System Parameters → `anthropic.api_key`

---

**End of Architecture Documentation**
