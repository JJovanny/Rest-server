// ========================
// PUERTO
// ========================

process.env.PORT = process.env.PORT || 3000;

// ========================
// ENTORNO
// ========================

// para saber si estoy en desarrollo o produccion (dev) = desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// ========================
// EXPIRACION TOKEN
// ========================
// 60seg, 60min, 24hrs, 30 dias

process.env.EXPIRACION_TOKEN = '48h' ;


// ========================
// SEED DE AUTENTICACION
// ========================

process.env.SEED = process.env.SEED || 'seed_de_desarrollo';



// ========================
// DATA BASE
// ========================

let urlDb;

if(process.env.NODE_ENV === 'dev'){

urlDb = 'mongodb://localhost:27017/cafe';

}else{

// la cadena de conexion que proporciona mLab
urlDb = 'mongodb://<dbuser>:<dbpassword>@ds213209.mlab.com:13209/cafe';

}

// te puedes inventar cualquier ENV
process.env.URLDB = urlDb;


// ========================
// GOOGLE CLIENT ID
// ========================


process.env.CLIENT_ID = process.env.CLIENT_ID || 'ElIdQueTeGenera.apps.googleusercontent.com';