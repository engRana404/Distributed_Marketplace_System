const {sequelize,sequelize2} = require('../config/database');
const { DataTypes, Model } = require('sequelize')

// class UserVoucher extends Model {}

const UserVoucher = sequelize.define('UserVoucher',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
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

const UserVoucher2 = sequelize2.define('UserVoucher',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
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

module.exports = {UserVoucher,UserVoucher2};