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
