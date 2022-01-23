const express = ('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('./models/user');

const app = express();

// RUTAS
app.get('/usuario', (req,res) => {

let desde = req.query.desde || 0;
desde = Number(desde);

let limite = req.query.limite || 5;
limite = Number(limite);


User.find({estado : true}, 'nombre email rol estado img')
.skip(desde)
.limit(limite)
.exec( (err,users) => {

if(err){

return res.status(400).json({
    ok : 'false',
    err
});
}

User.count({estado : true}, (err, conteo) => {

res.json({
ok : true,
users,
conteo
});


});



});


});
    
    
    app.post('/user', (req,res) => {
    
        let body = req.body;
    
        let user = new User({
            nombre : body.nombre,
            email : body.email,
            password : bcrypt.hashSync(body.password, 10),
            img : body.img,
            rol : body.rol 
        });

        user.save((err, userDb) => {

            if(err){
                return res.status(400).json({
                    ok : false,
                    err
                });
            }

            res.json({
            ok : true,
            usuario : userDb
            });

        });

    });

    
        app.put('/user/:id', (req,res) => {
    
      // id del parametro
let id = req.params.id;
let body = _.pick(req.body,['nombre','email','img','rol','estado']);


User.findByIdAndUpdate(id, body, {new : true, runValidators :true}, (err, userDb) => {

           if(err){
            return res.status(400).json({
            ok : false,
            message : err
            });
           }

            res.json({ok : true, usuario : userDb});
            
            });


        });


app.delete('/user/:id', (req,res) => {

let id = req.params.id;

let changeEstado = {
    estado : false
}

// User.findByIdAndRemove(id, (err, userDelete) => {
User.findByIdAndUpdate(id, {changeEstado}, {new : true}, (err,userDelete) =>{

if(err){

return res.status(400).json({
    ok : false,
    err
})

};


if(!userDelete){

return res.status(400).json({
    ok : false,
    err : {
      message :  'no existe un usuario con ese id'
    }
});

};


res.json({
ok : true,
user : userDelete
});

});


});



    
module.exports = app;