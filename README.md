# Hire.me API, by Rodrigo Monney

> Backend da aplicação `Hire.me`, desenvolvido como parte de desafio técnico.

### Este projeto utiliza:

- NestJS (TypeScript)
- PostgreSQL (via Docker)
- Redis (via Docker)
- ESLint + Prettier para linting e formatação
- Husky para verificação automática antes dos commits

## 📦 Requisitos para rodar o projeto

- Node.js 22.15.0
- Docker e Docker Compose instalados e funcionando
  - Tutorial para instalação: https://github.com/codeedu/wsl2-docker-quickstart/blob/main/README.md

## 🚀 Rodando o projeto

### 1. Instale as dependências:

```bash
npm install
```

### 2. Suba o ambiente do banco de dados e cache:

```bash
docker-compose up -d
```

### 3. Crie um arquivo .env baseado no .env.example e configure as variáveis de ambiente.

### 4. Rode a aplicação em modo de desenvolvimento:

```bash
npm run start:dev
```

## 🐳 Banco de Dados e Redis

O projeto utiliza `docker-compose.yml` para subir:

PostgreSQL na porta `5432`

Redis na porta `6379`

## 📜 Scripts Disponíveis

| Comando             | Descrição                                    |
| ------------------- | -------------------------------------------- |
| `npm run start:dev` | Inicia o servidor em modo de desenvolvimento |
| `npm run lint`      | Executa o ESLint para análise de código      |
| `npm run format`    | Formata o código usando Prettier             |
