'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = require('../data/categories.json').map((categories) => {
      categories.createdAt = new Date()
      categories.updatedAt = new Date()
      return categories
    })

    await queryInterface.bulkInsert("categories", categories)
  },



  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories")
  }
};
