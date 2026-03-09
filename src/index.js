/**
 * API de Gerenciamento de Pedidos
 * Servidor Express na porta 3000
 */

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const orderRoutes = require('./routes/orderRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const swaggerSpec = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON
app.use(express.json());

// Documentação Swagger em /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota de saúde (opcional)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API de pedidos em execução' });
});

// Rotas de pedidos em /order
app.use('/order', orderRoutes);

// Tratamento de erros global (deve ser registrado por último)
app.use(errorHandler);

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Não encontrado', message: 'Rota não existe.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
