/**
 * Mapeamento dos dados recebidos na API para o formato do banco de dados
 * Request (JSON) -> Model (Order + Items)
 */

/**
 * Converte o body da requisição para o formato das tabelas Order e Items
 * @param {Object} body - { numeroPedido, valorTotal, dataCriacao, items[] }
 * @returns {{ order: Object, items: Array }}
 */
function mapRequestToOrder(body) {
  const order = {
    orderId: body.numeroPedido,
    value: Number(body.valorTotal),
    creationDate: body.dataCriacao,
  };

  const items = (body.items || []).map((item) => ({
    orderId: body.numeroPedido,
    productId: String(item.idItem),
    quantity: Number(item.quantidadeItem),
    price: Number(item.valorItem),
  }));

  return { order, items };
}

/**
 * Converte registro do banco para formato de resposta da API (opcional, se quiser manter formato original)
 * @param {Object} orderRow - linha da tabela Order
 * @param {Array} itemsRows - linhas da tabela Items
 * @returns {Object}
 */
function mapOrderToResponse(orderRow, itemsRows = []) {
  return {
    numeroPedido: orderRow.orderId,
    valorTotal: Number(orderRow.value),
    dataCriacao: orderRow.creationDate,
    items: itemsRows.map((row) => ({
      idItem: row.productId,
      quantidadeItem: row.quantity,
      valorItem: Number(row.price),
    })),
  };
}

module.exports = {
  mapRequestToOrder,
  mapOrderToResponse,
};
