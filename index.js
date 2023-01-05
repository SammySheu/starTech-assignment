const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const pool = require('./configs/mysql_config');
const jwt = require('jsonwebtoken');

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

app.get('/show', async (req, res) => {
    const data = await pool.query('SELECT * FROM user;');
    return data[0]
})

app.post('/login', async (req, res) => {
    const loginUser = req.body;
    const dataFromDB = await getUserData(loginUser.email);
    if(dataFromDB == null) return 'Cannot find this email in MySQL';
    else{
        res.send(authenticateUser(loginUser, dataFromDB))
    }
})

const getUserData = async (email) => {
    const response = await pool.query(`SELECT * FROM user WHERE email = "${email}";`);
    console.log(response[0][0]);
    return response[0][0];
}
const authenticateUser = (loginUser, dataFromDB) => {
    if(loginUser.password === dataFromDB.password){
        return 'Password correct';
    }
    else {
        return 'Password incorrect';
    }
}

app.post('/register', (req, res) => {
    const registUser = req.body;
    const sql = `INSERT INTO user(email, password) VALUES ("${registUser.email}", "${registUser.password}");`;
    pool.query(sql)
        .then(res.send('Register successfully'))
    
})

app.post('/upload',uploadMiddleWare.single('image'), (req, res) => {
    res.send('Image upload successfully')
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})