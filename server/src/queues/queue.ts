import { Queue } from "bullmq";

const redisPort = Number(
  process.env.UPSTASH_REDIS_PORT || process.env.VALKEY_PORT || 6379,
);

const redisConfig = {
  host: process.env.UPSTASH_REDIS_HOST || process.env.VALKEY_HOST || "valkey",
  port: Number.isNaN(redisPort) ? 6379 : redisPort,
  username: process.env.UPSTASH_REDIS_USERNAME,
  password: process.env.UPSTASH_REDIS_PASSWORD || process.env.VALKEY_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// Lazy initialize queue to reduce memory footprint
let queue: Queue | null = null;

export function getHackathonTeamEmailQueue(): Queue {
  if (!queue) {
    queue = new Queue("hackathon-emails", {
      connection: redisConfig,
    });
  }
  return queue;
}

// Graceful cleanup for serverless
export async function closeQueue(): Promise<void> {
  if (queue) {
    await queue.close();
    queue = null;
  }
}
