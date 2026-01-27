# Session-Start Document Optimization Guide

## Purpose
Analyze [session-start.md](C:\Users\total\.claude\commands\session-start.md) and identify gaps that lead to repeated mistakes and Claude drift.

## What to Check

### 1. Missing Constraint Rules
**Look for:** Mistakes that happen repeatedly across sessions
**Action:** Add explicit "NEVER" or "ALWAYS" rules

Example:
```markdown
### Code Creation Rules
- ✅ ALWAYS use `_inherit` to extend Odoo models
- ❌ NEVER create models with `_name` matching standard models
- ✅ ALWAYS add security rules for custom models
```

### 2. Environmental Setup Gaps
**Look for:** PostgreSQL/Odoo connection issues recurring
**Action:** Add verification steps

Example:
```markdown
### PostgreSQL Verification Required
Before proceeding, verify:
1. PostgreSQL service running: `sc query postgresql-x64-15`
2. User exists with CREATEDB: `psql -U postgres -c "\du odoo_user"`
3. Test connection: `psql -U odoo_user -d postgres -c "SELECT 1"`
```

### 3. Vague Architecture Guidelines
**Look for:** Confusion about where code belongs
**Action:** Add decision trees

Example:
```markdown
### File Placement Decision Tree
- Data model definition → `ai_brain/models/`
- Business logic method → `ai_brain/models/` (same model file)
- HTTP endpoint → `ai_sam/controllers/`
- JavaScript widget → `ai_sam/static/src/js/`
- View definition → `ai_sam/views/`
```

### 4. Weak Anti-Pattern Warnings
**Look for:** Same code smells appearing repeatedly
**Action:** Elevate to prominent warnings with examples

Example:
```markdown
## 🚨 CRITICAL: SQL Injection Prevention
❌ NEVER do this:
```python
cr.execute(f"DELETE FROM table WHERE id = {user_id}")
```

✅ ALWAYS do this:
```python
cr.execute("DELETE FROM table WHERE id = %s", (user_id,))
```
```

### 5. Missing Context Anchors
**Look for:** Claude forgetting project specifics mid-session
**Action:** Add prominent reminders about unique aspects

Example:
```markdown
## 🎯 THIS PROJECT IS UNIQUE
- We use **Canvas Skeleton Architecture** (ONE core, MANY skins)
- All new files go to `claudes floating files/` FIRST
- We score work out of 10 before proceeding
- We update session-start when patterns emerge
```

### 6. Insufficient Testing Triggers
**Look for:** Bugs discovered after implementation
**Action:** Add "must test before" checkpoints

Example:
```markdown
### Testing Checkpoints
Before marking complete, MUST test:
- [ ] Module installs without errors
- [ ] All models have security rules
- [ ] No SQL injection vulnerabilities
- [ ] Browser console has no errors
- [ ] Forms load and save correctly
```

### 7. Unclear Success Criteria
**Look for:** Ambiguous task completion definitions
**Action:** Define "done" explicitly

Example:
```markdown
### Definition of Done
A task is ONLY complete when:
1. Code written and tested
2. No errors in logs
3. Security verified
4. Documentation updated
5. Session-start updated if new patterns found
```

## Audit Output Format

When auditing, provide:

### Session-Start Gap Analysis
```markdown
## 🔍 Gaps Found in session-start.md

### Critical Gaps (Add Immediately)
1. **Missing: SQL Injection Prevention**
   - Found 3 instances of unsafe `cr.execute()` in current code
   - Recommendation: Add to mandatory code quality section

2. **Missing: Security Rule Requirement**
   - 2 models created without access rights in past sessions
   - Recommendation: Add to checklist before model creation

### Medium Priority Gaps
3. **Weak: File Path Conventions**
   - Current: Brief mention
   - Found: 5 instances of hardcoded paths in past 3 sessions
   - Recommendation: Upgrade to prominent warning with examples

### Drift Prevention Improvements
4. **Add: Mid-Session Context Anchors**
   - Claude forgets Canvas Skeleton architecture after 50+ exchanges
   - Recommendation: Add visual reminder at top of document

### Proposed Additions
[Specific markdown to add to session-start.md]
```

## Success Metrics

Session-start optimization is successful when:
- ✅ Same mistake doesn't repeat across sessions
- ✅ Claude maintains context through long sessions
- ✅ New developers onboard faster
- ✅ Fewer "wait, why did we do it this way?" moments
- ✅ Code review catches issues BEFORE implementation
