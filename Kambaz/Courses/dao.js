import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
import Database from "../Database/index.js"; 
// READ
export function findAllCourses() {
  return model.find();
}

// CREATE
export function createCourse(course) {
  const { _id, ...rest } = course || {};
  const newCourse = { ...rest, _id: uuidv4() };
  return model.create(newCourse);
}

// DELETE
export function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}

// UPDATE — return the updated doc so the UI can dispatch it
export function updateCourse(courseId, courseUpdates) {
  return model.findByIdAndUpdate(
    courseId,
    { $set: courseUpdates },
    { new: true }
  );
}
export async function findCoursesForEnrolledUser(userId) {
  const ids = Database.enrollments
    .filter((e) => e.user === userId)
    .map((e) => e.course);
  if (!ids.length) return [];
  return model.find({ _id: { $in: ids } });
}