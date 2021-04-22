const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/security');

router.get('/',isNotLoggedIn, (req, res) => {
    res.render('index');
});

module.exports = router;