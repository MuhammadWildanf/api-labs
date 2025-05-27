const { Product, Category, User, ProductMedia, Post, PostCategory } = require('../models');
const { Op } = require("sequelize");

class Public {
    static async product(req, res, next) {
        try {
            const products = await Product.findAll({
                include: [
                    { model: User },
                    { model: Category, as: 'category' },
                    { model: ProductMedia, as: 'media' },
                ]
            });
            res.status(200).json(products);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
    static async productDetail(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id, {
                include: [
                    { model: User },
                    { model: Category, as: 'category' },
                    { model: ProductMedia, as: 'media' },
                ]
            });
            res.status(200).json(product);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async showBySlug(req, res, next) {
        try {
            const { slug } = req.params;

            const product = await Product.findOne({
                where: { slug },
                include: [
                    { model: User },
                    { model: Category, as: 'category' },
                    { model: ProductMedia, as: 'media' },
                ]
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.status(200).json({
                success: true,
                data: product
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async post(req, res, next) {
        try {
            const posts = await Post.findAll({
                include: [
                    { model: PostCategory, attributes: ['id', 'name'] },
                    { model: User, attributes: ['id', 'username'] }
                ]
            });
            res.status(200).json(posts);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async postDetail(req, res, next) {
        try {
            const { id } = req.params;
            const post = await Post.findByPk(id, {
                include: [
                    { model: PostCategory, attributes: ['id', 'name'] },
                    { model: User, attributes: ['id', 'username'] }
                ]
            });
            res.status(200).json(post);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }


}

module.exports = Public;