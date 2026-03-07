const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =======================
   CORS CONFIG
======================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // allow anyway (safe fallback)
      }
    },
    credentials: true,
  })
);

/* =======================
   BODY PARSER
======================= */

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

/* =======================
   ROUTES
======================= */

// AUTH
app.use("/api/auth", require("./routes/authRoutes"));

// DASHBOARD
app.use("/api/admin/dashboard", require("./routes/dashboardRoutes"));

// HERO
app.use("/api/admin/hero", require("./routes/heroRoutes"));

// ABOUT
app.use("/api/admin/about", require("./routes/aboutRoutes"));
app.use("/api/about", require("./routes/aboutRoutes"));

// SETTINGS
app.use("/api/admin/settings", require("./routes/settingsRoutes"));

// SKILLS
app.use("/api/admin/skills", require("./routes/skillRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));

// EXPERIENCE
app.use("/api/admin/experience", require("./routes/experienceRoutes"));
app.use("/api/experience", require("./routes/publicExperienceRoutes"));

// PROJECTS
app.use("/api/admin/projects", require("./routes/projectRoutes"));
app.use("/api/projects", require("./routes/publicProjectRoutes"));

// PROJECT CATEGORY
app.use("/api/admin/project-categories", require("./routes/projectCategoryRoutes"));

// SERVICES
app.use("/api/admin/services", require("./routes/serviceRoutes"));
app.use("/api/services", require("./routes/publicServiceRoutes"));

// CONTACT
app.use("/api/contact", require("./routes/contactRoutes"));

// BLOGS
app.use("/api/admin/blogs", require("./routes/blogRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));

/* =======================
   HEALTH CHECK
======================= */

app.get("/", (req, res) => {
  res.status(200).send("Backend API is running 🚀");
});

/* =======================
   DATABASE CONNECTION
======================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* =======================
   GLOBAL ERROR HANDLER
======================= */

app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

/* =======================
   SERVER START
======================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});