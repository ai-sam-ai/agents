# N8N Workflow Expert Agent

**Agent Name:** `n8n-expert`
**Slash Command:** `/n8n`
**Color:** 🟣 Purple (Automation Magic)
**Archetype:** Implementer
**Created:** 2025-11-12

---

## 📖 Overview

The N8N Workflow Expert is your specialized agent for building, diagnosing, and optimizing N8N workflows. This agent masters N8N's JSON workflow structure, node configurations, connection patterns, and integration with the SAM AI ecosystem.

### Purpose

- Build new N8N workflows from scratch (webhook → AI → integration patterns)
- Diagnose and fix existing workflow issues (JSON errors, node misconfigurations)
- Optimize workflow performance (error handling, timeouts, batching)
- Integrate N8N with SAM AI and Odoo (webhook patterns, callbacks)

---

## 🎯 When to Use This Agent

### Primary Use Cases

1. **Build New Workflows**
   ```
   User: "I need an N8N workflow that generates content with OpenAI and posts to LinkedIn"
   Agent: [Builds complete workflow JSON with all nodes configured]
   ```

2. **Fix Broken Workflows**
   ```
   User: "This workflow has errors, can you diagnose?"
   Agent: [Analyzes JSON, identifies issues, provides fixes]
   ```

3. **Optimize Performance**
   ```
   User: "This workflow is slow and times out"
   Agent: [Analyzes bottlenecks, suggests optimizations, implements fixes]
   ```

4. **Understand N8N**
   ```
   User: "How do I use Switch nodes to route data?"
   Agent: [Explains Switch nodes, provides examples, creates template]
   ```

---

## 📚 Knowledge Files

### 1. n8n_workflow_mastery.md (~400 lines)
**Comprehensive N8N knowledge:**
- Core concepts (workflows, nodes, connections, execution)
- Data flow patterns (`$json`, `$input`, expressions)
- Node types catalog (25+ node types documented)
- JSON structure requirements (workflow schema, node schema, connections)
- Credential management (security patterns)
- Expression syntax (`={{$json.field}}`, date formatting, string manipulation)

**Key Sections:**
- Trigger nodes (Webhook, Schedule, Manual)
- AI nodes (OpenAI, HTTP Request for custom APIs)
- Code nodes (JavaScript transformation patterns)
- Integration nodes (Google Sheets, YouTube, LinkedIn, Twitter)
- Logic nodes (Switch, IF, Merge)

---

### 2. n8n_expert_protocol.md (~350 lines)
**Agent's operational workflow:**
- 7-Phase process (Discovery → Design → Implementation → Validation → Testing → Optimization → Handover)
- Diagnosis procedures (for fixing broken workflows)
- Collaboration patterns (pair programming with user)
- Delegation rules (when to invoke `/cto`, `/developer`, `/mod_workflows`)

**Workflow Phases:**
1. Discovery - Understand requirements
2. Diagnosis/Design - Analyze issues or design new workflow
3. Implementation - Build/fix JSON
4. Validation - Check syntax, structure, connections
5. Testing Guidance - Provide import/test instructions
6. Optimization - Error handling, performance, logging
7. Handover - Deliver workflow + documentation

---

### 3. n8n_json_reference.md (~300 lines)
**Quick-reference templates:**
- Workflow templates (minimal, complete)
- Node templates (20+ copy-paste ready)
- Connection patterns (sequential, branching, switch, merge)
- Expression examples (50+ common patterns)
- Common workflow patterns (webhook→AI→response, schedule→fetch→store, multi-platform publisher)

**Usage:** Copy-paste starting points for rapid workflow development

---

### 4. n8n_debugging_guide.md (~400 lines)
**Troubleshooting & quality:**
- Common errors catalog (10 frequent issues + fixes)
- Debugging checklist (pre-import, post-import, execution testing)
- Quality standards (what "good" vs "bad" workflows look like)
- Performance optimization (batch vs loop, reduce API calls, caching)
- Security best practices (credential management, input validation, HTTPS)
- Anti-patterns to avoid (god workflows, no error handling, hardcoded credentials)

