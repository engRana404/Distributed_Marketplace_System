const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize');

// class ProductTag extends Model {}

const ProductTag = sequelize.define('ProductTag',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Add auto-incrementing behavior
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Products',
      key: 'id'
    },
    allowNull: false
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Tags',
      key: 'id'
    },
    allowNull: false
  }
},
{
  modelName: "productTags",
  indexes: [
    {
      unique: true,
      fields: ['productId', 'tagId']
    }
  ],
})

module.exports = ProductTag;