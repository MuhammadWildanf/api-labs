'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductEmbed extends Model {
        static associate(models) {
            ProductEmbed.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'product'
            });
        }
    }

    ProductEmbed.init({
        product_id: DataTypes.INTEGER,
        embed_url: DataTypes.STRING,
        sort_order: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'ProductEmbed',
        tableName: 'product_embeds',
        underscored: true
    });

    return ProductEmbed;
};
