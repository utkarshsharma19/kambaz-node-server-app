import model from "./model.js";

// Return raw enrollment mappings for a user (user, course, _id)
export function listForUser(userId) {
  return model.find({ user: userId }).select("user course _id").lean();
}

// Idempotent enroll: upsert by deterministic _id (user-course)
export function enrollUserInCourse(user, course) {
  const _id = `${user}-${course}`;
  return model.findOneAndUpdate(
    { _id },
    { $setOnInsert: { _id, user, course, enrollmentDate: new Date() } },
    { upsert: true, new: true }
  );
}

export function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}

// (Optional) already have these:
export async function findCoursesForUser(userId) {
  const rows = await model.find({ user: userId }).populate("course");
  return rows.map((r) => r.course);
}
export async function findUsersForCourse(courseId) {
  const rows = await model.find({ course: courseId }).populate("user");
  return rows.map((r) => r.user);
}
