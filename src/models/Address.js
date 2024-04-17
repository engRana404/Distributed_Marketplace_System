const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Address extends Model {}

Address.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  streetAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: true
  },
  postalCode: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
  }},
},
{
  sequelize,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  modelName: 'address'
}
)

module.exports = Address;