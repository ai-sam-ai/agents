# docker-debug Knowledge Base

> Consolidated knowledge for the docker-debug Agent
> Source: docker-debug/
> Generated: 2026-01-28
>
> Original files:
> - common_issues.md
> - docker_environment.md
> - odoo_18_debugging.md

---

## 1. Common Issues

# Common Docker + Odoo Issues

> **Quick reference** for frequent problems and solutions

---

## Container Won't Start

### Issue: Container Exits Immediately

**Check:**
```bash
docker logs samai-odoo
```

**Common causes:**
1. Database not ready yet
2. Invalid odoo.conf
3. Python import error in module

**Fix:**
```bash
# Start db first, wait, then start odoo
docker-compose up -d db
sleep 10
docker-compose up -d odoo

# Or check for module errors
docker logs samai-odoo 2>&1 | grep -i "error\|import\|traceback"
```

---

### Issue: "Address Already in Use"

**Symptom:**
```
Bind for 0.0.0.0:8070 failed: port is already allocated
```

**Check:**
```bash
# Windows
netstat -ano | findstr :8070

# Or use Docker
docker ps -a | grep 8070
```

**Fix:**
```bash
# Stop whatever is using the port
docker stop $(docker ps -q --filter "publish=8070")

# Or change port in docker-compose.yml
ports:
  - "8075:8069"  # Use different port
```

---

## Module Issues

### Issue: Module Changes Not Visible

**Causes:**
1. Odoo caching old version
2. Volume not mounted correctly
3. Module not updated

**Fix:**
```bash
# Force module update
docker exec samai-odoo odoo -d samai -u module_name --stop-after-init
docker restart samai-odoo

# Or full rebuild if changes in __manifest__.py
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

### Issue: "Field X does not exist"

**Symptom:**
```
psycopg2.errors.UndefinedColumn: column ai_sam_conversation.new_field does not exist
```

**Cause:** Model changed but database not updated

**Fix:**
```bash
# Update the module
docker exec samai-odoo odoo -d samai -u ai_sam_base --stop-after-init
docker restart samai-odoo
```

---

### Issue: Module Won't Install

**Check dependencies:**
```bash
# View manifest
docker exec samai-odoo cat /mnt/samai-addons/04-user-experience/ai_sam_base/__manifest__.py | grep depends

# Check if dependencies installed
docker exec samai-odoo psql -h db -U odoo -d samai -c \
  "SELECT name, state FROM ir_module_module WHERE name IN ('base', 'mail', 'web');"
```

---

## Database Issues

### Issue: Database Doesn't Exist

**Symptom:**
```
Database "samai" does not exist
```

**Fix:**
```bash
# Create database
docker exec samai-odoo odoo -d samai --stop-after-init

# Or via psql
docker exec samai-db psql -U odoo -c "CREATE DATABASE samai OWNER odoo;"
```

---

### Issue: Database Locked/Corrupted

**Symptom:**
```
database is locked / could not serialize access
```

**Fix:**
```bash
# Restart PostgreSQL
docker restart samai-db

# Wait then restart Odoo
sleep 5
docker restart samai-odoo
```

---

### Issue: Connection Refused to Database

**Check:**
```bash
# Is db running?
docker ps | grep db

# Can Odoo reach it?
docker exec samai-odoo ping db

# Check environment variables
docker exec samai-odoo env | grep -i db
```

---

## Volume/Mount Issues

### Issue: Volumes Not Syncing

**Windows Docker Desktop specific:**

**Fix:**
1. Ensure Docker Desktop has access to drive D:
   - Docker Desktop → Settings → Resources → File Sharing
   - Add `D:\` if not present
2. Restart Docker Desktop

---

### Issue: Permission Denied on Volume

**Symptom:**
```
PermissionError: [Errno 13] Permission denied: '/mnt/samai-addons/...'
```

**Check:**
```bash
docker exec samai-odoo ls -la /mnt/samai-addons/
```

**Fix:**
```bash
# Ensure :ro (read-only) is set for module volumes
# In docker-compose.yml:
volumes:
  - D:/github_repos/04_samai_user_experience:/mnt/samai-addons/04-user-experience:ro
