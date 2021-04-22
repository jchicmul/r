const express = require('express');
const router = express.Router();
const pool = require('../database');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/security');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('login/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failereFlash: true
}));

router.get('/home', isLoggedIn, (req, res) => {
res.render('home');
});

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('login/signin');
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/home',
        failureRedirect: '/signin',
        failereFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports= router;