exports.up = function (knex) {
  knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("text");
      table.string("email", 129);
      table.string("role").defaultTo("admin");
    })
    .then(() => {
      console.log("Tabla de usuarios creada");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.down = function (knex) {};
