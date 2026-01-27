# SAM AI Docker Environment

> **Pre-loaded knowledge** - No need to share docker-compose.yml each session

---

## Container Overview

| Container | Port | Purpose | Status Command |
|-----------|------|---------|----------------|
| **101-samai** | 8070 | SAM AI Client testing | `docker ps -a \| grep samai-odoo` |
| **102-saas-host** | 8071 | SaaS Host (multi-tenant) | `docker ps -a \| grep saas-host-odoo` |
| **Windows Odoo** | 8069 | Local dev (reserved) | Not Docker |

---

## Docker Compose Locations

```
D:\github_repos\21_samai_docker_container\
├── 101-samai-docker\
│   ├── docker-compose.yml    # SAM AI Client
│   └── Dockerfile
├── 102-saas-host-docker\
│   ├── docker-compose.yml    # SaaS Host
│   ├── Dockerfile
│   └── host-modules\         # SaaS Kit modules
└── ag_local_config\
```

---

## 101-samai (SAM AI Client)

### Containers
- `samai-db` - PostgreSQL 15
- `samai-odoo` - Odoo 18 + SAM AI

### Access
```
URL: http://localhost:8070
DB User: odoo
DB Password: odoo
```

### Volume Mounts (Module Repos)
```
D:/github_repos/00_odoo-core-15-modules      → /mnt/samai-addons/00-odoo-core:ro
D:/github_repos/01_odoo-18-lightweight-core  → /mnt/samai-addons/01-odoo-lite:ro
D:/github_repos/02_odoo-full-modules         → /mnt/samai-addons/02-odoo-full:ro
D:/github_repos/03_odoo_community_extras     → /mnt/samai-addons/03-community:ro
D:/github_repos/04_samai_user_experience     → /mnt/samai-addons/04-user-experience:ro
D:/github_repos/05_samai_business_environment→ /mnt/samai-addons/05-business:ro
D:/github_repos/06_samai_extras              → /mnt/samai-addons/06-extras:ro
D:/github_repos/07_samai_website_and_options → /mnt/samai-addons/07-website:ro
```

### Init Modules (Auto-install)
```
mail, contacts, calendar, ai_sam_base, sam_ui_theme, samai_auth,
sam_ai_odoo_modules, sam_ai_odoo_modules_client, samai_business_manager
```

### Commands
```bash
# Start
cd D:/github_repos/21_samai_docker_container/101-samai-docker
docker-compose up -d

# Stop
docker-compose down

# Logs
docker logs -f samai-odoo

# Shell access
docker exec -it samai-odoo bash

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

---

## 102-saas-host (SaaS Host)

### Containers
- `saas-host-db` - PostgreSQL 15
- `saas-host-odoo` - Odoo 18 + SaaS Kit + SAM AI

### Access
```
URL: http://localhost:8071
DB User: odoo
DB Password: odoo
```

### Volume Mounts
```
D:/github_repos/00_odoo-core-15-modules      → /mnt/dev/00-odoo-core:ro
D:/github_repos/01_odoo-18-lightweight-core  → /mnt/dev/01-odoo-lite:ro
D:/github_repos/02_odoo-full-modules         → /mnt/dev/02-odoo-full:ro
D:/github_repos/03_odoo_community_extras     → /mnt/dev/03-community:ro
D:/github_repos/04_samai_user_experience     → /mnt/dev/04-user-experience:ro
D:/github_repos/05_samai_business_environment→ /mnt/dev/05-business:ro
D:/github_repos/06_samai_extras              → /mnt/dev/06-extras:ro
D:/github_repos/07_samai_website_and_options → /mnt/dev/07-website:ro
D:/github_repos/09_samai_social_star         → /mnt/dev/09-social-star:ro
D:/github_repos/30_samai_saas_host_management→ /mnt/dev/30-host-only:ro
```

### Special Features
- Docker socket mounted (`/var/run/docker.sock`) for spawning client containers
- 4-Path Architecture: samai_core, odoo_extras, member_addons

### Commands
```bash
# Start
cd D:/github_repos/21_samai_docker_container/102-saas-host-docker
docker-compose up -d

# Stop
docker-compose down

# Logs
docker logs -f saas-host-odoo

# Shell access
docker exec -it saas-host-odoo bash

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

---

## Odoo Configuration Paths

### Inside Containers
```
/etc/odoo/odoo.conf           # Main Odoo config
/var/log/odoo/odoo.log        # Odoo logs (if mounted)
/var/lib/odoo                 # Persistent data
```

