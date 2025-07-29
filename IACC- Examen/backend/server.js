const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (ajusta la URI si usas MongoDB Atlas o local)
mongoose.connect('mongodb://localhost:27017/gestion_despachos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Esquema y modelo de Proyecto
const proyectoSchema = new mongoose.Schema({
  id: String,
  nombre: String,
  cliente: String,
  componentes: Array,
  envios: Array,
});
const Proyecto = mongoose.model('Proyecto', proyectoSchema);

// Endpoint para obtener todos los proyectos
app.get('/api/proyectos', async (req, res) => {
  const proyectos = await Proyecto.find();
  res.json(proyectos);
});

// Endpoint para crear un nuevo proyecto
app.post('/api/proyectos', async (req, res) => {
  const nuevoProyecto = new Proyecto(req.body);
  await nuevoProyecto.save();
  res.json(nuevoProyecto);
});

// Actualizar componentes de un proyecto
app.put('/api/proyectos/:id/componentes', async (req, res) => {
  const { id } = req.params;
  const { componentes } = req.body;
  const proyecto = await Proyecto.findOneAndUpdate(
    { id },
    { $set: { componentes } },
    { new: true }
  );
  res.json(proyecto);
});

// Agregar un nuevo envío a un proyecto
app.post('/api/proyectos/:id/envios', async (req, res) => {
  const { id } = req.params;
  const { envio } = req.body;
  const proyecto = await Proyecto.findOneAndUpdate(
    { id },
    { $push: { envios: envio } },
    { new: true }
  );
  res.json(proyecto);
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log('Servidor backend escuchando en http://localhost:3001');
});