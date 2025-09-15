const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const db = require("./db");

const app = express();


// Example: data DB se aa sakta hai
const attendanceData = [
  { code: "BAS105", subject: "Soft Skills", attended: 10, total: 14 },
  { code: "BCS101", subject: "Programming", attended: 9, total: 13 },
  { code: "BCE15I", subject: "Graphics Lab", attended: 1, total: 3 },
  { code: "BEE101", subject: "Fundamentals of Electrical Engg", attended: 9, total: 15 },
  { code: "BCS15I", subject: "Problem Solving Lab", attended: 1, total: 1 }
];

app.get("/api/attendance", (req, res) => {
  res.json(attendanceData);
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "secretKey123",
  resave: false,
  saveUninitialized: true
}));

// ================= LOGIN =================
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username=? AND password=?";
  
  db.query(query, [username, password], (err, results) => {
    if(err) return res.status(500).send("Database error");

    if(results.length > 0){
      const user = results[0];
      req.session.user = user;

      // Role-based redirect
      if(user.role === "student") res.redirect("/student-dashboard");
      else if(user.role === "admin") res.redirect("/faculty-dashboard");
      else if(user.role === "hod") res.redirect("/hod-dashboard");
      else res.send("Unknown role");
    } else {
      res.send("Invalid username or password");
    }
  });
});

// ================= LOGOUT =================
app.get("/logout", (req,res) => {
  req.session.destroy();
  res.redirect("/login");
});

// ================= MIDDLEWARE =================
function authRole(role) {
  return (req, res, next) => {
    if(!req.session.user) return res.redirect("/login");
    if(req.session.user.role !== role) return res.send("Access denied!");
    next();
  };
}

// ================= DASHBOARDS =================
app.get("/student-dashboard", authRole("student"), (req,res) => {
  res.sendFile(path.join(__dirname,"public","student-dashboard.html"));
});

app.get("/faculty-dashboard", authRole("admin"), (req,res) => {
  res.sendFile(path.join(__dirname,"public","faculty-dashboard.html"));
});

app.get("/hod-dashboard", authRole("hod"), (req,res) => {
  res.sendFile(path.join(__dirname,"public","hod-dashboard.html"));
});

// ================= STUDENTS CRUD =================
app.get("/students", authRole("admin"), (req,res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if(err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/students/add", authRole("admin"), (req,res) => {
  const { name, course, year, status } = req.body;
  const query = "INSERT INTO students (name, course, year, status) VALUES (?, ?, ?, ?)";
  db.query(query, [name, course, year, status], (err, results) => {
    if(err) return res.status(500).send(err);
    res.json({ success: true, id: results.insertId });
  });
});

app.post("/students/update", authRole("admin"), (req,res) => {
  const { id, name, course, year, status } = req.body;
  const query = "UPDATE students SET name=?, course=?, year=?, status=? WHERE id=?";
  db.query(query, [name, course, year, status, id], (err, results) => {
    if(err) return res.status(500).send(err);
    res.json({ success: true });
  });
});

app.post("/students/delete", authRole("admin"), (req,res) => {
  const { id } = req.body;
  const query = "DELETE FROM students WHERE id=?";
  db.query(query, [id], (err, results) => {
    if(err) return res.status(500).send(err);
    res.json({ success: true });
  });
});




// Dummy data (later DB se fetch kar sakte ho)
const classes = [
  { time: "8:30am – 9:40am", subject: "ENGG. MATHS-I" },
  { time: "9:40am – 10:40am", subject: "Personality Development" },
  { time: "10:50am – 11:50am", subject: "Soft Skills" },
  { time: "1:50pm – 2:30pm", subject: "Engg. Graphics & Design Lab" },
  { time: "3:00pm – 4:00pm", subject: "Fundamentals of Electrical Engineering" },
  { time: "8:30am – 9:40am", subject: "ENGG. MATHS-I" },
  { time: "9:40am – 10:40am", subject: "Personality Development" },
  { time: "10:50am – 11:50am", subject: "Soft Skills" },
  { time: "1:50pm – 2:30pm", subject: "Engg. Graphics & Design Lab" },
  { time: "3:00pm – 4:00pm", subject: "Fundamentals of Electrical Engineering" }
];

app.get("/api/classes", (req, res) => {
  res.json(classes);
});

app.get("/classes", (req,res) => {
  res.sendFile(path.join(__dirname, "public", "classes.html"));
});

app.get("/api/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json({ error: "Database fetch failed" });
    res.json(results);
  });
});


app.get("/api/submissions", (req, res) => {
  const role = req.query.role;  // "faculty" या "hod"

  let query = `
    SELECT s.id, st.name AS student_name, a.title AS assignment_title,
           s.file_path, s.file_name, s.submitted_at
    FROM submissions s
    JOIN students st ON s.student_id = st.id
    JOIN assignments a ON s.assignment_id = a.id
  `;

  if (role === "faculty") {
    // मान लो req.session.faculty_course में faculty का course stored है login के बाद
    query += ` WHERE a.course = ?`;
    db.query(query, [req.session.faculty_course], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else if (role === "hod") {
    // HOD सब देखेगा
    db.query(query, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    res.status(400).json({ error: "Invalid role" });
  }
});


// ================= START SERVER =================
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
