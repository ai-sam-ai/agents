# Infrastructure Strategy - CTO Knowledge Base

## Current Infrastructure State (As-Built)

### Development Environment
**Platform:** Windows 10/11 development machine
**Project Location:** `C:\Working With AI\ai_sam\`
**Odoo Installation:** `C:\Program Files\Odoo 18\server`

### Technology Stack
```
┌─────────────────────────────────────┐
│  SAM AI V3 Technology Stack         │
├─────────────────────────────────────┤
│  Application: Odoo 18               │
│  Database:    PostgreSQL 12-16      │
│  Language:    Python 3.8+           │
│  Frontend:    OWL Framework (Odoo)  │
│  Templates:   QWeb                  │
│  AI:          Claude (Anthropic)    │
│  Workflows:   N8N                   │
│  Graph DB:    Apache AGE (PG ext)   │
│  Vector DB:   ChromaDB              │
└─────────────────────────────────────┘
```

### Module Architecture
```
ai_brain (Data Layer)
    ↓
ai_sam (Framework Layer)
    ↓
Branch Modules (Feature Layer)
    ├── ai_sam_socializer
    ├── the_ai_automator
    ├── ai_invoice_processor
    ├── ai_odoo_blogger
    └── 10 more modules...
```

**Total Codebase:**
- 92,855 lines of code
- 82 Python files (20,664 lines)
- 2,646 JavaScript files (N8N integration)
- 14 custom Odoo modules

---

## Infrastructure Decision Framework

### Question 1: Environment Separation
**Decision Needed:** Development → Staging → Production strategy

**Current State:** Single Windows development environment
**Risk:** No separation = production-like testing impossible

**Recommendation:**
```
Development (Local Windows)
    ↓ Deploy to
Staging (Cloud VM - Ubuntu 22.04 LTS)
    ↓ Promote to
Production (Cloud HA Setup)
```

### Question 2: Database Strategy
**Decision Needed:** Database per tenant vs. shared database

**Options:**
| Strategy | Pros | Cons | Odoo Native? |
|----------|------|------|--------------|
| **DB per Tenant** | Strong isolation, easy backup/restore | Higher overhead, more connections | ✅ Yes (standard) |
| **Shared DB (Company)** | Lower overhead, simpler | Weaker isolation, migration complexity | ⚠️ Possible |

**Recommendation:** Database per tenant (Odoo standard)
- Aligns with Odoo multi-tenancy model
- Easier compliance (GDPR data isolation)
- Simpler backup/restore per customer

### Question 3: Deployment Method
**Decision Needed:** Bare metal vs. VMs vs. Containers vs. Kubernetes

**Comparison:**
| Method | Complexity | Scalability | Cost | Portability |
|--------|-----------|-------------|------|-------------|
| Bare Metal | Low | Low | High upfront | Low |
| VMs (Ubuntu) | Medium | Medium | Pay-as-you-go | Medium |
| Docker Compose | Medium | Medium | Flexible | High |
| **Kubernetes** | High | Very High | Optimized | Very High |

**Phase 1 Recommendation:** Docker Compose (staging/small production)
**Phase 2 Recommendation:** Kubernetes (scale beyond 1,000 users)

### Question 4: External Services Hosting
**Services to Deploy:**
- Apache AGE (PostgreSQL extension - same server as PostgreSQL)
- ChromaDB (separate service - Docker container)
- N8N (separate service - Docker container)
- Redis (for caching - Docker container)

**Architecture:**
```
┌─────────────────────────────────────────┐
│         Load Balancer (nginx)            │
└────────────┬────────────────────────────┘
             ↓
    ┌────────┴────────┐
    ↓                 ↓
┌─────────┐     ┌─────────┐
│ Odoo 1  │     │ Odoo 2  │ (horizontal scale)
└────┬────┘     └────┬────┘
     └───────┬───────┘
             ↓
    ┌────────────────┐
    │  PostgreSQL    │ (with Apache AGE extension)
    └────────────────┘
             ↓
    ┌────────────────┐
    │  Redis Cache   │
    └────────────────┘
             ↓
    ┌────────────────┐
    │   ChromaDB     │ (vector search)
    └────────────────┘
             ↓
    ┌────────────────┐
    │      N8N       │ (workflow automation)
    └────────────────┘
```

---

## PostgreSQL Configuration

### Minimal Production PostgreSQL Settings
**File:** `postgresql.conf`

```ini
# Connection Settings
max_connections = 200                  # Odoo: 100 workers × 2 connections each
shared_buffers = 4GB                   # 25% of RAM (assuming 16GB server)
effective_cache_size = 12GB            # 75% of RAM
work_mem = 10MB                        # Per-operation memory
maintenance_work_mem = 512MB           # For VACUUM, indexes

