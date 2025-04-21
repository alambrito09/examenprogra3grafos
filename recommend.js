// recommend.js
const { session, driver } = require('./db');

async function recommend(userId) {
  const result = await session.readTransaction(tx => tx.run(`
    MATCH (u:User {id: $userId})-[:BOUGHT]->(p:Product)
    MATCH (p)-[:SIMILAR]->(rec:Product)
    WHERE NOT (u)-[:BOUGHT]->(rec)
    RETURN rec.id AS productId, rec.name AS name, COUNT(*) AS score
    ORDER BY score DESC
    LIMIT 5
  `, { userId }));

  console.log(`📦 Recomendaciones para ${userId}:`);
  result.records.forEach(record => {
    console.log(`- ${record.get('name')} (ID: ${record.get('productId')})`);
  });

  await session.close();
  await driver.close();
}

recommend('u1');
