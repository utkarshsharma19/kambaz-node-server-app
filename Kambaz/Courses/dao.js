import Database from "../Database/index.js";
import { v4 as uuidv4 } from 'uuid';

export function findAllCourses() {
  return Database.courses;
}

export function findCoursesForEnrolledUser(userId) {
  const { courses, enrollments } = Database;
  return courses.filter(course =>
    enrollments.some(e => e.user === userId && e.course === course._id)
  );
}

export function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  Database.courses = [...Database.courses, newCourse];
  return newCourse;
}

export function deleteCourse(courseId) {
  const { courses, enrollments } = Database;
  Database.courses = courses.filter((course) => course._id !== courseId);
  Database.enrollments = enrollments.filter(
    (enrollment) => enrollment.course !== courseId
);}
export function updateCourse(courseId, courseUpdates) {
  const { courses } = Database;
  const course = courses.find((course) => course._id === courseId);
  Object.assign(course, courseUpdates);
  return course;
}


