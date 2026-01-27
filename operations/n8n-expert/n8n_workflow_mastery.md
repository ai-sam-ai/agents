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
