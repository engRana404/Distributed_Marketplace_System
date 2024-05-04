const sequelize = require('../config/database')
const { DataTypes, Model } = require('sequelize')

// class UserVoucher extends Model {}

const UserVoucher = sequelize.define('UserVoucher',{
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
      model: 'Users',
      key: 'id'
  }},
  voucherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Vouchers',
      key: 'id'
  }},
},
{
  modelName: "userVouchers",
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