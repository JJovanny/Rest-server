const mongoose = require('mongoose');
const Schema = mongoose.Schema();

let categoria = new Schema({

descripcion : {type : String, unique : true, requeride : true },
usuario : {type : Schema.Types.ObjectId, ref :'Usuario'}

});


module.exports = mongoose.model('Categoria', categoria);