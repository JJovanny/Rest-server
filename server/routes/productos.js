const express = require('express');

const Productos = require('./models/producto');
const {verificar, verificarRolAdmin} = require('./middlewares/auth');
const app = express();


app.get('/produtos', verificar, (req, res) => {

    Productos.find({disponible : true})
    .populate('usuario', 'nombre, email')
    .populate('Categoria', 'descripcion')
    .exec( (err, productos) => {

    if(err){ return res.status(400).json({ok : false, err})}

    res.json({ok : true, productos});
});

});


app.get('/produtos/:id', verificar, (req, res) => {

    let id = req.params.id;

    Productos.findById(id)
    .populate('Usuario', 'nombre email')
    .populate('Categoria', 'descripcion')
    .exec((err, productos) => {
    
    if(err){ return res.status(500).json({ok : false, err})}
    
    if(!productos){return res.status(400).json({ok : false, err : {message : 'el producto no existe'}})}

    res.status(200).json({ok : true, productos});

});
});


// ======================
// Buscar Productos
// ======================

app.get('/productos/search/:termino', verificar, (req,res) => {

let termino = req.params.termino;
let regex = new RegExp(termino, 'i');

Producto.find({nombre : regex})
.populate('Categorias', 'nombre')
.exec( (err, producto) => {

if(err) {res.status(500).json({ok:false, err})}

res.json({ok:true, producto});

});


});



app.post('/productos', verificar, (res,req) => {

let body = req.body;

let productos = new Productos({
    nombre : body.nombre,
    precioUni : body.precioUni,
    descripcion : body.descripcion,
    disponible : body.disponible,
    categoria : body.categoria,
    usuario : req.usuario._id
});

productos.save( (err, productos) => { 

if(productos){return res.status(500).json({ok : false, err : {message : 'ya existe el producto'}}); }

res.status(201).json({ok : true, productos});

});

});


app.put('/productos/:id', verificar, (req, res) => {

let id = req.params.id;
let body = req.body;


Productos.findById(id, (err, productos) => {

if(err){res.status(500).json({ok:false, err})}

if(!productos){res.status(400).json({ok:false, err : {message : 'no existe un producto con ese id'}})}

Productos.nombre = body.nombre;
Productos.precioUni = body.precioUni;
Productos.descripcion = body.descripcion;
Productos.disponible = body.disponible;
Productos.categoria = body.categoria;
Productos.categoria = body.usuario;

Productos.save( (err, producto) => {

    if(err){ return res.status(500).json({ok : false, err});}
    res.status(201).json({ok : true, producto});

});


});

});


app.delete('/productos/:id', [verificar, verificarRolAdmin], (req,res) => {

let id = req.params.id;

Productos.findByIdAndRemove(id, (err, producto) => {

if(err){res.status(500).json({ok:false, err})}
res.json({ok : true, message : 'eliminado'});

if(!producto){res.status(400).json({ok:false, err})}
res.json({ok : true, message : 'eliminado'});

});



});


module.exports = app;