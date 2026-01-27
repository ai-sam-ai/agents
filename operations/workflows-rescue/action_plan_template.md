# Flatline Migration Action Plan Template

**Purpose**: Handover document from "Bible creation" → "Production fixes"
**Output File**: `C:\Working With AI\ai_sam\ai_sam\ai_sam_introduction\FLATLINE_ACTION_PLAN.md`
**Audience**: Future production agents + humans making fixes

---

## 📋 Action Plan Structure

### Header Section
```markdown
# FLATLINE MIGRATION ACTION PLAN

**Created**: [DATE]
**Status**: Bible Creation Complete → Ready for Production Testing
**Bible Location**: [workflow_bible.html](file://${REPO_SAM_INTRO}/workflow_bible.html)
**CTO Report**: [FLATLINE_ARCHITECTURE_REPORT.md](file://${REPO_SAM_INTRO}/FLATLINE_ARCHITECTURE_REPORT.md)

**Mission**: Systematic testing and resolution of 13 identified breakpoints to complete flatline migration

---

## 📊 Executive Summary

### What Was Done (Bible Creation Phase)
- ✅ Complete architecture analysis (CTO Report - 1,527 lines)
- ✅ 13 breakpoints identified and documented
- ✅ User-facing feature inventory (X features cataloged)
- ✅ Visual HTML Bible created (workflow_bible.html)
- ✅ Testing checklist prepared (Phase 1-4)

### What's Next (Production Phase)
- 🔴 Immediate: Phase 1 UI Testing (48 hours)
- 🟠 Short-Term: Core workflow verification (2 weeks)
- 🟡 Medium-Term: Missing features, migration, concurrency (1-2 months)
- 🟢 Long-Term: Version control, advanced features (3-6 months)

### Success Metrics
- **Goal**: All 13 breakpoints resolved OR documented as "intentionally deprecated"
- **Timeline**: Critical breakpoints (#1, #2, #8) resolved within 48 hours
- **User Impact**: Zero complaints about missing functionality OR clear workarounds provided
```

---

## 🎯 Phase 1: Immediate Testing (48 Hours)

### Section Template
```markdown
## 🚨 Phase 1: Immediate Testing (Next 48 Hours)

**Goal**: Verify core workflows function without deprecated features
**Source**: CTO Report Section 8.1 (Basic UI Testing)
**Priority**: CRITICAL - Must complete before any production use

### Test Cases

| # | User Action | Expected Result | Status | Notes |
|---|-------------|-----------------|--------|-------|
| 1 | Navigate to Workflows menu | Menu loads, shows workflow list | ⏳ Pending | |
| 2 | Click "Launch Canvas Designer" | Visual canvas opens | ⏳ Pending | Breakpoint #1, #2 |
| 3 | Add node via visual canvas | Node picker overlay appears (195 types) | ⏳ Pending | Breakpoint #1 |
| 4 | Select node type "OpenAI" | Node appears on canvas | ⏳ Pending | Breakpoint #1 |
| 5 | Drag connection between nodes | Connection line drawn | ⏳ Pending | Breakpoint #2 |
| 6 | Click "Save Design" | Canvas saved, no errors | ⏳ Pending | Breakpoint #8 |
| 7 | Refresh browser | Canvas reloads with saved nodes | ⏳ Pending | Breakpoint #8 |
| 8 | Check stat button | "Nodes: 1" displayed correctly | ⏳ Pending | Breakpoint #4 |
| 9 | Click "Execute Workflow" | Workflow executes (or shows execution UI) | ⏳ Pending | Breakpoint #12 |
| 10 | Look for "Create Nodes" button | Button NOT visible (commented out) | ⏳ Pending | Expected behavior |

**Status Legend**:
- ⏳ Pending (not yet tested)
- ✅ Pass (works as expected)
- ❌ Fail (breakpoint confirmed)
- ⚠️ Partial (works with workaround)
- 🔧 Fixed (breakpoint resolved)

### If CRITICAL Tests Fail

**Test #2, #3, #4 (Node Creation - Breakpoint #1):**
1. Check: Does visual canvas JavaScript load?
   ```bash
   # Browser console (F12) → Console tab
   # Look for errors: "Uncaught ReferenceError" or "404 Not Found"
   ```
2. Check: Does `node_metadata.json` exist and load?
   ```bash
   # File location
   ${REPO_AI_SAM_CORE}\data\node_metadata.json

   # Verify in browser Network tab (F12 → Network)
   # Should see request for node_metadata.json with 200 OK response
   ```
3. Check: Does node picker overlay appear?
   - If overlay appears BUT empty → node_metadata.json not loading
   - If overlay doesn't appear → JavaScript error in canvas code
4. **Action**: Create ticket for `/developer` to fix canvas JavaScript

**Test #5 (Connection Creation - Breakpoint #2):**
1. Check: Can user click on node output port?
2. Check: Can user drag line from output to input port?
3. Check: Browser console for connection validation errors
4. **Action**: Create ticket for `/developer` to fix drag-and-drop

**Test #6, #7 (Save/Load - Breakpoint #8):**
1. Check: Does `action_save_canvas_transition` exist in transitions?
2. Check: Does `action_open_canvas_transition` exist?
3. Check database: `SELECT json_definition FROM canvas WHERE id = X;`
   - Should contain valid JSON with `nodes` and `connections` arrays
4. Check Python logs for JSON parsing exceptions
5. **Action**: Create ticket for `/developer` to fix JSON save/load

### Phase 1 Completion Criteria
- [ ] All 10 tests executed
- [ ] Test results documented (✅/❌/⚠️)
- [ ] CRITICAL breakpoints (#1, #2, #8) status known:
  - [ ] Either: Working (✅)
  - [ ] Or: Tickets created for `/developer` (🎫)
- [ ] Decision: Proceed to Phase 2 OR halt for fixes
```

