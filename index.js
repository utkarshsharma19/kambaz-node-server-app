// index.js
import express  from "express";
import session  from "express-session";
import cors     from "cors";
import mongoose from "mongoose";

import Lab5             from "./Lab5/index.js";
import UserRoutes       from "./Kambaz/Users/routes.js";
import CourseRoutes     from "./Kambaz/Courses/route.js";
import ModuleRoutes     from "./Kambaz/Modules/route.js";
import AssignmentRoutes from "./Kambaz/Assignment/route.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/route.js";
import PeopleRoutes     from "./Kambaz/People/route.js";
import QuizRoutes       from "./Kambaz/Quizzes/route.js";

/* ───────────────────────────── MongoDB ───────────────────────────── */
const MONGO_URI =
  (process.env.MONGO_CONNECTION_STRING || "").trim() ||
  "mongodb://127.0.0.1:27017/kambaz";

// Safe log (doesn't print creds)
console.log(
  "MongoDB: connecting to",
  MONGO_URI.replace(/\/\/.*@/, "//***:***@")
);

try {
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    // tls is implied for mongodb+srv; for odd DNS stacks, you could add: family: 4
  });
  console.log("✅ Mongo connected");
} catch (err) {
  console.error("❌ Mongo connection error:", err);
  process.exit(1);
}

/* ───────────────────────────── App ───────────────────────────── */
const app  = express();
const PORT = process.env.PORT || 4000;

/* ───────────────────────────── CORS ───────────────────────────── */
// Origins we allow in production + dev
const whitelist = [
  "http://localhost:5173",                            // Vite dev
  process.env.NETLIFY_URL,                            // e.g. https://stellular-melba-b76f94.netlify.app
  "https://glowing-griffin-af9ac8.netlify.app",       // your other Netlify preview
  "https://stellular-melba-b76f94.netlify.app",  
  "https://bright-gelato-c5ab8a.netlify.app",
      // explicit prod URL
].filter(Boolean);

// Single source of truth for both simple + preflight
const corsOptions = {
  origin: (origin, cb) => {
    // allow same-origin tools (curl/Postman) with no Origin header
    if (!origin) return cb(null, true);
    if (whitelist.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // proper preflight with same options

/* ───────────────────────────── Parsers ───────────────────────────── */
app.use(express.json());

/* ───────────────────────────── Sessions ───────────────────────────── */
const isProd = process.env.NODE_ENV === "production";

// Required so Express knows it's behind a proxy (Render) and will set secure cookies
app.set("trust proxy", isProd ? 1 : 0);

app.use(session({
  secret: process.env.SESSION_SECRET || "kambaz-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: isProd ? "none" : "lax",
    secure:   isProd, // HTTPS-only in production
    // maxAge: 1000 * 60 * 60 * 24 * 7, // optional: 7 days
  },
}));

/* ───────────────────────────── Healthcheck ───────────────────────────── */
app.get("/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

/* ───────────────────────────── Routes ───────────────────────────── */
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
PeopleRoutes(app);
QuizRoutes(app);
Lab5(app);

/* ───────────────────────────── Start ───────────────────────────── */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
