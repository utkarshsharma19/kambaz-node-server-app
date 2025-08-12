import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";   // ★ add this

export default function CourseRoutes(app) {
  // ---------- Courses ----------
  app.get("/api/courses", async (_req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  });

  app.post("/api/courses", async (req, res) => {
    try {
      // create the course
      const course = await dao.createCourse(req.body);
  
      // auto-enroll the author (idempotent in DAO)
      const currentUser = req.session?.currentUser;
      if (currentUser) {
        try {
          await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
        } catch (e) {
          console.error("auto-enroll failed:", e);
          // don't fail the request because of an enrollment hiccup
        }
      }
  
      res.status(201).json(course);
    } catch (err) {
      console.error("create course failed:", err);
      res.status(500).json({ message: "Could not create course" });
    }
  });

  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const updated = await dao.updateCourse(courseId, req.body);
    res.json(updated); // return doc, not raw status
  });

  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  });

  // ---------- Modules (Mongo) ----------
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });

  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const module = { ...req.body, course: courseId };
    const newModule = await modulesDao.createModule(module);
    res.json(newModule);
  });

  app.put("/api/courses/:courseId/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const status = await modulesDao.updateModule(moduleId, req.body);
    res.send(status);
  });

  app.delete("/api/courses/:courseId/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const status = await modulesDao.deleteModule(moduleId);
    res.send(status);
  });

  // ---------- People (users enrolled in a course) ----------
  // ★ 6.4.3.5
  app.get("/api/courses/:cid/users", async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  });
}
