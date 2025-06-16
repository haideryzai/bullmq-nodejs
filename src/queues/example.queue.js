import { Queue, Worker, QueueEvents } from "bullmq";
import createRedisClient from "../redisClient.js";

const redis = createRedisClient();

export const exampleQueue = new Queue("exampleQueue", {
    connection: redis,
});

export async function addExampleJob(data) {
    await exampleQueue.add("processExample", data);
}

export const exampleWorker = new Worker(
    "exampleQueue",
    async (job) => {
        console.log(`🧩 Processing job ${job.id}:`, job.data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { result: "done" };
    },
    { connection: redis }
);


const queueEvents = new QueueEvents("exampleQueue", { connection: redis });

queueEvents.on("completed", ({ jobId }) => {
    console.log(`✅ Job ${jobId} completed`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
    console.log(`❌ Job ${jobId} failed: ${failedReason}`);
});
