const express = require('express');
const router = express.Router();
const pool = require('../database');
const fs = require('fs');
const dir = require('path');
const { isLoggedIn } = require('../lib/security');
const nodeTable = require('nodetable');
const Swal = require('sweetalert2')

router.get('/ind', (req, res) => {
    const path = dir.join(__dirname, '../public/cursos/AyB1.mp4');
    const stat = fs.statSync(path);
    const filesize = stat.size;
    const range = req.headers.range;

    if(range){
        console.log(path);
        const parts = range.replace(/bytes=/,"").split("-");
        const start = parseInt(parts[0],10);
        const end = parts[1] ? parseInt(parts[1],10) : filesize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(path, {start, end} );
        const head = {
        'Content-Range' : "bytes " + start + "-" + end + "/" + filesize,
        'Accept-Ranges' : 'bytes',
        'Content-Length' : chunksize,
        'Content-Type' : 'video/mp4'
        }
        res.writeHead(206,head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length' : filesize,
            'Content-Type' : 'video/mp4'
        }
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
     

});

router.get('/cursos', async (req, res) => {
    const cursos = await pool.query('SELECT * FROM cursost ORDER BY id');
res.render('cursos/cursosLista', {cursos});
});

router.get('/add', isLoggedIn, async (req, res) => {
    const cursos = await pool.query('SELECT * FROM cursost ORDER BY id');
    res.render('cursos/curso', {cursos});
});

router.post('/add', async (req, res, next) => {
    var { id, nombre, url, dirigido } = req.body;
    nombre = nombre.toUpperCase();
    dirigido = dirigido.toUpperCase();
    const newcurso = {
        id,
        nombre,
        url,
        dirigido
    };
    
    await pool.query('INSERT INTO cursost SET ?', [newcurso]);
    res.redirect('/cursos/add');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    await pool.query('DELETE FROM cursost WHERE id = ?', [id]);
    res.redirect('/cursos/add');
});

router.get('/update/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const curso = await pool.query('SELECT * FROM cursost WHERE id = ?', [id]);
    res.render('cursos/update', curso[0]);
});

router.post('/update/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { nombre, url, dirigido } = req.body;
    const newcurso = {
        nombre,
        url,
        dirigido
    };
    console.log(newcurso);
    await pool.query('UPDATE cursost set ? WHERE id=?', [newcurso,id]);
    res.redirect('/cursos/add');

});

module.exports = router;