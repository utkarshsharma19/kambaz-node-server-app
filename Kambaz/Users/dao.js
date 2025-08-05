import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  db.users.push(newUser);
  return newUser;
};

export const findAllUsers = () => db.users;

export const findUserById = (userId) =>
  db.users.find((user) => user._id === userId);

export const findUserByUsername = (username) =>
  db.users.find((user) => user.username === username);

export const findUserByCredentials = (username, password) =>
  db.users.find(
    (user) => user.username === username && user.password === password
  );

export const updateUser = (userId, updatedUser) => {
  const index = db.users.findIndex((u) => u._id === userId);
  if (index === -1) return null;
  db.users[index] = { ...db.users[index], ...updatedUser };
  return db.users[index];
};

export const deleteUser = (userId) => {
  const index = db.users.findIndex((u) => u._id === userId);
  if (index !== -1) {
    db.users.splice(index, 1);
    return true;
  }
  return false;
};


export const findManyByIds = (ids) =>
  db.users.filter((u) => ids.includes(u._id));