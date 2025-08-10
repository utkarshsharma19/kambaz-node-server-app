import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

/* ---------- CREATE ---------- */
export const createUser = (user) => {
  // ensure client _id doesn't interfere
  const { _id, ...rest } = user || {};
  const newUser = { ...rest, _id: uuidv4() };
  return model.create(newUser);
};

/* ---------- READ ---------- */
export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUsersByRole = (role) => model.find({ role });
export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i");
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};
export const findUserByUsername = (username) => model.findOne({ username });
export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password }); // (hash in real apps)

/* ---------- UPDATE ---------- */
export const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });

/* ---------- DELETE ---------- */
export const deleteUser = (userId) => model.deleteOne({ _id: userId });

/* ---------- helpers ---------- */
export const findManyByIds = (ids) => model.find({ _id: { $in: ids } });
