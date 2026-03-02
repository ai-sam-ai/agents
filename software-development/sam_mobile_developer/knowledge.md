# SAM Mobile Developer - Registry Knowledge

## Quick Reference
- **Command:** `/sam_mobile_developer`
- **Archetype:** Implementer
- **Scope:** SAM AI mobile app (Flutter/Dart)
- **App Path:** `D:\github_repos\04_samai_user_experience\sam_ai_mobile\`
- **Backend:** ai_sam_mcp (`D:\github_repos\04_samai_user_experience\ai_sam_mcp\`)
- **Based On:** https://github.com/daodao97/chatmcp (Flutter MCP client)

## What This Agent Does
Builds and maintains the SAM AI mobile app — a branded Flutter app that lets clients text and voice-chat with SAM from their phone. Forked from chatmcp (open-source MCP client), stripped to essentials, rebranded as SAM AI, connected to ai_sam_mcp backend via REST.

## Phased Roadmap
1. **Text Chat MVP** — Fork, strip, rebrand, connect, text chat works
2. **Voice Layer** — STT (speech_to_text) + TTS (flutter_tts)
3. **Driving Mode** — Hands-free UI, auto-listen, minimal touch
4. **Multi-Client** — OAuth2, multi-workspace, App Store/Play Store

## Key Knowledge Files (Local)
- `chatmcp_architecture.md` — Fork strategy, project structure, what to keep/strip/add
- `mcp_integration.md` — ai_sam_mcp endpoints, auth, REST connection pattern
- `mobile_app_strategy.md` — Phased roadmap, tech decisions, UI/UX guidelines

## Boundaries
- **IN scope:** Flutter/Dart code, MCP/REST integration, voice, mobile UX
- **OUT of scope:** Odoo backend changes, ai_sam_mcp module dev, server infra, App Store submissions
