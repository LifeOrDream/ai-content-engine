import "dotenv/config";
import { Worker } from "bullmq";
import { CONTENT_ENGINE_QUEUE, type ContentEngineJobPayload } from "./contracts.js";
import { createRedisConnection, closeRedisConnection } from "./redis.js";
import { activeModel } from "./llm.js";
import { processContentEngineJob } from "./processor.js";

const concurrency = Math.max(1, Number(process.env.CONTENT_ENGINE_WORKER_CONCURRENCY || 2));
const connection = createRedisConnection();

const worker = new Worker<ContentEngineJobPayload>(
  CONTENT_ENGINE_QUEUE,
  async (job) => {
    console.log(`[content-engine] ${job.name || job.data.kind} #${job.id}`);
    return processContentEngineJob(job.data as ContentEngineJobPayload, {
      // Media jobs (nft.*) report per-stage progress; backends listen via
      // QueueEvents("…").on("progress") and map stages to their own events.
      onProgress: (update) => job.updateProgress(update),
    });
  },
  { connection: connection as any, concurrency },
);

worker.on("ready", () => {
  console.log(
    `[content-engine] worker ready queue=${CONTENT_ENGINE_QUEUE} concurrency=${concurrency} model=${activeModel()}`,
  );
});

worker.on("completed", (job) => {
  console.log(`[content-engine] completed ${job.name || job.data.kind} #${job.id}`);
});

worker.on("failed", (job, error) => {
  console.warn(
    `[content-engine] failed ${job?.name || job?.data?.kind || "job"} #${job?.id}: ${error?.message || error}`,
  );
});

worker.on("error", (error) => {
  console.warn(`[content-engine] worker error: ${error?.message || error}`);
});

async function shutdown(): Promise<void> {
  console.log("[content-engine] shutting down");
  await worker.close();
  await connection.quit();
  await closeRedisConnection();
}

process.on("SIGINT", () => shutdown().finally(() => process.exit(0)));
process.on("SIGTERM", () => shutdown().finally(() => process.exit(0)));
