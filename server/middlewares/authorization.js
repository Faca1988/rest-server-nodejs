const jwt = require('jsonwebtoken');


//
//Verificar token
//
let verifyToken = (req, res, next) => {
    let token = req.get('token'); // obtengo los headers

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;

        next();
    });

};

//
//Verificar ADMIN_ROLE
//
let verifyRole = (req, res, next) => {

    let user = req.user;

    if (user.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario no autorizado para realizar esta accion'
            }
        });
    }

    next();

};

module.exports = {
    verifyToken,
    verifyRole
};