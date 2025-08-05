
const module = {
    id: "M101",
    name: "Intro to Express",
    description: "Basics of routing & middleware",
    course: "CS4500"
  };
  
  export default function ModuleRoutes(app) {
    /* read ------------------------------------------------------------------ */
    app.get("/lab5/module", (_, res) => res.json(module));
    app.get("/lab5/module/name", (_, res) => res.json(module.name));
  
    /* update ---------------------------------------------------------------- */
    app.get("/lab5/module/name/:newName", (req, res) => {
      module.name = req.params.newName;
      res.json(module);
    });
  
    app.get("/lab5/module/description/:desc", (req, res) => {
      module.description = req.params.desc;
      res.json(module);
    });
  }
  