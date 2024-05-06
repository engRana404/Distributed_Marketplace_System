
const {sequelize,sequelize2} = require('../config/database');
const { DataTypes, Model } = require('sequelize')

// class WishList extends Model {}

const Wishlist = sequelize.define('Wishlist',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
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

const Wishlist2 = sequelize2.define('Wishlist',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
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
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId']
    }
  ]
})

module.exports = {Wishlist, Wishlist2};