import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";


dotenv.config({ path: "../docker/backend.env" });
dotenv.config({ path: "../docker/postgres.env" });


const { Pool } = pkg;
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});
// Adresse du proxy Tor (docker DNS)
const torProxy = process.env.TOR_PROXY || "socks5://tor:9050";
const agent = new SocksProxyAgent(torProxy);
const app = express();
app.use(express.json());

//pull users from randomuser.me via Tor
app.get("/tor-users", async (req, res) => {
  var data;
  try {
    var response = await fetch("https://randomuser.me/api/?results=5", { agent });
    data = await response.json();
    // On ne garde que nom + photo
    var users = data.results.map(u => ({
      name: `${u.name.first} ${u.name.last}`,
      picture: u.picture.thumbnail
    }));
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users via Tor" });
  }
  //store users in database
  for (const u of data.results) {
    const username = `${u.name.first} ${u.name.last}`;
    const picture_url = u.picture.thumbnail;
    await pool.query(
      "INSERT INTO users (username, picture_url) VALUES ($1, $2)",
      [username, picture_url]
    );
  }
});

// GET all users
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT id, username, picture_url FROM users");
  res.json(result.rows);
});

// POST create user
app.post("/users", async (req, res) => {
  const { username } = req.body;
  const result = await pool.query(
    "INSERT INTO users (username) VALUES ($1) RETURNING id, username",
    [username]
  );
  res.json(result.rows[0]);
});

app.listen(process.env.BACKEND_PORT || 5000, () => {
  console.log("Backend running on port", process.env.BACKEND_PORT);
});

// DELETE /users/:id
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
  res.json({ success: true });
});

