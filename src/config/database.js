const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//     host: "e-commerce.c768ky8mu5dz.eu-north-1.rds.amazonaws.com",
//     database: "initial_db",
//     username: "postgres",
//     password: "12345678",
//     dialect: "postgres",
//     port: 5432 ,
//     dialectOptions: {
//         ssl: {
//           require: true, // This will help you. But you will see nwe error
//           rejectUnauthorized: false // This line will fix new error
//         }
//       }, 
// })

const sequelize = new Sequelize({
    database: 'e-commerce',
    username: 'example',
    password: 'root',
    host: 'node_db',
    port: 5432,
    dialect: 'postgres',
  });
  
  // Connection details for PostgreSQL instance 2
//   const sequelize2 = new Sequelize({
//     database: 'database2',
//     username: 'user2',
//     password: 'password2',
//     host: 'postgres2',
//     port: 5432,
//     dialect: 'postgres',
//   });

sequelize.authenticate() 
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
 
// sequelize1.authenticate()  
//     .then(() => {
//         console.log('Connection to the database of postgres1 has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     })

// sequelize2.authenticate() 
//     .then(() => {
//         console.log('Connection to the database of postgres2 has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

// Export the initialized Sequelize instance
module.exports =sequelize