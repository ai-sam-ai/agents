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
