const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend files
app.use(express.static(path.join(__dirname, "../public")));

// Student JSON file
const filePath = path.join(__dirname, "student.json");

// Register
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    let students = [];

    if (fs.existsSync(filePath)) {
        students = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    const existingStudent = students.find(student => student.email === email);

    if (existingStudent) {
        return res.send("Email already registered");
    }

    students.push({
        name,
        email,
        password
    });

    fs.writeFileSync(filePath, JSON.stringify(students, null, 2));

    res.redirect("/login.html");
});

// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const students = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const student = students.find(
        student => student.email === email && student.password === password
    );

    if (!student) {
        return res.send("Invalid email or password");
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Welcome</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>Welcome ${student.name} 🎉</h1>
                <p>You have successfully logged in.</p>
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});