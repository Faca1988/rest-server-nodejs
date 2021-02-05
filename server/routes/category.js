const express = require('express');
const Category = require('../models/category');
const { verifyToken, verifyRole } = require('../middlewares/authorization');

const app = express();


//muestra todas las categorías
app.get('/category', verifyToken, (req, res) => {
    Category.find()
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categorydb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categories: categorydb
            });
        });
});

//muestra una categoría por ID
app.get('/category/:id', verifyToken, function(req, res) {
    let id = req.params.id;

    Category.findById(id, (err, datadb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    err,
                    message: "category not fond"
                }
            });
        }
        res.json({
            ok: true,
            model: Category.modelName,
            data: datadb
        });

    });
});

//crear nueva categoria
app.post('/category', verifyToken, (req, res) => {

    let category = new Category({
        description: req.body.description,
        user: req.user._id
    });

    category.save((err, datadb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'category created',
            category: datadb
        });
    });
});

//actualiza categoria por id
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Category.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            context: 'query'
        },
        (err, datadb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        err,
                        message: "we can't update the category"
                    }
                });
            }
            res.json({
                ok: true,
                category: datadb
            });
        });
});

//borra categoria / solo admin puede borrar y token
app.delete('/category/:id', [verifyToken, verifyRole], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, dataDBErased) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                message: 'error en el formato de la peticion'
            });
        }
        if (!dataDBErased) {
            return res.status(400).json({
                ok: false,
                message: 'No data to delete found'
            });
        } else {
            res.json({
                ok: true,
                category: dataDBErased
            });
        }
    });
});


module.exports = app;