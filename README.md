# MiniShop

MiniShop é um mini e-commerce full stack construido com `React + TypeScript` no front-end e `Node + Express + TypeScript` no back-end. O projeto foi realizado como forma de estudo de tecnologias.

## Visao Geral

- catalogo de produtos com categorias dinamicas
- area administrativa para criar, editar e remover produtos e categorias
- carrinho com persistencia local
- checkout com CEP, preenchimento automatico de endereco e cupom
- autenticacao com cadastro, login, logout e sessao no front
- perfil do usuario com historico de compras e edicao de dados
- API com Prisma, SQLite e JWT

## Stack

### Front-end

- React 18
- TypeScript
- Vite
- CSS customizado
- Vitest + Testing Library

### Back-end

- Node.js
- Express
- TypeScript
- Prisma
- SQLite
- JSON Web Token
- Vitest + Supertest

## Estrutura Do Projeto

```text
Mini e-commerce/
  client/
    src/
      components/
      pages/
      services/
      styles/
      types/
      utils/
  server/
    prisma/
      schema.prisma
      seed.ts
    src/
      app.ts
      server.ts
      controllers/
      services/
      middlewares/
      validations/
      errors/
      lib/
      data/
      types/
```

## Funcionalidades Ja Implementadas

### Loja

- home com destaque limitado de produtos
- pagina de catalogo completo
- pagina de categorias
- imagens reais na seed
- carrinho com resumo, controle de quantidade e persistencia local

### Checkout

- pagina dedicada de checkout
- busca de endereco por `CEP`
- frete calculado automaticamente apos endereco valido
- cupom de desconto
- pagina de sucesso apos confirmar pedido

### Usuarios

- cadastro e login
- token JWT retornado pelo back
- sessao salva no front
- logout
- pagina de perfil
- edicao de nome e e-mail
- historico de compras do usuario autenticado

### Admin

- criacao de categorias
- criacao, edicao e exclusao de produtos
- listagem administrativa separada da loja

## Banco De Dados

O projeto usa `Prisma + SQLite`.

Modelos atuais:

- `Product`
- `Category`
- `User`
- `Order`
- `OrderItem`

O schema principal esta em `server/prisma/schema.prisma`.

## Como Rodar O Projeto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variaveis de ambiente

Front-end:

```bash
cp client/.env.example client/.env
```

Back-end:

```bash
cp server/.env.example server/.env
```

No front, `VITE_API_BASE_URL` pode ficar vazio no desenvolvimento local usando o proxy do Vite. Em deploy, defina a URL publica da API, por exemplo:

```bash
VITE_API_BASE_URL=https://seu-backend.onrender.com
```

No back, ajuste ao menos:

```bash
JWT_SECRET=sua-chave-segura
PORT=3333
```

### 3. Gerar o Prisma Client

```bash
npm run prisma:generate --workspace server
```

### 4. Sincronizar o banco local

```bash
npx prisma db push --schema server/prisma/schema.prisma
```

### 5. Popular a base com a seed inicial

```bash
npm run prisma:seed --workspace server
```

### 6. Subir front e back juntos

```bash
npm run dev
```

Aplicacoes locais:

- Front-end: `http://localhost:5173`
- API: `http://localhost:3333`

## Scripts Disponiveis

### Raiz

- `npm run dev`: sobe front e back em paralelo
- `npm run build`: gera build do client e do server
- `npm run test`: roda testes do client e do server
- `npm run dev:client`: sobe apenas o front
- `npm run dev:server`: sobe apenas o back

### Client

- `npm run dev --workspace client`
- `npm run build --workspace client`
- `npm run test --workspace client`

### Server

- `npm run dev --workspace server`
- `npm run build --workspace server`
- `npm run test --workspace server`
- `npm run prisma:generate --workspace server`
- `npm run prisma:migrate --workspace server`
- `npm run prisma:seed --workspace server`
- `npm run prisma:studio --workspace server`

## Rotas Principais Da API

### Saude

- `GET /api/health`

### Autenticacao

- `POST /api/auth/signup`
- `POST /api/auth/signin`

### Produtos

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Categorias

- `GET /api/categories`
- `POST /api/categories`

### Usuarios E Pedidos

- `GET /api/users/:userId/profile`
- `PUT /api/users/:userId/profile`
- `GET /api/users/:userId/orders`
- `POST /api/orders`

Algumas dessas rotas exigem autenticacao via header:

```http
Authorization: Bearer <token>
```

## Testes

O projeto possui testes no front e no back:

- `client`: componentes, navegacao e fluxos principais
- `server`: endpoints, validacoes e autenticacao

Para rodar tudo:

```bash
npm run test
```

Para rodar separadamente:

```bash
npm run test --workspace client
npm run test --workspace server
```

## Observacoes

- o token JWT usa `JWT_SECRET` se estiver definido; caso contrario, usa um valor local de desenvolvimento
- o banco local fica em `server/prisma/dev.db`
- a seed pode ser reaplicada durante o desenvolvimento para repovoar produtos e categorias

## Proximos Passos Possiveis

- detalhar melhor o perfil do usuario
- salvar enderecos como entidade propria
- criar status mais completos para pedidos
- melhorar a experiencia mobile
- adicionar recuperacao de senha

## Repositorio

GitHub: [jefranca/MiniShop](https://github.com/jefranca/MiniShop)
