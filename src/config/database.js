const { Sequelize } = require('sequelize');



const sequelize = new Sequelize({
    database: 'e-commerce',
    username: 'example',
    password: 'root',
    host: 'node_db',
    port: 5432,
    dialect: 'postgres',
  });

  const sequelize2 = new Sequelize({
    database: 'e-commerce',
    username: 'example',
    password: 'root',
    host: 'node_db_2',
    port: 5432,
    dialect: 'postgres',
  });
  

sequelize.authenticate() 
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

    sequelize2.authenticate() 
    .then(() => {
        console.log('Connection to the database 2 has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
 


// Export the initialized Sequelize instance
module.exports ={sequelize,sequelize2}