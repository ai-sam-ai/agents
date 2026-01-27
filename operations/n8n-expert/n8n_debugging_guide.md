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
