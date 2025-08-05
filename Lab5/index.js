import QueryParameters from "./QueryParameters.js";
import PathParameters from "./PathParameters.js";
import ModuleRoutes from "./ModuleRoutes.js";
import WorkingWithArrays from "./WorkingWithArrays.js";
import WorkingWithObjects from "./WorkingWithObjects.js";


export default function Lab5(app) {
    app.get("/lab5/welcome", (req, res) => {
      res.send("Welcome to Lab 5");
    });

    PathParameters(app);
    QueryParameters(app);
    ModuleRoutes(app);
    WorkingWithArrays(app);
    WorkingWithObjects(app);
  };
  