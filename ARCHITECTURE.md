# Watts Demo - Architecture Plan v2

## Project Overview
Real-time conversational AI video chat experience with Alan Watts. Licensed by the Alan Watts Organization.

## Target Experience
"Zoom call with Alan Watts" - user speaks, Alan listens with natural presence, responds with voice + visual avatar in real-time. Must feel like conversation, not chatbot.

---

## Critical Design Decisions

### 1. Single Transport from Day 1
Use **LiveKit** from Phase 1 (not Vapi) to avoid:
- Transport swap pain in Phase 2
- Double WebRTC stacks on mobile (echo, battery drain)
- Vendor lock-in on barge-in behavior

### 2. Latency Budget (<800ms mouth-to-ear)
| Stage | Target | Notes |
|-------|--------|-------|
| VAD | <50ms | Client-side detection |
| STT | 100-200ms | Streaming with partials |
| LLM TTFT | 100-250ms | GPT-4o-mini for speed |
| TTS First Audio | 80-150ms | ElevenLabs streaming |
| Network | 50-120ms | Edge deployment |
| **Total** | **380-770ms** | Within budget |

### 3. Barge-in is Non-Negotiable
- Monitor user inbound energy + STT partials
- Immediately cancel TTS on interrupt
- Visual state change within 100ms
- No "uh-huh" backchannels (uncanny)

### 4. RAG Cannot Block
- Prefetch quotes when user starts speaking
- Use topic chips + depth slider as hints
- Inject citations after first 0.5-1s of speech
- Cache per-session quotes

---

## Phase 1: Voice-Only MVP (Week 1-2)

### Goal
Validate conversational experience with full latency pipeline.

### Tech Stack
```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│  Next.js 14 + Tailwind + LiveKit React SDK              │
│  - WebRTC audio (single session)                        │
│  - VAD with AudioWorklet                                │
│  - Waveform visualization                               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   LiveKit Cloud                          │
│  - Single room per session                              │
│  - Bidirectional audio track                            │
│  - Region selection (geolocation)                       │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Pipecat / livekit-agents                    │
│  Hosted on Fly.io (multi-region)                        │
│                                                          │
│  ┌─────────┐   ┌─────────┐   ┌─────────────────────┐   │
│  │ Deepgram│──▶│ GPT-4o  │──▶│ ElevenLabs          │   │
│  │ Nova-2  │   │ mini    │   │ (Watts clone)       │   │
│  │ STT     │   │ + RAG   │   │ w/ alignment        │   │
│  └─────────┘   └─────────┘   └─────────────────────┘   │
│       │                              │                   │
│       └──────── Barge-in ───────────┘                   │
│                (cancel TTS)                              │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Supabase                              │
│  - pgvector for Watts content RAG                       │
│  - Session/turn storage                                 │
│  - Latency metrics                                      │
└─────────────────────────────────────────────────────────┘
```

### Core Features
- [ ] LiveKit room with bidirectional audio
- [ ] Deepgram streaming STT (endpointing ~200ms)
- [ ] GPT-4o-mini with streaming (fast TTFT)
- [ ] ElevenLabs TTS with phoneme alignment
- [ ] Barge-in detection + TTS cancel
- [ ] "Zoom-like" UI (user camera + Alan placeholder)
- [ ] Depth slider (Casual → Mind-bending)
- [ ] Topic chips (Ego, Death, Anxiety, etc.)
- [ ] Insight bookmarks
- [ ] End-of-session summary (Claude for quality)
- [ ] Per-stage latency instrumentation
- [ ] Device preflight check (mic/speaker test)

### Mobile Considerations
- Push-to-talk primary (toggle for voice activation)
- Big mic button, clear mute state, haptics
- iOS Safari: user gesture for audio, COOP/COEP headers
- Preflight: mic/speaker loopback + RTT estimate

---

## Phase 2: 2D Avatar Integration (Week 3-4)

### Goal
Add visual presence without changing transport.

### Tech Stack Addition
- **Avatar**: D-ID Agents or Tavus (evaluate both)
- **Lip Sync**: Drive from same TTS stream (no re-synthesis)
- **Video**: Add video track to existing LiveKit room

### Key Constraint
Avatar must accept external audio stream with low delay and expose alignment hooks, OR render client-side from TTS phoneme timings.

