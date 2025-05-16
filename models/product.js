'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Product belongs to Category
      Product.belongsTo(models.User, { foreignKey: "author_id" })
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });

      // Product has many ProductMedia
      Product.hasMany(models.ProductMedia, {
        foreignKey: 'product_id',
        as: 'media'
      });
    }
  }
  Product.init({
    author_id: {
      type:
        DataTypes.INTEGER
    },
    category_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    thumbnail_url: DataTypes.STRING,
    description: DataTypes.TEXT,
    specifications: DataTypes.JSON,
    requirements: DataTypes.JSON,
    price: DataTypes.DECIMAL(10, 2),
    is_featured: DataTypes.BOOLEAN,
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    meta_title: DataTypes.STRING,
    meta_description: DataTypes.TEXT,
    meta_keywords: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: true,
    underscored: true
  });
  return Product;
};