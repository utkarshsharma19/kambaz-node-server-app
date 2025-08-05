const module = {
    id: "M101",
    name: "Intro to Express",
    description: "Basics of routing & middleware",
    course: "CS4500"
  };
  
  export default function ModuleRoutes(app) {
    /* read --------------------------------------------------------------- */
    app.get("/lab5/module",       (_req, res) => res.json(module));
    app.get("/lab5/module/name",  (_req, res) => res.json(module.name));
  
    /* update ------------------------------------------------------------- */
    app.get("/lab5/module/name/:new", (req, res) => {
      module.name = req.params.new;
      res.json(module);
    });
  
    app.get("/lab5/module/description/:desc", (req, res) => {
      module.description = req.params.desc;
      res.json(module);
    });
  }