const express = require('express')
const Controller = require('../controllers/index')
const auth = require('../controllers/auth')
const categoryRouter = require('./category');
const postcategoryRouter = require('./post-category');
const productRouter = require('./product');
const postRouter = require('./post');
const { authentication } = require("../middlewares/auth")
const public = require('./public')
const { uploadImage, handleMulterError } = require('../config/multer');

const router = express.Router()


router.use("/public", public)

router.get('/', Controller.home)
router.post("/login", auth.login)
router.post("/login/google", auth.google)
router.use('/api/category', categoryRouter);
router.use('/api/post-category', postcategoryRouter);
router.use(authentication)
router.use('/api/products', productRouter);
router.use('/api/posts', postRouter);



module.exports = router
