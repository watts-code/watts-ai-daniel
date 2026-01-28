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

## Business Model (Decided Jan 27)

### Ownership Structure
Blended model combining three stakeholder types:

| Stakeholder | Contribution | Receives |
|-------------|--------------|----------|
| Library owners (Mark, foundations) | Digital content as equity in kind | Ownership stake + royalties |
| Capital providers (Colin, Alex) | Funding | Ownership stake |
| Operators (Justin, Lisbon team) | Development work | Equity/options pool |

### Revenue Model (Spotify-inspired)
- **70%** of subscription revenue to content owners
- Allocation based on **listening hours** (actual user consumption)
- Cross-library usage tracked precisely for fair splits
- Royalties paid separately for immediate cash flow

### Subscription Pricing
| Tier | Price | Description |
|------|-------|-------------|
| Single library | $7/month | Access to one philosopher |
| All-access bundle | $15-17/month | All libraries |

Market comps: Blinkist, Gaia, Audible, Headspace ($12-18 range)

---

## Platform Vision: Wisdom Library

**Core Concept:** Premium subscription service aggregating philosophical voices into conversational AI experiences.

**Key Features:**
- AI personas of luminaries (Watts, Chopra, Ram Dass, Huxley)
- "River guides" (AI curators like "Samantha") for content discovery
- Multi-luminary dialogues (simulated conversations between figures)
- Near-zero latency querying entire content library
- User listening pattern tracking for personalization
- Source prioritization (users can select/deselect content sources)

**Differentiators:**
- Verified, high-fidelity original recordings
- Exclusive content (Esalen archives, unreleased tapes)
- Authentic source material vs. generic AI-generated content
- Fast, context-rich responses anchored in real material

---

## How This Fits Together

**Permian's Role:**
- Justin building MVP (target: end of February)
- Platform architecture, AI query system, user experience
- Business development with foundations (Alex)

**Mark Watts' Role:**
- Content source (Watts archives, Human Potential Audio Foundation)
- Gateway to other foundations (Ram Dass, Campbell)
- Quality control and authenticity assurance

**AIC's Role:**
- Colin: Capital provider, AI technology inputs, proprietary data insights
- Daniel: Study loop methodology for prompt quality scoring

**Lisbon Team's Role:**
- Content digitization and animation
- Archive management tools
- Production acceleration

---

*Last Updated: January 27, 2026*
