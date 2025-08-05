/* ------------------------------------------------------------------
   Lab 5 – WorkingWithArrays
------------------------------------------------------------------- */

let todos = [
    { id: 1, title: "Task 1", description: "demo", completed: false },
    { id: 2, title: "Task 2", description: "demo", completed: true  },
    { id: 3, title: "Task 3", description: "demo", completed: false },
    { id: 4, title: "Task 4", description: "demo", completed: true  }
  ];
  
  export default function WorkingWithArrays(app) {
  
    /* ───────────── helpers ───────────── */
    const nextId = () => Date.now();
  
    /* ───────────── CRUD routes ───────────── */
  
    // 1. list (optionally filter by ?completed=true/false)
    const getTodos = (req, res) => {
      const { completed } = req.query;
      if (completed !== undefined) {
        const wanted = completed === "true";
        return res.json(todos.filter(t => t.completed === wanted));
      }
      res.json(todos);
    };
  
    // 2. read by id
    const getTodoById = (req, res) => {
      const todo = todos.find(t => t.id === parseInt(req.params.id));
      todo ? res.json(todo) : res.sendStatus(404);
    };
  
    // 3. quick “create” with fixed values (GET)
    const createNewTodo = (_req, res) => {
      const newTodo = {
        id        : nextId(),
        title     : "New Task",
        description: "demo",
        completed : false
      };
      todos.push(newTodo);
      res.json(todos);
    };
  
    // 4. POST create with request body
    const postNewTodo = (req, res) => {
      const newTodo = { ...req.body, id: nextId() };
      todos.push(newTodo);
      res.json(newTodo);
    };
  
    // 5. full PUT update (body can include any fields)
    const updateTodo = (req, res) => {
      const { id } = req.params;
      todos = todos.map(t =>
        t.id === parseInt(id) ? { ...t, ...req.body } : t
      );
      res.json(todos);
    };
  
    // 6. delete via REST-style DELETE
    const deleteTodo = (req, res) => {
      const { id } = req.params;
      todos = todos.filter(t => t.id !== parseInt(id));
      res.json(todos);
    };
  
    // 7. delete via old GET /delete (kept for backward-compat)
    const removeTodo = (req, res) => {
      const { id } = req.params;
      todos = todos.filter(t => t.id !== parseInt(id));
      res.json(todos);
    };
  
    // 8. simple GET update of *title*
    const updateTodoTitle = (req, res) => {
      const { id, title } = req.params;
      const todo = todos.find(t => t.id === parseInt(id));
      if (!todo) return res.sendStatus(404);
      todo.title = title;
      res.json(todos);
    };
  
    /* ───────────── NEW spec-required routes ───────────── */
  
    // 9. update completed   /lab5/todos/:id/completed/:completed
    const updateTodoCompleted = (req, res) => {
      const { id, completed } = req.params;
      const todo = todos.find(t => t.id === parseInt(id));
      if (!todo) return res.sendStatus(404);
      todo.completed = completed === "true";
      res.json(todos);
    };
  
    // 10. update description /lab5/todos/:id/description/:description
    const updateTodoDescription = (req, res) => {
      const { id, description } = req.params;
      const todo = todos.find(t => t.id === parseInt(id));
      if (!todo) return res.sendStatus(404);
      todo.description = description;
      res.json(todos);
    };
  
    /* ───────────── route bindings ───────────── */
  
    // REST-style
    app.get   ("/lab5/todos",                      getTodos);
    app.get   ("/lab5/todos/:id",                  getTodoById);
    app.post  ("/lab5/todos",                      postNewTodo);
    app.put   ("/lab5/todos/:id",                  updateTodo);
    app.delete("/lab5/todos/:id",                  deleteTodo);
  
    // convenience “exercise” routes
    app.get("/lab5/todos/create",                  createNewTodo);
    app.get("/lab5/todos/:id/delete",              removeTodo);
    app.get("/lab5/todos/:id/title/:title",        updateTodoTitle);
  
    // new property-specific routes
    app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
    app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
  }
  