import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  /* current user ─ list */
  app.get("/api/users/current/enrollments", (req, res) => {
    const me = req.session.currentUser;
    if (!me) return res.sendStatus(401);
    res.json(dao.findCoursesForUser(me._id));
  });

  /* enroll  (body: { course }) */
  app.post("/api/enrollments", (req, res) => {
    const me = req.session.currentUser;
    if (!me) return res.sendStatus(401);
    const enrollment = dao.enrollUserInCourse(me._id, req.body.course);
    res.json(enrollment);
  });

  /* unenroll */
  app.delete("/api/enrollments/:courseId", (req, res) => {
    const me = req.session.currentUser;
    if (!me) return res.sendStatus(401);
    dao.unenrollUserFromCourse(me._id, req.params.courseId);
    res.sendStatus(200);
  });
}
