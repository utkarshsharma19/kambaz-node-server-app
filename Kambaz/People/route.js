import * as usersDao       from "../Users/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function PeopleRoutes(app) {
  /* 1. list everyone enrolled in a course (students + faculty) */
  app.get("/api/courses/:cid/users", (req, res) => {
    const { cid } = req.params;
    const userIds = enrollmentsDao.findUsersForCourse(cid).map((e) => e.user);
    const people  = usersDao.findManyByIds(userIds);
    res.json(people);
  });

  /* 2-4. faculty-only CRUD on users */
  const mustBeFaculty = (req, res, next) => {
    const me = req.session.currentUser;
    if (!me) return res.sendStatus(401);
    if (me.role !== "FACULTY") return res.sendStatus(403);
    next();
  };

  app.post("/api/users", mustBeFaculty, (req, res) => {
    const u = usersDao.createUser(req.body);
    res.json(u);
  });

  app.put("/api/users/:uid", mustBeFaculty, (req, res) => {
    const u = usersDao.updateUser(req.params.uid, req.body);
    if (!u) return res.sendStatus(404);
    res.json(u);
  });

  app.delete("/api/users/:uid", mustBeFaculty, (req, res) => {
    const ok = usersDao.deleteUser(req.params.uid);
    res.sendStatus(ok ? 200 : 404);
  });
}
