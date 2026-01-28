// Session types
export interface Session {
  id: string;
  userId?: string;
  startedAt: Date;
  endedAt?: Date;
  moodBefore?: MoodType;
  depthLevel: DepthLevel;
  summary?: SessionSummary;
  livekitRoomName: string;
  livekitRegion: string;
}

export interface SessionSummary {
  keyInsights: string[];
  quotesUsed: QuoteCitation[];
  reflection: string;
}

// Turn types
export interface Turn {
  id: string;
  sessionId: string;
  role: 'user' | 'alan';
  content: string;
  audioUrl?: string;
  timestampMs: number;
  bookmarked: boolean;
  latencyMs?: number;
  meta?: TurnMeta;
}

export interface TurnMeta {
  vadMs?: number;
  sttMs?: number;
  llmTtftMs?: number;
  ttsTtfbMs?: number;
  bargeIn?: boolean;
  sttConfidence?: number;
}

// Depth levels
export type DepthLevel = 'casual' | 'reflective' | 'profound' | 'mind-bending';

// Mood types for "how are you feeling" wheel
export type MoodType =
  | 'calm'
  | 'restless'
  | 'curious'
  | 'lost'
  | 'joyful'
  | 'grieving'
  | 'anxious'
  | 'hopeful';

// Topic types
export type TopicType =
  | 'ego'
  | 'death'
  | 'anxiety'
  | 'creativity'
  | 'relationships'
  | 'non-duality'
  | 'religion'
  | 'psychedelics'
  | 'nature'
  | 'music';

// RAG types
export interface WattsContent {
  id: string;
  source: string;
  sourceType: 'lecture' | 'book' | 'interview' | 'essay';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface QuoteCitation {
  quote: string;
  source: string;
  sourceType: string;
  chapter?: string;
}

export interface RAGSearchResult {
  content: WattsContent;
  similarity: number;
}

// Voice config types
export interface VoiceConfig {
  livekitToken: string;
  livekitUrl: string;
  livekitRegion: string;
  models: {
    stt: string;
    tts: string;
    llm: string;
  };
  tunables: VoiceTunables;
}

export interface VoiceTunables {
  endpointingMs: number;
  vadThreshold: number;
  maxTtsChunk: number;
  interruptPolicy: 'aggressive' | 'balanced' | 'conservative';
}

// Call state
export type CallState =
  | 'idle'
  | 'connecting'
  | 'preflight'
  | 'connected'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'error'
  | 'ended';

// Preflight check results
export interface PreflightResult {
  micPermission: boolean;
  speakerPermission: boolean;
  estimatedRttMs: number;
  recommendedRegion: string;
  warnings: string[];
}

// Latency metrics
export interface LatencyMetrics {
  sessionId: string;
  turnId: string;
  vadMs: number;
  sttMs: number;
  llmTtftMs: number;
  ttsTtfbMs: number;
  totalMs: number;
  bargeIn: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SessionStartResponse {
  sessionId: string;
  voiceConfig: VoiceConfig;
}

export interface SessionEndResponse {
  summary: SessionSummary;
  stats: {
    durationMs: number;
    turnCount: number;
    avgLatencyMs: number;
    p95LatencyMs: number;
  };
}
