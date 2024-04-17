const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

class Tag extends Model {}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
},
{
  sequelize,
  modelName: 'tag'
})

module.exports = Tag