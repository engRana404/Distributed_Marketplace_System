const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

// class Order extends Model {}

const Order = sequelize.define('Order',{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('incomplete','pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'incomplete'
  },
  shippingFees: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 20
  },
  totalAmount: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  finalTotalAmount: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
  }},
  addressId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Addresses',
      key: 'id'
  }
  },
  paymentMethodId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  voucherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Vouchers',
      key: 'id'
  }},
},
{
  modelName: "orders",
  timestamps: true,
  createdAt: true,
  updatedAt: true,
})


module.exports = Order