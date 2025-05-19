const express = require('express');
const PostController = require('../controllers/post');
const router = express.Router();

router.get('/', PostController.index);
router.get('/:id', PostController.show);
router.post('/', PostController.create);
router.put('/:id', PostController.update);
router.delete('/:id', PostController.delete);

module.exports = router;