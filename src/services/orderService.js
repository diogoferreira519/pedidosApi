/**
 * Serviço de persistência e consulta de pedidos no PostgreSQL
 */

const { pool } = require('../config/database');
const { mapRequestToOrder, mapOrderToResponse } = require('./orderMapper');

/**
 * Cria um novo pedido e seus itens (transação)
 * @param {Object} body - body da requisição (numeroPedido, valorTotal, dataCriacao, items)
 * @returns {Object} pedido criado no formato da API
 */
async function createOrder(body) {
  const client = await pool.connect();
  const { order, items } = mapRequestToOrder(body);

  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO "Order" ("orderId", value, "creationDate") VALUES ($1, $2, $3)`,
      [order.orderId, order.value, order.creationDate]
    );

    for (const item of items) {
      await client.query(
        `INSERT INTO "Items" ("orderId", "productId", quantity, price) VALUES ($1, $2, $3, $4)`,
        [item.orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return mapOrderToResponse(order, items);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Busca um pedido pelo número (orderId)
 * @param {string} orderNumber - número do pedido (ex: v10089016vdb)
 * @returns {Object|null} pedido no formato da API ou null
 */
async function getOrderByNumber(orderNumber) {
  const client = await pool.connect();
  try {
    const orderResult = await client.query(
      `SELECT "orderId", value, "creationDate" FROM "Order" WHERE "orderId" = $1`,
      [orderNumber]
    );
    if (orderResult.rows.length === 0) return null;

    const orderRow = orderResult.rows[0];
    const itemsResult = await client.query(
      `SELECT "productId", quantity, price FROM "Items" WHERE "orderId" = $1`,
      [orderNumber]
    );

    return mapOrderToResponse(orderRow, itemsResult.rows);
  } finally {
    client.release();
  }
}

/**
 * Lista todos os pedidos (cada um com seus itens)
 * @returns {Array<Object>}
 */
async function listOrders() {
  const client = await pool.connect();
  try {
    const orderResult = await client.query(
      `SELECT "orderId", value, "creationDate" FROM "Order" ORDER BY "creationDate" DESC`
    );
    const orders = [];

    for (const row of orderResult.rows) {
      const itemsResult = await client.query(
        `SELECT "productId", quantity, price FROM "Items" WHERE "orderId" = $1`,
        [row.orderId]
      );
      orders.push(mapOrderToResponse(row, itemsResult.rows));
    }

    return orders;
  } finally {
    client.release();
  }
}

/**
 * Atualiza um pedido existente (substitui itens)
 * @param {string} orderNumber - número do pedido
 * @param {Object} body - mesmo formato do create (numeroPedido pode ser outro; usamos orderNumber para identificar)
 * @returns {Object|null} pedido atualizado ou null se não existir
 */
async function updateOrder(orderNumber, body) {
  const existing = await getOrderByNumber(orderNumber);
  if (!existing) return null;

  const client = await pool.connect();
  const { order, items } = mapRequestToOrder(body);

  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE "Order" SET value = $1, "creationDate" = $2 WHERE "orderId" = $3`,
      [order.value, order.creationDate, orderNumber]
    );

    await client.query(`DELETE FROM "Items" WHERE "orderId" = $1`, [orderNumber]);

    for (const item of items) {
      await client.query(
        `INSERT INTO "Items" ("orderId", "productId", quantity, price) VALUES ($1, $2, $3, $4)`,
        [orderNumber, item.productId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return getOrderByNumber(orderNumber);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Remove um pedido e seus itens
 * @param {string} orderNumber - número do pedido
 * @returns {boolean} true se removeu, false se não existia
 */
async function deleteOrder(orderNumber) {
  const result = await pool.query(
    `DELETE FROM "Order" WHERE "orderId" = $1`,
    [orderNumber]
  );
  return (result.rowCount || 0) > 0;
}

module.exports = {
  createOrder,
  getOrderByNumber,
  listOrders,
  updateOrder,
  deleteOrder,
};
