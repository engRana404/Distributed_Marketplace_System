const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize');

class ProductTag extends Model {}

ProductTag.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Add auto-incrementing behavior
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'id'
    },
    allowNull: false
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'tags',
      key: 'id'
    },
    allowNull: false
  }
},
{
  sequelize,
  indexes: [
    {
      unique: true,
      fields: ['productId', 'tagId']
    }
  ],
  modelName: 'productTag'
})

module.exports = ProductTag;