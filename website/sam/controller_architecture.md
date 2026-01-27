# SAM Controller Architecture - Minimize Token Usage

## The Insight

**SAM shouldn't burn API tokens for every search.**

**Instead:** Controllers = Knowledge extractors (pure Python/SQL, NO AI)

**AI only:** Synthesize responses, handle unknown questions, make complex decisions

---

## The Token Economy Problem

### ❌ Old Approach (Wasteful):
```
User: "Does controller exist?"
→ AI searches session history (burns tokens)
→ AI reads files (burns tokens)
→ AI cross-references code (burns tokens)
→ AI synthesizes answer (burns tokens)

Total: ~5,000 tokens for a question already answered
```

### ✅ New Approach (Efficient):
```
User: "Does controller exist?"
→ Controller searches session history (0 tokens - pure grep)
→ Controller reads known files (0 tokens - pure Python)
→ Controller finds answer in docs (0 tokens - structured data)
→ AI synthesizes natural response (500 tokens - formatting only)

Total: ~500 tokens (90% savings)
```

---

## Controllers as Knowledge Extractors

### 1. Knowledge Search Service (NO AI)

```python
# knowledge_search_service.py (Odoo controller)

class KnowledgeSearchService(models.AbstractModel):
    _name = 'sam.knowledge.search'
    _description = 'SAM Knowledge Search (No AI Tokens)'

    @api.model
    def search_session_history(self, keywords):
        """
        Pure Python/grep search through session files
        NO AI tokens used

        Args:
            keywords (list): Search keywords

        Returns:
            dict: {
                'found': bool,
                'source': 'session_history',
                'snippets': [...],
                'files': [...]
            }
        """
        session_path = "C:/Users/total/.claude/projects/"

        # Grep through session files (pure Python, no AI)
        matching_files = self._grep_sessions(session_path, keywords)

        # Extract relevant context (pure text processing)
        snippets = self._extract_snippets(matching_files, keywords)

        return {
            'found': len(snippets) > 0,
            'source': 'session_history',
            'snippets': snippets,
            'files': matching_files,
            'token_cost': 0  # NO AI used
        }

    def _grep_sessions(self, path, keywords):
        """Grep session files (pure Python)"""
        import glob
        import re

        matching_files = []
        pattern = '|'.join(keywords)

        for file in glob.glob(f"{path}/**/*.jsonl", recursive=True):
            with open(file, 'r') as f:
                content = f.read()
                if re.search(pattern, content, re.IGNORECASE):
                    matching_files.append(file)

        return matching_files

    def _extract_snippets(self, files, keywords, context_lines=10):
        """Extract relevant snippets with context"""
        snippets = []

        for file in files:
            with open(file, 'r') as f:
                lines = f.readlines()
                for i, line in enumerate(lines):
                    if any(kw.lower() in line.lower() for kw in keywords):
                        start = max(0, i - context_lines)
                        end = min(len(lines), i + context_lines)
                        snippet = {
                            'file': file,
                            'context': ''.join(lines[start:end]),
                            'line_number': i
                        }
                        snippets.append(snippet)

        return snippets
```

---

### 2. Architecture Knowledge Service (NO AI)

