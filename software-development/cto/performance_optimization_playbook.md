# Performance Optimization Playbook - CTO Knowledge Base

## Current Performance Issues (Identified from Session History)

### 10 Performance Refinement Opportunities
From [session-start.md](C:\Users\total\.claude\commands\session-start.md):

| # | Issue | Impact | Priority | Estimated Gain |
|---|-------|--------|----------|----------------|
| 1 | Hardcoded File Paths | Deployment brittleness | Medium | Reliability |
| 2 | Missing API Retry Logic | API failures cascade | High | Resilience |
| 3 | No Token Counter | Cost tracking blind spot | Medium | Cost control |
| 4 | Fixed Message History | Context underutilization | Medium | AI quality |
| **5** | **No Response Caching** | **Repeated Claude API calls** | **🔥 Critical** | **50-70% cost reduction** |
| **6** | **Context Builder Performance** | **Slow Odoo registry queries** | **🔥 Critical** | **3-5x faster** |
| 7 | No JSON Schema Validation | Workflow errors in production | Low | Data integrity |
| 8 | SQL Injection Risk | Security vulnerability | High | Security |
| 9 | No Rate Limiting | API abuse potential | Medium | Cost/Security |
| 10 | Unused Trust Score | Missed personalization | Low | User experience |

---

## High-Impact Quick Wins

### 🔥 Refinement #5: Response Caching (HIGHEST ROI)

#### Problem
```python
# Current: Every request hits Claude API
response = claude_api.messages.create(
    model="claude-3-sonnet",
    messages=conversation_history
)
# Cost: $0.003 per 1K input tokens, $0.015 per 1K output tokens
# Repeated identical questions = wasted $$$
```

#### Solution: Redis Caching Layer
```python
import redis
import hashlib
import json

class ClaudeResponseCache:
    def __init__(self):
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
        self.ttl = 3600  # 1 hour cache

    def cache_key(self, messages, model):
        """Generate cache key from conversation context"""
        content = json.dumps(messages, sort_keys=True)
        return f"claude:{model}:{hashlib.sha256(content.encode()).hexdigest()}"

    def get_cached_response(self, messages, model):
        """Retrieve cached response if exists"""
        key = self.cache_key(messages, model)
        cached = self.redis_client.get(key)
        if cached:
            return json.loads(cached)
        return None

    def cache_response(self, messages, model, response):
        """Cache API response"""
        key = self.cache_key(messages, model)
        self.redis_client.setex(key, self.ttl, json.dumps(response))

# Usage in ai_service.py
cache = ClaudeResponseCache()
cached_response = cache.get_cached_response(messages, model)

if cached_response:
    return cached_response  # No API call!
else:
    response = claude_api.messages.create(...)
    cache.cache_response(messages, model, response)
    return response
```

**Expected Impact:**
- **Cache Hit Rate:** 30-50% (repeated questions, similar prompts)
- **Cost Savings:** $60-150/month (based on 23.2M tokens consumed)
- **Latency Improvement:** 2-3 seconds faster (no API roundtrip)

**Implementation Time:** 4-6 hours

---

### 🔥 Refinement #6: Context Builder Performance

#### Problem (from ai_service.py analysis)
```python
# Current: Browsing records individually (N+1 query problem)
for record in odoo_model.browse([1, 2, 3, 4, 5]):
    data = record.name  # Database query for EACH record
    context += data
# Result: 5 records = 5 database queries
```

#### Solution: Batch Read Operations
```python
# Optimized: Single batch query
record_ids = [1, 2, 3, 4, 5]
records_data = odoo_model.read(record_ids, ['name', 'description', 'related_field'])
# Result: 5 records = 1 database query

# Build context from batch data
context = "\n".join(rec['name'] for rec in records_data)
```

**Before (N+1 queries):**
```sql
-- 5 separate queries
SELECT * FROM ai_brain_model WHERE id = 1;
SELECT * FROM ai_brain_model WHERE id = 2;
SELECT * FROM ai_brain_model WHERE id = 3;
SELECT * FROM ai_brain_model WHERE id = 4;
SELECT * FROM ai_brain_model WHERE id = 5;
```

