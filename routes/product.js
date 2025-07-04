// routes/product.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product');
const { uploadMedia, handleMulterError } = require('../config/multer');

// Product routes
router.get('/:id/media', ProductController.getMedia);
router.post('/:id/media', uploadMedia.fields([{ name: 'media', maxCount: 10 }]), handleMulterError, ProductController.addMedia);
router.put('/:id/media/:mediaId', ProductController.updateMedia);
router.delete('/:id/media/:mediaId', ProductController.deleteMedia);
router.put('/:id/media/reorder', ProductController.reorderMedia);

// Product embed routes
router.get('/:id/embeds', ProductController.getEmbeds);
router.post('/:id/embeds', ProductController.addEmbed);
router.put('/:id/embeds/:embedId', ProductController.updateEmbed);
router.delete('/:id/embeds/:embedId', ProductController.deleteEmbed);
router.put('/:id/embeds/reorder', ProductController.reorderEmbeds);

// Product CRUD routes
router.get('/', ProductController.index);
router.get('/:id', ProductController.show);
router.post('/', uploadMedia.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'media', maxCount: 10 }
]), handleMulterError, ProductController.create);
router.put('/:id', uploadMedia.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'media', maxCount: 10 }
]), handleMulterError, ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;