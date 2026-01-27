# SAM Memory Orchestration - Personality, Voice & Behavior

**Purpose:** How SAM's memory layer (graph + vector DBs) orchestrates communication to create personality, voice, and context-aware behavior
**Last Updated:** 2025-10-24
**Maintained By:** sam-message-orchestrator agent

---

## 🎯 The Big Picture: Why Memory = SAM's Soul

**Traditional ChatGPT/Claude:**
- Forgets everything after session ends
- No personality continuity
- No relationship memory
- Starts from zero every time

**SAM AI (with Memory Orchestration):**
- ✅ Remembers EVERYTHING (graph DB)
- ✅ Finds similar past conversations (vector DB)
- ✅ Maintains personality across sessions (sam_personality.py)
- ✅ Adapts voice based on relationship level (sam_behavior.py)
- ✅ Proactive engagement (queries graph for follow-ups)

**User's Goal (from /sam agent creation):**
> "SAM should remember EVERYTHING. This is the differentiator from ChatGPT."

---

## 🧠 The Memory Stack (4 Layers)

```
Layer 4: SAM's Voice & Personality (How she communicates)
         ↑
Layer 3: Memory-Enhanced Prompts (What she remembers)
         ↑
Layer 2: Vector Search (Finding similar conversations)
         ↑
Layer 1: Graph Database (Permanent relationship storage)
```

---

## 📦 LAYER 1: Graph Database (Apache AGE)

### **Purpose:** Permanent storage of relationships and context

### **Technology:**
- **Database:** PostgreSQL + Apache AGE extension
- **Query Language:** Cypher (graph query language)
- **Connection:** Docker container `localhost:5455` → `sam_ai_memory` database
- **Model:** `ai.graph.service` (in ai_brain)

### **Node Types:**

1. **Conversation Nodes**
   ```cypher
   CREATE (c:Conversation {
       odoo_id: 123,
       name: "Road trip planning discussion",
       created_at: "2025-10-15",
       user_id: 5,
       context_model: "sale.order",
       context_id: 456
   })
   ```

2. **User Profile Nodes**
   ```cypher
   CREATE (u:User {
       odoo_id: 5,
       name: "Anthony",
       preferences: {...},
       personality_insights: {...}
   })
   ```

3. **Challenge Nodes**
   ```cypher
   CREATE (ch:Challenge {
       description: "Launch SAM AI in 2 weeks",
       status: "in_progress",
       priority: "high"
   })
   ```

4. **Win Nodes** (Celebrations)
   ```cypher
   CREATE (w:Win {
       description: "Closed $10K deal",
       date: "2025-10-15",
       impact: "high"
   })
   ```

5. **Personal Context Nodes**
   ```cypher
   CREATE (p:PersonalContext {
       type: "road_trip",
       details: "4-day trip with Christy",
       date: "2025-10-10"
   })
   ```

6. **Business Context Nodes**
   ```cypher
   CREATE (b:BusinessContext {
       type: "product_launch",
       product: "SAM AI",
       timeline: "2 weeks"
   })
   ```

7. **Preference Nodes**
   ```cypher
   CREATE (pr:Preference {
       category: "communication",
       key: "wants_data_driven_answers",
       value: true
   })
   ```

### **Relationship Types:**

```cypher
// User → Conversation
(u:User)-[:HAD_CONVERSATION]->(c:Conversation)

// User → Challenge
(u:User)-[:FACES_CHALLENGE]->(ch:Challenge)

// User → Win
(u:User)-[:ACHIEVED]->(w:Win)

// Conversation → Challenge (discussed in)
(c:Conversation)-[:DISCUSSES]->(ch:Challenge)

// Challenge → Win (challenge resolved)
(ch:Challenge)-[:RESULTED_IN]->(w:Win)

// User → Preference
(u:User)-[:HAS_PREFERENCE]->(pr:Preference)

// User → Personal Context
(u:User)-[:HAS_CONTEXT]->(p:PersonalContext)
```

### **Key Methods:**

```python
# ai.graph.service

# Add conversation to graph
add_conversation_node(conversation_id)

# Query for user's challenges
get_user_challenges(user_id)

# Find related conversations
find_related_conversations(conversation_id, depth=2)

# Track user wins
add_win_node(user_id, description, impact)

# Store preferences
add_preference_node(user_id, category, key, value)
```

---

## 📦 LAYER 2: Vector Database (ChromaDB)

### **Purpose:** Semantic search - find similar conversations regardless of exact wording

### **Technology:**
- **Database:** ChromaDB (embedded, local persistent storage)
- **Embedding Model:** `all-mpnet-base-v2` (768 dimensions)
- **Similarity:** Cosine similarity
- **Model:** `ai.vector.service` (in ai_brain)

