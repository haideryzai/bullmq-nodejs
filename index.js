import express from "express";
import dotenv from "dotenv";
import { setupBullBoard } from "./src/bullBoard.js";
import { addExampleJob } from "./src/queues/example.queue.js";

dotenv.config();

const app = express();
app.use(express.json());

await setupBullBoard(app);

// Add a route to trigger job creation
app.post("/job", async (req, res) => {
    const data = req.body || { text: "Sample job data" };
    await addExampleJob(data);
    res.status(200).send("📨 Job added successfully");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📥 Send POST request to http://localhost:${PORT}/job`);
});
