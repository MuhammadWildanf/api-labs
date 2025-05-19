const { Comment, Post, User } = require('../models')
class CommentController {
    async getAll(req, res) {
        try {
            const comments = await Comment.findAll({
                include: [
                    { model: Post, attributes: ['id', 'title'] },
                    { model: User, attributes: ['id', 'username'] }
                ]
            });
            res.json(comments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const comment = await Comment.findByPk(req.params.id, {
                include: [
                    { model: Post, attributes: ['id', 'title'] },
                    { model: User, attributes: ['id', 'username'] }
                ]
            });
            if (!comment) return res.status(404).json({ message: 'Comment not found' });
            res.json(comment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newComment = await Comment.create(req.body);
            res.status(201).json(newComment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const comment = await Comment.findByPk(req.params.id);
            if (!comment) return res.status(404).json({ message: 'Comment not found' });
            await comment.update(req.body);
            res.json(comment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const comment = await Comment.findByPk(req.params.id);
            if (!comment) return res.status(404).json({ message: 'Comment not found' });
            await comment.destroy();
            res.json({ message: 'Comment deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CommentController