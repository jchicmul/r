const express = require('express');
const router = express.Router();
const pool = require('../database');
const nodeTable = require('nodetable');
const Excel = require('exceljs');
const { isLoggedIn } = require('../lib/security');

router.get('/usuarios', isLoggedIn, async (req, res) => {
    const listaUsers = `SELECT * FROM users ORDER BY id`;
    const usuarios = await pool.query(listaUsers);
    res.render('control/listaUsuario',{ usuarios });
});

router.get('/usuario/:id', isLoggedIn, async (req, res) => {
    var id = req.params.id;
    console.log(id);
    const listaUser = `SELECT * FROM users WHERE id = ` + id;
    const usuario = await pool.query(listaUser);
    res.send(usuario[0]);
});

router.post('/cambioNivel',isLoggedIn, async (req, res) => {
    const { id, nvl } = req.body;
    console.log(req.body);
    const newNivel = {
        nvl
    };
    await pool.query('UPDATE users SET nvl = ? WHERE id = ?', [nvl, id]);
    res.send('1');
});

module.exports = router;