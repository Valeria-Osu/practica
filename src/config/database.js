// src/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cafeterias_db', 'samuel_corral', 'loganswan321', {
  host: 'localhost',  
  dialect: 'mssql',  
  dialectOptions: {
    encrypt: true,     
    trustServerCertificate: true 
  },
  logging: false,     
});

module.exports = sequelize;

// Este codigo me sirve para ver si se hace la conexion correcta mediante el comando node src/config/database.js
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });

