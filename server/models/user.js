const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let rolValidate = {
values : ['ADMIN','USER-ROL'],
message : '{VALUE} no es un rol valido',
};


let user = new Schema({

nombre : {
type : String,
required : [true, 'El nombre es requerido']
},

email : {
type : String,
required : [true, 'El email es requerido'],
unique : true,
},

password : {
type : String,
required : [true,'La contraseña es requerida'],
},

img : {
type : String,
required : false,
},

rol : {
type : String,
default : 'USER_ROL',
enum : rolValidate,
},

estado : {
type : Boolean,
required : true
},

google : {
type : Boolean,
default : false
}
});


// lo que haces es no permitir pasar un campo al hacer un json
user.methods.toJSON = function() {

let usuario = this;
let userObject = usuario.toObject();
delete userObject.password;

return userObject;

}


user.plugin(uniqueValidator, {message : '{PATH}  debe de ser unico'});

module.exports = mongoose.model('Usuario',user);