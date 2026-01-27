# Build Artifacts vs. Source Components Definition

**Created:** 2025-11-13 (Response to critical deletion incident)
**Purpose:** Prevent confusion about what can be safely deleted during compilation

---

## 🎯 Core Principle

**BUILD ARTIFACTS** = Temporary files created DURING compilation (safe to delete)
**SOURCE COMPONENTS** = Permanent files used AS INPUTS to compilation (NEVER delete)

---

## 📊 Complete Classification

### ✅ BUILD ARTIFACTS (Safe to Delete)

**Category 1: Compilation Outputs**
```
output\*.exe                 # Old installer executables
output\*.tmp                 # Temporary build files
output\Setup-*.exe           # Old installers with version numbers
```
**Why safe:** These are OUTPUTS of compilation, recreated every build

**Category 2: Python Bundle (Rebuilt Every Time)**
```
bundled\python\              # Python embedded runtime + dependencies
```
**Why safe:** build_python_bundle.ps1 rebuilds this from scratch every compilation
**Rebuild time:** ~45 minutes
**Size:** ~300 MB

**Category 3: Build Logs**
```
logs\build_output_*.log      # Build script logs
logs\compile_output_*.log    # Inno Setup logs
logs\temp_*.txt              # Temporary diagnostic files
```
**Why safe:** Diagnostic outputs, not needed for next build

---

### ❌ SOURCE COMPONENTS (NEVER Delete)

**Category 1: Odoo Source Code**
```
bundled\server\              # Odoo 18.0 complete source
```
**Why critical:** Contains Odoo framework (100K+ files)
**Rebuild time:** ~45 minutes (git clone or download)
**Size:** ~500 MB
**Impact if deleted:** Cannot build Python bundle (needs requirements.txt)

**Category 2: PostgreSQL Binaries**
```
bundled\postgresql\          # PostgreSQL 15 portable binaries
```
**Why critical:** Database engine bundled with installer
**Rebuild time:** ~15 minutes (download + extract)
**Size:** ~150 MB
**Impact if deleted:** Installer incomplete, database won't work

**Category 3: SAM AI Modules**
```
bundled\addons\              # All 8 SAM AI modules
  ├── ai_brain\
  ├── ai_sam\
  ├── ai_sam_intelligence\
  ├── ai_sam_lead_generator\
  ├── ai_sam_workflows\
  ├── ai_sam_github_installer\
  ├── ai_sam_onboarding\
  └── ai_sam_sales_support\
```
**Why critical:** SAM AI custom modules (copied from repos)
**Rebuild time:** ~10 minutes (copy from source repos)
**Size:** ~50 MB
**Impact if deleted:** SAM AI won't have its core modules

**Category 4: Configuration Files**
```
config\paths.ps1             # Centralized path configuration
dev_files\requirements.txt   # Python dependencies list
dev_files\odoo_samai_installer.iss  # Inno Setup script
dev_files\*.ps1              # Build scripts
```
**Why critical:** These define HOW to build
**Rebuild time:** Cannot rebuild (manually created)
**Impact if deleted:** Build process completely broken

---

## 🚨 The Incident That Created This File

**Date:** 2025-11-12
**Agent:** /exe-update
**Mistake:** Ran `Remove-Item bundled\* -Recurse -Force`

**What was deleted:**
- ❌ bundled\server\ (~500 MB Odoo source)
- ❌ bundled\postgresql\ (~150 MB database)
- ❌ bundled\addons\ (~50 MB SAM AI modules)
- ✅ bundled\python\ (this one SHOULD have been deleted)

**Recovery time:** 2-3 hours to rebuild from scratch

**Root cause:** Protocol ambiguity - "clean build artifacts" was not defined

---

## 📋 Safe Cleanup Commands

### Correct Way (Preserves Source Components)
```powershell
# Clean old installer outputs
Remove-Item -Path "output\*" -Force -ErrorAction SilentlyContinue

# Clean ONLY Python bundle (rebuilt by build_python_bundle.ps1)
if (Test-Path "bundled\python") {
    Remove-Item -Path "bundled\python" -Recurse -Force -ErrorAction SilentlyContinue
}

# Clean old build logs (optional)
Remove-Item -Path "logs\build_output_*.log" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "logs\compile_output_*.log" -Force -ErrorAction SilentlyContinue
```

### ❌ WRONG Way (Destructive)
```powershell
# NEVER DO THIS - Deletes source components!
Remove-Item -Path "bundled\*" -Recurse -Force  # ← 700MB of sources lost!
```

---

## 🎯 Decision Tree: "Can I Delete This?"

```
Is it in bundled\?
├─ YES → What folder specifically?
│   ├─ bundled\python\ → ✅ SAFE (rebuilt every compile)
│   ├─ bundled\server\ → ❌ NEVER (Odoo source, 45 min rebuild)
│   ├─ bundled\postgresql\ → ❌ NEVER (Database, 15 min rebuild)
│   └─ bundled\addons\ → ❌ NEVER (SAM AI modules, 10 min rebuild)
│
└─ Is it in output\?
    ├─ *.exe → ✅ SAFE (old installers)
    └─ *.tmp → ✅ SAFE (temp files)

Is it in logs\?
└─ *.log → ✅ SAFE (old logs)

Is it in config\ or dev_files\?
└─ *.ps1, *.iss, *.txt → ❌ NEVER (source code, cannot rebuild)
```

