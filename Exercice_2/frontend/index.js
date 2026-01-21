import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// HTML simple pour CRUD
app.get("/", (req, res) => {
  res.send(`
    <h1>Users CRUD</h1>
    <input id="u" placeholder="username">
    <input id="p" placeholder="password">
    <button onclick="fetch('/create', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username:document.getElementById('u').value, password:document.getElementById('p').value})
    })">Create</button>
    <ul id="list"></ul>
    <script>
      async function load() {
        const res = await fetch('/list');
        const users = await res.json();
        const list = document.getElementById('list');
        list.innerHTML = '';
        users.forEach(u => {
          const li = document.createElement('li');
          li.innerHTML = \`
            \${u.id} - \${u.username} 
            <button onclick="del(\${u.id})">Delete</button>
          \`;
          list.appendChild(li);
        });
      }

      async function del(id) {
        await fetch('/delete/' + id, { method: 'DELETE' });
        load();
      }

      setInterval(load, 1000); // recharge toutes les secondes
      load();
    </script>
  `);
});

// Routes internes pour appeler backend container
app.get("/list", async (req, res) => {
  const r = await fetch("http://backend:5000/users");
  const data = await r.json();
  res.json(data);
});

app.post("/create", async (req, res) => {
  const body = req.body;
  await fetch("http://backend:5000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  res.sendStatus(200);
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await fetch(`http://backend:5000/users/${id}`, { method: "DELETE" });
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Frontend running on 3000"));
