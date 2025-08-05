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

/* ---------- CORS ---------- */
const whitelist = [
  "http://localhost:5173",                       // Vite dev
  "https://glowing-griffin-af9ac8.netlify.app"   // Netlify prod
];

app.use(cors({
  origin: (origin, cb) => {
    // allow Postman / curl (no Origin header) or anything on the list
    if (!origin || whitelist.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));

// make sure pre-flights are answered
app.options("*", cors());

/* ---------- misc middleware ---------- */
app.use((req, _res, next) => {
  const ct = req.headers["content-type"];
  if (ct && /charset=UTF-8/i.test(ct)) {
    req.headers["content-type"] = ct.replace(/charset=UTF-8/i, "charset=utf-8");
  }
  next();
});

app.use(express.json());

/* ---------- session (after CORS) ---------- */
app.set("trust proxy", 1);           // needed on Render for secure cookies
app.use(session({
  secret            : process.env.SESSION_SECRET || "kambaz-secret",
  resave            : false,
  saveUninitialized : false,
  cookie: {
    sameSite : "none",               // allow cross-site
    secure   : true                  // HTTPS only (Render = HTTPS)
  }
}));

/* ---------- routes ---------- */
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
PeopleRoutes(app);
Lab5(app);

/* ---------- start ---------- */
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