**After (1 batch query):**
```sql
-- Single query with IN clause
SELECT id, name, description FROM ai_brain_model WHERE id IN (1,2,3,4,5);
```

**Expected Impact:**
- **Query Reduction:** 100+ queries → 10-20 queries per context build
- **Latency Improvement:** 500ms → 100ms (5x faster)
- **Database Load:** 80% reduction in query volume

**Implementation Time:** 2-3 hours

---

## Database Optimization Strategies

### Query Performance Analysis

#### Step 1: Enable Query Logging
**PostgreSQL configuration:**
```ini
# postgresql.conf
log_min_duration_statement = 1000  # Log queries > 1 second
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d '
```

#### Step 2: Install pg_stat_statements
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slowest queries
SELECT
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY mean_exec_time DESC
LIMIT 20;
```

#### Step 3: Identify Missing Indexes
```sql
-- Find tables with sequential scans (missing indexes)
SELECT
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    seq_tup_read / seq_scan AS avg_seq_tup_read
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC
LIMIT 20;
```

**Rule of Thumb:**
- `seq_scan` > 1000 AND `idx_scan` = 0 → Missing index likely needed
- `avg_seq_tup_read` > 10,000 → Definitely needs index

---

### Indexing Strategy for SAM AI

#### ai_brain Models (40+ tables)
**High-Priority Indexes:**

```sql
-- User profiles (frequently queried by user_id)
CREATE INDEX idx_ai_user_profile_user_id ON ai_user_profile(user_id);
CREATE INDEX idx_ai_user_profile_active ON ai_user_profile(active) WHERE active = TRUE;

-- Conversations (queried by user, by date)
CREATE INDEX idx_ai_conversation_user_date ON ai_conversation(user_id, create_date DESC);
CREATE INDEX idx_ai_conversation_status ON ai_conversation(status);

-- Messages (queried by conversation, by role)
CREATE INDEX idx_ai_message_conversation ON ai_message(conversation_id, sequence);
CREATE INDEX idx_ai_message_role ON ai_message(role);  -- 'user' vs 'assistant'

-- Token usage (for cost tracking)
CREATE INDEX idx_ai_token_usage_user_date ON ai_token_usage(user_id, usage_date DESC);
CREATE INDEX idx_ai_token_usage_model ON ai_token_usage(model_name);

-- Canvas nodes (spatial queries)
CREATE INDEX idx_canvas_node_platform ON canvas_node(platform_id);
CREATE INDEX idx_canvas_node_position ON canvas_node USING GIST(position);  -- Spatial index

-- N8N workflows
CREATE INDEX idx_n8n_workflow_status ON n8n_workflow(status);
CREATE INDEX idx_n8n_execution_workflow_date ON n8n_execution(workflow_id, execution_date DESC);
```

**Index Maintenance:**
```sql
-- Rebuild bloated indexes (monthly maintenance)
REINDEX INDEX CONCURRENTLY idx_ai_conversation_user_date;

-- Analyze tables after bulk inserts (refresh statistics)
ANALYZE ai_conversation;
ANALYZE ai_message;
```

---

### Connection Pooling (PgBouncer)

#### Problem: Odoo Opens Too Many Connections
**Scenario:**
- 4 Odoo workers × 2 connections each = 8 connections
- 100 concurrent users × 2 connections = 200 connections
- PostgreSQL max_connections = 200 (default) → **Connection limit reached!**

#### Solution: PgBouncer (Connection Pooler)
**Architecture:**
```
Odoo Workers (100 connections)
        ↓
   PgBouncer (pool)
        ↓
PostgreSQL (20 actual connections)
```

**PgBouncer Configuration:**
```ini
[databases]
sam_ai_prod = host=localhost dbname=sam_ai_prod

