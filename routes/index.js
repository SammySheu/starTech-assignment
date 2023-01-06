let express = require('express');
let router = express.Router();
const path = require('path');

const pool = require('../configs/mysql_config');
const jwt = require('jsonwebtoken');
const {getUserData, authenticateUser, verifyToken, uploadMiddleware} = require('../configs/customFunction')

router.get('/', (req, res) => {
    res.sendFile( path.join( __dirname + '/../views/frontendPage.html' ) )
})

router.get('/show', verifyToken, async (req, res) => {
    const data = await pool.query('SELECT * FROM user;');
    // return res.send(data[0])
})

router.post('/login', async (req, res) => {
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

router.post('/register', (req, res) => {
    const registUser = req.body;
    const sql = `INSERT INTO user(email, password) VALUES ("${registUser.email}", "${registUser.password}");`;
    pool.query(sql)
        .then(res.send('Register successfully'))
    
})

router.post('/upload',verifyToken, uploadMiddleware.single('image'), (req, res) => {
    const sql = `INSERT INTO picture(pictureName, pictureURL, belongTo, isPrivate) VALUES ('${req.file.filename}', '${req.file.path}', 1, false);`
    pool.query(sql)
    return res.send('Image upload successfully')
})

module.exports = router;