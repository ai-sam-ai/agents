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
