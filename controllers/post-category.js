const { PostCategory } = require('../models')

class PostCategoryController {
    static async index(req, res) {
        try {
            const categories = await PostCategory.findAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async show(req, res) {
        try {
            const category = await PostCategory.findByPk(req.params.id);
            if (!category) return res.status(404).json({ message: 'Category not found' });
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const newCategory = await PostCategory.create(req.body);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const category = await PostCategory.findByPk(req.params.id);
            if (!category) return res.status(404).json({ message: 'Category not found' });
            await category.update(req.body);
            res.json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const category = await PostCategory.findByPk(req.params.id);
            if (!category) return res.status(404).json({ message: 'Category not found' });
            await category.destroy();
            res.json({ message: 'Category deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PostCategoryController