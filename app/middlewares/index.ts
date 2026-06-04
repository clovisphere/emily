import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/user";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies["SESSION_TOKEN"];
    if (!sessionToken) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    merge(req, { identity: user });
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as unknown as string;

    if (!currentUserId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
