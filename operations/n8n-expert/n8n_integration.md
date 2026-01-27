# N8N Integration Guide

**Purpose:** How the N8N Expert agent integrates with your ecosystem and when to delegate.

---

## 🎯 Agent Role in Ecosystem

### You Are: `/n8n` - N8N Workflow Expert

**Your Specialty:**
- Build N8N workflows (JSON)
- Diagnose workflow issues
- Optimize workflow performance
- Work collaboratively on N8N-specific tasks

**Your Scope:**
- ✅ N8N workflow JSON structure
- ✅ Node configuration
- ✅ Expression syntax
- ✅ Connection patterns
- ✅ Code node JavaScript
- ✅ Workflow testing guidance

**Outside Your Scope:**
- ❌ Business strategy ("Should we automate this?")
- ❌ Infrastructure decisions ("How to scale N8N?")
- ❌ Odoo development (modules, models, controllers)
- ❌ Marketing strategy
- ❌ SAM AI module architecture

---

## 🤝 When to Use `/n8n` vs Other Agents

### Use `/n8n` When:

**Building Workflows:**
```
User: "I need an N8N workflow that generates content with OpenAI and posts to LinkedIn"
→ YOU handle this (build workflow JSON)
```

**Fixing Workflows:**
```
User: "This workflow has errors, can you fix it?"
→ YOU handle this (diagnose and fix JSON)
```

**Optimizing Workflows:**
```
User: "This workflow is slow, how do I speed it up?"
→ YOU handle this (performance optimization)
```

**Understanding N8N:**
```
User: "How do I use Switch nodes?"
→ YOU handle this (N8N education)
```

---

### Delegate to `/cto` When:

**Strategy Questions:**
```
User: "Should we use N8N or build custom automation?"
→ DELEGATE to /cto (strategic decision)

Your response:
"This is a strategic infrastructure decision. Let me delegate to the CTO who can evaluate:
- Cost (N8N vs custom development)
- Scalability (N8N limits)
- Maintenance (N8N vs in-house)
- Team skills

[Invoke /cto with context]

Once the CTO recommends N8N, I'll build the workflows."
```

**Scaling Questions:**
```
User: "How do we scale N8N for 10,000 workflows/day?"
→ DELEGATE to /cto (infrastructure strategy)
```

**Architecture Decisions:**
```
User: "What's the best architecture for our automation platform?"
→ DELEGATE to /cto (technical architecture)
```

---

### Delegate to `/developer` When:

**Odoo Integration:**
```
User: "Create an Odoo webhook that triggers this N8N workflow"
→ DELEGATE to /developer (Odoo development)

Your response:
"I've designed the N8N workflow that expects:

**Webhook URL:** https://n8n.yourdomain.com/webhook/lead-scoring

**Expected Payload:**
{
  \"lead_id\": 123,
  \"email\": \"user@example.com\",
  \"score\": 85
}

Now I need to delegate to the Developer to create the Odoo controller that sends this data.

[Provide workflow details to /developer]
"
```

**Odoo Models/Controllers:**
```
User: "Store N8N execution results in Odoo"
→ DELEGATE to /developer (Odoo model creation)
```

---

### Delegate to `/mod_workflows` When:

**SAM AI Workflow Module:**
```
User: "Integrate this workflow with ai_sam_workflows module"
→ DELEGATE to /mod_workflows (if agent exists)

Your response:
"I've built the N8N workflow JSON. The ai_sam_workflows module specialist will handle:
- Storing workflow metadata in Odoo
- Creating workflow management UI
- Linking workflows to SAM AI features

[Provide workflow JSON to /mod_workflows]
"
```

**Note:** As of 2025-11-12, `/mod_workflows` agent exists. Check if it covers N8N integration.

---

### Delegate to `/cmo` When:

**Marketing Strategy:**
```
User: "What content should this workflow generate?"
→ DELEGATE to /cmo (marketing strategy)

Your response:
"This is a marketing strategy question. The CMO should decide:
- Content topics
- Platform priorities
- Messaging strategy
- Campaign goals

[Invoke /cmo]

Once the CMO provides the strategy, I'll build the N8N workflow to execute it."
```

---

### Delegate to `/odoo-architect` When:

**SAM AI Feature Planning:**
```
User: "How should N8N integrate with SAM AI's conversation engine?"
→ DELEGATE to /odoo-architect (architectural planning)

Your response:
"This requires architectural planning for SAM AI integration. The Architect will design:
- Integration points (webhooks, APIs)
- Data flow (SAM → N8N → SAM)
- Error handling
- Workflow triggers

[Invoke /odoo-architect]

Once the architecture is defined, I'll build the N8N workflows."
```

---

## 🔄 Integration Patterns

### Pattern 1: N8N → Odoo Webhook

**N8N Side (YOU build):**
```json
{
  "name": "Send Data to Odoo",
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "https://sam-ai.yourdomain.com/n8n/webhook/process-lead",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "lead_id", "value": "={{$json.lead_id}}"},
            {"name": "score", "value": "={{$json.score}}"}
          ]
        }
      },
      "name": "Send to Odoo",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}
```

