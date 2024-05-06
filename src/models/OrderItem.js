const { DataTypes, Model } = require('sequelize');
const {sequelize,sequelize2} = require('../config/database');

// class OrderItem extends Model {}

const OrderItem = sequelize.define('OrderItem',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  orderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Orders',
      key: 'id'
    },
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Products',
      key: 'id'
    },
    allowNull: false
  },
},
{
  modelName: "orderItems",
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  indexes: [
    {
      unique: true,
      fields: ['orderId', 'productId']
    }
  ]
})

const OrderItem2 = sequelize2.define('OrderItem',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  orderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Orders',
      key: 'id'
    },
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Products',
      key: 'id'
    },
    allowNull: false
  },
},
{
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  indexes: [
    {
      unique: true,
      fields: ['orderId', 'productId']
    }
  ]
})

module.exports = {OrderItem,OrderItem2};