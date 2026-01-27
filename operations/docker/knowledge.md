# docker Knowledge Base

> Consolidated knowledge for the docker Agent
> Source: docker/
> Generated: 2026-01-28
>
> Original files:
> - docker_compose_patterns.md
> - docker_config_reference.md
> - docker_protocol.md
> - docker_sam_ai_architecture.md

---

## 1. Docker Compose Patterns

# Docker Compose Patterns

**Purpose:** Your actual docker-compose templates

---

## Pattern 1: SAM AI Client (101-samai-docker)

```yaml
services:
  db:
    image: postgres:15
    container_name: samai-db
    environment:
      POSTGRES_USER: odoo
      POSTGRES_PASSWORD: odoo
      POSTGRES_DB: postgres
    volumes:
      - samai-db-data:/var/lib/postgresql/data
    restart: unless-stopped

  odoo:
    build: .
    image: samai:18.0
    container_name: samai-odoo
    depends_on:
      - db
    ports:
      - "8070:8069"
    environment:
      - HOST=db
      - USER=odoo
      - PASSWORD=odoo
    volumes:
      - samai-odoo-data:/var/lib/odoo
    restart: unless-stopped

volumes:
  samai-db-data:
  samai-odoo-data:
```

**Access:** http://localhost:8070

---

## Pattern 2: SaaS Host (102-saas-host-docker)

```yaml
services:
  db:
    image: postgres:15
    container_name: saas-host-db
    environment:
      POSTGRES_USER: odoo
      POSTGRES_PASSWORD: odoo
      POSTGRES_DB: postgres
    volumes:
      - saas-host-db-data:/var/lib/postgresql/data
    networks:
      - saas-network
    restart: unless-stopped

  host:
    build: .
    image: samai-host:18.0
    container_name: saas-host-odoo
    depends_on:
      - db
    ports:
      - "8071:8069"
    environment:
      - HOST=db
      - USER=odoo
      - PASSWORD=odoo
    volumes:
      - saas-host-odoo-data:/var/lib/odoo
      - /var/run/docker.sock:/var/run/docker.sock
      # All development mounts...
    networks:
      - saas-network
    restart: unless-stopped

volumes:
  saas-host-db-data:
  saas-host-odoo-data:

networks:
  saas-network:
    driver: bridge
```

**Access:** http://localhost:8071

---

## Dockerfile Pattern (Client)

```dockerfile
FROM odoo:18.0

USER root

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsqlite3-dev \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
RUN pip3 install --no-cache-dir --break-system-packages --ignore-installed \
    openai>=1.0.0 \
    anthropic>=0.18.0 \
    chromadb>=0.4.0 \
    requests>=2.28.0 \
    httpx>=0.24.0 \
    pandas>=2.0.0 \
    numpy>=1.24.0 \
    Pillow>=10.0.0

# SAM AI modules
RUN mkdir -p /mnt/samai-addons
COPY ./samai-modules/ /mnt/samai-addons/
RUN chown -R odoo:odoo /mnt/samai-addons

# Config
RUN sed -i 's|addons_path = /mnt/extra-addons|addons_path = /mnt/extra-addons,/mnt/samai-addons|' /etc/odoo/odoo.conf

EXPOSE 8069 8071 8072
USER odoo
```

---

## Dockerfile Pattern (SaaS Host)

