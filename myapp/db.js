const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shyam123",  // <-- yahan wahi password dalna hai jo MySQL me set hai
  database: "jdcollege"
});

db.connect((err) => {
  if (err) {
    console.error("DB connection error: ", err);
  } else {
    console.log("Connected to JDCollege DB");
  }
});

module.exports = db;



