import express from "express";
import session from "express-session";
import cors from "cors";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/route.js";
import ModuleRoutes from "./Kambaz/Modules/route.js";
import AssignmentRoutes from "./Kambaz/Assignment/route.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/route.js";
import PeopleRoutes from "./Kambaz/People/route.js";

const app  = express();
const PORT = process.env.PORT || 4000;
const IS_PROD = process.env.NODE_ENV === "production";

/* ---------- CORS ---------- */
const allowedOrigins = [
  process.env.NETLIFY_URL,      // prod React site
  "http://localhost:5173"       // local Vite dev
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Let Express answer OPTIONS automatically
app.options("*", cors());

/* ---------- body parsing & sessions ---------- */
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: IS_PROD ? "none" : "lax", // cross-site cookie policy
      secure: IS_PROD,                    // https only in prod
    },
  })
);

/* ---------- routes ---------- */
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
PeopleRoutes(app);
Lab5(app);

/* ---------- server ---------- */
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
