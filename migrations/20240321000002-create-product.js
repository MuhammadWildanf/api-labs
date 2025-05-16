'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            author_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            category_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'categories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            thumbnail_url: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            specifications: {
                type: Sequelize.JSON
            },
            requirements: {
                type: Sequelize.JSON
            },
            price: {
                type: Sequelize.DECIMAL(10, 2)
            },
            is_featured: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            status: {
                type: Sequelize.ENUM('draft', 'published', 'archived'),
                defaultValue: 'draft'
            },
            meta_title: {
                type: Sequelize.STRING
            },
            meta_description: {
                type: Sequelize.TEXT
            },
            meta_keywords: {
                type: Sequelize.STRING
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Add indexes
        await queryInterface.addIndex('products', ['slug']);
        await queryInterface.addIndex('products', ['category_id']);
        await queryInterface.addIndex('products', ['status']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('products');
    }
}; 