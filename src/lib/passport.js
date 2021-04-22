const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { num, email } = req.body;
    const id = num;
    const nvl = 1;
    username = username.toUpperCase();
    const newuser = {
        id,
        username,
        email,
        password,
        nvl
    };
    newuser.password = await helpers.encryptPassword(password);
    console.log(newuser);
    const result = await pool.query('INSERT INTO users set ?', [newuser]);
    return done(null, newuser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const row = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, row[0]);
});

passport.use('local.signin', new localStrategy({
    usernameField: 'num',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, num, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [num]);
    if (rows.length > 0) {
        const row = rows[0];
        const validPassword = await helpers.matchPassword(password, row.password);
        if (validPassword) {
            done(null, row, req.flash('success', 'Bienvenido ' + row.username));
        } else {
            done(null, false, req.flash('message', 'Password Incorrecto'));
        }
    } else {
        done(null, false, req.flash('message', 'Usuario no existe'));
    }
}));
