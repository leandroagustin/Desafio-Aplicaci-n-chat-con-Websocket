const express = require("express");
const app = express();
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const handlebars = require("express-handlebars");
const fs = require("fs");

//Trae Knex
const knex = require("./db");

// Server
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 8080;

// Para trabajar con form
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/products", productsRoutes);
app.use("/users", usersRoutes);

// Motores de plantillas >> Hbs
app.set("views", "./views");
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    layoutsDir: __dirname + "/views/layout",
    defaultLayout: "index",
    partialsDir: __dirname + "/views/partials",
  })
);

// Socket
const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

//Conexion Socket
io.on("connection", (socket) => {
  console.log("Cliente conectado");
  fs.readFile("./data/users.txt", "utf-8", (err, data) => {
    let info = JSON.parse(data);
    socket.emit("message_msn", info);
  });
  fs.readFile("./data/products.txt", "utf-8", (err, data) => {
    let info = JSON.parse(data);
    socket.emit("message_pr", info);
  });

  socket.on("dataText", (dataObj) => {
    fs.readFile("./data/users.txt", "utf-8", (err, data) => {
      let dataFile = JSON.parse(data);
      let newCom = {
        email: dataObj.email,
        text: dataObj.text,
      };
      dataFile.push(newCom);
      fs.writeFile("./data/users.txt", JSON.stringify(dataFile), (err) => {
        console.log("Comentario nuevo!");
        io.sockets.emit("message_msn", dataFile);
      });
    });
    //Knex
    knex("users") //que tabla uso
      .insert(dataObj)
      .then(() => {
        console.log("Texto enviado!");
      })
      .catch((err) => {
        console.log("Error al enviar");
      });
  });

  //Creo nuevo producto
  socket.on("newProd", (dataObj) => {
    fs.readFile("./data/products.txt", "utf-8", (err, data) => {
      let dataFile = JSON.parse(data);
      let items = dataFile.length;
      let id = parseInt(dataFile[items - 1].id) + 1;
      let newProd = {
        title: dataObj.title,
        price: dataObj.price,
        thumbnail: dataObj.thumbnail,
        id: id,
      };

      dataFile.push(newProd);
      fs.writeFile(
        "./data/products.txt",
        JSON.stringify(dataFile, null, 2),
        (err, data) => {
          console.log("Producto guardado");
          io.sockets.emit("message_pr", dataFile);
        }
      );
    });
    knex("products") //que tabla uso
      .insert(dataObj)
      .then(() => {
        res.send("Producto guardado!");
      })
      .catch((err) => {
        res.send("Error al guardar");
      });
  });
  socket.on("Confirm", () => {
    console.log("Actualizado");
  });
});

app.get("/", (req, res) => {
  res.render(__dirname + "/views/main.hbs");
});
//productos y chat
app.get("/prYuser", (req, res) => {
  res.render("prYuser");
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
