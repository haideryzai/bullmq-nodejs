import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import { exampleQueue } from "./queues/example.queue.js";
import basicAuth from "express-basic-auth";
import dotenv from "dotenv";

dotenv.config();


export async function setupBullBoard(app) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/admin/queues");

    createBullBoard({
        queues: [new BullMQAdapter(exampleQueue)],
        serverAdapter,
    });

    app.use(
        "/admin/queues",
        basicAuth({
            users: {
                [process.env.BULLBOARD_USER || "admin"]:
                    process.env.BULLBOARD_PASS || "password",
            },
            challenge: true,
            unauthorizedResponse: "Unauthorized",
        })
    );

    app.use("/admin/queues", serverAdapter.getRouter());

    console.log(
        `📊 BullBoard UI: http://localhost:${process.env.PORT || 3000}/admin/queues`
    );
}