[pgbouncer]
pool_mode = transaction           # Best for Odoo
max_client_conn = 1000            # Max incoming connections
default_pool_size = 20            # Actual PostgreSQL connections
reserve_pool_size = 5             # Emergency reserve
```

**Expected Impact:**
- **Connection Limit:** 1000 concurrent clients (vs. 200 before)
- **Database Load:** Reduced connection overhead
- **Query Performance:** Faster connection handoffs

**Implementation Time:** 2 hours

---

## Caching Strategies (Beyond Redis)

### Level 1: Application-Level Caching (Redis)
**Use Cases:**
- Claude API responses (refinement #5)
- User session data (Odoo multi-worker requirement)
- Frequently accessed Odoo records (user profiles, settings)

**TTL Recommendations:**
| Data Type | TTL | Rationale |
|-----------|-----|-----------|
| Claude API response | 1 hour | Questions repeated in session |
| User profile | 15 minutes | Changes infrequently |
| Conversation history | 5 minutes | Active conversation context |
| Token usage stats | 1 hour | Real-time not critical |

### Level 2: Database Query Result Caching (Odoo ORM)
**Odoo Built-In Caching:**
```python
# Odoo caches field values automatically
record = env['ai.user.profile'].browse(user_id)
name = record.name  # Cached after first access

# Invalidate cache when updating
record.write({'name': 'New Name'})  # Auto-invalidates cache
```

**Custom Caching for Expensive Queries:**
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_user_conversation_summary(user_id):
    """Cached summary - expires on process restart"""
    conversations = env['ai.conversation'].search([
        ('user_id', '=', user_id),
        ('create_date', '>=', fields.Datetime.now() - timedelta(days=30))
    ])
    return {
        'count': len(conversations),
        'total_tokens': sum(c.token_count for c in conversations)
    }
```

### Level 3: HTTP Response Caching (nginx)
**Static Assets:**
```nginx
# nginx configuration
location /web/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /web/image/ {
    expires 30d;
    add_header Cache-Control "public";
}
```

---

## API Optimization

### Refinement #2: API Retry Logic (Resilience)

#### Problem
```python
# Current: Single API call, fails permanently
try:
    response = claude_api.messages.create(...)
except Exception as e:
    # Error logged, user sees failure
    return {"error": str(e)}
```

#### Solution: Exponential Backoff with Retries
```python
import time
from anthropic import APIError, RateLimitError

def call_claude_with_retry(messages, max_retries=3):
    """Retry Claude API with exponential backoff"""
    for attempt in range(max_retries):
        try:
            response = claude_api.messages.create(
                model="claude-3-sonnet-20240229",
                messages=messages,
                max_tokens=4096
            )
            return response

        except RateLimitError:
            # Rate limit hit - wait longer
            wait_time = (2 ** attempt) * 2  # 2s, 4s, 8s
            time.sleep(wait_time)
            continue

        except APIError as e:
            if e.status_code >= 500:
                # Server error - retry
                wait_time = 2 ** attempt  # 1s, 2s, 4s
                time.sleep(wait_time)
                continue
            else:
                # Client error (400-499) - don't retry
                raise

        except Exception as e:
            # Unknown error - final attempt
            if attempt == max_retries - 1:
                raise
            time.sleep(1)

    raise Exception("Max retries exceeded")
```

**Expected Impact:**
- **Success Rate:** 95% → 99.5% (handles transient failures)
- **User Experience:** Fewer "API unavailable" errors
- **Cost:** Minimal (only retries on failures)

---

### Refinement #3: Token Counter (Cost Tracking)

#### Problem
```python
# Current: Token usage tracked AFTER API call
response = claude_api.messages.create(...)
tokens_used = response.usage.input_tokens + response.usage.output_tokens
# But what if we exceed budget mid-conversation?
```