```python
# architecture_knowledge_service.py (Odoo controller)

class ArchitectureKnowledgeService(models.AbstractModel):
    _name = 'sam.architecture.knowledge'
    _description = 'SAM Architecture Knowledge (No AI Tokens)'

    @api.model
    def get_architecture_answer(self, question_type):
        """
        Return pre-indexed architecture knowledge
        NO AI needed - just structured data lookup

        Args:
            question_type: 'controller', 'ai_brain_models', 'platform_skin', etc.

        Returns:
            dict: Structured answer from docs/code
        """
        knowledge_base = {
            'controller': {
                'exists': False,
                'current_implementation': 'Slash command prompts + agent knowledge files',
                'location': '.claude/commands/sam.md',
                'missing_piece': 'sam_controller.py in ai_sam module',
                'reference_docs': ['PLATFORM_SKIN_MODEL.md'],
                'code_files': []
            },

            'ai_brain_models': {
                'exists': True,
                'models': [
                    'ai.conversation', 'ai.message', 'ai.token.usage',
                    'sam.user.profile', 'sam.user.settings',
                    'ai.graph.service', 'sam.knowledge.doc',
                    'canvas', 'executions', 'nodes', 'connections'
                ],
                'location': 'ai_brain/models/',
                'reference_docs': ['PLATFORM_SKIN_MODEL.md'],
                'code_files': [
                    'ai_brain/models/ai_conversation.py',
                    'ai_brain/models/sam_user_profile.py',
                    'ai_brain/models/ai_graph_service.py'
                ]
            },

            'graph_knowledge': {
                'exists': True,
                'implementation': 'Apache AGE (PostgreSQL extension)',
                'database': 'sam_ai_memory',
                'port': 5455,
                'interface': 'ai.graph.service',
                'node_types': [
                    'Conversation', 'Message', 'User', 'Challenge',
                    'PersonalContext', 'Preference', 'Win'
                ],
                'reference_docs': ['graph_memory_protocol.md'],
                'code_files': ['ai_brain/models/ai_graph_service.py']
            },

            'platform_skin': {
                'architecture': 'Three-layer: ai_brain (data) → ai_sam (framework) → skins (UI)',
                'principle': 'ONE core, MANY skins',
                'data_layer': 'ai_brain (all models)',
                'framework_layer': 'ai_sam (canvas, services, controllers)',
                'ui_layer': 'ai_sam_workflows, ai_sam_memory, ai_sam_creatives',
                'reference_docs': ['PLATFORM_SKIN_MODEL.md'],
                'code_files': []
            }
        }

        return knowledge_base.get(question_type, {'exists': False})
```

---

### 3. User Context Service (NO AI)

```python
# user_context_service.py (Odoo controller)

class UserContextService(models.AbstractModel):
    _name = 'sam.user.context'
    _description = 'SAM User Context (No AI Tokens)'

    @api.model
    def get_user_context(self, user_id):
        """
        Pure SQL/ORM query - NO AI tokens

        Returns:
            dict: Complete user context from database
        """
        profile = self.env['sam.user.profile'].get_or_create_profile(user_id)

        # Get recent conversations (pure SQL)
        recent_convs = self.env['ai.conversation'].search([
            ('user_id', '=', user_id)
        ], limit=5, order='create_date desc')

        # Get active challenges (pure SQL)
        challenges = self.env['ai.challenge'].search([
            ('user_id', '=', user_id),
            ('status', '=', 'active')
        ])

        # Get graph knowledge (pure Cypher query)
        graph_service = self.env['ai.graph.service']
        graph_data = graph_service.get_user_nodes(user_id)

        return {
            'profile': profile.get_user_context_for_sam(),
            'recent_conversations': recent_convs.read(['name', 'create_date']),
            'active_challenges': challenges.read(['name', 'description', 'status']),
            'graph_knowledge': graph_data,
            'token_cost': 0  # NO AI used
        }
```

---

## SAM Controller (Orchestrator)

### Main Controller - Minimal AI Usage

