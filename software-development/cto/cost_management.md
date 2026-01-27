# Cost Management - CTO Knowledge Base

## Current Cost Baseline (Extracted from History)

### Development Phase Costs (Pre-Launch)
**Time Investment:**
- **Development Hours:** 200+ hours invested
- **Value (at $150/hr consultant rate):** $30,000+

**Claude API Usage:**
- **Total Tokens Consumed:** 23,200,000 tokens (23.2M)
- **Breakdown (estimated):**
  - Input tokens: ~18.5M (80%)
  - Output tokens: ~4.7M (20%)

**Claude API Cost (estimated):**
```
Model: Claude 3 Sonnet
Input:  18,500,000 tokens × $0.003/1K = $55.50
Output: 4,700,000 tokens × $0.015/1K = $70.50
Total: ~$126
```

**Infrastructure Costs:**
- **Development Environment:** $0 (local Windows machine)
- **PostgreSQL:** $0 (local installation)
- **Total Infrastructure:** $0/month (pre-launch)

**Total Development Cost to Date:** ~$126 (API only)

---

## Cost Structure Breakdown

### 1. Infrastructure Costs (Cloud Hosting)

#### Phase 1: Launch (0-100 users)
| Component | Specification | Monthly Cost |
|-----------|---------------|--------------|
| **Server** | 4 vCPU, 8 GB RAM (Hetzner CX41) | $16 |
| **Storage** | 160 GB SSD (included) | $0 |
| **PostgreSQL** | Self-hosted on same server | $0 |
| **Redis** | Docker container (512 MB) | $0 |
| **ChromaDB** | Docker container (1 GB) | $0 |
| **Backups** | Backblaze B2 (10 GB) | $0.50 |
| **CDN** | CloudFlare (free tier) | $0 |
| **Domain** | .com domain + SSL (Let's Encrypt) | $1 |
| **Monitoring** | Netdata (self-hosted) | $0 |
| **Total** |  | **$17.50/month** |

**Alternative (DigitalOcean Managed):**
| Component | Specification | Monthly Cost |
|-----------|---------------|--------------|
| **Droplet** | 2 vCPU, 4 GB RAM | $24 |
| **Managed PostgreSQL** | 1 GB RAM, 10 GB disk | $15 |
| **Managed Redis** | 25 MB | $0 (free tier) | **Total** |  | **$39/month** |

---

#### Phase 2: Growth (100-1,000 users)
| Component | Specification | Monthly Cost |
|-----------|---------------|--------------|
| **Odoo Server** | 8 vCPU, 16 GB RAM (DigitalOcean) | $96 |
| **PostgreSQL** | Managed, 4 vCPU, 8 GB RAM | $120 |
| **Redis** | Managed, 2 GB | $30 |
| **ChromaDB** | 4 vCPU, 4 GB RAM | $48 |
| **Load Balancer** | Managed LB | $12 |
| **Backups** | 100 GB on B2 | $5 |
| **CDN** | CloudFlare Pro (optimization) | $20 |
| **Monitoring** | New Relic (5 hosts) | $99 |
| **Total** |  | **$430/month** |

---

#### Phase 3: Scale (1,000-10,000 users)
| Component | Specification | Monthly Cost |
|-----------|---------------|--------------|
| **Kubernetes Cluster** | 5 nodes × t3.xlarge (AWS EKS) | $730 |
| **PostgreSQL Cluster** | Primary + 2 replicas (RDS) | $900 |
| **Redis Cluster** | 6 nodes (ElastiCache) | $360 |
| **Load Balancer** | AWS ALB | $25 |
| **S3 Storage** | 500 GB (filestore, backups) | $12 |
| **CloudFront CDN** | 1 TB transfer | $85 |
| **Monitoring** | DataDog (10 hosts, APM) | $270 |
| **Backups** | AWS Backup (daily snapshots) | $50 |
| **Total** |  | **$2,432/month** |

---

### 2. Claude API Costs (Variable by Usage)

#### Cost Calculation Model
**Claude 3 Sonnet Pricing (as of 2025):**
- Input tokens: $0.003 per 1,000 tokens
- Output tokens: $0.015 per 1,000 tokens

**Average Conversation Pattern (from history analysis):**
```
User message: ~100 tokens
System prompt + context: ~2,000 tokens
Claude response: ~500 tokens

Total per interaction:
- Input: 2,100 tokens × $0.003/1K = $0.0063
- Output: 500 tokens × $0.015/1K = $0.0075
- Cost per interaction: $0.0138 (~$0.014)
```

#### Usage-Based Cost Projections
| Users | Daily Msgs/User | Monthly Msgs | Monthly Cost |
|-------|-----------------|--------------|--------------|
| 10 | 10 | 3,000 | $42 |
| 100 | 10 | 30,000 | $420 |
| 500 | 8 | 120,000 | $1,680 |
| 1,000 | 5 | 150,000 | $2,100 |
| 5,000 | 5 | 750,000 | $10,500 |
| 10,000 | 3 | 900,000 | $12,600 |

**Key Assumption:** Power users send more messages, casual users send fewer (blended average)

---

#### Caching Impact on API Costs (Refinement #5)
**Without Caching:**
- 100 users × 300 messages/month = 30,000 API calls
- Cost: $420/month

**With 50% Cache Hit Rate:**
- Unique queries: 15,000 API calls
- Cached responses: 15,000 (no cost)
- Cost: $210/month
- **Savings: $210/month (50%)**

**With 70% Cache Hit Rate (aggressive caching):**
- Unique queries: 9,000 API calls
- Cost: $126/month
- **Savings: $294/month (70%)**

**ROI of Caching:**
- Redis hosting cost: $15/month (managed, 1 GB)
- Savings: $210-294/month
- **Net savings: $195-279/month**
- **Payback period: Immediate**

---

### 3. External Service Costs

| Service | Purpose | Free Tier | Paid Tier Cost |
|---------|---------|-----------|----------------|
| **Apache AGE** | Graph database (PostgreSQL extension) | ✅ Open-source | $0 |
| **ChromaDB** | Vector database | ✅ Self-hosted | $0 (or $49/mo cloud) |
| **N8N** | Workflow automation | ✅ Self-hosted | $0 (or $20/mo cloud) |
| **Sentry** | Error tracking | 5K events/month | $26/mo (50K events) |
| **UptimeRobot** | Uptime monitoring | 50 monitors | $7/mo (unlimited) |
| **Backblaze B2** | Backup storage | 10 GB free | $0.005/GB/month |
| **Let's Encrypt** | SSL certificates | ✅ Free | $0 |
| **CloudFlare** | CDN + DDoS protection | ✅ Free tier | $20/mo (Pro) |
| **Loggly** | Log aggregation | 200 MB/day | $79/mo (1 GB/day) |
| **PagerDuty** | On-call alerts | 1 user free | $19/user/month |

**Recommended Free Tier Stack (Launch Phase):**
- Total monthly cost: **$0** (use all free tiers)

**Recommended Paid Stack (Growth Phase):**
- Total monthly cost: **$151** (upgrade critical services)

---

## Cost Optimization Strategies

### Strategy 1: Aggressive API Caching (Highest ROI)

#### Implementation Priority
1. **Cache identical queries** (exact match)
   ```python
   # Hash conversation history → cache key
   cache_key = hashlib.sha256(json.dumps(messages).encode()).hexdigest()
   ```
   **Expected hit rate:** 30-40%

2. **Cache similar queries** (semantic similarity)
   ```python
   # Use embeddings to find similar questions
   query_embedding = embed_query(user_message)
   similar_queries = chromadb.query(query_embedding, n_results=1, distance_threshold=0.1)
   if similar_queries:
       return cached_response
   ```
   **Expected hit rate:** 50-60% (combined)

3. **Cache system prompts** (context reuse)
   ```python
   # Cache common system prompts separately
   system_prompt_cache_key = f"system:{hash(system_prompt)}"
   ```
   **Expected hit rate:** 70-80% (combined)

**Cost Impact:**
- 100 users: $420 → $126/month (**$294 savings**)
- 1,000 users: $2,100 → $630/month (**$1,470 savings**)

---

### Strategy 2: Token Usage Optimization

#### Technique 1: Reduce System Prompt Size
**Current (estimated):**
```
System prompt: 1,500 tokens
Context (Odoo registry): 500 tokens
Total input overhead: 2,000 tokens per request
```

**Optimized:**
```
System prompt (compressed): 800 tokens
Context (cached, selective): 200 tokens
Total input overhead: 1,000 tokens per request
```

**Cost Impact:**
- **50% reduction** in input tokens
- 100 users: $420 → $315/month ($105 savings)

#### Technique 2: Conversation History Pruning (Refinement #4)
**Current:** Fixed 10-message history (may include irrelevant messages)

**Optimized:** Token-budget sliding window
```python
# Keep only relevant context within budget
context = build_token_optimized_context(messages, max_tokens=4000)
```

**Cost Impact:**
- **20-30% reduction** in wasted context tokens
- Better AI responses (more relevant context)

#### Technique 3: Model Selection by Complexity
**Strategy:**
- Simple queries → Claude 3 Haiku ($0.00025 input, $0.00125 output) - **5x cheaper**
- Complex queries → Claude 3 Sonnet
- Critical queries → Claude 3 Opus (premium, if needed)

**Query Classification:**
```python
def classify_query_complexity(message):
    keywords_simple = ['hello', 'help', 'status', 'list']
    keywords_complex = ['analyze', 'explain', 'create', 'design']

    if any(kw in message.lower() for kw in keywords_simple):
        return 'haiku'  # Cheap model
    elif any(kw in message.lower() for kw in keywords_complex):
        return 'sonnet'  # Standard model
    else:
        return 'sonnet'  # Default
```

**Cost Impact (if 50% queries use Haiku):**
- Haiku queries: 15,000 × $0.0025 = $37.50
- Sonnet queries: 15,000 × $0.014 = $210
- **Total:** $247.50 (vs. $420)
- **Savings: $172.50/month (41%)**

---

### Strategy 3: Infrastructure Optimization

#### Rightsize Servers (Avoid Over-Provisioning)
**Common mistake:** Launching with t3.2xlarge (8 vCPU, 32 GB) for 10 users

**Right approach:**
- **0-100 users:** t3.small (2 vCPU, 2 GB) - $17/month
- **100-500 users:** t3.medium (2 vCPU, 4 GB) - $34/month
- **500-1,000 users:** t3.large (2 vCPU, 8 GB) - $68/month
- **1,000+ users:** Auto-scaling cluster

**Savings:** $200-300/month (vs. over-provisioning)

#### Use Spot Instances (AWS/GCP)
**Strategy:** Run non-critical workloads (batch jobs, N8N workflows) on spot instances

**Pricing:**
- On-Demand t3.medium: $0.0416/hour ($30/month)
- Spot t3.medium: $0.0125/hour ($9/month)
- **Savings: 70%**

**Risk:** Spot instances can be terminated (acceptable for stateless workloads)

#### Reserved Instances (1-year commitment)
**For predictable workloads:**
- On-Demand t3.xlarge: $0.166/hour ($120/month)
- 1-year Reserved: $0.103/hour ($75/month)
- **Savings: 38%**

**Recommendation:** Reserve database and cache instances (predictable), keep Odoo servers on-demand (flexible)

---

### Strategy 4: Self-Hosting vs. Managed Services

#### Cost Comparison: PostgreSQL
| Option | Specification | Monthly Cost | Management Effort |
|--------|---------------|--------------|-------------------|
| **Self-Hosted (Hetzner)** | 4 vCPU, 8 GB RAM | $16 | High (setup, backups, updates) |
| **Managed (DigitalOcean)** | 4 vCPU, 8 GB RAM | $120 | Low (automated backups, HA) |
| **Managed (AWS RDS)** | db.t3.large (2 vCPU, 8 GB) | $136 | Low (enterprise features) |

**Decision Framework:**
- **Pre-launch / Solo founder:** Self-hosted (save $100+/month)
- **Post-launch / Small team:** Managed (worth $100/month for time savings)
- **Scale phase:** Managed (reliability > cost)

#### Break-Even Analysis
**Time saved with managed services:** 5-10 hours/month
**Hourly value of founder time:** $100-200/hour
**Value of time saved:** $500-2,000/month

**If managed service costs < time saved:** Use managed
**Example:** Managed PostgreSQL ($120) vs. 8 hours of DBA work ($800) → **Use managed**

---

## Revenue & Unit Economics

### Pricing Model Options

#### Option 1: Per-User Subscription (SaaS Standard)
**Tiers:**
| Tier | Price | Monthly Messages | Target User |
|------|-------|------------------|-------------|
| **Free** | $0 | 50 messages | Trial users |
| **Starter** | $19/month | 500 messages | Individual users |
| **Pro** | $49/month | 2,000 messages | Power users |
| **Business** | $99/month | 10,000 messages | Teams |
| **Enterprise** | Custom | Unlimited | Large orgs |

**Expected Distribution (based on SaaS benchmarks):**
- Free: 60%
- Starter: 25%
- Pro: 10%
- Business: 4%
- Enterprise: 1%

#### Option 2: Token-Based (Pay-As-You-Go)
**Pricing:**
- Base: $10/month (includes 1,000 messages)
- Overage: $0.02 per message (2x markup on Claude API cost)

**Pros:** Simple, scales with usage
**Cons:** Unpredictable revenue, harder to forecast

#### Option 3: Freemium + Add-Ons
**Base:**
- Free tier: 50 messages/month
- Pro tier: $29/month (unlimited messages)

**Add-Ons:**
- Canvas platform skins: +$10/month per platform
- N8N workflow automation: +$15/month
- Priority support: +$20/month
- API access: +$50/month

---

### Unit Economics (Break-Even Analysis)

#### Cost Per User (Monthly)
**At 100 Users:**
| Cost Component | Per-User Cost |
|----------------|---------------|
| Infrastructure (Phase 1) | $17.50 ÷ 100 = **$0.18** |
| Claude API (10 msgs/day) | **$4.20** |
| External services | $0.50 ÷ 100 = **$0.01** |
| **Total Cost Per User** | **$4.39** |

**At 1,000 Users:**
| Cost Component | Per-User Cost |
|----------------|---------------|
| Infrastructure (Phase 2) | $430 ÷ 1,000 = **$0.43** |
| Claude API (5 msgs/day) | **$2.10** |
| External services | $151 ÷ 1,000 = **$0.15** |
| **Total Cost Per User** | **$2.68** |

**Key Insight:** Cost per user **decreases** with scale (economies of scale)

---

#### Revenue Per User (ARPU)
**Scenario: 60% free, 40% paid (average $25/month)**
```
1,000 users:
- Free users: 600 × $0 = $0
- Paid users: 400 × $25 = $10,000
ARPU = $10,000 ÷ 1,000 = $10/user
```

#### Contribution Margin
```
Revenue per user: $10
Cost per user: $2.68
Contribution margin: $10 - $2.68 = $7.32 (73%)
```

**Benchmark:** SaaS contribution margin should be > 70% (SAM AI: ✅)

---

#### Customer Lifetime Value (LTV)
**Assumptions:**
- Average customer lifetime: 24 months (2 years)
- Monthly churn rate: 4% (typical SaaS)

**LTV Calculation:**
```
ARPU = $10/month
Customer lifetime = 1 ÷ churn rate = 1 ÷ 0.04 = 25 months
LTV = $10 × 25 = $250
```

#### Customer Acquisition Cost (CAC) Target
**Rule of thumb:** LTV:CAC ratio should be **3:1**

```
Target CAC = LTV ÷ 3 = $250 ÷ 3 = $83
```

**Implication:** Can afford to spend **$83** to acquire each customer (via ads, content marketing, sales)

---

### Break-Even Analysis

#### Monthly Break-Even (Covering Costs)
**Phase 1 (100 users):**
```
Fixed costs (infrastructure + services): $68/month
Variable costs (API): $420/month
Total costs: $488/month

Revenue needed:
- At $19/user → 26 paid users (26% conversion)
- At $49/user → 10 paid users (10% conversion)
```

**Phase 2 (1,000 users):**
```
Fixed costs: $581/month
Variable costs (API): $2,100/month
Total costs: $2,681/month

Revenue needed:
- At $19/user → 141 paid users (14% conversion)
- At $49/user → 55 paid users (5.5% conversion)
```

**Key Insight:** At scale, need **10-15% paid conversion** to break even (achievable with freemium)

---

## Cost Monitoring & Alerts

### Real-Time Cost Dashboard (Grafana + Prometheus)

#### Metrics to Track
```python
# Custom cost metrics
class CostMetrics(models.Model):
    _name = 'ai.cost.metric'

    date = fields.Date(default=fields.Date.today)
    metric_type = fields.Selection([
        ('api_cost', 'Claude API Cost'),
        ('infrastructure_cost', 'Cloud Infrastructure'),
        ('storage_cost', 'Backup Storage'),
        ('bandwidth_cost', 'CDN Bandwidth')
    ])
    cost_usd = fields.Float()
    budget_usd = fields.Float()  # Daily/monthly budget
```

#### Cost Queries
```sql
-- Daily Claude API cost
SELECT
    DATE(timestamp) AS date,
    SUM((input_tokens * 0.003 / 1000) + (output_tokens * 0.015 / 1000)) AS daily_cost
FROM ai_token_usage
WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Cost per user
SELECT
    user_id,
    SUM((input_tokens * 0.003 / 1000) + (output_tokens * 0.015 / 1000)) AS user_cost
FROM ai_token_usage
WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY user_id
ORDER BY user_cost DESC
LIMIT 10;  -- Top 10 most expensive users
```

---

### Cost Alerts (PagerDuty/Email)

#### Alert Thresholds
| Alert | Threshold | Action |
|-------|-----------|--------|
| **Daily API cost > $100** | Critical | Review usage, check for abuse |
| **Monthly burn rate > $5,000** | Warning | Evaluate scaling strategy |
| **Cost per user > $10** | Warning | Optimize caching, model selection |
| **Cache hit rate < 40%** | Info | Improve caching logic |
| **Free tier usage > 80%** | Info | Upgrade or optimize |

#### Implementation
```python
# Daily cost check (cron job)
def check_daily_cost_threshold():
    today_cost = env['ai.cost.metric'].search([
        ('date', '=', fields.Date.today()),
        ('metric_type', '=', 'api_cost')
    ]).cost_usd

    if today_cost > 100:
        send_alert(
            level='CRITICAL',
            message=f'Daily API cost exceeded $100: ${today_cost:.2f}'
        )
```

---

## Cost Reduction Checklist

### Immediate (0-1 Week)
- [ ] Implement Redis API caching (refinement #5) - **Save 50-70%**
- [ ] Optimize context builder (refinement #6) - **3-5x faster queries**
- [ ] Enable CloudFlare CDN (free tier) - **Reduce bandwidth costs**
- [ ] Compress system prompts - **Reduce input tokens 30%**
- [ ] Set up cost monitoring dashboard - **Visibility into burn rate**

### Short-Term (1-4 Weeks)
- [ ] Implement model selection (Haiku for simple queries) - **Save 30-40%**
- [ ] Token-based conversation history (refinement #4) - **Save 20%**
- [ ] Rightsize servers (don't over-provision) - **Save $100-300/month**
- [ ] Migrate to Hetzner (from AWS/GCP) - **Save 60-70%** (if acceptable)
- [ ] Self-host non-critical services (N8N, ChromaDB) - **Save $50-100/month**

### Medium-Term (1-3 Months)
- [ ] Purchase reserved instances (database, cache) - **Save 30-40%**
- [ ] Implement database partitioning - **Reduce storage costs**
- [ ] Set up automated scaling (scale down off-hours) - **Save 20-30%**
- [ ] Negotiate enterprise Claude API pricing (if high volume) - **Save 10-20%**
- [ ] Implement user quotas (prevent abuse) - **Control costs**

---

## Cost Forecasting (2025 Roadmap)

### Conservative Scenario
| Month | Users | Infrastructure | API | Total Cost | Revenue | Profit |
|-------|-------|----------------|-----|------------|---------|--------|
| **Jan** | 50 | $18 | $210 | $228 | $0 | -$228 |
| **Feb** | 100 | $40 | $420 | $460 | $500 | +$40 |
| **Mar** | 200 | $100 | $840 | $940 | $1,200 | +$260 |
| **Jun** | 500 | $250 | $2,100 | $2,350 | $3,500 | +$1,150 |
| **Dec** | 1,000 | $430 | $2,100 | $2,530 | $10,000 | +$7,470 |

**Cumulative Profit (Year 1):** ~$20,000

---

### Aggressive Growth Scenario
| Month | Users | Infrastructure | API | Total Cost | Revenue | Profit |
|-------|-------|----------------|-----|------------|---------|--------|
| **Jan** | 100 | $40 | $420 | $460 | $800 | +$340 |
| **Mar** | 500 | $250 | $2,100 | $2,350 | $5,000 | +$2,650 |
| **Jun** | 2,000 | $1,200 | $4,200 | $5,400 | $25,000 | +$19,600 |
| **Dec** | 10,000 | $2,500 | $12,600 | $15,100 | $150,000 | +$134,900 |

**Cumulative Profit (Year 1):** ~$500,000

---

**CTO Cost Philosophy:**
> Every dollar saved on infrastructure is a dollar that can be spent on growth. But premature optimization costs more in founder time than it saves in server costs. Focus on revenue first, cost optimization second.

**Priority Order:**
1. **Get to revenue** (launch, charge users)
2. **Optimize obvious waste** (caching, rightsizing)
3. **Scale efficiently** (managed services for leverage)
4. **Optimize aggressively** (when costs > $5K/month)
