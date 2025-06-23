const { SubCategory, Category } = require('../models');

class SubCategoryController {
    static async index(req, res, next) {
        try {
            const subcategories = await SubCategory.findAll({
                include: [{ model: Category, as: 'category' }]
            });
            res.status(200).json(subcategories);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async show(req, res, next) {
        try {
            const { id } = req.params;
            const subcategory = await SubCategory.findByPk(id, {
                include: [{ model: Category, as: 'category' }]
            });
            if (!subcategory) return res.status(404).json({ message: 'SubCategory not found' });
            res.status(200).json(subcategory);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            const { name, slug, description, category_id } = req.body;
            if (!name || !category_id) {
                return res.status(400).json({ message: 'Name and category_id are required' });
            }
            const subcategory = await SubCategory.create({
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                description,
                category_id
            });
            res.status(201).json(subcategory);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, slug, description, category_id } = req.body;
            const subcategory = await SubCategory.findByPk(id);
            if (!subcategory) return res.status(404).json({ message: 'SubCategory not found' });
            await subcategory.update({
                name,
                slug: slug || name?.toLowerCase().replace(/\s+/g, '-'),
                description,
                category_id
            });
            res.status(200).json(subcategory);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const subcategory = await SubCategory.findByPk(id);
            if (!subcategory) return res.status(404).json({ message: 'SubCategory not found' });
            await subcategory.destroy();
            res.status(200).json({ message: 'SubCategory deleted successfully' });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

module.exports = SubCategoryController; 