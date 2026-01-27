# Commit Message Template

## Established Format (From Chat History)

### Structure
```
🎯 [CONCISE SUMMARY - What was accomplished]

📊 Changes Made:
- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

[OPTIONAL SECTIONS - Include only if applicable:]

🎨 UI/UX Updates:
- [Frontend/interface changes]
- [Visual improvements]

🗃️ Data Models:
- [Model additions/modifications]
- [Field changes]
- [Database schema updates]

📚 Documentation:
- [Documentation updates]
- [README changes]
- [Comment improvements]

🔧 Technical Improvements:
- [Performance optimizations]
- [Code refactoring]
- [Bug fixes]
- [Security enhancements]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Real Examples from Chat History

### Example 1: Feature Implementation
```
🎯 Implement Canvas Skeleton Core Architecture

📊 Changes Made:
- Created universal canvas sizing system (canvas_sizer.js)
- Built skeleton rendering engine (skeleton_canvas_engine.js)
- Implemented platform loader for dynamic renderers
- Added three platform skins (Poppy, Memory, Automator)

🎨 UI/UX Updates:
- Full-screen canvas with responsive sizing
- Grid system with 20px cells
- Visual connection lines between nodes

🗃️ Data Models:
- New canvas.platform model for renderer registry
- Extended canvas.node with platform-specific fields

📚 Documentation:
- Added CANVAS_SKELETON_CORE_ARCHITECTURE.md
- Updated README with platform creation guide

🔧 Technical Improvements:
- ONE core, MANY skins architecture
- No platform-specific code in skeleton core
- Dynamic renderer injection via registry

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Example 2: Bug Fix
```
🎯 Fix SQL Injection Vulnerabilities

📊 Changes Made:
- Replaced string formatting in all cr.execute() calls
- Added parameterized queries throughout ai_brain
- Updated 12 model files with proper escaping

🔧 Technical Improvements:
- Eliminated SQL injection attack vectors
- Improved database query security
- Added validation for user inputs

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Example 3: Refactoring
```
🎯 Optimize Context Builder Performance

📊 Changes Made:
- Replaced browse() loops with batch read() calls
- Reduced database queries from 50 to 3 per request
- Implemented prefetch for related fields

🔧 Technical Improvements:
- 85% performance improvement in context building
- Eliminated N+1 query patterns
- Better use of Odoo ORM capabilities

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Key Principles

### 1. Emoji Usage
- 🎯 **Main summary** (ALWAYS)
- 📊 **Changes Made** (ALWAYS)
- 🎨 **UI/UX** (when frontend changed)
- 🗃️ **Data Models** (when models/database changed)
- 📚 **Documentation** (when docs updated)
- 🔧 **Technical Improvements** (ALWAYS - optimization, refactoring, fixes)
- 🤖 **Claude Code footer** (ALWAYS)

### 2. Writing Style
- **Concise but complete** - Detail without verbosity
- **Action-oriented** - Use verbs (Implemented, Fixed, Optimized)
- **Specific** - Reference file names, functions, counts
- **Organized** - Logical grouping of related changes

### 3. What to Include
- File counts if significant (e.g., "Updated 12 model files")
- Metrics if relevant (e.g., "85% performance improvement")
- New features/components added
- Bugs fixed with impact
- Refactoring rationale

### 4. What to Exclude
- Unnecessary details (e.g., "Changed line 42 from X to Y")
- Overly technical implementation details
- Obvious changes (e.g., "Added semicolon")
- Personal commentary (keep professional)

### 5. Section Rules
- **Always include:** 🎯, 📊, 🔧, 🤖
- **Include if applicable:** 🎨, 🗃️, 📚
- **Never include empty sections** - Omit if no content

## Message Length
- **Ideal:** 8-15 lines (excluding footer)
- **Minimum:** 5 lines (very small changes)
- **Maximum:** 25 lines (major features)

## Heredoc Format (Required)
Always pass via heredoc to preserve formatting:
```bash
git commit -m "$(cat <<'EOF'
🎯 [Summary here]

📊 Changes Made:
- Point 1
- Point 2

🔧 Technical Improvements:
- Improvement 1

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

## How Agent Should Generate

1. **Analyze staged changes** with `git diff --staged`
2. **Read recent commits** with `git log -3 --oneline` (match style)
3. **Categorize changes** by type (models, views, JS, docs, etc.)
4. **Count significant items** (files changed, features added)
5. **Draft message** following template
6. **Present to user** for approval before committing
