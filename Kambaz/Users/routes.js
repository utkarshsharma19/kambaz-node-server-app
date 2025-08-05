import * as dao       from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  /* ─────── authentication ─────── */

  const signup = (req, res) => {
    const existing = dao.findUserByUsername(req.body.username);
    if (existing) return res.status(400).json({ message: "Username taken" });

    const newUser = dao.createUser(req.body);
    req.session.currentUser = newUser;
    res.json(newUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const user = dao.findUserByCredentials(username, password);
    if (!user) return res.status(401).json({ message: "Bad credentials" });

    req.session.currentUser = user;
    res.json(user);
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    res.json(currentUser);
  };

  /* ─────── user CRUD (only update implemented) ─────── */

  const updateUser = (req, res) => {
    const updated = dao.updateUser(req.params.userId, req.body);
    if (!updated) return res.sendStatus(404);
    req.session.currentUser = updated;
    res.json(updated);
  };

  /* ─────── enrolled-courses helper ─────── */

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;                    // "/api/users/:userId/courses"
    if (userId === "current") {
      const currentUser = req.session.currentUser;
      if (!currentUser) return res.sendStatus(401);
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const createCourse = (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);  // ← guard against null session
  
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  app.post("/api/users/current/courses", createCourse);

  /* ─────── route table ─────── */

  app.post("/api/users/signup",   signup);
  app.post("/api/users/signin",   signin);
  app.post("/api/users/signout",  signout);
  app.post("/api/users/profile",  profile);

  app.put ("/api/users/:userId",  updateUser);

  app.get ("/api/users/:userId/courses", findCoursesForEnrolledUser);
}
