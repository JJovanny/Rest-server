const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Config google

let verify = async (token) => {

let ticket = await client.verifyIdToken({ 
idToken : token,
audience : process.env.CLIENT_ID
});

 // payload : obtenemos la info del user
let payload = ticket.getPayload();
console.log(payload.name);

}


app.get('/google', async (req,res) => {

let token = req.body.id_token;

let googleUser = await verify(token)
.catch(e =>{
    return res.status(403).json({
     ok : false,
     e
    })
});

             // si el usuario es igual al de google
Usuario.findOne({email : googleUser.email}, (err, usuario) => {

if(err){

    return res.status(500).json({
    ok : false,
    err : {message : 'Lo siento ya existe ese email'}
    });

}

// si existe
if(usuario){

// si no se ha autenticado por googel
if(usuario.google === false){

return res.status(400).json({ok : false, err : {message : 'debe usar su autenticacion normal'}});

}else{ //si se ha autenticado por google, renovar su token

let token = jwt.sing({
usuario,
}, process.env.SEED, {expiresIn : process.env.EXPIRACION_TOKEN});

return res.json({
ok : true,
usuario,
token
});

}


}else{

//  si el usuario no existe en nuestra base de datos

let usuario = new Usuario();

usuario.nombre = googleUser.nombre;
usuario.email = googleUser.email;
usuario.img = googleUser.img;
usuario.google = true;


usuario.save((err, usuario) => {

    if(err){return res.status(400).json({ok : false, err}) }
    

    let token = jwt.sing({
        usuario,
        }, process.env.SEED, {expiresIn : process.env.EXPIRACION_TOKEN});
        
        return res.json({
        ok : true,
        usuario,
        token
        });
        
        });

}



});

});


module.exports = app;