```

---

## Network Issues

### Issue: Container Can't Reach Internet

**Check:**
```bash
docker exec samai-odoo ping google.com
docker exec samai-odoo curl -I https://api.anthropic.com
```

**Fix:**
```bash
# Restart Docker networking
docker network prune
docker-compose down
docker-compose up -d
```

---

### Issue: Containers Can't Talk to Each Other

**Check:**
```bash
# Are they on same network?
docker network inspect 101-samai-docker_default

# Can they resolve each other?
docker exec samai-odoo ping db
```

**Fix:**
Ensure both services are on same network in docker-compose.yml:
```yaml
networks:
  default:
    driver: bridge
```

---

## Windows-Specific Issues

### Issue: Line Ending Problems

**Symptom:**
```
/bin/bash^M: bad interpreter
```

**Cause:** Windows CRLF vs Unix LF

**Fix:**
In .gitattributes:
```
* text=auto eol=lf
*.sh text eol=lf
Dockerfile text eol=lf
```

Or convert files:
```bash
sed -i 's/\r$//' filename.sh
```

---

### Issue: Slow File Access

**Cause:** Docker Desktop WSL2 file system overhead

**Fix:**
1. Move repos to WSL2 file system if possible
2. Or accept slower volume mounts
3. Use named volumes for persistent data (faster)

---

## Quick Recovery Commands

### Nuclear Option - Full Reset

```bash
# Stop everything
docker-compose down

# Remove volumes (⚠️ DELETES DATA)
docker-compose down -v

# Remove images
docker rmi samai:18.0

# Full rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Soft Reset - Keep Data

```bash
# Just restart services
docker-compose restart

# Or one at a time
docker restart samai-db
sleep 5
docker restart samai-odoo
```

### View Everything

```bash
# All containers
docker ps -a

# All images
docker images

# All volumes
docker volume ls

# All networks
docker network ls

# Disk usage
docker system df
```

---

## 2. Docker Environment

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

---

## 3. Odoo 18 Debugging

# Odoo 18 Debugging Guide

> **Context:** SAM AI modules running on Odoo 18.0 in Docker

---

## Log Analysis

### Log Locations

**Inside Container:**
```bash
# View logs via docker
docker logs samai-odoo

# Or inside container
docker exec -it samai-odoo bash
cat /var/log/odoo/odoo.log  # if log file mounted
```

**Log Levels:**
- `DEBUG` - Detailed debugging info
- `INFO` - General operational messages
- `WARNING` - Potential issues
- `ERROR` - Errors that don't crash
- `CRITICAL` - Fatal errors

### Filtering Logs

```bash
# Show only errors
docker logs samai-odoo 2>&1 | grep -i error

# Show SAM AI related logs
docker logs samai-odoo 2>&1 | grep -i "ai_sam\|sam_"

# Show last 50 lines with timestamps
docker logs --tail 50 -t samai-odoo

# Follow logs and filter
docker logs -f samai-odoo 2>&1 | grep -i "error\|warning"
```

---

## Common Odoo 18 Issues

### Module Not Found

**Symptom:**
```
Module ai_sam_base not found in addons paths
```

**Check:**
```bash
# Verify addons_path in config
docker exec samai-odoo cat /etc/odoo/odoo.conf | grep addons_path

# Check if module exists in mounted path
docker exec samai-odoo ls -la /mnt/samai-addons/04-user-experience/ai_sam_base/
```

**Fix:**
1. Ensure module exists in correct repo
2. Check volume mount in docker-compose.yml
3. Restart container after changes

### Module Dependency Error

**Symptom:**
```
Module 'ai_sam' depends on 'ai_sam_base' which is not installed
```

**Check:**
```bash
# List installed modules
docker exec samai-odoo psql -U odoo -d samai -c \
  "SELECT name, state FROM ir_module_module WHERE name LIKE 'ai_sam%';"
```

**Fix:**
Install dependencies in correct order via Odoo Apps menu or:
```bash
docker exec samai-odoo odoo -d samai -i ai_sam_base --stop-after-init
```

### Database Connection Failed

