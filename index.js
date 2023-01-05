const express = require('express');
const app = express();
const path = require('path')

const multer = require('multer')

port = 3000

const storage = multer.diskStorage({
    destination: './Images',
    filename: (req, file, callback) => {
        console.log(file);
        callback(null, Date.now() + '_' + file.originalname)
    }

})

const uploadMiddleWare = multer({storage:storage})

app.get('/', (req, res) => {
    res.sendFile( path.join( __dirname + '/frontendPage.html' ) )
})

app.post('/upload',uploadMiddleWare.single('image'), (req, res) => {
    res.send('Image upload successfully')
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})