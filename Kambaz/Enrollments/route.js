import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  // list mappings for the current user (used by your myEnrollments() client)
  app.get("/api/users/current/enrollments", async (req, res) => {
    const me = req.session.currentUser;
    if (!me) return res.sendStatus(401);
    const rows = await dao.listForUser(me._id);
    res.json(rows);
  });

  // enroll (body: { course })
  app.post("/api/enrollments", async (req, res) => {
    const me = req.session.currentUser;
    if (!me) return res.sendStatus(401);
    const row = await dao.enrollUserInCourse(me._id, req.body.course);
    res.json(row);
  });

  // unenroll
  app.delete("/api/enrollments/:courseId", async (req, res) => {
    const me = req.session.currentUser;
    if (!me) return res.sendStatus(401);
    await dao.unenrollUserFromCourse(me._id, req.params.courseId);
    res.sendStatus(200);
  });
}
