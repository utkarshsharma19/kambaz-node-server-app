import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  // List by course
  app.get("/api/courses/:cid/assignments", async (req, res) => {
    const list = await dao.findAssignmentsForCourse(req.params.cid);
    res.json(list);
  });

  // Create for course
  app.post("/api/courses/:cid/assignments", async (req, res) => {
    const saved = await dao.createAssignment({
      ...req.body,
      course: req.params.cid,
    });
    res.status(201).json(saved);
  });

  // Update one
  app.put("/api/assignments/:aid", async (req, res) => {
    const saved = await dao.updateAssignment(req.params.aid, req.body);
    if (!saved) return res.sendStatus(404);
    res.json(saved);
  });

  // Delete one
  app.delete("/api/assignments/:aid", async (req, res) => {
    const status = await dao.deleteAssignment(req.params.aid);
    res.sendStatus(status.deletedCount ? 200 : 404);
  });
}
