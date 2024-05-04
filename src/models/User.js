
const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize');
const {randomBytes, scrypt} = require('crypto')
const {promisify} = require('util')

const scryptPromise = promisify(scrypt)



const User = sequelize.define('User',{
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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Invalid email format"
          }
        }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isPhoneNumber(value) {
          // Regular expression to check for a valid phone number format
          if (!/^\+?\d{8,15}$/.test(value)) {
            throw new Error('Invalid phone number');
          }
        }  
      }

    },
    role: {
      type: DataTypes.ENUM('user','admin'),
      allowNull: false,
      defaultValue: 'user',
      
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Invalid url format"
        }
      }
    }
},
{
  modelName: "users",
  defaultScope: {
      attributes: { exclude: ['password'] }
  },
  
  timestamps: true,
  updatedAt: true,
  createdAt: true,
}
); 

User.beforeCreate(async (user, options) => {
  if (user.password) {
      const salt = randomBytes(8).toString('hex');
      const hashedPassword = await scryptPromise(user.password, salt, 32 );
      user.password = `${hashedPassword.toString('hex')}.${salt}`;
      console.log(user.password)
  }
});

module.exports = User;
