const { DataTypes, Model } = require('sequelize');
const {sequelize,sequelize2} = require('../config/database');

// class Address extends Model {}

const Address = sequelize.define('Address',{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
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
      model: 'Users',
      key: 'id'
  }},
},
{
 modelName: "addresses",
  timestamps: true,
  createdAt: true,
  updatedAt: true,
}
)

const Address2 = sequelize2.define('Address',{
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
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
      model: 'Users',
      key: 'id'
  }},
},
{
  timestamps: true,
  createdAt: true,
  updatedAt: true,
}
)

module.exports = {Address,Address2};