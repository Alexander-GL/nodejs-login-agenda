var bcrypt = require('bcrypt-nodejs'); // Modulo para encriptar la contraseña
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
// Crear una nueva tabla para el Login 
var UserSchema = Schema({
    email: {type: String, unique: true, lowercase: true, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true}
}, {
    timestamps: true
});
// Metodo que se va a ejecutar antes de guardar un objeto
UserSchema.pre('save', function(next){
    const user = this; // Encriptar la contraseña con el modulo npm i --save bcrypt-nodejs
    if (!user.isModified('password')) { // Preguntar si hubo un cambio en la contraseña
        return next();
    }

bcrypt.genSalt(10, (err, salt) =>{ // Callback que recibe un error y el argumento que estamos buscando
    if(err){
        next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) =>{ // Recibe un progreso de la criptografia de la contraseña
        if(err){
            next(err);
        }
        user.password = hash; // Se sustituye la contraseña con el hash que nos llega ya encriptado
        next(); // Llamamos next para que la información sea almacenada en la base de datos
    })
})
})

UserSchema.methods.compararPassword = function(password, cb){ // Comparar la contraseña cuando el usuario quiere hacer un login y el hash
    bcrypt.compare(password, this.password, (err, sonIguales) =>{ // Si son iguales va a ser true
        if(err){
            return cb(err); 
        }
        cb(null, sonIguales);
    })
}

module.exports = mongoose.model('users', UserSchema); // Crea un modelo que se va a llamar Usuario y el schema que se acaba de crear