**Key Errors Covered:**
- JSON syntax errors
- Duplicate node IDs
- Invalid connection references
- Missing credentials
- Expression syntax errors
- TypeVersion mismatches
- Infinite loops
- Timeout issues

---

### 5. n8n_integration.md (~250 lines)
**Ecosystem integration:**
- Role in SAM AI ecosystem
- When to use `/n8n` vs other agents (delegation matrix)
- N8N ↔ Odoo integration patterns (webhooks, callbacks)
- Workflow organization (storage, naming conventions)
- Security and credential management
- Testing integration (isolated tests → full flow)
- SAM AI best practices (session tracking, error notification, logging)

**Integration Patterns:**
- N8N → Odoo webhook (send data to Odoo)
- Odoo → N8N webhook (trigger N8N from Odoo)
- SAM AI conversation → N8N action (full flow)

---

## 🔧 Technical Specifications

### Tools Used
- `Read` - Read existing workflow JSON files
- `Write` - Create new workflow JSON files
- `Edit` - Modify existing workflows
- `Bash` - Validate JSON syntax, list files
- `Grep` - Search for workflow patterns
- `Glob` - Find workflow files
- `TodoWrite` - Track multi-step workflow builds

### Model
- **Sonnet** - Balanced performance for complex JSON manipulation

### Color
- **Purple (🟣)** - Represents automation and integration magic

---

## 🚀 Quick Start Guide

### 1. Invoke the Agent
```
/n8n I need a workflow that [describe what you want]
```

### 2. Provide Requirements
The agent will ask:
- What triggers the workflow? (webhook, schedule, manual)
- What data do you have at the start?
- What processing is needed? (AI, transformations, integrations)
- Where does the output go? (API, Google Sheets, social media)

### 3. Receive Workflow
Agent delivers:
- Complete workflow JSON file
- Import instructions
- Testing guidance
- Documentation

### 4. Import to N8N
```
1. Open N8N instance
2. Click "Import" button
3. Select workflow JSON file
4. Configure credentials (if needed)
5. Test execution
6. Activate workflow
```

---

## 📋 Example Scenarios

### Scenario 1: Build AI Content Generator
```
User: /n8n Build a workflow that:
      - Triggers via webhook
      - Generates blog post with OpenAI
      - Posts to LinkedIn
      - Logs to Google Sheets

Agent: [Phase 1: Discovery questions]
       [Phase 2: Design 4-node workflow]
       [Phase 3: Build JSON with proper nodes]
       [Phase 4: Validate structure]
       [Phase 5: Provide testing instructions]
       [Delivers: workflow JSON + documentation]

Output: content-generator-v1.json (ready to import)
```

---

### Scenario 2: Fix Broken Workflow
```
User: /n8n This workflow has errors: C:\path\to\workflow.json

Agent: [Reads JSON]
       [Diagnosis: Identifies 3 issues]
       - Duplicate node IDs (node-001 used twice)
       - Invalid connection (references non-existent node)
       - Missing credential reference

       [Fixes all issues]
       [Validates corrected JSON]
       [Provides fix summary]

Output: workflow-fixed.json + explanation of changes
```

---

### Scenario 3: Optimize Slow Workflow
```
User: /n8n This workflow times out: C:\path\to\slow-workflow.json

Agent: [Analyzes workflow]
       [Identifies bottlenecks]
       - API timeout too short (10s → need 60s)
       - No error handling on HTTP Request node
       - Loop processing (should be batch)

       [Implements optimizations]
       [Adds performance improvements]

Output: workflow-optimized.json (2x faster, error-resilient)
```

---

## 🤝 Integration with Other Agents

### Delegates to `/cto` (Strategy)
**When:** User asks strategic questions
**Examples:**
- "Should we use N8N or build custom automation?"
- "How do we scale N8N for 10,000 workflows/day?"
- "What's the best automation architecture?"

---

### Delegates to `/developer` (Odoo Integration)
**When:** Odoo webhook/controller needed
**Examples:**
- "Create Odoo endpoint that triggers this N8N workflow"
- "Build Odoo controller that receives N8N webhook callbacks"
- "Store N8N execution results in Odoo model"

