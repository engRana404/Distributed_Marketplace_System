const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

// class Voucher extends Model {}
const Voucher = sequelize.define('Voucher',{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      max: 5,
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  voucherType: {
    type: DataTypes.ENUM('rateDiscount', 'fixedAmountDiscount', 'freeShipping', 'referralDiscount'),
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  minimumPurchaseAmount: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  maximumDiscountAmount: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'disabled'),
    allowNull: false,
    defaultValue: 'active'
  }
},
{
  modelName: "vouchers", 
  timestamps: true,
  createdAt: true,
  updatedAt: true,
})

module.exports = Voucher