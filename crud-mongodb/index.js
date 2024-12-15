const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// CONEXION A LA BASE DE DATOS

mongoose.connect('mongodb://localhost:27017/examen2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar:', err));


// DEFINICION DEL ESQUEMA DE PRODUCTOS

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  cantidad: { type: Number, default: 0 },
  estado: { type: Number, default: 1 }
});


// INDICE EN EL REGISTRO "NOMBRE"

productoSchema.index({ nombre: 1 });

// MODELO

const Producto = mongoose.model('Producto', productoSchema);

// CRUD

// CREAR PRODUCTO

app.post('/productos', async (req, res) => {
  const producto = new Producto(req.body);
  await producto.save();
  res.send('Producto creado');
});


// LEER TODOS LOS PRODUCTOS

app.get('/productos', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// LEER POR ID

app.get('/productos/:id', async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  if (!producto) {
    return res.status(404).send('Producto no encontrado');
  }
  res.json(producto);
});

// ACTUALIZAR PRODUCTO POR ID

app.put('/productos/:id', async (req, res) => {
  const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!producto) {
    return res.status(404).send('Producto no encontrado');
  }
  res.json(producto);
});


// ELIMINAR PRODUCTO POR ID

app.delete('/productos/:id', async (req, res) => {
  const producto = await Producto.findByIdAndUpdate(req.params.id, { estado: 0 }, { new: true });
  if (!producto) {
    return res.status(404).send('Producto no encontrado');
  }
  res.send('Producto eliminado lógicamente');
});

// EJECUTAR EL CÓDIGO
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));
