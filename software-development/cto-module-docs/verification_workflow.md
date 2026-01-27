# Documentation Verification Workflow

> **Purpose:** Ensure documentation accurately reflects code reality

---

## When to Verify

1. **Before creating docs** - Understand current state
2. **After creating docs** - Confirm accuracy
3. **When user reports issue** - Check for drift
4. **Periodic review** - Keep docs current

---

## Verification Checklist

### Identity Verification

```bash
# Read manifest for ground truth
Read: {module_path}/__manifest__.py

# Check:
- [ ] Technical name matches folder name
- [ ] Version in docs matches manifest 'version'
- [ ] Author/maintainer correct
- [ ] License correct
```

### Path Verification

```bash
# Verify source path exists
Check: {source_path} exists

# Verify docs path exists
Check: docs/04_modules/{module_name}/ exists

# Verify manifest path
Check: {source_path}/__manifest__.py exists
```

### Dependency Verification

```bash
# From manifest
Read: __manifest__.py → 'depends' list

# From external dependencies (if any)
Read: __manifest__.py → 'external_dependencies' → 'python'

# Check:
- [ ] All Odoo dependencies listed in META
- [ ] All Python libraries listed in META
- [ ] No extra dependencies in docs that don't exist in code
```

### Model Verification

```bash
# Count models in code
Glob: {module_path}/models/*.py
Read each, find: class {Name}(models.Model)

# Check:
- [ ] Model count in SCHEMA matches actual count
- [ ] All models documented (not just main ones)
- [ ] Field lists complete
- [ ] _name matches model name in docs
```

### Controller Verification

```bash
# Find controllers
Glob: {module_path}/controllers/*.py
Grep: @http.route

# Check:
- [ ] Controller count matches docs
- [ ] All routes documented
- [ ] Methods (GET/POST) correct
- [ ] Auth types (public/user) correct
```

### Cross-Reference Verification

```bash
# For each cross-reference in META
Check: Target file/folder exists

# Common references:
- Related modules → docs/04_modules/{module}/
- Architecture docs → docs/05_architecture/{topic}/
- Data flow docs → docs/06_data_flows/{topic}/
```

---

## Verification Report Format

```markdown
## Verification Report: {module_name}

**Date:** {YYYY-MM-DD}
**Verified by:** CTO Module Docs Agent

### Identity
| Item | Docs Value | Code Value | Match |
|------|------------|------------|-------|
| Technical Name | {docs} | {code} | ✅/❌ |
| Version | {docs} | {code} | ✅/❌ |
| Source Path | {docs} | {exists?} | ✅/❌ |

### Dependencies
| Dependency | In Docs | In Code | Match |
|------------|---------|---------|-------|
| {dep1} | ✅/❌ | ✅/❌ | ✅/❌ |

### Models
| Model | In Docs | In Code | Fields Match |
|-------|---------|---------|--------------|
| {model1} | ✅/❌ | ✅/❌ | ✅/❌/⚠️ |

### Controllers
| Route | In Docs | In Code | Match |
|-------|---------|---------|-------|
| {route1} | ✅/❌ | ✅/❌ | ✅/❌ |

### Cross-References
| Reference | Target Exists |
|-----------|---------------|
| {ref1} | ✅/❌ |

### Summary
- Total checks: {n}
- Passed: {n}
- Failed: {n}
- Warnings: {n}

### Issues Found
1. {issue description}
2. {issue description}

### Recommended Actions
1. {action}
2. {action}
```

---

## Staleness Detection

### Signs of Stale Documentation

1. **Version mismatch** - Manifest version > docs version
2. **Missing models** - Code has models not in SCHEMA
3. **Extra models** - SCHEMA lists models not in code
4. **Broken cross-refs** - Links to non-existent files
5. **Old verification date** - Last verified > 30 days ago

### Staleness Indicators

| Indicator | Severity | Action |
|-----------|----------|--------|
| Version mismatch | 🔴 High | Update immediately |
| Missing model | 🔴 High | Add to SCHEMA |
| Missing fields | 🟡 Medium | Update SCHEMA |
| Old verification | 🟡 Medium | Re-verify |
| Broken link | 🟡 Medium | Fix or remove |
| Minor text updates | 🟢 Low | Update when convenient |

---

## Automated Checks

### Quick Verification Commands

```bash
# Check manifest version
grep -o "version.*" {module_path}/__manifest__.py

# Count models
grep -r "class.*models.Model" {module_path}/models/ | wc -l

# Count controllers
grep -r "@http.route" {module_path}/controllers/ | wc -l

# Find all dependencies
grep -A 10 "'depends'" {module_path}/__manifest__.py
```

### Compare Docs to Code

```bash
# Extract version from docs
grep "Version" {docs_path}/{module}_META.md

# Extract version from code
grep "version" {module_path}/__manifest__.py

# Compare (manual check)
```

---

## Post-Verification Actions

### If All Checks Pass
1. Update verification date in META file
2. Update Change History if any edits made
3. Report success to user

### If Issues Found
1. Report issues to user
2. Ask if should auto-fix or manual review
3. Make corrections
4. Re-verify
5. Update verification date

---

## Verification Frequency Recommendation

| Module Type | Frequency |
|-------------|-----------|
| Core (ai_sam, ai_sam_base) | Weekly |
| Active development | After each change |
| Stable/mature | Monthly |
| Deprecated | Quarterly |
