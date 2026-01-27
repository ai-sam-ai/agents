# ISS (Inno Setup) Validation Checklist

**Purpose:** Systematic checklist for validating Inno Setup installer scripts before compilation. Manual trace methodology to "run the ISS file mentally" and catch issues before build.

---

## 🎯 The Mental Simulation Approach

> "Review like you were the .iss file running, yet doing it manually for pre-.iss operation."

**Core Technique:** Trace installer execution path mentally:
1. Read .iss from top to bottom (in execution order)
2. For EVERY file reference → verify file exists
3. For EVERY path → verify path is correct
4. For EVERY operation → check if it can execute
5. For EVERY dependency → check if available
6. For EVERY conditional → trace both paths

---

## 📋 ISS File Structure Review

### Section 1: [Setup] - Installer Metadata

**Check:**
```ini
✅ AppName matches project name exactly
✅ AppVersion format correct (X.Y.Z)
✅ DefaultDirName path valid
✅ OutputDir exists and is writable
✅ OutputBaseFilename follows naming convention
✅ ArchitecturesInstallIn64BitMode correct (x64 vs x86)
✅ PrivilegesRequired matches needs (admin vs user)
✅ Compression settings appropriate
```

**Common Issues:**
- ❌ OutputDir path doesn't exist (build will fail)
- ❌ DefaultDirName references drive that may not exist
- ❌ Wrong architecture setting (64-bit app, 32-bit installer)
- ❌ Insufficient privileges (admin needed but not set)

---

### Section 2: [Languages] - Localization

**Check:**
```ini
✅ Language files referenced exist
✅ At least one language defined
✅ Language names standard (english, spanish, etc.)
```

**Common Issues:**
- ❌ Missing language file (compiler error)
- ❌ Typo in language name (runtime error)

---

### Section 3: [Tasks] - User-Selectable Options

**Check:**
```ini
✅ Task names unique (no duplicates)
✅ Task descriptions clear for users
✅ Default flags appropriate
✅ Conditions valid (if any)
```

**Common Issues:**
- ❌ Duplicate task names (compiler warning)
- ❌ Task references component that doesn't exist

---

### Section 4: [Files] - File Installation (MOST CRITICAL)

**The Big One - Trace EVERY Line:**

**For Each File Entry:**
```ini
Source: "path\to\file.exe"; DestDir: "{app}"; Flags: ignoreversion
```

**Validate:**
1. ✅ **Source path exists** (relative to .iss location or absolute)
   - Check: Does file actually exist on disk?
   - Common mistake: Path relative to wrong location

2. ✅ **Source path wildcards** (if using `*` or `?`)
   - Check: Does wildcard match expected files?
   - Common mistake: Wildcard matches nothing (silent failure)

3. ✅ **DestDir is valid**
   - `{app}` = Installation directory (always valid)
   - `{sys}` = System directory (valid)
   - Custom paths = verify they'll exist at runtime

4. ✅ **Flags are appropriate**
   - `ignoreversion` = Always copy (good for own files)
   - `replacesameversion` = Replace if same version
   - `recursesubdirs` = Copy entire folder tree
   - `createallsubdirs` = Create dest folders if missing

5. ✅ **No duplicate installations**
   - Same file installed multiple times?
   - Conflicting versions?

**Manual Trace Process:**
```
For EACH [Files] entry:
1. Open File Explorer
2. Navigate to Source path
3. Verify file exists
4. Note file size/version
5. Mentally simulate: "This file will be copied to {app}\[subdirs]"
6. Check: Will DestDir exist when installer runs?
7. Check: Any conflicts with other [Files] entries?
```

