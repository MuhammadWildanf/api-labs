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
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });

      // Product has many ProductMedia
      Product.hasMany(models.ProductMedia, {
        foreignKey: 'product_id',
        as: 'media'
      });

      // Product has many ProductAttributes
      Product.hasMany(models.ProductAttribute, {
        foreignKey: 'product_id',
        as: 'attributes'
      });
    }
  }
  Product.init({
    category_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    thumbnail_url: DataTypes.STRING,
    description: DataTypes.TEXT,
    short_description: DataTypes.TEXT,
    specifications: DataTypes.JSON, // For storing technical specifications
    features: DataTypes.JSON, // For storing product features
    system_requirements: DataTypes.TEXT, // For software/hardware requirements
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