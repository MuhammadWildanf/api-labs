const { Product, Category, User, ProductMedia, ProductEmbed } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');
const slugify = require('slugify');

class ProductController {
    // Helper function to convert video URL to embed format
    static convertToEmbedUrl(url) {
        if (!url) return url;

        // Remove any trailing spaces
        url = url.trim();

        // YouTube video
        if (url.includes('youtube.com/watch')) {
            const videoId = url.match(/[?&]v=([^&]+)/)?.[1];
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }
        // YouTube short URL
        else if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1];
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        else if (url.includes('youtube.com/shorts/')) {
            const videoId = url.split('youtube.com/shorts/')[1].split('?')[0];
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }
        // Vimeo video
        else if (url.includes('vimeo.com/')) {
            const videoId = url.split('vimeo.com/')[1];
            if (videoId) {
                return `https://player.vimeo.com/video/${videoId}`;
            }
        }

        // If already in embed format or unrecognized format, return as is
        return url;
    }

    // GET /products
    static async index(req, res, next) {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                category_id,
                status,
                is_featured,
                sort_by = 'created_at',
                sort_order = 'DESC'
            } = req.query;

            const offset = (page - 1) * limit;
            const where = {};

            // Search functionality
            if (search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ];
            }

            // Filters
            if (category_id) where.category_id = category_id;
            if (status) where.status = status;
            if (is_featured) where.is_featured = is_featured;

            // Validate sort parameters
            const allowedSortFields = ['created_at', 'name', 'price', 'status'];
            const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
            const order = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

            const { count, rows } = await Product.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [
                    { model: User },
                    { model: Category, as: 'category' },
                    { model: ProductMedia, as: 'media' },
                    { model: ProductEmbed, as: 'embeds' },
                ],
                order: [[sortField, order]]
            });

            res.status(200).json({
                success: true,
                data: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit)
                }
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    // GET /products/:id
    static async show(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id, {
                include: [
                    { model: Category, as: 'category' },
                    { model: ProductMedia, as: 'media' },
                    { model: ProductEmbed, as: 'embeds' }
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
    static async showBySlug(req, res, next) {
        try {
            const { slug } = req.params;

            const product = await Product.findOne({
                where: { slug },
                include: [
                    { model: Category, as: 'category' },
                    { model: ProductMedia, as: 'media' },
                    { model: ProductEmbed, as: 'embeds' }
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

    // POST /products
    static async create(req, res, next) {
        try {
            // Parse the JSON data from the form
            const productData = JSON.parse(req.body.data);
            const {
                name,
                category_id,
                description,
                specifications,
                requirements,
                price,
                is_featured,
                status,
                meta_title,
                meta_description,
                meta_keywords,
                embeds = []
            } = productData;

            // Validasi data
            if (!name || !category_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Name dan category_id wajib diisi'
                });
            }

            // Validasi format specifications dan requirements
            if (specifications && typeof specifications !== 'object') {
                return res.status(400).json({
                    success: false,
                    message: 'Format specifications tidak valid'
                });
            }

            if (requirements && typeof requirements !== 'object') {
                return res.status(400).json({
                    success: false,
                    message: 'Format requirements tidak valid'
                });
            }

            // Validasi category
            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Category tidak ditemukan'
                });
            }

            // Buat slug dari nama
            const slug = slugify(name, { lower: true });

            // Handle thumbnail upload
            let thumbnail_url = null;
            if (req.files && req.files.thumbnail) {
                const file = req.files.thumbnail[0];
                thumbnail_url = `/uploads/${file.filename}`;
            }

            // Buat product dengan data yang sudah divalidasi
            const product = await Product.create({
                name,
                slug,
                category_id,
                description,
                specifications: specifications || {},
                requirements: requirements || {},
                price,
                is_featured,
                status: status || 'draft',
                meta_title,
                meta_description,
                meta_keywords,
                thumbnail_url,
                author_id: req.user.id
            });

            // Handle media uploads
            if (req.files && req.files.media) {
                const mediaData = req.files.media.map((file, index) => ({
                    url: `/uploads/${file.filename}`,
                    product_id: product.id,
                    sort_order: index
                }));
                await ProductMedia.bulkCreate(mediaData);
            }

            // Handle embeds
            if (embeds && embeds.length > 0) {
                const embedData = embeds.map((embed, index) => ({
                    embed_url: ProductController.convertToEmbedUrl(embed),
                    product_id: product.id,
                    sort_order: index
                }));
                await ProductEmbed.bulkCreate(embedData);
            }

            // Ambil data lengkap product dengan relasi
            const fullProduct = await Product.findByPk(product.id, {
                include: [
                    { model: Category, as: 'category' },
                    { model: ProductMedia, as: 'media' },
                    { model: ProductEmbed, as: 'embeds' }
                ]
            });

            res.status(201).json({
                success: true,
                data: fullProduct
            });
        } catch (err) {
            console.error('Error creating product:', err);
            // Hapus file yang sudah diupload jika terjadi error
            if (req.files) {
                const files = Object.values(req.files).flat();
                for (const file of files) {
                    try {
                        await fs.unlink(file.path);
                    } catch (unlinkErr) {
                        console.error('Error deleting file:', unlinkErr);
                    }
                }
            }
            next(err);
        }
    }

    // PUT /products/:id
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const productData = JSON.parse(req.body.data);
            const {
                name,
                category_id,
                description,
                specifications,
                requirements,
                price,
                is_featured,
                status,
                meta_title,
                meta_description,
                meta_keywords,
                embeds = []
            } = productData;

            // Cari product yang akan diupdate
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product tidak ditemukan'
                });
            }

            // Validasi format specifications dan requirements
            if (specifications && typeof specifications !== 'object') {
                return res.status(400).json({
                    success: false,
                    message: 'Format specifications tidak valid'
                });
            }

            if (requirements && typeof requirements !== 'object') {
                return res.status(400).json({
                    success: false,
                    message: 'Format requirements tidak valid'
                });
            }

            // Validasi category jika diupdate
            if (category_id) {
                const category = await Category.findByPk(category_id);
                if (!category) {
                    return res.status(400).json({
                        success: false,
                        message: 'Category tidak ditemukan'
                    });
                }
            }

            // Buat slug dari nama jika nama diupdate
            const slug = name ? slugify(name, { lower: true }) : undefined;

            // Handle thumbnail upload
            let thumbnail_url = product.thumbnail_url;
            if (req.files && req.files.thumbnail) {
                // Hapus thumbnail lama jika ada
                if (product.thumbnail_url) {
                    try {
                        await fs.unlink(path.join(__dirname, '..', product.thumbnail_url));
                    } catch (err) {
                        console.error('Error deleting old thumbnail:', err);
                    }
                }
                thumbnail_url = `/uploads/${req.files.thumbnail[0].filename}`;
            }

            // Update product dengan data yang sudah divalidasi
            await product.update({
                name,
                slug,
                category_id,
                description,
                specifications,
                requirements,
                price,
                is_featured,
                status,
                meta_title,
                meta_description,
                meta_keywords,
                thumbnail_url
            });

            // Handle media uploads
            if (req.files && req.files.media) {
                // Hapus media yang ada
                const existingMedia = await ProductMedia.findAll({ where: { product_id: id } });
                for (const media of existingMedia) {
                    try {
                        await fs.unlink(path.join(__dirname, '..', media.url));
                    } catch (err) {
                        console.error('Error deleting old media:', err);
                    }
                }
                await ProductMedia.destroy({ where: { product_id: id } });

                // Buat record media baru
                const mediaData = req.files.media.map((file, index) => ({
                    url: `/uploads/${file.filename}`,
                    product_id: id,
                    sort_order: index
                }));
                await ProductMedia.bulkCreate(mediaData);
            }

            // Handle embeds
            if (embeds) {
                // Delete existing embeds
                await ProductEmbed.destroy({ where: { product_id: id } });

                // Create new embeds
                if (embeds.length > 0) {
                    const embedData = embeds.map((embed, index) => ({
                        embed_url: ProductController.convertToEmbedUrl(embed),
                        product_id: id,
                        sort_order: index
                    }));
                    await ProductEmbed.bulkCreate(embedData);
                }
            }

            // Ambil data product yang sudah diupdate
            const updatedProduct = await Product.findByPk(id, {
                include: [
                    { model: Category, as: 'category' },
                    { model: ProductMedia, as: 'media' },
                    { model: ProductEmbed, as: 'embeds' }
                ]
            });

            res.status(200).json({
                success: true,
                data: updatedProduct
            });
        } catch (err) {
            console.error('Error updating product:', err);
            // Hapus file yang sudah diupload jika terjadi error
            if (req.files) {
                const files = Object.values(req.files).flat();
                for (const file of files) {
                    try {
                        await fs.unlink(file.path);
                    } catch (unlinkErr) {
                        console.error('Error deleting file:', unlinkErr);
                    }
                }
            }
            next(err);
        }
    }

    // DELETE /products/:id
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product tidak ditemukan'
                });
            }

            // Hapus thumbnail
            if (product.thumbnail_url) {
                try {
                    await fs.unlink(path.join(__dirname, '..', product.thumbnail_url));
                } catch (err) {
                    console.error('Gagal hapus thumbnail:', err);
                }
            }

            // Hapus semua media
            const mediaFiles = await ProductMedia.findAll({ where: { product_id: id } });
            for (const media of mediaFiles) {
                try {
                    await fs.unlink(path.join(__dirname, '..', media.url));
                } catch (err) {
                    console.error('Gagal hapus media:', err);
                }
            }

            // Hapus media di DB
            await ProductMedia.destroy({ where: { product_id: id } });

            // Hapus product
            await product.destroy();

            return res.status(200).json({
                success: true,
                message: 'Product berhasil dihapus'
            });
        } catch (err) {
            console.error('Error deleting product:', err);
            next(err);
        }
    }

    // GET /products/:id/media
    static async getMedia(req, res, next) {
        try {
            const { id } = req.params;
            const media = await ProductMedia.findAll({
                where: { product_id: id },
                order: [['sort_order', 'ASC']]
            });
            res.status(200).json(media);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    // POST /products/:id/media
    static async addMedia(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            if (!req.files || !req.files.media) {
                return res.status(400).json({ message: 'No media files uploaded' });
            }

            // Get current highest sort_order
            const lastMedia = await ProductMedia.findOne({
                where: { product_id: id },
                order: [['sort_order', 'DESC']]
            });
            const startOrder = lastMedia ? lastMedia.sort_order + 1 : 0;

            // Create new media records
            const mediaData = req.files.media.map((file, index) => ({
                url: `/uploads/${file.filename}`,
                product_id: id,
                sort_order: startOrder + index
            }));
            const newMedia = await ProductMedia.bulkCreate(mediaData);

            res.status(201).json(newMedia);
        } catch (err) {
            console.error(err);
            // If there's an error, delete any uploaded files
            if (req.files) {
                const files = Object.values(req.files).flat();
                for (const file of files) {
                    try {
                        await fs.unlink(file.path);
                    } catch (unlinkErr) {
                        console.error('Error deleting file:', unlinkErr);
                    }
                }
            }
            next(err);
        }
    }

    // PUT /products/:id/media/:mediaId
    static async updateMedia(req, res, next) {
        try {
            const { id, mediaId } = req.params;
            const { sort_order } = req.body;

            const media = await ProductMedia.findOne({
                where: { id: mediaId, product_id: id }
            });
            if (!media) return res.status(404).json({ message: 'Media not found' });

            if (sort_order !== undefined) {
                await media.update({ sort_order });
            }

            res.status(200).json(media);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    // DELETE /products/:id/media/:mediaId
    static async deleteMedia(req, res, next) {
        try {
            const { id, mediaId } = req.params;
            const media = await ProductMedia.findOne({
                where: { id: mediaId, product_id: id }
            });
            if (!media) return res.status(404).json({ message: 'Media not found' });

            // Delete file
            try {
                await fs.unlink(path.join(__dirname, '..', media.url));
            } catch (err) {
                console.error('Error deleting media file:', err);
            }

            // Delete record
            await media.destroy();
            res.status(200).json({ message: 'Media deleted successfully' });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    // PUT /products/:id/media/reorder
    static async reorderMedia(req, res, next) {
        try {
            const { id } = req.params;
            const { mediaIds } = req.body; // Array of media IDs in new order

            if (!Array.isArray(mediaIds)) {
                return res.status(400).json({ message: 'mediaIds must be an array' });
            }

            // Update sort_order for each media
            const updates = mediaIds.map((mediaId, index) =>
                ProductMedia.update(
                    { sort_order: index },
                    { where: { id: mediaId, product_id: id } }
                )
            );
            await Promise.all(updates);

            // Get updated media list
            const media = await ProductMedia.findAll({
                where: { product_id: id },
                order: [['sort_order', 'ASC']]
            });

            res.status(200).json(media);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    // GET /products/:id/embeds
    static async getEmbeds(req, res, next) {
        try {
            const { id } = req.params;
            const embeds = await ProductEmbed.findAll({
                where: { product_id: id },
                order: [['sort_order', 'ASC']]
            });
            res.status(200).json(embeds);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    // POST /products/:id/embeds
    static async addEmbed(req, res, next) {
        try {
            const { id } = req.params;
            const { embed_url } = req.body;

            if (!embed_url) {
                return res.status(400).json({ message: 'Embed URL is required' });
            }

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Get current highest sort_order
            const lastEmbed = await ProductEmbed.findOne({
                where: { product_id: id },
                order: [['sort_order', 'DESC']]
            });
            const sort_order = lastEmbed ? lastEmbed.sort_order + 1 : 0;

            // Create new embed with converted URL
            const embed = await ProductEmbed.create({
                embed_url: ProductController.convertToEmbedUrl(embed_url),
                product_id: id,
                sort_order
            });

            res.status(201).json(embed);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    // PUT /products/:id/embeds/:embedId
    static async updateEmbed(req, res, next) {
        try {
            const { id, embedId } = req.params;
            const { embed_url, sort_order } = req.body;

            const embed = await ProductEmbed.findOne({
                where: { id: embedId, product_id: id }
            });
            if (!embed) {
                return res.status(404).json({ message: 'Embed not found' });
            }

            const updateData = {};
            if (embed_url) updateData.embed_url = ProductController.convertToEmbedUrl(embed_url);
            if (sort_order !== undefined) updateData.sort_order = sort_order;

            await embed.update(updateData);

            res.status(200).json(embed);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    // DELETE /products/:id/embeds/:embedId
    static async deleteEmbed(req, res, next) {
        try {
            const { id, embedId } = req.params;
            const embed = await ProductEmbed.findOne({
                where: { id: embedId, product_id: id }
            });
            if (!embed) {
                return res.status(404).json({ message: 'Embed not found' });
            }

            await embed.destroy();
            res.status(200).json({ message: 'Embed deleted successfully' });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    // PUT /products/:id/embeds/reorder
    static async reorderEmbeds(req, res, next) {
        try {
            const { id } = req.params;
            const { embedIds } = req.body; // Array of embed IDs in new order

            if (!Array.isArray(embedIds)) {
                return res.status(400).json({ message: 'embedIds must be an array' });
            }

            // Update sort_order for each embed
            const updates = embedIds.map((embedId, index) =>
                ProductEmbed.update(
                    { sort_order: index },
                    { where: { id: embedId, product_id: id } }
                )
            );
            await Promise.all(updates);

            // Get updated embed list
            const embeds = await ProductEmbed.findAll({
                where: { product_id: id },
                order: [['sort_order', 'ASC']]
            });

            res.status(200).json(embeds);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

module.exports = ProductController;