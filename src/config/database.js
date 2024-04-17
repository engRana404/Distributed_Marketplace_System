const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('e-commerce','postgres','12345678',{
  host: 'localhost',
  dialect: 'postgres',
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