**Red Flags:**
- ❌ Source: "..\..\..\..\path" (too many parent dirs = wrong location)
- ❌ Source references absolute path on C:\ (won't exist on other machines)
- ❌ DestDir references non-existent custom folder without creating it first
- ❌ Same file listed twice with different flags (which wins?)
- ❌ Wildcard that matches 0 files (silent failure)

---

### Section 5: [Dirs] - Directory Creation

**Check:**
```ini
Name: "{app}\subfolder"; Permissions: users-modify
```

**Validate:**
1. ✅ **Directory names valid** (no illegal characters: `<>:"|?*`)
2. ✅ **Permissions appropriate** for folder use
3. ✅ **No duplicates** (same folder created twice)
4. ✅ **Order correct** (parent before child)

**Common Issues:**
- ❌ Create subfolder before parent (may fail)
- ❌ Permissions too restrictive (app can't write)
- ❌ Permissions too loose (security risk)

---

### Section 6: [Icons] - Start Menu / Desktop Shortcuts

**Check:**
```ini
Name: "{group}\AppName"; Filename: "{app}\app.exe"
```

**Validate:**
1. ✅ **Filename points to file that will be installed** (check [Files] section)
2. ✅ **WorkingDir appropriate** (usually `{app}`)
3. ✅ **IconFilename exists** (if custom icon)
4. ✅ **Parameters valid** (if launching with args)
5. ✅ **No duplicate shortcuts**

**Common Issues:**
- ❌ Shortcut points to file not in [Files] section (broken shortcut)
- ❌ WorkingDir wrong (app can't find resources)
- ❌ Icon file missing (default icon used)

---

### Section 7: [Registry] - Windows Registry Modifications

**Check:**
```ini
Root: HKLM; Subkey: "Software\MyApp"; ValueType: string; ValueName: "Path"; ValueData: "{app}"
```

**Validate:**
1. ✅ **Root appropriate** (HKLM = all users, HKCU = current user)
2. ✅ **Subkey path valid** (no illegal characters)
3. ✅ **ValueType matches ValueData** (string vs dword vs binary)
4. ✅ **Permissions sufficient** (HKLM needs admin)
5. ✅ **Uninstall behavior defined** (will registry keys be removed?)

**Common Issues:**
- ❌ HKLM write without admin privileges (will fail)
- ❌ ValueType mismatch (e.g., dword with string data)
- ❌ Registry keys not cleaned up on uninstall

---

### Section 8: [Run] - Post-Install Execution

**Check:**
```ini
Filename: "{app}\setup.exe"; Parameters: "/install"; Flags: postinstall
```

**Validate:**
1. ✅ **Filename points to installed file** (check [Files] section)
2. ✅ **Parameters valid** for that executable
3. ✅ **Flags appropriate** (postinstall = user prompted, nowait = don't wait for finish)
4. ✅ **WorkingDir appropriate**
5. ✅ **Conditions valid** (if any)

**Common Issues:**
- ❌ Run .exe not in [Files] section (will fail)
- ❌ Parameters wrong (app crashes or errors)
- ❌ Missing `nowait` flag when needed (installer hangs)
- ❌ Running service without admin rights

---

### Section 9: [UninstallRun] - Pre-Uninstall Execution

**Check:**
```ini
Filename: "{app}\cleanup.exe"; Parameters: "/uninstall"
```

**Validate:**
1. ✅ **Filename still exists at uninstall time** (not deleted earlier)
2. ✅ **Parameters appropriate for cleanup**
3. ✅ **Order correct** (stop services before deleting files)

**Common Issues:**
- ❌ File already deleted when uninstall runs (fails)
- ❌ Service not stopped before file deletion (locked file)

---

### Section 10: [Code] - Pascal Script (Advanced)

**Check:**
- ✅ Syntax valid (if using Pascal scripting)
- ✅ Functions called are defined
- ✅ Variables initialized before use
- ✅ Error handling present
- ✅ No infinite loops

**Common Issues:**
- ❌ Typos in function names (compiler error)
- ❌ Missing `begin`/`end` pairs
- ❌ Uninitialized variables

---

## 🔍 Cross-Section Validation

### After Reviewing All Sections

**Check Cross-References:**
1. ✅ **Every [Icons] Filename exists in [Files]**
2. ✅ **Every [Run] Filename exists in [Files]**
3. ✅ **Every [UninstallRun] Filename exists in [Files]**
4. ✅ **Registry paths reference installed files**
5. ✅ **No circular dependencies**

**Check Execution Order:**
1. ✅ **Directories created before files installed to them**
2. ✅ **Files installed before shortcuts created**
3. ✅ **Dependencies installed before dependent apps**
4. ✅ **Services stopped before files replaced**

**Check for Duplicates:**
1. ✅ **No duplicate file installations** (same source, same dest)
2. ✅ **No duplicate directory creations**
3. ✅ **No duplicate registry keys**
4. ✅ **No duplicate shortcuts**

---

## ⚠️ Common ISS Anti-Patterns

### Anti-Pattern 1: Hardcoded Absolute Paths
```ini
❌ Source: "C:\Users\Anthony\MyProject\app.exe"
✅ Source: "..\..\build\app.exe"  (relative to .iss)
```

### Anti-Pattern 2: Missing File Existence Checks
```ini
❌ Source: "build\app.exe"  (assumes build happened)
✅ Check: Does build\app.exe exist before compiling?
```

### Anti-Pattern 3: Wrong Path Separators
```ini
❌ Source: "build/app.exe"  (Unix style, may fail on Windows)
✅ Source: "build\app.exe"  (Windows style)
```

### Anti-Pattern 4: Overly Broad Wildcards
```ini
❌ Source: "*.*"  (copies EVERYTHING, including junk)
✅ Source: "*.exe"; Source: "*.dll"  (specific)
```

### Anti-Pattern 5: Missing Admin Privileges
```ini
❌ PrivilegesRequired=lowest + HKLM registry writes (will fail)
✅ PrivilegesRequired=admin (when needed)
```

### Anti-Pattern 6: Uninstall Doesn't Clean Up
```ini
❌ Registry keys created, never removed
✅ Registry keys have uninstall behavior defined
```

---

## 🎯 The 9 Critical Questions

Before approving any .iss file:

1. **Do ALL source files exist?** (manually verify each)
2. **Are ALL paths correct?** (relative vs absolute)
3. **Are there duplicate operations?** (same file twice)
4. **Is execution order correct?** (dirs before files, etc.)
5. **Are permissions sufficient?** (admin when needed)
6. **Are cross-references valid?** (shortcuts point to real files)
7. **Will uninstall work?** (cleanup defined)
8. **Are there hardcoded paths?** (won't work on other machines)
9. **Have you traced EVERY line mentally?** (simulated execution)

**If ANY answer is NO or UNSURE → NO-GO**

---

## 🧪 Manual Trace Example

**Given this .iss snippet:**
```ini
[Files]
Source: "C:\SAM AI\build\app.exe"; DestDir: "{app}"; Flags: ignoreversion
```

**Manual Trace:**
1. ❓ Does `C:\SAM AI\build\app.exe` exist on THIS machine? (check now)
2. ❓ Will `C:\SAM AI\build\app.exe` exist on BUILD MACHINE? (may differ)
3. ❌ **ISSUE FOUND:** Absolute path `C:\` won't work on other machines
4. ❌ **BLOCKING:** Must change to relative path
5. ✅ `DestDir: "{app}"` is valid (will be resolved at install time)
6. ✅ `Flags: ignoreversion` appropriate for app executable

**Verdict:** NO-GO (fix absolute path first)

---

## 📊 Validation Depth Levels

### Level 1: Quick Scan (5 minutes)
- File references exist?
- No obvious typos?
- Basic structure correct?

### Level 2: Thorough Review (15 minutes)
- All sections validated
- Cross-references checked
- Common anti-patterns searched

### Level 3: Mental Simulation (30+ minutes)
- **THIS IS WHAT YOU REQUESTED**
- Trace EVERY line mentally
- Verify EVERY file exists
- Simulate EVERY operation
- Check EVERY edge case

**exe-approval does Level 3 by default.**

---

## ✅ Sign-Off Criteria

**ISS file approved when:**
- ✅ All source files verified to exist
- ✅ All paths are correct (relative, not absolute)
- ✅ No duplicate operations found
- ✅ Execution order logical
- ✅ Cross-references valid
- ✅ Permissions sufficient
- ✅ Uninstall behavior defined
- ✅ No anti-patterns detected
- ✅ Mental trace completed without issues

**Until ALL criteria met → Status: NO-GO**

---

**Usage:** exe-approval uses this checklist when reviewing .iss files
