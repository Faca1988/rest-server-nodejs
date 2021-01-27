require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Configuración global de rutas
app.use(require('./routes/index'));


app.get('/', function(req, res) {
    res.send('Texto tipo string');
});




mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    (err, res) => {
        if (err) throw err;
        console.log('base de datos ONLINE');
    });

app.listen(port, () => console.log(`escuchando puerto ${port}`));