### Addons Path (101-samai)
```
addons_path = /usr/lib/python3/dist-packages/odoo/addons,
              /mnt/samai-addons/00-odoo-core,
              /mnt/samai-addons/01-odoo-lite,
              /mnt/samai-addons/02-odoo-full,
              /mnt/samai-addons/03-community,
              /mnt/samai-addons/04-user-experience,
              /mnt/samai-addons/05-business,
              /mnt/samai-addons/06-extras,
              /mnt/samai-addons/07-website
```

### Addons Path (102-saas-host)
```
addons_path = /usr/lib/python3/dist-packages/odoo/addons,
              /mnt/extra-addons,
              /mnt/dev/00-odoo-core,
              /mnt/dev/01-odoo-lite,
              /mnt/dev/02-odoo-full,
              /mnt/dev/03-community,
              /mnt/dev/04-user-experience,
              /mnt/dev/05-business,
              /mnt/dev/06-extras,
              /mnt/dev/07-website,
              /mnt/dev/09-social-star,
              /mnt/dev/30-host-only
```

---

## Quick Debug Commands

### Check Container Status
```bash
docker ps -a | grep -E "samai|saas-host"
```

### View Logs (Last 100 Lines)
```bash
# 101-samai
docker logs --tail 100 samai-odoo

# 102-saas-host
docker logs --tail 100 saas-host-odoo
```

### Follow Logs (Live)
```bash
docker logs -f samai-odoo
docker logs -f saas-host-odoo
```

### View Odoo Config
```bash
docker exec samai-odoo cat /etc/odoo/odoo.conf
docker exec saas-host-odoo cat /etc/odoo/odoo.conf
```

### List Installed Modules
```bash
docker exec samai-odoo psql -U odoo -d samai -c "SELECT name, state FROM ir_module_module WHERE state='installed' ORDER BY name;"
```

### Restart Container
```bash
docker restart samai-odoo
docker restart saas-host-odoo
```

### Full Rebuild (When Changes Not Reflected)
```bash
cd D:/github_repos/21_samai_docker_container/101-samai-docker
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Module Repository Mapping

| Repo # | Local Path | Container Mount (101) | Container Mount (102) |
|--------|------------|----------------------|----------------------|
| 00 | `D:/github_repos/00_odoo-core-15-modules` | `/mnt/samai-addons/00-odoo-core` | `/mnt/dev/00-odoo-core` |
| 01 | `D:/github_repos/01_odoo-18-lightweight-core` | `/mnt/samai-addons/01-odoo-lite` | `/mnt/dev/01-odoo-lite` |
| 02 | `D:/github_repos/02_odoo-full-modules` | `/mnt/samai-addons/02-odoo-full` | `/mnt/dev/02-odoo-full` |
| 03 | `D:/github_repos/03_odoo_community_extras` | `/mnt/samai-addons/03-community` | `/mnt/dev/03-community` |
| 04 | `D:/github_repos/04_samai_user_experience` | `/mnt/samai-addons/04-user-experience` | `/mnt/dev/04-user-experience` |
| 05 | `D:/github_repos/05_samai_business_environment` | `/mnt/samai-addons/05-business` | `/mnt/dev/05-business` |
| 06 | `D:/github_repos/06_samai_extras` | `/mnt/samai-addons/06-extras` | `/mnt/dev/06-extras` |
| 07 | `D:/github_repos/07_samai_website_and_options` | `/mnt/samai-addons/07-website` | `/mnt/dev/07-website` |
| 09 | `D:/github_repos/09_samai_social_star` | N/A | `/mnt/dev/09-social-star` |
| 30 | `D:/github_repos/30_samai_saas_host_management` | N/A | `/mnt/dev/30-host-only` |

---

## Port Allocation

| Port | Service | Notes |
|------|---------|-------|
| 8069 | Windows Odoo | Reserved for local dev |
| 8070 | 101-samai | SAM AI Client testing |
| 8071 | 102-saas-host | SaaS Host admin |
| 8072 | Long polling | WebSocket (if enabled) |

---

## Python Dependencies (Pre-installed in Containers)

### Core AI
- `anthropic>=0.18.0` - Claude API
- `openai>=1.0.0` - OpenAI API

### Memory System
- `chromadb>=0.4.22` - Vector DB
- `sentence-transformers>=2.2.0` - Embeddings

### Data Processing
- `pandas>=2.0.0`
- `numpy>=1.24.0`
- `Pillow>=10.0.0`

### Web Operations
- `requests>=2.31.0`
- `httpx>=0.24.0`
- `beautifulsoup4>=4.11.0`

### SaaS Kit (102 only)
- `docker>=6.0.0` - Container management
- `paramiko>=3.0.0` - SSH operations