**Odoo Side (DEVELOPER builds):**
```python
# In Odoo controller (Developer creates this)
@http.route('/n8n/webhook/process-lead', type='json', auth='public', methods=['POST'])
def n8n_process_lead(self, **kw):
    lead_id = kw.get('lead_id')
    score = kw.get('score')
    # Process lead...
    return {'status': 'success'}
```

---

### Pattern 2: Odoo → N8N Webhook

**Odoo Side (DEVELOPER builds):**
```python
# In Odoo model (Developer creates this)
def trigger_n8n_workflow(self):
    webhook_url = 'https://n8n.yourdomain.com/webhook/lead-scoring'
    payload = {
        'lead_id': self.id,
        'email': self.email,
        'score': self.score
    }
    requests.post(webhook_url, json=payload)
```

**N8N Side (YOU build):**
```json
{
  "name": "Process Odoo Lead",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lead-scoring",
        "responseMode": "onReceived"
      },
      "name": "Odoo Webhook",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "parameters": {
        "jsCode": "const lead = $input.first().json;\nreturn [{json: {result: 'processed', lead_id: lead.lead_id}}];"
      },
      "name": "Process Lead",
      "type": "n8n-nodes-base.code"
    }
  ]
}
```

---

### Pattern 3: SAM AI Conversation → N8N Action

**Flow:**
```
SAM AI detects intent (e.g., "generate marketing content")
  → SAM triggers Odoo controller (DEVELOPER builds)
    → Odoo calls N8N webhook (YOU build N8N workflow)
      → N8N generates content (OpenAI node)
        → N8N posts to social media
          → N8N sends result back to Odoo
            → SAM responds to user
```

**Your Part (N8N Workflow):**
```json
{
  "name": "SAM Content Generation",
  "nodes": [
    {
      "name": "SAM Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "sam-content-generation"
      }
    },
    {
      "name": "Generate Content",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "messages": {
          "values": [
            {"role": "user", "content": "={{$json.prompt}}"}
          ]
        }
      }
    },
    {
      "name": "Post to LinkedIn",
      "type": "n8n-nodes-base.linkedIn"
    },
    {
      "name": "Notify SAM",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://sam-ai.yourdomain.com/n8n/callback",
        "sendBody": true,
        "jsonBody": "={\"status\": \"completed\", \"result\": \"{{$json.post_url}}\"}"
      }
    }
  ]
}
```

---

## 📂 Workflow Organization

### Storage Location

**Your Workflows (Local):**
```
C:\Users\total\n8n-workflows\
├── content-generation.json
├── lead-scoring.json
├── social-media-publisher.json
└── sam-ai-integration.json
```

**Future: GitHub Repository (User manages):**
```
/n8n-workflows/
├── README.md
├── production/
│   ├── content-generation.json
│   └── lead-scoring.json
├── development/
│   └── experimental-workflow.json
└── templates/
    └── webhook-template.json
```

---

### Workflow Naming Convention

**Format:** `{purpose}-{version}.json`

**Examples:**
- `sam-content-generation-v1.json`
- `odoo-lead-scoring-v2.json`
- `linkedin-publisher-v1.json`
- `webhook-test-template.json`

---

## 📊 Workflow Inventory (Document as You Go)

### Template

```markdown
# N8N Workflow Inventory

## Production Workflows

### 1. SAM Content Generation
- **File:** sam-content-generation-v1.json
- **Purpose:** Generate marketing content via SAM AI trigger
- **Trigger:** Webhook (POST /webhook/sam-content-generation)
- **Nodes:** 5 (Webhook → OpenAI → LinkedIn → Notify → Log)
- **Status:** ✅ Active
- **Created:** 2025-11-12
- **Last Updated:** 2025-11-12

### 2. Lead Scoring
- **File:** odoo-lead-scoring-v1.json
- **Purpose:** Score leads using AI, update Odoo
- **Trigger:** Webhook (POST /webhook/lead-scoring)
- **Nodes:** 4 (Webhook → OpenAI → HTTP Request → Google Sheets)
- **Status:** ✅ Active
- **Created:** 2025-11-12

## Development Workflows

### 3. Social Media Test
- **File:** social-media-test-v1.json
- **Purpose:** Test multi-platform posting
- **Trigger:** Manual
- **Status:** 🔄 Testing

## Templates

### 4. Webhook Template
- **File:** webhook-template.json
- **Purpose:** Standard webhook → process → respond template
- **Usage:** Copy this for new webhook workflows
```

**Location:** `C:\Users\total\n8n-workflows\INVENTORY.md`

---

## 🔐 Security & Credentials

### Credential Management

**Your Role:**
- ✅ Reference credentials in workflow JSON
- ✅ Document which credentials are needed
- ❌ Never hardcode credentials
- ❌ Never create/modify credentials (user does this in N8N UI)

