const fs = require("fs");

class Contenedor {
  constructor() {
    this.filePath = "./productos.json";
  }

  getAll = async () => {
    try {
      const archivo = await fs.promises.readFile(this.filePath);
      const productos = JSON.parse(archivo);
      console.log("se obtuvo el listado completo de productos");
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
      console.log(`se guardo el producto con el id ${id}`);
    } catch (e) {}
  };
}

const contenedor = new Contenedor();

console.log(contenedor.getAll());

module.exports = Contenedor;
