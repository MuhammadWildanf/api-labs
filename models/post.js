'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            // Relasi ke User
            Post.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE'
            });

            // Relasi ke PostCategory
            Post.belongsTo(models.PostCategory, {
                foreignKey: 'category_id',
                as: 'category',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            });

            Post.hasMany(models.Comment, { foreignKey: 'post_id' });
        }
    }

    Post.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        excerpt: {
            type: DataTypes.TEXT
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        thumbnail: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('draft', 'published'),
            defaultValue: 'draft'
        },
        is_featured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        published_at: {
            type: DataTypes.DATE
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        underscored: true, // penting agar field snake_case tetap konsisten
    });

    return Post;
};
