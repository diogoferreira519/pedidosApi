/**
 * Rotas da API de pedidos
 * Ordem importa: /order/list antes de /order/:orderNumber para não tratar "list" como número do pedido
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateOrderBody } = require('../middleware/validateOrderBody');

/**
 * @openapi
 * /order:
 *   post:
 *     summary: Criar um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numeroPedido, valorTotal, dataCriacao, items]
 *             properties:
 *               numeroPedido: { type: string, example: "v10089015vdb-01" }
 *               valorTotal: { type: number, example: 10000 }
 *               dataCriacao: { type: string, format: date-time }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idItem: { type: string }
 *                     quantidadeItem: { type: integer }
 *                     valorItem: { type: number }
 *     responses:
 *       201: { description: Pedido criado com sucesso }
 *       400: { description: Requisição inválida }
 *       409: { description: Pedido já existe com este número }
 */
router.post('/', validateOrderBody, orderController.createOrder);

/**
 * @openapi
 * /order/list:
 *   get:
 *     summary: Listar todos os pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200: { description: Lista de pedidos }
 */
router.get('/list', orderController.listOrders);

/**
 * @openapi
 * /order/{orderNumber}:
 *   get:
 *     summary: Obter pedido pelo número
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Pedido encontrado }
 *       404: { description: Pedido não encontrado }
 *   put:
 *     summary: Atualizar pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeroPedido: { type: string }
 *               valorTotal: { type: number }
 *               dataCriacao: { type: string }
 *               items: { type: array }
 *     responses:
 *       200: { description: Pedido atualizado }
 *       404: { description: Pedido não encontrado }
 *   delete:
 *     summary: Excluir pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Pedido excluído }
 *       404: { description: Pedido não encontrado }
 */
router.get('/:orderNumber', orderController.getOrder);
router.put('/:orderNumber', validateOrderBody, orderController.updateOrder);
router.delete('/:orderNumber', orderController.deleteOrder);

module.exports = router;