```dockerfile
FROM odoo:18.0

USER root

# System dependencies (includes docker.io for SaaS Kit)
RUN apt-get update && apt-get install -y --no-install-recommends \
    docker.io \
    curl wget \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies (includes docker, paramiko for SaaS Kit)
RUN pip3 install --no-cache-dir --break-system-packages --ignore-installed \
    docker>=6.0.0 \
    paramiko>=3.0.0 \
    anthropic>=0.18.0 \
    openai>=1.0.0 \
    chromadb>=0.4.22 \
    sentence-transformers>=2.2.0 \
    requests>=2.31.0 \
    httpx>=0.24.0 \
    pandas>=2.0.0 \
    numpy>=1.24.0 \
    Pillow>=10.0.0 \
    beautifulsoup4>=4.11.0 \
    GitPython>=3.1.43 \
    scikit-learn>=1.3.0

# 4-path architecture
RUN mkdir -p /mnt/saas-host/samai_core \
    && mkdir -p /mnt/saas-host/odoo_extras \
    && mkdir -p /mnt/saas-host/member_addons

# Host modules
COPY ./host-modules/ /mnt/saas-host/samai_core/
RUN chown -R odoo:odoo /mnt/saas-host

# Full addons path
RUN sed -i 's|addons_path = /mnt/extra-addons|addons_path = /usr/lib/python3/dist-packages/odoo/addons,/mnt/extra-addons,/mnt/dev/00-odoo-core-15,/mnt/dev/01-odoo-18-core,/mnt/dev/samai-core,/mnt/dev/saas-setup,/mnt/dev/01-user-experience,/mnt/dev/02-business-environment,/mnt/dev/03-documentation,/mnt/dev/04-workflow-automation,/mnt/dev/05-crm,/mnt/dev/06-marketing,/mnt/dev/07-sales-management,/mnt/dev/08-accounts-management,/mnt/dev/09-website-options,/mnt/dev/10-manufacturing,/mnt/dev/11-field-services,/mnt/dev/12-project-management|' /etc/odoo/odoo.conf

# Docker group access
RUN usermod -aG docker odoo

EXPOSE 8069 8071 8072
USER odoo
```

---

## Quick Commands

```bash
# Build Client
cd D:/new_github_repos/21_samai_docker_container/101-samai-docker
docker-compose build && docker-compose up -d

# Build Host
cd D:/new_github_repos/21_samai_docker_container/102-saas-host-docker
docker-compose build && docker-compose up -d

# Logs
docker-compose logs -f

# Shell
docker-compose exec odoo bash
docker-compose exec host bash

# Stop
docker-compose down
```

---

## 2. Docker Config Reference

# SAM AI Docker Config Reference

**Purpose:** YOUR actual Docker configuration (not generic)

**Last Updated:** 2026-01-09

---

## Docker Repositories Location

```
D:\new_github_repos\21_samai_docker_container\
├── 101-samai-docker/        # SAM AI Client container
├── 102-saas-host-docker/    # SaaS Host container
└── ag_local_config/         # Local config
```

---

## Container Architecture

### 101-samai-docker (SAM AI Client)
- **Purpose:** Multi-tenant SaaS clients via Webkul SaaS Kit
- **Port:** 8070 (maps to internal 8069)
- **Image:** `samai:18.0`
- **Phase 1 Modules:** ai_sam, ai_sam_base, sam_ui_theme

### 102-saas-host-docker (SaaS Host)
- **Purpose:** SaaS control server running Webkul SaaS Kit
- **Port:** 8071 (maps to internal 8069)
- **Image:** `samai-host:18.0`
- **Has:** Docker socket mount for spawning client containers

---

## Port Allocation

| Port | Service | Container |
|------|---------|-----------|
| 8069 | Reserved for Windows Odoo | Local |
| 8070 | SAM AI Client | 101-samai-docker |
| 8071 | SaaS Host | 102-saas-host-docker |

---

## Source Module Repositories

**Location:** `D:\SAMAI-18-SaaS\github-repos\`

| Repo | Mount Path | Contents |
|------|------------|----------|
| 00-odoo-core-15-modules | /mnt/dev/00-odoo-core-15 | 21 Odoo core modules |
| 01-samai-odoo-18-lightweight-core | /mnt/dev/01-odoo-18-core | App placeholders |
| 05-samai-core | /mnt/dev/samai-core | ai_sam + modules |
| 99-saas-setup | /mnt/dev/saas-setup | SaaS config |

**Location:** `D:\new_github_repos\`

| Repo | Mount Path | Contents |
|------|------------|----------|
| 01_samai-user-experience | /mnt/dev/01-user-experience | UX modules |
| 02_samai_business_environment | /mnt/dev/02-business-environment | Business modules |
| 03_samai_documentation | /mnt/dev/03-documentation | Docs modules |
| 04_samai_workflow_and_automation | /mnt/dev/04-workflow-automation | Workflow modules |
| 05_samai_crm | /mnt/dev/05-crm | CRM modules |
| 06_samai_marketing | /mnt/dev/06-marketing | Marketing modules |
| 07_samai_sales_management | /mnt/dev/07-sales-management | Sales modules |
| 08_samai_accounts_management | /mnt/dev/08-accounts-management | Accounts modules |
| 09_samai_website_and_options | /mnt/dev/09-website-options | Website modules |
| 10_samai_manufacturing | /mnt/dev/10-manufacturing | Manufacturing modules |
| 11_samai_field_services | /mnt/dev/11-field-services | Field service modules |
| 12_samai_project_management | /mnt/dev/12-project-management | Project modules |

---

## Python Dependencies (SAM AI)

```
# Core AI APIs
anthropic>=0.18.0
openai>=1.0.0

