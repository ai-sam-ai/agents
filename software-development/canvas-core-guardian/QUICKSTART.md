# Canvas Core Guardian - Quick Start Guide

## 🚀 Ready to Test Your New Agent!

This guide helps you validate the Canvas Core Guardian agent is working correctly.

---

## Pre-Flight Checklist

Before testing, verify:

- [x] Agent files created in `${CLAUDE_AGENTS_DIR}\canvas-core-guardian\`
- [x] All 6 files present:
  - `agent.json`
  - `canvas_core_rules.md`
  - `forbidden_patterns.md`
  - `naming_standards.md`
  - `agent_protocol.md`
  - `README.md`
- [ ] Agent registered in Claude Code (may require restart)
- [ ] Can invoke custom agents via Task tool or slash command

---

## Test 1: Basic Invocation ⚡

**Goal:** Verify agent loads and responds

**Prompt:**
```
Run the canvas-core-guardian agent to introduce itself and explain what it does.
```

**Expected Response:**
- Agent identifies as Canvas Core Guardian
- Explains its mission (boundary enforcement, skeleton cleanup)
- Mentions the "ONE Core, MANY Skins" pattern
- Asks what you want it to check

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 2: Skeleton Detection 🔍

**Goal:** Verify agent can detect legacy naming

**Setup:**
```bash
# Navigate to your ai_sam module
cd "C:\Working With AI\ai_sam\ai_sam"
```

**Prompt:**
```
Use canvas-core-guardian to scan the ai_sam/static/src/core/ directory for any "skeleton" references. Report what you find.
```

**Expected Response:**
- Uses `grep -ri "skeleton"` command
- Lists files with "skeleton" in name or content
- Categorizes findings (files, classes, variables, routes)
- Provides count of violations

**Expected Findings (based on earlier audit):**
- `skeleton_canvas_engine.js`
- `skeleton_node_manager.js`
- `skeleton_canvas_controller.py`
- Others (at least 30+ files)

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 3: Platform Name Detection 🔍

**Goal:** Verify agent can detect platform bleeding

**Prompt:**
```
Use canvas-core-guardian to check if there are any platform-specific names (n8n, workflow, memory, knowledge, poppy) in the canvas_core directory. What do you find?
```

**Expected Response:**
- Uses `grep -rE "n8n|workflow|memory|knowledge|poppy"` command
- Reports any platform names found in core files
- Explains why each is a violation
- Suggests where code should move

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 4: Cross-Platform Import Detection 🔍

**Goal:** Verify agent can detect boundary violations

**Prompt:**
```
Use canvas-core-guardian to check if ai_sam_memory module imports anything from the_ai_automator module. This would be a cross-platform import violation.
```

**Expected Response:**
- Uses `grep -r "from the_ai_automator"` in ai_sam_memory directory
- Reports any imports found (or confirms none)
- Explains why cross-platform imports are forbidden
- Suggests refactoring through ai_brain if needed

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 5: Todo List Management ✅

**Goal:** Verify agent uses TodoWrite properly

**Prompt:**
```
Use canvas-core-guardian to create a todo list for cleaning up all skeleton references in the ai_sam/static/src/core/ directory. Don't execute the cleanup yet, just plan it.
```

**Expected Response:**
- Creates TodoWrite with tasks:
  - Scan for skeleton references
  - Categorize by risk
  - Plan rename strategy
  - Etc.
- Shows todo list clearly
- Marks first task as "in_progress"

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 6: Risk Assessment 🎯

**Goal:** Verify agent categorizes changes by risk

**Prompt:**
```
Use canvas-core-guardian to analyze the risk of renaming skeleton_canvas_engine.js to canvas_engine.js. What files would be affected? What's the risk level?
```

**Expected Response:**
- Searches for imports of `skeleton_canvas_engine`
- Lists all files that import it
- Categorizes risk:
  - 🟢 Low: Comments/docstrings only
  - 🟡 Medium: File rename + import updates
  - 🔴 High: Structural changes needed
- Provides step-by-step fix plan

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 7: Naming Guidance 📝

**Goal:** Verify agent knows naming standards

**Prompt:**
```
I'm creating a new file called "skeleton_utils.js" in the canvas core. Use canvas-core-guardian to tell me if this name is correct, and if not, what it should be.
```

**Expected Response:**
- ❌ Flags "skeleton" as legacy naming
- ✅ Suggests "canvas_utils.js" instead
- Explains why (consistency with V3 architecture)
- References naming_standards.md rules

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 8: Component Duplication Detection 🔎

**Goal:** Verify agent can detect copy-pasted code

**Prompt:**
```
Use canvas-core-guardian to check if there are multiple sidebar files in the ai_sam project that might be duplicating code. What do you find?
```

**Expected Response:**
- Uses `find` command to locate sidebar files
- Lists files like:
  - `poppy_sidebar.js`
  - `memory_sidebar.js`
  - Others
- Suggests comparing them for duplication
- Recommends extracting to shared base class

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 9: Boundary Explanation 📚

**Goal:** Verify agent can explain boundaries clearly

**Prompt:**
```
Use canvas-core-guardian to explain: Can I put workflow execution logic in canvas_engine.js? Why or why not?
```

**Expected Response:**
- ❌ NO - workflow execution is business logic
- Explains: Canvas core = generic rendering only
- Business logic belongs in the_ai_automator platform
- References canvas_core_rules.md
- Provides alternative approach (platform renderer)

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 10: Before/After Examples 🔄

**Goal:** Verify agent provides clear refactoring guidance

**Prompt:**
```
Use canvas-core-guardian to show me a before/after example of fixing platform-specific logic in canvas core. Pick any violation from forbidden_patterns.md.
```

**Expected Response:**
- Shows ❌ BAD code example
- Shows ✅ GOOD code example
- Explains what changed and why
- Provides detection command (grep)
- Provides fix steps

**Status:** ⬜ Pass / ⬜ Fail

---

## Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| 1. Basic Invocation | ⬜ | |
| 2. Skeleton Detection | ⬜ | |
| 3. Platform Name Detection | ⬜ | |
| 4. Cross-Platform Imports | ⬜ | |
| 5. Todo List Management | ⬜ | |
| 6. Risk Assessment | ⬜ | |
| 7. Naming Guidance | ⬜ | |
| 8. Duplication Detection | ⬜ | |
| 9. Boundary Explanation | ⬜ | |
| 10. Before/After Examples | ⬜ | |

**Overall:** ⬜ Pass / ⬜ Fail / ⬜ Needs Adjustment

---

## Troubleshooting

### Agent Not Found

**Symptom:** "canvas-core-guardian agent not found"

**Fix:**
1. Verify agent files exist in correct location
2. Check `agent.json` is valid JSON
3. Restart Claude Code
4. Try invoking via Task tool explicitly

### Agent Doesn't Load Knowledge Files

**Symptom:** Agent responds but doesn't reference canvas_core_rules.md

**Fix:**
1. Check `promptFiles` array in agent.json
2. Verify .md files are in same directory
3. Check file permissions (should be readable)

### Agent Gives Generic Responses

**Symptom:** Agent doesn't use specific grep commands or rules

**Fix:**
1. Review agent_protocol.md - agent should follow workflow
2. Check if agent is using correct model (sonnet)
3. Verify knowledge files loaded properly

---

## Next Steps After Testing

### ✅ If All Tests Pass

1. **Mark agent as production-ready**
2. **Run Phase 1 Audit** (use agent to document current violations)
3. **Create cleanup sprints** (follow phased plan in README.md)
4. **Integrate into workflow** (use for all canvas/platform work)

### ⚠️ If Some Tests Fail

1. **Document which tests failed**
2. **Review agent knowledge files** for gaps
3. **Adjust prompts/rules** as needed
4. **Re-test failed scenarios**

### ❌ If Most Tests Fail

1. **Check agent registration** (is it loading at all?)
2. **Verify Claude Code version** (supports custom agents?)
3. **Review agent.json format** (matches expected schema?)
4. **Contact architect agent** for redesign

---

## Real-World Usage Examples

After testing, try these real scenarios:

### Scenario A: Code Review
```
I'm reviewing a pull request that modified canvas_engine.js.
Use canvas-core-guardian to check if any boundary violations were introduced.
```

### Scenario B: Refactoring Sprint
```
I want to spend this session cleaning up all skeleton references in the ai_sam module.
Use canvas-core-guardian to create a prioritized cleanup plan.
```

### Scenario C: New Feature Guidance
```
I'm adding a shared toolbar component.
Use canvas-core-guardian to validate my approach and suggest where it should live.
```

### Scenario D: Import Debugging
```
My imports are broken after renaming files.
Use canvas-core-guardian to find and fix all import statements.
```

---

## Success Criteria

Agent is working correctly when:

✅ Detects violations using grep/find commands
✅ Creates and manages TodoWrite lists
✅ Provides clear before/after examples
✅ Categorizes changes by risk
✅ References knowledge files (canvas_core_rules.md, etc.)
✅ Explains WHY violations are problems (not just WHAT)
✅ Suggests concrete fixes with steps
✅ Validates changes after making them

---

## Feedback

After testing, note:

**What worked well:**
- [Your notes here]

**What needs improvement:**
- [Your notes here]

**Suggested changes:**
- [Your notes here]

**Share feedback with architect agent for iteration.**

---

## Quick Reference

**Agent Location:**
```
${CLAUDE_AGENTS_DIR}\canvas-core-guardian\
```

**Invoke via:**
```
Run canvas-core-guardian to [task]
Use canvas-core-guardian for [scenario]
```

**Key Commands Agent Uses:**
```bash
# Detection
grep -ri "skeleton" ai_sam/
grep -rE "n8n|workflow|memory" ai_sam/static/src/canvas_core/
find ai_sam/ -iname "*skeleton*"

# Validation
grep -r "from the_ai_automator" ai_sam_memory/
```

**Expected Tools Used:**
- Read (analyze files)
- Grep (search patterns)
- Glob (find files)
- Bash (run commands)
- Edit (fix violations)
- Write (create new files)
- TodoWrite (track progress)

---

## Ready?

🎯 **Start with Test 1** and work through systematically.

Good luck! 🚀
