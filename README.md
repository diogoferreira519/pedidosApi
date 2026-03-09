# API de Gerenciamento de Pedidos

API REST em Node.js (JavaScript) com Express e PostgreSQL para criação, leitura, atualização e exclusão de pedidos.

## Requisitos

- Node.js 18+
- PostgreSQL

## Instalação

```bash
npm install
```

## Configuração do banco de dados

1. Crie um banco no PostgreSQL (ex: `pedidos_db`).
2. Copie o arquivo de exemplo e ajuste as variáveis:

```bash
cp .env.example .env
```

3. Inicialize as tabelas:

```bash
npm run init-db
```

## Executando

```bash
npm start
```

Em desenvolvimento com reload automático:

```bash
npm run dev
```

A API estará em `http://localhost:3000`.

## Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/order` | Criar novo pedido |
| GET | `/order/:orderNumber` | Obter pedido pelo número |
| GET | `/order/list` | Listar todos os pedidos |
| PUT | `/order/:orderNumber` | Atualizar pedido |
| DELETE | `/order/:orderNumber` | Excluir pedido |

### Exemplo: criar pedido

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

### Exemplo: obter pedido

```bash
curl http://localhost:3000/order/v10089016vdb
```

### Exemplo: listar pedidos

```bash
curl http://localhost:3000/order/list
```

### Exemplo: atualizar pedido

```bash
curl -X PUT http://localhost:3000/order/v10089016vdb \
  -H "Content-Type: application/json" \
  -d '{ "numeroPedido": "v10089016vdb", "valorTotal": 15000, "dataCriacao": "2023-07-19T12:24:11.5299601+00:00", "items": [] }'
```

### Exemplo: excluir pedido

```bash
curl -X DELETE http://localhost:3000/order/v10089016vdb
```

## Mapeamento de dados

O body da API usa os campos em português; internamente são persistidos com nomes em inglês:

| Request (body) | Banco (Order/Items) |
|----------------|---------------------|
| numeroPedido   | orderId             |
| valorTotal     | value               |
| dataCriacao    | creationDate        |
| items[].idItem | productId           |
| items[].quantidadeItem | quantity  |
| items[].valorItem | price             |

## Documentação (Swagger)

Com a API rodando, acesse:

**http://localhost:3000/api-docs**

## Respostas HTTP

- `200` – Sucesso (GET, PUT)
- `201` – Pedido criado (POST)
- `204` – Sem conteúdo (DELETE)
- `400` – Requisição inválida
- `404` – Pedido não encontrado
- `409` – Conflito (pedido já existe)
- `500` – Erro interno

## Estrutura do projeto

```
src/
  config/     # database, swagger
  db/         # initDb (criação das tabelas)
  middleware/ # errorHandler, validateOrderBody
  routes/     # orderRoutes
  controllers/# orderController
  services/   # orderService, orderMapper
  index.js    # entrada da aplicação
```
