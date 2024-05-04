const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

// class Tag extends Model {}

const Tag = sequelize.define('Tag',
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
  modelName:"tags"
})

module.exports = Tag