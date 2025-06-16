import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export default function createRedisClient() {
  return new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null
  });
}
