# Sistema de Gerenciamento de Usuários

Este é um sistema completo de gerenciamento de usuários com frontend em React e backend em Node.js.

## Estrutura do Projeto

```
appsmith/
├── backend/                 # Servidor Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores da aplicação
│   │   ├── models/        # Modelos do banco de dados
│   │   └── routes/        # Rotas da API
│   └── package.json
│
└── frontend/               # Aplicação React
    ├── src/
    │   ├── pages/         # Páginas da aplicação
    │   ├── services/      # Serviços e API
    │   └── components/    # Componentes React
    └── package.json
```

## Funcionalidades

- Listagem de usuários
- Criação de novos usuários
- Edição de usuários existentes
- Exclusão de usuários
- Ativação/desativação de usuários
- Confirmação visual de alterações

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- Sequelize (PostgreSQL)

### Frontend
- React
- Material-UI
- Axios
- React Router

## Como Executar

1. Backend:
```bash
cd backend
npm install
npm start
```

2. Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Configuração do Banco de Dados

O sistema utiliza PostgreSQL. Certifique-se de ter as credenciais corretas no arquivo de configuração do backend.

## Endpoints da API

- GET /users - Lista todos os usuários
- GET /users/:id - Obtém um usuário específico
- POST /users - Cria um novo usuário
- PUT /users/:id - Atualiza um usuário
- DELETE /users/:id - Remove um usuário

## Desenvolvimento

Este projeto foi desenvolvido seguindo as melhores práticas de:
- Código limpo e organizado
- Componentização
- Reutilização de código
- Tratamento de erros
- Feedback visual para o usuário
