# Anthropic API Integration Guide

**Purpose:** Claude API specifics, rate limits, context windows, error handling, cost optimization
**Last Updated:** 2025-10-24
**Maintained By:** sam-message-orchestrator agent

---

## 🎯 Quick Reference

**API Endpoint:** `https://api.anthropic.com/v1/messages`
**SDK:** `pip install anthropic` (v0.x)
**Authentication:** API key in `x-api-key` header
**Version Header:** `anthropic-version: 2023-06-01`

---

## 📦 SAM AI's Current Claude Integration

### Model in Use
**Default:** `claude-3-5-sonnet-20241022` (Claude Sonnet 4)

**Why Sonnet:**
- Balance of speed + intelligence
- 200K token context window
- $3/M input tokens, $15/M output tokens
- Good for conversational AI

**Alternative Models Available:**
```python
# ai_service.py pricing table
'claude-sonnet-4-20250514': {'input': 3.00, 'output': 15.00},
'claude-3-5-sonnet-20241022': {'input': 3.00, 'output': 15.00},  # ← Current
'claude-3-5-sonnet-20240620': {'input': 3.00, 'output': 15.00},
'claude-3-opus-20240229': {'input': 15.00, 'output': 75.00},      # Most intelligent
'claude-3-haiku-20240307': {'input': 0.25, 'output': 1.25},       # Fastest/cheapest
```

---

## 🔑 API Authentication

### Current Implementation

**Location:** `ai_brain/models/ai_service.py`

```python
# Line ~994
if not config.api_key:
    raise ValidationError(_('Claude API key not configured'))

headers = {
    'x-api-key': config.api_key,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
}
```

### Where API Key is Stored

**Option 1: System Parameters** (Recommended)
```
Settings → Technical → Parameters → System Parameters
Key: anthropic.api_key
Value: sk-ant-api03-...
```

**Option 2: ai.service.config Model**
```python
config = self.env['ai.service.config'].search([], limit=1)
api_key = config.api_key
```

### Testing API Key

```bash
# Command line test
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

Expected response: `200 OK` with `{"id": "msg_...", "content": [{"text": "Hello!..."}]}`

---

## 📊 Context Window Limits

### Claude 3.5 Sonnet Specifications

**Max Context:** 200,000 tokens (~600K characters)

**What Fits in 200K Tokens:**
- ~400 pages of text
- ~75 long Odoo conversations
- ~1,500 short messages

### Token Calculation

**SAM's Implementation:**
```python
# ai_service.py - Method: count_tokens()
def count_tokens(self, messages, model=None):
    """Count tokens using Anthropic SDK's count_tokens method"""

    if not ANTHROPIC_SDK_AVAILABLE:
        # Fallback: ~4 characters per token
        total_chars = sum(len(msg.get('content', '')) for msg in messages)
        return total_chars // 4

    # Use Anthropic SDK (more accurate)
    client = anthropic.Anthropic(api_key=config.api_key)
    token_count = client.count_tokens(messages)
    return token_count
```

### Handling Context Overflow

**Current Status:** ⚠️ NOT YET IMPLEMENTED in SAM AI

**TODO - Implement Sliding Window:**
```python
def send_message(self, conversation_id, user_message, ...):
    all_messages = conversation.message_ids.sorted('create_date')

    # Calculate total tokens
    total_tokens = sum(msg.token_count for msg in all_messages)

    # If exceeding 150K (leave 50K buffer), truncate old messages
    if total_tokens > 150000:
        # Keep system message + last 30 messages
        messages = [all_messages[0]] + all_messages[-30:]
        _logger.warning(f"⚠️ Conversation {conversation_id} truncated (too long)")
    else:
        messages = all_messages

    return self._call_claude_api(config, messages, ...)
```

---

## ⏱️ Rate Limits

### Anthropic's Rate Limits (As of Oct 2025)

**Tier 1 (Default):**
- 50 requests per minute (RPM)
- 40,000 tokens per minute (TPM)

**Tier 2 (After usage):**
- 1,000 RPM
- 80,000 TPM

**Tier 3 (High volume):**
- 2,000 RPM
- 160,000 TPM

### Detecting Rate Limit Hit

**Response:** HTTP `429 Too Many Requests`

```json
{
  "error": {
    "type": "rate_limit_error",
    "message": "You have exceeded your rate limit"
  }
}
```

### SAM's Rate Limit Handling

**Implementation:** Exponential backoff retry (3 attempts)

```python
# ai_service.py - Method: _call_claude_api()
max_attempts = 3

