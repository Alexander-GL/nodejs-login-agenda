const { use } = require('passport');
const passport = require('passport'); // Modulo para cargar los datos en las sesiones
const LocalStrategy = require('passport-local').Strategy;
const User = require('../schemas/user');

passport.serializeUser((user, done) =>{
    done(null, user._id);
})

passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user) =>{
        done(err, user);
    })
})

passport.use(new LocalStrategy(
    {usernameField: 'email'},
    (email, password, done) =>{
        User.findOne({email}, (err, user) =>{
            if (!user) {
                return done(null, false, {message: 'Este email: ${email} no esta registrado'});
            } else {
                user.compararPassword(password, (err, sonIguales) =>{  
                    if (sonIguales) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'La contraseña no es valida'});
                    }
                })
            }
        })
    }
))

exports.estaAutenticado = (req, res, next) =>{
    if (req.isAuthenticated()){
        return next();
    }
    res.status(401).send('Tienes que hacer Login para acceder a este recurso');
}