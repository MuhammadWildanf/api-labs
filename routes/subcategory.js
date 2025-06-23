const express = require('express');
const SubCategoryController = require('../controllers/subcategory');
const router = express.Router();

router.get('/', SubCategoryController.index);          // GET all
router.get('/:id', SubCategoryController.show);        // GET one
router.post('/', SubCategoryController.create);        // CREATE
router.put('/:id', SubCategoryController.update);      // UPDATE
router.delete('/:id', SubCategoryController.delete);   // DELETE

module.exports = router; 