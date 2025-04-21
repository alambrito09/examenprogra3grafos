"# examenprogra3grafos" 
# 🧠 Informe Examen Parcial 2 – Sistema de Recomendación con Grafos

## 👨‍💻 Estudiante:
[Alan steven Marroquin Villaseñor  0905-23-15264]

## 📅 Fecha:
[24/04/2025]

---

## 🎯 Objetivo
Desarrollar un sistema de recomendación utilizando una base de datos de grafos. Se utilizó **Neo4j** como motor principal para gestionar usuarios, productos y sus relaciones, implementando una API con **Node.js y Express** para interactuar con la base.

---

## 🧱 Diseño del Grafo

### 🔵 Nodos:
- **User**: Representa a un usuario del sistema. Identificado por `id`.
- **Product**: Representa un producto disponible. Identificado por `id` y `name`.

### 🔗 Relaciones:
- `:BOUGHT`: Conecta un usuario con los productos que ha comprado.
- `:SIMILAR`: Conecta productos similares entre sí. Tiene una propiedad `score` para indicar nivel de similitud.

---

## ⚙️ Funcionalidades Implementadas

- Crear usuarios
- Crear productos
- Registrar compras (`BOUGHT`)
- Establecer similitud entre productos (`SIMILAR`)
- Eliminar usuarios o productos (junto con sus relaciones)
- Eliminar compras de usuarios 
- registrarse si no tiene un usuario , si ya tiene usuario  entrar 
- Endpoint de recomendaciones basado en productos similares comprados
- Frontends simples en HTML para interactuar con la API

---

## 🤖 Enfoque Algorítmico

El sistema de recomendación se basa en grafos:

> Se buscan productos similares a los ya comprados por un usuario y que aún no ha comprado.  
> Esto se hace usando una consulta Cypher que explora relaciones del tipo `BOUGHT` y luego `SIMILAR`.

⚠️ Se intentó implementar también el algoritmo **PageRank** utilizando el plugin **GDS** de Neo4j. Sin embargo, este módulo generaba conflictos al intentar reproyectar un grafo existente, lo cual fue una dificultad.  
Por ello, se decidió no hacerlo.

---

## 🛠️ Desafíos Encontrados

- **Gestión del grafo PageRank**: el módulo GDS causaba errores al cargar el grafo si este ya existía, por lo que se optó por simplificar la lógica para asegurar estabilidad.
- **Relaciones duplicadas**: se manejó el uso de `MERGE` para evitar duplicidad al crear usuarios, productos o relaciones.
- **Separar lógica backend y frontend**: inicialmente se colocaron muchos elementos en un solo archivo, luego se organizó por funciones específicas para mayor claridad.

---

## ✅ Resultado

El sistema permite:

- Crear y eliminar usuarios/productos
- Registrar compras
- eliminar productos de usuarios 
- login 
- Establecer relaciones de similitud
- Consultar recomendaciones desde un endpoint

Todo esto queda integrado y visualizable gracias a **Neo4j Browser** y el frontend básico.

---

## 📽️ Demostración link del video.
https://drive.google.com/file/d/1EQ4n_teTRdRG8pu2J8rgy5uvl6wkMkql/view?usp=sharing
