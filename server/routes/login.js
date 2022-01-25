const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('models/user.js');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;
    
    User.findOne({email : body.email}, (err, Usuario) => {

    if(err){
        return res.status(500).json({
            ok : false,
            err
        });
    }

    if(!user){
  
    return res.status(400).json({
        ok : false,
        err : {message : 'Usuario incorrecto'},
    });

    }

    if(!bcrypt.compareSync(body.password, Usuario.password)){

     return res.status(400).json({
         ok : false,
         err : {message : 'Contraseña invalida'}
     });
    }

    // PAILOD : informacion
    let token = jwt.sing({
    usuario : Usuario,
    }, proces.env.SEED, {expiresIn : process.env.EXPIRACION_TOKEN});
     
    res.json({
    ok : true,
    usuario : Usuario, //este usuario es el que envias al middleware
    token 
    });

    });

});









module.exports = app;