# Performance
random_page_cost = 1.1                 # SSD optimized (default 4.0 for HDD)
effective_io_concurrency = 200         # SSD parallel I/O

# Write-Ahead Log (WAL)
wal_buffers = 16MB
checkpoint_completion_target = 0.9
max_wal_size = 2GB
min_wal_size = 1GB

# Logging
log_min_duration_statement = 1000      # Log queries > 1 second
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '

# Apache AGE Extension
shared_preload_libraries = 'age'       # Required for graph database
```

### PostgreSQL Performance Tuning Commands
```sql
-- Enable pg_stat_statements (track query performance)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Find missing indexes
SELECT schemaname, tablename, attname, n_distinct
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND tablename NOT IN (
    SELECT tablename FROM pg_indexes WHERE schemaname = 'public'
  );

-- Database size monitoring
SELECT pg_size_pretty(pg_database_size(current_database()));
```

---

## Odoo Configuration

### Production Odoo Configuration
**File:** `odoo.conf`

```ini
[options]
# Database
db_host = localhost
db_port = 5432
db_user = odoo
db_password = <strong_password_here>
db_maxconn = 64

# Performance
workers = 4                            # CPU cores × 2 (for 2-core server)
max_cron_threads = 2
limit_memory_hard = 2684354560         # 2.5 GB per worker
limit_memory_soft = 2147483648         # 2 GB per worker
limit_time_cpu = 600                   # 10 minutes
limit_time_real = 1200                 # 20 minutes

# HTTP
http_port = 8069
proxy_mode = True                      # Behind nginx reverse proxy
xmlrpc_port = 8069

# Logging
log_level = info
log_handler = :INFO
logfile = /var/log/odoo/odoo.log
logrotate = True

# Session
session_store = redis                  # For multi-worker session sharing
session_store_host = localhost
session_store_port = 6379

# Addons
addons_path = /opt/odoo/addons,/opt/odoo/custom/ai_sam/ai_brain,/opt/odoo/custom/ai_sam/ai_sam,/opt/odoo/custom/ai_sam/the_ai_automator

# Security
admin_passwd = <change_me_strong_password>
```

---

## External Service Configuration

### Apache AGE (Graph Database)
**Installation:**
```bash
# PostgreSQL extension - installed on DB server
sudo apt install postgresql-14-age
psql -U postgres -c "CREATE EXTENSION age;"
```

**Usage in SAM AI:**
- Knowledge graph relationships
- Memory system connections
- AI conversation threading

### ChromaDB (Vector Database)
**Docker Compose:**
```yaml
chromadb:
  image: chromadb/chroma:latest
  ports:
    - "8000:8000"
  volumes:
    - chromadb_data:/chroma/chroma
  environment:
    - CHROMA_SERVER_AUTH_CREDENTIALS=<api_key>
```

**Usage in SAM AI:**
- Semantic search
- Document embeddings
- Context retrieval

### N8N (Workflow Automation)
**Docker Compose:**
```yaml
n8n:
  image: n8nio/n8n:latest
  ports:
    - "5678:5678"
  volumes:
    - n8n_data:/home/node/.n8n
  environment:
    - N8N_BASIC_AUTH_ACTIVE=true
    - N8N_BASIC_AUTH_USER=admin
    - N8N_BASIC_AUTH_PASSWORD=<strong_password>
