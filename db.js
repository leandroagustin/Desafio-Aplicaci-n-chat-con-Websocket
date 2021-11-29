const knex = require("knex")({
  client: "mysql",
  connection: {
    //objeto de conexion
    host: "127.0.0.1", //donde esta mi base de datos
    port: 3307, // el puerto donde esta escuchando
    user: "root", //usuario por defecto
    password: "",
    database: "ecommerce", //base de dato a la cual me voy a conectar
  },
  pool: { min: 2, max: 8 }, //mi b de d va a manejar hilos de conexion como min: 2, max:8.
});
//productos
knex.schema
  .createTableIfNotExists("products", (table) => {
    table.increments("id").primary();
    table.string("title", 40);
    table.string("thumbnail", 200);
    table.string("price");
  })
  .then((res) => {
    console.log("tabla de productos creada!");
  })
  .catch((err) => {
    console.log(err);
  });
//usuarios
knex.schema
  .createTableIfNotExists("users", (table) => {
    table.increments("id").primary();
    table.string("text");
    table.string("email", 128);
    table.string("role").defaultTo("admin");
  })
  .then((res) => {
    console.log("Tabla de usuarios creada");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = knex;
