# Git Workflow Patterns

## Established Workflow (From Chat History)

### Phase 1: Pre-Commit Analysis
```bash
# Always start here
git status
```

**What to look for:**
- Untracked files (new files created)
- Modified files (existing changes)
- Deleted files (removed files)
- Unmerged paths (conflicts - rare)

### Phase 2: Intelligent Staging

**Current Pattern (Manual):**
User stages changes by directory/category:
```bash
git add the_ai_automator/models/
git add the_ai_automator/views/
git add the_ai_automator/static/src/js/
git add the_ai_automator/controllers/
git add the_ai_automator/security/
git add the_ai_automator/data/
git add the_ai_automator/__manifest__.py
git add ai_brain/models/
# ... (8-10 commands per commit)
```

**Agent Should Do (Automated):**
```bash
# Detect Odoo module context
# Group changes by:
# 1. Module name (the_ai_automator, ai_brain, etc.)
# 2. File type (models, views, static, etc.)
# 3. Logical grouping (related features)

# Then stage intelligently
git add <module>/<category>/
```

### Phase 3: Commit Message Generation

**Pattern:** Structured, emoji-marked sections with detailed changelog

Example structure:
```
🎯 [Main Feature/Change Summary]

📊 Changes Made:
- Bullet point 1
- Bullet point 2

🎨 UI/UX Updates: (if applicable)
- Frontend changes

🗃️ Data Models: (if applicable)
- Database/model changes

📚 Documentation: (if applicable)
- Doc updates

🔧 Technical Improvements:
- Performance optimizations
- Code quality improvements

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Phase 4: Pre-Push Validation

**Current:** None (direct commit → push)

**Agent Should Add:**
1. Check for secrets (.env, tokens, passwords)
2. Validate Python syntax (if .py files changed)
3. Check file sizes (no massive files)
4. Verify manifest files if Odoo modules changed
5. Ensure .gitignore patterns respected

### Phase 5: Push to Remote

```bash
# Standard push
git push origin master

# Verify push succeeded
git status
```

## Staging Patterns by File Type

### Python Files (`.py`)
- Group by module: `git add <module>/models/*.py`
- Check syntax before staging
- Ensure `__init__.py` included if new files

### XML Files (`.xml`)
- Views: `git add <module>/views/`
- Data: `git add <module>/data/`
- Security: `git add <module>/security/`

### JavaScript Files (`.js`)
- Static assets: `git add <module>/static/src/js/`
- Check for console.log statements (remove debug code)

### CSS/SCSS Files
- `git add <module>/static/src/css/`

### Manifest Files
- Always include if module structure changed
- `git add <module>/__manifest__.py`

### Documentation (`.md`)
- Group with related code changes
- `git add docs/` or `git add <module>/README.md`

## Directory-First Staging Strategy

When multiple files in a directory changed:
```bash
# ✅ GOOD (current pattern)
git add the_ai_automator/models/

# ❌ AVOID (tedious)
git add the_ai_automator/models/ai_service.py
git add the_ai_automator/models/canvas.py
git add the_ai_automator/models/workflow.py
# ... (repeated 20 times)
```

## Commit Frequency

**Pattern:** Batched commits after significant work
- Not committing after every small change
- Grouping related changes into logical commits
- Commit messages reflect multiple related changes

## Push Timing

**Pattern:** Immediately after commit
- `git commit` → `git push` (sequential)
- No delay or batching of pushes
- Every commit is pushed to remote

## Error Handling

**Historical Issues:** None recently
**If errors occur:**
1. Authentication failed → Check credentials
2. Push rejected → Pull first, then push
3. Conflicts → Manual resolution needed
4. Network issues → Retry after delay
