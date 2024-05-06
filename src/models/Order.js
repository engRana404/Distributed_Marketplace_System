const { DataTypes, Model } = require('sequelize');
const {sequelize,sequelize2} = require('../config/database');

// class Order extends Model {}

const Order = sequelize.define('Order',{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
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
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 20
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  finalTotalAmount: {
    type: DataTypes.FLOAT,
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
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  voucherId: {
    type: DataTypes.INTEGER,
    allowNull: true,
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

const Order2 = sequelize2.define('Order',{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
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
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 20
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  finalTotalAmount: {
    type: DataTypes.FLOAT,
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
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  voucherId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Vouchers',
      key: 'id'
  }},
},
{
  defaultScope: {
    attributes: { exclude: ['paymentIntentId'] }
},
  timestamps: true,
  createdAt: true,
  updatedAt: true,
})


module.exports = {Order,Order2}