# Memory System
chromadb>=0.4.22
sentence-transformers>=2.2.0

# Web operations
requests>=2.31.0
httpx>=0.24.0

# Data processing
pandas>=2.0.0
numpy>=1.24.0
Pillow>=10.0.0

# Web scraping
beautifulsoup4>=4.11.0

# GitHub operations
GitPython>=3.1.43

# Machine Learning
scikit-learn>=1.3.0
```

**SaaS Host Additional:**
```
docker>=6.0.0
paramiko>=3.0.0
```

---

## 4-Path Architecture

```
/mnt/saas-host/samai_core     → SAM AI modules (priority)
/usr/lib/python3/dist-packages/odoo/addons → Odoo core
/mnt/saas-host/odoo_extras    → Extra 3rd party modules
/mnt/saas-host/member_addons  → Customer-specific modules
```

---

## Database Config

```
POSTGRES_USER: odoo
POSTGRES_PASSWORD: odoo
POSTGRES_DB: postgres
```

---

## Build Commands

### SAM AI Client (101)
```bash
cd D:/new_github_repos/21_samai_docker_container/101-samai-docker
docker-compose build
docker-compose up -d
# Access: http://localhost:8070
```

### SaaS Host (102)
```bash
cd D:/new_github_repos/21_samai_docker_container/102-saas-host-docker
docker-compose build
docker-compose up -d
# Access: http://localhost:8071
```

---

## Network

```yaml
networks:
  saas-network:
    driver: bridge
```

Both containers share `saas-network` for inter-container communication.

---

## Volumes

```yaml
# Client
samai-db-data:      # PostgreSQL data
samai-odoo-data:    # Odoo filestore

# Host
saas-host-db-data:      # PostgreSQL data
saas-host-odoo-data:    # Odoo filestore
```

---

## 3. Docker Protocol

# Docker Agent Protocol

**Purpose:** How /docker operates

---

## Agent Identity

| Property | Value |
|----------|-------|
| **Name** | Docker Container Specialist |
| **Archetype** | Implementer |
| **Color** | Blue |
| **Command** | `/docker` |

---

## What I Do

**I DO:**
- Write Dockerfile, docker-compose.yml, .env files
- Build Docker images (`docker build`)
- Run containers (`docker-compose up`)
- Debug container issues (logs, exec, inspect)
- Configure volumes, networks, environment

**I DON'T:**
- Modify SAM AI Python/JavaScript code (that's `/cto-developer`)
- Make infrastructure strategy decisions (that's `/cto`)
- Manage Hetzner servers directly (that's `/hetzner`)

---

## 5-Phase Workflow

### Phase 1: Understand
- What container? (101-samai-docker client or 102-saas-host-docker host?)
- Development or production?
- What's broken or needed?

### Phase 2: Design
- Single or multi-container?
- What volumes/mounts?
- What Python dependencies?

### Phase 3: Write
- Dockerfile
- docker-compose.yml
- Helper scripts if needed

### Phase 4: Build & Test
```bash
docker-compose build
docker-compose up -d
docker-compose logs -f
```

### Phase 5: Validate
- Container healthy?
- Odoo accessible?
- Modules found?

---

## Delegation Rules

**To `/cto`:** Strategy questions ("Should we use Docker?")
**To `/cto-developer`:** Module code issues inside container
**To `/hetzner`:** Deploying to Hetzner server
**To `/n8n`:** N8N workflow configuration

---

## Common Commands

```bash
# Build & Start
docker-compose build
docker-compose up -d

# Logs
docker-compose logs -f
docker-compose logs -f odoo

