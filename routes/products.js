const express = require("express");
const knex = require("../db");
// const knex = require("../db");
const { Router } = express;
const router = new Router();

//Mostrar todos los productos
router.get("/", (req, res) => {
  knex
    .from("products")
    .then((data) => {
      res.json({ data: data });
    })
    .catch((err) => {
      res.send("Error al mostrar productos!");
    });
});
//Mostrar por id
router.get("/:id", (req, res) => {
  let { id } = req.params;
  knex
    .from("products")
    .select("title", "price") //Solo muestra el title y el price del id.
    .where({ id: id })
    .then((json) => {
      res.send({ data: json });
    })
    .catch(() => {
      res.send("Error al buscar usuario");
    });
});
router.post("/", (req, res) => {
  let data = {
    title: req.body.title,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
  };
  knex("products")
    .insert(data)
    .then(res.send("Producto guardado correctamente!"))
    .catch((err) => {
      res.send("Error al guardar producto");
    });
});
//Actualizar
router.put("/update/:id", (req, res) => {
  knex("products")
    .where({ id: req.params.id })
    .update({
      title: req.body.title,
      price: req.body.title,
    })
    .then((json) => {
      res.send({ data: json });
    })
    .catch(() => {
      res.send("Error al actualizar producto!");
    });
});
//Eliminar
router.delete("/delete/:id", (req, res) => {
  knex("products")
    .where({ id: req.params.id })
    .del()
    .then((json) => {
      res.send({ data: `Usuario: ${id} eliminado!` });
    })
    .catch((err) => {
      res.send("Error al eliminar");
    });
});
module.exports = router;
