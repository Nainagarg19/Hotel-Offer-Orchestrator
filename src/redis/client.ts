import { Redis } from "ioredis";

const redisHost = process.env.REDIS_HOST ?? "localhost";
const redisPort = Number(process.env.REDIS_PORT ?? "6379");

export const redis = new Redis({
  host: redisHost,
  port: redisPort,
});
