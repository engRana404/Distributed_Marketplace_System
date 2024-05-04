
const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize')

// class WishList extends Model {}

const WishList = sequelize.define('Wishlist',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Add auto-incrementing behavior
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
  }},
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
  modelName: "wishlist",
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId']
    }
  ]
})

module.exports = WishList;