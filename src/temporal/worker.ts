import { NativeConnection, Worker } from "@temporalio/worker";
import { createRequire } from "node:module";
import * as activities from "./activities.js";

const require = createRequire(import.meta.url);
const temporalAddress = process.env.TEMPORAL_ADDRESS ?? "localhost:7233";
const connection = await NativeConnection.connect({ address: temporalAddress });

await Worker.create({
  connection,
  taskQueue: "hotel-queue",
  workflowsPath: require.resolve("./workflow"),
  activities,
}).then((worker) => worker.run());