```python
# sam_controller.py (Odoo HTTP controller)

from odoo import http
from odoo.http import request
import json

class SamController(http.Controller):

    @http.route('/sam/chat', type='json', auth='user', methods=['POST'])
    def chat(self, message, **kwargs):
        """
        SAM chat endpoint
        Minimizes AI token usage by using controllers for knowledge extraction
        """
        user_id = request.env.user.id

        # PHASE 1: CONTEXT LOADING (NO AI - Pure controller queries)

        # Step 1: Detect question domain (simple keyword matching, no AI)
        domain = self._detect_domain(message)

        # Step 2: Search known knowledge (NO AI)
        known_knowledge = None

        if domain in ['architecture', 'implementation', 'technical']:
            # Search session history (pure grep, no AI)
            known_knowledge = request.env['sam.knowledge.search'].search_session_history(
                keywords=self._extract_keywords(message)
            )

            # Search architecture docs (pure data lookup, no AI)
            arch_knowledge = request.env['sam.architecture.knowledge'].get_architecture_answer(
                question_type=domain
            )

            if arch_knowledge['exists']:
                known_knowledge = {
                    'found': True,
                    'source': 'architecture_docs',
                    'answer': arch_knowledge
                }

        # Step 3: Get user context (pure SQL/ORM, no AI)
        user_context = request.env['sam.user.context'].get_user_context(user_id)

        # PHASE 2: DECIDE - AI or No AI?

        if known_knowledge and known_knowledge['found']:
            # Answer exists - AI only formats response (minimal tokens)
            response = self._format_known_answer(
                message=message,
                known_knowledge=known_knowledge,
                user_context=user_context
            )
            token_cost = response['token_cost']  # ~500 tokens (formatting only)
        else:
            # Unknown question - Full AI processing required
            response = self._ai_process_unknown(
                message=message,
                user_context=user_context
            )
            token_cost = response['token_cost']  # ~3000-5000 tokens (full reasoning)

        # PHASE 3: REMEMBER (NO AI - Pure database writes)
        self._save_conversation(user_id, message, response['text'])

        return {
            'response': response['text'],
            'token_cost': token_cost,
            'source': response['source'],  # 'known_knowledge' or 'ai_reasoning'
        }

    def _detect_domain(self, message):
        """Simple keyword matching - NO AI needed"""
        keywords = {
            'architecture': ['architecture', 'platform', 'skin', 'layer', 'structure'],
            'implementation': ['controller', 'model', 'service', 'code', 'exists'],
            'technical': ['ai_brain', 'graph', 'database', 'postgresql', 'query'],
            'user_question': ['how', 'what', 'why', 'when', 'where']
        }

        message_lower = message.lower()
        for domain, kws in keywords.items():
            if any(kw in message_lower for kw in kws):
                return domain

        return 'general'

    def _extract_keywords(self, message):
        """Extract search keywords - NO AI needed"""
        # Simple extraction: remove stop words, extract nouns
        stop_words = {'is', 'the', 'does', 'do', 'can', 'how', 'what', 'where'}
        words = message.lower().split()
        keywords = [w for w in words if w not in stop_words and len(w) > 3]
        return keywords

    def _format_known_answer(self, message, known_knowledge, user_context):
        """
        AI ONLY for formatting - Minimal tokens (~500)
        Answer already known, just make it natural
        """
        ai_service = request.env['ai.service']

        prompt = f"""
        User ({user_context['profile']['user_name']}) asked: {message}

        Known answer from {known_knowledge['source']}:
        {json.dumps(known_knowledge['answer'], indent=2)}

        Format this into a natural, conversational response.
        Be concise. Reference the source if helpful.
        """

        response = ai_service.generate_response(
            prompt=prompt,
            max_tokens=500,  # Minimal - just formatting
            temperature=0.7
        )

        return {
            'text': response['content'],
            'token_cost': response['usage']['total_tokens'],
            'source': 'known_knowledge'
        }

    def _ai_process_unknown(self, message, user_context):
        """
        Full AI processing for unknown questions
        Higher token cost (~3000-5000) but only when necessary
        """
        ai_service = request.env['ai.service']

        # Build full context (SAM personality, user profile, etc.)
        prompt = self._build_full_sam_prompt(message, user_context)

        response = ai_service.generate_response(
            prompt=prompt,
            max_tokens=2000,
            temperature=0.8
        )

        return {
            'text': response['content'],
            'token_cost': response['usage']['total_tokens'],
            'source': 'ai_reasoning'
        }

    def _save_conversation(self, user_id, message, response):
        """Save to database - NO AI needed"""
        conv = request.env['ai.conversation'].create({
            'user_id': user_id,
            'name': message[:50]  # First 50 chars as title
        })

        request.env['ai.message'].create([
            {'conversation_id': conv.id, 'role': 'user', 'content': message},
            {'conversation_id': conv.id, 'role': 'assistant', 'content': response}
        ])
```

---

## Token Cost Comparison

### Question: "Does the controller exist today?"

**❌ Old Approach (AI for everything):**
```
Search session history: 1,500 tokens
Read files: 1,000 tokens
Cross-reference code: 1,500 tokens
Synthesize answer: 1,000 tokens
──────────────────────────────
Total: ~5,000 tokens
Cost: ~$0.025 (at $5/M tokens)
```

