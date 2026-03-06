import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const app = express();
const PORT = 3000;
const db = new Database("iep.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    studentName TEXT,
    birthDate TEXT,
    nationality TEXT,
    guardian TEXT,
    fatherName TEXT,
    motherName TEXT,
    brothers INTEGER,
    sisters INTEGER,
    familyOrder INTEGER,
    grade TEXT,
    classSection TEXT,
    school TEXT,
    studentIdNumber TEXT,
    classTeacher TEXT,
    schoolPhone TEXT,
    fatherPhone TEXT,
    homePhone TEXT,
    problemType TEXT,
    planDate TEXT,
    supportTeamDate TEXT,
    specialEdCenterDate TEXT,
    diagnosisDate TEXT,
    planType TEXT,
    coordinator TEXT,
    studentStatus TEXT,
    assessment TEXT, -- JSON stringified
    supportServices TEXT, -- JSON stringified
    adaptations TEXT, -- JSON stringified
    accommodations TEXT, -- JSON stringified
    interventions TEXT -- JSON stringified
  );

  CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    studentId TEXT,
    date TEXT,
    strengths TEXT,
    weaknesses TEXT,
    items TEXT, -- JSON stringified
    FOREIGN KEY(studentId) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS followups (
    id TEXT PRIMARY KEY,
    studentId TEXT,
    date TEXT,
    goalsStatus TEXT, -- JSON stringified
    recommendations TEXT,
    results TEXT,
    FOREIGN KEY(studentId) REFERENCES students(id)
  );
`);

app.use(express.json());

// API Routes
app.get("/api/students", (req, res) => {
  const students = db.prepare("SELECT * FROM students").all();
  res.json(students.map(s => ({
    ...s,
    assessment: JSON.parse(s.assessment || "{}"),
    supportServices: JSON.parse(s.supportServices || "[]"),
    adaptations: JSON.parse(s.adaptations || "[]"),
    accommodations: JSON.parse(s.accommodations || "[]"),
    interventions: JSON.parse(s.interventions || "[]"),
  })));
});

app.post("/api/students", (req, res) => {
  const s = req.body;
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO students (
      id, studentName, birthDate, nationality, guardian, fatherName, motherName,
      brothers, sisters, familyOrder, grade, classSection, school, studentIdNumber,
      classTeacher, schoolPhone, fatherPhone, homePhone, problemType, planDate,
      supportTeamDate, specialEdCenterDate, diagnosisDate, planType, coordinator,
      studentStatus, assessment, supportServices, adaptations, accommodations, interventions
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    s.id, s.studentName, s.birthDate, s.nationality, s.guardian, s.fatherName, s.motherName,
    s.brothers, s.sisters, s.familyOrder, s.grade, s.classSection, s.school, s.studentIdNumber,
    s.classTeacher, s.schoolPhone, s.fatherPhone, s.homePhone, s.problemType, s.planDate,
    s.supportTeamDate, s.specialEdCenterDate, s.diagnosisDate, s.planType, s.coordinator,
    s.studentStatus, JSON.stringify(s.assessment || {}), 
    JSON.stringify(s.supportServices || []),
    JSON.stringify(s.adaptations || []),
    JSON.stringify(s.accommodations || []),
    JSON.stringify(s.interventions || [])
  );
  res.json({ status: "ok" });
});

app.delete("/api/students/:id", (req, res) => {
  db.prepare("DELETE FROM students WHERE id = ?").run(req.params.id);
  res.json({ status: "ok" });
});

app.get("/api/plans", (req, res) => {
  const plans = db.prepare("SELECT * FROM plans").all();
  res.json(plans.map(p => ({ ...p, items: JSON.parse(p.items || "[]") })));
});

app.post("/api/plans", (req, res) => {
  const p = req.body;
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO plans (id, studentId, date, strengths, weaknesses, items)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(p.id, p.studentId, p.date, p.strengths, p.weaknesses, JSON.stringify(p.items || []));
  res.json({ status: "ok" });
});

app.get("/api/followups", (req, res) => {
  const followups = db.prepare("SELECT * FROM followups").all();
  res.json(followups.map(f => ({ ...f, goalsStatus: JSON.parse(f.goalsStatus || "[]") })));
});

app.post("/api/followups", (req, res) => {
  const f = req.body;
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO followups (id, studentId, date, goalsStatus, recommendations, results)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(f.id, f.studentId, f.date, JSON.stringify(f.goalsStatus || []), f.recommendations, f.results);
  res.json({ status: "ok" });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
