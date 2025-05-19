const express = require('express');
const PostCategoryController = require('../controllers/post-category');
const router = express.Router();

router.get('/', PostCategoryController.index);          // GET all
router.get('/:id', PostCategoryController.show);        // GET one
router.post('/', PostCategoryController.create);        // CREATE
router.put('/:id', PostCategoryController.update);      // UPDATE
router.delete('/:id', PostCategoryController.delete);   // DELETE

module.exports = router;
    