**✅ New Approach (Controllers + Minimal AI):**
```
Controller searches session history: 0 tokens
Controller reads architecture docs: 0 tokens
Controller verifies code exists: 0 tokens
AI formats known answer: 500 tokens
──────────────────────────────
Total: ~500 tokens
Cost: ~$0.0025 (at $5/M tokens)
Savings: 90%
```

---

## The Dance Between Controllers and AI

### Controllers Handle (0 Tokens):
1. **Known Knowledge Extraction**
   - Search session history (grep/regex)
   - Query graph database (SQL/Cypher)
   - Read architecture docs (file I/O)
   - Lookup user profiles (ORM)
   - Fetch challenges/conversations (SQL)

2. **Simple Decisions**
   - Domain detection (keyword matching)
   - Keyword extraction (text processing)
   - Route to specialist (rule-based)

3. **Data Storage**
   - Save conversations (SQL insert)
   - Update graph nodes (Cypher create)
   - Track token usage (SQL update)

### AI Handles (Minimal Tokens):
1. **Response Synthesis**
   - Format known answers naturally (~500 tokens)
   - Adapt tone to user personality (~200 tokens)

2. **Unknown Questions**
   - Full reasoning required (~3000-5000 tokens)
   - Complex analysis needed

3. **Complex Decisions**
   - Should I delegate? (~300 tokens)
   - Which specialist? (~200 tokens)

---

## MD Files → Controllers Mapping

### How MD Files Become Controllers:

**1. session_history_research_protocol.md → knowledge_search_service.py**
```python
# Implements: Search session history without AI
# Token savings: ~1,500 tokens per search
```

**2. graph_memory_protocol.md → graph_memory_service.py**
```python
# Implements: Query graph nodes without AI
# Token savings: ~1,000 tokens per query
```

**3. specialist_routing.md → specialist_router_service.py**
```python
# Implements: Route to specialists (rule-based)
# Token savings: ~300 tokens per routing decision
```

**4. sam_personality_framework.md → personality_adapter.py**
```python
# Implements: Adapt tone to user (minimal AI)
# Token usage: ~200 tokens (formatting only)
```

**5. sam_protocol.md → sam_controller.py**
```python
# Implements: Orchestrate all services
# Token savings: 90% overall (controllers do heavy lifting)
```

---

## Scaling Impact

### At 1,000 conversations/day:

**❌ Old Approach (AI for everything):**
```
1,000 convs × 5,000 tokens = 5M tokens/day
Cost: $25/day = $750/month
```

**✅ New Approach (Controllers + Minimal AI):**
```
Known questions (80%): 800 × 500 tokens = 400K tokens
Unknown questions (20%): 200 × 4,000 tokens = 800K tokens
Total: 1.2M tokens/day
Cost: $6/day = $180/month
Savings: $570/month (76% reduction)
```

### At 10,000 conversations/day:
```
Old: $7,500/month
New: $1,800/month
Savings: $5,700/month
```

---

## Implementation Priority

### Phase 1: Core Controllers (No AI)
1. ✅ `knowledge_search_service.py` - Search session history
2. ✅ `architecture_knowledge_service.py` - Return pre-indexed architecture answers
3. ✅ `user_context_service.py` - Get user profile/challenges/graph data

### Phase 2: Orchestrator
4. ✅ `sam_controller.py` - Main chat endpoint (uses Phase 1 controllers)

### Phase 3: Optimization
5. ✅ `specialist_router_service.py` - Rule-based routing (no AI)
6. ✅ Cache common questions (0 tokens for repeated questions)

---

## SAM's Updated Philosophy

**Controllers = Knowledge, AI = Intelligence**

1. **Controllers extract knowledge** (0 tokens)
   - Session history search
   - Graph database queries
   - Architecture doc lookups
   - User profile retrieval

2. **AI synthesizes intelligence** (minimal tokens)
   - Format known answers naturally
   - Handle unknown questions
   - Make complex decisions

3. **90% token savings** on known questions
   - Known knowledge → Controllers handle it
   - Unknown questions → AI handles it
   - Smart routing = massive savings

**The dance:** Controllers gather ingredients (0 tokens), AI cooks the meal (minimal tokens).

---

**SAM's commitment:**
> "I use controllers to search, query, and extract knowledge. AI only when I need to synthesize or reason. 90% token savings through smart architecture." 🧠⚡
