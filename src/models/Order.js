const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Order extends Model {}

Order.init({
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
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
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
      model: 'users',
      key: 'id'
  }},
  addressId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'addresses',
      key: 'id'
  }
  },
  voucherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vouchers',
      key: 'id'
  }},
},
{
  sequelize,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  modelName: 'order'
})


module.exports = Order