```

**Usage in SAM AI:**
- 2,646 JS files integrated
- The AI Automator module

### Redis (Caching Layer)
**Docker Compose:**
```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  command: redis-server --appendonly yes
```

**Usage in SAM AI:**
- Session store (multi-worker Odoo)
- API response caching (Claude API)
- Context builder caching

---

## Cloud Provider Comparison

### AWS (Amazon Web Services)
**Pros:**
- Mature Odoo deployment guides
- RDS PostgreSQL managed service
- ElastiCache Redis managed service
- Auto-scaling groups

**Cons:**
- Higher cost for small workloads
- Complex pricing

**Cost Estimate (100 users):**
- EC2 t3.medium (2 vCPU, 4GB): $30/month
- RDS PostgreSQL (db.t3.medium): $50/month
- ElastiCache Redis (cache.t3.micro): $15/month
- **Total:** ~$95/month

### DigitalOcean
**Pros:**
- Simple pricing
- Managed PostgreSQL
- One-click Odoo droplet (outdated, but reference)
- Good for startups

**Cons:**
- Limited auto-scaling
- Fewer managed services

**Cost Estimate (100 users):**
- Droplet (2 vCPU, 4GB): $24/month
- Managed PostgreSQL (2GB): $15/month
- Managed Redis (1GB): $15/month
- **Total:** ~$54/month

### Hetzner (European)
**Pros:**
- **Lowest cost**
- Excellent price/performance
- GDPR-friendly (EU data centers)

**Cons:**
- Fewer managed services
- Manual setup required

**Cost Estimate (100 users):**
- VPS CX21 (2 vCPU, 4GB): €5.83/month (~$6.50)
- Storage for PostgreSQL: €5/month (~$5.50)
- **Total:** ~$12/month

**Recommendation:** Hetzner for pre-launch/early stage, migrate to AWS/GCP for scale

---

## Deployment Architecture by User Scale

### 0-100 Users (Launch Phase)
**Single Server Setup:**
```
┌────────────────────────────┐
│  Single VPS (4GB RAM)      │
│  ├── Odoo (2 workers)      │
│  ├── PostgreSQL            │
│  ├── Redis                 │
│  ├── ChromaDB              │
│  └── N8N                   │
└────────────────────────────┘
```
**Cost:** $12-30/month
**Monitoring:** Basic server metrics (CPU, RAM, disk)

### 100-1,000 Users (Growth Phase)
**Separated Services:**
```
┌────────────────┐     ┌──────────────┐
│  Odoo Server   │────→│  PostgreSQL  │
│  (4 workers)   │     │  (Managed)   │
└────────┬───────┘     └──────────────┘
         ↓
┌────────────────┐     ┌──────────────┐
│  Redis Cache   │     │  ChromaDB    │
└────────────────┘     └──────────────┘
```
**Cost:** $100-200/month
**Monitoring:** APM, slow query logs, error tracking

### 1,000-10,000 Users (Scale Phase)
**Load Balanced:**
```
       ┌─────────────┐
       │ Load Bal    │
       └──────┬──────┘
         ┌────┴────┐
         ↓         ↓
    ┌────────┐ ┌────────┐
    │ Odoo 1 │ │ Odoo 2 │
    └───┬────┘ └───┬────┘
        └─────┬────┘
              ↓
      ┌───────────────┐
      │  PostgreSQL   │
      │  (Read Replicas)
      └───────────────┘
```
**Cost:** $500-1,000/month
**Monitoring:** Full observability stack (DataDog/New Relic)

### 10,000+ Users (Enterprise Scale)
**Multi-Region Kubernetes:**
```
Region 1 (US-East)         Region 2 (EU-West)
┌────────────────┐         ┌────────────────┐
│  K8s Cluster   │         │  K8s Cluster   │
│  ├── Odoo Pods │         │  ├── Odoo Pods │
│  ├── Redis     │         │  ├── Redis     │
│  └── ChromaDB  │         │  └── ChromaDB  │
└────────┬───────┘         └────────┬───────┘
         └──────────┬───────────────┘
                    ↓
            ┌──────────────┐
            │  PostgreSQL  │
            │  Multi-Master│
            └──────────────┘
```
**Cost:** $2,000-5,000+/month
**Monitoring:** Custom metrics, SRE team

---

## Security Hardening Checklist

### Network Security
- [ ] Firewall rules (only ports 80, 443 open)
- [ ] SSH key-only authentication (disable password)
- [ ] fail2ban installed (brute-force protection)
- [ ] VPN for database access (no public PostgreSQL port)

### Application Security
- [ ] Odoo admin password changed from default
- [ ] Database user passwords rotated
- [ ] API keys in environment variables (not code)
- [ ] HTTPS only (Let's Encrypt SSL certificate)
- [ ] CORS policies configured
- [ ] Rate limiting on API endpoints

### Database Security
- [ ] PostgreSQL not exposed to internet
- [ ] SSL connections required (`ssl = on` in postgresql.conf)
- [ ] Row-level security (RLS) for multi-tenant isolation
- [ ] Regular backups (daily, tested restores)
- [ ] Point-in-time recovery enabled

### Compliance (GDPR/CCPA)
- [ ] Data retention policy documented
- [ ] User data export functionality
- [ ] User data deletion (right to be forgotten)
- [ ] Privacy policy published
- [ ] Cookie consent mechanism
- [ ] Data processing agreement (DPA) for subprocessors

---

## Disaster Recovery Plan

### Backup Strategy
**What to Backup:**
1. PostgreSQL databases (all tenant DBs)
2. Odoo filestore (`/opt/odoo/data/filestore/`)
3. ChromaDB vector indexes
4. N8N workflow configurations
5. Redis session data (optional - ephemeral)

**Backup Schedule:**
- **Hourly:** PostgreSQL transaction logs (PITR)
- **Daily:** Full PostgreSQL dump
- **Weekly:** Filestore snapshot
- **Monthly:** Full system image

**Storage:**
- Primary: Cloud object storage (S3/Backblaze)
- Secondary: Offsite backup (different region)
- **Retention:** 7 daily, 4 weekly, 12 monthly

### Recovery Procedures

**Scenario 1: Database Corruption**
```bash
# Restore from last night's backup (RPO: 24 hours)
pg_restore -U odoo -d sam_ai_prod backup_2025-10-10.dump

