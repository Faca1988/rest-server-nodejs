const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

const JSONResponse = (res, err, data) => {
    if (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    res.json({
        ok: true,
        data
    });
};



app.post('/login', (req, res) => {
    // let data = req.query;

    let body = req.body;

    User.findOne({ email: body.email }, (err, userdb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userdb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, userdb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            user: userdb
        }, process.env.SEED, { expiresIn: process.env.EXPIRED_TOKEN_AT });

        res.json({
            ok: true,
            user: userdb,
            token
        });



    });

});




module.exports = app;