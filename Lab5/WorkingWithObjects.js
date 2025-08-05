const assignment = {
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  };
  export default function WorkingWithObjects(app) {
    const getAssignment = (req, res) => {
      res.json(assignment);
    };

    const getAssignmentTitle = (req, res) => {
        res.json(assignment.title);
      };
      app.get("/lab5/assignment/title", getAssignmentTitle);    

      const setAssignmentTitle = (req, res) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
      };
      app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);


    app.get("/lab5/assignment", getAssignment);

      /* ---------- NEW: score & completed ---------- */
  app.get("/lab5/assignment/score/:score", (req, res) => {
        assignment.score = Number(req.params.score);
        res.json(assignment);
      });
    
      app.get("/lab5/assignment/completed/:completed", (req, res) => {
        assignment.completed = req.params.completed === "true";
        res.json(assignment);
      });
  };
  