var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  precioUni: {
    type: Number,
    required: [true, 'El precio unitario es necesario'],
  },
  descripcion: { type: String },
  disponible: {
    type: Boolean,
    required: [true, 'La propiedad disponible es requerida'],
    default: true,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: [true, 'La categoria es requerida'],
  },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
});

module.exports = mongoose.model('Producto', productoSchema);