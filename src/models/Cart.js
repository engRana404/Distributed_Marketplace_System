const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model {}

Cart.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Add auto-incrementing behavior
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
  }},
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'id'
    },
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},
{
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  sequelize,
  modelName: 'cart',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId']
    }
  ]
})

module.exports = Cart;