const pool = require('./mysql_config');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const getUserData = async (email) => {
    const response = await pool.query(`SELECT * FROM user WHERE email = "${email}";`);
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

const storage = multer.diskStorage({
    destination: './Images',
    filename: (req, file, callback) => {
        console.log(file);
        // return Date.now() + file.originalname;
        callback(null, Date.now() + '_' + file.originalname)
    }
})

const uploadMiddleware = multer({storage:storage})

module.exports = {getUserData, authenticateUser, verifyToken, uploadMiddleware}