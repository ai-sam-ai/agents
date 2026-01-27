# Compiler Technical Knowledge - Inno Setup & Windows Packaging

**Purpose:** Generic installer compilation knowledge (not SAM AI-specific)

---

## 🔧 Inno Setup Basics

### Configuration File: .iss Script

**Location (SAM AI):** `D:\...\dev_files\odoo_samai_installer.iss`

### Key Sections:

#### [Setup] - Installer Metadata
```ini
[Setup]
AppName=SAM AI
AppVersion=1.0.0
AppPublisher=Your Company
AppPublisherURL=https://samaidemo.com
DefaultDirName={pf}\SAM AI
DefaultGroupName=SAM AI
OutputDir=D:\...\Output
OutputBaseFilename=SAM_AI_Installer
Compression=lzma2/max
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=admin
UninstallDisplayIcon={app}\icon.ico
SetupIconFile=D:\...\assets\sam_icon.ico
WizardImageFile=D:\...\assets\wizard_image.bmp
```

**Common Issues:**
- ❌ Relative paths (use absolute or {constants})
- ❌ OutputDir doesn't exist (create folder first)
- ❌ Icon files wrong format (must be .ico for icons, .bmp for wizard)

#### [Files] - What to Bundle
```ini
[Files]
; Python portable
Source: "bundled\python\*"; DestDir: "{app}\python"; Flags: recursesubdirs

; PostgreSQL portable
Source: "bundled\postgresql\*"; DestDir: "{app}\postgresql"; Flags: recursesubdirs

; Odoo server
Source: "bundled\odoo\*"; DestDir: "{app}\odoo"; Flags: recursesubdirs

; SAM AI modules
Source: "bundled\addons\ai_brain\*"; DestDir: "{app}\addons\ai_brain"; Flags: recursesubdirs
Source: "bundled\addons\ai_sam\*"; DestDir: "{app}\addons\ai_sam"; Flags: recursesubdirs

; Config template
Source: "templates\odoo.conf"; DestDir: "{app}\config"; Flags: onlyifdoesntexist

; Scripts
Source: "scripts\start_odoo.bat"; DestDir: "{app}\scripts"
Source: "scripts\stop_odoo.bat"; DestDir: "{app}\scripts"
```

**Flags explained:**
- `recursesubdirs` - Copy entire folder tree
- `onlyifdoesntexist` - Don't overwrite on upgrade (preserve user config)
- `ignoreversion` - Always overwrite
- `dontcopy` - Don't install (used for unpacking only)

#### [Run] - Post-Install Tasks
```ini
[Run]
; Initialize database
Filename: "{app}\python\python.exe"; Parameters: "{app}\odoo\odoo-bin -c {app}\config\odoo.conf -d sam_ai --init=ai_brain,ai_sam --stop-after-init"; Description: "Initialize SAM AI database"; Flags: runhidden

; Register Windows service
Filename: "{app}\scripts\register_service.ps1"; Description: "Register SAM AI service"; Flags: runhidden

; Start service
Filename: "net"; Parameters: "start SAMAIService"; Description: "Start SAM AI"; Flags: runhidden postinstall
```

#### [UninstallRun] - Cleanup on Uninstall
```ini
[UninstallRun]
; Stop service
Filename: "net"; Parameters: "stop SAMAIService"; Flags: runhidden

; Unregister service
Filename: "sc"; Parameters: "delete SAMAIService"; Flags: runhidden

; Cleanup temp files
Filename: "{app}\scripts\cleanup.ps1"; Flags: runhidden
```

**Common Issue:** Missing [UninstallRun] leaves services running, registry keys intact

#### [Registry] - Windows Registry Keys (Optional)
```ini
[Registry]
; Add to PATH
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\python"; Flags: preservestringtype

; File associations
Root: HKCR; Subkey: ".samai"; ValueType: string; ValueData: "SAMAIFile"; Flags: uninsdeletekey
```

