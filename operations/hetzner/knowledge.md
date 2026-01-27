# hetzner Knowledge Base

> Consolidated knowledge for the hetzner Agent
> Source: hetzner/
> Generated: 2026-01-28
>
> Original files:
> - hetzner_cloud_fundamentals.md
> - hetzner_implementer_protocol.md
> - hetzner_session_context.md
> - ssh_security_mastery.md

---

## 1. Hetzner Cloud Fundamentals

# Hetzner Cloud Fundamentals

**Purpose:** Core knowledge for Hetzner Cloud infrastructure management

---

## Hetzner Cloud Overview

### What It Is
- European cloud provider (German company, GDPR compliant)
- VPS/Cloud servers at competitive pricing
- Console: https://cloud.hetzner.com
- API available for automation

### Key Concepts

| Term | Human Translation | Tech Term |
|------|-------------------|-----------|
| Server | Your computer in the cloud | VPS/VM |
| SSH Key | Your secure password-free login | Ed25519/RSA key pair |
| Firewall | Who can knock on your door | Inbound/outbound rules |
| Floating IP | Address that can move between servers | Elastic IP |
| Volume | Extra hard drive you can attach | Block storage |
| Snapshot | Photo of your server at a moment | Backup image |

---

## Hetzner Cloud Console Navigation

### Dashboard Sections
1. **Servers** - Your running machines
2. **SSH Keys** - Keys you've uploaded (add BEFORE creating servers!)
3. **Firewalls** - Security rules (can apply to multiple servers)
4. **Volumes** - Extra storage
5. **Floating IPs** - Portable IP addresses
6. **Networks** - Private networking between servers
7. **Load Balancers** - Distribute traffic

### Critical First Steps
1. **Add SSH key FIRST** (Security > SSH Keys)
2. Create server and SELECT that key during creation
3. Server gets your public key automatically installed
4. You connect with your private key - no password needed

---

## Server Types (Current Pricing Reference)

### Shared vCPU (Best for starting)
| Type | vCPU | RAM | Disk | Price/mo |
|------|------|-----|------|----------|
| CX22 | 2 | 4GB | 40GB | ~€4 |
| CX32 | 4 | 8GB | 80GB | ~€8 |
| CX42 | 8 | 16GB | 160GB | ~€15 |

### Dedicated vCPU (For production)
| Type | vCPU | RAM | Disk | Price/mo |
|------|------|-----|------|----------|
| CCX13 | 2 | 8GB | 80GB | ~€13 |
| CCX23 | 4 | 16GB | 160GB | ~€25 |

### Locations
- **EU:** Falkenstein (fsn1), Nuremberg (nbg1), Helsinki (hel1)
- **US:** Ashburn (ash), Hillsboro (hil)
- **Asia:** Singapore (sin)

---

## Hetzner Cloud API

### When You Need It
- Automating server creation
- Scripted deployments
- CI/CD pipelines
- Terraform/Ansible integration

### API Token
1. Console > Security > API Tokens
2. Create token with Read/Write permissions
3. Store SECURELY (treat like password)
4. Use in automation tools

### CLI Tool: hcloud
```bash
# Install (user must run)
# Windows: scoop install hcloud
# Mac: brew install hcloud
# Linux: snap install hcloud

# Configure (user must run)
hcloud context create my-project
# Enter API token when prompted
```

---

## Common Hetzner Patterns

### Pattern 1: Single Web Server
- 1x CX22/CX32 server
- Firewall: Allow 22 (SSH), 80 (HTTP), 443 (HTTPS)
- Good for: Small apps, testing, development

### Pattern 2: App + Database
- 1x CX32 for application
- 1x CX32 for database
- Private network between them
- Firewall: Only app server exposed publicly

### Pattern 3: Production Setup
- Load balancer (public)
- 2+ app servers (private network)
- Database server (private network only)
- Firewall rules per tier

---

## Hetzner vs Other Providers

| Feature | Hetzner | AWS | DigitalOcean |
|---------|---------|-----|--------------|
| Pricing | Cheapest | Most expensive | Middle |
| EU Data | Native (German) | Regions available | Limited |
| Simplicity | Very simple | Complex | Simple |
| Scale | Good for SMB | Enterprise | Startups |
| Support | Basic | $$$ | Okay |

---

## Troubleshooting Quick Reference

### Can't Connect to Server
1. Is server running? (Check console)
2. Is your IP whitelisted in firewall?
3. Is SSH port (22) open in firewall?
4. Did you add SSH key BEFORE creating server?
5. Are you using correct username? (Usually `root` for new servers)

### Server Not Responding
1. Check Hetzner status page
2. Use console rescue mode
3. Check if you hit resource limits

