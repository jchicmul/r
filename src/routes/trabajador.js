const express = require('express');
const router = express.Router();
const pool = require('../database');
const nodeTable = require('nodetable');
const Excel = require('exceljs');
const { isLoggedIn } = require('../lib/security');

router.get('/add',isLoggedIn, async (req, res) => {
    const puestos = await pool.query('SELECT * FROM puestost');
    //res.render('trabajador/add', { puestos });
    res.send(puestos);
});

router.get('/', isLoggedIn, async (req, res) => {
    const listratrab = `
            SELECT LPAD(t.id,4,"0") as id, CONCAT(t.paterno, " ", t.materno, " ", t.nombre) as Nombre,
            t.salario, DATE_FORMAT(t.ingreso,"%d/%m/%Y") as ingreso, DATE_FORMAT(t.baja,"%d/%m/%Y") as baja, p.puestod, p.deptod
            FROM trabajadort t
            INNER JOIN puestost p
            ON t.salario = p.idd
            ORDER BY t.id
    `;
    const trabajadores = await pool.query(listratrab);
    res.render('trabajador/listt', { trabajadores });
});

router.post('/add',isLoggedIn, async (req, res) => {
    var { id, paterno, materno, nombre, nss, rfc, curp, tipoc, tipot, ingreso, salario, tipou, direccion, colonia } = req.body;
    console.log(req.params);
    const newtrabajador = {
        id,
        paterno,
        materno,
        nombre,
        direccion,
        colonia,
        nss,
        rfc,
        curp,
        tipoc,
        tipot,
        ingreso,
        salario,
        tipou
    };

    await pool.query('INSERT INTO trabajadort SET ?', [newtrabajador]);
    res.send('1');
});

router.get('/usuario/:id', isLoggedIn, async (req, res) => {
    var id = req.params.id;
    id = Number(id);
    const listratrab = `
            SELECT LPAD(id,4,"0") as id, CONCAT(paterno, " ", materno, " ", nombre) as Nombre
            FROM trabajadort
            WHERE id = ?
    `;
    const trabajador = await pool.query(listratrab, [id]);
    res.render('trabajador/tipoUsuario', trabajador[0]);
});

router.get('/reingreso/:id', isLoggedIn, async (req, res) => {
    var id = req.params.id;
    id = Number(id);
    const listratrab = `
            SELECT LPAD(id,4,"0") as id, CONCAT(paterno, " ", materno, " ", nombre) as Nombre
            FROM trabajadort
            WHERE id = ?
    `;
    const puestos = await pool.query('SELECT * FROM puestost');
    const trabajador = await pool.query(listratrab, [id]);
    reingresos = {
        puestos,
        trabajador
    }
    res.send(reingresos);
});

router.post('/usuario',isLoggedIn, async (req, res) => {
    const { numero, usuario } = req.body;
    var nvl = usuario;
    const listratrab = {
        nvl
    };
    await pool.query('UPDATE users SET ? WHERE id = ?', [listratrab, numero]);
    res.redirect('/trabajador/');
});

router.get('/supervisor/:id', isLoggedIn, async (req, res) => {
    var id = req.params.id;
    id = Number(id);
    const listaSup = `
            SELECT LPAD(id,4,"0") as id, CONCAT(paterno, " ", materno, " ", nombre) as Nombre
            FROM trabajadort
            WHERE id = ? 
    `;
    const trabajador = await pool.query(listaSup, [id]);
    const supervisor = await pool.query('SELECT id, username FROM users WHERE nvl > 1');
    const jefe = {
        trabajador,
        supervisor
    };
    res.send( jefe );
});

router.post('/supervisor',isLoggedIn, async (req, res) => {
    var { numero, encargado } = req.body;
    numero = Number(numero);
    const supervisor = {
        encargado
    };
    await pool.query('UPDATE trabajadort SET ? WHERE id = ?', [supervisor, numero]);
    res.send('1');
});

router.get('/contract/:id', isLoggedIn, async (req, res) => {
    var id = req.params.id;
    id = Number(id);
    const listaSup = `
            SELECT LPAD(id,4,"0") as id, CONCAT(paterno, " ", materno, " ", nombre) as Nombre,
            DATE_FORMAT(ingreso, '%Y-%m-%d') as ingreso, ingreso as fingreso 
            FROM trabajadort
            WHERE id = ? 
    `;
    const trabajador = await pool.query(listaSup, [id]);
    const puestosc = await pool.query('SELECT * FROM puestost');
    const datoContrato = {
        trabajador,
        puestosc
    }
    res.send(datoContrato);

});

router.post('/newcontract', isLoggedIn, async(req, res) => {
var { numero, numcon, tm, puestoC } = req.body;
id = numero;
//var inicio = fingreso;
//let termino =new Date(inicio);
//termino.setDate(termino.getDate() + parseInt(dias));
var nl = 3;

const newcontract = {
    id,
    numcon,
    nl,
    tm,
    puestoC,
    dias: 0
};

await pool.query('INSERT INTO contratot SET ?', [newcontract]);
    res.send('1');

});

router.post('/baja', isLoggedIn, async(req, res) => {
    var { numero, baja, tb } = req.body;
    id = numero;
    //var inicio = fingreso;
    //let termino =new Date(inicio);
    //termino.setDate(termino.getDate() + parseInt(dias));
    //var nl = 0;
    
    //if (tm == 'N') {
    //    nl = 2
    //} else {
    //    nl = 3
   // }

   const listaTrab = `
            SELECT LPAD(id,4,"0") as id, CONCAT(paterno, " ", materno, " ", nombre) as Nombre,
            DATE_FORMAT(ingreso, '%Y-%m-%d') as ingreso, ingreso as fingreso, salario  
            FROM trabajadort
            WHERE id = ? 
    `;
    const trabajador = await pool.query(listaTrab, [id]);
    
    const newBaja = {
        id,
        puesto:trabajador[0].salario,
        falta:trabajador[0].ingreso,
        fbaja:baja,
        tb
    }
    await pool.query('UPDATE trabajadort SET baja = ? WHERE id = ?', [baja, id]);
    await pool.query('INSERT INTO histot SET ?', [newBaja]);
        res.send('1');
    
    });

    router.post('/reingreso', isLoggedIn, async(req, res) => {
        var { numero, reingreso, salario, baja, tipoc, tipot } = req.body;
        id = numero;
        
        const newReingreso = {
            id,
            puesto:salario,
            falta:reingreso,
            tb: 'R',
        }

        const reingresos = {
            ingreso:reingreso,
            salario,
            baja: null,
            tipoc,
            tipot
        }
        await pool.query('UPDATE trabajadort SET ? WHERE id = ?', [reingresos, id]);
        await pool.query('INSERT INTO histot SET ?', [newReingreso]);
            res.send('1');
        
        });
    

router.get('/excel', async (req, res) => {

    var f = new Date();

    if (f.getMonth() < 10) {
        mes = "0" + f.getMonth();
    } else {
        mes = f.getMonth();
    };

    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="Empleados-' + f.getFullYear() + mes + f.getDate() + '.xlsx"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    var worksheet = workbook.addWorksheet('some-worksheet')
    worksheet.addRow(['Núm', 'Nombre', 'Puesto', 'Salario', 'Ingreso']).commit()
    worksheet.commit()
    workbook.commit()

});

module.exports = router;