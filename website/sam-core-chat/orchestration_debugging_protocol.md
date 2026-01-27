# Orchestration Debugging Protocol

**Purpose:** 7-phase systematic workflow for diagnosing SAM chat message flow issues
**Last Updated:** 2025-10-24
**Maintained By:** sam-message-orchestrator agent

---

## 🎯 When to Use This Agent

Invoke `/orchestrator` (or `/messages`) when:
- ✅ Send button disabled/not working
- ✅ Messages not reaching backend
- ✅ Backend responses not showing in frontend
- ✅ Streaming broken (messages don't stream)
- ✅ Context not being passed correctly
- ✅ API errors happening
- ✅ "Out of context" shutdown not working
- ✅ Want to enhance chat orchestration

---

## 🚫 When NOT to Use This Agent

**Delegate to other agents when:**
- ❌ UI layout issues → `/developer` (not orchestration)
- ❌ Infrastructure strategy → `/cto` (not tactical)
- ❌ Feature planning → `/odoo-architect` (not implementation)
- ❌ Backend bugs unrelated to messaging → `/debug` (not orchestration-specific)
- ❌ Module-specific issues → `/mod_sam`, `/mod_intelligence`, etc.

---

## 📋 The 7-Phase Debugging Workflow

---

## PHASE 1: Problem Discovery 🔍

**Goal:** Understand EXACTLY what's broken

### Questions to Ask:

1. **What is the user experiencing?**
   - Send button disabled?
   - No response after sending?
   - Error message shown?
   - Message sent but no streaming?

2. **When did it start?**
   - After Odoo upgrade?
   - After code change?
   - Suddenly today?
   - Always been this way?

3. **Can you reproduce it?**
   - Every time?
   - Specific conditions only?
   - Certain messages only?

4. **What's the expected behavior?**
   - User types → Send button enabled → Click → Message streams → Response appears

### Gather Evidence:

```markdown
**CAPTURE:**
- [ ] Screenshot of issue
- [ ] Browser console errors (F12 → Console)
- [ ] Network tab (F12 → Network → XHR/Fetch)
- [ ] Odoo logs (if accessible)
- [ ] Last working session (if known)
```

### Output:
Write 1-2 sentence problem statement:
> "Send button shows as disabled even when message typed. Browser console shows no errors. Network tab shows no requests being sent."

---

## PHASE 2: Frontend State Analysis 🖥️

**Goal:** Check JavaScript state (is frontend working?)

### Step 1: Verify State Object

**Open browser console, run:**
```javascript
// Check if chat instance exists
window.samChatV2Instance

// Check state
window.samChatV2Instance.state.isProcessing   // Should be false
window.samChatV2Instance.state.inputText      // Should have typed text
window.samChatV2Instance.state.conversationId // Should be null or number
```

**Expected Results:**
- `isProcessing` = `false` (when idle)
- `inputText` = user's typed message
- `conversationId` = `null` (new chat) or number (existing)

**If Different:**
- `isProcessing` stuck at `true` → State not resetting on error
- `inputText` empty but text in box → State not syncing
- `conversationId` undefined → State initialization failed

---

### Step 2: Verify Button Element

```javascript
// Find send button
const sendButton = document.querySelector('.send-button') ||
                   document.querySelector('[data-action="send"]') ||
                   document.querySelector('button');

// Check properties
sendButton.disabled         // Should be false
sendButton.onclick          // Should show function
sendButton.classList        // Check for 'disabled' class
```

**Expected:**
- `disabled` = `false`
- `onclick` = function reference
- No `disabled` class in classList

---

### Step 3: Check Proxy Reactivity

```javascript
// Test if state changes trigger DOM updates
window.samChatV2Instance.state.isProcessing = true
// Wait 1 second, then check button
document.querySelector('.send-button').disabled  // Should be true

window.samChatV2Instance.state.isProcessing = false
// Button should re-enable automatically
```

**If NOT Working:**
- Proxy initialization failed
- Need to check `initReactiveState()` method

---

### Output:
Document findings:
> "Frontend state shows `isProcessing = true`, but button enabled. Proxy reactivity NOT working."

---

## PHASE 3: Network Layer Analysis 🌐

**Goal:** Is frontend communicating with backend?

### Step 1: Monitor Network Tab

**Instructions:**
1. Open F12 → Network tab
2. Clear existing requests
3. Type message and click Send
4. Watch for new requests

**Look for:**
- `/sam_ai/chat/send` (JSON RPC)
- `/sam_ai/chat/send_streaming` (SSE)

**Expected:**
- Request appears within 1 second
- Status: `200 OK` (or `Pending` for streaming)
- Response contains `success: true` and `assistant_message`

**If Missing:**
- ❌ No request → Frontend `sendMessage()` not firing
- ❌ Request fails → Backend error (check response)
- ❌ Request hangs → Timeout or backend stuck

---

### Step 2: Inspect Request Payload

**Click on request → Payload tab:**

```json
{
  "message": "User's message",
  "conversation_id": 123,
  "context_data": {
    "model": "sale.order",
    "record_id": 456
  },
  "environment": {
    "is_local": true,
    "active_mode": "general"
  }
}
```

**Verify:**
- ✅ `message` contains typed text
- ✅ `conversation_id` is correct (or null)
- ✅ `context_data` matches current Odoo record (if applicable)

---

### Step 3: Inspect Response

**Click on request → Response tab:**

**Success Response:**
```json
{
  "success": true,
  "conversation_id": 123,
  "assistant_message": {
    "role": "assistant",
    "content": "Hello! How can I help?",
    "token_count": 15
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Claude API key not configured",
  "message": "I encountered an error. Please try again."
}
```

**If Error:**
- Note exact error message
- Proceed to Phase 4 (Backend Analysis)

---

### Output:
Document findings:
> "Request sent successfully. Response shows `error: 'Claude API key not configured'`. Backend issue."

---

## PHASE 4: Backend Service Analysis ⚙️

**Goal:** Is Odoo AI service working?

### Step 1: Check Odoo Logs

**Location:** Varies by installation
- Linux: `/var/log/odoo/odoo.log`
- Windows: Odoo terminal output
- Docker: `docker logs odoo-container`

**Search for:**
```bash
grep "SAM AI" /var/log/odoo/odoo.log | tail -20
grep "Claude API" /var/log/odoo/odoo.log | tail -20
grep "ERROR" /var/log/odoo/odoo.log | tail -20
```

**Look for:**
- ✅ `🚀 Calling Claude API...` (service invoked)
- ❌ `Claude API key not configured` (missing config)
- ❌ `Claude API error 429` (rate limit)
- ❌ `Cursor already closed` (DB issue)

---

### Step 2: Verify API Key Configuration

**Option A: System Parameters**

```python
# Odoo shell or debug mode
self.env['ir.config_parameter'].get_param('anthropic.api_key')

# Should return: 'sk-ant-api03-...'
# If None → API key not set!
```

**Option B: AI Service Config**

```python
config = self.env['ai.service.config'].search([], limit=1)
print(config.api_key)

# Should return API key
# If False/None → Not configured
```

**Fix if Missing:**
```
Settings → Technical → Parameters → System Parameters
Create: anthropic.api_key = sk-ant-api03-YOUR_KEY
```

---

### Step 3: Test AI Service Directly

**Python shell:**

```python
# Create test conversation
ai_service = self.env['ai.service']

result = ai_service.create_conversation(
    user_message="Test message",
    context_model=None,
    context_id=None,
)

# Should return conversation ID and response
print(result)
```

**Expected:**
```python
{
    'success': True,
    'conversation_id': 123,
    'assistant_message': {...}
}
```

**If Fails:**
- Note exact error
- Check ai_service.py code for issues

---

### Output:
Document findings:
> "API key configured correctly. Direct test succeeds. Issue is in controller layer."

---

## PHASE 5: Controller Layer Analysis 🔗

**Goal:** Is HTTP controller routing correctly?

### Step 1: Verify Route Registration

**Check if route exists:**

```python
# Odoo shell
self.env['ir.http']._match('/sam_ai/chat/send')

# Should return controller method
```

**If Not Found:**
- Controller not loaded
- Route typo
- Module not installed/upgraded

---

### Step 2: Test Controller Directly

**Manual RPC call (browser console):**

```javascript
// Using Odoo's RPC service
odoo.define('test_sam_chat', function(require) {
    var rpc = require('web.rpc');

    rpc.query({
        route: '/sam_ai/chat/send',
        params: {
            message: 'Test from console',
            conversation_id: null,
        }
    }).then(function(result) {
        console.log('Success:', result);
    }).catch(function(error) {
        console.error('Error:', error);
    });
});
```

**Expected:**
- Success response with `assistant_message`

**If Fails:**
- Note error type (403 Forbidden? 500 Server Error?)

---

### Step 3: Check Streaming Endpoint

**If streaming broken:**

```javascript
// Test EventSource
const eventSource = new EventSource('/sam_ai/chat/send_streaming?message=Test');

eventSource.addEventListener('chunk', (e) => {
    console.log('Chunk:', JSON.parse(e.data));
});

eventSource.addEventListener('done', (e) => {
    console.log('Done:', JSON.parse(e.data));
    eventSource.close();
});

eventSource.addEventListener('error', (e) => {
    console.error('Error:', e);
    eventSource.close();
});
```

**Expected:**
- Multiple `chunk` events
- Final `done` event

**If Not:**
- Streaming not working
- Check `send_message_streaming()` implementation

---

### Output:
Document findings:
> "Controller route works. Streaming endpoint returns 500 error. DB cursor issue suspected."

---

## PHASE 6: Anthropic API Analysis 🤖

**Goal:** Is Claude API responding correctly?

### Step 1: Check API Health

**Manual cURL test:**

```bash
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Test"}]
  }'
```

**Expected:**
```json
{
  "id": "msg_123",
  "content": [{"type": "text", "text": "Test response"}],
  "usage": {"input_tokens": 10, "output_tokens": 15}
}
```

**If Fails:**
- `401 Unauthorized` → API key invalid
- `429 Too Many Requests` → Rate limit
- `500 Server Error` → Anthropic API down (rare)

---

### Step 2: Check Token Limits

**Query conversation token usage:**

```python
conversation = self.env['ai.conversation'].browse(123)
total_tokens = sum(conversation.message_ids.mapped('token_count'))

print(f"Total tokens: {total_tokens}")

# If > 200,000 → Exceeds Claude context window!
```

**Fix:**
- Implement sliding window (truncate old messages)

---

### Step 3: Monitor API Response Time

**Check Odoo logs for timing:**

```
🚀 Calling Claude API: claude-3-5-sonnet-20241022 with 5 messages
[2.3s later]
✅ Claude API response received
```

**Normal:** 2-6 seconds
**Slow:** >10 seconds (possible timeout)

---

### Output:
Document findings:
> "API responds in 3 seconds. Token count: 45,000 (within limits). API healthy."

---

## PHASE 7: Root Cause + Fix 🛠️

**Goal:** Identify root cause and implement fix

### Common Root Causes:

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Send button stuck disabled | `isProcessing` not reset | Add `finally` block to reset state |
| No request sent | Event handler not attached | Check `render()` method registers onClick |
| Request fails 401 | API key missing | Configure `anthropic.api_key` param |
| Request fails 429 | Rate limit hit | Retry logic (already implemented) |
| Response not showing | Frontend not parsing response | Check response handler |
| Streaming broken | EventSource error | Check SSE endpoint error handling |
| Context overflow | Conversation too long | Implement sliding window |
| Cursor error | DB cursor closed | Use separate cursors (streaming) |

---

### Fix Template:

**1. Identify File:**
> File: `ai_sam/static/src/js/sam_chat_vanilla_v2.js`
> Line: ~450 (sendMessage method)

**2. Diagnose Issue:**
> `isProcessing` not reset on error because no `finally` block

**3. Propose Fix:**
```javascript
async sendMessage() {
    try {
        this.state.isProcessing = true;
        const response = await rpc(...);
        // handle response
    } catch (error) {
        console.error(error);
    } finally {
        // ✅ ALWAYS reset state
        this.state.isProcessing = false;
    }
}
```

**4. Implement:**
- Use `/developer` agent to implement fix
- OR make change yourself (you're an Implementer archetype!)

**5. Test:**
- Reload browser
- Try sending message
- Verify button re-enables on error

---

### Output:
Provide summary:
> **Root Cause:** `isProcessing` state not reset in error handler
> **Fix Applied:** Added `finally` block to reset state (line 465)
> **Tested:** Send button now re-enables on error ✅

---

## 🎯 Success Criteria

Debugging session is complete when:
- ✅ Root cause identified
- ✅ Fix implemented and tested
- ✅ User can send messages successfully
- ✅ Error handling works (button doesn't get stuck)
- ✅ Streaming works (if applicable)
- ✅ No console errors
- ✅ Backend logs show successful API calls

---

## 📖 Workflow Shortcuts

### Quick Wins (Try These First):

**If Send Button Disabled:**
```javascript
// Browser console quick fix
window.samChatV2Instance.state.isProcessing = false
```

**If API Key Missing:**
```
Settings → Technical → Parameters → System Parameters
Create: anthropic.api_key = sk-ant-api03-...
```

**If Module Not Loaded:**
```
Apps → Update Apps List → Search "ai_sam" → Upgrade
```

---

## 🚨 Escalation Protocol

### When to Involve Other Agents:

**If Issue is:**
- Frontend code needs refactoring → `/developer`
- Infrastructure problem (server down) → `/cto`
- Architecture violation (platform bleeding) → `/check-core`
- Novel bug never seen before → `/debug`
- Performance optimization needed → `/cto` or `/developer`

---

## 📝 Documentation After Fix

**Always update:**

1. **This file** (if new pattern discovered)
2. **`send_button_troubleshooting.md`** (if button-specific)
3. **Session memory** (`/cos` session_memory.md)
4. **Bug history** (if bug was novel)

---

**End of Orchestration Debugging Protocol**