### Features
- [ ] Streaming avatar in "Alan tile"
- [ ] Subtle idle animations (breathing, glances)
- [ ] Head nods while "listening" (from STT partials)
- [ ] Environment background shifts by topic
- [ ] Visual state change on barge-in (<100ms)

---

## Phase 3: 3D WebGL Avatar (Month 2-3)

### Goal
Eliminate per-minute avatar costs, increase immersion.

### Tech Stack
- **3D Framework**: Three.js (lighter than Unity WebGL on iOS)
- **Avatar**: Ready Player Me or custom Watts model
- **Lip Sync**: Phoneme-to-viseme from ElevenLabs alignment
- **Animation**: Idle loops, emotion-reactive expressions

### Performance Targets
- 30 FPS on mobile
- Limited draw calls
- Small texture budget
- 2D fallback for low-end devices

### Features
- [ ] 3D Alan in themed environment
- [ ] Camera movements (dolly in on questions)
- [ ] Floating "thought pool" of past questions
- [ ] Depth visualization (mandala/spiral)

---

## Phase 4: Premium Experience (Month 4+)

### Goal
High-fidelity option for premium tier ($3-5/session).

### Tech Stack
- **Rendering**: Unreal MetaHuman via Pixel Streaming
- **Deployment**: AWS g4dn or Arcware
- **Latency**: Expect +150-250ms glass-to-glass

### Critical Design
Keep voice path decoupled from render stream - mouth-to-ear stays low even if video lags.

---

## Data Architecture

### Supabase Schema
```sql
-- User sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  mood_before TEXT,
  depth_level TEXT DEFAULT 'reflective',
  summary JSONB,
  livekit_room_name TEXT,
  livekit_region TEXT,
  deleted_at TIMESTAMPTZ
);

-- Conversation turns with latency metrics
CREATE TABLE turns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions,
  role TEXT CHECK (role IN ('user', 'alan')),
  content TEXT,
  audio_url TEXT,
  timestamp_ms INTEGER,
  bookmarked BOOLEAN DEFAULT FALSE,

  -- Latency instrumentation
  latency_ms INTEGER,
  meta JSONB, -- {vad_ms, stt_ms, llm_ttft_ms, tts_ttfb_ms, barge_in: bool, stt_confidence: float}

  deleted_at TIMESTAMPTZ
);

-- Watts content for RAG
CREATE TABLE watts_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT,
  source_type TEXT CHECK (source_type IN ('lecture', 'book', 'interview', 'essay')),
  content TEXT,
  embedding VECTOR(1536),
  embedding_model TEXT DEFAULT 'text-embedding-3-small',
  embedding_dim INTEGER DEFAULT 1536,
  metadata JSONB,
  deleted_at TIMESTAMPTZ
);

-- Indexes for RAG
CREATE INDEX watts_content_embedding_idx ON watts_content
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- User journey tracking
CREATE TABLE journey_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  topic TEXT,
  visit_count INTEGER DEFAULT 1,
  last_visited TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Latency analytics (aggregated)
CREATE TABLE latency_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions,
  avg_total_ms INTEGER,
  p95_total_ms INTEGER,
  avg_stt_ms INTEGER,
  avg_llm_ttft_ms INTEGER,
  avg_tts_ttfb_ms INTEGER,
  barge_in_count INTEGER,
  turn_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Routes

```
POST /api/session/start      - Init session, return LiveKit token + region
POST /api/session/end        - End session, generate summary
POST /api/turn/bookmark      - Mark a moment
POST /api/rag/search         - Search Watts content (internal)
POST /api/rag/prefetch       - Prefetch quotes by topic (async)

GET  /api/voice/config       - Returns:
                               - LiveKit token (region-scoped)
                               - Model IDs (STT, TTS, LLM)
                               - Tunables (endpointing_ms, vad_threshold,
                                          max_tts_chunk, interrupt_policy)

