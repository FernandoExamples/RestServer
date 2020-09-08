const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la categoria es requerido'],
    unique: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    require: true,
  },
});

categorySchema.plugin(uniqueValidator, {
  message: 'El {PATH} de la categoria ya existe',
});

module.exports = mongoose.model('Categoria', categorySchema);
