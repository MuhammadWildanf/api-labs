'use strict';
const {
  Model
} = require('sequelize');
const { hash } = require('../helpers/hash')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Product, { foreignKey: "authorId" })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'username is required' },
        notEmpty: { msg: 'Please enter your username' }
      }
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    profile: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'email is required' },
        notEmpty: { msg: 'Please enter your email' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'password is required' },
        notEmpty: { msg: 'Please enter your password' }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user) => {
        user.password = hash(user.password)
      }
    }
  });
  return User;
};