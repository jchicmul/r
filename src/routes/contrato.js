const express = require('express');
const { deserializeUser } = require('passport');
const router = express.Router();
const pool = require('../database');

router.get('/contratos/:id', async (req, res) => {
    const { id } = req.params;
    const listaContratos = `
            SELECT LPAD(t.id,4,"0") as id, CONCAT(t.paterno, " ", t.materno, " ", t.nombre) as Nombre,
            DATE_FORMAT(t.ingreso,"%d/%m/%Y") as ingreso, c.numcon, DATE_FORMAT(c.termino,"%d/%m/%Y") as termino, 
            p.puestod 
            FROM trabajadort t
            INNER JOIN contratot c
            ON t.id = c.id
            INNER JOIN puestost p
            on t.salario = p.idd
            WHERE t.encargado = ` + id +
        ` AND c.nl = 2 AND c.tm = 'N'
            ORDER BY t.id
    `;
    const contratos = await pool.query(listaContratos);
    res.render('contratos/renovacion', { contratos });
});

router.get('/evaluacion/:id', async (req, res) => {
    var { id } = req.params;
    id = Number(id);
    const contrato = `
            SELECT LPAD(t.id,4,"0") as id, CONCAT(t.paterno, " ", t.materno, " ", t.nombre) as Nombre,
            DATE_FORMAT(t.ingreso,"%d/%m/%Y") as ingreso, c.numcon, DATE_FORMAT(c.termino,"%d/%m/%Y") as termino 
            FROM trabajadort t
            INNER JOIN contratot c
            ON t.id = c.id
            WHERE t.id = ` + id +
        ` AND c.nl = 2
    `;
    const contrat = await pool.query(contrato);
    res.send(contrat[0]);
});

router.post('/evaluacion/', async (req, res) => {
    //const { id } = req.params;
    var { id, dc0, dc1, dc2, dc3, dc4, dc5, dc6, dc7, dc8, dc9, comentario, aut, diasr } = req.body;
    const nl = 3;
    comentario = comentario.toUpperCase();
    const newCalificacion = {
        nl,
        dc0,
        dc1,
        dc2,
        dc3,
        dc4,
        dc5,
        dc6,
        dc7,
        dc8,
        dc9,
        comentario,
        aut,
        diasr
    };
    await pool.query('UPDATE contratot SET ? WHERE id = ?', [newCalificacion, id]);
    res.send('1');
});

router.get('/autorizacion/:nvl', async (req, res) => {
    const { nvl } = req.params;
    const listaAut = `
            SELECT LPAD(t.id,4,"0") as id, CONCAT(t.paterno, " ", t.materno, " ", t.nombre) as Nombre,
            DATE_FORMAT(t.ingreso,"%d/%m/%Y") as ingreso, c.numcon, DATE_FORMAT(c.termino,"%d/%m/%Y") as termino,
            CONCAT(`+ nvl + `,LPAD(t.id,4,"0")) as clave, diasr, dias, aut 
            FROM trabajadort t
            INNER JOIN contratot c
            ON t.id = c.id
            WHERE c.nl = ` + nvl +
        ` AND c.tm = 'N' ORDER BY c.termino
    `;
    const autorizado = await pool.query(listaAut);
    res.render('contratos/autorizacion', { autorizado });
});

router.get('/evaluado/:nvl', async (req, res) => {
    const { nvl } = req.params;
    const num = nvl.substr(1, 4);
    const nivel = nvl.substr(0, 1)
    const listaAut = `
            SELECT LPAD(t.id,4,"0") as id, CONCAT(t.paterno, " ", t.materno, " ", t.nombre) as Nombre,
            DATE_FORMAT(t.ingreso,"%d/%m/%Y") as ingreso, c.numcon, DATE_FORMAT(c.termino,"%d/%m/%Y") as termino,
            c.dc0, c.dc1, c.dc2,c.dc3,c.dc4,c.dc5,c.dc6,c.dc7,c.dc8,c.dc9,c.comentario,aut,diasr 
            FROM trabajadort t
            INNER JOIN contratot c
            ON t.id = c.id
            WHERE c.nl = ` + nivel +
        ` AND t.id = ` + num +
        ` ORDER BY c.termino
    `;
    const vistoCon = await pool.query(listaAut);
    res.send(vistoCon[0]);
});

router.post('/autorizacion/', async (req, res) => {
    var { id, nl, aut, diasr } = req.body;
    var nvl = nl - 1;
    const newAutoriza = {
        nl,
        aut,
        diasr
    };
    await pool.query('UPDATE contratot SET ? WHERE id = ? and nl = ?', [newAutoriza, id, nvl]);
    res.send('1');
});

router.get('/autorizacionR/:nvl', async (req, res) => {
    const { nvl } = req.params;
    const listaAut = `
            SELECT LPAD(t.id,4,"0") as id, CONCAT(t.paterno, " ", t.materno, " ", t.nombre) as Nombre,
            c.numcon, p.deptod, p.puestod 
            FROM trabajadort t
            INNER JOIN contratot c
            ON t.id = c.id
            INNER JOIN puestost p
            on c.puestoC = p.idd
            WHERE c.tm IN ('R','A') AND c.nl = ` + nvl;
    const autorizado = await pool.query(listaAut);
    res.render('contratos/autAltaReingresos', { autorizado });
});

router.get('/expediente/:id', async (req, res) => {
    const { id } = req.params;
    const listaContratos = `
            SELECT LPAD(t.id,4,"0") as id, CONCAT(t.paterno, " ", t.materno, " ", t.nombre) as Nombre,
            p.puestod, p.deptod 
            FROM  contratot c
            INNER JOIN trabajadort t
            ON t.id = c.id
            INNER JOIN puestost p
            on c.puestoC = p.idd
            WHERE c.id = ` + id +
            ` AND c.dias = 0  
            ORDER BY c.id
    `;
    const contratos = await pool.query(listaContratos);
    res.send(contratos[0]);
});

router.post('/autorizaX/', async (req, res) => {
    //const { id } = req.params;
    var { id, dias, diasr, nl } = req.body;
    const newExpediente = {
        dias,
        diasr,
        nl,
        aut: 'SI'
    };
    await pool.query('UPDATE contratot SET ? WHERE tm = "A" OR tm = "R" AND id = ?', [newExpediente, id]);
       
    res.send('1');
});

router.post('/cancelaX/', async (req, res) => {
    //const { id } = req.params;
    var { id } = req.body;
    const newExpediente = {
        nl: '5',
        aut: 'NO',
        diasr: 0,
        dias: 0
    };
    await pool.query('UPDATE contratot SET ? WHERE tm = "A" OR tm = "R" AND id = ?', [newExpediente, id]);
    res.send('1');
});

module.exports = router;