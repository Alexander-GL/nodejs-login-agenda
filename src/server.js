const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const MONGO_URL = 'mongodb://127.0.0.1:27017/crud-mongo';
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./config/passport');
const cookieParser = require('cookie-parser');
  
const server = express(); // Se usa y se inicializa el modulo express

  // Conexión a la BD
  mongoose.set('useFindAndModify', false);
  mongoose.connect('mongodb://127.0.0.1:27017/crud-mongo',{
    useNewUrlParser: true,
  useUnifiedTopology: true
  })
  .then(db => console.log('Base de Datos Conectada'))  // Funciones que se van a ejecutar cuando pase un evento
  .catch(err => console.log(err));


// Sesiones y Cookies
mongoose.Promise = global.Promise; // Configurar las promesas que vamos a usar
mongoose.connect(MONGO_URL); // Se conecta al MONGO_URL
mongoose.connection.on('error', (err) =>{ // Si ocurre un error lo vamos a imprimir en la consola y detenemos el proceso
  throw err;
  process.exit(1);
})

  // Middlewares usuario
  server.use(passport.initialize());
  server.use(cookieParser());
  server.use(passport.session());
  server.use(session({
    secret: 'AlexanderGarcíaUDG',
    resave: true,
    saveUninitialized: true , // La sesion es un objeto en blanco y esto guarda este objeto vacio
    store: new MongoStore({
      url: MONGO_URL,
      autoReconnect: true
    })
  }))
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({extended: true}));

  // Importar rutas del usuario
  const controladorUsuario = require('./routes/index');

  server.post('/signup', controladorUsuario.postSignup);
  server.post('/login', controladorUsuario.postLogin);
  server.get('/logout', passportConfig.estaAutenticado, controladorUsuario.logout); // En caso que este autenticado se correra la funcion del logout

  server.get('/usuarioInfo', passportConfig.estaAutenticado, (req, res) =>{
  res.json(req.user);
});

  // Importar rutas de la agenda --------------------------------------------------------------------------------------------------------------
const indexRoutes = require('./routes/index');
require('./models/routes')(server, passport);

  // Configuraciones
  server.set('port', process.env.PORT || 3000);
  server.set('views', path.join(__dirname, 'views'));
  server.set('view engine', 'ejs');
 
  // Middlewares
  server.use(morgan('dev'));
  server.use(express.urlencoded({extended: false})) // Se encarga de entender los datos que manda un usuario en HTML

  // Rutas
  server.use('/', indexRoutes);

  // Archivos Estaticos
  server.use(express.static(path.join(__dirname, 'views')));

  // Inicializando el servidor
  server.listen(server.get('port'), () =>{
  console.log(`Servidor en el puerto ${server.get('port')}`);
});
 