for attempt in range(max_attempts):
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)

        if response.status_code == 200:
            return response.json()  # Success!

        elif response.status_code == 429:
            # Rate limit → Wait and retry
            wait_time = 2 ** attempt  # 1s, 2s, 4s
            _logger.warning(f"⚠️ Rate limit hit, waiting {wait_time}s...")
            time.sleep(wait_time)
            continue

        else:
            # Other error → Fail
            raise UserError(f'Claude API error: {response.status_code}')

    except requests.Timeout:
        if attempt < max_attempts - 1:
            continue  # Retry
        else:
            raise UserError('Claude API timeout')
```

---

## 💰 Cost Tracking

### Token Pricing (Claude 3.5 Sonnet)

**Input Tokens:** $3.00 per 1M tokens ($0.000003 per token)
**Output Tokens:** $15.00 per 1M tokens ($0.000015 per token)

### Example Costs

**Conversation Scenarios:**

| Scenario | Input Tokens | Output Tokens | Cost |
|----------|--------------|---------------|------|
| Short message | 500 | 200 | $0.0045 |
| Medium conversation | 5,000 | 2,000 | $0.045 |
| Long conversation | 50,000 | 10,000 | $0.30 |
| Context window full | 150,000 | 20,000 | $0.75 |

**Monthly Estimates:**
- 100 messages/day × 30 days × $0.0045 = **$13.50/month**
- 500 messages/day × 30 days × $0.0045 = **$67.50/month**

### SAM's Cost Tracking

**Model:** `ai.token.usage`

```python
# Created after each API call
self.env['ai.token.usage'].create({
    'conversation_id': conversation_id,
    'input_tokens': input_tokens,
    'output_tokens': output_tokens,
    'model': 'claude-3-5-sonnet-20241022',
    'cost': (input_tokens * 0.000003) + (output_tokens * 0.000015),
    'user_id': self.env.uid,
})
```

**Query Total Costs:**
```python
# Total cost for user this month
total_cost = self.env['ai.token.usage'].search([
    ('user_id', '=', uid),
    ('create_date', '>=', '2025-10-01'),
]).mapped('cost')

print(f"Total cost: ${sum(total_cost):.2f}")
```

---

## 🔥 Error Types & Handling

### 1. Authentication Errors (401)

**Cause:** Invalid or missing API key

**Response:**
```json
{
  "error": {
    "type": "authentication_error",
    "message": "Invalid API key"
  }
}
```

**Fix:**
- Verify API key in System Parameters
- Check key hasn't been revoked in Anthropic Console

---

### 2. Rate Limit Errors (429)

**Cause:** Too many requests too fast

**Fix:** Already handled by retry logic (see above)

---

### 3. Context Length Errors (400)

**Cause:** Conversation exceeds 200K tokens

**Response:**
```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "messages: total length exceeds 200000 tokens"
  }
}
```

**Fix:** Implement sliding window (truncate old messages)

---

### 4. Timeout Errors

**Cause:** API takes >60 seconds to respond

**SAM's Handling:**
```python
try:
    response = requests.post(..., timeout=60)
except requests.Timeout:
    # Retry up to 3 times
    if attempt < max_attempts - 1:
        continue
    else:
        raise UserError('Claude API timeout after 3 attempts')
```

---

### 5. Network Errors

**Cause:** No internet connection, DNS failure, etc.

**SAM's Handling:**
```python
except requests.ConnectionError as e:
    if attempt < max_attempts - 1:
        _logger.warning(f"⚠️ Connection error, retrying... ({e})")
        time.sleep(2 ** attempt)
        continue
    else:
        raise UserError('Could not connect to Claude API')
```

---

## 📡 Streaming vs. Non-Streaming

### Non-Streaming (Simple)

**Endpoint:** `POST /v1/messages`

**Request:**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 8000,
  "messages": [
    {"role": "user", "content": "Hello"}
  ]
}
```

**Response:**
```json
{
  "id": "msg_123",
  "model": "claude-3-5-sonnet-20241022",
  "content": [
    {"type": "text", "text": "Hello! How can I help you today?"}
  ],
  "usage": {
    "input_tokens": 10,
    "output_tokens": 15
  }
}
```

**SAM Implementation:** `ai_service._call_claude_api()` uses this

---

### Streaming (SSE)

**Endpoint:** `POST /v1/messages` with `"stream": true`

**Request:**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 8000,
  "messages": [{"role": "user", "content": "Hello"}],
  "stream": true  // ← Enable streaming
}
```

**Response:** Server-Sent Events (SSE)

```
event: message_start
data: {"type": "message_start", "message": {"id": "msg_123", ...}}

