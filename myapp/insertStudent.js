const db = require("./db");  // db.js se connection import

// Example: ek student insert karna
const student = {
  name: "Shyam",
  roll_no: 0,
  batch: "2025–2029",
  course: "B.Tech",
  branch: "Electronics & Communication Engg",
  semester: "1st Sem",
  section: "A3",
  attendance: 70
};

const query = `
  INSERT INTO students 
  (name, roll_no, batch, course, branch, semester, section, attendance) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

db.query(
  query,
  [
    student.name,
    student.roll_no,
    student.batch,
    student.course,
    student.branch,
    student.semester,
    student.section,
    student.attendance
  ],
  (err, result) => {
    if (err) {
      console.error("❌ Insert failed:", err);
    } else {
      console.log("✅ Student inserted with ID:", result.insertId);
    }
    db.end(); // connection band karna mat bhoolna
  }
);
// -- Example: Shyam ke 2 records delete karo (sirf ek bacha rahega)