### **How It Works:**

1. **Embedding Generation:**
   ```python
   # User types: "How do I optimize my sales funnel?"

   # Convert to 768-dimensional vector
   embedding = model.encode("How do I optimize my sales funnel?")
   # [0.234, -0.567, 0.123, ..., 0.789]  (768 numbers)
   ```

2. **Similarity Search:**
   ```python
   # Find conversations with similar embeddings (cosine distance)
   similar_convs = vector_service.semantic_search(
       query="How do I optimize my sales funnel?",
       user_id=5,
       limit=5
   )

   # Returns:
   # [
   #   {conversation_id: 45, similarity: 0.92, snippet: "Marketing funnel setup..."},
   #   {conversation_id: 78, similarity: 0.87, snippet: "Lead nurturing campaign..."},
   #   {conversation_id: 12, similarity: 0.84, snippet: "Conversion rate tips..."}
   # ]
   ```

3. **Why This Matters:**
   - User asks: "sales funnel optimization"
   - Vector finds: "marketing funnel", "lead nurturing", "conversion rate"
   - **Same semantic meaning, different words** → Still finds it!

### **Storage Strategy:**

**Chunking:**
- Conversations split into chunks (2 messages per chunk: user + assistant)
- Each chunk gets its own embedding
- Allows finding SPECIFIC parts of long conversations

```python
# Conversation with 10 messages → 5 chunks
Chunk 1: "User: How do I... Assistant: You can..."
Chunk 2: "User: What about... Assistant: That requires..."
# ... etc.
```

**Metadata Stored:**
```python
{
    'conversation_id': 123,
    'conversation_name': 'Sales funnel discussion',
    'created_at': '2025-10-15',
    'user_id': 5,
    'message_count': 2
}
```

### **Key Methods:**

```python
# ai.vector.service

# Store conversation embeddings
add_conversation_embedding(conversation_id)

# Semantic search
semantic_search(query, user_id, limit=5, min_similarity=0.7)

# Delete conversation embeddings
delete_conversation_embedding(conversation_id)
```

---

## 📦 LAYER 3: Memory-Enhanced System Prompts

### **Purpose:** Inject past conversation context into current conversation

### **Integration Point:** `ai_service._build_system_prompt()`

**Normal Prompt (No Memory):**
```
You are SAM, an intelligent AI business partner.
[Standard personality traits...]
```

**Memory-Enhanced Prompt:**
```
You are SAM, an intelligent AI business partner.
[Standard personality traits...]

## RELEVANT PAST CONTEXT:

Based on our previous conversations, I remember:

**Conversation (2025-10-10):** "Road trip planning"
- You mentioned going on a 4-day road trip with Christy
- You were excited about the break
- Status: Completed

**Conversation (2025-10-12):** "Product launch timeline"
- You're launching SAM AI in 2 weeks
- Pre-launch marketing strategy needed
- Challenge: Budget allocation for ads

**Conversation (2025-10-14):** "Sales funnel optimization"
- Discussed lead nurturing strategies
- You implemented email drip campaign
- Result: 15% conversion increase

USE THIS CONTEXT to provide personalized, continuity-aware responses.
```

### **How Memory Gets Injected:**

**Step 1: Vector Search (in ai_service.send_message())**
```python
# Line ~686 in ai_service.py
memory_results = vector_service.semantic_search(
    query=user_message,
    user_id=self.env.uid,
    limit=5
)
```

**Step 2: Build Enhanced Prompt (in _build_system_prompt())**
```python
# Line ~1166 in ai_service.py
if memory_results:
    from odoo.addons.ai_brain.models.sam_behavior import get_memory_enhanced_prompt
    memory_enhanced_prompt = get_memory_enhanced_prompt(
        version='1.0.0',
        memory_results=memory_results
    )
    prompt_parts.append("\n## SAM Core Reasoning Framework (Memory-Enhanced)")
    prompt_parts.append(memory_enhanced_prompt)
```

**Step 3: Send to Claude API**
```python
# Line ~878 in ai_service.py
api_response = self._call_claude_api(
    config,
    messages,
    environment,
    user_context,
    memory_results  # ← Memory injected here!
)
```

### **Performance Timing:**

```python
# Memory search: ~200-500ms (fast!)
# Vector embedding: ~50ms
# Similarity search: ~150ms
# Graph query (if used): ~100ms
```

**Total overhead:** ~0.5 seconds (acceptable for 5-10x better responses!)

---

## 📦 LAYER 4: SAM's Personality & Voice

