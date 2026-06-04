import express from "express";
import { createUser, getUserByEmail } from "../db/user";
import { authentication, random } from "../helpers/security";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = random();
    const user = await createUser({
      username,
      email,
      authentication: { salt, password: authentication(salt, password) },
    });
    const { authentication: _auth, ...publicUser } = user.toObject();
    return res.status(201).json(publicUser);
  } catch (error) {
    console.error(`An error occurred - ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // select: false hides auth fields by default; opt them back in for login
    const user = await getUserByEmail(email).select(
      "+authentication.password +authentication.salt",
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.authentication) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // salt and password are optional in the schema — guard against incomplete records
    const { salt, password: hashedPassword } = user.authentication;
    if (!salt || !hashedPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // hash the incoming password with the stored salt and compare
    if (authentication(salt, password) !== hashedPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // rotate the session token on every login
    user.authentication.sessionToken = authentication(
      random(),
      user._id.toString(),
    );

    await user.save();

    res.cookie("SESSION_TOKEN", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
      httpOnly: true,
    });

    const { authentication: _auth, ...publicUser } = user.toObject();
    return res.status(200).json(publicUser);
  } catch (error) {
    console.error(`An error occurred - ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
