# Multi-Agent Validation Protocol

**Purpose:** Orchestrate multiple AI agents to validate the same task from different perspectives, synthesize findings to centralized report, detect blind spots through consensus analysis.

---

## 🎯 Core Principle

> "AI agents are powerful yet not always thorough. Different agents give different answers. Multiple perspectives + centralized report = validation through diversity."

**The Pattern:**
1. Launch MULTIPLE specialist agents in PARALLEL on the SAME task
2. Each agent writes findings to SAME centralized report
3. Analyze consensus (agents agree = high confidence)
4. Analyze disagreement (agents conflict = needs investigation)
5. Reveal blind spots (what each agent missed that others caught)
6. Produce GO/NO-GO based on multi-agent synthesis

---

## 📊 Multi-Agent Validation Matrix

### For ISS/Installer Validation

| Agent | Perspective | Focus Area | Blind Spots |
|-------|------------|------------|-------------|
| **exe-onboard** | Onboarding | Does .iss align with project structure, paths, conventions? | May not catch build-specific issues |
| **exe-build** | Build | Can installer compile? File references valid? Build logic sound? | May not catch runtime issues |
| **exe-approval** | Validation | Manual trace of .iss logic, simulation of execution paths | May not know historical bugs |
| **odoo-debugger** | Error Patterns | Common mistakes, past bugs, anti-patterns from bug_history | May not know latest build changes |

**Coverage Formula:**
- 1 agent = 60-70% thoroughness (blind spots exist)
- 2 agents = 80-85% thoroughness (some overlap, some gaps filled)
- 3 agents = 90-95% thoroughness (cross-validation catches most issues)
- 4 agents = 95-99% thoroughness (comprehensive, multiple perspectives)

---

## 🚀 Orchestration Workflow

### Phase 1: Launch Agents in PARALLEL

**For ISS validation, launch:**
```
Task(subagent_type="exe-onboard", prompt="Review [.iss file] from onboarding perspective...")
Task(subagent_type="exe-build", prompt="Review [.iss file] from build perspective...")
Task(subagent_type="odoo-debugger", prompt="Review [.iss file] for common error patterns...")
```

**Critical:** Launch in SINGLE message (parallel execution, not sequential)

### Phase 2: Each Agent Writes to Centralized Report

**Report Location:** `C:\Working With AI\ai_sam\ai_sam\ai_sam_docs\reports\pre_iss_run_evaluation.md`

**Each agent appends their section:**
```markdown
## 🔍 [AGENT NAME] Findings

**Perspective:** [What lens they reviewed from]
**Findings:**
- ✅ GOOD: [What's working]
- ⚠️ RISKY: [What's concerning but not blocking]
- ❌ BLOCKING: [What prevents build/install]

**Recommendation:** GO / NO-GO / INVESTIGATE
**Reasoning:** [Why they recommend this]
```

### Phase 3: Synthesis & Consensus Analysis

**After all agents report, exe-approval synthesizes:**

#### A. Consensus Detection
```markdown
### Where Agents AGREE (High Confidence)
1. [Issue/Finding] - Agreed by: [Agent A, Agent B, Agent C]
   - Confidence: HIGH
   - Action: [Clear action based on agreement]
```

#### B. Disagreement Detection
```markdown
### Where Agents DISAGREE (Needs Investigation)
1. [Issue/Finding]
   - exe-onboard says: [opinion + reasoning]
   - exe-build says: [different opinion + reasoning]
   - **Resolution needed:** [What to investigate to resolve]
```

#### C. Blind Spot Detection
```markdown
### Blind Spots Revealed
- exe-onboard missed: [X] (caught by odoo-debugger)
- exe-build missed: [Y] (caught by exe-onboard)
- **Why this matters:** [Validation of multi-agent approach]
```

### Phase 4: Final Verdict

**Decision Tree:**
```
IF all agents say GO AND no critical issues:
  → VERDICT: GO (High confidence)

ELSE IF 2+ agents say NO-GO OR critical issues found:
  → VERDICT: NO-GO (Blockers exist)

ELSE IF agents disagree OR minor issues found:
  → VERDICT: INVESTIGATE (Resolve conflicts first)
```

---

## 📋 Report Template Structure