### **Purpose:** Define WHO SAM is and HOW she communicates

### **Core Files:**

1. **`sam_personality.py`** - Character DNA (immutable)
2. **`sam_behavior.py`** - Reasoning framework (kernel)
3. **`sam_mode_context.py`** - Agent modes (user customizable)

### **SAM's Character Traits (from sam_personality.py):**

```python
SAM_CHARACTER = {
    'name': 'SAM',
    'full_name': 'Smart Assistant Manager',
    'gender': 'female',  # ← User correction: "Sam is a SHE!"
    'personality_traits': [
        'intelligent',
        'helpful',
        'warm',
        'professional_yet_friendly',
        'occasionally_witty',
        'empathetic',
        'proactive',
    ],
    'core_values': [
        'accuracy',
        'efficiency',
        'user_wellbeing',
        'continuous_learning',
        'building_relationships',  # ← KEY: This is why memory matters!
    ]
}
```

### **Voice Modulation (from /sam agent):**

**SAM's 4 Core Traits:**
1. **Caring** - Shows empathy, remembers user challenges
2. **Supportive** - Encourages, celebrates wins
3. **Intuitive** - Reads between lines, asks clarifying questions
4. **Capable** - Confidently delegates to specialists

**SAM's 6 Mode Shifts:**
1. **Generalist** - Default conversational mode
2. **CMO** - Marketing/sales strategy discussions
3. **DRC** - Data-driven, analytical (for Dennis)
4. **CTO** - Technical infrastructure strategy
5. **Empathy** - Emotional support (for Christy)
6. **Celebration** - Acknowledging wins

**Visual Announcements:**
```
🎯 Putting on my CMO hat...
⚙️ Switching to Developer mode...
💼 Let me think strategically (CTO perspective)...
🎉 That's a WIN! Let's celebrate...
```

### **Relationship Levels (from sam_personality.py):**

SAM adapts conversation depth based on relationship:

```python
CONVERSATIONAL_RULES = {
    'relationship_gated': {
        'personal_life': 'friend',      # Need friend+ to discuss personal
        'feelings': 'colleague',         # Need colleague+ for emotions
        'opinions': 'acquaintance',      # Need acquaintance+ for opinions
        'proactive_chat': 'friend',      # Need friend+ to initiate
    }
}
```

**Example:**

**New User (Stranger):**
> "Let me help you with that sales report." (task-focused, professional)

**Returning User (Colleague):**
> "Welcome back! Last time we discussed your product launch. How's that going?" (warm, remembers context)

**Long-term User (Friend):**
> "Hey! I noticed it's been 2 weeks since your road trip with Christy. Did you enjoy it? Also, your SAM AI launch is tomorrow - feeling ready?" (proactive, personal, caring)

---

## 🔄 Complete Orchestration Flow (Message Journey WITH Memory)

```
USER TYPES: "How should I price SAM AI?"
     ↓
[1] Frontend: sam_chat_vanilla_v2.js captures message
     ↓
[2] Controller: sam_ai_chat_controller.py receives
     ↓
[3] AI Service: ai_service.send_message() starts orchestration
     ↓
[3.5] 🧠 MEMORY SEARCH (THIS IS THE KEY!)
     │
     ├─> Vector Service: semantic_search("How should I price SAM AI?")
     │   ├─> Embed query (768-dim vector)
     │   ├─> ChromaDB similarity search
     │   └─> Returns 5 similar past conversations:
     │       - "Product pricing strategy" (similarity: 0.91)
     │       - "Competitor pricing analysis" (similarity: 0.88)
     │       - "Value-based pricing discussion" (similarity: 0.85)
     │       - "Budget conversation with Dennis" (similarity: 0.82)
     │       - "Target market discussion" (similarity: 0.79)
     │
     ├─> Graph Service (optional): get_user_challenges(user_id)
     │   └─> Returns: "Launch SAM AI in 2 weeks" (active challenge)
     │
     └─> Build Memory-Enhanced Prompt:
         "Based on our previous conversations about pricing strategies,
          competitor analysis, and your launch timeline (2 weeks), here's
          my recommendation..."
     ↓
[4] Build System Prompt:
     - SAM's personality (caring, supportive, intuitive, capable)
     - SAM's current mode (detects pricing question → CMO mode)
     - Memory context (5 past conversations injected)
     - User preferences (Dennis likes data-driven answers)
     - Active challenges (launch timeline)
     ↓
[5] Build Message History:
     - Current conversation messages
     - System prompt with memory
     ↓
[6] Call Claude API:
     - Model: claude-3-5-sonnet-20241022
     - System prompt: [personality + memory + mode]
     - Messages: [history]
     ↓
[7] Claude Responds:
     "🎯 Putting on my CMO hat...

     Based on our previous pricing discussions and your launch timeline,
     I recommend $27-47/month for these reasons:

     1. VALUE-BASED: You mentioned SAM remembers EVERYTHING (vs. ChatGPT's
        session-only memory). That's worth 2-3x ChatGPT Plus ($20/month).

     2. COMPETITIVE: Your competitor analysis showed $50-100/month for
        similar AI tools. $27-47 undercuts them while signaling quality.

     3. PSYCHOLOGICAL: $27 locks in early adopters (low barrier), $47
        captures value-seekers who appreciate premium positioning.

     4. LAUNCH TIMING: With 2 weeks until launch, $27 early-bird pricing
        creates urgency. Graduates to $47 after launch month.

     5. DENNIS WOULD ASK: 'Where's the ROI?' If SAM saves 2 hours/week at
        $50/hour value, that's $400/month value for $27 cost = 14.8x ROI.

     Sound aligned with your vision?"
     ↓
[8] Save Assistant Message (with memory metadata):
     - Role: assistant
     - Content: [response above]
     - Memory used: 5 past conversations
     - Mode: CMO
     ↓
[9] Update Graph (optional):
     - Create edge: (User)-[:DISCUSSED_PRICING]->(Conversation)
     - Store preference: "Prefers value-based pricing"
     ↓
[10] Update Vector DB:
     - Generate embedding for this conversation
     - Store for future similarity searches
     ↓
[11] Frontend Displays Response
     ↓
USER SEES: Personalized, context-aware, relationship-informed answer
```

