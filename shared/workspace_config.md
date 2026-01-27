# Workspace Configuration - Agent Output Defaults

## Default Working Directory

**ALL agent outputs, reports, and temporary files should be saved to:**

```
D:\SAMAI-18-SaaS\github-repos\Wip-reports\
```

**UNLESS the user specifies a more specific location for a particular report.**

---

## Directory Structure

```
Wip-reports/
├── cto-developer/          # Code analysis, fix reports
├── cto-auditor/            # Audit reports, quality scores
├── cto-reporting/          # Strategic analysis reports
├── cto-architect/          # Planning documents, architecture diagrams
├── session-reports/        # Cross-agent session summaries
└── [other-agents]/         # All other agent reports
```

---

## When to Use This Location

**ALWAYS save to this location when:**
- Creating analysis reports
- Writing session summaries
- Saving architectural diagrams
- Documenting decisions
- Creating TODO lists
- Generating quality reports

**Example paths:**
- `D:\SAMAI-18-SaaS\github-repos\Wip-reports\cto-developer\fix-report-2025-11-30.md`
- `D:\SAMAI-18-SaaS\github-repos\Wip-reports\cto-auditor\audit-results-ai_sam.md`
- `D:\SAMAI-18-SaaS\github-repos\Wip-reports\session-reports\session-summary-2025-11-30.md`

---

## What NOT to Save Here

**Do NOT save production code here. Production code goes to:**
- Odoo modules: `C:\Working With AI\ai_sam\ai_sam\{module_name}\`
- Installer code: `D:\SAMAI-18-SaaS\github-repos\100-samai-desktop-installer\`

**This workspace is ONLY for:**
- Agent analysis/reports
- Planning documents
- Session logs
- Temporary working files

---

## File Naming Convention

**Format:** `{agent-name}_{document-type}_{date}_{description}.md`

**Examples:**
- `cto-developer_fix-report_2025-11-30_payment-validation.md`
- `cto-auditor_audit-results_2025-11-30_ai_sam-module.md`
- `cto-architect_architecture-plan_2025-11-30_workflow-redesign.md`
- `session-summary_2025-11-30_cto-ecosystem-consolidation.md`

---

## Auto-Cleanup Policy

**Agent outputs older than 30 days** can be archived or deleted (user's choice).

Keep this workspace clean - it's for ACTIVE work only.
