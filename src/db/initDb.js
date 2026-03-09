/**
 * Script para inicializar as tabelas do banco de dados PostgreSQL
 * Execute: npm run init-db
 */

const { pool } = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();
  try {
    // Tabela Order: orderId, value, creationDate
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Order" (
        "orderId" VARCHAR(255) PRIMARY KEY,
        value DECIMAL(15, 2) NOT NULL,
        "creationDate" TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);
    console.log('Tabela Order criada ou já existe.');

    // Tabela Items: orderId, productId, quantity, price
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Items" (
        "orderId" VARCHAR(255) NOT NULL REFERENCES "Order"("orderId") ON DELETE CASCADE,
        "productId" VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        PRIMARY KEY ("orderId", "productId")
      );
    `);
    console.log('Tabela Items criada ou já existe.');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

createTables();
