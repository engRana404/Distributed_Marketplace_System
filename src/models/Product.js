const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')
class Product extends Model {}

 Product.init({
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
    allowNull: false,
    validate: {
      isNotEmpty(value) {
        if(value.length === 0 ) {
          throw new Error('prodduct must have an image');
        } 
        if(value.length > 5) {
          throw new Error('Product must have less than 5 images');
        }
      }
    }
  }
},
{
  sequelize,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  modelName: 'product'
})

module.exports = Product


