const sequelize = require('../config/database')
const { DataTypes, Model } = require('sequelize')

class UserVoucher extends Model {}

UserVoucher.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Add auto-incrementing behavior
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
  }},
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
  modelName: 'userVoucher',
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'voucherId']
    }
  ]
})

module.exports = UserVoucher;