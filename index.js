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
        // return Date.now() + file.originalname;
        callback(null, Date.now() + '_' + file.originalname)
    }
})

const uploadMiddleware = multer({storage:storage})

app.use(express.urlencoded({ extended: false }));
// app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile( path.join( __dirname + '/views/frontendPage.html' ) )
})

app.get('/show', verifyToken, async (req, res) => {
    
    const data = await pool.query('SELECT * FROM user;');
    // return res.send(data[0])
})

app.post('/login', async (req, res) => {
    const loginUser = req.body;
    const dataFromDB = await getUserData(loginUser.email);
    if(dataFromDB == null) return 'Cannot find this email in MySQL';
    else{
        if(authenticateUser(loginUser, dataFromDB)){
            jwt.sign({loginUser}, 'starTechSecretKey', {expiresIn: '10m'}, (err, token) => {
                // res.setHeader['authorization'] = token;
                console.log(res)
                return res.json({token})
            })
        }
        else{
            res.send('Password incorrect')
        }
        
    }
})

const getUserData = async (email) => {
    const response = await pool.query(`SELECT * FROM user WHERE email = "${email}";`);
    // console.log(response[0][0]);
    return response[0][0];
}
const authenticateUser = (loginUser, dataFromDB) => {
    if(loginUser.password === dataFromDB.password)
        return true;
    else
        return false;
}
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader){
        req.token = bearerHeader.split(' ')[1]
        jwt.verify(req.token, 'starTechSecretKey', (err, authData) => {
            if(err){
                return res.sendStatus(403);
            } else{
                console.log('inVerifyTokenFunction')
                next()
                // return 'verifyTokenFinished';
                // return res.json({
                //     message: 'Post request succeed',
                //     authData
                // });
            }
        })
        // next();
    }
    else
        return res.sendStatus(403)
}

app.post('/register', (req, res) => {
    const registUser = req.body;
    const sql = `INSERT INTO user(email, password) VALUES ("${registUser.email}", "${registUser.password}");`;
    pool.query(sql)
        .then(res.send('Register successfully'))
    
})

app.post('/upload',verifyToken, uploadMiddleware.single('image'), (req, res) => {
    const sql = `INSERT INTO picture(pictureName, pictureURL, belongTo, isPrivate) VALUES ('${req.file.filename}', '${req.file.path}', 1, false);`
    pool.query(sql)
    return res.send('Image upload successfully')
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})