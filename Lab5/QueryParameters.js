// Lab5/QueryParameters.js
export default function QueryParameters(app) {
    app.get("/lab5/calculator", (req, res) => {
      const { a, b, operation } = req.query;
  
      // convert the query-string values (which are strings) to numbers
      const x = Number(a);
      const y = Number(b);
      let result;
  
      switch (operation) {
        case "add":
          result = x + y;
          break;
        case "subtract":
          result = x - y;
          break;
        case "multiply":
          result = x * y;
          break;
        case "divide":
          // simple divide-by-zero guard; tweak to suit your needs
          result = y === 0 ? "Infinity" : x / y;
          break;
        default:
          result = "Invalid operation";
      }
  
      // Always send **strings** so the browser doesn’t treat numbers as status codes
      res.send(result.toString());
    });
  }
  