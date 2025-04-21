// seed.js
const { session, driver } = require('./db');

async function seed() {
  await session.writeTransaction(tx => tx.run(`
    // Crear usuarios
    CREATE (u1:User {id: 'u1'})
    CREATE (u2:User {id: 'u2'})

    // Crear productos
    CREATE (p1:Product {id: 'p1', name: 'Mouse'})
    CREATE (p2:Product {id: 'p2', name: 'Teclado'})
    CREATE (p3:Product {id: 'p3', name: 'Monitor'})
    CREATE (p4:Product {id: 'p4', name: 'Laptop'})
    CREATE (p5:Product {id: 'p5', name: 'Tablet'})

    // Compras
    CREATE (u1)-[:BOUGHT {times: 2}]->(p1)
    CREATE (u1)-[:BOUGHT {times: 1}]->(p2)
    CREATE (u2)-[:BOUGHT {times: 1}]->(p2)
    CREATE (u2)-[:BOUGHT {times: 3}]->(p3)

    // Productos similares
    CREATE (p1)-[:SIMILAR {score: 0.9}]->(p2)
    CREATE (p2)-[:SIMILAR {score: 0.8}]->(p3)
    CREATE (p3)-[:SIMILAR {score: 0.5}]->(p4)
    CREATE (p2)-[:SIMILAR {score: 0.4}]->(p5)
  `));

  console.log('Datos creados');
  await session.close();
  await driver.close();
}

seed();
