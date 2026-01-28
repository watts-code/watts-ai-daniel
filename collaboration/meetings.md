# Meeting Log

---

## Meeting: Philosophe AI Project Intro

**Date:** Tuesday, January 27, 2026
**Time:** 1:30 PM - 2:00 PM CST
**Attendees:** Daniel Shanklin, Justin Charles, Winnie Makama, Jack Quinlan, Collin Bird

**Status:** COMPLETED

### Post-Meeting Outcomes

**Repo Access Granted:**
- https://github.com/watts-code/watts-ai (develop branch)
- https://github.com/philosophe-ai/philosophe-ai (empty - "Multi guru content exploration platform")

**Permian's Tech Stack (watts-ai):**

| Component | Technology |
|-----------|------------|
| Backend | FastAPI (Python 3.13) |
| Frontend | Next.js 15 + shadcn/ui |
| AI | Vercel AI SDK -> Amazon Bedrock (Claude Sonnet 3.5) |
| Vector Search | Weaviate |
| Auth | Clerk |
| Database | PostgreSQL + Prisma |
| Hosting | Vercel + Render + AWS |

**AIC Contribution:**
- Created https://github.com/watts-code/watts-ai-daniel
- Study loop methodology for prompt quality scoring
- Three-gate system: Form, Helpfulness, Engagement
- Multi-dimensional testing to prevent regression/overfitting

### Full Transcript Notes

**Recording received:** January 28, 2026

#### Introductions & Background
- Justin Charles: Lives in Dallas, went to Davidson College (knew Steph Curry's orbit)
- Jack Quinlan: Joining from DC, moving to Dallas in 2 weeks
- Daniel: 4 months at AIC, previously hedge fund trader/accountant, startups, ticket arbitrage in Vegas

#### Daniel's Demo
- Showed https://watts.jettaintelligence.com - similar Alan Watts chat concept
- Technology page documents study loops and reinforcement learning approach
- Uses Claude Code to score responses iteratively and boost system prompts

#### Technical Discussion

**Daniel's RAG expertise:**
- Explained RRF (Reciprocal Rank Fusion) - combines keyword, dense vector, and sparse vector search
- Shared Google paper showing dense vectorization breaks past ~100 rows
- Ensemble techniques required for production quality
- AIC uses PostgreSQL + PG Vector for 90% of work

**On Weaviate vs Postgres:**
- Justin: "Weaviate works really well, didn't want to mess with it"
- Daniel: "My opinion - put everything in the same server, better for AI"
- Justin: "Can you help us port from Weaviate to Postgres?"

**On transcription:**
- Justin: Using Amazon Transcribe, chunking into 5-sentence blocks
- Daniel: "Do you have a glossary during transcription?"
- Explained AIC's glossary system for entity recognition (e.g., "SPY" = S&P 500)
- Glossary improves transcription accuracy for domain terms

**On token tracking:**
- Daniel: Built "Artemis" - middleware that logs all AI calls by app/user
- Routes to Anthropic, OpenAI, or OpenRouter
- "It's an odometer for your AI"
- Justin: "That would be very helpful if you can share"

#### Collaboration Model

**GitHub-first workflow:**
- Daniel: "I made a repo of my rental house with my tenant to negotiate the contract"
- "Cursor vs Claude Code - this is the new way we work"
- Agreement to add Daniel to watts-ai GitHub

**Project management:**
- Justin mentioned Linear, Daniel mentioned AIC uses GitHub Issues + Projects
- Custom MCP reads/writes to GitHub Issues
- "Literally be like, go rip on this whole project"

#### Daniel's Ask: Rhea Impact

> "I'd be happy to help you guys with this. My thing is I've started this month, been around for a year. But I just were one of those robots, you know that 1X Neo."

Explained nonprofit model:
- Put robot in nonprofit
- Tech volunteers take it to homes (disabled vets, single moms)
- "Easy to get volunteers because they all want to work with the robot"
- Cold pitch: Help spread the word in DFW, he'll help with Philosophe project

#### Next Steps Agreed

1. Add Daniel to watts-ai GitHub repo
2. Add Daniel to philosophe-ai repo when created
3. Schedule 30-min tech session:
   - GitHub MCP demo
   - RAG/chunking/vectorization best practices
   - Porting from Weaviate to Postgres
4. Daniel to share:
   - RRF hybrid search algorithm
   - Artemis token tracking approach
   - Study loop methodology

#### Key Quotes

> "It's like Elon said, there's no IP anymore. There's just speed." - Daniel

> "The more you put everything in the same server, the better off you are in AI." - Daniel

> "We're trying to figure out how we do this with minimal humans." - Justin

---

## Meeting: Business Structure Discussion

**Date:** Monday, January 27, 2026
**Time:** 2:00 PM PT / 4:00 PM CT
**Attendees:** Alex Duran, Mark Watts, Ameeth Sankaran, Justin, Colin Bird, Jack

**Status:** COMPLETED

### Ownership & Revenue Model

**Blended Ownership Structure:**
- Library owners contribute digital content as equity in kind
- Capital providers (Colin, Alex) supply funding and receive ownership
- Operators/developers (Justin, Lisbon team) receive equity or options pools

**Royalty Model (Spotify-inspired):**
- 70% of subscription revenue to content owners based on listening hours
- Tracks cross-library usage to define royalty splits
- Royalties paid separately for immediate cash flow

**Subscription Pricing:**
| Tier | Price | Notes |
|------|-------|-------|
| Single library | $7/month | One philosopher |
| Bundled access | $15-17/month | All-access |

Market comps: Blinkist, Gaia, Audible, Headspace ($12-18 range)

### Content Strategy

**Target Libraries:**
- Alan Watts (Mark Watts)
- Deepak Chopra
- Ram Dass (Raghu Agarwal contact)
- Aldous Huxley
- Campbell Foundation
- Human Potential Audio Foundation (Esalen archives, rare cassettes)

**Key Differentiators:**
- Verified, high-fidelity content from original recordings
- Rare/exclusive materials (Esalen recordings, unreleased tapes)
- AI-simulated conversations between figures who never met
- Near-zero latency querying entire library
- "River guides" (AI curators like "Samantha") for discovery

**Content Protection:**
- Cautious about voice cloning and unauthorized use
- Defensive strategies against YouTube/motivational misappropriation
- Non-exclusive licenses for flexibility

### Technology

**Justin's System:**
- Siloed, targeted AI-driven library query
- Natural interaction with content and AI personas
- User listening pattern tracking for personalization
- Multi-luminary dialogue capability
- Users can prioritize/deselect content sources

**Lisbon AI Integration:**
- Content digitization acceleration
- Animation capabilities (Japanese woodcut art demo)
- Archive management tools

**MVP Target:** End of February (website + domain)

### Action Items

| Person | Action |
|--------|--------|
| **Alex Duran** | Finalize framework agreement with Mark; reach out to Ram Dass foundation; coordinate with Ameeth on Chopra agreements |
| **Mark Watts** | Refine framework details; engage Ram Dass and Campbell foundations on terms |
| **Ameeth Sankaran** | Legal aspects of IP licensing; review ownership/royalty structure |
| **Justin** | MVP by end of February; coordinate tech meeting with Alex/Jack; circulate advisor candidate list |
| **Colin Bird** | Support with AI technology inputs, proprietary data insights, user interaction design |

### AIC's Role Clarified

Colin to support with:
- AI technology inputs
- Proprietary data insights
- User interaction design

*Daniel/AIC technical contribution: Study loop methodology for prompt quality*

---

*Add new meetings above this line*
