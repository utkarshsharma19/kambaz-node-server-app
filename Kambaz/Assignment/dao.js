import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export function findAssignmentsForCourse(courseId) {
  return model.find({ course: courseId }).sort({ title: 1 }).lean();
}

export function createAssignment(assignment) {
  const newA = { ...assignment, _id: uuidv4() };   // server generates id
  return model.create(newA);
}

export function updateAssignment(assignmentId, updates) {
  return model.findByIdAndUpdate(
    assignmentId,
    { $set: updates },
    { new: true, lean: true }
  );
}

export function deleteAssignment(assignmentId) {
  return model.deleteOne({ _id: assignmentId });
}
