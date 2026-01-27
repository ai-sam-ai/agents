# Hetzner Session Context

**Last Updated:** 2026-01-27
**Last Verified:** Fixed repo 30 pull, permissions, remote URL

---

## Servers

| Name | IP | Type | Purpose | User | Status |
|------|-----|------|---------|------|--------|
| odoo-sam-ai | 65.108.61.31 | Hetzner Cloud | SAM AI Production + SaaS Host | root | Active (53 days uptime) |

---

## Domain Architecture

| Domain | Points To | Purpose |
|--------|-----------|---------|
| sme.ec | Cloudflare (172.67.169.197) | Marketing/Sales site |
| samai.software | Hetzner (65.108.61.31) | Client SaaS instances |
| *.samai.software | Hetzner (65.108.61.31) | Wildcard for all clients |

---

## SSL Certificates

| Domain | Location | Expires |
|--------|----------|---------|
| *.samai.software | /etc/letsencrypt/live/samai.software/ | 2026-04-12 |

**Note:** Manual renewal required (no auto-hook configured)

---

## SSH Configuration

- **Key Type:** Ed25519
- **Key Location:** `C:\Users\total\.ssh\id_ed25519`
- **Public Key:** `C:\Users\total\.ssh\id_ed25519.pub`
- **Known Hosts:** Server fingerprint saved

### Quick Connect
```powershell
ssh root@65.108.61.31
```

---

## Server Details

| Property | Value |
|----------|-------|
| Hostname | odoo-sam-ai |
| IP Address | 65.108.61.31 |
| OS | Ubuntu 22.04.5 LTS |
| Purpose | SAM AI Odoo Production + SaaS Host |

---

## Services Running

| Service | Port | Status |
|---------|------|--------|
| Host Odoo (sam_ai) | 1818 | Active |
| PostgreSQL | 5432 | Active |
| Nginx | 80, 443 | Active |
| Docker | - | Active |

---

## SaaS Kit Configuration

| Setting | Value |
|---------|-------|
| Server Domain | samai.software |
| Template Container | odoo18_template_cont |
| Template Port | 18812 |
| Data Path | /home/sam_ai/clients |
| Vhosts Path | /home/sam_ai/clients/docker_vhosts |
| saas.conf | /opt/odoo18/odoo_saas/Odoo-18-SaaS/odoo_saas_kit/models/lib/saas.conf |

---

## Client Containers

| Container | Database | Port | Domain | Status |
|-----------|----------|------|--------|--------|
| odoo18_template_cont | (no DB yet) | 18812 | - | Running |
| tls.samai.software | tls.samai.software | 8002 | https://tls.samai.software | Running |
| client007.samai.software | client007.samai.software | 8000 | https://client007.samai.software | Running |
| client006.sme.ec | client006.sme.ec | 8004 | https://test.samai.software | Running |

## PostgreSQL Configuration

| Setting | Value |
|---------|-------|
| Version | PostgreSQL 14 |
| Listen Addresses | localhost, 172.17.0.1 (Docker bridge) |
| Default SaaS User | `samai_user` / `samai` |
| Existing Users | postgres, odoo, odoo18, samai_user |

---

## Nginx Configuration

- Main config: `/etc/nginx/nginx.conf`
- Sites enabled: `/etc/nginx/sites-enabled/`
- Docker vhosts: `/home/sam_ai/clients/docker_vhosts/*.conf` (auto-included)
- Vhost template: `/home/sam_ai/clients/docker_vhosts/vhosttemplate.txt`

---

## Security Status

- [x] SSH key authentication working
- [x] SSL certificate installed (wildcard)
- [x] Nginx configured with HTTPS
- [ ] Non-root user created
- [ ] Root login disabled
- [ ] Password auth disabled
- [ ] UFW firewall configured

---

## Session History

### 2026-01-27
- **Fixed repo 30 pull failure** - server had uncommitted "Insights rename" changes
- Discovered GitHub already had the Insights rename (commit `a2cd635`)
- Reset server repo to discard redundant local commit
- Fixed `.git` folder permissions (mixed root/odoo18 ownership → all odoo18)
- Updated server remote URL from `SMEBusinessSupport` → `ai-sam-ai` (org renamed)
- Configured git identity on server: `Anthony SAM AI <anthony@sme.ec>`
- Pull now working for all 6 repos

### 2026-01-26
- **FEATURE:** Created Documentation Sync System for instant docs deployment
- **Cloudflare Tunnel set up:**
  - Installed cloudflared at `C:\Users\total\cloudflared.exe`
  - Tunnel name: `samai-docs-sync` (ID: a35ef380-30ed-4cd0-98fe-f5dc52fee7c2)
  - DNS: `docs-sync.sme.ec` → tunnel
  - Config: `C:\Users\total\.cloudflared\config.yml`
