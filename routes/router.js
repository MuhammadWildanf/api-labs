const express = require('express')
const Controller = require('../controllers/index')
const categoryRouter = require('./category');
const productRouter = require('./product');
const router = express.Router()



router.get('/', Controller.home)
router.use('/category', categoryRouter);
router.use('/products', productRouter);


module.exports = router