**Symptom:**
```
Connection refused / could not connect to server
```

**Check:**
```bash
# Check if db container is running
docker ps | grep db

# Test connection from Odoo container
docker exec samai-odoo psql -h db -U odoo -c "\l"
```

**Fix:**
1. Ensure db container started first (`depends_on` in compose)
2. Check network connectivity
3. Verify credentials match

### Asset/Static Files Not Loading

**Symptom:**
```
CSS/JS not loading, broken styles
```

**Check:**
```bash
# Clear browser cache first, then:
# Force asset regeneration
docker exec samai-odoo odoo -d samai -u base --stop-after-init
```

**Fix:**
1. Clear browser cache
2. In Odoo: Developer mode → Regenerate Assets Bundles
3. Or restart container

---

## Debugging Commands

### Database Operations

```bash
# List databases
docker exec samai-odoo psql -h db -U odoo -c "\l"

# Connect to database
docker exec -it samai-odoo psql -h db -U odoo -d samai

# List tables
docker exec samai-odoo psql -h db -U odoo -d samai -c "\dt"

# Query module states
docker exec samai-odoo psql -h db -U odoo -d samai -c \
  "SELECT name, state FROM ir_module_module WHERE state != 'uninstalled' ORDER BY name;"
```

### Module Operations

```bash
# Install module
docker exec samai-odoo odoo -d samai -i module_name --stop-after-init

# Update module
docker exec samai-odoo odoo -d samai -u module_name --stop-after-init

# Update all SAM AI modules
docker exec samai-odoo odoo -d samai -u ai_sam_base,ai_sam,sam_ui_theme --stop-after-init
```

### Shell Access

```bash
# Bash shell
docker exec -it samai-odoo bash

# Python shell with Odoo
docker exec -it samai-odoo odoo shell -d samai
```

### Inside Python Shell

```python
# Check model exists
self.env['ai.sam.conversation'].search_count([])

# Check field exists
self.env['ai.sam.conversation']._fields.keys()

# Test method
self.env['ai.sam.base'].get_system_prompt()

# View SQL
self.env.cr.execute("SELECT id, name FROM ir_module_module WHERE name LIKE 'ai%'")
self.env.cr.fetchall()
```

---

## Performance Debugging

### Slow Startup

**Check:**
```bash
# Time container startup
time docker-compose up -d

# Check for heavy init
docker logs samai-odoo 2>&1 | grep -i "loading\|init\|module"
```

### Memory Issues

**Check:**
```bash
# Container resource usage
docker stats samai-odoo

# Check PostgreSQL connections
docker exec samai-odoo psql -h db -U odoo -c \
  "SELECT count(*) FROM pg_stat_activity;"
```

### CPU Spikes

**Check:**
```bash
# Top processes in container
docker exec samai-odoo top

# Check for loops in logs
docker logs samai-odoo 2>&1 | tail -100
```

---

## Network Debugging

### Container Connectivity

```bash
# Check network
docker network ls

# Inspect network
docker network inspect 101-samai-docker_default

# Ping between containers
docker exec samai-odoo ping db
```

### Port Issues

```bash
# Check port mappings
docker port samai-odoo

# Check host port usage
netstat -an | grep 8070
```

---

## Odoo Developer Mode

### Enable Developer Mode

**Method 1 - URL:**
```
http://localhost:8070/web?debug=1
```

**Method 2 - Settings:**
Settings → General Settings → Developer Tools → Activate Developer Mode

### Debug Features Available

- **Debug Assets** - Load unminified JS/CSS
- **Technical Features** - Model info, SQL queries
- **Edit View** - Modify views live
- **Regenerate Assets** - Clear asset cache

---

## Log Verbosity

### Increase Logging

```bash
# Edit odoo.conf in container
docker exec -it samai-odoo bash
nano /etc/odoo/odoo.conf

# Add/modify:
log_level = debug
log_handler = :DEBUG
```

### Module-Specific Debug

In odoo.conf:
```ini
log_handler = odoo.addons.ai_sam_base:DEBUG
```

### Restart After Config Change

```bash
docker restart samai-odoo
```

---

*End of Knowledge Base*
