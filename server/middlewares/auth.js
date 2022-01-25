const jwt = require('jsonwebtoken');


// ========================
// VERIFICAR TOKEN
// ========================

let verificar = (req, res, next) => {

let token = req.get('token'); //Si se usa 'Autorization' se debe usar ese

// verificar si el token es valido
jwt.verify(token, process.env.SEED, (err, decoded) => {

if(err) { 
    return res.status(401).json({
        ok : false, 
        err : {message : 'Token no valido'}
    });  
}

req.usuario = decoded.usuario;
next();

});



}

// ========================
// VERIFICAR ROL USUARIO
// ========================


let verificarRolAdmin = (req, res, next) => {

let usuario = req.usuario;

if(usuario.rol != 'ADMIN'){

    return res.status(400).json({
        ok : false,
        err : {
            message : 'no tienes permisos para ejecutar la accion',
        }
    });
}

next();


}


module.exports = {verificar,verificarRolAdmin};