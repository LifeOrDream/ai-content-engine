export interface BlueprintSummary {
  id: string;
  file: string;
  title: string;
  genre?: string;
  logline: string;
  targetSeconds: number;
  minSeconds: number;
  countdown: string;
  cta: string;
  cast: string[];
  updatedAt: string;
}

export interface BlueprintDocument extends BlueprintSummary {
  body: string;
  raw: string;
}

export interface PublicJob {
  id: string;
  blueprintId: string;
  jobType: "script" | "render";
  command: string[];
  status: "running" | "success" | "failed" | "killed";
  pid?: number;
  startedAt: string;
  endedAt?: string;
  exitCode?: number | null;
  signal?: string | null;
  logTail: string[];
}

export interface RunStageRecord {
  id: string;
  kind: string;
  label: string;
  status: "pending" | "running" | "success" | "failed" | "skipped";
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  model?: string;
  command?: string[];
  outputFiles?: string[];
  notes?: string[];
  error?: string;
}

export interface RunArtifactRecord {
  kind: "script" | "json" | "image" | "video" | "audio" | "subtitle" | "log" | "prompt";
  label: string;
  path: string;
  bytes?: number;
  createdAt: string;
}

export interface RunReferenceRecord {
  sequence: number | string;
  kind: "character" | "country" | "asset" | "environment-chain" | "unknown";
  ref: string;
  label?: string;
  repoPath?: string;
  status: "ready" | "planned" | "missing";
}

export interface RunFalRequestRecord {
  stageId: string;
  model: string;
  requestId?: string;
  outputUrl?: string;
  sequence?: number | string;
  createdAt: string;
  durationSecs?: number;
  resolution?: string;
}

export interface RunManifest {
  version: 1;
  blueprintId: string;
  title: string;
  logline?: string;
  createdAt: string;
  updatedAt: string;
  gitCommit?: string;
  targetSeconds?: number;
  stages: RunStageRecord[];
  artifacts: RunArtifactRecord[];
  references: RunReferenceRecord[];
  falRequests: RunFalRequestRecord[];
  subtitles: RunArtifactRecord[];
  costEstimate?: {
    currency: "USD";
    llmCalls: number;
    imageCalls: number;
    videoCalls: number;
    videoSeconds: number;
    estimatedUsd: number;
    assumptions: string[];
  };
  quality?: {
    dialogueScore?: number;
    flaggedDialogue?: number;
    dialogueLines?: number;
    spokenSeconds?: number;
    dialogueAvailableSeconds?: number;
    dialogueOccupancyPct?: number;
    startFrameCount?: number;
    endFrameCount?: number;
    totalRefs?: number;
    missingStartFrames?: Array<number | string>;
    missingRefs?: Array<number | string>;
  };
}

export interface RunSummary {
  id: string;
  title: string;
  updatedAt: string;
  passFiles: string[];
  passCount: number;
  hasScenes: boolean;
  videos: string[];
  activeJobs: string[];
  status: "running" | "ready" | "partial" | "empty";
}

export interface DialogueHealthLine {
  sequence: number | string;
  shot: number | string;
  speaker: string;
  line: string;
  delivery?: string;
  seconds: number;
  wordCount: number;
  minWords: number;
  estimatedSeconds: number;
  occupancyPct: number;
  maxWords: number;
  flags: string[];
}

export interface RunDetail extends RunSummary {
  allFiles: string[];
  manifest: RunManifest | null;
  scenesSummary: null | {
    totalSeconds: number;
    sequenceCount: number;
    shotCount: number;
    endCard?: unknown;
    look: string;
    firstSequences: Array<{
      n: number | string;
      label?: string;
      durationSec?: number;
      location?: string;
      characters: Array<{ name?: string; refTag?: string; state?: string }>;
      hasStartFrame: boolean;
      startRefs: string[];
      hasEndFrame: boolean;
    }>;
  };
  dialogueHealth: null | {
    lineCount: number;
    totalWords: number;
    avgWords: number;
    flaggedCount: number;
    score: number;
    spokenSeconds: number;
    availableSeconds: number;
    occupancyPct: number;
    lines: DialogueHealthLine[];
  };
  frameHealth: null | {
    sequenceCount: number;
    startFrameCount: number;
    endFrameCount: number;
    totalRefs: number;
    missingStartFrames: Array<string | number>;
    missingRefs: Array<string | number>;
  };
}
