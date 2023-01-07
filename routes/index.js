let express = require('express');
let router = express.Router();
const path = require('path');
const fs = require('fs');

const pool = require('../configs/mysql_config');
const jwt = require('jsonwebtoken');
const {getUserData, authenticateUser, verifyToken, uploadMiddleware} = require('../configs/customFunction');

router.get('/show', verifyToken, async (req, res) => {
    const data = await pool.query('SELECT * FROM user;');
    // return res.send(data[0])
})

router.post('/login', async (req, res) => {
    const loginUser = req.body;
    const dataFromDB = await getUserData(loginUser.email);
    if(!dataFromDB) return res.status(200).send('Cannot find this email in database');
    else{
        if(authenticateUser(loginUser, dataFromDB)){
            infoInToken = {
                user_id: dataFromDB.user_id,
                user_email: dataFromDB.email,
            }
            jwt.sign(infoInToken, 'starTechSecretKey', {expiresIn: '30m'}, (err, accessToken) => {
                return res.status(201).send({accessToken})
            })
        }
        else{
            return res.status(200).send('Incorrect password')
        }
    }
})

router.post('/register', (req, res) => {
    const registUser = req.body;
    const sqlSearch = `SELECT * FROM user WHERE email = "${registUser.email}"`;
    pool.query(sqlSearch)
        .then((searchData) => {
            if(searchData[0][0]) return res.status(200).send('Email already exists')
            else{
                const sqlInsert = `INSERT INTO user(email, password) VALUES ("${registUser.email}", "${registUser.password}");`;
                pool.query(sqlInsert)
                    .then(res.status(201).send('Succeed to build user'))
            }
        })  
})

router.post('/uploadPicture',verifyToken, uploadMiddleware.single('image'), (req, res) => {
    if(req.file){
        jwt.verify(req.token, 'starTechSecretKey', (err, auth) => {
            const sql = `INSERT INTO picture(pictureName, pictureURL, belongTo, isPrivate) VALUES ('${req.file.filename}', '${req.file.path}', ${auth.user_id}, TRUE);`
            pool.query(sql)
                .then(res.status(201).send('Image upload successfully'))
        })
    }
    else
        return res.status(400).send('File is missing');
})

router.post('/deletePicture', verifyToken, (req, res) => {
    const sqlFindData= `SELECT * FROM picture WHERE picture_id = ${req.body.deleteOne}`;
    pool.query(sqlFindData)
        .then((dataFound) => {
            if(dataFound[0][0]){
                const sqlDelete = `DELETE FROM picture WHERE picture_id = ${req.body.deleteOne}`
                const p1 = fs.promises.unlink(`./${dataFound[0][0].pictureURL}`)
                const p2 = pool.query(sqlDelete)
                Promise.all([p1, p2])
                    .then(res.status(200).send('Delete both from file system and database'))
            }
            else
                return res.status(404).send('Missing delete info or picture not found')
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
                        .then(res.status(200).send('Update success'));
                }
                else
                    return res.status(404).send("Missing update info or picture not found")
            })
    })
})

module.exports = router;