require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.get('/', function(req, res) {
    res.send('Texto tipo string');
});

app.get('/usuario', function(req, res) {
    res.json({ name: 'facundo' });
});

// POST se utiliza para crear nuevos registros
app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'param name is required'
        });
    } else {
        res.json({ person: body });
    }
});

// PUT se utiliza para actualizar registros
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.json({ id });
});

app.delete('/usuario', function(req, res) {
    res.json({ name: 'facundo' });
});

app.listen(port, () => console.log(`escuchando puerto ${port}`));