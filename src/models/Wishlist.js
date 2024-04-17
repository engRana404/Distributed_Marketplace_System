
const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize')

class WishList extends Model {}

WishList.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Add auto-incrementing behavior
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
  }},
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'id'
    },
    allowNull: false
  },
},
{
  sequelize,
  modelName: 'wishlist',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId']
    }
  ]
})

module.exports = WishList;