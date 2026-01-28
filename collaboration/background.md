# Project Background

Context and history for the Watts / Philosophe AI collaboration.

---

## Mark Watts' Existing Projects

From Mark Watts' Jan 19, 2026 email:

| Project | Description |
|---------|-------------|
| **AI Social Media Imposters** | Defensive strategies with YouTube/Google against unauthorized AI impersonators |
| **Roundtable** | Dialoging tool creating conversations between archived figures (Watts, Huxley, McKenna) |
| **Drift** | Gamified audio adventure game set on rafts in a flooded future world |
| **Archival Audio Work** | Re-transferring classics with new Nagra playback deck |
| **Animated Bio Film** | Half-hour production in development |

### Audio Archive Details
- Mark recently acquired high-quality Nagra playback deck for archival work
- Has ~50 new recordings (many Q&A sessions) needing audio upgrade work
- Working with Lisbon team on digital assets dialoging tool

---

## Comparable Models

**XG University** (xguniversity.com)
- Similar concept using public domain historical figures (Socrates, Jefferson) as AI chat personas
- Reference for what's possible with persona-based AI

---

## AIC's Technical Contribution

### Original Prototype (watts-demo)

Working prototype of Alan Watts AI chatbot running locally via Ollama:

**Hardware:**
- M4 Max MacBook Pro, 36GB RAM
- Local inference capability

**Tech Stack:**
- Next.js app with local LLM inference
- Primary model: llama3
- Testing: nemotron-3-nano:30b

**Persona Engineering Achievements:**
- Short responses (1-2 sentences) that challenge the premise
- "Pondering" section where AI thinks before responding
- Eliminated self-help patterns ("cultivate", "practice", etc.)

**Sample Responses:**
| User Input | AI Response |
|------------|-------------|
| "How do I find peace?" | "You can't find what was never lost!" |
| "I work 60 hours and I'm exhausted" | "The only thing you can exhaust is your own attention!" |
| "I'm afraid of dying" | "Death is the ultimate non-starter!" |

### Current Contribution (watts-ai-daniel)

Evolved the prototype into a study loop methodology:
- Three-gate scoring system (Form, Helpfulness, Engagement)
- Multi-dimensional testing to prevent regression/overfitting
- Key insight: Brevity was the enemy of helpfulness
- Live demo: https://watts.jettaintelligence.com

---

## How This Fits Together

**Open Questions (Pre-Meeting Jan 27):**
1. How does AIC's technical work complement Mark Watts' existing projects?
2. Is the goal to support Mark's efforts or build something separate?
3. Access to legacy audio materials for training/transcription?

**Post-Meeting Understanding:**
- Permian has their own implementation (watts-ai repo)
- philosophe-ai is the multi-guru expansion platform
- AIC contribution is the study loop methodology for prompt quality

---

*Last Updated: January 27, 2026*