---

## 🔧 Phase 2: Short-Term Actions (2 Weeks)

### Section Template
```markdown
## 🔧 Phase 2: Short-Term Actions (Next 2 Weeks)

**Goal**: Verify core workflows and assess existing data migration needs
**Source**: CTO Report Section 12.2 (Short-Term Actions)
**Priority**: HIGH - Foundation for all future work

### Task 1: Verify Core Workflows End-to-End

**User Story**: Create simple 2-node workflow from scratch to completion

**Steps**:
1. [ ] Open Workflows menu
2. [ ] Create new canvas
3. [ ] Launch Canvas Designer
4. [ ] Add Node #1 (type: "Trigger - Manual")
5. [ ] Add Node #2 (type: "Code - JavaScript")
6. [ ] Connect Node #1 → Node #2
7. [ ] Configure Node #2 parameters (e.g., `console.log("Hello")`)
8. [ ] Save canvas
9. [ ] Close browser
10. [ ] Reopen canvas (verify persistence)
11. [ ] Execute workflow (verify execution)
12. [ ] Check execution results

**Success Criteria**:
- [ ] All steps complete without errors
- [ ] Workflow persists across browser refresh
- [ ] Workflow executes (even if it's a no-op)

**If Fails**:
- Document failure point (which step)
- Create ticket for `/developer` with reproduction steps
- Reference relevant breakpoint (#1, #2, #8, or #12)

---

### Task 2: Check for Existing Data (Migration Assessment)

**Critical Question**: Do we have existing canvases with data in deprecated tables?

**SQL Queries**:
```sql
-- Check for nodes in deprecated table
SELECT COUNT(*) as deprecated_nodes FROM nodes;

-- Check for connections in deprecated table
SELECT COUNT(*) as deprecated_connections FROM connections;

-- Check for node_types in deprecated table
SELECT COUNT(*) as deprecated_node_types FROM node_types;

-- Identify canvases needing migration
SELECT
    c.id,
    c.name,
    COUNT(n.id) as old_node_count,
    length(c.json_definition) as json_size
