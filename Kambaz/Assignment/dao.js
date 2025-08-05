import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

/* ───── helpers ───── */
export const findAssignmentsForCourse = (courseId) =>
  db.assignments.filter((a) => a.course === courseId);

export const createAssignment = (assignment) => {
  const newA = { ...assignment, _id: uuidv4() };
  db.assignments.push(newA);
  return newA;
};

export const updateAssignment = (assignmentId, updates) => {
  const i = db.assignments.findIndex((a) => a._id === assignmentId);
  if (i === -1) return null;
  db.assignments[i] = { ...db.assignments[i], ...updates };
  return db.assignments[i];
};

export const deleteAssignment = (assignmentId) => {
  const i = db.assignments.findIndex((a) => a._id === assignmentId);
  if (i === -1) return false;
  db.assignments.splice(i, 1);
  return true;
};
