# n8n-expert Knowledge Base

> Consolidated knowledge for the n8n-expert Agent
> Source: n8n-expert/
> Generated: 2026-01-28
>
> Original files:
> - n8n_debugging_guide.md
> - n8n_expert_protocol.md
> - n8n_integration.md
> - n8n_json_reference.md
> - n8n_workflow_mastery.md

---

## 1. N8N Debugging Guide

# N8N Debugging Guide

**Purpose:** Troubleshooting, validation, and quality standards for N8N workflows.

---

## 🚨 Common Errors Catalog

### Error 1: JSON Syntax Error

**Symptoms:**
- Workflow doesn't import
- Error: "Unexpected token" or "Invalid JSON"

**Causes:**
```json
// ❌ Missing comma
{
  "name": "Node"
  "type": "n8n-nodes-base.webhook"
}

// ❌ Trailing comma
{
  "name": "Node",
  "type": "webhook",
}

// ❌ Unquoted key
{
  name: "Node"
}

// ❌ Single quotes (must be double quotes)
{
  'name': 'Node'
}
```

**Fix:**
```json
// ✅ Correct syntax
{
  "name": "Node",
  "type": "n8n-nodes-base.webhook"
}
```

**Validation:**
```bash
# Validate JSON syntax
python -m json.tool workflow.json

# Or use online validator: jsonlint.com
```

---

### Error 2: Duplicate Node IDs

**Symptoms:**
- Workflow imports but behaves unpredictably
- Nodes overwrite each other
- Execution jumps unexpectedly

**Cause:**
```json
{
  "nodes": [
    {
      "id": "node-001",  // ❌ Duplicate ID
      "name": "Node A"
    },
    {
      "id": "node-001",  // ❌ Same ID
      "name": "Node B"
    }
  ]
}
```

**Fix:**
```json
{
  "nodes": [
    {
      "id": "node-001",  // ✅ Unique ID
      "name": "Node A"
    },
    {
      "id": "node-002",  // ✅ Unique ID
      "name": "Node B"
    }
  ]
}
```

**Detection:**
```javascript
// Check for duplicate IDs
const ids = nodes.map(n => n.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length > 0) {
  console.log("Duplicate IDs:", duplicates);
}
```

---

### Error 3: Invalid Connection References

**Symptoms:**
- Workflow imports but nodes aren't connected
- Error: "Node not found" during execution

**Cause:**
```json
{
  "nodes": [
    {"name": "Node A"},
    {"name": "Node B"}
  ],
  "connections": {
    "Node A": {
      "main": [[
        {
          "node": "Node C",  // ❌ Node C doesn't exist
          "type": "main",
          "index": 0
        }
      ]]
    }
  }
}
```

**Fix:**
```json
{
  "connections": {
    "Node A": {
      "main": [[
        {
          "node": "Node B",  // ✅ Node B exists
          "type": "main",
          "index": 0
        }
      ]]
    }
  }
}
```

**Detection:**
```javascript
// Verify all connection references exist
const nodeNames = nodes.map(n => n.name);
for (const [source, connection] of Object.entries(connections)) {
  if (!nodeNames.includes(source)) {
    console.log("Invalid source:", source);
  }
  connection.main.forEach(outputs => {
    outputs.forEach(output => {
      if (!nodeNames.includes(output.node)) {
        console.log("Invalid destination:", output.node);
      }
    });
  });
}
```

---

### Error 4: Missing Credentials

**Symptoms:**
- Node shows "Credentials required" error
- Workflow can't execute

**Cause:**
```json
{
  "parameters": {
    "operation": "create"
  },
  "type": "n8n-nodes-base.googleSheets",
  // ❌ Missing credentials
}
```

**Fix:**
```json
{
  "parameters": {
    "operation": "create"
  },
  "type": "n8n-nodes-base.googleSheets",
  "credentials": {
    "googleSheetsOAuth2Api": {
      "id": "credential-id",
      "name": "Google Sheets Account"
    }
  }
}
```

**Note:** User must configure credentials in N8N UI after import.

---

### Error 5: Expression Syntax Error

**Symptoms:**
- Node shows "[ERROR: Expression]" in output
- Data not flowing correctly

**Common Mistakes:**
```javascript
// ❌ Missing equals signs
{ "content": "{{$json.field}}" }

// ❌ Missing curly braces
{ "content": "=$json.field" }

// ❌ Wrong variable name
{ "content": "={{$data.field}}" }  // Should be $json

// ❌ Undefined field
{ "content": "={{$json.nonExistentField}}" }
```

**Fix:**
```javascript
// ✅ Correct expression syntax
{ "content": "={{$json.field}}" }

// ✅ With fallback
{ "content": "={{$json.field || 'default'}}" }

// ✅ Nested access
{ "content": "={{$json.user.email}}" }

// ✅ String interpolation
{ "content": "Hello ={{$json.name}}!" }
```

---

### Error 6: TypeVersion Mismatch

**Symptoms:**
- Node doesn't have expected parameters
- Features missing
- Import warnings

**Cause:**
```json
{
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 1  // ❌ Old version, missing features
}
```

**Fix:**
```json
{
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 3  // ✅ Latest version (as of 2025)
}
```

**Common TypeVersions:**
- `webhook`: 1
- `httpRequest`: 3
- `code`: 1
- `googleSheets`: 4
- `switch`: 3
- `@n8n/n8n-nodes-langchain.openAi`: 2

---

### Error 7: Hardcoded Credentials

**Symptoms:**
- Security vulnerability
- Credentials exposed in JSON
- Workflow not portable

**Cause:**
```json
{
  "parameters": {
    "url": "https://api.example.com",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Authorization",
          "value": "Bearer sk-abc123xyz"  // ❌ Hardcoded API key
        }
      ]
    }
  }
}
```

**Fix:**
```json
{
  "parameters": {
    "url": "https://api.example.com",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "httpHeaderAuth"
  },
  "credentials": {
    "httpHeaderAuth": {
      "id": "credential-id",  // ✅ Reference credential
      "name": "API Credential"
    }
  }
}
```

---

### Error 8: Infinite Loop

**Symptoms:**
- Workflow never completes
- High CPU usage
- Execution timeout

**Cause:**
```json
// ❌ Code node with infinite loop
{
  "parameters": {
    "jsCode": "while(true) { /* no exit condition */ }"
  }
}
```

**Fix:**
```javascript
// ✅ Add loop limit
let count = 0;
const maxIterations = 1000;

while(condition && count < maxIterations) {
  // Process
  count++;
}

// ✅ Or use array.map() instead of loops
const results = items.map(item => processItem(item));
```

---

### Error 9: Large Payload Timeout

**Symptoms:**
- Node times out
- Error: "Request timeout"
- Large data processing fails

**Cause:**
```json
{
  "parameters": {
    "url": "https://api.example.com",
    "options": {
      "timeout": 10000  // ❌ 10s timeout too short for large data
    }
  }
}
```

**Fix:**
```json
{
  "parameters": {
    "url": "https://api.example.com",
    "options": {
      "timeout": 60000  // ✅ 60s timeout for large payloads
    }
  }
}
```

---

### Error 10: Missing Error Handling

**Symptoms:**
- Workflow stops on first error
- No error notification
- Can't debug failures

**Cause:**
```json
{
  "parameters": {
    "url": "https://api.example.com"
  },
  // ❌ No error handling
  "type": "n8n-nodes-base.httpRequest"
}
```

**Fix:**
```json
{
  "parameters": {
    "url": "https://api.example.com"
  },
  "type": "n8n-nodes-base.httpRequest",
  "continueOnFail": true  // ✅ Continue on error
}
```

**Add Error Handler:**
```
HTTP Request (continueOnFail: true)
  → IF Node (check if error exists)
    → True: Send Error Notification
    → False: Continue Processing
```

---

## ✅ Debugging Checklist

### Pre-Import Validation

**JSON Syntax:**
- ☐ Valid JSON (no syntax errors)
- ☐ All strings double-quoted
- ☐ No trailing commas
- ☐ All brackets/braces closed

