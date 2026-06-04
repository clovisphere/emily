import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { PORT } from "./config";
import { connect, disconnect } from "./db";
import router from "./routers";

// establishes the MongoDB connection before the server starts accepting requests
connect();

const app = express();

// credentials: true is required to allow the browser to send cookies on cross-origin requests
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// mount all application routes
app.use("/", router());

// start the server and keep a reference for graceful shutdown
const server = app.listen(PORT, () => {
  console.log(`
    ███████╗███╗   ███╗██╗██╗  ██╗   ██╗
    ██╔════╝████╗ ████║██║██║  ╚██╗ ██╔╝
    █████╗  ██╔████╔██║██║██║   ╚████╔╝
    ██╔══╝  ██║╚██╔╝██║██║██║    ╚██╔╝
    ███████╗██║ ╚═╝ ██║██║███████╗██║
    ╚══════╝╚═╝     ╚═╝╚═╝╚══════╝╚═╝
Server is running on http://localhost:${PORT}
  `);
});

// gracefully shuts down the HTTP server and closes the DB connection before exiting
const shutdown = async (signal: string) => {
  process.off("SIGTERM", shutdown);
  process.off("SIGINT", shutdown);
  console.log(`${signal} received. Shutdown initiated...`);
  try {
    // stop accepting new requests; existing connections are drained before the callback fires
    server.close(() => console.log("HTTP server closed."));
    await disconnect();
    console.log("MongoDB connection closed.");
    process.exit(0); // clean exit — signals success to process managers (Docker, Kubernetes, etc.)
  } catch (err) {
    console.error(`Error during shutdown: ${err}`);
    process.exit(1); // non-zero exit — signals failure
  }
};

// SIGTERM: sent by process managers requesting a graceful shutdown
// SIGINT: sent when the user presses Ctrl+C
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
