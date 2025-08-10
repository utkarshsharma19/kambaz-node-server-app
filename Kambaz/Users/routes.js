import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

const sanitize = (doc) => {
  if (!doc) return doc;
  const o = doc.toObject ? doc.toObject() : doc;
  delete o.password;
  return o;
};

export default function UserRoutes(app) {
  /* ─────── auth ─────── */
  const signup = async (req, res) => {
    const existing = await dao.findUserByUsername(req.body.username);
    if (existing) return res.status(400).json({ message: "Username taken" });
    const user = await dao.createUser(req.body);
    const safe = sanitize(user);
    req.session.currentUser = safe;
    res.json(safe);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const user = await dao.findUserByCredentials(username, password);
    if (!user) return res.status(401).json({ message: "Bad credentials" });
    const safe = sanitize(user);
    req.session.currentUser = safe;
    res.json(safe);
  };

  const signout = (req, res) => req.session.destroy(() => res.sendStatus(200));

  const profile = (req, res) => {
    if (!req.session.currentUser) return res.sendStatus(401);
    res.json(req.session.currentUser);
  };

  /* ─────── queries & CRUD ─────── */
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      return res.json(users.map(sanitize));
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      return res.json(users.map(sanitize));
    }
    const users = await dao.findAllUsers();
    res.json(users.map(sanitize));
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(sanitize(user));
  };

  const createUser = async (req, res) => {
    try {
      const user = await dao.createUser(req.body);
      res.json(sanitize(user));
    } catch (e) {
      console.error("Create user error:", e);
      res.status(500).json({ message: "Failed to create user" });
    }
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;
    await dao.updateUser(userId, updates);

    // keep session in sync if editing yourself
    const currentUser = req.session.currentUser;
    if (currentUser && currentUser._id === userId) {
      req.session.currentUser = sanitize({ ...currentUser, ...updates });
    }
    res.json(req.session.currentUser || { status: "ok" });
  };

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  /* ─────── enrolled-courses helper ─────── */
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const me = req.session.currentUser;
      if (!me) return res.sendStatus(401);
      userId = me._id;
    }
    const courses = await courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const createCourseForCurrent = async (req, res) => {
    const me = req.session.currentUser;
    if (!me) return res.sendStatus(401);
    const newCourse = await courseDao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(me._id, newCourse._id);
    res.json(newCourse);
  };

  /* ─────── route table ─────── */
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);

  app.get   ("/api/users",            findAllUsers);
  app.get   ("/api/users/:userId",    findUserById);
  app.post  ("/api/users",            createUser);     // ← open create (no faculty guard)
  app.put   ("/api/users/:userId",    updateUser);
  app.delete("/api/users/:userId",    deleteUser);

  app.get   ("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post  ("/api/users/current/courses",  createCourseForCurrent);
}
