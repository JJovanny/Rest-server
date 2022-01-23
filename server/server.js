require('./config/config');
const express = require('express');

const mongoose = require('mongoose');
    
const app = express();

app.use(bodyParser.json());

// los USE son middleware
app.use(require('./routes/users'));

// CONECTION

mongoose.connect(process.env.URLDB, (err, res) => {

if(err) throw err;

console.log('base de datos conectada');
});


// PUERTO

app.listen(process.env.PORT, () => {

console.log(`estas en el puerto ${process.env.PORT}`);

});


