require('./config/config');
const express = require('express');

const mongoose = require('mongoose');

const path = require('path');
    
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : false}));

app.use(bodyParser.json());

// los USE son middleware
app.use(require('./routes/index'));


// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname +'../public') ));



// CONECTION

mongoose.connect(process.env.URLDB, (err, res) => {

if(err) throw err;

console.log('base de datos conectada');
});


// PUERTO

app.listen(process.env.PORT, () => {

console.log(`estas en el puerto ${process.env.PORT}`);

});


