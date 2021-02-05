const _ = require('underscore');
const express = require('express');
const Product = require('../models/product');
const Category = require('../models/category');
const { verifyToken, verifyRole } = require('../middlewares/authorization');

const app = express();


//muestra todos las productos. 
app.get('/product', verifyToken, (req, res) => {
    let from = Number(req.query.from || 0);
    let limit = Number(req.query.limit || 5);

    Product.find({ abailable: true })
        .skip(from)
        .limit(limit)
        .sort('name')
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, datadb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!datadb) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product: datadb
            });
        });
});

//muestra un producto por ID
app.get('/product/:id', verifyToken, function(req, res) {
    let id = req.params.id;

    Product.findById(id, (err, datadb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!datadb) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product: datadb
        });
    });
});

//busca los productos que coinciden con el termino ingresado
app.get('/product/search/:term', verifyToken, (req, res) => {
    let term = req.params.term;

    let regExp = new RegExp(term, 'i');

    Product.find({ name: regExp })
        .populate('category', 'name')
        .exec((err, datadb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!datadb) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                products: datadb
            });
        });
});


//crear nueva producto
app.post('/product', verifyToken, async(req, res) => {
    let body = req.body;

    let category = await Category.find({ description: body.category }, 'id').exec();
    let id = category[0]._id;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        abailable: body.abailable,
        category: id,
        user: req.user._id
    });

    product.save((err, datadb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!datadb) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'product created',
            product: datadb
        });
    });
});

//actualiza producto por id
app.put('/product/:id', verifyToken, async(req, res) => {
    let id = req.params.id;

    let newCategory, idx;

    if (req.body.category) {
        newCategory = await Category.find({
            description: req.body.category,
            abailable: true
        }, 'id').exec();
        if (newCategory[0]) {
            idx = newCategory[0]._id;
            req.body.category = idx;
        } else {
            return res.status(400).json({
                ok: false,
                message: `Category ${req.body.category} don't exist in DB`
            });
        }
    }

    let updatedData = _.pick(req.body, ['name', 'unitPrice', 'description', 'category']);

    Product.findByIdAndUpdate(id, updatedData, {
        new: true, //devuelve el objeto actualizado
        runValidators: true, //aplica las validaciones del esquema del modelo
        context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
    }, (err, datadb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!datadb) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'Successfuly Updated',
            product: datadb
        });
    });

});

//borra producto / solo admin puede borrar y token
app.delete('/product/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;

    let deletedModel = {
        abailable: false
    };

    Product.findByIdAndUpdate(id, deletedModel, {
        new: true, //devuelve el objeto actualizado
        runValidators: true, //aplica las validaciones del esquema del modelo
        context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
    }, (err, datadb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!datadb) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'Successfuly Deleted',
            product: datadb
        });
    });
});


module.exports = app;