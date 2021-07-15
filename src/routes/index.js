const express = require('express');
const router = express.Router();  // Se encarga de almacenar un objeto
const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
const User = require('../schemas/user');
const Task = require('../schemas/task');

// LOGIN & SIGNUP ------------------------------------------------------------------------------------------------------


router.postSignup = (req, res, next) =>{  // Recibe la informacion del Signup
    const nuevoUsuario = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    });

    User.findOne({email: req.body.email}, (err, usuarioExistente) =>{ // Revisar si existe el usuario y validar si existe o no
        if (usuarioExistente) {
            return res.status(400).send('Ya ese email esta registrado');
        }
        nuevoUsuario.save((err) =>{ // Si ocurrio un error se pasa al Middleware next() 
            if (err) {
                next(err);
            }
            req.logIn(nuevoUsuario, (err) =>{ // Pero si no hubo algun error se hace el login
                if (err) {
                    next(err);
                }
                res.redirect('/');
            })
        })
    })
}

router.postLogin = (req, res, next) =>{ // Recibir una llamada y se hace la validación
    passport.authenticate('local', (err, user, info) =>{
        if (err) {
            next(err);
        }
        if (!user) {
            return res.status(400).send('Email o contraseña no válidos');
        }
        req.logIn(user, (err) =>{
            if (err) {
                next(err);
            }
            //res.render('agenda');
        })
    }) (req, res, next);
}

// Metodo para salir de la sesión
router.logout = (req, res) =>{
    req.logout();
    res.send('Logout exitoso');
} 

// AGENDA CRUD ------------------------------------------------------------------------------------------------------
router.get('/login', async (req, res) =>{
    const tasks = await Task.find();
    console.log(tasks);
    res.render('agenda', {
        tasks
    });
}); 

router.post('/add', async (req, res) =>{
    const task = new Task(req.body); // Crea un objeto con los datos del Schema
    await task.save();   // Tengo un nuevo dato y voy a almacenarlo
    res.redirect('/login');
});

router.get('/turn/:id', async (req, res) =>{
    const {id} = req.params;
    const task = await Task.findById(id);
    task.status = !task.status;
    await task.save();
    res.redirect('/login');
});

router.get('/edit/:id', async (req, res) =>{
    const {id} = req.params;
    const task = await Task.findById(id);
    res.render('edit', {
        task
    });
});

router.post('/edit/:id', async (req, res) =>{
    const {id} = req.params;
    await Task.update({_id: id}, req.body);
    res.redirect('/login');
});

router.get('/delete/:id', async (req, res) =>{
    const {id} = req.params;
    await Task.remove({_id: id});
    res.redirect('/login');
});

module.exports = router;
