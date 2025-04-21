const express = require('express');
const { driver } = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// 🚀 Sirve los archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// 🧠 Ruta para obtener recomendaciones por userId
app.get('/recommend/:userId', async (req, res) => {
  const session = driver.session();
  const userId = req.params.userId;

  try {
    const result = await session.run(`
      MATCH (u:User {id: $userId})-[:BOUGHT]->(p:Product)
      MATCH (p)-[:SIMILAR]->(rec:Product)
      WHERE NOT (u)-[:BOUGHT]->(rec)
      RETURN rec.id AS id, rec.name AS name
      LIMIT 5
    `, { userId });

    const recommendations = result.records.map(r => ({
      id: r.get('id'),
      name: r.get('name')
    }));

    res.json({ userId, recommendations });
  } catch (error) {
    console.error('Error obteniendo recomendaciones:', error);
    res.status(500).send("Error al obtener recomendaciones");
  } finally {
    await session.close();
  }
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 pagina  para ver recomendaciones`);
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🚀 pagina para ingresar usuario y producto y registrar compra`);
  console.log(`✅ Servidor corriendo en http://localhost:3000/ingresar.html`);
  console.log(`🚀 pagina para el usuario`);
  console.log(`✅ Servidor corriendo en http://localhost:3000/usuario.html`);
});
// Crear usuario
app.post('/usuario', async (req, res) => {
    const { id } = req.body;
    const session = driver.session();
    try {
      await session.run(`MERGE (:User {id: $id})`, { id });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      await session.close();
    }
  });
  
  // Crear producto
  app.post('/producto', async (req, res) => {
    const { id, name } = req.body;
    const session = driver.session();
    try {
      await session.run(`MERGE (:Product {id: $id, name: $name})`, { id, name });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      await session.close();
    }
  });
  
  // Registrar compra
  app.post('/comprar', async (req, res) => {
    const { userId, productId } = req.body;
    const session = driver.session();
    try {
      await session.run(`
        MATCH (u:User {id: $userId}), (p:Product {id: $productId})
        MERGE (u)-[:BOUGHT]->(p)
      `, { userId, productId });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      await session.close();
    }
  });
  
  // Conectar productos similares
  app.post('/similares', async (req, res) => {
    const { p1, p2, score } = req.body;
    const session = driver.session();
    try {
      await session.run(`
        MATCH (a:Product {id: $p1}), (b:Product {id: $p2})
        MERGE (a)-[r:SIMILAR]->(b)
        SET r.score = $score
      `, { p1, p2, score });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      await session.close();
    }
  });
  // Eliminar usuario (y sus relaciones)
app.delete('/usuario/:id', async (req, res) => {
    const session = driver.session();
    const id = req.params.id;
    try {
      await session.run(`
        MATCH (u:User {id: $id})
        DETACH DELETE u
      `, { id });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      await session.close();
    }
  });
  
  // Eliminar producto (y sus relaciones)
  app.delete('/producto/:id', async (req, res) => {
    const session = driver.session();
    const id = req.params.id;
    try {
      await session.run(`
        MATCH (p:Product {id: $id})
        DETACH DELETE p
      `, { id });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      await session.close();
    }
  });
  // Relación de compra (User -> Product)
app.post('/comprar', async (req, res) => {
    const session = driver.session();
    const { userId, productId } = req.body;
  
    try {
      await session.run(`
        MATCH (u:User {id: $userId}), (p:Product {id: $productId})
        MERGE (u)-[:BOUGHT]->(p)
      `, { userId, productId });
  
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    } finally {
      await session.close();
    }
  });
 
// Eliminar relación de compra entre usuario y producto
app.post('/eliminar-compra', async (req, res) => {
  const session = driver.session();
  const { userId, productId } = req.body;

  try {
    await session.run(`
      MATCH (u:User {id: $userId})-[r:BOUGHT]->(p:Product {id: $productId})
      DELETE r
    `, { userId, productId });

    res.send("Compra eliminada");
  } catch (error) {
    res.status(500).send("Error al eliminar la compra");
  } finally {
    await session.close();
  }
});

// Verificar si existe un usuario
app.get('/usuario/verificar/:id', async (req, res) => {
    const session = driver.session();
    const id = req.params.id;
    
    try {
        const result = await session.run(`
            MATCH (u:User {id: $id})
            RETURN u
        `, { id });
        
        if (result.records.length > 0) {
            res.sendStatus(200); // Usuario existe
        } else {
            res.sendStatus(404); // Usuario no encontrado
        }
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        res.status(500).send("Error al verificar usuario");
    } finally {
        await session.close();
    }
});

// Login de usuario
app.post('/usuario/login', async (req, res) => {
    const session = driver.session();
    const { id } = req.body;
    
    try {
        const result = await session.run(`
            MATCH (u:User {id: $id})
            RETURN u
        `, { id });
        
        if (result.records.length > 0) {
            res.sendStatus(200); // Login exitoso
        } else {
            res.status(401).send("Usuario no encontrado");
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send("Error al iniciar sesión");
    } finally {
        await session.close();
    }
});

// Registro de usuario
app.post('/usuario/registro', async (req, res) => {
    const session = driver.session();
    const { id } = req.body;
    
    try {
        // Primero verificamos si ya existe
        const checkResult = await session.run(`
            MATCH (u:User {id: $id})
            RETURN u
        `, { id });
        
        if (checkResult.records.length > 0) {
            res.status(409).send("El usuario ya existe"); // Conflict
            return;
        }
        
        // Si no existe, lo creamos
        await session.run(`
            CREATE (u:User {id: $id})
        `, { id });
        
        res.sendStatus(201); // Created
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).send("Error al registrar usuario");
    } finally {
        await session.close();
    }
});
