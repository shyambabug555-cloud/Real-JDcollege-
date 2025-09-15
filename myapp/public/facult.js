// Now attach the listeners **after the cards exist**
document.getElementById("statClasses").addEventListener("click", () => {
  alert("Classes List:\n1. B.Tech CSE 3rd Year - DBMS\n2. B.Tech IT 2nd Year - OS\n3. MCA 1st Year - AI\n4. BBA 1st Year - Marketing\n5. B.Tech CSE 2nd Year - OS");
});

document.getElementById("statStudents").addEventListener("click", () => {
  alert("Students List:\n1. Rahul Sharma\n2. Priya Verma\n3. Aman Gupta\n4. Neha Singh\n5. Other 115 students...");
});

document.getElementById("statAssignments").addEventListener("click", () => {
  alert("Pending Assignments:\n1. DBMS Project - Due 2023-11-15\n2. OS Assignment 2 - Due 2023-11-10\n3. AI Research Paper - Due 2023-10-25");
});

document.getElementById("statAttendance").addEventListener("click", () => {
  alert("Student Attendance:\nRahul Sharma: 94%\nPriya Verma: 88%\nAman Gupta: 91%\nNeha Singh: 96%\nOthers: ...");
});

mainContent.addEventListener("click", (e) => {
  if (e.target.closest("#statClasses")) {
    alert("Classes List:\n1. B.Tech CSE 3rd Year - DBMS...");
  } else if (e.target.closest("#statStudents")) {
    alert("Students List:\n1. Rahul Sharma...");
  } else if (e.target.closest("#statAssignments")) {
    alert("Pending Assignments:\n1. DBMS Project...");
  } else if (e.target.closest("#statAttendance")) {
    alert("Student Attendance:\nRahul Sharma: 94%...");
  }
});
