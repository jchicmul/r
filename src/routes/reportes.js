const express = require('express');
const { deserializeUser } = require('passport');
const router = express.Router();
const pool = require('../database');

router.get('/reingresos/', async (req, res) => {
    const { id } = req.params;
    const listaContratos = `
            SELECT LPAD(t.id,4,"0") as id, CONCAT(t.paterno, " ", t.materno, " ", t.nombre) as Nombre,
            p.puestod, p.deptod 
            FROM trabajadort t
            INNER JOIN contratot c
            ON t.id = c.id
            INNER JOIN puestost p
            on t.salario = p.idd
            WHERE c.nl = 5 AND c.tm IN ('A','R') AND aut = 'SI' 
            ORDER BY t.id
    `;
    const contratos = await pool.query(listaContratos);
    res.render('reportes/altasReingresos', { contratos });
});

router.get('/datosContratos/:id', async (req, res) => {
    const { id } = req.params;
    const listaContratos = `
            SELECT LPAD(t.id,4,"0") as id, CONCAT(t.paterno, " ", t.materno, " ", t.nombre) as Nombre,
            p.puestod, p.deptod, c.diasr
            FROM trabajadort t
            INNER JOIN contratot c
            ON t.id = c.id
            INNER JOIN puestost p
            on t.salario = p.idd
            WHERE c.nl = 5 AND c.tm IN ('A','R') AND c.aut = 'SI' AND c.id = ` + id + ` ORDER BY t.id`;
    const contratos = await pool.query(listaContratos);
    res.send(contratos[0]);
});


module.exports = router;