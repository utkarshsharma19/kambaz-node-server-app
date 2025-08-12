import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
  app.put("/api/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const updated = await modulesDao.updateModule(moduleId, req.body);
    res.json(updated); // return updated doc
  });

  app.delete("/api/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const status = await modulesDao.deleteModule(moduleId);
    res.send(status);
  });

  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });

  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const module = { ...req.body, course: courseId };
    const created = await modulesDao.createModule(module);
    res.json(created);
  });
}
