/**
 * Controller dos endpoints de pedidos
 */

const orderService = require('../services/orderService');

/**
 * POST /order - Cria um novo pedido
 */
async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /order/:orderNumber - Obtém um pedido pelo número
 */
async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrderByNumber(req.params.orderNumber);
    if (!order) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Pedido não encontrado para o número informado.',
      });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /order/list - Lista todos os pedidos
 */
async function listOrders(req, res, next) {
  try {
    const orders = await orderService.listOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /order/:orderNumber - Atualiza um pedido
 */
async function updateOrder(req, res, next) {
  try {
    const order = await orderService.updateOrder(req.params.orderNumber, req.body);
    if (!order) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Pedido não encontrado para o número informado.',
      });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /order/:orderNumber - Remove um pedido
 */
async function deleteOrder(req, res, next) {
  try {
    const deleted = await orderService.deleteOrder(req.params.orderNumber);
    if (!deleted) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Pedido não encontrado para o número informado.',
      });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  deleteOrder,
};
