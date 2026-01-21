import express from "express";
import fetch from "node-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";

const app = express();

// Adresse du proxy Tor (docker DNS)
const torProxy = process.env.TOR_PROXY || "socks5://tor:9050";
const agent = new SocksProxyAgent(torProxy);

app.get("/users", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/?results=5", { agent });
    const data = await response.json();
    // On ne garde que nom + photo
    const users = data.results.map(u => ({
      name: `${u.name.first} ${u.name.last}`,
      picture: u.picture.thumbnail
    }));
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users via Tor" });
  }
});

app.listen(5000, () => console.log("Backend running on 5000 via Tor"));
