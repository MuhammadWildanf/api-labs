'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const subCategories = require('../data/subcategories.json').map((subCategories) => {
      subCategories.createdAt = new Date()
      subCategories.updatedAt = new Date()
      return subCategories
    })

    await queryInterface.bulkInsert('SubCategories', subCategories);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SubCategories', null, {});
  }
};
