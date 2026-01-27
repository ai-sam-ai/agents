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
