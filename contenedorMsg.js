const fs = require("fs");

class ContenedorMsg {
  constructor() {
    this.filePath = "./chat.json";
  }

  getAll = async () => {
    try {
      const archivo = await fs.promises.readFile(this.filePath);
      const productos = JSON.parse(archivo);
      console.log("se obtuvo el listado completo de mensajes");
      return productos;
    } catch (e) {
      console.log(e);
    }
  };

  save = async (producto) => {
    try {
      const productos = await this.getAll();
      const id =
        productos.length === 0 ? 1 : productos[productos.length - 1].id + 1;
      producto.id = id;
      productos.push(producto);

      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(productos, null)
      );
      console.log(`se guardo el mensaje con el id ${id}`);
    } catch (e) {}
  };

  getById = async (id) => {
    try {
      const dataRecuperada = await this.getAll();
      const dataNueva = dataRecuperada.find((data) => data.id == id);
      return dataNueva;
    } catch (e) {
      console.log(e);
    }
  };

  async deleteById(id) {
    try {
      const productos = await this.getAll();
      const productoEncontrado = productos.find((e) => e.id == id);
      if (!productoEncontrado) return console.log("el id no existe");
      const productosFiltrados = productos.filter((e) => e.id != id);
      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(productosFiltrados, null)
      );
      console.log("producto borrado");
    } catch (e) {
      console.log(e);
    }
  }

  deleteAll = async () => {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify([], null));
      console.log("se borraron todos los productos");
    } catch (e) {
      console.log(e);
    }
  };

  updateById = async (id, title, price, thumbnail) => {
    try {
      const productos = await this.getAll();
      const item = productos.find((prod) => prod.id == id);
      if (item) {
        item.title = title;
        item.price = price;
        item.thumbnail = thumbnail;
        console.log(item);
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify(productos, null, 2)
        );
        return item;
      } else {
        return { error: "Producto no encontrado" };
      }
    } catch (error) {
      console.log(error);
    }
  };
}

const contenedorMsg = new ContenedorMsg();

module.exports = ContenedorMsg;
