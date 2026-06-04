import express from "express";
import mongoose from "mongoose";
import { getUsers, updateUserById, deleteUserById } from "../db/user";

export const getAllUsers = async (
  _: express.Request,
  res: express.Response,
) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(`Failed to fetch users: ${error}`);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id as string);
    res
      .status(200)
      .json({ message: `User ${deletedUser?.id} deleted successfully` });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    console.error(`Failed to delete user: ${error}`);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await updateUserById(id as string, { username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    console.error(`Failed to update user: ${error}`);
    res.status(500).json({ error: "Failed to update user" });
  }
};