FROM canvas c
LEFT JOIN nodes n ON n.canvas_id = c.id
GROUP BY c.id, c.name
HAVING COUNT(n.id) > 0
ORDER BY old_node_count DESC;
```

**Decision Matrix**:

**If COUNT = 0** (no existing data):
- ✅ Clean slate, no migration needed
- Proceed to Phase 3 directly
- Document: "No existing data to migrate"

**If COUNT > 0** (existing data found):
- 🔴 **CRITICAL**: Migration required
- Count canvases: How many need migration?
- Identify largest canvas (stress test candidate)
- **Action**: Proceed to Task 3 (Migration Script)

---

### Task 3: Create & Test Migration Script (If Needed)

**Prerequisite**: Task 2 found existing data (COUNT > 0)

**Migration Script Location**: (to be created)
`${REPO_AI_SAM_CORE}\migration\migrate_canvas_flatline.py`

**Script Template** (from CTO Report Section 6.2.11):
```python
# Migration script skeleton provided in CTO report
# Developer implements full script based on skeleton
```

**Testing Procedure**:
1. [ ] **Backup database FIRST** (critical!)
2. [ ] Select 1 simple canvas (1-2 nodes) for test
3. [ ] Run migration script on single canvas
4. [ ] Verify JSON structure:
   ```sql
   SELECT json_definition FROM canvas WHERE id = X;
   ```
5. [ ] Load canvas in visual UI
6. [ ] Verify all nodes/connections present
7. [ ] Test workflow execution
8. [ ] If successful: Migrate 10 canvases (batch test)
9. [ ] If all 10 successful: Migrate remaining in batches

**Rollback Plan**:
- Database backup created in Step 1
- If migration fails: Restore from backup
- Debug on single canvas, fix script, retry

---

### Task 4: Basic Documentation

**Create**: `${DOCS_ROOT}\FLATLINE_ARCHITECTURE.md` (simplified from CTO report)

**Sections**:
1. What Changed (OLD vs NEW in simple terms)
2. Key User Workflow Changes (visual comparisons)
3. Where to Find Things (new locations vs old)
4. Common Issues & Solutions (FAQ)

**Share with**:
- Users (especially power users)
- Other developers
- Future team members

**Feedback Loop**:
- Collect user questions
- Update FAQ section
- Identify missing features users request

---

### Phase 2 Completion Criteria
- [ ] End-to-end workflow verified (Task 1)
- [ ] Existing data assessed (Task 2)
- [ ] Migration script created & tested (Task 3 - if needed)
- [ ] Basic documentation shared (Task 4)
- [ ] User feedback collected
- [ ] Decision: Proceed to Phase 3 OR iterate on fixes
```

---

## 🏗️ Phase 3: Medium-Term Actions (1-2 Months)

### Section Template
```markdown
## 🏗️ Phase 3: Medium-Term Actions (Next 1-2 Months)

**Goal**: Build missing features, implement migration, add concurrency protection
**Source**: CTO Report Section 12.3 (Medium-Term Actions)
**Priority**: MEDIUM - Enhancement phase

### Task 1: Build Missing Features (Based on User Feedback)

**Method**: Analyze user requests from Phase 2

**Decision Matrix** (from CTO Report):
```
IF user requests deprecated feature:
  IF feature is critical:
    → Implement in NEW architecture
  ELSE IF feature has workaround:
    → Document workaround, don't rebuild
  ELSE:
    → Feature genuinely deprecated, explain why
```

**Potential Features to Build**:

1. **Bulk Node Operations** (Breakpoint #5)
   - **User Need**: Power users want to edit multiple nodes at once
   - **Options**:
     - A) Excel import/export of JSON
     - B) API endpoint for bulk operations
     - C) Admin tool that edits `json_definition` directly
   - **Decision**: TBD based on user feedback
   - **Status**: ⏳ Pending user requests

2. **Workflow Categorization** (Breakpoint #7)
   - **User Need**: Filter workflows by type/category
   - **Options**:
     - A) Add `category` field to `canvas` model
     - B) Store category in `json_definition.metadata`
     - C) Use tags instead
   - **Decision**: TBD based on user feedback
   - **Status**: ⏳ Pending user requests

3. **N8N Node Type Management** (Breakpoint #6)
   - **User Need**: Add NEW N8N node types not in `node_metadata.json`
   - **Options**:
     - A) Manual JSON file editing (current)
     - B) Filesystem scanner (rebuild old system)
     - C) Admin UI for JSON editing
   - **Decision**: TBD based on frequency of need
   - **Status**: ⏳ Pending user requests

---

### Task 2: Implement Concurrency Protection (Breakpoint #10)

**Problem**: Last save wins → User A loses work when User B saves

**Solution Options** (from simple → complex):

**Option A: Basic Locking** (Recommended first)
```python
# Add to canvas model:
editing_user_id = fields.Many2one('res.users', 'Currently Editing')
edit_start_time = fields.Datetime('Edit Started')

