const { Category } = require('../models');

class CategoryController {
    static async index(req, res, next) {
        try {
            const categories = await Category.findAll({
            });
            res.status(200).json(categories);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async show(req, res, next) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id, {
            });

            if (!category) return res.status(404).json({ message: 'Category not found' });

            res.status(200).json(category);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            const { name, slug, description } = req.body;

            // Validate required fields
            if (!name) {
                return res.status(400).json({ message: 'Name is required' });
            }

            const category = await Category.create({
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                description
            });

            res.status(201).json(category);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, slug, description } = req.body;

            const category = await Category.findByPk(id);
            if (!category) return res.status(404).json({ message: 'Category not found' });

            await category.update({
                name,
                slug: slug || name?.toLowerCase().replace(/\s+/g, '-'),
                description
            });

            res.status(200).json(category);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;

            const category = await Category.findByPk(id);
            if (!category) return res.status(404).json({ message: 'Category not found' });

            await category.destroy();
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

module.exports = CategoryController;
