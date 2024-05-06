const { DataTypes, Model } = require('sequelize');
const {sequelize,sequelize2} = require('../config/database');



const Cart = sequelize.define('Cart',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
  }},
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Products',
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
  modelName: "cart",
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId']
    }
  ]
})

const Cart2 = sequelize2.define('Cart',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
  }},
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Products',
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
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId']
    }
  ]
})

module.exports = {Cart,Cart2};