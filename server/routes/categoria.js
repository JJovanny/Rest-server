const express = require('express');

const Categoria = require('./models/categoria');
const {verificar, verificarRolAdmin} = require('../middlewares/auth');
const app = express();
 

// ===========================
// MOSTRAR TODAS LAS CATEGORIAS
// ============================
app.get('/categoria', (req, res) => {

    Categoria.find({})
.sort('descripcion')
.populate('usuario', 'nombre email')
.exec( (err,categorias) => {

if(err) { return res.status(400).json({ok : false, err}); }

res.json({ok : true, categorias});
});

});


// ===========================
// MOSTRAR UNA CATEGORIA POR ID
// ============================

app.get('/categoria/:id', verificar, (req,res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

if(err){return res.status(500).json({ok:false, err})}

if(!categoria){res.status(400).json({ok:false, err : {message : 'No existe una categoria con ese id'} }) }

res.json({ok : true, categoria});

});



});


// ===========================
// CREAR CATEGORIA
// ============================

app.post('/categoria', verificar, (req,res) => {

let body = req.body;

let categoria = new Categoria({
descripcion : body.descripcion,
usuario : req.usuario._id //para obtenerlo en el req, hay que usar el verificar()
});

categoria.save((err, categoria) => {

if(err){ return res.status(500).json({ok : false, err});}

if(!categoria){ return res.status(400).json({ok : false, err});}

res.json({ok:true, categoria});

});

});


// ===========================
// ACTUALIZAR CATEGORIA
// ============================

app.put('/categoria/:id', verificar, (req,res) => {

let id = req.params.id;
let body = req.body;
let desCategoria = {descripcion : body.descripcion};

Categoria.findByIdAndUpdate(id, desCategoria, {new : true, runValidators : true}, (err,categoria) => {

if(err){ res.status(500).json({ ok : false, err});}

if(!categoria){res.status(400).json({ok : false, err : {message : 'La categoria con ese id no existe'}});}

res.json({ok:true, categoria});

});

});



// ===========================
// ELEIMINAR CATEGORIA
// ============================

app.delete('/categoria/:id', [verificar,verificarRolAdmin], (req, res) => {

let id = req.params.id;

Categoria.findByIdAndRemove(id, (err, categoria) => {

if(err){return res.status(400).json({ok : false, err})}

res.json({ok : true, categoria});

});

if(!categoria){return res.status(400).json({ok:false, err:{message : 'no existe una categoria con ese id'}})}

res.json({ok:true, message : 'categoria borrada'});

});






module.exports = app;