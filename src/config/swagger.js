/**
 * Configuração do Swagger para documentação da API
 */

const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Pedidos',
      version: '1.0.0',
      description: 'API para gerenciamento de pedidos (CRUD)',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Servidor local' }],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJsdoc(options);
