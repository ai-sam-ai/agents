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
