const express = require('express')
const Controller = require('../controllers/index')
const auth = require('../controllers/auth')
const categoryRouter = require('./category');
const productRouter = require('./product');
const { authorization, authentication, authorizationStatus } = require("../middlewares/auth")
const router = express.Router()



router.get('/', Controller.home)
router.post("/login", auth.login)
router.post("/login/google", auth.google)
router.use('/api/category', categoryRouter);
router.use(authentication)
router.use('/api/products', productRouter);



module.exports = router