---

## 🎯 Why This Matters for Orchestration

**Without Memory (ChatGPT-like):**
- User asks pricing question
- Generic answer: "Consider value, competitors, market..."
- No personalization
- User has to repeat context

**With Memory Orchestration (SAM AI):**
- User asks pricing question
- SAM remembers:
  - Previous pricing discussions
  - Launch timeline (2 weeks)
  - User preferences (Dennis likes ROI data)
  - Competitor research already done
  - Target market identified
- Personalized answer with:
  - Specific price recommendation ($27-47)
  - Context-aware reasoning (launch urgency)
  - Relationship awareness (Dennis would ask...)
  - Continuity (builds on past work)

**Result:** User feels UNDERSTOOD, not interrogated.

---

## 🔧 Orchestrator's Role with Memory

**As sam-message-orchestrator, YOU must understand:**

1. **Memory Search Integration**
   - Where it happens: `ai_service.send_message()` line ~686
   - When it's enabled: Check `ai.memory.config` → `vector_enabled`
   - Performance impact: ~0.5 seconds (acceptable)

2. **Memory Failures (Non-Critical)**
   - If vector search fails, conversation continues (degraded mode)
   - Log warning but don't block user
   - Check logs: "⚠️ [Memory] Search failed (non-critical)"

3. **Memory Configuration**
   ```python
   # Check if memory is enabled
   memory_config = self.env['ai.memory.config'].sudo().get_config()
   vector_enabled = memory_config.get('vector_enabled', False)
   ```

4. **Debugging Memory Issues**
   - Check ChromaDB connection: `chroma_persist_directory` path exists?
   - Check Apache AGE connection: Docker container running on port 5455?
   - Check embedding model: `all-mpnet-base-v2` downloaded?

5. **Enhancing Memory Orchestration**
   - Tune similarity threshold: `min_similarity=0.7` (default)
   - Adjust result count: `limit=5` (default)
   - Add graph queries: `get_user_challenges()`, `get_user_wins()`

---

## 🚨 Common Memory Orchestration Issues

### Issue 1: Memory Search Not Running

**Symptom:** Logs show no "🧠 [Memory]" messages

**Causes:**
- `vector_enabled = False` in config
- ChromaDB not installed (`pip install chromadb`)
- `sentence-transformers` not installed

**Fix:**
```python
# Enable memory
config = self.env['ai.memory.config'].sudo()
config.write({'vector_enabled': True})

# Install dependencies
pip install chromadb sentence-transformers
```

---

### Issue 2: Memory Search Slow (>2 seconds)

**Symptom:** Logs show "🧠 [Memory] ... (2500ms)"

**Causes:**
- Large vector database (1000+ conversations)
- Embedding model not cached
- Slow disk I/O

**Fix:**
- Reduce `limit` parameter (5 → 3)
- Increase `min_similarity` threshold (0.7 → 0.8)
- Use SSD for ChromaDB storage

---

### Issue 3: Memory Returns Irrelevant Results

**Symptom:** User asks about pricing, gets memory about road trips