**Node Structure:**
- ☐ All nodes have required fields: `parameters`, `id`, `name`, `type`, `typeVersion`, `position`
- ☐ All node IDs are unique
- ☐ All node names are descriptive (not "Node 1", "Node 2")
- ☐ All positions are logical (left to right)

**Connections:**
- ☐ All source node names exist in `nodes` array
- ☐ All destination node names exist in `nodes` array
- ☐ Node names match exactly (case-sensitive)
- ☐ No orphaned nodes (except trigger)

**Credentials:**
- ☐ No hardcoded credentials (API keys, tokens)
- ☐ All credentials referenced by ID or name
- ☐ Credential types match node requirements

**Expressions:**
- ☐ All expressions use correct syntax: `={{...}}`
- ☐ Field references are valid: `$json.fieldName`
- ☐ No undefined variable references
- ☐ String interpolation formatted correctly

**TypeVersions:**
- ☐ TypeVersions match current N8N version
- ☐ No deprecated node types

---

### Post-Import Validation

**In N8N UI:**
- ☐ Workflow imports without errors
- ☐ All nodes appear on canvas
- ☐ Connections are visible
- ☐ No "Missing credentials" warnings (or user configures)
- ☐ Canvas layout looks correct

---

### Execution Testing

**Manual Execution:**
- ☐ Workflow executes without errors
- ☐ All nodes show green checkmarks
- ☐ Data flows correctly between nodes
- ☐ Output data matches expectations

**Error Testing:**
- ☐ Test with invalid input (should handle gracefully)
- ☐ Test with missing fields (should have fallbacks)
- ☐ Test API failures (should continue or notify)

**Performance Testing:**
- ☐ Execution completes within expected time
- ☐ No timeout errors
- ☐ Large datasets process successfully

---

## 🎯 Quality Standards

### What "Good" Looks Like

**✅ Excellent Workflow:**
```json
{
  "name": "Descriptive Workflow Name",
  "nodes": [
    {
      "parameters": {/* well-configured */},
      "id": "unique-uuid-here",
      "name": "Clear Descriptive Name",
      "type": "n8n-nodes-base.nodetype",
      "typeVersion": 3,  // Latest version
      "position": [300, 300],  // Logical spacing
      "continueOnFail": true,  // Error handling
      "notes": "What this node does"  // Documentation
    }
  ],
  "connections": {/* clean, logical */},
  "active": false,
  "settings": {"executionOrder": "v1"},
  "tags": ["category", "purpose"]
}
```

**Characteristics:**
1. **Clear naming** - "Generate Article Content" not "OpenAI"
2. **Error handling** - continueOnFail on external APIs
3. **Documentation** - Notes on complex nodes
4. **Credentials** - Referenced, not hardcoded
5. **Expressions** - Clean, readable, with fallbacks
6. **Layout** - Logical left-to-right flow
7. **Validation** - All fields properly configured

---

### What "Bad" Looks Like

**❌ Poor Workflow:**
```json
{
  "name": "Workflow",
  "nodes": [
    {
      "parameters": {},
      "id": "1",  // ❌ Non-unique ID
      "name": "Node",  // ❌ Generic name
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,  // ❌ Outdated version
      "position": [0, 0]  // ❌ All nodes same position
      // ❌ No error handling
      // ❌ No documentation
    }
  ],
  "connections": {}  // ❌ No connections
}
```

**Problems:**
1. Generic names ("Node", "Workflow")
2. Non-unique or sequential IDs ("1", "2", "3")
3. No error handling
4. No documentation
5. Outdated typeVersions
6. Poor layout (overlapping nodes)
7. Missing connections
8. No credential management

---

## 🛠️ Debugging Workflow

### Step 1: Identify Error Location

**From N8N UI:**
1. Run workflow
2. Note which node shows red X
3. Click node
4. View error in bottom panel

**From JSON:**
1. Validate JSON syntax first
2. Check node structure
3. Verify connections
4. Validate expressions

---

### Step 2: Isolate Issue

**Test Individual Nodes:**
1. Disconnect problematic node
2. Add Manual Trigger before it
3. Provide test data manually
4. Execute single node

**Binary Search:**
1. Disable half the workflow
2. Test which half fails
3. Narrow down to specific node

---

### Step 3: Fix Root Cause

**JSON Syntax:**
- Use JSON validator
- Check commas, quotes, brackets

**Node Config:**
- Verify all required parameters
- Check typeVersion
- Validate credential reference

**Expression:**
- Test in Code node first
- Log output: `console.log($json)`
- Add fallbacks: `{{$json.field || 'default'}}`

**Connection:**
- Verify node names match exactly
- Check source and destination exist
- Ensure proper array structure

---

### Step 4: Validate Fix

**Re-test:**
1. Import updated workflow
2. Execute with test data
3. Verify all nodes succeed
4. Check output data

**Regression Test:**
1. Test with various inputs
2. Test error scenarios
3. Test edge cases

---

## 📊 Common Debug Commands

### Validate JSON
```bash
# Python
python -m json.tool workflow.json

# Node.js
node -e "JSON.parse(require('fs').readFileSync('workflow.json'))"

# jq (if installed)
jq . workflow.json
```

### Find Duplicate IDs
```javascript
// In Code node or external script
const ids = nodes.map(n => n.id);
const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
console.log("Duplicates:", duplicates);
```

### Verify Connections
```javascript
// Check all connection references are valid
const nodeNames = new Set(nodes.map(n => n.name));

Object.entries(connections).forEach(([source, conn]) => {
  if (!nodeNames.has(source)) {
    console.log(`Invalid source: ${source}`);
  }

  conn.main?.forEach((outputs, i) => {
    outputs.forEach(output => {
      if (!nodeNames.has(output.node)) {
        console.log(`Invalid dest: ${output.node} from ${source}`);
      }
    });
  });
});
```

### Test Expression
```javascript
// Add Code node with test data
const testData = {
  json: {
    field: "test",
    user: {email: "test@example.com"}
  }
};

// Test your expression
const result = testData.json.user.email;  // Should work
console.log(result);

return [{json: {result}}];
```

---

## 🚀 Performance Optimization

### Batch vs. Loop

**❌ Slow (Loop):**
```javascript
for (let i = 0; i < items.length; i++) {
  // Process one at a time
  const result = processItem(items[i]);
}
```

**✅ Fast (Batch):**
```javascript
const results = items.map(item => processItem(item));
return results;
```

---

### Reduce API Calls

**❌ Multiple calls:**
```
For Each Item:
  → HTTP Request (call API)  // 100 items = 100 API calls
```

**✅ Batch request:**
```
Aggregate Items
  → HTTP Request (batch API call)  // 100 items = 1 API call
```

---

### Cache Results

**Use N8N's caching:**
```json
{
  "parameters": {
    "url": "https://api.example.com/data",
    "options": {
      "useCache": true,
      "cacheTTL": 3600  // Cache for 1 hour
    }
  }
}
```

---

### Set Reasonable Timeouts

**Default timeout:** 10 seconds
**Large data:** 30-60 seconds
**File uploads:** 120+ seconds

```json
{
  "parameters": {
    "options": {
      "timeout": 60000  // 60 seconds
    }
  }
}
```

---

## 🔒 Security Best Practices

### 1. Never Hardcode Credentials
```json
// ❌ NEVER DO THIS
{"value": "Bearer sk-abc123xyz"}

// ✅ ALWAYS DO THIS
{"credentials": {"apiKey": {"id": "cred-id"}}}
```

---

### 2. Validate Webhook Inputs
```javascript
// In Code node after webhook
const items = $input.all();

const validated = items.map(item => {
  const data = item.json;

  // Validate required fields
  if (!data.email || !data.name) {
    throw new Error("Missing required fields");
  }

  // Sanitize inputs
  const sanitized = {
    email: String(data.email).trim().toLowerCase(),
    name: String(data.name).trim()
  };

  return {json: sanitized};
});

return validated;
```

---

### 3. Use HTTPS Only
```json
{
  "parameters": {
    "url": "https://api.example.com"  // ✅ HTTPS
    // NOT "http://..."  // ❌ HTTP
  }
}
```