**Handoff Format:**
```markdown
## N8N → Odoo Integration Requirements

**N8N Webhook URL:** https://n8n.domain.com/webhook/workflow-name

**Odoo Endpoint Needed:**
- Path: /n8n/callback/workflow-name
- Method: POST
- Expected Payload: {...}
```

---

### Delegates to `/mod_workflows` (SAM AI Module)
**When:** SAM AI module integration needed
**Examples:**
- "Integrate this workflow with ai_sam_workflows module"
- "Store workflow metadata in Odoo"

---

### Delegates to `/cmo` (Marketing Strategy)
**When:** Marketing decisions needed
**Examples:**
- "What content should this workflow generate?"
- "Which social platforms should we prioritize?"

---

## 📂 Workflow Storage

### Location
```
C:\Users\total\n8n-workflows\
```

### Naming Convention
```
{purpose}-{version}.json

Examples:
- sam-content-generation-v1.json
- lead-scoring-v2.json
- linkedin-publisher-v1.json
- webhook-template.json
```

### Inventory
Maintain workflow inventory at: `C:\Users\total\n8n-workflows\INVENTORY.md`

**Template:**
```markdown
## Production Workflows

### 1. SAM Content Generation
- **File:** sam-content-generation-v1.json
- **Purpose:** Generate marketing content via SAM AI trigger
- **Trigger:** Webhook (POST /webhook/sam-content-generation)
- **Nodes:** 5 (Webhook → OpenAI → LinkedIn → Notify → Log)
- **Status:** ✅ Active
- **Created:** 2025-11-12
```

---

## ✅ Success Criteria

Agent has succeeded when:
- ✅ Workflow JSON is valid and imports without errors
- ✅ All nodes are properly configured
- ✅ Connections flow logically (left to right)
- ✅ User understands how to test the workflow
- ✅ Documentation is clear and complete
- ✅ User knows next steps (import → test → activate)

---

## 🔒 Security Notes

### Credential Management
- ❌ Agent NEVER hardcodes credentials in JSON
- ✅ Agent ALWAYS references credentials by ID or name
- ✅ User configures credentials in N8N UI after import

### Best Practices
- All API calls use HTTPS (never HTTP)
- Webhook inputs are validated in Code nodes
- External API nodes have `continueOnFail: true`
- Sensitive data is not logged to Google Sheets

---

## 📊 Performance Metrics

### Workflow Build Time
- **Simple workflow (3-5 nodes):** 10-15 minutes
- **Complex workflow (10-15 nodes):** 30-45 minutes
- **Multi-platform integration (15-20 nodes):** 45-60 minutes

### Knowledge Coverage
- **25+ node types** documented
- **50+ expression examples**
- **10 common errors** cataloged with fixes
- **5 integration patterns** with SAM AI/Odoo

---

## 🛠️ Maintenance

### When to Update Knowledge
- N8N releases new node types → Update node catalog
- New errors discovered → Add to debugging guide
- New integration patterns → Document in integration guide
- User feedback → Refine protocol

### Update Process
1. Identify gap in knowledge
2. Research solution (N8N docs, community)
3. Update relevant knowledge file
4. Test with real workflow
5. Document in README

---

## 📚 Additional Resources

**N8N Official:**
- Documentation: https://docs.n8n.io/
- Community: https://community.n8n.io/
- Node Reference: https://docs.n8n.io/integrations/builtin/

**Agent Files:**
- Slash Command: `${CLAUDE_COMMANDS_DIR}\n8n.md`
- Agent Config: `${CLAUDE_AGENTS_DIR}\n8n-expert\agent.json`
- Knowledge Files: `${CLAUDE_AGENTS_DIR}\n8n-expert\*.md`

---

## 🎯 Roadmap

### Future Enhancements
1. **Workflow Templates Library** - Pre-built templates for common patterns
2. **Error Pattern Learning** - Track user's specific error patterns
3. **Performance Profiling** - Analyze execution times, suggest optimizations
4. **N8N Version Tracking** - Stay current with N8N updates
5. **SAM AI Deep Integration** - Advanced conversation → automation flows

---

**Version:** 1.0.0
**Last Updated:** 2025-11-12
**Maintained By:** Chief of Staff (`/cos`)
**Status:** ✅ Active and Ready
