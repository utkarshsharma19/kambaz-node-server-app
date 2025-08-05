import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  /* course-scoped list + create */
  app.get("/api/courses/:cid/assignments", (req, res) =>
    res.json(dao.findAssignmentsForCourse(req.params.cid))
  );

  app.post("/api/courses/:cid/assignments", (req, res) => {
    const newA = dao.createAssignment({
      ...req.body,
      course: req.params.cid,
    });
    res.json(newA);
  });

  /* item-scoped update + delete */
  app.put("/api/assignments/:aid", (req, res) => {
    const saved = dao.updateAssignment(req.params.aid, req.body);
    if (!saved) return res.sendStatus(404);
    res.json(saved);
  });

  app.delete("/api/assignments/:aid", (req, res) =>
    res.sendStatus(dao.deleteAssignment(req.params.aid) ? 200 : 404)
  );
}