---

### 4. Limit Execution Rate
```json
{
  "settings": {
    "executionTimeout": 300,  // 5 minutes max
    "maxExecutions": 100      // Max 100 concurrent
  }
}
```

---

## 📚 Anti-Patterns

### 1. God Workflow
**❌ Problem:** One workflow does everything (50+ nodes)
**✅ Solution:** Break into smaller workflows

---

### 2. No Error Handling
**❌ Problem:** Workflow stops on first error
**✅ Solution:** Add `continueOnFail: true` and error handlers

---

### 3. Generic Names
**❌ Problem:** "Node 1", "Node 2", "HTTP Request"
**✅ Solution:** "Fetch User Data", "Send Welcome Email"

---

### 4. Copy-Paste Credentials
**❌ Problem:** API keys pasted in node parameters
**✅ Solution:** Use N8N credential management

---

### 5. Ignoring TypeVersions
**❌ Problem:** Using old typeVersion (missing features)
**✅ Solution:** Always use latest typeVersion

---

### 6. No Logging
**❌ Problem:** Can't debug production failures
**✅ Solution:** Add Google Sheets logging node

---

### 7. Tight Coupling
**❌ Problem:** Workflows call each other excessively
**✅ Solution:** Use webhooks or queues for decoupling

---

## 🎓 Learning from Errors

**Document fixes in workflow notes:**
```json
{
  "notes": "Fixed: Increased timeout to 60s (was timing out with large payloads)\nFixed: Added continueOnFail to handle API rate limits\nFixed: Sanitized email input (was causing validation errors)"
}
```

**Build error library:**
- Track common errors
- Document solutions
- Share with team

---

**Version:** 1.0
**Last Updated:** 2025-11-12
**Purpose:** Debug and optimize N8N workflows

---

## 2. N8N Expert Protocol

# N8N Expert Protocol

**Purpose:** Your operational workflow for building and diagnosing N8N workflows.

---

## 🎯 Your Mission

You are the **N8N Workflow Expert**. You build new workflows, diagnose issues, and optimize existing workflows.

**Core Competencies:**
- ✅ Build N8N workflows from scratch (JSON)
- ✅ Diagnose and fix workflow issues
- ✅ Suggest optimal node types
- ✅ Write Code node JavaScript
- ✅ Design connection patterns
- ✅ Work collaboratively (pair programming)

**Boundaries:**
- ❌ Don't deploy to production (user imports manually)
- ❌ Don't modify credentials (security risk)
- ❌ Don't build Odoo integrations (delegate to `/developer`)
- ❌ Don't make strategy decisions (delegate to `/cto`)

---

## 📋 The 7-Phase Workflow

### Phase 1: Discovery 🔍

**Goal:** Understand what the user needs

**Actions:**
1. **Read user request carefully**
   - Building new workflow OR fixing existing?
   - What's the trigger? (webhook, schedule, manual)
   - What's the goal? (output, action, integration)

2. **Ask clarifying questions:**
   ```
   Q: What triggers this workflow? (webhook, schedule, manual)
   Q: What data do you have at the start?
   Q: What's the desired output?
   Q: Any integrations needed? (Google Sheets, APIs, social media)
   Q: Do you have an existing workflow JSON to fix?
   ```

3. **Identify workflow type:**
   - **Simple Linear:** Trigger → Process → Output
   - **Branching:** Trigger → Process → [Multiple Outputs]
   - **AI-Powered:** Trigger → AI → Transform → Output
   - **Integration:** Trigger → Fetch → Transform → Store
   - **Error Handling:** Any → Check → [Success/Error paths]

**Deliverable:**
```markdown
## Discovery Summary

**Workflow Type:** [Simple/Branching/AI-Powered/Integration]
**Trigger:** [Webhook/Schedule/Manual]
**Input Data:** [Description]
**Processing Steps:** [List 3-5 steps]
**Output:** [Where data goes]
**Integrations:** [List any external services]
```

---

### Phase 2: Diagnosis OR Design 🎨

#### IF FIXING EXISTING WORKFLOW:

**Diagnosis Actions:**
1. **Read the workflow JSON** (user provides file path)
2. **Validate JSON syntax:**
   ```bash
   # Check if valid JSON
   python -m json.tool workflow.json
   ```
3. **Check structure:**
   - ☐ All nodes have unique IDs?
   - ☐ All connections reference existing nodes?
   - ☐ All credentials referenced correctly?
   - ☐ TypeVersions match node capabilities?
   - ☐ Expression syntax correct?

4. **Identify the issue:**
   - JSON syntax error (missing comma, bracket)
   - Node ID conflict (duplicate ID)
   - Invalid connection (references non-existent node)
   - Missing credential
   - Expression error
   - TypeVersion mismatch

**Deliverable:**
```markdown
## Diagnosis Report

**Issue Type:** [JSON syntax/Node config/Connection/Credential/Expression]
**Location:** Node "[Node Name]" (line X in JSON)
**Problem:** [Specific description]
**Fix:** [What needs to change]
```

---

#### IF BUILDING NEW WORKFLOW:

**Design Actions:**
1. **Choose nodes for each step:**
   - Trigger: Webhook/Schedule/Manual?
   - AI: OpenAI/HTTP Request (custom AI)?
   - Logic: IF/Switch/Merge?
   - Integration: Google Sheets/YouTube/LinkedIn?
   - Code: Need custom transformation?

2. **Design connection flow:**
   ```
   [Node 1] → [Node 2] → [Node 3]
                ↓
              [Branch 1]
              [Branch 2]
   ```

3. **Plan data transformations:**
   - What expressions needed? (`={{$json.field}}`)
   - Any Code nodes for complex logic?

**Deliverable:**
```markdown
## Workflow Design

**Nodes Required:**
1. [Trigger Type] - [Purpose]
2. [Processing Node] - [Purpose]
3. [Output Node] - [Purpose]

**Connection Flow:**
[ASCII diagram of flow]

**Data Transformations:**
- Step 1: [Expression or Code]
- Step 2: [Expression or Code]
```

---

### Phase 3: Implementation 🔧

**Goal:** Build or fix the workflow JSON

**Actions:**

1. **Create base workflow structure:**
   ```json
   {
     "name": "Descriptive Workflow Name",
     "nodes": [],
     "connections": {},
     "active": false,
     "settings": {
       "executionOrder": "v1"
     }
   }
   ```

2. **Add nodes one by one:**
   - Start with trigger
   - Add processing nodes
   - Add output nodes
   - Assign unique IDs (UUIDs preferred)
   - Set positions (300px horizontal spacing)

3. **Configure node parameters:**
   - Use expressions for dynamic data: `={{$json.field}}`
   - Reference credentials by ID or name
   - Set typeVersion correctly
   - Add error handling (`continueOnFail: true` for external APIs)

4. **Build connections object:**
   - Map node names to next nodes
   - Handle branching (multiple outputs)
   - Verify all node names match exactly

5. **Add metadata:**
   - Descriptive workflow name
   - Tags (optional)
   - Notes for complex nodes

**Code Node Template:**
```javascript
// Access input data
const items = $input.all();

// Process data
const processed = items.map(item => {
  const data = item.json;

  // Your transformation logic here
  return {
    json: {
      // Output structure
      field1: data.inputField1,
      field2: data.inputField2.toUpperCase(),
      timestamp: new Date().toISOString()
    }
  };
});

// Return processed items
return processed;
```

**Deliverable:**
- Complete workflow JSON file
- File saved to: `C:\Users\total\n8n-workflows\{workflow-name}.json`

---

### Phase 4: Validation ✅

**Goal:** Ensure workflow is error-free

**Validation Checklist:**

**JSON Syntax:**
- ☐ Valid JSON (no syntax errors)
- ☐ All strings properly quoted
- ☐ All brackets/braces closed
- ☐ No trailing commas

**Node Structure:**
- ☐ All nodes have unique IDs
- ☐ All nodes have `parameters`, `id`, `name`, `type`, `typeVersion`, `position`
- ☐ Node names are descriptive (not "Node 1", "Node 2")
- ☐ Positions are logical (left to right flow)

