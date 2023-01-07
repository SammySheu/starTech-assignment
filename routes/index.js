let express = require('express');
let router = express.Router();
const path = require('path');

const pool = require('../configs/mysql_config');
const jwt = require('jsonwebtoken');
const {getUserData, authenticateUser, verifyToken, uploadMiddleware} = require('../configs/customFunction');
const { query } = require('../configs/mysql_config');

// router.get('/', (req, res) => {
//     res.sendFile( path.join( __dirname + '/../views/frontendPage.html' ) )
// })

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
            infoInToken = {
                user_id: dataFromDB.user_id,
                user_email: dataFromDB.email,
            }
            jwt.sign(infoInToken, 'starTechSecretKey', {expiresIn: '30m'}, (err, token) => {
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

router.post('/uploadPicture',verifyToken, uploadMiddleware.single('image'), (req, res) => {
    jwt.verify(req.token, 'starTechSecretKey', (err, auth) => {
        const sql = `INSERT INTO picture(pictureName, pictureURL, belongTo, isPrivate) VALUES ('${req.file.filename}', '${req.file.path}', ${auth.user_id}, TRUE);`
        pool.query(sql)
            .then(res.send('Image upload successfully'))
    })
})

router.post('/setPrivate', verifyToken, (req, res) => {
    jwt.verify(req.token, 'starTechSecretKey', (err, auth) => {
        
        const sqlConfirm = `SELECT * FROM picture WHERE picture_id = ${req.body.picture_id} AND belongTo = ${auth.user_id}`
        pool.query(sqlConfirm)
            .then((data) => {
                if(data[0][0]){
                    const sqlUpdate = `UPDATE picture SET isPrivate = ${req.body.setPrivate} WHERE picture_id = ${req.body.picture_id} AND belongTo = ${auth.user_id}`;
                    pool.query(sqlUpdate)
                        .then(res.send('Update success'));
                }
                else
                    return res.send("Can't find")
            })
    })
})

module.exports = router;