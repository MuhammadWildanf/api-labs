'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ProductMedia belongs to Product
      ProductMedia.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  ProductMedia.init({
    product_id: DataTypes.INTEGER,
    url: DataTypes.STRING,
    sort_order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductMedia',
    tableName: 'product_media',
    underscored: true
  });
  return ProductMedia;
};