import QueryParameters from "./QueryParameters.js";
import PathParameters from "./PathParameters.js";


export default function Lab5(app) {
    app.get("/lab5/welcome", (req, res) => {
      res.send("Welcome to Lab 5");
    });

    PathParameters(app);
    QueryParameters(app);
  };
  