---

## 🔍 Pre-Deletion Verification Protocol

**Before deleting ANY folder >100MB, run:**

```powershell
# Check folder size
$size = (Get-ChildItem -Path "bundled\" -Recurse -ErrorAction SilentlyContinue |
         Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "About to delete: $size MB"

# List top-level folders
Get-ChildItem -Path "bundled\" -Directory |
    Select-Object Name,
    @{Name="Size(MB)"; Expression={(Get-ChildItem $_.FullName -Recurse -ErrorAction SilentlyContinue |
                                    Measure-Object -Property Length -Sum).Sum / 1MB}} |
    Format-Table -AutoSize
```

**Red flags:**
- Size >100MB → Verify this is truly artifacts
- Folder named "server", "postgresql", "addons" → STOP, these are sources
- Multiple large folders → Likely deleting sources, not artifacts

---

## 📊 Rebuild Time Matrix

If accidentally deleted, here's recovery time:

| Folder | Category | Rebuild Time | Rebuild Method |
|--------|----------|--------------|----------------|
| `bundled\python\` | Artifact | ~45 min | Run build_python_bundle.ps1 |
| `bundled\server\` | **SOURCE** | **~45 min** | Git clone or download Odoo 18.0 |
| `bundled\postgresql\` | **SOURCE** | **~15 min** | Download PostgreSQL 15 binaries |
| `bundled\addons\` | **SOURCE** | **~10 min** | Copy from source repos |
| `output\*.exe` | Artifact | ~15 min | Run build_installer_final.ps1 |

**Total if all sources deleted:** 2-3 hours (+ download time)

---

## ✅ Agent Protocol Update

**For /exe-update and /exe-diagnose agents:**

### Before ANY deletion command:

1. **Read this file first** - Understand artifact vs. source distinction
2. **Check folder contents** - Use `Get-ChildItem` before `Remove-Item`
3. **Verify folder size** - If >100MB, extra caution required
4. **Use specific paths** - NEVER use wildcard `bundled\*`
5. **Add safety comments** - Explain WHY safe to delete

### Autonomous execution exception:

**Original rule:** Execute cleanup without asking
**NEW rule:** Execute cleanup without asking ONLY IF:
- Deleting `output\*` (always safe)
- Deleting `bundled\python\` (always safe, rebuilt automatically)
- Deleting `logs\*.log` (always safe)

**Ask user approval if:**
- Deleting anything else in `bundled\`
- Deleting >100MB total
- Using wildcards like `bundled\*` or `dev_files\*`

---

## 🎓 Knowledge Quiz (For Agent Self-Check)

**Before running cleanup, answer these:**

1. What's in `bundled\server\`?
   - ✅ Correct: Odoo 18.0 source code (500MB, 45 min to rebuild)
   - ❌ Wrong: "Temporary server files"

2. Is `bundled\python\` safe to delete?
   - ✅ Correct: YES (rebuilt by build_python_bundle.ps1 every compile)
   - ❌ Wrong: "No, it's a source component"

3. What happens if I delete `bundled\addons\`?
   - ✅ Correct: SAM AI modules lost, 10 minutes to copy from repos
   - ❌ Wrong: "No impact, they'll be recreated"

4. What does `Remove-Item bundled\* -Recurse -Force` delete?
   - ✅ Correct: EVERYTHING (python, server, postgresql, addons) - 700MB loss!
   - ❌ Wrong: "Just build artifacts"

5. Before deleting 500MB, what should I do?
   - ✅ Correct: Verify folder contents, check if sources, ask user if unsure
   - ❌ Wrong: "Trust the protocol, delete it"

**If you got ANY wrong, re-read this file before executing cleanup!**

---

## 📝 Lessons Learned

### What went wrong:
1. Protocol said "clean artifacts" but didn't define what "artifacts" means
2. Command used wildcard `bundled\*` without exclusions
3. No size check before deletion (700MB should have raised alarm)
4. No folder content verification before executing
5. `-Force` + `-ErrorAction SilentlyContinue` suppressed warnings

### What we fixed:
1. ✅ Created this knowledge file (artifact vs. source definitions)
2. ✅ Updated /exe-update protocol (specific path, not wildcard)
3. ✅ Added pre-deletion verification recommendations
4. ✅ Added size-based approval gates
5. ✅ Documented rebuild times (understand impact of mistakes)

---

## 🚀 Quick Reference Card

**SAFE TO DELETE:**
- ✅ `output\*.exe` (old installers)
- ✅ `bundled\python\` (rebuilt automatically)
- ✅ `logs\*.log` (old logs)

**NEVER DELETE:**
- ❌ `bundled\server\` (Odoo source, 45 min)
- ❌ `bundled\postgresql\` (Database, 15 min)
- ❌ `bundled\addons\` (SAM AI modules, 10 min)
- ❌ `config\*` (cannot rebuild)
- ❌ `dev_files\*.ps1` (cannot rebuild)

**VERIFICATION BEFORE DELETION:**
```powershell
# 1. List contents
Get-ChildItem "bundled\" -Directory

# 2. Check size
(Get-ChildItem "bundled\" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

# 3. If >100MB or contains "server/postgresql/addons" → STOP & VERIFY
```

---

**End of Build Artifacts Definition**

**Remember:** When in doubt, ask the user. A 30-second question prevents a 3-hour rebuild.
