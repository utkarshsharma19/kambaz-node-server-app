import express from "express";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";

import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/route.js";
import ModuleRoutes from "./Kambaz/Modules/route.js";
import AssignmentRoutes from "./Kambaz/Assignment/route.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/route.js";
import PeopleRoutes from "./Kambaz/People/route.js";

/* ---------- Mongo ---------- */
const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

await mongoose.connect(CONNECTION_STRING);

/* ---------- App ---------- */
const app = express();
const PORT = process.env.PORT || 4000;

/* ---------- CORS ---------- */
const whitelist = [
  "http://localhost:5173",                       // Vite dev
  "https://glowing-griffin-af9ac8.netlify.app",  // Netlify prod
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || whitelist.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
}));
app.options("*", cors());

/* ---------- Body parsing ---------- */
app.use(express.json());

/* ---------- Session (env-aware) ---------- */
const isProd = process.env.NODE_ENV === "production";
app.set("trust proxy", isProd ? 1 : 0);

app.use(session({
  secret: process.env.SESSION_SECRET || "kambaz-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: isProd ? "none" : "lax",
    secure:   isProd,
  },
}));

/* ---------- Routes ---------- */
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
PeopleRoutes(app);
Lab5(app);

/* ---------- Start ---------- */
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