### Firewall Not Working
1. Is firewall APPLIED to the server? (Common mistake)
2. Are rules in correct order? (First match wins)
3. Did you forget outbound rules?

---

## Security Best Practices

### Immediately After Server Creation
1. SSH in as root
2. Create non-root user with sudo
3. Add SSH key to new user
4. Disable root SSH login
5. Disable password authentication
6. Configure UFW firewall (in addition to Hetzner firewall)
7. Set up fail2ban (optional but recommended)

### Ongoing
- Keep system updated (`apt update && apt upgrade`)
- Monitor access logs
- Rotate API tokens periodically
- Use Hetzner firewall AS WELL AS server firewall (defense in depth)

---

## Quick Links

- Console: https://console.hetzner.cloud
- Documentation: https://docs.hetzner.com/cloud
- Status Page: https://status.hetzner.com
- Community: https://community.hetzner.com
- API Docs: https://docs.hetzner.cloud

---

## 2. Hetzner Implementer Protocol

# Hetzner Implementer Protocol

**Purpose:** Operational workflow for the Hetzner infrastructure specialist (UPGRADED from Advisor)

---

## Agent Identity

**Name:** Hetzner Infrastructure Specialist
**Archetype:** Implementer (UPGRADED - Can execute and persist)
**Color:** Purple (automation/infrastructure)
**Command:** `/hetzner`
**Version:** 2.0.0

### What I Am
- Your Hetzner Cloud hands-on specialist
- SSH executor (I run commands for you)
- Server configuration manager
- Context-aware (I remember your setup)
- Troubleshooter with execution power

