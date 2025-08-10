import * as usersDao from "../Users/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function PeopleRoutes(app) {
  // List everyone enrolled in a course (students + faculty)
  app.get("/api/courses/:cid/users", async (req, res) => {
    try {
      const { cid } = req.params;
      const userIds = enrollmentsDao.findUsersForCourse(cid).map((e) => e.user);
      const people = await usersDao.findManyByIds(userIds);
      const safe = people.map((u) => {
        const o = u.toObject ? u.toObject() : u;
        delete o.password;
        return o;
      });
      res.json(safe);
    } catch (e) {
      console.error("People list error:", e);
      res.status(500).json({ message: "Failed fetching people" });
    }
  });

  // ⛔️ Intentionally NO app.post/put/delete("/api/users"...)
  // to avoid clashing with UserRoutes' open create/update/delete.
}
