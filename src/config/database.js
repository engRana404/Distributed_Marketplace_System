const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    host: "e-commerce.c768ky8mu5dz.eu-north-1.rds.amazonaws.com",
    database: "initial_db",
    username: "postgres",
    password: "12345678",
    dialect: "postgres",
    port: 5432 ,
    dialectOptions: {
        ssl: {
          require: true, // This will help you. But you will see nwe error
          rejectUnauthorized: false // This line will fix new error
        }
      }, 
})

sequelize.authenticate() 
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Export the initialized Sequelize instance
module.exports = sequelize;