**Connections:**
- ☐ All source nodes exist in `nodes` array
- ☐ All destination nodes exist in `nodes` array
- ☐ Node names in connections match exactly (case-sensitive)
- ☐ No orphaned nodes (all nodes connected except trigger)

**Credentials:**
- ☐ Credentials referenced by ID or name (not hardcoded)
- ☐ Credential types match node requirements

**Expressions:**
- ☐ All expressions use valid syntax: `={{...}}`
- ☐ Field references are correct: `$json.fieldName`
- ☐ No undefined variable references

**Type Versions:**
- ☐ TypeVersions match node capabilities (check n8n_workflow_mastery.md)

**Deliverable:**
```markdown
## Validation Report

✅ JSON Syntax: Valid
✅ Node Structure: 5 nodes, all valid
✅ Connections: 4 connections, all valid
✅ Credentials: 2 referenced, valid
✅ Expressions: 3 expressions, valid
✅ TypeVersions: All correct

**Status:** READY FOR IMPORT
```

---

### Phase 5: Testing Guidance 🧪

**Goal:** Help user test the workflow

**Testing Instructions:**

1. **Import Workflow:**
   ```markdown
   1. Open N8N instance
   2. Click "Import" button (top right)
   3. Select file: [workflow-name].json
   4. Workflow will appear on canvas
   ```

2. **Configure Credentials:**
   ```markdown
   If workflow shows "Missing credentials" warnings:
   1. Click on node with warning
   2. Click "Credentials" dropdown
   3. Select existing credential OR create new
   4. Save workflow
   ```

3. **Test Execution:**

   **For Webhook Trigger:**
   ```bash
   # Get webhook URL from N8N (click webhook node)
   # Test with curl:
   curl -X POST https://n8n.yourdomain.com/webhook/your-webhook \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

   **For Manual Trigger:**
   ```markdown
   1. Click "Execute Workflow" button (top bar)
   2. Check execution results (bottom panel)
   3. Verify each node executed successfully
   ```

   **For Schedule Trigger:**
   ```markdown
   1. Activate workflow (toggle switch)
   2. Wait for scheduled time OR
   3. Manually trigger for testing
   ```

4. **Check Node Outputs:**
   ```markdown
   After execution:
   1. Click each node
   2. View "OUTPUT" tab (right panel)
   3. Verify data structure matches expectations
   ```

5. **Debug Errors:**
   ```markdown
   If node shows error:
   1. Click node
   2. View error message (bottom panel)
   3. Common fixes:
      - Missing credential
      - Invalid expression syntax
      - API timeout (increase timeout in node settings)
      - Invalid API response (check API endpoint)
   ```

**Expected Results:**
```markdown
## Expected Test Results

**Webhook URL:** [Display URL after import]

**Sample Request:**
[Provide curl example or JSON payload]

**Expected Output:**
[Describe what should happen at each node]

**Success Criteria:**
- ☐ All nodes execute without errors
- ☐ Data flows correctly between nodes
- ☐ Final output matches requirements
```

---

### Phase 6: Optimization ⚡ (Optional)

**Goal:** Improve workflow performance and reliability

**Optimization Opportunities:**

1. **Error Handling:**
   - Add `continueOnFail: true` to external API nodes
   - Add IF node to check for errors: `={{$json.error !== undefined}}`
   - Route errors to notification node (email, Slack, etc.)

2. **Performance:**
   - **Batch processing:** Use batch operations instead of loops
   - **Reduce API calls:** Cache data when possible
   - **Timeout settings:** Set reasonable timeouts (30-60s)
   - **Execution order:** Use v2 for large datasets (1000+ items)

3. **Logging:**
   - Add Google Sheets node to log executions
   - Log: timestamp, input, output, status, errors
   - Useful for debugging and auditing

4. **Code Optimization:**
   ```javascript
   // ❌ Inefficient
   for (let i = 0; i < items.length; i++) {
     // Process one at a time
   }

   // ✅ Efficient
   const processed = items.map(item => {
     // Batch process all items
   });
   ```

**Deliverable:**
```markdown
## Optimization Suggestions

1. **Error Handling:** Add error notification to [Node Name]
2. **Performance:** Increase timeout on [Node Name] to 60s
3. **Logging:** Add execution log to Google Sheets
4. **Code:** Optimize [Node Name] transformation (2x faster)

**Priority:** [High/Medium/Low]
**Estimated Impact:** [Time saved / errors prevented]
```

---

### Phase 7: Handover 📦

**Goal:** Deliver workflow and documentation to user

**Handover Package:**

1. **Workflow File:**
   - Location: `C:\Users\total\n8n-workflows\{workflow-name}.json`
   - Ready to import into N8N

2. **Documentation:**
   ```markdown
   # [Workflow Name]

   ## Purpose
   [What this workflow does]

   ## Trigger
   [Webhook/Schedule/Manual + details]

   ## Nodes
   1. [Node Name] - [Purpose]
   2. [Node Name] - [Purpose]
   ...

   ## Configuration Required
   - Credentials: [List credentials needed]
   - Settings: [Any custom settings]

   ## Testing
   [How to test - see Phase 5]

   ## Expected Output
   [What happens when workflow runs]

   ## Troubleshooting
   - Issue: [Common issue]
     Fix: [Solution]
   ```

3. **Import Instructions:**
   ```markdown
   ## Import to N8N

   1. Open your N8N instance
   2. Click "Import" (top right)
   3. Select file: [workflow-name].json
   4. Configure credentials (if needed)
   5. Test execution
   6. Activate workflow (if ready for production)
   ```

4. **Next Steps:**
   ```markdown
   ## Next Steps

   1. Import workflow to N8N
   2. Configure credentials
   3. Test with sample data
   4. Review output
   5. Activate workflow (if satisfied)

   ## Follow-Up Support
   - Need changes? Invoke `/n8n` again with workflow file
   - Need strategy? Invoke `/cto` for automation strategy
   - Need Odoo integration? Invoke `/developer` for webhook endpoints
   ```

**Deliverable:**
- ✅ Workflow JSON file
- ✅ Documentation (markdown)
- ✅ Import instructions
- ✅ Testing guidance
- ✅ Next steps clear

---

## 🤝 Collaboration Patterns

### Working with User (Pair Programming)

**Ask for Feedback:**
```markdown
I've designed the workflow with 5 nodes:
[Show design]

Does this match your vision?
Would you like me to:
- A) Proceed with implementation
- B) Adjust the design
- C) Explain any node choices
```

**Show Progress:**
```markdown
✅ Phase 1: Discovery complete
✅ Phase 2: Design complete
🔄 Phase 3: Implementation in progress (3/5 nodes built)
⏳ Phase 4: Validation pending
⏳ Phase 5: Testing guidance pending
```

**Explain Decisions:**
```markdown
I chose OpenAI node over HTTP Request because:
- Simpler configuration
- Built-in credential management
- Better error handling

Alternative: If you need Claude specifically, we'd use HTTP Request to Anthropic API.
```

---

## 🚨 When to Delegate

### Delegate to `/cto`
**Trigger:** User asks strategy questions
**Examples:**
- "Should we use N8N or build custom?"
- "How do we scale this workflow?"
- "What's the best architecture for automation?"

**Your Response:**
```markdown
This is a strategic decision. Let me delegate to the CTO.

[Invoke /cto with context]

Once the CTO provides strategy, I'll implement the N8N workflow.
```

---

### Delegate to `/developer`
**Trigger:** Need Odoo integration (webhooks, API endpoints)
**Examples:**
- "Create webhook endpoint in Odoo"
- "Build Odoo controller that triggers N8N"
- "Integrate N8N with SAM AI module"

**Your Response:**
```markdown
This requires Odoo development. Let me delegate to the Developer.

I've designed the N8N workflow that expects:
- Webhook URL: /n8n/trigger/lead-scoring
- Payload: {lead_id, email, score}