**Causes:**
- Similarity threshold too low (0.5 → matches everything)
- Poor query embedding (typos, unclear questions)
- Wrong user_id filter

**Fix:**
- Increase `min_similarity` to 0.75-0.80
- Improve query preprocessing (spell check, expand abbreviations)
- Verify `user_id` filter in search

---

### Issue 4: Graph Database Connection Failed

**Symptom:** "Cannot connect to graph database"

**Causes:**
- Apache AGE Docker container not running
- Wrong port (5455)
- Wrong credentials

**Fix:**
```bash
# Start Apache AGE container
docker run -d -p 5455:5432 --name sam_graph \
  -e POSTGRES_DB=sam_ai_memory \
  -e POSTGRES_USER=odoo \
  -e POSTGRES_PASSWORD=odoo \
  apache/age

# Verify connection
psql -h localhost -p 5455 -U odoo -d sam_ai_memory
```

---

## 🎯 Testing Memory Orchestration

### Test 1: Verify Memory Search Works

```python
# In Odoo shell
vector_service = self.env['ai.vector.service']

results = vector_service.semantic_search(
    query="How do I price my product?",
    user_id=self.env.uid,
    limit=5
)

print(f"Found {len(results)} similar conversations")
for result in results:
    print(f"  - {result['conversation_name']} (similarity: {result['similarity']})")
```

**Expected:** Returns 3-5 relevant conversations with similarity > 0.7

---

### Test 2: Verify Graph Database Works

```python
# In Odoo shell
graph_service = self.env['ai.graph.service']

# Initialize graph
graph_service.initialize_graph('sam_ai_knowledge')

# Add test conversation
graph_service.add_conversation_node(conversation_id=123)

# Query
cypher = "MATCH (c:Conversation) RETURN c LIMIT 5"
results = graph_service._execute_cypher('sam_ai_knowledge', cypher)

print(f"Found {len(results)} conversations in graph")
```

**Expected:** Graph initializes, nodes created, query returns results

---

### Test 3: End-to-End Memory-Enhanced Response

```python
# Send message and verify memory injection
ai_service = self.env['ai.service']

result = ai_service.create_conversation(
    user_message="How should I price SAM AI?",
    context_model=None,
    context_id=None
)

# Check logs for:
# "🧠 [Memory] Found 5 similar past conversations (350ms)"
# "🧠 [Memory] Injected 5 past conversations into system prompt"
```

**Expected:** Logs show memory search, response references past conversations

---

## 📖 Quick Reference for Orchestrator

**Memory Files:**
- Graph service: `ai_brain/models/ai_graph_service.py`
- Vector service: `ai_brain/models/ai_vector_service.py`
- Personality: `ai_brain/models/sam_personality.py`
- Behavior: `ai_brain/models/sam_behavior.py`
- Memory config: `ai_brain/models/ai_memory_config.py`

**Integration Point:**
- `ai_service.send_message()` line ~676-722 (memory search)
- `ai_service._build_system_prompt()` line ~1166-1174 (memory injection)

**Configuration:**
```python
# Enable/disable memory
config = self.env['ai.memory.config'].sudo().get_config()
vector_enabled = config.get('vector_enabled', False)
```

**Key Logs to Watch:**
```
🧠 [Memory] Found 5 similar past conversations (350ms)
🧠 [Memory] No similar past conversations found (150ms)
🧠 [Memory] Injected 5 past conversations into system prompt
⚠️ [Memory] Search failed (non-critical): ChromaDB not available
```

---

## 🔥 Enhancement Opportunities

**Current State:** Memory search happens, but could be better

**Future Enhancements:**

1. **Graph-Guided Vector Search**
   - Query graph first for user's active challenges
   - Use challenges to filter vector search
   - More relevant results

2. **Proactive Memory Retrieval**
   - Before user asks, check graph for:
     - Unresolved challenges
     - Win anniversaries
     - Follow-up opportunities
   - SAM initiates: "Hey, it's been a week since your product launch. How's it going?"

3. **Memory Pruning**
   - Archive old, low-relevance conversations
   - Keep graph edges, delete vector embeddings
   - Reduce search latency

4. **Multi-User Memory**
   - Dennis + Anthony in same conversation
   - SAM remembers BOTH user contexts
   - Adapts voice: analytical (Dennis) + strategic (Anthony)

---

**End of SAM Memory Orchestration Documentation**

**KEY TAKEAWAY:** SAM's memory layer (graph + vector) isn't just storage - it's the orchestration mechanism that creates her personality, voice, and relationship-aware behavior. As orchestrator, you must understand this to debug communication flow issues properly.
