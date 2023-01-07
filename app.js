const express = require('express');
const app = express();
var cors = require('cors')
const indexRouter = require('./routes/index');


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);


app.listen(3000, () => {
    console.log('Server running on port 3000')
})