# Shell access
docker-compose exec odoo bash
docker-compose exec db psql -U odoo

# Module operations
docker-compose exec odoo odoo -d sam_ai -i module_name --stop-after-init

# Stop
docker-compose down
docker-compose down -v  # WARNING: destroys volumes
```

---

## 4. Docker Sam Ai Architecture

# SAM AI Docker Architecture

**Purpose:** Containerization strategy for SAM AI

---

## Two Container Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                     SAM AI Docker Architecture                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────┐      ┌─────────────────────┐          │
│   │  102-saas-host      │      │  101-samai-docker   │          │
│   │  (SaaS Host)        │      │  (Client Instance)  │          │
│   │  Port: 8071         │─────▶│  Port: 8070         │          │
│   │                     │      │                     │          │
│   │  - Webkul SaaS Kit  │      │  - ai_sam           │          │
│   │  - Docker socket    │      │  - ai_sam_base      │          │
│   │  - Client spawning  │      │  - sam_ui_theme     │          │
│   └─────────────────────┘      └─────────────────────┘          │
│            │                            │                        │
│            ▼                            ▼                        │
│   ┌─────────────────────┐      ┌─────────────────────┐          │
│   │  saas-host-db       │      │  samai-db           │          │
│   │  PostgreSQL 15      │      │  PostgreSQL 15      │          │
│   └─────────────────────┘      └─────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Module Installation Order

```
1. PostgreSQL (infrastructure)
2. Odoo 18 base image
3. ai_sam_base FIRST (core infrastructure)
4. ai_sam SECOND (chat interface)
5. Branch modules THIRD
```

---

## Addons Path (SaaS Host)

```
addons_path = /usr/lib/python3/dist-packages/odoo/addons,
              /mnt/extra-addons,
              /mnt/dev/00-odoo-core-15,
              /mnt/dev/01-odoo-18-core,
              /mnt/dev/samai-core,
              /mnt/dev/saas-setup,
              /mnt/dev/01-user-experience,
              /mnt/dev/02-business-environment,
              /mnt/dev/03-documentation,
              /mnt/dev/04-workflow-automation,
              /mnt/dev/05-crm,
              /mnt/dev/06-marketing,
              /mnt/dev/07-sales-management,
              /mnt/dev/08-accounts-management,
              /mnt/dev/09-website-options,
              /mnt/dev/10-manufacturing,
              /mnt/dev/11-field-services,
              /mnt/dev/12-project-management
```

---

## Volume Mounts (Development)

Mount live code from Windows for hot-reload:

```yaml
volumes:
  # Odoo Core
  - D:/SAMAI-18-SaaS/github-repos/00-odoo-core-15-modules:/mnt/dev/00-odoo-core-15:ro
  - D:/SAMAI-18-SaaS/github-repos/01-samai-odoo-18-lightweight-core:/mnt/dev/01-odoo-18-core:ro

  # SAM AI Core
  - D:/SAMAI-18-SaaS/github-repos/05-samai-core:/mnt/dev/samai-core:ro

  # New Module Repos (01-12)
  - D:/new_github_repos/01_samai-user-experience:/mnt/dev/01-user-experience:ro
  # ... etc
```

---

## Key Differences: Client vs Host

| Aspect | 101-samai-docker (Client) | 102-saas-host-docker (Host) |
|--------|---------------------------|------------------------------|
| Purpose | End-user SAM AI | Manages clients |
| Port | 8070 | 8071 |
| Docker socket | No | Yes (spawns containers) |
| Modules | ai_sam, ai_sam_base | SaaS Kit + all modules |
| Volume mounts | Minimal | All 12 repos |

---

## Docker Socket Mount (Host Only)

```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```

**Why:** SaaS Host uses Webkul SaaS Kit to spawn client containers dynamically.

---

## Common Issues

### Module Not Found
- Check addons_path in odoo.conf
- Verify volume mounts are correct
- Check permissions (chown odoo:odoo)

### Database Connection Failed
- Ensure `db` service is running
- Check HOST=db (not localhost)
- Verify credentials match

### Port Already in Use
- Windows Odoo on 8069? Use 8070/8071
- Check `docker ps` for conflicts

---

*End of Knowledge Base*