#### [Code] - Pascal Scripting (Advanced)
```pascal
[Code]
// Check if PostgreSQL already installed
function InitializeSetup(): Boolean;
begin
  Result := True;
  // Add pre-install checks here
end;

// Custom uninstall logic
procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin
  if CurUninstallStep = usPostUninstall then
  begin
    // Cleanup code here
  end;
end;
```

---

## 🔨 Compilation Process

### Command Line:
```powershell
# Compile installer
iscc "D:\...\dev_files\odoo_samai_installer.iss"

# Output location
# D:\...\Output\SAM_AI_Installer.exe
```

### Common Compilation Errors:

**Error:** "Source file not found"
```
Line 142: Source: "C:\old_path\file.exe"
Fix: Update path to actual file location
```

**Error:** "Invalid value for directive"
```
OutputDir=relative\path
Fix: Use absolute path or {constants}
```

**Error:** "Icon file invalid format"
```
SetupIconFile=image.png
Fix: Convert to .ico format (256x256 recommended)
```

---

## 📦 Bundling Python (Portable)

### Option A: WinPython Embedded
```powershell
# Download Python embeddable package
Invoke-WebRequest "https://www.python.org/ftp/python/3.10.11/python-3.10.11-embed-amd64.zip" -OutFile "python.zip"

# Extract
Expand-Archive "python.zip" -DestinationPath "bundled\python"

# Install pip (not included in embedded)
Invoke-WebRequest "https://bootstrap.pypa.io/get-pip.py" -OutFile "get-pip.py"
.\bundled\python\python.exe get-pip.py

# Install packages
.\bundled\python\python.exe -m pip install -r requirements.txt --target .\bundled\python\Lib\site-packages
```

### Option B: Full Python Installation
```powershell
# Install Python to custom location
python-3.10.11-amd64.exe /quiet InstallAllUsers=0 TargetDir="D:\...\bundled\python"

# Install packages
D:\...\bundled\python\python.exe -m pip install -r requirements.txt
```

**Pros/Cons:**
- Embedded: Smaller (~50MB), no registry, but limited
- Full: Complete (~200MB), includes tkinter/IDLE, easier package mgmt

---

## 🗄️ Bundling PostgreSQL (Portable)

### Download Portable Build:
```powershell
# PostgreSQL binaries (no installer)
Invoke-WebRequest "https://get.enterprisedb.com/postgresql/postgresql-15.3-1-windows-x64-binaries.zip" -OutFile "postgres.zip"

# Extract
Expand-Archive "postgres.zip" -DestinationPath "bundled\postgresql"
```

### Initialize Data Directory:
```powershell
# Create data folder
.\bundled\postgresql\bin\initdb.exe -D "bundled\postgresql\data" -U postgres -A trust

# Create sam_ai database
.\bundled\postgresql\bin\createdb.exe -U postgres sam_ai
```

**Size:** ~150MB (binaries + data folder)

---

## 🎨 Branding & UI

### Required Assets:

**Setup Icon (.ico):**
- Size: 256x256 pixels
- Format: .ico (not .png!)
- Tool: Use online converter or ImageMagick

**Wizard Image (.bmp):**
- Size: 164x314 pixels (Inno Setup standard)
- Format: .bmp 24-bit
- Content: Company branding, product logo

**Application Icon:**
- Size: 256x256 pixels
- Location: Bundled in {app}\icon.ico
- Used for: Shortcuts, uninstall entry

---

## 🔐 Code Signing (Optional - Production)

### Why Sign:
- Windows SmartScreen won't warn users
- Professional appearance
- Required for some enterprise deployments

### How to Sign:
```powershell
# Get code signing certificate (.pfx file)
# From: DigiCert, Sectigo, etc. ($200-400/year)

# Sign installer.exe
signtool sign /f "certificate.pfx" /p "password" /t "http://timestamp.digicert.com" "SAM_AI_Installer.exe"
```

