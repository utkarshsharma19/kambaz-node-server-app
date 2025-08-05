import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export const enrollUserInCourse = (userId, courseId) => {
  const existing = db.enrollments.find(
    (e) => e.user === userId && e.course === courseId
  );
  if (existing) return existing;                 // already enrolled

  const newE = { _id: uuidv4(), user: userId, course: courseId };
  db.enrollments.push(newE);
  return newE;
};

export const unenrollUserFromCourse = (userId, courseId) => {
  db.enrollments = db.enrollments.filter(
    (e) => !(e.user === userId && e.course === courseId)
  );
};

export const findCoursesForUser = (userId) =>
  db.enrollments.filter((e) => e.user === userId);

export const findUsersForCourse = (courseId) =>
  db.enrollments.filter((e) => e.course === courseId);