'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            // Relasi ke User
            Comment.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
                onDelete: 'CASCADE'
            });

            // Relasi ke Post
            Comment.belongsTo(models.Post, {
                foreignKey: 'post_id',
                as: 'post',
                onDelete: 'CASCADE'
            });
        }
    }

    Comment.init({
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
        underscored: true,
    });

    return Comment;
};
