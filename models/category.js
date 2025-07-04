'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: 'category_id',
        as: 'products'
      });

      Category.hasMany(models.SubCategory, {
        foreignKey: 'category_id',
        as: 'subCategories'
      })
    }
  }
  Category.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
  });
  return Category;
};