#### Solution: Pre-Call Token Estimation
```python
import tiktoken

class TokenEstimator:
    def __init__(self, model="claude-3-sonnet-20240229"):
        # Claude uses cl100k_base encoding (GPT-4 family)
        self.encoding = tiktoken.get_encoding("cl100k_base")

    def count_tokens(self, text):
        """Count tokens in text"""
        return len(self.encoding.encode(text))

    def estimate_conversation_tokens(self, messages):
        """Estimate tokens for full conversation"""
        total = 0
        for message in messages:
            total += self.count_tokens(message['content'])
            total += 4  # Overhead per message
        total += 2  # Conversation overhead
        return total

    def check_budget(self, user_id, estimated_tokens):
        """Check if user has budget for request"""
        usage = env['ai.token.usage'].search([
            ('user_id', '=', user_id),
            ('usage_date', '=', fields.Date.today())
        ])
        daily_usage = sum(u.total_tokens for u in usage)
        daily_limit = 1000000  # 1M tokens/day

        if daily_usage + estimated_tokens > daily_limit:
            return False, f"Daily limit exceeded ({daily_usage}/{daily_limit})"
        return True, "OK"

# Usage
estimator = TokenEstimator()
estimated = estimator.estimate_conversation_tokens(messages)
can_proceed, msg = estimator.check_budget(user_id, estimated)

if can_proceed:
    response = claude_api.messages.create(...)
else:
    return {"error": msg}
```

**Expected Impact:**
- **Budget Control:** Prevent overspending BEFORE API call
- **User Experience:** Clear error messages ("Daily limit reached")
- **Cost Tracking:** Accurate daily/monthly burn rate

---

### Refinement #4: Smart Conversation History (Context Optimization)

#### Problem
```python
# Current: Fixed 10-message history
conversation_history = messages[-10:]  # Truncates arbitrarily
# Result: May lose critical context OR waste tokens
```

#### Solution: Token-Based Sliding Window
```python
class ConversationContextBuilder:
    def __init__(self, max_tokens=8000):  # Leave room for response
        self.max_tokens = max_tokens
        self.estimator = TokenEstimator()

    def build_context(self, messages, system_prompt):
        """Build optimal context within token budget"""
        context = [{"role": "system", "content": system_prompt}]
        token_count = self.estimator.count_tokens(system_prompt) + 4

        # Always include last message (user's question)
        last_msg = messages[-1]
        last_tokens = self.estimator.count_tokens(last_msg['content']) + 4
        context.append(last_msg)
        token_count += last_tokens

        # Add previous messages in reverse order (newest first)
        for msg in reversed(messages[:-1]):
            msg_tokens = self.estimator.count_tokens(msg['content']) + 4
            if token_count + msg_tokens > self.max_tokens:
                break  # Hit limit
            context.insert(1, msg)  # Insert after system prompt
            token_count += msg_tokens

        return context, token_count

# Usage
builder = ConversationContextBuilder(max_tokens=8000)
context, token_count = builder.build_context(all_messages, system_prompt)
# Maximizes context utilization within budget
```

**Expected Impact:**
- **Context Quality:** 30-50% more history included (vs. fixed count)
- **API Efficiency:** No wasted tokens on truncation
- **AI Quality:** Better continuity in long conversations

---

## Performance Monitoring

### Key Metrics to Track

#### Application Metrics
```python
# Custom metrics to add to SAM AI
class PerformanceMetrics(models.Model):
    _name = 'ai.performance.metric'

    timestamp = fields.Datetime(default=fields.Datetime.now)
    metric_type = fields.Selection([
        ('api_latency', 'Claude API Latency'),
        ('cache_hit_rate', 'Cache Hit Rate'),
        ('db_query_time', 'Database Query Time'),
        ('context_build_time', 'Context Builder Time')
    ])
    value = fields.Float()
    user_id = fields.Many2one('res.users')
```

**Dashboard Queries:**
```sql
-- Average API latency (last hour)
SELECT AVG(value) FROM ai_performance_metric
WHERE metric_type = 'api_latency'
  AND timestamp > NOW() - INTERVAL '1 hour';

-- Cache hit rate (last 24 hours)
SELECT
    (SUM(CASE WHEN value = 1 THEN 1 ELSE 0 END)::float / COUNT(*)) * 100 AS hit_rate_pct
FROM ai_performance_metric
WHERE metric_type = 'cache_hit_rate'
  AND timestamp > NOW() - INTERVAL '24 hours';
```

