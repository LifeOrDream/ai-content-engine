export interface BlueprintSummary {
  id: string;
  file: string;
  title: string;
  logline: string;
  targetSeconds: number;
  minSeconds: number;
  countdown: string;
  cta: string;
  cast: string[];
  updatedAt: string;
}

export interface PublicJob {
  id: string;
  blueprintId: string;
  command: string[];
  status: "running" | "success" | "failed" | "killed";
  pid?: number;
  startedAt: string;
  endedAt?: string;
  exitCode?: number | null;
  signal?: string | null;
  logTail: string[];
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
  flags: string[];
}

export interface RunDetail extends RunSummary {
  allFiles: string[];
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