POST /api/metrics/latency    - Store per-turn latency breakdown
GET  /api/preflight/check    - RTT probe for region selection
```

---

## Voice Pipeline Configuration

### Deepgram (STT)
```json
{
  "model": "nova-2",
  "language": "en",
  "smart_format": true,
  "interim_results": true,
  "endpointing": 200,
  "vad_events": true,
  "profanity_filter": false
}
```

### GPT-4o-mini (LLM)
```json
{
  "model": "gpt-4o-mini",
  "temperature": 0.6,
  "max_tokens": 500,
  "stream": true
}
```

### ElevenLabs (TTS)
```json
{
  "voice_id": "<watts-clone-id>",
  "model_id": "eleven_turbo_v2_5",
  "output_format": "pcm_24000",
  "optimize_streaming_latency": 4,
  "enable_ssml_parsing": false,
  "alignment": true
}
```

---

## Cost Estimates (Updated)

### Phase 1 (Voice-Only)
| Service | Cost | Notes |
|---------|------|-------|
| LiveKit Cloud | ~$0.004/min | Audio only |
| Deepgram Nova-2 | ~$0.0043/min | Streaming |
| GPT-4o-mini | ~$0.01/min | ~2K tokens/turn |
| ElevenLabs | ~$0.03/min | Turbo v2.5 |
| Supabase | $25/mo | Pro plan |
| Fly.io | $20-50/mo | Pipecat hosting |
| Vercel | $20/mo | Frontend |
| **Per session (10 min)** | **~$0.50-1.00** | |

### Phase 2 (2D Avatar)
| Additional | Cost | Notes |
|------------|------|-------|
| D-ID/Tavus | ~$0.30-1.00/min | Streaming avatar |
| **Per session (10 min)** | **~$3.50-11.00** | |

### Phase 3 (WebGL)
- Back to Phase 1 costs (no per-minute avatar)
- **Per session (10 min)**: ~$0.50-1.00

---

## UX Design Principles

### Feel Like Conversation, Not Chatbot

1. **Turn-taking cues**
   - Visual "listening" state (subtle breathing/head tilt)
   - "Speaking" state (lip motion)
   - State change within 100ms of barge-in

2. **Waveform feedback**
   - Thin live waveform shows input is heard
   - Avoid big ASR text walls during speech
   - Full text appears after turn complete

3. **Semantic prefaces**
   - Consistent, in-character micro-prefaces on first LLM tokens
   - "You know, when we say 'I'…"
   - Keeps under latency budget while content generates

4. **Depth slider behavior**
   - Treat as bias that decays over 2-3 turns
   - Not a hard switch per-turn
   - Log depth at turn-level for analysis

5. **Topic chips**
   - Retrieval boost, not hard constraint
   - Prefetch quotes, set light intent
   - Don't force assistant to ignore follow-ups

6. **Mobile-first**
   - Push-to-talk primary
   - Big mic button, clear mute state
   - Haptics on press/release
   - Preflight check before joining

---

## Open Questions (Need Answers)

1. **Primary geographies for early users?**
   - Affects LiveKit + Deepgram region selection

2. **Can we prototype with stock voice first?**
   - Measure pipeline latency before Watts clone

3. **GPT-4o-mini for speed, Claude for summaries?**
   - Hybrid approach viable?

4. **Store raw audio for QA/training?**
   - With user consent, or only transcripts?

5. **Content licensing specifics?**
   - Which lectures/books approved for RAG?

6. **Session pricing model?**
   - Free tier? Per-minute vs per-session?

---

## Next Steps

### Week 1
1. [ ] Set up Next.js project with Tailwind
2. [ ] Configure Supabase project + schema
3. [ ] Set up LiveKit Cloud account
4. [ ] Deploy Pipecat service on Fly.io
5. [ ] Integrate Deepgram STT
6. [ ] Integrate ElevenLabs TTS (stock voice first)
7. [ ] Build basic "call" UI with user camera tile
8. [ ] Implement per-stage latency instrumentation
9. [ ] Device preflight page

### Week 2
1. [ ] Add barge-in detection + TTS cancel
2. [ ] Integrate GPT-4o-mini with streaming
3. [ ] Add depth slider + topic chips
4. [ ] Implement RAG prefetch (non-blocking)
5. [ ] Add insight bookmarks
6. [ ] End-of-session summary
7. [ ] Mobile testing (iOS Safari, Android Chrome)
8. [ ] Latency optimization pass

---

## References

- [LiveKit Documentation](https://docs.livekit.io/)
- [Pipecat Framework](https://github.com/pipecat-ai/pipecat)
- [Deepgram Streaming API](https://developers.deepgram.com/docs/streaming)
- [ElevenLabs API](https://elevenlabs.io/docs/api-reference)
- [livekit-agents](https://github.com/livekit/agents)
