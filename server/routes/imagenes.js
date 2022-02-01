const express = require('express');

const fs = require('fs');
const path = require('path');
const {verificarTokenImg} = require('../middlewares/auth');
const app = express();


app.get('/imagen/:tipo/:img', verificarTokenImg, (req,res) => {

let tipo = req.params.tipo;
let img = req.params.img;
let noImagePath = path.resolve(__dirname, '../assests/no-image.jpg');
let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

if( fs.existsSync(pathImg)) res.sendFile(pathImg);

else res.sendFile(noImagePath);

});





module.exports = app;
