import { Queue } from "bullmq";

const redisPort = Number(
  process.env.UPSTASH_REDIS_PORT || process.env.VALKEY_PORT || 6379,
);

const queue = new Queue("hackathon-emails", {
  connection: {
    host: process.env.UPSTASH_REDIS_HOST || process.env.VALKEY_HOST || "valkey",
    port: Number.isNaN(redisPort) ? 6379 : redisPort,
    username: process.env.UPSTASH_REDIS_USERNAME,
    password: process.env.UPSTASH_REDIS_PASSWORD || process.env.VALKEY_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  },
});

export { queue as hackathonTeamEmailQueue };
