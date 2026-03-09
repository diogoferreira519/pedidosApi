/**
 * Validação do body para criação e atualização de pedidos
 */

function validateOrderBody(req, res, next) {
  const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

  const errors = [];

  if (!numeroPedido || typeof numeroPedido !== 'string' || !numeroPedido.trim()) {
    errors.push('Campo "numeroPedido" é obrigatório e deve ser uma string não vazia.');
  }
  if (valorTotal === undefined || valorTotal === null || isNaN(Number(valorTotal))) {
    errors.push('Campo "valorTotal" é obrigatório e deve ser um número.');
  }
  if (!dataCriacao) {
    errors.push('Campo "dataCriacao" é obrigatório.');
  }
  if (!Array.isArray(items)) {
    errors.push('Campo "items" é obrigatório e deve ser um array.');
  } else {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.idItem === undefined && item.productId === undefined) errors.push(`items[${i}]: "idItem" é obrigatório.`);
      if (item.quantidadeItem === undefined && item.quantity === undefined) errors.push(`items[${i}]: "quantidadeItem" é obrigatório.`);
      if (item.valorItem === undefined && item.price === undefined) errors.push(`items[${i}]: "valorItem" é obrigatório.`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Requisição inválida',
      message: errors.join(' '),
    });
  }

  next();
}

module.exports = { validateOrderBody };
