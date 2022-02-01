const express = require('express');

const fileUpload = require('express-fileupload');
const Usuario = require('./models/user');
const Producto = require('./models/producto');
const app = express();

const fs = require('fs');
const path = require('path');

app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

let tipo = req.params.tipo;
let id = req.params.id;


// si no vienen archivos
if(!req.files) return res.status(400).json({ok : false, err : {msj : 'no hay algun archivo a subir'}});

let tiposValidos = ['productos', 'usuarios'];

if(tiposValidos.indexOf(tipo) < 0){

res.status(400).json({ok : false, err : {message : 'no hay ese tipo de categoria'}});

}

                       //nombre del input 
let archivo = req.files.inputName;

// Extensiones permitidas

let extensValidas = ['png','jpg','gif','jpeg'];
let nameCortado = archivo.name.split('.');
let extension = nameCortado[nameCortado.length -1];

// para buscar en el array/ si es menor a 0 ya que el array es hasta 0
if(extensValidas.indexOf( extension ) < 0){

return res.status(400).json({
    ok : false, 
    err : {message : 'las extensiones permitidas son' + extensValidas.join(',')}
}); 

}

// Cambiar nombre de archivo
let nombreArchivo = `${id}-${new Date().getMilliseconds() }.${extension}`;


// para decir en que ruta se almacenara
archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

if(err) return res.status(500).json({ok : false, err});

res.json({ok : true, message : 'success'});

if(tipo === 'usuario'){ 
     imagenUsuario(id, res, nombreArchivo );
}else{
imagenProducto(id, res, nombreArchivo);
}

});

});


let imagenUsuario = (id, res, nombreArchivo) => {

Usuario.findById(id, (err,usuario) => {

if(err) { 
borrarArchivo(nombreArchivo, 'usuarios'); 
return res.status(500).json({ok : false, err});
}

if(!usuario){
borrarArchivo(nombreArchivo, 'usuarios'); 
return res.status(400).json({ok : false, err : {message : 'no existe el usuario'}});
} 

borrarArchivo(usuario.img, 'usuarios');

usuario.img = nombreArchivo;
usuario.save( (err,success) => {

res.json({ok : true, usuario : sucecess, img : nombreArchivo});

});

});

}



let imagenProducto = (id, res, nombreArchivo) => {

    Producto.findById(id, (err, producto) => {

   if(err) {
        borrarArchivo(nombreArchivo, 'productos'); 
        return res.status(500).json({ok : false, err});
   }

   if(!producto){
    borrarArchivo(nombreArchivo, 'productos'); 
    return res.status(400).json({ok : false, err});
   } 

   borrarArchivo(nombreArchivo, 'productos'); 

   producto.img = nombreArchivo;
   producto.save( (err, producto) => {

    res.json({ok : true, producto, img : nombreArchivo});

   });

    });



    
}


let borrarArchivo = (nombreImg, tipo) => {

                   //subir a server/bajar a uploads
let pathImg = path.resolve(__dirname,`../../uploads/${tipo}/${usuario.img}`);

     //si existe o no          //eliminar archivo
if( fs.existsSync(pathImg) ) fs.unlinkSync(pathImg);

}

module.exports = app;