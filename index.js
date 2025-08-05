import express        from "express";
import session        from "express-session";
import cors           from "cors";

import Lab5           from "./Lab5/index.js";
import UserRoutes     from "./Kambaz/Users/routes.js";
import CourseRoutes   from "./Kambaz/Courses/route.js";
import ModuleRoutes from "./Kambaz/Modules/route.js";
import AssignmentRoutes from "./Kambaz/Assignment/route.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/route.js";
import PeopleRoutes from "./Kambaz/People/route.js";




const app  = express();
const PORT = process.env.PORT || 4000;

/* ---------- middleware (order matters) ---------- */
app.use((req, _res, next) => {
    const ct = req.headers["content-type"];
    if (ct && /charset=UTF-8/i.test(ct)) {
      req.headers["content-type"] = ct.replace(/charset=UTF-8/i, "charset=utf-8");
    }
    next();
  });
  
app.use(cors({
  origin: ["http://localhost:5173"],   // Vite dev server
  credentials: true
}));

app.use(session({
  secret            : "kambaz-secret",
  resave            : false,
  saveUninitialized : false
}));
app.use(express.json());

/* ---------- routes ---------- */
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
PeopleRoutes(app);
Lab5(app);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
