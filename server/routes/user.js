const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const User = require('../models/user');




const JSONResponse = (res, err, userdb) => {
    if (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    res.json({
        ok: true,
        user: userdb
    });
};

app.get('/usuario', function(req, res) {
    // res.json({ name: 'facundo' });

    let from = Number(req.query.from || 0);
    let limit = Number(req.query.limit || 5);

    User.find({ state: true }, 'name email role state google img')
        .skip(from)
        .limit(limit)
        .exec((err, userdb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ state: true }, (err, counting) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    user: userdb,
                    counting
                });
            });
        });
});

// POST se utiliza para crear nuevos registros
app.post('/usuario', function(req, res) {
    let body = req.body;
    // let body = _.pick(req.body, ['name', 'email', 'password', 'img', 'role', 'state']);

    let user = new User({
        name: body.name,
        email: body.email,
        // password: body.password,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userdb) => {
        // userdb.password = null; 
        JSONResponse(res, err, userdb);
    });

});

// PUT se utiliza para actualizar registros
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    // let body = req.body;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, {
            new: true, //devuelve el objeto actualizado
            runValidators: true, //aplica las validaciones del esquema del modelo
            context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
        },
        (err, userdb) => JSONResponse(res, err, userdb));
});

app.delete('/usuario/:id', function(req, res) {
    /*===========================================================================
    =============================================================================
     Este delete elimina un usuario de la Base de datos.
     Puede hacerlo fisicamente mandando el parametro "erase" con valor true,
     o puede hacerlo logicamente cambiando el estado (state) del registro a false
     =============================================================================
     ===========================================================================*/

    let id = req.params.id;
    let erase = req.params.erase || false;

    if (erase === true) {
        User.findByIdAndRemove(id, (err, deletedUser) => {
            if (deletedUser) {
                JSONResponse(res, err, deletedUser);
            } else {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }
        });
    } else {
        // let body = _.pick(req.body, ['state']);
        // body.state = false;

        let state = {
            state: false
        };

        User.findByIdAndUpdate(id, state, {
                new: true, //devuelve el objeto actualizado
                runValidators: true, //aplica las validaciones del esquema del modelo
                context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
            },
            (err, userdb) => JSONResponse(res, err, userdb));
    }
});

module.exports = {
    app
};