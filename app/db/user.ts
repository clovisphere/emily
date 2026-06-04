import mongoose from "mongoose";
import type { CreateUserInput, UpdateUserInput } from "../types/user";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    authentication: {
      // select: false prevents these fields from being returned in queries by default
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
  },
  { versionKey: false },
);

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserById = (id: string) => UserModel.findById(id);
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const createUser = (values: CreateUserInput) =>
  new UserModel(values).save();
export const updateUserById = (id: string, values: UpdateUserInput) =>
  UserModel.findByIdAndUpdate(id, values);
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);
