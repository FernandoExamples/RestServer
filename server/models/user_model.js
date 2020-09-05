const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

//Definir un Schema que es un ORM que representa una coleccion de mongo
let userSchema = new Schema( {
  nombre: {
    type: String,
    require: [true, 'El nombre es necesario'],
  },
  email: {
    type: String,
    required: [true, 'El correo es necesario'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: {
      values: ['ADMIN_ROLE', 'USER_ROLE'],
      message: '{VALUE} no es un rol válido',
    },
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

//Aplicamos el plugin de unique-validator
userSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser único' });

//El modelo se exporta con el nombre de Usuario, no con userSchema
module.exports = mongoose.model('Usuario', userSchema);
