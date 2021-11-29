const express = require("express");
const app = express();

const knex = require("./knexfile");

app.use(express.json());

app.get("/", (req, res) => {
  knex("users")
    .select("id", "email", "text")
    .then((json) => {
      console.log(json);
      res.send({ data: json });
    })
    .catch((err) => {
      res.send("Usuarios no encontrados");
    });
});

app.get("/:id", (req, res) => {
  knex("users")
    .where({ id: req.params.id })
    .then((response) => {
      res.json({ data: response });
    })
    .catch((err) => {
      res.send("Error al buscar usuario");
    });
});

app.post("/", (req, res) => {
  let data = {
    text: req.body.text,
    email: req.body.email,
  };
  knex("users")
    .insert(data)
    .then(() => {
      res.send("Nuevo mensaje de un nuevo integrante del chat!");
    })
    .catch((err) => {
      res.send("Error al enviar mensaje");
    });
});

app.put("/update/:id", (req, res) => {
  knex("users")
    .where({ id: req.params.id })
    .update({ text: req.body.text }) // solo actualizo los valores que me interesa
    .then((json) => {
      res.json({ data: json });
    })
    .catch((err) => {
      res.send("Error al editar mensaje");
    });
});

app.delete("/delete/:id", (req, res) => {
  knex("users")
    .where({ id: req.params.id })
    .del()
    .then((json) => {
      res.json({ data: "Mensaje eliminado!" });
    })
    .catch((err) => {
      res.send("Error al eliminar mensaje");
    });
});

app.listen(3006, () => {
  console.log("server on");
});
