# Pre-Push Checklist

## Critical Validations Before Push

### 1. Secret Detection
**Why:** Prevent leaking credentials, API keys, passwords

**Check for:**
```bash
# Search staged files for common secret patterns
git diff --staged | grep -iE "(password|api[_-]?key|secret|token|private[_-]?key)"
```

**Common secret files to NEVER commit:**
- `.env` files
- `credentials.json`
- `config.local.py`
- `*.pem`, `*.key` files
- `secrets.txt`

**Action if found:**
- ❌ STOP the commit
- Remove file from staging: `git reset HEAD <file>`
- Add to `.gitignore`
- Alert user

### 2. File Size Validation
**Why:** GitHub has limits, large files slow down repos

**Limits:**
- ⚠️ Warning at **1 MB**
- ❌ Block at **50 MB** (GitHub limit: 100 MB)

**Check:**
```bash
# Find large staged files
git diff --staged --stat | awk '{if ($3 > 1000000) print}'
```

**Action if found:**
- Large logs → Should be in `.gitignore`
- Database dumps → Use external storage
- Compiled binaries → Exclude from repo
- Media files → Consider Git LFS

### 3. Python Syntax Validation
**Why:** Catch syntax errors before pushing

**If `.py` files changed:**
```bash
# Get list of Python files in staging
git diff --staged --name-only | grep "\.py$"

# Validate each file
python -m py_compile <file>
```

**Common issues:**
- Indentation errors
- Missing colons
- Unclosed brackets/quotes
- Invalid escape sequences

**Action if errors:**
- ❌ STOP the commit
- Show syntax errors to user
- Fix before proceeding

### 4. Odoo Manifest Validation
**Why:** Invalid manifests break module installation

**If `__manifest__.py` changed:**
```python
# Check manifest can be loaded
python -c "import ast; ast.literal_eval(open('__manifest__.py').read())"
```

**Required fields:**
- `'name'`
- `'version'`
- `'depends'` (list)
- `'data'` (list if views/data exist)

**Action if invalid:**
- ❌ STOP the commit
- Show validation error
- Fix manifest structure

### 5. .gitignore Compliance
**Why:** Don't commit temporary/generated files

**Check for files that should be ignored:**
```bash
# Common patterns to block
*.pyc
*.pyo
__pycache__/
*.log
.vscode/
.idea/
node_modules/
*.swp
*~
.DS_Store
```

**Action if found:**
- Warn user
- Suggest adding to `.gitignore`
- Ask if they really want to commit

### 6. Odoo Security Files
**Why:** Every model needs access rights

**If new models added (new `.py` in `models/`):**
- Check if `security/ir.model.access.csv` updated
- Warn if missing entries

**Check:**
```bash
# Count models vs access rights
model_count=$(grep -r "_name = " models/ | wc -l)
access_count=$(wc -l < security/ir.model.access.csv)

if [ $access_count -le $model_count ]; then
  # Warn about potential missing access rights
fi
```

### 7. Debug Code Detection
**Why:** Don't ship debug code to production

**Search for:**
```bash
# JavaScript console statements
git diff --staged | grep -n "console\.\(log\|debug\|warn\)"

# Python debug statements
git diff --staged | grep -n "print("
git diff --staging | grep -n "import pdb"
git diff --staged | grep -n "breakpoint()"
```

**Action:**
- ⚠️ Warn user (don't block)
- Suggest removal
- Allow override if intentional logging

### 8. Trailing Whitespace Check
**Why:** Clean code standards

**Check:**
```bash
git diff --staged --check
```

**Action:**
- ⚠️ Warn (don't block)
- Offer to auto-fix with `git add -u`

### 9. Branch Verification
**Why:** Ensure pushing to correct branch

**Check:**
```bash
current_branch=$(git branch --show-current)

if [ "$current_branch" != "master" ]; then
  # Warn user about non-master push
fi
```

**For this project:** Always `master`

### 10. Uncommitted Changes Warning
**Why:** Don't leave work unstaged

**Check:**
```bash
git status --porcelain | grep "^??"
git status --porcelain | grep "^ M"
```

**Action:**
- ⚠️ Inform user about unstaged files
- Ask if they want to stage them too
- Proceed with current staging if user declines

## Checklist Execution Order

```
1. Secret Detection        [CRITICAL - Block if found]
2. File Size Validation    [CRITICAL - Block if >50MB]
3. Python Syntax           [CRITICAL - Block if errors]
4. Odoo Manifest           [CRITICAL - Block if invalid]
5. .gitignore Compliance   [WARNING - Suggest fixes]
6. Security Files          [WARNING - Remind about access rights]
7. Debug Code Detection    [WARNING - Suggest cleanup]
8. Trailing Whitespace     [INFO - Offer auto-fix]
9. Branch Verification     [INFO - Confirm branch]
10. Uncommitted Changes    [INFO - Remind about unstaged]
```

## Agent Behavior

### If CRITICAL checks fail:
```
❌ Pre-push validation FAILED

Issue: [Specific problem]
File: [File path]
Line: [Line number if applicable]

❌ COMMIT BLOCKED - Please fix the issue before proceeding.
```

### If WARNING checks triggered:
```
⚠️ Pre-push warnings detected

Issue: [Specific problem]
Recommendation: [How to fix]

Continue anyway? (y/n)
```

### If all checks pass:
```
✅ Pre-push validation PASSED

Proceeding with commit...
```

## User Override

Allow user to skip checks with flag:
```
/git-push --no-validate
```

But always run secret detection (can't override).
