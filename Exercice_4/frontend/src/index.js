import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config({ path: "../docker/frontend.env" });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const BACKEND_URL = process.env.BACKEND_URL;

// Page principale
app.get("/", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/users`);
    const users = await response.json();

    const html = `
      <h1>Liste des utilisateurs</h1>
      <ul>
        ${users.map(u => `<li>${u.id} - ${u.username} 
            <form method="POST" action="/delete" style="display:inline">
              <input type="hidden" name="id" value="${u.id}" />
              <img src="${u.picture_url}" alt="Photo de ${u.username}" style="width:50px; height:50px;" />
              <div>${u.username}</div>
              <button type="submit">Supprimer</button>
            </form>
          </li>`).join("")}
      </ul>
      <h2>Ajouter des Utilisateurs depuis randomuser.me</h2>
      <!-- <form method="POST" action="/add">
        <input type="text" name="username" placeholder="Nom utilisateur" required/>
        <input type="text" name="picture_url" placeholder="URL Photo" required/>
        <button type="submit">Ajouter</button>
      </form> -->
      <a href="/fetch-tor-users">Importer des utilisateurs via Tor</a>
    `;
    res.send(html);
  } catch (err) {
    res.send("Erreur : " + err.message);
  }
});

//Puller users from randomuser.me via Tor and store in DB
app.get("/fetch-tor-users", async (req, res) => {
  try {
    await fetch(`${BACKEND_URL}/tor-users`);
    res.redirect("/");
  } catch (err) {
    res.send("Erreur : " + err.message);
  }
});

// Ajouter un utilisateur
app.post("/add", async (req, res) => {
  try {
    const username = req.body.username;
    await fetch(`${BACKEND_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, picture_url: req.body.picture_url })
    });
    res.redirect("/");
  } catch (err) {
    res.send("Erreur : " + err.message);
  }
});

// Supprimer un utilisateur
app.post("/delete", async (req, res) => {
  try {
    const id = req.body.id;
    await fetch(`${BACKEND_URL}/users/${id}`, { method: "DELETE" });
    res.redirect("/");
  } catch (err) {
    res.send("Erreur : " + err.message);
  }
});

app.listen(process.env.FRONTEND_PORT || 3000, () => {
  console.log("Frontend running on port", process.env.FRONTEND_PORT);
});
