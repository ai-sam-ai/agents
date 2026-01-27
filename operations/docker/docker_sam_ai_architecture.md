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
