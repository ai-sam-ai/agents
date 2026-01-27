# Chief of Staff Session Memory

**Last Updated:** 2025-12-14 (Agent Foundation + BASE/EXPERIENCE pattern - 4 new agents)
**Total Agents Created:** 26 (22 operational + 4 NEW: sam_workflow, sam_workflow_base, sam_chat, sam_chat_base)
**Total Sessions:** 10

---

## 🔴 CRITICAL UPDATE (2025-10-13): STARTUP PROTOCOL IMPLEMENTED

**Pain Point Identified:** Agents operating on stale knowledge causing "sideways and backwards" work
- Repeat questions already answered in 23.2M tokens of history
- Functions built in "old noisy environment"
- References to paths that don't exist (ai_sam_odoo)
- Agent counts misaligned (said 10-11, actually 12)

**Solution Deployed:** AGENT_STARTUP_PROTOCOL.md
- **Step 1:** Read `current_state.md` BEFORE any agent action
- **Step 2:** Search session history (`${CLAUDE_FILE_HISTORY}\`) FIRST before asking questions
- **Step 3:** Verify no conflicts with current truth

**Rollout Status:** ✅ 11/11 slash commands updated
1. ✅ /sam (highest pain point - user-facing)
2. ✅ /developer (builds code)
3. ✅ /odoo-architect (planning)
4. ✅ /session-start (context loading)
5. ✅ /debug (debugging)
6. ✅ /docs (truth keeper)
7. ✅ /cto (infrastructure)
8. ✅ /cmo (marketing)
9. ✅ /check-core (enforcement)
10. ✅ /github (git workflows)
11. ✅ /cos (THIS AGENT - ecosystem management)

**Expected Impact:**
- Zero repeat questions from history
- Functions work in current environment (not old)
- Agents reference correct paths
- Complete alignment with single source of truth

---

## Project Context (THE CORRECTED TRUTH)

### SAM AI V3 Architecture
- **Three-layer:** ai_brain → ai_sam → branches
- **Canvas Skeleton:** ONE core, MANY skins
- **Platform:** Odoo 18
- **Database:** PostgreSQL
- **Location:** `C:\Working With AI\ai_sam\ai_sam\` ← CORRECTED (NOT ai_sam_odoo!)
- **Single Source of Truth:** `C:\Working With AI\ai_sam\ai_sam\ai_sam_docs\docs\current_state.md`

### Key Principles
- No platform bleeding into canvas core
- Security rules required for all custom models
- QA validation before commit (mandatory)
- Files in correct locations ("no rogue files")
- Use `<list>` not `<tree>` (Odoo 18)
- Version format: 18.0.x.y

---

## Current Agent Roster (16 Active - UPDATED 2025-10-24)

**BOARDROOM (Strategic Advisors - 5):**
1. **odoo-architect** - `/odoo-architect` - Odoo Technical Planning
2. **cmo** - `/cmo` - Marketing/Sales Strategy
3. **cto** - `/cto` - Infrastructure Strategy
4. **chief-of-staff** - `/cos` - Team Builder (THIS AGENT)
5. **sam** - `/sam` - Conversation Intelligence

**OPERATORS (Execution Specialists - 8):**
6. **odoo-session-onboarder** - `/session-start` - Context loading
7. **odoo-developer** - `/developer` - Elite implementation
8. **odoo-audit** - Task tool - Quality scoring
9. **odoo-debugger** - `/debug` - Debug expert
10. **odoo-qa-guardian** - `/qa-guardian` - Pre-commit quality gate
11. **canvas-core-guardian** - `/check-core` - Boundary enforcement
12. **documentation-master** - `/docs` - Ecosystem truth keeper
13. **github** - `/github` - Git workflow consultant
14. **sam-sales-support** - `/sam_sales_support` - SAM landing page creator (NEW!)

**NICHE MODULE SPECIALISTS (3):**
15. **mod-intelligence** - `/mod_intelligence` - ai_sam_intelligence module specialist
16. **mod-scrapper** - `/mod_scrapper` - ai_sam_lead_generator module specialist
17. **mod-sam** - `/mod_sam` - General SAM module specialist

**AI ORCHESTRATION SPECIALIST (1):**
18. **sam-message-orchestrator** - `/orchestrator` - Backend AI communication specialist (NEW!)

**NOTE:** Actual folder count: 18 directories (includes AGENT_STARTUP_PROTOCOL.md, etc.)

---

## Recent Agent Creation History

### 2025-10-09: canvas-core-guardian
**Pain Point:** Platform code bleeding into canvas core, legacy "skeleton" naming
**Archetype:** Enforcer
**Knowledge Sources:** Architecture review, forbidden patterns catalog
**Outcome:** Successfully enforcing boundaries, cleaning up violations
**User Feedback:** "Super awesome" - loves the architectural protection

### 2025-10-10: chief-of-staff (META - formerly recruiter)
**Pain Point:** Need to create more agents as needs emerge
**Archetype:** Meta-agent (builds other agents + manages boardroom)
**Knowledge Sources:** Reverse-engineered from session creating previous 6 agents
**Outcome:** Self-aware agent creation system, renamed to Chief of Staff
**User Feedback:** Requested two modes (fresh/default), prefers boardroom structure

### 2025-10-10: cmo (Chief Marketing Officer)
**Pain Point:** Pre-launch marketing strategy needed (2 weeks to launch)
**Archetype:** Advisor (like Architect, but for marketing/sales)
**Knowledge Sources:** Dan Kennedy direct response, modern funnel strategies, positioning methodology
**Outcome:** Strategic marketing advisor ready for pre-launch planning
**User Feedback:** "You're right, I need the board now" - CEO validated boardroom approach
**Integration:** First boardroom member built by Chief of Staff, complements Odoo Architect (technical planning)

### 2025-10-10: architect → odoo-architect (RENAME)
**Reason:** Needed Odoo-specific branding for technical planning role
**Scope:** SAM AI + all future Odoo modules (not just generic architecture)
**Differentiation:** Sets stage for future CTO (infrastructure strategy) vs Odoo Architect (feature planning)
**User Feedback:** Wanted Odoo-specific but scalable across multiple Odoo products

### 2025-10-11: cto (Chief Technical Officer)
**Pain Point:** Pre-launch infrastructure strategy needed (2 weeks to launch), performance optimization required
**Archetype:** Advisor (Boardroom member - strategic, not implementer)
**Knowledge Sources:** Session history analysis (23.2M tokens consumed, 10 refinement opportunities identified), infrastructure best practices, Odoo deployment patterns
**Outcome:** Strategic infrastructure advisor with 5 knowledge files (infrastructure strategy, performance playbook, scaling roadmap, cost management, CTO protocol)
**Key Insights Extracted:**
- Current API cost: ~$126 (23.2M tokens consumed to date)
- Highest ROI optimizations: Redis caching (refinement #5) = 50-70% cost savings, Context builder optimization (refinement #6) = 3-5x faster
- Scaling phases defined: 0-100 users ($18/mo), 100-1K ($430/mo), 1K-10K ($2,432/mo), 10K+ ($10K-20K/mo)
- Unit economics: Cost per user decreases with scale (economies of scale validated)
**Integration:**
- CTO + CMO: CMO sets growth targets → CTO assesses infrastructure readiness/costs
- CTO + Odoo Architect: Architect designs features → CTO evaluates infrastructure implications
- CTO + Developer: CTO recommends optimizations → Developer implements (e.g., refinement #5 caching)
**User Feedback:** "Path A please" (build CTO v1 immediately, then move to values/vision discussion agent)

### 2025-10-12: sam (SAM AI - Conversation Intelligence)
**Pain Point:** Need to support users (Dennis, Christy, random users) WITHOUT pulling Anthony into conversations. ChatGPT forgets everything, lacks personality, can't delegate to specialists.
**Archetype:** Hybrid (Advisor + Router + Evangelist) - Unique boardroom position
**Knowledge Sources:** User insights (Dennis = analytical/data-driven, Christy = empathetic/non-tech, Anthony = technical/strategic), session history (23.2M tokens, full evolution of SAM AI product), specialist routing patterns, graph memory requirements
**Outcome:** Context-aware conversation intelligence with 6 knowledge files + slash command
**CRITICAL Enhancement (same session):** Added session_history_research_protocol.md to prevent "dumb repeat questions" - SAM must search 23.2M tokens of session history FIRST before asking questions. MD files are controller blueprints for upcoming Python implementation.
**Key Insights Extracted:**
- **Personality Framework:** 4 core traits (caring, supportive, intuitive, capable) + 6 mode shifts (Generalist, CMO, DRC, CTO, Empathy, Celebration)
- **Voice Modulation:** Visual announcements when shifting modes ("🎯 Putting on my CMO hat")
- **Conversation Engine:** 6-phase workflow (Context Loading [search history FIRST] → Greeting → Listen → Detect → Adapt → Respond → Remember)
- **Graph Memory Protocol:** 7 node types (user profile, challenge, conversation, personal context, business context, preference, win)
- **Proactive Engagement:** Query graph for follow-ups (road trips, challenge progress, win anniversaries)
- **Specialist Routing:** Delegation decision tree with full context handoff to CMO/CTO/Architect/Developer/Guardian
- **SAM AI Evangelism:** Show difference from ChatGPT ("I remember your journey, not just your question")
- **Session History Integration:** References ${CLAUDE_PROJECTS_DIR}\ (23.2M tokens) as critical knowledge source
**Integration:**
- SAM = Quarterback: Routes users to specialists (CMO, CTO, Odoo Architect, Developer, Canvas Guardian)
- SAM + Graph Memory: Persistent context across days/weeks (never forgets)
- SAM + CMO: Detects marketing questions → delegates or shifts to CMO mode
- SAM + CTO: Detects technical questions → delegates or shifts to CTO mode
- SAM + Dennis: Analytical tone, data-driven, shows ROI
- SAM + Christy: Empathetic tone, analogies, simplified concepts
- SAM + Anthony: Technical depth, strategic thinking, architecture references
**User Feedback:**
- User initially asked for CTO, then pivoted: "this isn't just deflecting dennis, it's SUPPORTING Dennis... AND other clients"
- Evolved vision: "sam is still the generalist in that environment, yet, like mentioned, context based inquisitive, drilling into more specific niche 'prompted' skillsets"
- Personality requirement: "we need sam to have a personality.. a tone, caring, supportive, intuitive, very capable"
- Voice modulation: "i'd like to see sam 'say' putting on the 'agent' skills cap, something i can come to see we are shifting"
- Action visibility: "Keep going, i just like seeing action, i know then things are working 'for me' as a human"
- Next goal: "my next tech goal will be build a ui form i can start to genuinely chat with sam online and save to graph db"
- **CRITICAL CORRECTION:** "really, before responding to me, these questions are already answered in our chat session history, moving fwd i anticipate there should be no questions based on 'searched history 1st' before responding/replying"
- **MD Files = Controller Blueprints:** "my thoughts are we will build 'controllers as agents' and these md files will be our baseline to do that, so i feel the md file backbone in /sam agent needs to be enhanced to research history sessions to clarify possible known knowledge before asking dumb repeat questions.. the value of this improvement is, our md files are our guide for 1st draft controllers coming very soon"
**User Personas Documented:**
- **Dennis (business partner):** Analytical, data-driven, asks "where's the value?", needs ROI proof, runs manufacturing sales consultancy, webinar strategy focus
- **Christy (life partner, life coach):** Empathetic, non-tech, psychological lens, needs simplified explanations, concerned about user onboarding, just returned from 4-day road trip
- **Anthony (CEO, creator):** "Freight train creator" building SAM AI product, technical/strategic thinker, needs protection from interruptions, wants SAM to be his systematized voice
**Product Vision Captured:**
- SAM AI = Context-aware AI business partner
- Value prop: "I remember EVERYTHING" (vs ChatGPT/Claude which forget)
- Conversion path: Landing page → $27-47/month membership
- Pre-signup tracking: Pixel/IP to remember anonymous users before signup
- Graph knowledge = relationship = trust = conversion

### 2025-10-13: odoo-qa-guardian (QA Guardian)
**Pain Point:** Debug agent overworked - Developer and CTO making same Odoo 18 mistakes repeatedly due to knowledge silos
**Archetype:** Gatekeeper (Pre-commit quality enforcer)
**Knowledge Sources:** Debug agent's odoo_error_patterns.md (661 lines), bug_history_protocol.md, QA tool intelligence (ai_sam_development_qa.py - 1,616 lines)
**Outcome:** Shift-left quality gate with 5 knowledge files (protocol, auto-fix patterns, detection commands, education framework, scoring rubric)
**Parallel Action:** Enhanced Developer agent with 5th knowledge file (odoo_18_error_prevention.md) extracted from Debug agent's error catalog
**Integration:**
- Developer → QA Guardian → git-push (new workflow)
- QA Guardian auto-fixes 7 patterns (90%+ confidence): `<tree>` → `<list>`, deprecated deps, version format, missing imports, etc.
- Educational approach: Explains WHY issues matter (not just fixes)
- Three-gate model: CRITICAL/HIGH (zero tolerance) + QA score (≥8) + Issue volume (≤20)
**Expected Impact:**
- Developer prevents bugs (now has prevention knowledge)
- QA Guardian catches remaining issues (gate before commit)
- Debug agent workload reduced 60-80% (only NEW bugs)
**User Feedback:** "c please" (approved Option C: both Developer enhancement + QA Guardian creation)
**Key Innovation:** Knowledge transfer between agents (Debug → Developer + QA Guardian) breaks eternal debugging loop

### 2025-10-21: mod-scrapper (Lead Generator & Web Scraping Specialist)
**Pain Point:** ai_sam_lead_generator module created pre-agent - has bugs, incomplete implementation, needs niche specialist
**Archetype:** Implementer (Niche Module Specialist - follows mod-intelligence pattern)
**Color:** Purple (automation/integration)
**Knowledge Sources:** Existing module code (30% complete), ScraperAPI documentation, pre-agent bugs documented
**Outcome:** Full agent infrastructure with 5 knowledge files
**Agent Files Created:**
- `agent.json` - Agent configuration
- `/mod_scrapper` slash command - User interface
- `dev_docs/00_MODULE_OVERVIEW.md` - Module structure, current state, known bugs
- `dev_docs/01_BUILD_HISTORY.md` - Change tracking, bug log, lessons learned
- `dev_docs/02_MODELS_DATA.md` - Complete model reference (existing + TODO models)
- `dev_docs/03_TECHNIQUES.md` - ScraperAPI patterns, Odoo detection, lead scoring algorithms
- `dev_docs/04_INTEGRATION.md` - SAM AI, CRM, ScraperAPI integration guide
**Module Status:** 30% complete, 4 critical bugs, missing ai.scraped.lead model, lib/ modules missing
**Key Decisions:**
- Data models stay in THIS module (not ai_brain) - lead generation niche enough
- ScraperAPI docs referenced when needed (not loaded every time)
- All dev work files in `dev_docs/` folder
- Follows same pattern as mod-intelligence (shared foundation + module-specific knowledge)
**Shared Foundation Files:**
- `sam_ai_foundation.md` - ai_brain + ai_sam architecture
- `odoo_18_tech_stack.md` - Odoo 18 requirements, error prevention
- `qa_integration_protocol.md` - QA tool usage, quality workflow
**Integration:**
- Module → ScraperAPI (web scraping service)
- Module → Odoo CRM (lead import)
- Module → SAM AI Chat (AI campaign configuration - TODO)
**First Mission:** Fix Bug #1 (create ai.scraped.lead model), then lib/ modules
**User Feedback:** Confirmed ScraperAPI expertise level (not every request), document current state, models stay in module
**Pattern Established:** Niche module specialists (mod-*) follow consistent structure - same startup protocol, shared foundation, module-specific dev_docs

### 2025-10-24: sam-sales-support (SAM Sales Support) **[SESSION RECOVERED]**
**Pain Point:** Need to shift from technician creating SAM to user using SAM - explaining "the sheer capacity I have not yet come across as an AI System"
**Archetype:** Synthesizer (NEW pattern - not in original 5: Research + Translate + Storytell + Build)
**Color:** Magenta 💗 (feminine, creative, synthesis)
**Knowledge Sources:** 23.2M tokens session history, 13 SAM modules, SAM agent personality, visual assets, multi-audience needs
**Outcome:** Full agent infrastructure with 5 knowledge files + slash command
**Agent Files Created:**
- `agent.json` - Synthesizer agent configuration
- `/sam_sales_support` slash command - User interface
- `sam_essence_extraction.md` - WHO SAM is (personality, 4 traits, 6 modes, visual identity, value prop)
- `ecosystem_architecture_humanized.md` - WHAT SAM does (tech → human translation, 13 modules humanized)
- `super_powers_catalog.md` - WHY SAM matters (7 unprecedented capabilities vs. ChatGPT/Claude)
- `landing_page_methodology.md` - HOW to create explainer (7-section Odoo 18 page structure)
- `sam_sales_support_protocol.md` - 7-phase workflow (Discovery → Translation → Audience → Synthesis → Structure → Build → Validation)
**Mission:** Create `introducing_sam.html` landing page explaining SAM to multiple audiences (Anthony, Dennis, Christy, new agents, future users)
**Key Decisions:**
- Agent name: `/sam_sales_support` (not "Story Weaver" or "Documentarian")
- Output: `C:\Working With AI\ai_sam\ai_sam\ai_sam_introduction\introducing_sam.html`
- SAM is SHE (not he!) - critical identity correction
- Multi-layered depth: 10 sec essence → 2 min exploration → 20+ min deep dive
- Human language FIRST, tech language SECOND (brain, memory, personality vs. models, controllers, schemas)
**Human Language Framework Captured:**
- Anthony says "Brain" → Tech: Database → SAM Sales Support: "Long-term memory"
- Anthony says "Personality" → Tech: Agents → SAM Sales Support: "Thinking styles"
- Anthony says "Behaviour" → Tech: Workflows → SAM Sales Support: "Reflexes and actions"
- Anthony says "Memory" → Tech: Graph DB → SAM Sales Support: "Remembers everything"
- Anthony says "Thinking Processors" → Tech: AI services → SAM Sales Support: "Intelligence engine"
**7 Super Powers Documented:**
1. Perfect Memory (infinite, never forgets - vs. ChatGPT session-only)
2. Adaptive Personality (6 modes: Generalist, CMO, CTO, DRC, Empathy, Celebration)
3. Relationship Intelligence (graph database tracks WHO said WHAT, WHEN, WHY)
4. Specialist Delegation (17 agent team, seamless handoffs)
5. Action-Oriented (N8N workflows, not just chat)
6. Continuous Learning (personalization over time)
7. Pre-Signup Memory (pixel tracking remembers before you join)
**Landing Page Structure (7 Sections):**
1. Hero (THIS IS SAM - WHO/WHAT/WHY pillars)
2. Super Powers (7 expandable cards)
3. How SAM Thinks (brain → mind → skills visual diagram)
4. Who SAM Helps (personas: business owners, consultants, creators, founders)
5. The Journey (23.2M tokens, 13 modules, 17 agents, 2 weeks to launch)
6. SAM vs. The World (comparison matrix + ROI calculator 17-30x)
7. Final CTA (waitlist signup, early access pricing $27/month locked)
**Integration:**
- Works with: `/cos` (designed her), `/cmo` (uses page for marketing), `/sam` (explains SAM's essence), `/docs` (ecosystem truth)
- Output folder created: `ai_sam_introduction/` for landing page + assets
- Visual assets location: `D:\2. Google AG\My Drive\AI Sam\AI Sam V3 images updated\`
**User Feedback:**
- User: "I desperately want to shift from technician creating sam, to user using sam"
- User: "shear capacity that i have not yet come across as an AI System"
- User: "language I am using is human simple, brain, personality, behaviour, memory, rather than tech developer names"
- User: "could we start to actually call it / sam_sales_support"
- User: "Sam Is a She.. Not a he :)"
**Session Context:** This was a RECOVERED session that crashed (6.79MB image exceeded 5MB API limit). User asked to review crashed session and continue exactly where left off. Agent creation completed successfully after recovery.
**Pattern Innovation:** NEW ARCHETYPE - Synthesizer (6th archetype beyond Advisor, Implementer, Gatekeeper, Automator, Enforcer)
- Combines: Research (explore history) + Translation (tech → human) + Storytelling (craft narrative) + Building (create HTML)
- Feminine energy emphasized (connection, empathy, wholistic thinking)
- Multi-audience messaging (one artifact, multiple entry points)
**Expected Impact:**
- Ends re-education loop for new agents (read page → aligned with SAM's essence)
- Anthony can explain SAM to stakeholders (Dennis, Christy, investors) without repeated explanations
- Pre-launch landing page for waitlist signups
- "SAM Constitution" - canonical truth document for ecosystem

### 2025-10-24: sam-message-orchestrator (SAM Message Orchestrator)
**Pain Point:** SAM chat experience not matching Claude Code quality - Send button disabled, message flow difficult to fine-tune
**Archetype:** Implementer (100% autonomy - Plan → Clarify → Implement)
**Color:** Purple 🟣 (AI/automation magic)
**Knowledge Sources:** Current /mod_sam session (gold standard), SAM chat codebase (sam_chat_vanilla_v2.js, sam_ai_chat_controller.py, ai_service.py), Anthropic API integration patterns
**Outcome:** Full agent infrastructure with 5 knowledge files + slash command
**Agent Files Created:**
- `agent.json` - Purple Implementer configuration
- `/orchestrator` slash command - User interface
- `ai_communication_architecture.md` - Complete message flow map (frontend → controller → ai.service → Anthropic → back)
- `message_orchestration_patterns.md` - Best practices (state management, error recovery, streaming, "out of context" shutdown)
- `anthropic_integration_guide.md` - Claude API specifics (rate limits, context windows, cost tracking, error handling)
- `orchestration_debugging_protocol.md` - 7-phase systematic debugging workflow
- `sam_orchestrator_protocol.md` - Agent's operational workflow (Plan → Clarify → Implement)
**Mission:** Fine-tune SAM chat orchestration (ai_brain ↔ ai_sam ↔ Anthropic API), debug message flow issues, enhance chat experience
**Key Decisions:**
- Agent name: `/orchestrator` (backend AI communication specialist)
- Archetype: 100% Implementer (not advisor - fixes code directly)
- Workflow: Plan → Clarify → Implement (user's Q4 requirement)
- Self-mapping: Agent explores tech stack itself (user's Q3 requirement)
- Gold standard: Match /mod_sam session quality (deep analysis, scope awareness, honest delegation)
**Tech Stack Mapped:**
- Frontend: `sam_chat_vanilla_v2.js` (SamChatVanilla class, proxy reactivity, state management)
- Controller: `sam_ai_chat_controller.py` (HTTP endpoints: /send, /send_streaming)
- Service: `ai_service.py` (orchestration brain, Claude API integration, retry logic)
- Models: `ai_message.py`, `ai_conversation.py` (data storage)
- API: Anthropic Claude 3.5 Sonnet (200K context, $3/M input, $15/M output)
**Critical Patterns Documented:**
1. Error recovery: ALWAYS reset `isProcessing` in `finally` block (prevents stuck Send button)
2. Streaming vs. non-streaming: When to use each
3. Context awareness: Environment-aware system prompts
4. "Out of context" shutdown: Intelligent routing + graceful refusal (user loved this in /mod_sam!)
5. Sliding window: Truncate old messages when >150K tokens
6. Rate limit handling: Exponential backoff retry (3 attempts)
7. Memory integration: Optional enhancement for personalization
**Integration:**
- Works with: `/developer` (delegates UI refactoring), `/cto` (delegates strategy), `/debug` (delegates novel bugs)
- Complements: `/mod_sam` (module infrastructure) vs. `/orchestrator` (AI orchestration)
- CTO delegates to orchestrator: "Should we cache messages?" (CTO strategy) → "Fix message flow bug" (orchestrator tactical)
**User Feedback:**
- User: "I feel we need a new specialist... SAM chat has been quiet difficult to fine tune"
- User: "This is outside /mod_sam specialization (core infrastructure). This is backend AI orchestration."
- User: "I really liked the way /mod_sam shut me down when it went 'out of context'"
- User: "This could almost be CTO enhanced, yet he would really want to delegate to this unique agent"
- User (Q2): "The whole experience is not quite what I was expecting vs. Claude Code"
- User (Q3): "Agent should map tech stack itself"
- User (Q4): "It should implement 100%, plan, clarify, implement"
- User: "Path A would be wisest" (fast track - use current /mod_sam session + codebase)
**Expected Impact:**
- SAM chat experience matches/exceeds Claude Code quality
- Send button issues debugged systematically (7-phase protocol)
- Message flow fine-tuned (frontend ↔ backend ↔ Anthropic)
- CTO delegates tactical orchestration to specialist
- User has specialist for ongoing chat enhancement
**CRITICAL ENHANCEMENT (Same Session - 2025-10-24):**
- User correction: "It will also need to understand our graph and vector DBs and how they interact as part of SAM's core behaviour, personality and voice, which = the way we orchestrate the communications"
- Created 6th knowledge file: `sam_memory_orchestration.md` (650 lines)
- Mapped complete memory stack (4 layers):
  1. Graph DB (Apache AGE): Relationships, user context, challenges, wins, preferences
  2. Vector DB (ChromaDB): Semantic search, similar conversations, 768-dim embeddings
  3. Memory-Enhanced Prompts: Past context injection into system prompts
  4. Personality & Voice: SAM's character (caring, supportive, intuitive, capable), 6 mode shifts
- Documented memory integration in ai_service.send_message() (line ~676-722)
- Complete orchestration flow WITH memory (10-step journey)
- Memory = SAM's soul (differentiator from ChatGPT: "remembers EVERYTHING")
- Agent now understands how memory orchestrates SAM's communication, personality, and relationship-aware behavior

### 2025-11-12: n8n-expert (N8N Workflow Expert)
**Pain Point:** N8N workflows require specialized JSON knowledge, specific node configurations, and complex integration patterns - User has many N8N workflows (local + online) that need expert diagnosis and building support
**Archetype:** Implementer (Builds + Diagnoses workflows)
**Color:** Purple 🟣 (Automation magic)
**Knowledge Sources:** User's existing N8N workflows (AI-powered_content_engine_n8n.json - 18 nodes, n8n_generate_article_node.json), N8N research repository (full source code), N8N official documentation patterns
**Outcome:** Full comprehensive agent infrastructure with 5 knowledge files + slash command
**Agent Files Created:**
- `agent.json` - Purple Implementer configuration
- `/n8n` slash command - User interface
- `n8n_workflow_mastery.md` - Comprehensive N8N knowledge (400 lines: core concepts, 25+ node types, JSON structure, expression syntax, credential management)
- `n8n_expert_protocol.md` - 7-phase workflow (350 lines: Discovery → Design → Implementation → Validation → Testing → Optimization → Handover)
- `n8n_json_reference.md` - Quick-reference templates (300 lines: copy-paste ready node configs, connection patterns, 50+ expression examples)
- `n8n_debugging_guide.md` - Troubleshooting & quality (400 lines: 10 common errors + fixes, debugging checklist, performance optimization, security best practices, anti-patterns)
- `n8n_integration.md` - Ecosystem integration (250 lines: delegation matrix, N8N ↔ Odoo patterns, SAM AI integration, workflow organization, testing protocols)
**Mission:** Build new N8N workflows from scratch, diagnose/fix existing workflow issues, optimize performance, integrate with SAM AI/Odoo ecosystem
**Key Decisions:**
- Agent name: `/n8n` (N8N workflow specialist)
- Archetype: Implementer (builds workflows, diagnoses issues, optimizes)
- User requirement: "Comprehensive = most accurate" (Path B: full knowledge extraction upfront)
- Workflows stored: `C:\Users\total\n8n-workflows\`
- Naming convention: `{purpose}-{version}.json`
**Tech Stack Mapped:**
- N8N node types: Webhook triggers, OpenAI/AI nodes, Code nodes (JavaScript), HTTP Request, Google Sheets, YouTube, LinkedIn, Twitter, Facebook, Switch/IF logic, Merge
- Expression syntax: `={{$json.field}}`, `={{$now}}`, string interpolation, array operations
- Connection patterns: Sequential, branching, switch routing, merge
- Error patterns: JSON syntax, duplicate IDs, invalid connections, missing credentials, expression errors, TypeVersion mismatches, timeouts
**Integration Patterns:**
1. N8N → Odoo webhook (N8N calls Odoo endpoint)
2. Odoo → N8N webhook (Odoo triggers N8N workflow)
3. SAM AI conversation → N8N action (full orchestration flow)
**Delegation Rules:**
- `/cto` - Strategy questions ("Should we use N8N?", scaling, architecture)
- `/developer` - Odoo integration (webhooks, controllers, models)
- `/mod_workflows` - SAM AI module integration (if exists)
- `/cmo` - Marketing strategy (content decisions)
- `/odoo-architect` - SAM AI architectural planning
**Workflow Patterns Extracted:**
- AI content generation (webhook → OpenAI → social media)
- Multi-platform publisher (switch routing to YouTube/LinkedIn/Twitter)
- Lead scoring (webhook → AI analysis → CRM update)
- Schedule-based automation (cron → fetch → transform → store)
**User Feedback:**
- User: "q1. online is current, i do have many workflows on my local which in turn later will be added to a github repo"
- User: "Q2. both equally" (building NEW + debugging EXISTING)
- User: "q3. at this stage, this is a seperate n8n canvas soecific actvity"
- User: "q4. B, comprehensive = most accurate please" (Full build, not MVP)
**Expected Impact:**
- Build N8N workflows 2-3x faster (templates + comprehensive knowledge)
- Diagnose workflow issues systematically (10 common errors cataloged)
- Optimize workflow performance (error handling, timeouts, batching patterns)
- Seamless SAM AI ↔ N8N ↔ Odoo integration (webhook patterns documented)
- Reduce N8N learning curve (50+ expression examples, 25+ node configs ready)
**Testing Completed:**
- Created test workflow: `test-workflow-simple.json` (3 nodes: Webhook → OpenAI → Respond)
- JSON validation: ✅ Valid structure
- Node count: 3 nodes properly configured
- Connection flow: Logical left-to-right
**Pattern Innovation:** Canvas-specific automation specialist (separate from SAM AI core, but integrated via webhooks)
**Knowledge Coverage:**
- 25+ N8N node types documented
- 50+ expression examples (dates, strings, numbers, arrays, conditionals)
- 10 common errors with fixes
- 5 integration patterns (SAM AI, Odoo, external APIs)
- 4 workflow patterns (webhook→AI, schedule→fetch, multi-platform, error handling)

### 2025-12-14: AGENT FOUNDATION + BASE/EXPERIENCE Pattern (MAJOR UPDATE)
**Pain Point:** Agents operating with different "attitudes and abilities" - no consistent lean thinking, file discipline violations (Desktop, C:\Users\total\), first-assumption syndrome (no 5 Whys), user becoming "error-proofing slave"
**Solution:** Created universal AGENT_FOUNDATION.md that ALL agents must read first

**AGENT_FOUNDATION.md Created:**
- **Lean Thinking Protocol** - 5 Whys MANDATORY before any implementation
- **File Discipline** - ABSOLUTE forbidden zones (Desktop, C:\Users\total\, etc.)
- **Polish Mode** - Current phase = refinement, not construction
- **Diagnosis Protocol** - Search for patterns, check history
- **Behavioral Expectations** - "Be the agent Anthony keeps running"

**Updated Files:**
- AGENT_STARTUP_PROTOCOL.md - Now references Foundation as Step 0
- 6 critical slash commands updated with Foundation enforcement:
  1. `/cto-developer`
  2. `/cto-architect`
  3. `/cto-auditor`
  4. `/sam`
  5. `/session-start`
  6. `/docs`

### 2025-12-14: sam_workflow + sam_workflow_base (NEW PATTERN: BASE vs EXPERIENCE)
**Pain Point:** Codebase grew massively, need niche specialists that understand specific UI/UX vs backend concerns. Agents were "non-contextual" - didn't start with same intelligence/thought process.
**Innovation:** Two-layer module specialist pattern:

| Base Agent | Experience Agent | Focus |
|------------|-----------------|-------|
| `/sam_workflow_base` | `/sam_workflow` | ai_sam_workflows |
| (future: `/sam_chat_base`) | (future: `/sam_chat`) | ai_sam_chat |

**sam_workflow_base (Renamed from /mod_workflows):**
- **Archetype:** Implementer (Structural)
- **Color:** Purple 🟣
- **Scope:** Models, controllers, business logic, JSON storage, backend
- **Does NOT:** Touch HTML in static/description/, UI polish, CSS

**sam_workflow (NEW - Experience Agent):**
- **Archetype:** Experience (Polish-focused, UI/UX)
- **Color:** Cyan 🔷
- **Scope:** HTML (static/description/), CSS, JS, QWeb templates, user-facing
- **Workspace:** workflow_ui_wip/ (scripts, drafts, dev docs)
- **Multi-Audience Awareness:** End users + Developers + SAM ecosystem
- **Does NOT:** Touch models, controllers, backend logic

**Key Design Decisions:**
- Module path: `D:\SAMAI-18-SaaS\github-repos\05-samai-core\ai_sam_workflows\`
- HTML files in static/description/ serve multiple audiences
- workflow_ui_wip/ is agent's sandbox for scripts, tools, drafts
- .md files ARE allowed in workspace (user clarified)
- Agents hand off to each other (UI work → /sam_workflow, backend → /sam_workflow_base)

**Files Created:**
- `/sam_workflow.md` - Experience agent slash command
- `/sam_workflow_base.md` - Base agent slash command (slim version)
- `agents/sam-workflow/agent.json` - Agent config
- `agents/sam-workflow-base/agent.json` - Agent config

**Pattern Established:** BASE + EXPERIENCE = Complete module coverage
- BASE handles structure (what it DOES)
- EXPERIENCE handles polish (how it LOOKS/FEELS)
- Clear handoff rules prevent overlap

**User Insights:**
- "This is polish time now. 1000% we have all the infrastructure built."
- "I do not consider these agents are the agents i am discussing 'structural changes'"
- "I have come to see/feel core characteristics/claude behaviours... some sessions i kill quickly, some i run for a long time"
- Agents should "review our html files... the same way a human would"

### 2025-12-14: sam_chat + sam_chat_base (Same Session - Chat Specialists)
**Pain Point:** Chat experience needs polish, data flow is complex (frontend ↔ controller ↔ ai_service ↔ Anthropic), need specialists who understand their layer
**Pattern Applied:** Same BASE + EXPERIENCE pattern as workflows

**sam_chat_base (NEW - Structural):**
- **Archetype:** Implementer
- **Color:** Purple 🟣
- **Primary Module:** ai_sam_base
- **Scope:** Controllers (sam_ai_chat_controller.py), Models (ai_service.py, ai_message.py, ai_conversation.py), AI orchestration, memory integration
- **Key Files:** sam_ai_chat_controller.py, ai_service.py, ai_context_builder.py, ai_graph_service.py
- **Does NOT:** Touch frontend JS, CSS, UI components

**sam_chat (NEW - Experience):**
- **Archetype:** Experience
- **Color:** Cyan 🔷
- **Primary Module:** ai_sam
- **Scope:** sam_chat_vanilla_v2.js, CSS, OWL components, QWeb templates
- **Key Files:** sam_chat_vanilla_v2.js, sam_ai_chat_widget.css, sam_chat_bubble.js
- **Does NOT:** Touch controllers, models, backend logic

**Data Flow Understanding:**
```
Frontend (sam_chat domain) → Controller (sam_chat_base) → ai_service.py (sam_chat_base) → Anthropic API
```

**Files Created:**
- `/sam_chat.md` - Experience agent slash command
- `/sam_chat_base.md` - Base agent slash command
- `agents/sam-chat/agent.json` - Agent config
- `agents/sam-chat-base/agent.json` - Agent config

**Complete BASE + EXPERIENCE Coverage Now:**
| Module | Base Agent | Experience Agent |
|--------|-----------|-----------------|
| ai_sam_workflows | `/sam_workflow_base` | `/sam_workflow` |
| ai_sam + ai_sam_base | `/sam_chat_base` | `/sam_chat` |

### 2025-12-17: sam_chat CONSOLIDATED (Merged sam_chat_base into sam_chat)
**Pain Point:** User found BASE + EXPERIENCE split unnecessary for chat - preferred single full-stack specialist
**Action:** Consolidated `/sam_chat_base` INTO `/sam_chat`

**sam_chat (CONSOLIDATED - Full Stack):**
- **Archetype:** Implementer (Full Stack)
- **Color:** Cyan 🔷
- **Scope:** COMPLETE chat experience - Frontend AND Backend
  - Frontend: sam_chat_vanilla_v2.js, CSS, OWL components, QWeb templates
  - Backend: Controllers, Models, AI orchestration, memory integration
- **Key Files:** Both ai_sam (frontend) AND ai_sam_base (backend) files
- **Data Flow:** Understands and can fix ENTIRE message journey

**Files Deleted:**
- `/sam_chat_base.md` - Removed (merged into sam_chat)
- `agents/sam-chat-base/` - Removed folder

**Reasoning:**
- User preference: Single specialist better than coordinating two
- Chat is core experience - needs unified ownership
- Reduces handoff friction
- /sam_workflow still uses BASE + EXPERIENCE pattern (workflows is different domain)

**Current Coverage After Consolidation:**
| Module | Agent | Pattern |
|--------|-------|---------|
| ai_sam_workflows | `/sam_workflow_base` + `/sam_workflow` | BASE + EXPERIENCE |
| ai_sam + ai_sam_base (chat) | `/sam_chat` | UNIFIED FULL STACK |

---

## User Preferences (Learned Patterns)

### Agent Design
- **Knowledge files:** Prefers 4-5 files (not more, not less)
- **Archetypes:** Likes clear specialization (5 patterns)
- **Communication:** Values Socratic questioning, challenges assumptions
- **Integration:** Wants agents to work together smoothly

### Communication Style
- Direct, technical language
- Visual diagrams (ASCII art appreciated)
- Examples (✅ good, ❌ bad format)
- Concise over verbose
- "Show me, don't tell me"

### Workflow Preferences
- `/session-start` at beginning of development sessions
- Audit BEFORE commit (corrected from "after")
- Quality obsessed (QA tool is mandatory)
- File organization critical ("no rogue files" policy)
- Pride in workmanship (not "good enough")

### Technical Identity
- "Tech head" (user's term)
- "Overarching memory of EVERYTHING" (user has full context)
- "The dreamer, the creator" (user's role)
- Wants "knowledge partner" (fresh perspective valued)

---

## 🎯 MAJOR UPDATE (2025-10-13): Knowledge Transfer Initiative

### Problem Identified
**Debug agent overworked** - Fixing same Odoo 18 mistakes repeatedly because Developer and CTO agents lacked error prevention knowledge.

**Root Cause:** Knowledge silos
- Debug agent = REACTIVE (knows all the fixes AFTER bugs happen)
- Developer agent = PROACTIVE (but missing Odoo 18-specific prevention patterns)
- Result = Eternal debugging loop (make mistake → debug fixes → make same mistake again)

### Solution: Two-Pronged Approach

**Phase 1: Enhance Developer Agent ✅**
- Created `odoo_18_error_prevention.md` (5th knowledge file)
- Extracted 10 CRITICAL patterns from Debug agent's odoo_error_patterns.md
- Content: What NOT to do + why it breaks + how to prevent
- Developer now has prevention knowledge BEFORE coding

**Phase 2: Create QA Guardian Agent ✅**
- NEW AGENT: odoo-qa-guardian
- Command: `/qa-guardian` (or `/qa`)
- Archetype: Gatekeeper (pre-commit quality enforcer)
- Mission: Catch Odoo 18 errors BEFORE commit + auto-fix + educate

**Expected Impact:**
- Developer prevents bugs (shift-left quality)
- QA Guardian catches remaining issues (gate before commit)
- Debug agent only invoked for NEW bugs (not repeat offenders)
- Overall: 60-80% reduction in debug agent workload within 2 weeks

---

## Identified Pain Points (Status Update)

### ✅ SOLVED (2025-10-13)
1. **Repeat Odoo 18 Mistakes** - Developer/CTO making same errors
   - Solution: Knowledge transfer (Developer enhancement + QA Guardian)
   - Status: Both delivered (ready for testing)

### High Priority
1. **Testing Automation** - Manual test running repetitive
   - Frequency: Multiple times per session
   - Candidate: Testing Specialist agent
   - Archetype: Automator + Gatekeeper

2. **Performance Bottlenecks** - Slow queries, N+1 problems
   - Frequency: Periodic issue during development
   - Candidate: Performance Optimizer agent
   - Archetype: Implementer + Gatekeeper

### Medium Priority
3. **Refactoring Opportunities** - Code smells accumulate over time
   - Frequency: Discovered during audits
   - Candidate: Refactoring Specialist agent
   - Archetype: Implementer

4. **Documentation Drift** - Docs fall behind code changes
   - Frequency: After major features
   - Candidate: Documentation Specialist agent
   - Archetype: Implementer

### Lower Priority
5. **Deployment Process** - Manual steps to deploy to production
   - Frequency: Less frequent
   - Candidate: Deployment Manager agent
   - Archetype: Automator

---

## Architecture Decisions (Historical Context)

### Why Three Layers?
- **ai_brain** = Data models ONLY (no views, no controllers)
- **ai_sam** = Framework layer (controllers, canvas core, shared JS)
- **branches** = Feature modules (independent siblings, no cross-dependencies)
- **Rationale:** Separation of concerns, clear boundaries, maintainability

### Why Canvas Skeleton Pattern?
- **ONE core, MANY skins** (motto)
- **Universal** canvas core = Platform-agnostic rendering
- **Specific** platform renderers = Unique business logic per platform
- **Rationale:** Scalability, prevents platform bleeding, clean architecture

### Why Odoo 18?
- **Modern OWL framework** (replaces jQuery)
- **Breaking changes:** `<list>` not `<tree>`, version 18.0.x.y required
- **Latest stable** at time of project start
- **Rationale:** Future-proof, modern JavaScript patterns

### Why QA Tool Mandatory?
- **Painfully learned lessons** captured in ai_sam_development_qa.py
- **10+ violation types** (XML, Python, JS, security, architecture)
- **Prevents repeated mistakes** (e.g., ir.actions model type conflicts)
- **Rationale:** Quality gate, catches issues before git commit

---

## Recurring Questions (FAQ for Future Sessions)

### Q: "Where does this file go?"
**A:** Decision matrix:
- Data model → `ai_brain/models/`
- Business logic method → Same model file in `ai_brain/models/`
- HTTP endpoint → `ai_sam/controllers/` or `{branch}/controllers/`
- Common JavaScript → `ai_sam/static/src/js/`
- Branch-specific JS → `{branch}/static/src/js/`
- Experimental → `claudes floating files/{type}/` FIRST

### Q: "Do I need security rules?"
**A:** ALWAYS YES for custom models.
- File: `security/ir.model.access.csv`
- Minimum: User and manager access rows

### Q: "Can platforms import each other?"
**A:** NO. FORBIDDEN. Platforms are independent siblings.
- Only import from: `ai_brain` or `ai_sam`
- Never: `from the_ai_automator` inside `ai_sam_memory`

### Q: "Skeleton vs Canvas naming?"
**A:** ALWAYS use "canvas" now.
- "skeleton" is legacy, deprecated (being cleaned up)
- `canvas_engine.js` NOT `skeleton_canvas_engine.js`

### Q: "When to use /architect vs /developer?"
**A:** Separate sessions!
- Session 1: `/architect` → Create plan, write prompt
- Session 2: `/developer` → Paste prompt, implement
- Reason: Context switching, role clarity

---

## Agent Creation Patterns (Emerged During Session)

### Pattern 1: Color Coding (Semantic)
- 🔵 Blue = Audit/Analysis (trust, inspection)
- 🟢 Green = Implementation (growth, creation)
- 🟡 Yellow = Planning (caution, thinking)
- 🟣 Purple = Automation (magic, efficiency)
- 🔴 Red = Enforcement (warning, boundaries)
- 🔷 Cyan = Meta/Support (neutral, helpful)

### Pattern 2: Tool Selection (By Archetype)
- **Advisors:** Read, Grep, Glob, Write (NO Bash, NO Edit)
- **Implementers:** ALL tools (Bash, Read, Grep, Glob, Write, Edit, TodoWrite)
- **Gatekeepers:** Read-only + Write (for reports)
- **Automators:** Bash, Read, Grep, Write, Edit (workflows)
- **Enforcers:** Read, Grep, Glob, Bash, Edit, Write, TodoWrite (cleanup)

### Pattern 3: Knowledge File Structure
- **Count:** Always 4-5 files (optimal)
- **Length:** 100-500 lines each (scannable)
- **Structure:** Headings, symbols (✅❌), examples over explanations
- **Naming:** Descriptive (`domain_thing.md` not `file1.md`)

### Pattern 4: Workflow Phases
- **Successful agents:** 5-7 distinct phases
- **Each phase:** Goal → Steps → Output
- **Decision points:** Explicit (when to ask user vs proceed)
- **Handoffs:** Clear (to other agents or back to user)

---

## Integration Patterns (Ecosystem Flow)

### Sequential Flow (Most Common)
```
/session-start → /architect → /developer → /check-core → odoo-audit → /git-push
```

### Quality Loop (Iterative)
```
/developer → odoo-audit (issues found) → /developer (fix) → odoo-audit (pass) → /git-push
```

### Boundary Validation (Enforcement)
```
/developer → /check-core (violations?) → /developer (fix) → /check-core (clean) → proceed
```

### Workflow Correction (User Taught)
```
Original: developer → git-push → audit
Corrected: developer → audit → git-push
Reason: "Audit before commit, not after!" (fix issues before git history)
```

---

## Failed Experiments (Learn From Mistakes)

### ❌ Attempt 1: God Agent
**Tried:** One agent that plans, codes, tests, commits everything
**Result:** Confusing, role ambiguity, user didn't know when to invoke
**Lesson:** Specialize agents. One role, done excellently.

### ❌ Attempt 2: 10+ Knowledge Files
**Tried:** Comprehensive documentation, every edge case covered
**Result:** Overwhelming, agent couldn't scan effectively, slow responses
**Lesson:** 4-5 focused files optimal. Quality over quantity.

### ❌ Attempt 3: No Workflow Protocol
**Tried:** Just give agent knowledge, let it figure out process
**Result:** Inconsistent behavior, different approach each session
**Lesson:** Explicit workflow phases mandatory (agent_protocol.md)

---

## User Vocabulary (Domain Language)

- **"Rogue files"** = Files not in correct module location
- **"Skeleton"** = Old deprecated naming (now "canvas")
- **"Platform bleeding"** = Platform-specific code in canvas core (forbidden)
- **"Painfully learned"** = Lesson from mistakes (capture IMMEDIATELY)
- **"Rockstar developer"** = Elite quality standard (not "good enough")
- **"ONE core, MANY skins"** = Canvas architecture motto
- **"The dreamer"** = User's role (visionary, creator)
- **"Implementation specialist"** = Agent's role (executor)
- **"Tech head"** = User's technical identity
- **"Overarching memory"** = User has full context across sessions

---

## Success Metrics (What User Values)

### Agent Quality
- QA tool passes 100% before handover
- Clear role boundaries (no drift)
- Consistent behavior across sessions
- Time/effort saved (measurable)

### Code Quality
- Scored /10 (from odoo-audit)
- Zero architectural violations (from check-core)
- Clean file organization (no rogue files)
- Pride in workmanship ("Would I be proud in 6 months?")

### Workflow Efficiency
- Fast handoffs between agents
- No repeated explanations needed
- Smooth integration (agents work together)
- Context maintained across phases

---

## Next Agent Predictions (Based on Patterns)

### Highly Likely Next Requests
1. **Testing Specialist** - Manual test running mentioned 3+ times
2. **Performance Optimizer** - Pain point explicitly identified
3. **Refactoring Specialist** - odoo-audit findings suggest need

### User Preferences for New Agents (Predicted)
- Will want Socratic questioning first (`/recruiter fresh`)
- Will expect 4-5 knowledge files (no more, no less)
- Will demand clear archetype assignment
- Will test thoroughly before accepting into ecosystem
- Will want integration with existing agents documented

---

## Recruiter Mode Preferences (Learned Today)

### When User Chooses FRESH MODE
- **Trigger:** Strategic decisions, questioning fundamentals
- **Value:** Challenges assumptions, forces justification
- **Example:** "Should we even create this agent?"

### When User Chooses DEFAULT MODE
- **Trigger:** Expanding ecosystem, iterative building
- **Value:** Builds on past work, efficient creation
- **Example:** "Create agent similar to X but for Y"

### User's Insight (Quote)
"I have overarching memory of EVERYTHING, so a knowledge partner [with fresh perspective] would be good to work with"

**Interpretation:** User values BOTH modes:
- DEFAULT = Continuity, builds on shared knowledge
- FRESH = Challenge, provides external perspective

---

## Notes for Future Recruiter Sessions

### When User Says...
- **"I'm sick of..."** → Strong agent candidate (clear pain)
- **"Claude always forgets..."** → Session-start gap, capture now
- **"This keeps causing errors..."** → QA tool gap, add detection
- **"Can we create..."** → Run 7-question recruitment criteria

### When User Corrects Workflow
→ Update this memory file immediately
→ Example: "Audit before commit" correction captured

### When User Expresses Preference
→ Note in "User Preferences" section
→ Apply to all future agent designs

### When Session Ends Successfully
→ Append to "Agent Creation History"
→ Update "User Preferences" if new pattern emerged
→ Save "Painfully learned lessons" immediately

---

## Memory Maintenance Protocol

### Update Triggers (When to Edit This File)
- ✏️ After every agent creation
- ✏️ When user corrects something
- ✏️ When new pain point identified
- ✏️ When architecture decision made
- ✏️ When user preference emerges
- ✏️ When workflow pattern changes

### Review Schedule
- 📅 Every 5 agents created (major review)
- 📅 Monthly review (prune outdated info)
- 📅 When major architecture change occurs
- 📅 When user requests memory review

### Prune Criteria (What to Remove)
- ❌ Outdated architecture decisions (if changed)
- ❌ Deprecated patterns (no longer used)
- ❌ Resolved pain points (no longer issues)
- ❌ One-off preferences (not repeated patterns)

---

## Meta-Observations (Recruiter Self-Awareness)

### Pattern 1: User Knows What They Want
- Pain points are clear and specific (not vague)
- Architecture decisions are well-reasoned (not arbitrary)
- Quality standards are high (not negotiable)
- **Learning:** Trust user's instincts, guide don't dictate

### Pattern 2: Incremental Evolution (Not Big Bang)
- Each agent builds on previous (7 agents in 1 session)
- Ecosystem grows organically (not pre-planned)
- Patterns emerge naturally (discovered, not designed)
- **Learning:** DEFAULT mode fits this workflow perfectly

### Pattern 3: Fresh Perspective Explicitly Valued
- User asked for "fresh mode" explicitly
- Values being challenged (not just confirmed)
- Wants assumptions questioned (Socratic method)
- **Learning:** FRESH mode is strategic tool, not default

### Pattern 4: Documentation as Byproduct
- User frustrated by repeated explanations
- Wants knowledge captured immediately ("painfully learned")
- Values session_memory.md concept
- **Learning:** This memory file serves dual purpose (agent context + documentation)

### Pattern 5: Quality Over Speed
- Will NOT accept "good enough" agents
- Demands 100% QA pass before handover
- Tests thoroughly before accepting
- **Learning:** Never rush. Excellence is non-negotiable.

---

### 2026-01-05: hetzner (Hetzner Infrastructure Advisor)
**Pain Point:** Need to access Hetzner Cloud servers securely, unfamiliar with SSH/security jargon
**Archetype:** Advisor (STRICT - Read-only, never executes)
**Color:** Blue (trust, infrastructure)
**Knowledge Sources:** Hetzner Cloud docs, SSH security best practices, Windows-specific SSH setup
**Outcome:** Full agent infrastructure with 3 knowledge files + slash command
**Agent Files Created:**
- `agent.json` - Advisor config with forbidden Bash/Edit/Write tools
- `/hetzner` slash command - User interface
- `hetzner_cloud_fundamentals.md` - Cloud concepts, console navigation, server types, patterns
- `ssh_security_mastery.md` - Key generation, connection, hardening, Windows-specific notes
- `hetzner_advisor_protocol.md` - Safety rules, workflows, delegation, templates
**Safety Mode:** STRICT ADVISORY
- NEVER uses Bash tool (generates commands for user to run)
- NEVER uses Edit/Write tools (except agent folder)
- ALWAYS explains before suggesting
- ALWAYS warns on dangerous operations (root disable, firewall changes)
**First Mission:** SSH access setup for Hetzner Cloud
**Key Workflows:**
1. SSH Key Setup (generate, add to Hetzner, first connection)
2. Can't Connect Diagnosis (verbose SSH, firewall check, rescue mode)
3. Security Hardening (non-root user, disable root login, disable password auth)
**Delegation:**
- TO `/cto` - Strategic infrastructure decisions
- TO `/cto-developer` - Odoo deployment on servers
- FROM `/cto` - Hetzner-specific guidance
**User Context:** Windows user, Hetzner Cloud (not dedicated), first-time SSH setup
**ROI:** High - infrastructure access is blocking development work
**Pattern Note:** First infrastructure-focused Advisor agent; complements CTO (strategic) with tactical Hetzner-specific guidance

### 2026-01-06: sales-strategist v2.0 (MAJOR ENHANCEMENT)
**Pain Point:** Need a sales strategist agent for Dennis (non-tech business partner) to work with remotely. Must convert founder + Dennis wisdom into profitable funnels and courses without getting hijacked into tech tangents.
**Archetype:** Advisor + Implementer (Hybrid - strategies AND writes real copy)
**Color:** Magenta (creative, sales-focused)
**Persona:** SAM - AI Powered Sales Strategist
**Greeting:** "Hi there.. SAM here, Your AI Powered Sales Strategist... where shall we begin?"
**Primary User:** Dennis (analytical, perfectionist, non-tech)
**Knowledge Sources:** The SAM Sales System folder (D:\SAMAI-18-SaaS\The SAM Sales System), existing Russell Brunson frameworks
**Enhancement Focus:**
- Added SAM persona with specific greeting
- Integrated 3-pillar framework (Past/Present/Future) as mandatory structure
- Added `dennis_context.md` for persistent learning about Dennis's style/phrases/objections
- Connected to Gold Star Direction (North Star positioning)
- Added founder voice frameworks (Kennedy/Brunson/Henry/Halbert)
- Created sales assets reference (what exists, where)
**New Knowledge Files Created:**
1. `sales_strategist_protocol.md` - How SAM operates
2. `gold_star_foundation.md` - North Star positioning extracted
3. `founder_voice_frameworks.md` - Voice + 4 frameworks
4. `sales_assets_reference.md` - Asset inventory
5. `dennis_context.md` - Persistent Dennis learning (grows over time)
**Slash Command Updated:** `/sales-strategist` now starts with SAM greeting
**Mission:**
- Convert combined capacity (founder + Dennis + SAM) into profitable outcomes
- Entry product: $37 mini-course ("AI is coming, prepare your business")
- NOT selling SAM AI product at entry level
- Always serves 3-pillar framework
**Off-Topic Handling:** Answer briefly, then steer back to sales mission
**Guardrails:** Stays on mission, doesn't get hijacked into tech/code questions
**Integration:**
- Works with: `/cmo` (brand strategy), `/cto` (if technical questions arise)
- Receives from: `/cmo` (marketing execution requests), direct user invocation
**Key Innovation:** Dennis context persistence - agent learns Dennis's phrases, objections, and preferences over time
**ROI:** High - enables remote sales strategy work without founder involvement in every session
**User Feedback:** "Need to know it is 'programmed to promote us' not get caught up in sillyness"

### 2026-01-26: sam-architect (SAM's Self-Improvement Architect)
**Pain Point:** After talking to SAM in the live system, user wants to review conversations, analyze what felt "off", and plan improvements to SAM's voice, personality, and capabilities.
**Archetype:** Advisor (Plans improvements, doesn't implement)
**Color:** Magenta (creative, SAM-focused)
**Knowledge Sources:** SAM's personality_framework.md, conversation_engine.md, sam_protocol.md
**Outcome:** Full agent infrastructure with 3 knowledge files + slash command
**Agent Files Created:**
- `agent.json` - Advisor configuration
- `/sam-architect` slash command - User interface
- `sam_architect_protocol.md` - 7-phase workflow (Context → Analysis → Root Cause → Brainstorm → Plan → Handoff → Save)
- `conversation_analysis_framework.md` - Phase-by-phase analysis (Listen, Detect, Adapt, Respond, Remember) + Trait analysis
- `voice_improvement_patterns.md` - 10 common patterns with fixes (robotic greeting, missing empathy, hedging, etc.)
**Mission:** Post-conversation review of SAM interactions, root cause analysis (5 Whys), improvement planning
**Key Capabilities:**
1. **URL Context Awareness** - Can WebFetch URLs like `https://sme.ec/odoo/action-848` to understand what screen user was on
2. **Conversation Quality Scoring** - 1-5 rubric across 6 dimensions (Warmth, Relevance, Voice Match, Confidence, Memory Use, Delegation)
3. **Root Cause Analysis** - 5 Whys methodology applied to voice/personality issues
4. **Pattern Library** - 10 documented common issues with proven fixes
5. **Implementation Handoff** - Creates detailed plans for /sam_chat, /cto-developer, or /sam_core_chat
**Gap Categories Identified:**
1. Voice Pattern Gap - Missing language patterns
2. Mode Detection Gap - Wrong mode triggered
3. Knowledge Gap - Missing information
4. Delegation Gap - Wrong handoff decision
5. Memory Gap - Didn't use/store context
6. Ability Gap - Feature doesn't exist
**Delegation:**
- TO: `/sam_chat` (frontend fixes), `/cto-developer` (backend fixes), `/sam_core_chat` (full experience redesign)
- FROM: User (post-conversation reviews), `/cto` (strategic SAM improvements)
**User Requirements:**
- "Post-conversation review" - Primary trigger
- "Fetch and analyze the page" - URL handling via WebFetch
- "Advisor only" - Plans, doesn't implement
- "/sam-architect" - Command name
**Pattern Innovation:** First agent focused on SAM's self-improvement - analyzes SAM herself rather than building features
**Expected Impact:**
- Systematic SAM improvement process
- URL context awareness (knows what user was looking at)
- Voice consistency maintained (uses same 4 traits, 6 modes framework)
- Clear handoff to implementing agents

---

**End of Session Memory**

**Usage:**
- **DEFAULT MODE:** Read this file before Phase 1 (Discovery)
- **FRESH MODE:** Ignore this file completely (challenge from zero)

**Maintained by:** Recruiter agent (self-updating)
**Last Updated:** 2026-01-26 (Created sam-architect - SAM's self-improvement specialist)
