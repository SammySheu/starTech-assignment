const express = require('express');
const app = express();
const path = require('path')
const multer = require('multer')
const pool = require('./configs/mysql_config');
const { type } = require('os');

port = 3000

const storage = multer.diskStorage({
    destination: './Images',
    filename: (req, file, callback) => {
        console.log(file);
        callback(null, Date.now() + '_' + file.originalname)
    }
})

const uploadMiddleWare = multer({storage:storage})

app.use(express.urlencoded({ extended: false }));
// app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile( path.join( __dirname + '/views/frontendPage.html' ) )
})

app.get('/show', (req, res) => {
    pool.query('SELECT * FROM user;', (err, data) => {
        console.log(data);
        res.send(data)
    })
})

app.post('/login', (req, res) => {
    const loginUser = req.body;
    res.send(req.body);
})

app.post('/register', (req, res) => {
    const registUser = req.body;
    const sql = `INSERT INTO user(email, password) VALUES ("${registUser.email}", "${registUser.password}");`;
    pool.query(sql, (err, data) => {
        if(err) throw err;
        res.send('Register successfully');
    })
})

app.post('/upload',uploadMiddleWare.single('image'), (req, res) => {
    res.send('Image upload successfully')
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})