event: content_block_delta
data: {"type": "content_block_delta", "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "delta": {"type": "text_delta", "text": "!"}}

event: message_delta
data: {"type": "message_delta", "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}
```

**SAM Implementation:** `sam_ai_chat_controller.send_message_streaming()` handles this

---

## 🔧 Advanced Features

### 1. Vision (Image Input)

**Status in SAM:** ✅ Supported (attachments in `sam_chat_vanilla_v2.js`)

**Request Format:**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "What's in this image?"},
      {
        "type": "image",
        "source": {
          "type": "base64",
          "media_type": "image/jpeg",
          "data": "/9j/4AAQSkZJRg..."
        }
      }
    ]
  }]
}
```

---

### 2. System Prompts

**SAM's Usage:** Environment-aware system prompts

```python
# ai_service.py
system_prompt = """
You are SAM, an intelligent AI business partner.

[Personality traits...]

CURRENT ENVIRONMENT:
- User: {user_name}
- Odoo Module: {active_model}
- Mode: {active_mode}

[Mode-specific instructions...]
"""
```

**Sent as:**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "system": "You are SAM...",  // ← System prompt
  "messages": [{"role": "user", "content": "..."}]
}
```

---

### 3. Temperature & Top-P

**Current SAM Settings:** NOT SET (uses Claude defaults)

**Defaults:**
- Temperature: 1.0 (balanced creativity)
- Top-P: Not set

**Could Add:**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "temperature": 0.7,  // More focused responses
  "top_p": 0.9,
  "messages": [...]
}
```

---

## 🚨 Common Integration Issues

### Issue 1: "Anthropic SDK not available"

**Symptom:** Logs show `ANTHROPIC_SDK_AVAILABLE = False`

**Cause:** `pip install anthropic` not run in Odoo's Python environment

**Fix:**
```bash
# Activate Odoo venv
source /path/to/odoo-venv/bin/activate

# Install Anthropic SDK
pip install anthropic

# Restart Odoo
sudo systemctl restart odoo
```

---

### Issue 2: API Key Not Found

**Symptom:** `ValidationError: Claude API key not configured`

**Fix:**
```
Settings → Technical → Parameters → System Parameters
Click "Create"
Key: anthropic.api_key
Value: sk-ant-api03-YOUR_KEY_HERE
```

---

### Issue 3: Requests Hanging

**Symptom:** Message sent, but never receives response

**Cause:** No timeout set OR timeout too long

**Current SAM Setting:** `timeout=60` (60 seconds)

**Check:**
```python
# ai_service.py line ~1024
response = requests.post(
    self.api_endpoint,
    headers=headers,
    json=payload,
    timeout=60  # ← Should be here
)
```

---

### Issue 4: JSON Parsing Errors

**Symptom:** `JSONDecodeError` when parsing response

**Cause:** Anthropic returned non-JSON (usually error page)

**Debug:**
```python
response = requests.post(...)

# Log raw response BEFORE parsing
_logger.info(f"Raw response: {response.text}")

# Then parse
result = response.json()
```

---

## 📖 Anthropic SDK Alternative

### Current: Manual HTTP Requests (requests library)

**Pros:**
- Full control
- Easier debugging
- No extra dependencies (besides `requests`)

**Cons:**
- More code to maintain
- Manual retry logic

---

### Alternative: Use Anthropic Python SDK

**Installation:**
```bash
pip install anthropic
```

**Usage:**
```python
import anthropic

client = anthropic.Anthropic(api_key=api_key)

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=8000,
    messages=[
        {"role": "user", "content": "Hello"}
    ]
)

print(message.content[0].text)
```

**Pros:**
- Cleaner code
- Built-in retry logic
- Automatic type checking

**Cons:**
- Less control
- SDK updates required

**Recommendation:** SAM's current approach (manual HTTP) is GOOD. Only switch if SDK provides major benefits.

---

## 🎯 Optimization Tips

### 1. Cache System Prompts

**Problem:** System prompt sent with EVERY message (wastes tokens)

**Solution:** Use Prompt Caching (Anthropic feature)

```python
# NOT YET IMPLEMENTED IN SAM
{
  "model": "claude-3-5-sonnet-20241022",
  "system": [
    {
      "type": "text",
      "text": "You are SAM...",
      "cache_control": {"type": "ephemeral"}  // ← Cache this!
    }
  ],
  "messages": [...]
}
```

**Benefit:** 90% cost reduction on cached tokens

---

### 2. Compress Old Messages

**Problem:** Long conversations = expensive input tokens

**Solution:** Summarize old messages, keep recent ones

```python
# Example implementation
if len(messages) > 50:
    # Summarize messages 1-30
    summary = self._summarize_messages(messages[1:30])
    # Keep: system + summary + messages 31-50
    messages = [messages[0], summary] + messages[30:]
```

---

### 3. Use Haiku for Simple Tasks

**Problem:** Using Sonnet for simple "yes/no" questions wastes money

**Solution:** Route simple queries to Haiku (12x cheaper)

```python
# Detect simple queries
if self._is_simple_query(user_message):
    model = 'claude-3-haiku-20240307'  # $0.25/M vs $3/M
else:
    model = 'claude-3-5-sonnet-20241022'
```

---

**End of Anthropic Integration Guide**
