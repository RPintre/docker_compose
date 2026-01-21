import express from "express";
import fetch from "node-fetch";

const app = express();

// Page HTML simple
app.get("/", async (req, res) => {
  const r = await fetch("http://backend:5000/users");
  const users = await r.json();

  const html = `
    <h1>Users via Tor</h1>
    <ul>
      ${users.map(u => `<li><img src="${u.picture}"> ${u.name}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});

app.listen(3000, () => console.log("Frontend running on 3000"));
