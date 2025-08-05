// PathParameters.js
// Registers path-parameter math routes for Lab 5.

export default function PathParameters(app) {
    /* ---------- helpers ---------- */
    const add = (req, res) => {
      const { a, b } = req.params;
      res.send(String(+a + +b));
    };
  
    const subtract = (req, res) => {
      const { a, b } = req.params;
      res.send(String(+a - +b));
    };
  
    const multiply = (req, res) => {
      const { a, b } = req.params;
      res.send(String(+a * +b));
    };
  
    const divide = (req, res) => {
      const { a, b } = req.params;
      const divisor = +b;
      if (divisor === 0) {
        res.status(400).send("Division by zero");
        return;
      }
      res.send(String(+a / divisor));
    };
  
    /* ---------- routes ---------- */
    app.get("/lab5/add/:a/:b", add);
    app.get("/lab5/subtract/:a/:b", subtract);
    app.get("/lab5/multiply/:a/:b", multiply);
    app.get("/lab5/divide/:a/:b", divide);
  }
  