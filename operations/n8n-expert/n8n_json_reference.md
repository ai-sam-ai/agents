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
