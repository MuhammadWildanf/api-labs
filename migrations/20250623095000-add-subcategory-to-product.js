'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Products', 'subcategory_id', {
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
        await queryInterface.removeColumn('Products', 'subcategory_id');
    }
}; 