# Or point-in-time recovery (RPO: 1 hour)
pg_basebackup + WAL replay to 2025-10-10 14:35:00
```
**RTO:** 30 minutes

**Scenario 2: Full Server Failure**
```bash
# Provision new server from infrastructure-as-code
terraform apply

# Restore data from backups
ansible-playbook restore-from-backup.yml

# Update DNS to new server IP
```
**RTO:** 2-4 hours

**Scenario 3: Accidental Data Deletion**
```bash
# Restore single tenant database from backup
pg_restore -U odoo -d tenant_abc backup_tenant_abc.dump
```
**RTO:** 15 minutes

---

## Infrastructure as Code (IaC)

### Terraform (Cloud Provisioning)
**Benefits:**
- Reproducible infrastructure
- Version-controlled infra changes
- Multi-environment (dev/staging/prod)

**Example Structure:**
```
terraform/
├── modules/
│   ├── odoo-server/
│   ├── postgresql/
│   └── networking/
├── environments/
│   ├── dev.tfvars
│   ├── staging.tfvars
│   └── prod.tfvars
└── main.tf
```

### Ansible (Configuration Management)
**Benefits:**
- Automated server setup
- Consistent configurations
- Easy rollbacks

**Example Playbooks:**
```
ansible/
├── deploy-odoo.yml
├── configure-postgresql.yml
├── setup-monitoring.yml
└── backup-restore.yml
```

---

## Key Infrastructure Decisions Summary

| Decision | Current | Phase 1 Target | Phase 2 Target |
|----------|---------|---------------|----------------|
| **Environment** | Windows dev | Ubuntu VM (staging) | Kubernetes (prod) |
| **Deployment** | Manual install | Docker Compose | Helm charts |
| **Database** | Local PostgreSQL | Managed PostgreSQL | HA PostgreSQL cluster |
| **Caching** | None | Redis (single) | Redis cluster |
| **Monitoring** | None | Basic metrics | Full APM |
| **Backups** | Manual | Automated daily | Continuous PITR |
| **Cost** | $0 (local) | $50-100/month | $500+/month |

---

## Next Steps for Infrastructure

### Immediate (Pre-Launch - 2 Weeks)
1. **Set up staging environment** (Ubuntu VM, Docker Compose)
2. **Configure Redis caching** (refinement #5 - API response caching)
3. **Database query optimization** (refinement #6 - batch reads)
4. **Basic monitoring** (server health, error logs)

### Short-Term (Post-Launch - 1 Month)
1. **Automated backups** (daily PostgreSQL dumps to S3)
2. **SSL certificates** (Let's Encrypt HTTPS)
3. **Performance monitoring** (APM for slow queries)
4. **Load testing** (simulate 100 concurrent users)

### Medium-Term (Growth - 3 Months)
1. **Horizontal scaling** (add second Odoo server)
2. **Database replication** (read replicas for reporting)
3. **CDN for static assets** (CloudFlare/AWS CloudFront)
4. **Advanced monitoring** (custom AI metrics, token usage dashboards)

### Long-Term (Scale - 6+ Months)
1. **Kubernetes migration** (container orchestration)
2. **Multi-region deployment** (US + EU for latency)
3. **Auto-scaling** (dynamic capacity based on load)
4. **SRE team** (on-call rotation, incident response)

---

**CTO Philosophy:**
> Infrastructure decisions are irreversible in practice. Choose technologies that scale WITH your business, not AHEAD of it. Premature optimization is expensive; premature commitment is fatal.

**Key Principle:**
Start simple (Docker Compose), scale incrementally (Kubernetes when needed), automate everything (IaC from day 1).