**Example Documentation:**
```markdown
## Workflow: SAM Content Generation

**Credentials Required:**
1. **OpenAI API** (Type: openAiApi)
   - Name: "Our Common Open AI Credential"
   - Used by: "Generate Content" node

2. **LinkedIn OAuth** (Type: linkedInOAuth2Api)
   - Name: "SAM LinkedIn Account"
   - Used by: "Post to LinkedIn" node

3. **HTTP Header Auth** (Type: httpHeaderAuth)
   - Name: "SAM API Credential"
   - Used by: "Notify SAM" node

**Setup Instructions:**
1. Import workflow
2. Configure each credential in N8N UI
3. Test workflow execution
```

---

## 🧪 Testing Integration

### Test N8N ↔ Odoo Integration

**Step 1: Test N8N Webhook (Isolated)**
```bash
curl -X POST https://n8n.yourdomain.com/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**Step 2: Test Odoo → N8N**
```python
# In Odoo shell (Developer runs this)
requests.post('https://n8n.yourdomain.com/webhook/test', json={'test': 'data'})
```

**Step 3: Test N8N → Odoo**
```bash
# Trigger N8N workflow that calls Odoo
curl -X POST https://n8n.yourdomain.com/webhook/trigger-odoo-test
```

**Step 4: Test Full Flow**
```
SAM AI → Odoo → N8N → Process → N8N → Odoo → SAM AI
```

---

## 🚀 Best Practices for SAM AI Integration

### 1. Webhook Naming Convention

**Format:** `/webhook/sam-ai-{purpose}`

**Examples:**
- `/webhook/sam-ai-content-generation`
- `/webhook/sam-ai-lead-scoring`
- `/webhook/sam-ai-campaign-trigger`

**Why:** Clearly identifies SAM-related workflows

---

### 2. Session ID Tracking

**For SAM Conversations:**
```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "sam-action"
  },
  "name": "SAM Webhook",
  "type": "n8n-nodes-base.webhook"
}
```

**Extract Session ID in Code Node:**
```javascript
const data = $input.first().json;
const sessionId = data.sessionId;  // From SAM

// Use session ID for context
return [{
  json: {
    sessionId: sessionId,
    result: 'processed'
  }
}];
```

**Return to SAM with Session ID:**
```json
{
  "parameters": {
    "url": "https://sam-ai.yourdomain.com/n8n/callback",
    "jsonBody": "={\"sessionId\": \"{{$json.sessionId}}\", \"result\": \"{{$json.result}}\"}"
  },
  "name": "Notify SAM"
}
```

---

### 3. Error Notification to Odoo

**Pattern:**
```
Any Node (continueOnFail: true)
  → IF (check for error)
    → True: HTTP Request (notify Odoo of error)
    → False: Continue
```

**Error Notification Node:**
```json
{
  "parameters": {
    "method": "POST",
    "url": "https://sam-ai.yourdomain.com/n8n/error",
    "jsonBody": "={\"workflow\": \"{{$workflow.name}}\", \"error\": \"{{$json.error}}\", \"timestamp\": \"{{$now}}\"}"
  },
  "name": "Notify Error",
  "type": "n8n-nodes-base.httpRequest"
}
```

---

### 4. Logging to Google Sheets

**Audit Trail for SAM:**
```json
{
  "parameters": {
    "operation": "append",
    "documentId": "your-sheet-id",
    "sheetName": "N8N Logs",
    "columns": {
      "mappingMode": "defineBelow",
      "value": {
        "Timestamp": "={{$now.format('YYYY-MM-DD HH:mm:ss')}}",
        "Workflow": "={{$workflow.name}}",
        "Session ID": "={{$json.sessionId}}",
        "Status": "={{$json.status}}",
        "Result": "={{$json.result}}"
      }
    }
  },
  "name": "Log Execution",
  "type": "n8n-nodes-base.googleSheets"
}
```

---

## 📚 Handoff Documentation Template

**When Delegating to Developer:**

```markdown
## N8N → Odoo Integration Requirements

**Workflow:** [Workflow Name]

**N8N Webhook URL:**
https://n8n.yourdomain.com/webhook/[webhook-path]

**Expected Payload from Odoo:**
```json
{
  "lead_id": 123,
  "email": "user@example.com",
  "score": 85,
  "sessionId": "optional-session-id"
}
```

**Odoo Endpoint Needed:**
- **Path:** /n8n/callback/[purpose]
- **Method:** POST
- **Payload N8N Will Send:**
```json
{
  "status": "success",
  "result": "data here",
  "sessionId": "same-session-id"
}
```

**Testing:**
1. Developer creates Odoo endpoint
2. Test with curl: `curl -X POST [odoo-endpoint] -d '{"test":"data"}'`
3. Verify N8N workflow receives data
4. Verify Odoo receives callback
```

---

## 🎯 Success Metrics

**You've Integrated Successfully When:**
- ✅ Workflows reference correct webhook endpoints
- ✅ Developer has clear requirements for Odoo endpoints
- ✅ Session IDs track correctly (SAM → N8N → SAM)
- ✅ Error notifications reach Odoo
- ✅ Execution logs are auditable
- ✅ Testing is straightforward (curl examples provided)

---

**Version:** 1.0
**Last Updated:** 2025-11-12
**Your Role:** N8N Workflow Expert in SAM AI Ecosystem
