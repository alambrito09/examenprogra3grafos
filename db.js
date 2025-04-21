// db.js
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', '12345678') // Cambia la contraseña
);

const session = driver.session();

module.exports = { driver, session };
