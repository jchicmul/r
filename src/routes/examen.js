const express = require('express');
const router = express.Router();
const pool = require('../database');
const nodeTable = require('nodetable');
const { isLoggedIn } = require('../lib/security');
const Swal = require('sweetalert2')

router.get('/induccion', isLoggedIn, async (req, res) => {
    res.render('./examen/induccion');
});

router.get('/induccions', isLoggedIn, async (req, res) => {
    var quest = [{
        "question" : "Primera Pregunta",
        "option1" : "Opción 1 de todas las respuestas, esta es la incorrecta",
        "option2" : "Opción 2",
        "option3" : "Opción 3",
        "option4" : "Opción 4",
        "answer" : "4"
    },
    {
        "question" : "Segunda Pregunta",
        "option1" : "Opción 1",
        "option2" : "Opción 2",
        "option3" : "Opción 3",
        "option4" : "Opción 4",
        "answer" : "4"
    }];
    res.send(quest);
});

router.post('/add', async (req, res, next) => {
    var { idd, deptod, puestod, salariod } = req.body;
    deptod = deptod.toUpperCase();
    puestod = puestod.toUpperCase();
    const newpuesto = {
        idd,
        deptod,
        puestod,
        salariod
    };

    await pool.query('INSERT INTO puestost SET ?', [newpuesto]);
    res.json('Agragado');
    
});

router.get('/delete/:idd', isLoggedIn, async (req, res) => {
    const idd = req.params.idd;
    await pool.query('DELETE FROM puestost WHERE idd = ?', [idd]);
    res.redirect('/puestos/add');
});

router.get('/update/:idd', isLoggedIn, async (req, res) => {
    const idd = req.params.idd;
    const puesto = await pool.query('SELECT * FROM puestost WHERE idd = ?', [idd]);
    res.render('puestos/update', puesto[0]);
});

router.post('/update/:idd',isLoggedIn, async (req, res) => {
    const { idd } = req.params;
    const { deptod, puestod, salariod } = req.body;
    const newpuesto = {
        deptod,
        puestod,
        salariod
    };
    await pool.query('UPDATE puestost set ? WHERE idd=?', [newpuesto,idd]);
    res.redirect('/puestos/add');

});

module.exports = router;