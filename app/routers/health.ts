import express from "express";
import { isConnected } from "../db";

export default (router: express.Router) => {
  router.get("/health", (_req, res) => {
    if (!isConnected()) {
      return res.status(503).json({ status: "error", message: "Database unavailable" });
    }
    return res.status(200).json({ status: "ok" });
  });
};
