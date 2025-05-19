const { Post, PostCategory, User } = require('../models')
class PostController {
    static async index(req, res) {
        try {
            const posts = await Post.findAll({
                include: [
                    { model: PostCategory, as: 'category', attributes: ['id', 'name'] },
                    { model: User, attributes: ['id', 'username'] }
                ]
            });
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async show(req, res) {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: [
                    { model: PostCategory, as: 'category', attributes: ['id', 'name'] },
                    { model: User, attributes: ['id', 'username'] }
                ]
            });
            if (!post) return res.status(404).json({ message: 'Post not found' });
            res.json(post);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const newPost = await Post.create(req.body);
            res.status(201).json(newPost);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const post = await Post.findByPk(req.params.id);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            await post.update(req.body);
            res.json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const post = await Post.findByPk(req.params.id);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            await post.destroy();
            res.json({ message: 'Post deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PostController