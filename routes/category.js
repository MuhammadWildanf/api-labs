const express = require('express');
const CategoryController = require('../controllers/category');
const router = express.Router();

router.get('/', CategoryController.index);          // GET all
router.get('/:id', CategoryController.show);        // GET one
router.post('/', CategoryController.create);        // CREATE
router.put('/:id', CategoryController.update);      // UPDATE
router.delete('/:id', CategoryController.delete);   // DELETE

module.exports = router;
