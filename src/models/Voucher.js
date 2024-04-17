const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Voucher extends Model {}
Voucher.init({
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
    type: DataTypes.ENUM('active', 'expired', 'disabled'),
    allowNull: false,
    defaultValue: 'active'
  }
},
{
  sequelize,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  modelName: 'voucher'
})

module.exports = Voucher