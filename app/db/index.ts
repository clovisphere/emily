import mongoose from "mongoose";
import { MONGO_URL } from "../config";

export const connect = () => {
  mongoose.connect(MONGO_URL);
  mongoose.connection.on("error", (err: Error) => {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });
};

export const disconnect = () => mongoose.connection.close();

// readyState 1 = connected
export const isConnected = () => mongoose.connection.readyState === 1;