Developer will create the Odoo endpoint that sends this data.
```

---

### Delegate to `/mod_sam`
**Trigger:** SAM AI module-specific integration
**Examples:**
- "Integrate workflow with ai_sam_workflows module"
- "Store workflow metadata in Odoo"

**Your Response:**
```markdown
This involves the SAM AI module infrastructure. Let me delegate to /mod_sam.

I've built the N8N workflow. The mod_sam agent will handle Odoo module integration.
```

---

## 🎯 Success Criteria

You've succeeded when:
- ✅ Workflow JSON is valid and imports without errors
- ✅ User understands how to test the workflow
- ✅ All nodes are properly configured
- ✅ Connections flow logically
- ✅ Documentation is clear
- ✅ User knows next steps

You've FAILED when:
- ❌ JSON has syntax errors
- ❌ Workflow doesn't import
- ❌ Nodes are misconfigured
- ❌ User doesn't know how to test
- ❌ No documentation provided

---

## 💡 Tips for Excellence

1. **Be Descriptive:** Name nodes clearly ("Generate Article Content" not "OpenAI")
2. **Add Context:** Include notes for complex nodes
3. **Think Flow:** Visualize left-to-right data flow
4. **Test Thoroughly:** Validate every aspect before handover
5. **Document Well:** Future-you (or user) will thank you
6. **Ask Questions:** Better to clarify than assume
7. **Show Work:** Explain your node choices
8. **Stay in Role:** Build workflows, delegate strategy

---

**Version:** 1.0
**Last Updated:** 2025-11-12
**Your Role:** N8N Workflow Expert (`/n8n`)

---

## 3. N8N Integration

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

---

## 4. N8N Json Reference

# N8N JSON Reference Guide

**Purpose:** Quick-reference templates and examples for common N8N workflow patterns.

---

## 🏗️ Workflow Templates

### Minimal Workflow
```json
{
  "name": "My Workflow",
  "nodes": [],
  "connections": {},
  "active": false,
  "settings": {
    "executionOrder": "v1"
  }
}
```

### Complete Workflow Template
```json
{
  "name": "Complete Workflow Template",
  "nodes": [
    {
      "parameters": {},
      "id": "unique-node-id-1",
      "name": "Trigger Node",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [100, 300]
    },
    {
      "parameters": {},
      "id": "unique-node-id-2",
      "name": "Process Node",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [400, 300]
    },
    {
      "parameters": {},
      "id": "unique-node-id-3",
      "name": "Output Node",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [700, 300]
    }
  ],
  "connections": {
    "Trigger Node": {
      "main": [
        [
          {
            "node": "Process Node",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Node": {
      "main": [
        [
          {
            "node": "Output Node",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "v1.0.0",
  "meta": {
    "instanceId": "your-instance-id"
  },
  "id": "workflow-id",
  "tags": ["template", "reference"]
}
```

---

## 🎬 Node Templates

### Webhook Trigger (POST)
```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "webhook-name",
    "responseMode": "onReceived",
    "options": {}
  },
  "id": "webhook-trigger-001",
  "name": "Webhook Trigger",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1,
  "position": [100, 300],
  "webhookId": "unique-webhook-id"
}
```

**Usage:**
- Webhook URL: `https://n8n.yourdomain.com/webhook/webhook-name`
- Test: `curl -X POST [URL] -H "Content-Type: application/json" -d '{"key":"value"}'`

---

### Manual Trigger
```json
{
  "parameters": {},
  "id": "manual-trigger-001",
  "name": "Manual Trigger",
  "type": "n8n-nodes-base.manualTrigger",
  "typeVersion": 1,
  "position": [100, 300]
}
```

---

### Schedule Trigger (Daily at 9 AM)
```json
{
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "cronExpression",
          "expression": "0 9 * * *"
        }
      ]
    }
  },
  "id": "schedule-trigger-001",
  "name": "Daily 9 AM Trigger",
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1,
  "position": [100, 300]
}
```

**Cron Examples:**
- `0 9 * * *` - Every day at 9:00 AM
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 1` - Every Monday at midnight
- `*/15 * * * *` - Every 15 minutes

---

### OpenAI Node (Chat Completion)
```json
{
  "parameters": {
    "modelId": {
      "__rl": true,
      "value": "gpt-4",
      "mode": "list",
      "cachedResultName": "GPT-4"
    },
    "messages": {
      "values": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "={{$json.prompt}}"
        }
      ]
    },
    "options": {
      "temperature": 0.7,
      "maxTokens": 2000
    }
  },
  "id": "openai-node-001",
  "name": "Generate Content",
  "type": "@n8n/n8n-nodes-langchain.openAi",
  "typeVersion": 2,
  "position": [400, 300],
  "credentials": {
    "openAiApi": {
      "id": "your-credential-id",
      "name": "OpenAI Credential"
    }
  }
}
```

**Key Parameters:**
- `modelId.value`: "gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"
- `temperature`: 0.0 (deterministic) to 2.0 (creative)
- `maxTokens`: Response length limit

---

### Code Node (JavaScript)
```json
{
  "parameters": {
    "jsCode": "// Access input data\nconst items = $input.all();\n\n// Transform data\nconst transformed = items.map(item => ({\n  json: {\n    id: item.json.id,\n    processedAt: new Date().toISOString(),\n    result: item.json.value * 2\n  }\n}));\n\n// Return transformed items\nreturn transformed;"
  },
  "id": "code-node-001",
  "name": "Transform Data",
  "type": "n8n-nodes-base.code",
  "typeVersion": 1,
  "position": [400, 300]
}
```

**Common Code Patterns:**
```javascript
// Get all input items
const items = $input.all();

// Get first item
const firstItem = $input.first().json;

// Map/transform items
const transformed = items.map(item => ({
  json: {
    newField: item.json.oldField.toUpperCase()
  }
}));

// Filter items
const filtered = items.filter(item => item.json.status === 'active');

// Return single item
return [{json: {result: 'value'}}];

// Return multiple items
return transformed;
```

---

### HTTP Request Node (POST)
```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.example.com/endpoint",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Content-Type",
          "value": "application/json"
        },
        {
          "name": "Authorization",
          "value": "Bearer ={{$credentials.apiToken}}"
        }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={\n  \"field1\": \"{{$json.field1}}\",\n  \"field2\": {{$json.field2}}\n}",
    "options": {
      "timeout": 30000
    }
  },
  "id": "http-request-001",
  "name": "Call External API",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 3,
  "position": [400, 300]
}
```

**Methods:** GET, POST, PUT, DELETE, PATCH

---

### Google Sheets (Append Row)
```json
{
  "parameters": {
    "operation": "append",
    "documentId": {
      "__rl": true,
      "value": "your-sheet-id",
      "mode": "list"
    },
    "sheetName": {
      "__rl": true,
      "value": "Sheet1",
      "mode": "list"
    },
    "columns": {
      "mappingMode": "defineBelow",
      "value": {
        "Timestamp": "={{$now.format('YYYY-MM-DD HH:mm:ss')}}",
        "Name": "={{$json.name}}",
        "Email": "={{$json.email}}",
        "Status": "={{$json.status}}"
      }
    },
    "options": {}
  },
  "id": "google-sheets-001",
  "name": "Log to Google Sheets",
  "type": "n8n-nodes-base.googleSheets",
  "typeVersion": 4,
  "position": [700, 300],
  "credentials": {
    "googleSheetsOAuth2Api": {
      "id": "your-credential-id",
      "name": "Google Sheets Account"
    }
  }
}
```

---

### Switch Node (Route by Condition)
```json
{
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict"
      },
      "conditions": [
        {
          "id": "condition-1",
          "leftValue": "={{$json.platform}}",
          "rightValue": "youtube",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        },
        {
          "id": "condition-2",
          "leftValue": "={{$json.platform}}",
          "rightValue": "linkedin",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        },
        {
          "id": "condition-3",
          "leftValue": "={{$json.platform}}",
          "rightValue": "twitter",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    }
  },
  "id": "switch-node-001",
  "name": "Platform Router",
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3,
  "position": [400, 300]
}
```

**Outputs:**
- Output 0: Condition 1 match (youtube)
- Output 1: Condition 2 match (linkedin)
- Output 2: Condition 3 match (twitter)
- Output 3: No match (fallback)

**Operators:**
- `equals`, `notEquals` (string)
- `contains`, `notContains` (string)
- `startsWith`, `endsWith` (string)
- `larger`, `largerEqual`, `smaller`, `smallerEqual` (number)
- `isEmpty`, `isNotEmpty` (any)

---

### IF Node (Simple True/False)
```json
{
  "parameters": {
    "conditions": {
      "number": [
        {
          "value1": "={{$json.age}}",
          "operation": "largerEqual",
          "value2": 18
        }
      ]
    }
  },
  "id": "if-node-001",
  "name": "Check Age",
  "type": "n8n-nodes-base.if",
  "typeVersion": 1,
  "position": [400, 300]
}
```

**Condition Types:**
- `boolean` - True/false checks
- `number` - Numeric comparisons
- `string` - String comparisons
- `dateTime` - Date/time comparisons

---

### Merge Node (Combine Data)
```json
{
  "parameters": {
    "mode": "append",
    "options": {}
  },
  "id": "merge-node-001",
  "name": "Merge Results",
  "type": "n8n-nodes-base.merge",
  "typeVersion": 2,
  "position": [700, 300]
}
```

**Modes:**
- `append` - Concatenate all items
- `mergeByPosition` - Merge items by index (item 0 + item 0, item 1 + item 1)
- `mergeByKey` - Merge items by matching key field

---

## 🔗 Connection Patterns

### Sequential (A → B → C)
```json
"connections": {
  "Node A": {
    "main": [
      [
        {
          "node": "Node B",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Node B": {
    "main": [
      [
        {
          "node": "Node C",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

---

### Branching (A → [B, C, D])
```json
"connections": {
  "Node A": {
    "main": [
      [
        {
          "node": "Node B",
          "type": "main",
          "index": 0
        },
        {
          "node": "Node C",
          "type": "main",
          "index": 0
        },
        {
          "node": "Node D",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

---

### Switch Routing (Multiple Outputs)
```json
"connections": {
  "Switch Node": {
    "main": [
      [
        {
          "node": "Path 1",
          "type": "main",
          "index": 0
        }
      ],
      [
        {
          "node": "Path 2",
          "type": "main",
          "index": 0
        }
      ],
      [
        {
          "node": "Path 3",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

---

### Merge Pattern (A + B → C)
```json
"connections": {
  "Node A": {
    "main": [
      [
        {
          "node": "Merge Node",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Node B": {
    "main": [
      [
        {
          "node": "Merge Node",
          "type": "main",
          "index": 1
        }
      ]
    ]
  },
  "Merge Node": {
    "main": [
      [
        {
          "node": "Node C",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

---

## 💬 Expression Examples

### Date/Time Expressions
```javascript
={{$now}}                                    // Current timestamp
={{$now.format('YYYY-MM-DD')}}               // 2025-11-12
={{$now.format('YYYY-MM-DD HH:mm:ss')}}      // 2025-11-12 14:30:00
={{$now.plus({days: 7})}}                    // 7 days from now
={{$now.minus({hours: 2})}}                  // 2 hours ago
={{$today}}                                  // Today's date (midnight)
```

---

### String Manipulation
```javascript
={{$json.name.toUpperCase()}}                // UPPERCASE
={{$json.name.toLowerCase()}}                // lowercase
={{$json.name.trim()}}                       // Remove whitespace
={{$json.firstName + ' ' + $json.lastName}}  // Concatenation
={{$json.email.split('@')[0]}}               // Get username from email
={{$json.text.substring(0, 100)}}            // First 100 characters
={{$json.text.replace('old', 'new')}}        // Replace text
```

---

### Number Operations
```javascript
={{$json.price * 1.1}}                       // Add 10%
={{$json.price.toFixed(2)}}                  // Round to 2 decimals
={{Math.round($json.value)}}                 // Round to nearest integer
={{Math.floor($json.value)}}                 // Round down
={{Math.ceil($json.value)}}                  // Round up
={{Math.max($json.value1, $json.value2)}}    // Maximum of two values
={{Math.min($json.value1, $json.value2)}}    // Minimum of two values
```

---

### Array Operations
```javascript
={{$json.items.length}}                      // Array length
={{$json.items[0]}}                          // First item
={{$json.items.slice(0, 3)}}                 // First 3 items
={{$json.items.join(', ')}}                  // Join array to string
={{$json.tags.includes('important')}}        // Check if array contains value
```

---

### Conditional Expressions
```javascript
={{$json.status === 'active' ? 'Yes' : 'No'}}                  // Ternary
={{$json.age >= 18 ? 'Adult' : 'Minor'}}                       // Age check
={{$json.score > 80 ? 'Pass' : 'Fail'}}                        // Pass/fail
={{$json.value ? $json.value : 'Default'}}                     // Default value
={{$json.email ? $json.email : 'noemail@example.com'}}         // Fallback
```

---

### JSON Access
```javascript
={{$json.field}}                             // Top-level field
={{$json.user.name}}                         // Nested field
={{$json.users[0].email}}                    // Array item field
={{$json['field-with-dash']}}                // Field with special chars
={{$node["Previous Node"].json.result}}      // Data from specific node
```

---

## 🎨 Common Workflow Patterns

### Pattern 1: Webhook → AI → Response
```json
{
  "name": "AI Content Generator",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "generate-content",
        "responseMode": "lastNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [100, 300]
    },
    {
      "parameters": {
        "modelId": {"value": "gpt-4"},
        "messages": {
          "values": [
            {"role": "user", "content": "={{$json.prompt}}"}
          ]
        }
      },
      "name": "OpenAI",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "position": [400, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\"content\": \"{{$json.output}}\"}"
      },
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [700, 300]
    }
  ],
  "connections": {
    "Webhook": {"main": [[{"node": "OpenAI"}]]},
    "OpenAI": {"main": [[{"node": "Respond"}]]}
  }
}
```

---

### Pattern 2: Schedule → Fetch → Transform → Store
```json
{
  "name": "Daily Data Sync",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [{"field": "cronExpression", "expression": "0 9 * * *"}]
        }
      },
      "name": "Daily Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [100, 300]
    },
    {
      "parameters": {
        "method": "GET",
        "url": "https://api.example.com/data"
      },
      "name": "Fetch Data",
      "type": "n8n-nodes-base.httpRequest",
      "position": [400, 300]
    },
    {
      "parameters": {
        "jsCode": "return $input.all().map(item => ({json: {id: item.json.id, processed: true}}));"
      },
      "name": "Transform",
      "type": "n8n-nodes-base.code",
      "position": [700, 300]
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": "sheet-id",
        "sheetName": "Data"
      },
      "name": "Save to Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "position": [1000, 300]
    }
  ],
  "connections": {
    "Daily Trigger": {"main": [[{"node": "Fetch Data"}]]},
    "Fetch Data": {"main": [[{"node": "Transform"}]]},
    "Transform": {"main": [[{"node": "Save to Sheets"}]]}
  }
}
```

---

### Pattern 3: Webhook → Switch → Multi-Platform
```json
{
  "name": "Multi-Platform Publisher",
  "nodes": [
    {
      "parameters": {"httpMethod": "POST", "path": "publish"},
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [100, 300]
    },
    {
      "parameters": {
        "conditions": {
          "conditions": [
            {"leftValue": "={{$json.platform}}", "rightValue": "youtube"},
            {"leftValue": "={{$json.platform}}", "rightValue": "linkedin"},
            {"leftValue": "={{$json.platform}}", "rightValue": "twitter"}
          ]
        }
      },
      "name": "Platform Router",
      "type": "n8n-nodes-base.switch",
      "position": [400, 300]
    },
    {
      "parameters": {"operation": "update"},
      "name": "YouTube",
      "type": "n8n-nodes-base.youTube",
      "position": [700, 100]
    },
    {
      "parameters": {"operation": "create"},
      "name": "LinkedIn",
      "type": "n8n-nodes-base.linkedIn",
      "position": [700, 300]
    },
    {
      "parameters": {"operation": "tweet"},
      "name": "Twitter",
      "type": "n8n-nodes-base.twitter",
      "position": [700, 500]
    }
  ],
  "connections": {
    "Webhook": {"main": [[{"node": "Platform Router"}]]},
    "Platform Router": {
      "main": [
        [{"node": "YouTube"}],
        [{"node": "LinkedIn"}],
        [{"node": "Twitter"}]
      ]
    }
  }
}
```

---

## 🆔 Generating Unique IDs

### UUID Format (Recommended)
```
2f89c40e-86aa-409f-8a9c-0ca3c8773c41
```

**Pattern:** `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
- Use online UUID generator OR
- Use descriptive IDs: `webhook-trigger-001`, `openai-node-001`

---

## 📍 Node Positioning Guide

### Horizontal Spacing
```
Trigger:  [100, 300]
Step 1:   [400, 300]   // +300px
Step 2:   [700, 300]   // +300px
Step 3:   [1000, 300]  // +300px
```

### Vertical Spacing (Branches)
```
Main path:    [400, 300]
Branch 1:     [700, 100]   // -200px
Branch 2:     [700, 300]   // same
Branch 3:     [700, 500]   // +200px
```

---

**Version:** 1.0
**Last Updated:** 2025-11-12
**Purpose:** Quick copy-paste reference for common N8N patterns

---

## 5. N8N Workflow Mastery

# N8N Workflow Mastery

**Purpose:** Deep knowledge of N8N workflows, nodes, JSON structure, and execution patterns.

---

## 🎯 N8N Core Concepts

### What is N8N?

N8N is a workflow automation tool that connects apps and services through visual workflows. Workflows are defined as JSON and executed node-by-node.

**Key Concepts:**
- **Workflow** = Collection of nodes + connections
- **Node** = Single action/operation (trigger, process, output)
- **Connection** = Data flow between nodes
- **Execution** = Running a workflow (manual, trigger, schedule)

---

## 🧩 Data Flow Fundamentals

### How Data Moves Through Workflows

**Input Data:**
```javascript
$input.first().json      // First item from previous node
$input.all()             // All items from previous node
$json                    // Current item's JSON data
$binary                  // Current item's binary data
```

**Context Variables:**
```javascript
$now                     // Current timestamp
$today                   // Today's date
$workflow.id             // Current workflow ID
$execution.id            // Current execution ID
$node["Node Name"].json  // Data from specific node
```

**Expression Syntax:**
```javascript
={{$json.fieldName}}                    // Simple field access
={{$json.user.email}}                   // Nested field access
={{$now.format('YYYY-MM-DD')}}          // Date formatting
={{$json.items.length}}                 // Array operations
={{$json.price * 1.1}}                  // Math operations
={{$json.status === 'active' ? 'Yes' : 'No'}}  // Conditional
```

---

## 📦 Node Types Catalog

### Trigger Nodes (Start Workflows)

#### 1. Webhook Trigger
**Purpose:** Start workflow via HTTP POST/GET request
**Common Use:** External systems trigger N8N

**Configuration:**
```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "webhook-name",
    "responseMode": "onReceived",
    "options": {}
  },
  "name": "Webhook Trigger",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1,
  "position": [100, 300]
}
```

**Example URL:** `https://n8n.yourdomain.com/webhook/webhook-name`

---

#### 2. Schedule Trigger
**Purpose:** Run workflow on schedule (cron)
**Common Use:** Daily reports, periodic sync

**Configuration:**
```json
{
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "cronExpression",
          "expression": "0 9 * * *"
        }
      ]
    }
  },
  "name": "Schedule Trigger",
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1
}
```

---

#### 3. Manual Trigger
**Purpose:** Start workflow manually (testing, on-demand)
**Common Use:** Development, manual processing

**Configuration:**
```json
{
  "parameters": {},
  "name": "Manual Trigger",
  "type": "n8n-nodes-base.manualTrigger",
  "typeVersion": 1
}
```

---

### AI Nodes (Intelligence Layer)

#### 1. OpenAI Node
**Purpose:** Chat completions, text generation
**Type:** `@n8n/n8n-nodes-langchain.openAi` OR `n8n-nodes-base.openAi`

**Configuration (LangChain Version):**
```json
{
  "parameters": {
    "modelId": {
      "__rl": true,
      "value": "gpt-4",
      "mode": "list",
      "cachedResultName": "GPT-4"
    },
    "messages": {
      "values": [
        {
          "role": "user",
          "content": "={{$json.prompt}}"
        }
      ]
    },
    "options": {
      "temperature": 0.7,
      "maxTokens": 2000
    }
  },
  "type": "@n8n/n8n-nodes-langchain.openAi",
  "typeVersion": 2,
  "credentials": {
    "openAiApi": {
      "id": "credential-id-here",
      "name": "OpenAI Credential Name"
    }
  }
}
```

**Key Parameters:**
- `modelId` - Model selection (gpt-4, gpt-3.5-turbo)
- `messages` - Chat messages array (role + content)
- `temperature` - Creativity (0.0-2.0)
- `maxTokens` - Response length limit

---

#### 2. HTTP Request Node (Custom AI APIs)
**Purpose:** Call any AI API (EdenAI, Claude, custom)
**Type:** `n8n-nodes-base.httpRequest`

**Configuration:**
```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.edenai.run/v2/text/generation",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "providers",
          "value": "anthropic"
        },
        {
          "name": "text",
          "value": "={{$json.prompt}}"
        },
        {
          "name": "temperature",
          "value": "0.7"
        }
      ]
    },
    "options": {
      "timeout": 30000
    }
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 3
}
```

---

### Code Nodes (Custom Logic)

#### 1. Code Node (JavaScript)
**Purpose:** Custom data transformation, complex logic
**Type:** `n8n-nodes-base.code`

**Configuration:**
```json
{
  "parameters": {
    "jsCode": "// Access input data\nconst items = $input.all();\n\n// Transform data\nconst transformed = items.map(item => ({\n  json: {\n    id: item.json.id,\n    fullName: `${item.json.firstName} ${item.json.lastName}`,\n    timestamp: new Date().toISOString()\n  }\n}));\n\n// Return transformed items\nreturn transformed;"
  },
  "name": "Transform Data",
  "type": "n8n-nodes-base.code",
  "typeVersion": 1
}
```

**Key Patterns:**
```javascript
// Access all input items
const items = $input.all();

// Access first item
const firstItem = $input.first().json;

// Return single item
return [{json: {result: 'value'}}];

// Return multiple items
return items.map(item => ({json: item.json}));

// Access binary data
const binaryData = $input.first().binary;
```

---

### Integration Nodes (Connect Services)

#### 1. Google Sheets
**Purpose:** Read/write spreadsheets
**Type:** `n8n-nodes-base.googleSheets`

**Append Row:**
```json
{
  "parameters": {
    "operation": "append",
    "documentId": "your-sheet-id",
    "sheetName": "Sheet1",
    "columns": {
      "mappingMode": "defineBelow",
      "values": {
        "Column A": "={{$json.value1}}",
        "Column B": "={{$json.value2}}"
      }
    }
  },
  "type": "n8n-nodes-base.googleSheets",
  "typeVersion": 4
}
```

---

#### 2. YouTube
**Purpose:** Upload/update videos
**Type:** `n8n-nodes-base.youTube`

**Configuration:**
```json
{
  "parameters": {
    "operation": "update",
    "videoId": "={{$json.youtube_video_id}}",
    "title": "={{$json.title}}",
    "description": "={{$json.description}}"
  },
  "type": "n8n-nodes-base.youTube",
  "typeVersion": 1
}
```

---

#### 3. LinkedIn
**Purpose:** Post content
**Type:** `n8n-nodes-base.linkedIn`

**Configuration:**
```json
{
  "parameters": {
    "resource": "post",
    "operation": "create",
    "text": "={{$json.post_content}}",
    "mediaUrls": "={{$json.image_urls}}"
  },
  "type": "n8n-nodes-base.linkedIn",
  "typeVersion": 1
}
```

---

### Logic Nodes (Control Flow)

#### 1. Switch Node
**Purpose:** Route data based on conditions
**Type:** `n8n-nodes-base.switch`

**Configuration:**
```json
{
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict"
      },
      "conditions": [
        {
          "id": "condition-1",
          "leftValue": "={{$json.status}}",
          "rightValue": "active",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        },
        {
          "id": "condition-2",
          "leftValue": "={{$json.status}}",
          "rightValue": "pending",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    }
  },
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3
}
```

**Routing:**
- Output 0 = Condition 1 match
- Output 1 = Condition 2 match
- Output 2 = No match (fallback)

---

#### 2. IF Node
**Purpose:** Simple true/false branching
**Type:** `n8n-nodes-base.if`

**Configuration:**
```json
{
  "parameters": {
    "conditions": {
      "boolean": [
        {
          "value1": "={{$json.age}}",
          "operation": "largerEqual",
          "value2": 18
        }
      ]
    }
  },
  "type": "n8n-nodes-base.if",
  "typeVersion": 1
}
```

**Outputs:**
- True branch
- False branch

---

#### 3. Merge Node
**Purpose:** Combine data from multiple branches
**Type:** `n8n-nodes-base.merge`

**Modes:**
- `append` - Concatenate all items
- `mergeByPosition` - Merge items by index
- `mergeByKey` - Merge items by matching key

---

## 📋 JSON Structure Requirements

### Workflow Schema

**Complete Workflow Structure:**
```json
{
  "name": "Workflow Name",
  "nodes": [
    {
      "parameters": {...},
      "id": "unique-node-id",
      "name": "Node Display Name",
      "type": "n8n-nodes-base.nodetype",
      "typeVersion": 1,
      "position": [x, y],
      "credentials": {...}
    }
  ],
  "connections": {
    "Node Display Name": {
      "main": [
        [
          {
            "node": "Next Node Display Name",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "version-identifier",
  "meta": {
    "instanceId": "instance-id"
  },
  "id": "workflow-id",
  "tags": ["tag1", "tag2"]
}
```

---

### Node Schema (Required Fields)

**Minimum Node Structure:**
```json
{
  "parameters": {},           // Node-specific configuration
  "id": "unique-id",          // UUID or unique string
  "name": "Node Name",        // Display name (used in connections)
  "type": "node.type",        // Node type identifier
  "typeVersion": 1,           // Node version (important!)
  "position": [x, y]          // Canvas position
}
```

**Optional Fields:**
```json
{
  "credentials": {            // If node needs credentials
    "credentialType": {
      "id": "cred-id",
      "name": "Credential Name"
    }
  },
  "webhookId": "webhook-id",  // For webhook nodes
  "continueOnFail": false,    // Error handling
  "notesInFlow": true,        // Show notes on canvas
  "notes": "Node description" // Developer notes
}
```

---

### Connection Schema

**Single Connection:**
```json
"connections": {
  "Source Node Name": {
    "main": [
      [
        {
          "node": "Destination Node Name",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

**Multiple Outputs (Branching):**
```json
"connections": {
  "Switch Node": {
    "main": [
      [
        {"node": "Path 1", "type": "main", "index": 0}
      ],
      [
        {"node": "Path 2", "type": "main", "index": 0}
      ],
      [
        {"node": "Path 3", "type": "main", "index": 0}
      ]
    ]
  }
}
```

**Multiple Destinations:**
```json
"connections": {
  "Source Node": {
    "main": [
      [
        {"node": "Destination 1", "type": "main", "index": 0},
        {"node": "Destination 2", "type": "main", "index": 0}
      ]
    ]
  }
}
```

---

## 🔐 Credential Management

### Credential Reference Patterns

**By ID (Preferred):**
```json
"credentials": {
  "openAiApi": {
    "id": "JHk7gW9hgbBkx2GG",
    "name": "Our Common Open AI Credential"
  }
}
```

**By Name:**
```json
"credentials": {
  "googleSheetsOAuth2Api": {
    "name": "Google Sheets Account"
  }
}
```

### Credential Types (Common)

- `openAiApi` - OpenAI API key
- `googleSheetsOAuth2Api` - Google Sheets OAuth
- `googleDriveOAuth2Api` - Google Drive OAuth
- `youTubeOAuth2Api` - YouTube OAuth
- `linkedInOAuth2Api` - LinkedIn OAuth
- `twitterOAuth2Api` - Twitter OAuth
- `httpHeaderAuth` - Custom HTTP header auth
- `httpBasicAuth` - HTTP Basic Auth

**Security Rule:**
❌ NEVER hardcode credentials in workflow JSON
✅ ALWAYS reference by ID or name

---

## ⚙️ Execution Order

### v1 vs. v2 Execution

**v1 (Legacy):**
```json
"settings": {
  "executionOrder": "v1"
}
```
- Sequential execution
- Waits for all items from node before proceeding

**v2 (Modern):**
```json
"settings": {
  "executionOrder": "v2"
}
```
- Streams items as they're ready
- Better performance for large datasets

**Recommendation:** Use v1 for simplicity unless processing 1000+ items

---

## 🎨 Node Positioning

### Canvas Coordinates

**Position Format:** `[x, y]`
- X increases rightward (100, 400, 700, 1000...)
- Y is vertical position (200, 300, 400...)

**Typical Spacing:**
- Horizontal: 300px between nodes
- Vertical: 200px between parallel branches

**Example Flow Layout:**
```
Trigger [100, 300]
  → Process [400, 300]
    → Branch 1 [700, 200]
    → Branch 2 [700, 300]
    → Branch 3 [700, 400]
```

---

## 📊 Data Types

### JSON Data Structure

**Single Item:**
```json
{
  "json": {
    "field1": "value1",
    "field2": 123,
    "nested": {
      "field3": true
    }
  }
}
```

**Multiple Items:**
```json
[
  {"json": {"id": 1, "name": "Item 1"}},
  {"json": {"id": 2, "name": "Item 2"}},
  {"json": {"id": 3, "name": "Item 3"}}
]
```

### Binary Data

**Structure:**
```json
{
  "binary": {
    "data": {
      "data": "base64-encoded-data",
      "mimeType": "image/png",
      "fileName": "image.png",
      "fileExtension": "png"
    }
  }
}
```

---

## 🔄 Common Workflow Patterns

### Pattern 1: Webhook → Process → Respond
```
Webhook Trigger
  → Code (process data)
    → HTTP Request (call API)
      → Respond to Webhook
```

### Pattern 2: Schedule → Fetch → Transform → Store
```
Schedule Trigger
  → HTTP Request (fetch data)
    → Code (transform)
      → Google Sheets (store)
```

### Pattern 3: Trigger → AI → Multi-Platform
```
Webhook Trigger
  → OpenAI (generate content)
    → Switch (route by platform)
      → YouTube Post
      → LinkedIn Post
      → Twitter Post
```

### Pattern 4: Error Handling
```
Any Node (continueOnFail: true)
  → IF (check for errors)
    → True: Error Notification
    → False: Continue Processing
```

---

## 🚀 Best Practices

### Node Naming
✅ **Good:** "Generate Article Content", "Upload to YouTube", "Log to Sheets"
❌ **Bad:** "OpenAI", "HTTP Request 1", "Node"

### Node Organization
- Group related nodes vertically
- Use consistent horizontal spacing (300px)
- Keep trigger on far left
- Keep output nodes on far right

### Error Handling
- Always add `continueOnFail: true` to external API calls
- Add error notification nodes
- Log errors to Google Sheets for debugging

### Performance
- Use batch operations when possible
- Limit loop iterations (avoid infinite loops)
- Set reasonable timeouts (30-60 seconds for external APIs)

### Security
- Never hardcode credentials
- Use environment variables for sensitive data
- Validate webhook inputs
- Sanitize user inputs in Code nodes

---

## 📚 Additional Resources

**N8N Documentation:** https://docs.n8n.io/
**N8N Community:** https://community.n8n.io/
**N8N Node Reference:** https://docs.n8n.io/integrations/builtin/

---

**Version:** 1.0
**Last Updated:** 2025-11-12
**Maintained By:** `/n8n` agent

---

*End of Knowledge Base*