# Before opening canvas:
if canvas.editing_user_id and canvas.editing_user_id != current_user:
    show_warning("User X is currently editing this canvas")
```

**Option B: Optimistic Locking**
```python
# Add to canvas model:
version = fields.Integer('Version', default=1)

# Before saving:
if canvas.version != loaded_version:
    raise UserError("Canvas modified by another user. Please refresh.")
canvas.version += 1
```

**Option C: Real-Time Collaboration** (long-term)
- WebSocket coordination
- Operational Transformation
- Users see each other's cursors

**Implementation Plan**:
1. [ ] Implement Option A (basic locking) first
2. [ ] Test with 2 users editing simultaneously
3. [ ] If issues persist: Implement Option B (versioning)
4. [ ] Consider Option C for future (3-6 months)

---

### Task 3: Performance Optimization

**Monitoring**:
```sql
-- Check JSON field sizes
SELECT
    id,
    name,
    length(json_definition) as size_bytes,
    length(json_definition) / 1024 as size_kb
FROM canvas
ORDER BY length(json_definition) DESC
LIMIT 10;

-- Average canvas size
SELECT
    AVG(length(json_definition)) as avg_size_bytes,
    MAX(length(json_definition)) as max_size_bytes
FROM canvas
WHERE json_definition IS NOT NULL;
```

**If large canvases found** (>1MB):
- Add GIN index: `CREATE INDEX idx_canvas_json ON canvas USING GIN (json_definition);`
- Consider workflow splitting for massive canvases
- Profile canvas load times

---

### Phase 3 Completion Criteria
- [ ] User-requested features prioritized (decision matrix applied)
- [ ] Missing features implemented OR workarounds documented
- [ ] Concurrency protection implemented (at minimum: Option A)
- [ ] Performance monitored, optimizations applied if needed
- [ ] User satisfaction high (minimal complaints)
```

---

## 🚀 Phase 4: Long-Term Considerations (3-6 Months)

### Section Template
```markdown
## 🚀 Phase 4: Long-Term Considerations (Next 3-6 Months)

**Goal**: Advanced features, version control, N8N evolution
**Source**: CTO Report Section 12.4 (Long-Term Considerations)
**Priority**: LOW - Enhancement phase

### (Reference CTO Report for details)

**Topics to Address**:
1. Version Control System (canvas history)
2. Advanced Features (enhanced search, filters)
3. Real-Time Collaboration (if needed)
4. N8N Integration Evolution (community contributions)
5. Documentation Consolidation (video tutorials)
```

---

## 📊 Breakpoint Resolution Tracker

