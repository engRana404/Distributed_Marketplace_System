const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
// class Product extends Model {}

 const Product = sequelize.define('Product',{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imagesUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    validate: {
      isNotEmpty(value) {
        if(value && (value.length === 0) ) {
          throw new Error('prodduct must have an image');
        } 
        if(value && (value.length > 5)) {
          throw new Error('Product must have less than 5 images');
        }
      }
    }
  },
  sizes: {
    type: DataTypes.ARRAY(DataTypes.STRING )
  }
},
{
  modelName: "products",
  timestamps: true,
  createdAt: true,
  updatedAt: true,
})

module.exports = Product


