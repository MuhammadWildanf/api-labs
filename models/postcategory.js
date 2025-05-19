'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostCategory extends Model {
    static associate(models) {
      PostCategory.hasMany(models.Post, { foreignKey: 'category_id' });
    }
  }

  PostCategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'PostCategory',
    tableName: 'post_categories',  // sesuaikan dengan nama tabel di DB
    underscored: false,             // biar pakai snake_case untuk kolom timestamp
  });

  return PostCategory;
};
