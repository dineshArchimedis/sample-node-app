const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    const nowIST = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "medium"
    });

    res.send(`
        <h2>Hello from Jenkins CI/CD!</h2>
        <p>Current IST Time: ${nowIST}</p>
    `);
});

app.get("/health", (req, res) => {
    const nowIST = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata"
    });

    res.json({
        status: "UP",
        timestamp: nowIST
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Application running on port ${PORT}`);
});
