let todos = [
    { id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: false },
    { id: 4, title: "Task 4", completed: true },
  ];
  export default function WorkingWithArrays(app) {

    const createNewTodo = (req, res) => {
        const newTodo = {
          id: new Date().getTime(),
          title: "New Task",
          completed: false,
        };
        todos.push(newTodo);
        res.json(todos);
      };

      const removeTodo = (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        todos.splice(todoIndex, 1);
        res.json(todos);
      };
    
    const getTodoById = (req, res) => {
        const { completed } = req.query;
        if (completed !== undefined) {
          const completedBool = completed === "true";
          const completedTodos = todos.filter((t) => t.completed === completedBool);
          res.json(completedTodos);
          return;
        }
    
        res.json(todo);
      };

      const updateTodoTitle = (req, res) => {
        const { id, title } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.title = title;
        res.json(todos);
      };

      const postNewTodo = (req, res) => {
        const newTodo = { ...req.body, id: new Date().getTime() };
        todos.push(newTodo);
        res.json(newTodo);
      };
      const deleteTodo = (req, res) => {
        const { id } = req.params;
        todos = todos.filter(t => t.id !== parseInt(id));
        res.json(todos);                 // <<< was res.sendStatus(200)
      };

      const updateTodo = (req, res) => {
        const { id } = req.params;
        todos = todos.map(t =>
          t.id === parseInt(id) ? { ...t, ...req.body } : t
        );
        res.json(todos);                 // <<< was res.sendStatus(200)
      };
      
      app.put("/lab5/todos/:id", updateTodo);
      app.delete("/lab5/todos/:id", deleteTodo);
      app.post("/lab5/todos", postNewTodo);    
      app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
      app.get("/lab5/todos/create", createNewTodo);
      app.get("/lab5/todos/:id", getTodoById);    
      app.get("/lab5/todos/:id/delete", removeTodo);

    app.get("/lab5/todos", getTodos);
  };
  