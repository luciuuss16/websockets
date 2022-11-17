const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const Contenedor = require("./contenedor");
const contenedor = new Contenedor();
const ContenedorMsg = require("./contenedorMsg");
const contenedorMsg = new ContenedorMsg();

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(PORT, () =>
  console.log("SERVER ON http://localhost:" + PORT)
);

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connect", async (socket) => {
  console.log(`nuevo cliente conectado ${socket.id}`);
  socket.emit("productList", await contenedor.getAll());
  socket.emit("msgList", await contenedorMsg.getAll());

  socket.on("product", async (data) => {
    await contenedor.save(data);
    console.log("Se recibio un producto nuevo", "producto: ", data);
    io.emit("productList", await contenedor.getAll());
  });

  socket.on("msg", async (data) => {
    await contenedorMsg.save({
      socketid: socket.id,
      timestamp: timestamp,
      ...data,
    });
    console.log("se recibio un msg nuevo", "mensaje: ", data);
    io.emit("msgList", await contenedorMsg.getAll());
  });
});