**Note:** Unsigned installers show "Unknown publisher" warning (scary for users)

---

## 🧪 Testing Installer

### Silent Install (for testing):
```powershell
.\SAM_AI_Installer.exe /VERYSILENT /LOG="install_test.log" /DIR="C:\Test\SAM AI"
```

### Silent Uninstall:
```powershell
"C:\Test\SAM AI\unins000.exe" /VERYSILENT
```

### Extract Files Only (no install):
```powershell
.\SAM_AI_Installer.exe /EXTRACT:"C:\Extracted"
```

---

## ⚙️ Windows Service Registration

### Using NSSM (Non-Sucking Service Manager):
```powershell
# Download NSSM
Invoke-WebRequest "https://nssm.cc/release/nssm-2.24.zip" -OutFile "nssm.zip"

# Install service
.\nssm.exe install SAMAIService "C:\Program Files\SAM AI\python\python.exe" "C:\Program Files\SAM AI\odoo\odoo-bin -c C:\Program Files\SAM AI\config\odoo.conf"

# Set startup type
.\nssm.exe set SAMAIService Start SERVICE_AUTO_START

# Start service
.\nssm.exe start SAMAIService
```

### Using sc.exe (Built-in):
```powershell
sc create SAMAIService binPath= "C:\Program Files\SAM AI\python\python.exe C:\Program Files\SAM AI\odoo\odoo-bin -c ..." start= auto
```

**Note:** NSSM is more reliable for Python applications (handles output, restarts, etc.)

---

## 📊 Installer Size Optimization

### Typical Sizes:
- Python portable: ~50-200MB
- PostgreSQL portable: ~150MB
- Odoo 18 base: ~300MB
- SAM AI modules: ~10-50MB
- **Total:** ~500-700MB uncompressed

### Compression:
```ini
[Setup]
Compression=lzma2/max  ; Best compression (slower compile)
; or
Compression=lzma2/fast ; Faster compile, larger file
```

**lzma2/max:** ~500MB → ~200MB installer (good compression)

---

## 🚫 Common Pitfalls

**Pitfall 1: Hardcoded Paths**
```ini
; BAD
Source: "C:\Users\Developer\SAM AI\*"

; GOOD
Source: "bundled\*"  ; Relative to .iss file location
```

**Pitfall 2: Missing recursesubdirs**
```ini
; BAD (only copies folder, not contents)
Source: "addons\ai_brain"; DestDir: "{app}\addons"

; GOOD (copies entire tree)
Source: "addons\ai_brain\*"; DestDir: "{app}\addons\ai_brain"; Flags: recursesubdirs
```

**Pitfall 3: No Uninstall Cleanup**
```ini
; Forgot [UninstallRun] section
; Result: Services keep running, registry keys remain
```

**Pitfall 4: Admin Privileges Not Requested**
```ini
[Setup]
PrivilegesRequired=admin  ; REQUIRED for service registration
```

---

## 📋 Compilation Checklist

**Before compiling:**
- [ ] All Source paths in [Files] exist
- [ ] All bundled components present (Python, PostgreSQL, Odoo, SAM AI)
- [ ] odoo.conf template configured correctly
- [ ] Icon files in correct format (.ico, not .png)
- [ ] OutputDir exists
- [ ] Version number updated
- [ ] [Run] section includes database initialization
- [ ] [UninstallRun] section includes service cleanup
- [ ] Tested on clean Windows machine (VM recommended)

**After compiling:**
- [ ] installer.exe created in OutputDir
- [ ] File size reasonable (~200-300MB compressed)
- [ ] Silent install works (`/VERYSILENT`)
- [ ] Service registers correctly
- [ ] SAM AI accessible at http://localhost:8069
- [ ] Uninstaller works (removes files, services, registry)

---

**End of Compiler Technical Knowledge**
