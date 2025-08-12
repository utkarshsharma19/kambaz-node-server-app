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
  /* ---------- authentication ---------- */
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

  /* ---------- users queries & CRUD ---------- */
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
    const user = await dao.createUser(req.body);
    res.json(sanitize(user));
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;
    await dao.updateUser(userId, updates);
    const me = req.session.currentUser;
    if (me && me._id === userId) {
      req.session.currentUser = sanitize({ ...me, ...updates });
    }
    res.json(req.session.currentUser || { status: "ok" });
  };

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  /* ---------- many-to-many: courses for a user ---------- */
  const findCoursesForUser = async (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);

    // ADMIN sees all courses
    if (currentUser.role === "ADMIN") {
      const courses = await courseDao.findAllCourses();
      return res.json(courses);
    }

    let { uid } = req.params;
    if (uid === "current") uid = currentUser._id;

    const courses = await enrollmentsDao.findCoursesForUser(uid);
    res.json(courses);
  };

  /* ---------- enroll / unenroll ---------- */
  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const me = req.session.currentUser;
      if (!me) return res.sendStatus(401);
      uid = me._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const me = req.session.currentUser;
      if (!me) return res.sendStatus(401);
      uid = me._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };

  /* ---------- route table ---------- */
  app.post ("/api/users/signup",  signup);
  app.post ("/api/users/signin",  signin);
  app.post ("/api/users/signout", signout);
  app.post ("/api/users/profile", profile);

  app.get  ("/api/users",             findAllUsers);
  app.get  ("/api/users/:userId",     findUserById);
  app.post ("/api/users",             createUser);
  app.put  ("/api/users/:userId",     updateUser);
  app.delete("/api/users/:userId",    deleteUser);

  app.get  ("/api/users/:uid/courses",        findCoursesForUser);
  app.post ("/api/users/:uid/courses/:cid",   enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid",  unenrollUserFromCourse);
}
