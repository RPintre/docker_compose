const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database("/data/users.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`);

/* CREATE */
app.post("/users", (req, res) => {
  const { username, password } = req.body;
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

/* READ ALL */
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => res.json(rows));
});

/* UPDATE */
app.put("/users/:id", (req, res) => {
  const { username, password } = req.body;
  db.run(
    "UPDATE users SET username=?, password=? WHERE id=?",
    [username, password, req.params.id],
    () => res.json({ status: "updated" })
  );
});

/* DELETE */
app.delete("/users/:id", (req, res) => {
  db.run(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    () => res.json({ status: "deleted" })
  );
});

app.listen(5000, () => console.log("Backend running on 5000"));