#### Database Metrics (PostgreSQL)
```sql
-- Connection pool usage
SELECT count(*) AS active_connections,
       max_conn - count(*) AS available_connections
FROM pg_stat_activity,
     (SELECT setting::int AS max_conn FROM pg_settings WHERE name='max_connections') AS mc;

-- Cache hit ratio (should be > 99%)
SELECT
    sum(heap_blks_read) AS heap_read,
    sum(heap_blks_hit) AS heap_hit,
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) AS cache_hit_ratio
FROM pg_statio_user_tables;

-- Table bloat (vacuum needed?)
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_dead_tup
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
```

---

## Performance Testing

### Load Testing Setup

#### Step 1: Install Locust
```bash
pip install locust
```

#### Step 2: Create Load Test Script
```python
# locustfile.py
from locust import HttpUser, task, between

class SAMAIUser(HttpUser):
    wait_time = between(1, 3)  # 1-3 seconds between requests

    def on_start(self):
        """Login before tests"""
        self.client.post("/web/login", {
            "login": "test@example.com",
            "password": "password"
        })

    @task(3)  # 3x more frequent than other tasks
    def view_conversations(self):
        """Most common: View conversation history"""
        self.client.get("/ai/conversations")

    @task(2)
    def send_message(self):
        """Send AI message"""
        self.client.post("/ai/message", json={
            "message": "Hello, how can you help me?",
            "conversation_id": 123
        })

    @task(1)
    def create_canvas_node(self):
        """Create canvas node"""
        self.client.post("/canvas/node", json={
            "title": "Test Node",
            "platform_id": 1,
            "position_x": 100,
            "position_y": 200
        })
```

#### Step 3: Run Load Test
```bash
# Simulate 100 concurrent users
locust -f locustfile.py --users 100 --spawn-rate 10 --host https://staging.samai.com

# Watch for:
# - Median response time < 500ms (good)
# - 95th percentile < 2s (acceptable)
# - 0% error rate (critical)
```

### Performance Benchmarks

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| **API Response Time** | < 300ms | < 1s | > 2s |
| **Database Query Time** | < 50ms | < 200ms | > 500ms |
| **Cache Hit Rate** | > 70% | > 50% | < 30% |
| **Concurrent Users** | 100+ | 50+ | < 20 |
| **Database CPU** | < 50% | < 75% | > 90% |
| **Memory Usage** | < 60% | < 80% | > 95% |

---

## Performance Optimization Roadmap

### Phase 1: Quick Wins (1-2 Weeks)
- [ ] Implement Redis caching (refinement #5)
- [ ] Optimize context builder (refinement #6)
- [ ] Add API retry logic (refinement #2)
- [ ] Enable PostgreSQL slow query logging
- [ ] Create performance monitoring dashboard

**Expected Impact:** 50-70% cost reduction, 3-5x faster queries

### Phase 2: Database Tuning (2-4 Weeks)
- [ ] Add missing indexes (from pg_stat analysis)
- [ ] Implement PgBouncer connection pooling
- [ ] Configure PostgreSQL for SSD/RAM
- [ ] Set up automated VACUUM scheduling

**Expected Impact:** 2-3x database throughput

### Phase 3: Advanced Optimization (1-2 Months)
- [ ] Token-based conversation history (refinement #4)
- [ ] Pre-call token estimation (refinement #3)
- [ ] Rate limiting per user (refinement #9)
- [ ] JSON schema validation (refinement #7)
- [ ] SQL injection audit (refinement #8)

**Expected Impact:** Enhanced reliability, security, cost control

### Phase 4: Scale Preparation (2-3 Months)
- [ ] Load testing (100-1000 concurrent users)
- [ ] Database read replicas
- [ ] CDN for static assets
- [ ] Horizontal Odoo scaling (2+ servers)

**Expected Impact:** 10x capacity increase

---

**CTO Performance Philosophy:**
> Measure first, optimize second. 80% of performance gains come from 20% of optimizations. Focus on bottlenecks, not hypotheticals.

**Priority Order:**
1. **Cache API responses** (refinement #5) → Biggest cost/latency win
2. **Fix context builder** (refinement #6) → Biggest database win
3. **Add indexes** → Lowest-effort, high-return
4. **Everything else** → When needed, not before
