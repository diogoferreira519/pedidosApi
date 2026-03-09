/**
 * Middleware global de tratamento de erros e respostas HTTP adequadas
 */

const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err.message);

  // Erro de validação (código PostgreSQL de constraint única)
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Conflito',
      message: 'Já existe um pedido com este número.',
    });
  }

  // Dados inválidos
  if (err.code === '22P02' || err.code === '23502') {
    return res.status(400).json({
      error: 'Requisição inválida',
      message: 'Dados enviados em formato inválido.',
    });
  }

  // Erro genérico 500
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado.',
  });
}

module.exports = { errorHandler };
