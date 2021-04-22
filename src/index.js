const express = require('express');
const morgan = require('morgan');
const hb = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const hbs = require('handlebars-helpers');
const mh = hbs();

const app = express();
require('./lib/passport');
const { database } = require('./keys');

// Configuración
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hb({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//middleware
app.use(session({
    secret: 'Chapis0877',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Rutas
app.use(require('./routes'));
app.use(require('./routes/auth'));
app.use('/contrato', require('./routes/contrato'));
app.use('/trabajador', require('./routes/trabajador'));
app.use('/puestos', require('./routes/puestos'));
app.use('/cursos', require('./routes/cursos'));
app.use('/examen', require('./routes/examen'));
app.use('/usuarios', require('./routes/control'));
app.use('/reportes', require('./routes/reportes'));

// Publicos
app.use(express.static(path.join(__dirname, 'public')));

//Helpers


// Inicio del servidor
app.listen(app.get('port'), () => {
    console.log('Servidor Conectado en el puerto ', app.get('port'));
});