### Section Template
```markdown
## 📊 Breakpoint Resolution Tracker

**Purpose**: Track status of all 13 identified breakpoints
**Source**: CTO Report Section 6 (Breakpoint Analysis)

### CRITICAL Breakpoints (P0) - Must Fix Immediately

| # | Breakpoint | Severity | Status | Resolution Notes | Date |
|---|-----------|----------|--------|------------------|------|
| 1 | Node Creation | 🔴 CRITICAL | ⏳ Testing | Phase 1 Test #3-4 | |
| 2 | Connection Creation | 🔴 CRITICAL | ⏳ Testing | Phase 1 Test #5 | |
| 8 | JSON Parsing Failures | 🔴 CRITICAL | ⏳ Testing | Phase 1 Test #6-7 | |

### HIGH Priority Breakpoints (P1)

| # | Breakpoint | Severity | Status | Resolution Notes | Date |
|---|-----------|----------|--------|------------------|------|
| 10 | Concurrent Edits | 🔴 CRITICAL | ⏳ Pending | Phase 3 Task 2 | |
| 11 | Migration from OLD | 🔴 CRITICAL | ⏳ Pending | Phase 2 Task 2-3 | |
| 12 | Execution Engine | 🟠 HIGH | ⏳ Testing | Phase 1 Test #9 | |

### MEDIUM Priority Breakpoints (P2)

| # | Breakpoint | Severity | Status | Resolution Notes | Date |
|---|-----------|----------|--------|------------------|------|
| 6 | N8N Integration | 🟠 HIGH | ⏳ Pending | Phase 3 Task 1 | |
| 5 | Node CRUD Operations | 🟠 HIGH | ⏳ Pending | Phase 3 Task 1 | |
| 9 | Node Type Integrity | 🟠 HIGH | ⏳ Pending | Monitor in Phase 2 | |
| 7 | Workflow Categorization | 🟠 HIGH | ⏳ Pending | Phase 3 Task 1 | |

### LOW Priority Breakpoints (P3)

| # | Breakpoint | Severity | Status | Resolution Notes | Date |
|---|-----------|----------|--------|------------------|------|
| 3 | Load Saved Design | 🟡 MEDIUM | ⏳ Testing | Phase 1 Test #7 | |
| 13 | Import/Export | 🟡 MEDIUM | ⏳ Pending | Phase 2 testing | |
| 4 | Node Count Display | 🟢 LOW | ⏳ Testing | Phase 1 Test #8 | |

**Status Legend**:
- ⏳ Pending (not yet addressed)
- 🔬 Testing (under investigation)
- 🔧 In Progress (fix being implemented)
- ✅ Resolved (working as expected)
- ⚠️ Workaround (not fixed but alternative provided)
- 📝 Documented (intentionally deprecated, documented why)
```

---

## 📝 Decision Log

### Section Template
```markdown
## 📝 Decision Log

**Purpose**: Track decisions about deprecated features and workarounds
**Use**: When user requests feature, consult decision matrix, document here

### Entry Template
```markdown
### [DATE] - [Feature Request]: [Feature Name]

**Requested By**: [User/Team]
**Original Feature**: [Describe OLD functionality]
**Reason Deprecated**: [Why removed in flatline]
**User Need**: [Why they want it]
**Options Considered**:
1. [Option A description]
2. [Option B description]
3. [Option C description]

**Decision**: [Chosen option]
**Reasoning**: [Why this option]
**Implementation**: [Ticket/Timeline/Details]
**Communicated to User**: [Date/Method]
```

### Example Entries

#### [2025-11-01] - Feature Request: "Create Nodes" Button

**Requested By**: Power User (Hypothetical)
**Original Feature**: Button in canvas UI that opened Odoo form for creating individual node
**Reason Deprecated**: Nodes created in-memory via visual canvas now (flatline architecture)
**User Need**: "I can't find how to add nodes anymore"
**Options Considered**:
1. Restore button → Open visual canvas automatically
2. Add tutorial/help text explaining new workflow
3. Do nothing (visual canvas is obvious)

**Decision**: Option 2 - Add help text
**Reasoning**: Visual canvas is intuitive, just needs signposting for existing users
**Implementation**: Added tooltip: "Click canvas to add nodes" + Quick Start guide
**Communicated to User**: 2025-11-02 via email + documentation update

---

#### [DATE] - Feature Request: [Another Example]

[Template continues...]
```

---

## 🎯 Success Metrics & KPIs

### Section Template
```markdown
## 🎯 Success Metrics & KPIs

**Track progress toward migration completion**

### Breakpoint Resolution Rate
- **Total Breakpoints**: 13
- **Resolved**: X (Y%)
- **In Progress**: X (Y%)
- **Pending**: X (Y%)

**Target**: 100% resolved OR documented within 2 months

---

### User Satisfaction
- **Complaints about missing features**: X
- **Feature requests for deprecated functionality**: X
- **Positive feedback**: X

**Target**: <5 complaints, <3 feature requests for deprecated features

---

### System Stability
- **Canvas load failures**: X (per 100 loads)
- **Save failures**: X (per 100 saves)
- **Execution failures**: X (per 100 runs)

**Target**: <1% failure rate across all operations

---

### Performance
- **Average canvas load time**: X seconds
- **Average save time**: X seconds
- **Average JSON size**: X KB

**Target**: Load <2 seconds, Save <1 second, Size <50KB average

---

### Testing Coverage
- **Phase 1 tests complete**: X/10 (Y%)
- **Phase 2 tasks complete**: X/4 (Y%)
- **Phase 3 tasks complete**: X/3 (Y%)

**Target**: 100% of Phase 1, 80% of Phase 2 within first month
```