```markdown
# Pre-ISS Run Evaluation Report
**Generated:** [Timestamp]
**Evaluation Type:** [ISS Validation / PS1 Validation / Full Installer Review]
**Agents Consulted:** [List]

---

## 🚦 FINAL VERDICT: [GO / NO-GO / INVESTIGATE]

**Confidence Level:** [HIGH / MEDIUM / LOW]
- HIGH = All agents agree, no critical issues
- MEDIUM = Minor disagreements, no blockers
- LOW = Major disagreements or critical blockers

**Critical Blockers (Must fix):**
1. [Issue] - Found by: [Agents] - Severity: CRITICAL

**Recommended Actions:**
1. [Action] - Priority: [CRITICAL/HIGH/MEDIUM/LOW]

---

## 🧠 NON-TECH SUMMARY (For Anthony)

**In Plain English:**
[Explain status without jargon]

**What this means:**
[Implications]

**What you should do:**
[Clear next action]

---

## 📊 AGENT FINDINGS (By Perspective)

### [Agent 1 Section]
### [Agent 2 Section]
### [Agent 3 Section]
### [Agent 4 Section]

---

## 🔄 CONSENSUS ANALYSIS

### Where Agents AGREE
### Where Agents DISAGREE
### Blind Spots Revealed

---

## ✅ NEXT STEPS

**If GO:** [Actions]
**If NO-GO:** [Fix steps]
**If INVESTIGATE:** [Investigation needed]
```

---

## 🎯 Agent Selection Rules

### For Different Validation Types

**ISS File Validation:**
- Primary: exe-onboard, exe-build, exe-approval
- Optional: odoo-debugger (if historical bugs relevant)

**PS1 Script Validation:**
- Primary: exe-build, odoo-debugger
- Optional: exe-onboard (if path/structure relevant)

**Full Installer Review:**
- All: exe-onboard, exe-build, exe-approval, odoo-debugger

**Environment Readiness:**
- Primary: exe-approval, exe-session-cleanup
- Optional: odoo-debugger (if past environment issues exist)

---

## 🔍 Validation Thoroughness Checklist

### What Multi-Agent Validation Should Cover

**ISS Logic:**
- ✅ File references exist
- ✅ Paths are correct (absolute vs relative)
- ✅ No duplicate steps
- ✅ Proper execution order
- ✅ All dependencies included
- ✅ No conflicting operations

**PS1 Scripts:**
- ✅ Syntax valid
- ✅ Logic sound
- ✅ File/path references exist
- ✅ Dependencies available
- ✅ Error handling present
- ✅ No anti-patterns

**Environment:**
- ✅ No file locks
- ✅ No running services blocking
- ✅ Proper permissions
- ✅ No remnants from previous installs
- ✅ Required dependencies installed

**Build Readiness:**
- ✅ All source files present
- ✅ Compiler can access files
- ✅ No conflicting versions
- ✅ Output paths writable

---

## ⚠️ Common Disagreement Patterns

### Pattern 1: Severity Disagreement
**Scenario:** One agent says BLOCKING, another says RISKY

**Resolution:**
- Trust the agent with domain expertise (exe-build for build issues)
- Err on side of caution (treat as BLOCKING until proven otherwise)

### Pattern 2: Missing Context
**Scenario:** One agent flags issue, another doesn't see it

**Resolution:**
- Both may be right from their perspective
- Investigate why perspectives differ
- Usually reveals assumption mismatch

### Pattern 3: Historical vs. Current
**Scenario:** Debugger flags old pattern, builder says it's fixed

**Resolution:**
- Verify fix exists
- Update bug history if pattern resolved
- Keep watch for regression

---

## 🎓 Learning from Validation

### After Each Multi-Agent Validation

**Update agent knowledge when:**
1. Blind spot revealed → Add to that agent's checklist
2. Disagreement resolved → Document resolution pattern
3. New issue type found → Add to all relevant checklists
4. False positive detected → Refine detection criteria

**Example:**
```
Issue: exe-onboard flagged "missing file X"
Reality: File X is generated during build (not pre-existing)
Learning: Update exe-onboard to know "files generated during build"
```

---

## 📈 Success Metrics

**Multi-agent validation succeeds when:**
- ✅ User gets ONE clear report (not multiple conflicting responses)
- ✅ Confidence level matches reality (HIGH = actually ready)
- ✅ Blind spots are revealed and caught
- ✅ Disagreements surface valid investigation needs
- ✅ Non-tech summary is understandable without context
- ✅ Action items are clear and prioritized

**Multi-agent validation fails when:**
- ❌ All agents agree but still miss critical issue (update checklists)
- ❌ Disagreements are noise (not meaningful)
- ❌ Report is overwhelming (too much detail, no synthesis)
- ❌ User still confused after reading (summary not clear)

---

## 🔧 Continuous Improvement

### Agent Performance Tracking

Track per validation:
- What did each agent catch?
- What did each agent miss?
- Which disagreements were valid?
- Which agent recommendations were correct?

**Use this data to:**
1. Refine agent checklists
2. Adjust agent weighting (trust levels)
3. Add new validation dimensions
4. Remove redundant checks

---

## 🎯 The Meta-Pattern

**This protocol applies beyond ISS validation:**

- Pre-commit validation (code review by multiple agents)
- Pre-deploy validation (production readiness)
- Pre-merge validation (PR review)
- Architecture validation (design review)
- Security validation (vulnerability scan)

**Core principle remains:** Multiple perspectives + centralized synthesis = thorough validation

---

**Usage:** exe-approval reads this FIRST to understand orchestration approach
