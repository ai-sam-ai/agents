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
