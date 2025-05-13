'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('product_attributes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            attribute_type: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Type of attribute (e.g., specification, feature, requirement)'
            },
            attribute_key: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Name of the attribute (e.g., "Screen Size", "Processor")'
            },
            attribute_value: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment: 'Value of the attribute'
            },
            display_order: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Order in which to display this attribute'
            },
            is_visible: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                comment: 'Whether this attribute should be displayed'
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
        await queryInterface.addIndex('product_attributes', ['product_id']);
        await queryInterface.addIndex('product_attributes', ['attribute_type']);
        await queryInterface.addIndex('product_attributes', ['attribute_key']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('product_attributes');
    }
}; 