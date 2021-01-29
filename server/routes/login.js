const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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


// configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        });
    });

    // res.json({
    //     usuario: googleUser
    // });

    User.findOne({ email: googleUser.email }, (err, userdb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userdb) {
            if (userdb.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Email ya registrado. Por favor ingrese con sus datos en el login de la app'
                    }
                });
            } else {

                let token = jwt.sign({
                    user: userdb
                }, process.env.SEED, { expiresIn: process.env.EXPIRED_TOKEN_AT });


                return res.status(200).json({
                    ok: true,
                    user: userdb,
                    token
                });
            }

        } else {
            // si el usuario no existe en la BD
            let user = new User;
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.picture;
            user.google = true;
            user.password = ':)';


            user.save((err, userdb) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: userdb
                }, process.env.SEED, { expiresIn: process.env.EXPIRED_TOKEN_AT });


                return res.status(200).json({
                    ok: true,
                    user: userdb,
                    token
                });
            });
        }
    });
});

module.exports = app;