'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('products', 'subcategory_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'SubCategories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('products', 'subcategory_id');
    }
}; 