- **Webhook listener created:**
  - Location: `D:\github_repos\30_samai_saas_host_management\samai_software_documentation\sync_service\`
  - Token: `5d6cd7144f9540fab3c0ddc8faab7e1722e5e2a9c8d` (stored in .env)
- **Odoo module updated (ai_sam_insights):**
  - Added `insights.docs.sync.settings` model
  - Menu: SAM Insights → Sync Docs
  - **Requires module upgrade on server**
- **To start sync service:**
  ```powershell
  # Terminal 1 - Webhook
  cd D:\github_repos\30_samai_saas_host_management\samai_software_documentation\sync_service
  C:\Users\total\AppData\Local\Programs\Python\Python313\python.exe webhook_listener.py

  # Terminal 2 - Tunnel
  C:\Users\total\cloudflared.exe tunnel run samai-docs-sync
  ```
- **Note:** First sync is slow (~6MB docs, many small files). Consider rsync optimization.

### 2026-01-21
- **FEATURE:** Installed Docker log truncation helper for SaaS Kit
- Created `/usr/local/bin/truncate-docker-log` script (validates path before truncating)
- Created `/etc/sudoers.d/odoo-saas-kit` allowing `sam_ai` to run the script without password
- This enables the "Clear Logs" button in Odoo SaaS Kit to truncate container logs
- Related code changes: `odoo_saas_kit/models/lib/containers.py` - added `clear_container_logs()` function

### 2026-01-20
- **BUG FIX:** "Pull Updates" button failing with `<lambda>() missing 1 required positional argument: '_name'`
- Root cause: `odoo_saas_kit/__init__.py` had incorrect lambda signature for module stubs
- Fixed lines 57 and 70: `lambda _self, _name:` → `lambda _name:`
- Installed missing Python packages: `docker` and `paramiko` in Odoo venv
- Odoo service restarted and working

### 2026-01-19
- **CRITICAL FIX:** Odoo was returning 500 errors
- Root cause: Python venv was corrupted (pip shebang pointed to non-existent `/home/malik/zohaib/...`)
- Recreated venv: `rm -rf /opt/odoo18/odoo-venv && python3.10 -m venv /opt/odoo18/odoo-venv`
- Reinstalled all requirements: `pip install -r /opt/odoo18/odoo/requirements.txt`
- Installed additional packages: `httpx`, `numpy`, `scipy`
- **Module cleanup:**
  - Disabled legacy folder: `mv 05-samai-core _disabled_05-samai-core`
  - Disabled problematic module: `mv Odoo-18/the_ai_automator Odoo-18/_disabled_the_ai_automator`
  - Disabled `_06-samai-workflow-automator` (wrong repo)
  - Removed legacy paths from `/etc/odoo18.conf` addons_path
- **Field fix:** Added missing `template_id` field to `06_samai_extras/ai_sam_workflows_base/models/canvas.py`
- Deleted orphan database records for `workflow.template` model and `canvas.template_id` field
- Odoo now running successfully on port 1818
- **Cleanup phase 2:** Permanently deleted disabled legacy folders:
  - `/opt/odoo18/odoo_gh/_disabled_05-samai-core`
  - `/opt/odoo18/odoo_gh/_disabled_06-samai-workflow-automator`
  - `/opt/odoo18/odoo_gh/Odoo-18/_disabled_the_ai_automator`
- **Local sync:** Recovered workflow.template model from server backup
  - Created `D:\github_repos\06_samai_extras\ai_sam_workflows_base\models\workflow_template.py`
  - Updated `__init__.py` to import workflow_template
  - Uncommented `template_id` field in `canvas.py`
  - Added security access rules for `workflow.template`, `workflow.template.tag`, and `canvas.history` models

### 2026-01-16
- Fixed PostgreSQL not listening on Docker bridge (172.17.0.1) - restarted PG 14
- Created `samai_user` PostgreSQL user (password: samai) for SaaS containers
- Recreated odoo18_template_cont with correct DB credentials (was using non-existent `malik` user)
- Recreated client007.samai.software without env var overrides (was DB_HOST=127.0.0.1, now uses odoo.conf)
- Created tls.samai.software container with correct samai-addons mount (/home/sam_ai/samai-repos)
- All 4 containers now running and accessible via HTTPS
- Note: SAM AI addons path is `/home/sam_ai/samai-repos/` (mount as /mnt/samai-addons)

### 2026-01-15
- Fixed UFW firewall blocking outbound SMTP (ports 587, 465)
- Mailjet SMTP now working on port 587 (STARTTLS)
- Pulled latest code for 30_samai_saas_host_management (13_sam_ai_social_star docs)
- Pulled latest code for 04_samai_user_experience (sam_ui_theme updates)
- Restarted Odoo service
- Note: tls.samai.software container stuck (no DB, wrong DB_HOST)

### 2026-01-12
- Configured DNS for samai.software (name.com)
- Installed certbot, obtained wildcard SSL cert
- Updated nginx to include docker_vhosts
- Updated vhost template with SSL config
- Updated saas.conf nginx_vhosts path
- Updated SaaS Server domain from sme.ec to samai.software
- Tested https://test.samai.software - working!

### 2026-01-05
- Verified SSH connection working
- Created this context file
- Agent upgraded from Advisor to Implementer

---

## Notes

- New clients will be created as `*.samai.software`
- SSL wildcard cert covers all subdomains
- DNS TXT records at name.com can be deleted (were for cert validation)
- Consider setting up certbot auto-renewal hook for future