### What I Am NOT
- A strategic advisor (that's /cto)
- Odoo deployment specialist (that's /cto-developer)
- Workflow automation (that's /n8n)

---

## STARTUP PROTOCOL (MANDATORY)

### Step 0: Load Session Context FIRST
```
BEFORE greeting user, BEFORE asking questions:
1. Read: hetzner_session_context.md
2. Know: Server IPs, SSH keys, users, current state
3. Reference: What was configured last session
```

**If context file doesn't exist:** Create it after gathering info this session.

### Step 1: Greet with Context
```
Hetzner Infrastructure Specialist ready.

Your servers:
- [server name] @ [IP] - [status]

SSH: [key location]
User: [username]

What do you need?
```

### Step 2: Then Load Knowledge
- hetzner_cloud_fundamentals.md
- ssh_security_mastery.md

---

## TOOL PERMISSIONS

### Allowed (Full Implementer)
- **Bash** - Execute SSH, test connections, run diagnostics
- **Read** - Check configs, diagnose issues
- **Write** - Update session context, create configs
- **Edit** - Modify SSH config, update context
- **Grep/Glob** - Search for patterns
- **WebFetch/WebSearch** - Get Hetzner docs

### Safety Rules (Still Apply)
Before DESTRUCTIVE operations, WARN:
- Disabling root login
- Changing SSH port
- Modifying firewall rules
- Deleting servers/volumes

**Template for dangerous ops:**
```
CAUTION: This could affect server access

What I'm about to do: [action]
Risk: [what could go wrong]
Recovery: [how to fix]

Proceeding in 5 seconds... (Ctrl+C to abort)
```

---

## WORKFLOW PHASES

### Phase 1: Context Check
1. Read hetzner_session_context.md
2. Display known servers/config
3. Identify what user needs

### Phase 2: Diagnose (if issue)
1. Test SSH connection: `ssh -v user@ip`
2. Check key: `ssh-add -l`
3. Verify server status (if API access)

### Phase 3: Execute
1. Run commands directly
2. Show output to user
3. Explain what happened

### Phase 4: Update Context
1. If config changed, update hetzner_session_context.md
2. Note what was done
3. Update "Last Session" section

---

## SESSION CONTEXT FILE STRUCTURE

```markdown
# Hetzner Session Context

## Servers
| Name | IP | Type | Purpose | User | Status |
|------|-----|------|---------|------|--------|
| samai-prod | x.x.x.x | CX22 | SAM AI Production | root | Active |

## SSH Configuration
- Key Type: Ed25519
- Key Location: C:\Users\total\.ssh\id_ed25519
- Config File: C:\Users\total\.ssh\config

## SSH Config Aliases
```
Host samai-prod
    HostName x.x.x.x
    User root
    IdentityFile ~/.ssh/id_ed25519
```

## Last Session
- Date: YYYY-MM-DD
- Actions: [what was done]
- Status: [current state]
- Notes: [anything important]

## Security Status
- [ ] Non-root user created
- [ ] Root login disabled
- [ ] Password auth disabled
- [ ] Firewall configured
```

---

## COMMON OPERATIONS

### Test Connection
```bash
ssh -o ConnectTimeout=5 user@ip "echo 'Connection successful'"
```

### Check SSH Key
```powershell
ssh-add -l
Get-Content ~/.ssh/id_ed25519.pub
```

### Quick Server Status
```bash
ssh user@ip "uptime && df -h && free -m"
```

### Update SSH Config
```powershell
# Add alias to SSH config
Add-Content -Path "$env:USERPROFILE\.ssh\config" -Value @"

Host alias-name
    HostName IP
    User username
    IdentityFile ~/.ssh/id_ed25519
"@
```

---

## DELEGATION RULES

### I Delegate TO:
- `/cto` - "Should we scale up? Which server type?"
- `/cto-developer` - "Deploy Odoo on this server"
- `/n8n` - "Set up webhook automation"

### I Receive FROM:
- `/cto` - "Get the Hetzner server ready for deployment"
- User - Direct infrastructure requests

---

## ERROR HANDLING

### Connection Failed
1. Check server status in Hetzner console
2. Verify IP address correct
3. Test with verbose: `ssh -v user@ip`
4. Check firewall rules

### Permission Denied
1. Verify correct key: `ssh -i path/to/key user@ip`
2. Check key is in agent: `ssh-add -l`
3. Verify authorized_keys on server

### Host Key Changed
1. If server was rebuilt: `ssh-keygen -R IP`
2. If unexpected: WARN user (possible MITM)

---

## SUCCESS CRITERIA

Session succeeds when:
- User can access their server
- Context file is updated
- Next session will have all context
- No repeated questions about config

---

## 3. Hetzner Session Context

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

---

## 4. Ssh Security Mastery

# SSH Security Mastery

**Purpose:** Complete guide to SSH key setup, secure connections, and best practices

---

## SSH Explained Simply

### What Is SSH?
- **S**ecure **Sh**ell - encrypted way to control remote computers
- Like a secure phone line to your server
- Replaces insecure methods (telnet, password-only)

### Key Pair Concept
```
┌─────────────────┐         ┌─────────────────┐
│  YOUR COMPUTER  │         │  HETZNER SERVER │
│                 │         │                 │
│  Private Key    │◄───────►│  Public Key     │
│  (SECRET!)      │  SSH    │  (Can share)    │
│  ~/.ssh/id_ed25519│       │  ~/.ssh/authorized_keys │
└─────────────────┘         └─────────────────┘

Private Key = Your secret password (NEVER share)
Public Key = Lock that only your key opens (safe to share)
```

---

## SSH Key Types

| Type | Security | Speed | Recommendation |
|------|----------|-------|----------------|
| Ed25519 | Excellent | Fast | USE THIS |
| RSA 4096 | Good | Slower | Legacy systems only |
| ECDSA | Good | Fast | Avoid (NSA concerns) |
| DSA | Weak | - | NEVER use |

---

## Step-by-Step: Generate SSH Key

### Windows (PowerShell)

**Command to run:**
```powershell
# Generate Ed25519 key (recommended)
ssh-keygen -t ed25519 -C "anthony@samai"

# When prompted:
# - File location: Press Enter for default (~/.ssh/id_ed25519)
# - Passphrase: Enter a strong passphrase (RECOMMENDED) or leave empty
```

**Expected output:**
```
Generating public/private ed25519 key pair.
Enter file in which to save the key (C:\Users\total/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in C:\Users\total/.ssh/id_ed25519
Your public key has been saved in C:\Users\total/.ssh/id_ed25519.pub
```

### What Gets Created
```
~/.ssh/
├── id_ed25519       # Private key (NEVER share, NEVER upload)
└── id_ed25519.pub   # Public key (this goes to Hetzner)
```

---

## Step-by-Step: Add Key to Hetzner

### Option A: Via Console (Before Server Creation)

1. Go to https://console.hetzner.cloud
2. Navigate to: Security > SSH Keys
3. Click "Add SSH Key"
4. Copy your PUBLIC key content:
   ```powershell
   # Run this to display your public key
   Get-Content ~/.ssh/id_ed25519.pub
   ```
5. Paste into Hetzner console
6. Give it a name (e.g., "Anthony-Laptop-2026")
7. **IMPORTANT:** When creating server, SELECT this key!

### Option B: Via CLI (After Server Exists)

**Commands for user to run on SERVER:**
```bash
# If you have console access or rescue mode:
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY_CONTENT_HERE" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

## Step-by-Step: Connect to Server

### First Connection

**Command to run:**
```powershell
# Connect to server
ssh root@YOUR_SERVER_IP

# Example:
ssh root@123.45.67.89
```

**First time warning (EXPECTED):**
```
The authenticity of host '123.45.67.89' can't be established.
ED25519 key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no)?
```

**What to do:**
1. Type `yes` and press Enter
2. This adds server to your known_hosts file
3. Future connections won't ask again

### Using SSH Config (Recommended)

**Create/edit config file:**
```powershell
# Create SSH config if doesn't exist
New-Item -Path "$env:USERPROFILE\.ssh\config" -ItemType File -Force
notepad "$env:USERPROFILE\.ssh\config"
```

**Add to config:**
```
# SAM AI Production Server
Host samai-prod
    HostName 123.45.67.89
    User root
    IdentityFile ~/.ssh/id_ed25519

# SAM AI Development Server
Host samai-dev
    HostName 123.45.67.90
    User root
    IdentityFile ~/.ssh/id_ed25519
```

**Now connect with:**
```powershell
ssh samai-prod
# Instead of: ssh root@123.45.67.89
```

---

## Security Hardening (After First Access)

### 1. Create Non-Root User

**Commands for user to run on SERVER:**
```bash
# Create user
adduser anthony

# Add to sudo group
usermod -aG sudo anthony

# Switch to new user
su - anthony

# Create SSH directory for new user
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Copy authorized_keys from root (or add your public key)
sudo cat /root/.ssh/authorized_keys > ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 2. Disable Root Login

**Edit SSH config on SERVER:**
```bash
sudo nano /etc/ssh/sshd_config
```

**Find and change:**
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

**Restart SSH:**
```bash
sudo systemctl restart sshd
```

### 3. Change SSH Port (Optional)

**In /etc/ssh/sshd_config:**
```
Port 2222
```

**Then update Hetzner firewall to allow port 2222!**

---

## Troubleshooting SSH Issues

### Problem: Permission Denied (publickey)

**Causes:**
1. Wrong key being used
2. Public key not on server
3. Permissions wrong on server

**Diagnose:**
```powershell
# Verbose connection to see what's happening
ssh -v root@YOUR_SERVER_IP
```

**Look for:**
- "Offering public key" - which key is being tried?
- "Server accepts key" or "No more authentication methods"

### Problem: Connection Refused

**Causes:**
1. SSH not running on server
2. Firewall blocking port 22
3. Wrong IP address
4. Server not running

**Fix:**
1. Check Hetzner console - is server running?
2. Check Hetzner firewall - is port 22 allowed from your IP?
3. Try Hetzner console rescue mode

### Problem: Host Key Changed Warning

**Message:**
```
WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
```

**Causes:**
1. Server was rebuilt/recreated
2. Someone is impersonating server (MITM attack)

**If you KNOW server was rebuilt:**
```powershell
# Remove old key
ssh-keygen -R YOUR_SERVER_IP

# Then connect again
ssh root@YOUR_SERVER_IP
```

---

## SSH Agent (Avoid Typing Passphrase)

### Windows (OpenSSH Agent)

**Enable agent service:**
```powershell
# Run as Administrator
Set-Service ssh-agent -StartupType Automatic
Start-Service ssh-agent
```

**Add key to agent:**
```powershell
ssh-add ~/.ssh/id_ed25519
# Enter passphrase once, then agent remembers
```

### Verify Key Loaded
```powershell
ssh-add -l
# Should show your key fingerprint
```

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Generate key | `ssh-keygen -t ed25519 -C "comment"` |
| View public key | `Get-Content ~/.ssh/id_ed25519.pub` |
| Connect | `ssh user@ip` |
| Connect verbose | `ssh -v user@ip` |
| Connect with specific key | `ssh -i ~/.ssh/mykey user@ip` |
| Copy file to server | `scp file.txt user@ip:/path/` |
| Copy file from server | `scp user@ip:/path/file.txt ./` |
| Remove known host | `ssh-keygen -R ip` |
| Add key to agent | `ssh-add ~/.ssh/id_ed25519` |
| List agent keys | `ssh-add -l` |

---

## Windows-Specific Notes

### Where Are SSH Files?
```
C:\Users\total\.ssh\
├── id_ed25519       # Private key
├── id_ed25519.pub   # Public key
├── known_hosts      # Servers you've connected to
└── config           # SSH aliases and settings
```

### OpenSSH Included in Windows 10/11
- Built-in since Windows 10 1803
- Use PowerShell or Windows Terminal
- Works same as Linux/Mac

### If ssh Command Not Found
```powershell
# Check if installed
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'

# Install if needed (Run as Admin)
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

---

*End of Knowledge Base*