---

## 📞 Support & Escalation

### Section Template
```markdown
## 📞 Support & Escalation

### Who to Assign (Agent Routing)

**For CRITICAL breakpoints** (#1, #2, #8, #10, #11):
- Assign to: `/developer` (elite Odoo 18 implementer)
- Review by: `/cto` (architecture strategy) + `/debug` (if errors)

**For testing & validation**:
- Assign to: `/qa-guardian` (pre-commit quality gate)
- Test by: `/test` command (automated testing)

**For architecture questions**:
- Assign to: `/odoo-architect` (technical planning)
- Consult: CTO Report (comprehensive analysis)

**For documentation**:
- Assign to: `/docs` (documentation master)
- Update: workflow_bible.html + FLATLINE_ARCHITECTURE.md

---

### Escalation Path

**Level 1**: Single breakpoint isolated
- Action: Create ticket for `/developer`
- Timeline: 1-2 days

**Level 2**: Multiple related breakpoints
- Action: Consult `/odoo-architect` for planning
- Then: Batch tickets for `/developer`
- Timeline: 3-5 days

**Level 3**: Fundamental architecture issue
- Action: Consult `/cto` for strategic decision
- Consider: Hybrid architecture OR forward-only fixes
- Timeline: 1-2 weeks (requires planning)

**Level 4**: Rollback consideration
- Action: Consult CTO Report Section 9.2 (Rollback Strategy)
- Options: Hybrid, Full Rollback, or Forward-Only
- Timeline: 2-4 weeks (major decision)
```

---

## ✅ Phase Completion Checklist

### Overall Template
```markdown
## ✅ Phase Completion Checklist

### Phase 1: Immediate Testing ✅/⏳
- [ ] All 10 test cases executed
- [ ] Results documented in tracker
- [ ] CRITICAL breakpoints status known
- [ ] Go/No-Go decision made for Phase 2

### Phase 2: Short-Term ⏳
- [ ] End-to-end workflow verified
- [ ] Existing data assessed
- [ ] Migration script created (if needed)
- [ ] Basic documentation shared
- [ ] User feedback collected

### Phase 3: Medium-Term ⏳
- [ ] User-requested features prioritized
- [ ] Missing features implemented OR workarounds documented
- [ ] Concurrency protection implemented
- [ ] Performance optimized

### Phase 4: Long-Term ⏳
- [ ] Version control implemented (if needed)
- [ ] Advanced features added (based on demand)
- [ ] Documentation consolidated
- [ ] User training materials created

---

**Final Sign-Off**: Flatline Migration Complete ✅
- Date: [DATE]
- Approved By: [NAME/ROLE]
- All breakpoints: Resolved OR Documented
- User satisfaction: High
- System stability: Excellent
```

---

## 📚 References

### Always Include
```markdown
## 📚 References

**Primary Documents**:
1. [workflow_bible.html](file://${REPO_SAM_INTRO}/workflow_bible.html) - Visual survival guide
2. [FLATLINE_ARCHITECTURE_REPORT.md](file://${REPO_SAM_INTRO}/FLATLINE_ARCHITECTURE_REPORT.md) - CTO's complete technical analysis (1,527 lines)

**Agent Commands**:
- `/developer` - For implementing fixes
- `/cto` - For architecture strategy
- `/debug` - For error investigation
- `/odoo-architect` - For technical planning
- `/qa-guardian` - For quality validation
- `/docs` - For documentation updates

**SQL Reference**: CTO Report Appendix A (Quick Reference Commands)
**Python Reference**: CTO Report Appendix A.2 (Debugging)
**File Locations**: CTO Report Appendix A.3 (Quick Reference)
```

---

**This template provides structure for production handover after Bible creation.** 🎯
