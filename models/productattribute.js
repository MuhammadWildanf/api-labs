'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductAttribute extends Model {
        static associate(models) {
            // ProductAttribute belongs to Product
            ProductAttribute.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'product'
            });
        }
    }
    ProductAttribute.init({
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        attribute_type: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Type of attribute (e.g., specification, feature, requirement)'
        },
        attribute_key: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name of the attribute (e.g., "Screen Size", "Processor")'
        },
        attribute_value: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Value of the attribute'
        },
        display_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Order in which to display this attribute'
        },
        is_visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Whether this attribute should be displayed'
        }
    }, {
        sequelize,
        modelName: 'ProductAttribute',
        timestamps: true,
        underscored: true
    });
    return ProductAttribute;
}; 