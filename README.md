# Hire.me API · by Rodrigo Monney

> Backend da aplicação `Hire.me`, desenvolvido como parte de um desafio técnico.

Este projeto demonstra arquitetura escalável com NestJS, integração com PostgreSQL e Redis, uso de Prisma como ORM, e práticas modernas de clean code e injeção de dependência.

### 🚀 Tecnologias, padrões e práticas aplicadas

- **NestJS** com arquitetura modular baseada em domínio
- **Prisma ORM** com tipagem forte e migrations versionadas
- **PostgreSQL + Redis** via Docker Compose
- **Inversão de dependência** com tokens de injeção e interfaces
- **PrismaService gerenciado via lifecycle hooks (`onModuleInit`, `onModuleDestroy`)**
- **SharedModule** para consolidar dependências reutilizáveis
- **DTOs organizados com validação via `@Allow()`**
- **Controller com versionamento (`/api/v1`) e uso de `@ApiTags`, `@ApiOperation`**
- **Swagger (OpenAPI)** para documentação automática da API
- **Exception Filter global personalizado para estrutura padronizada de erro**
- **Linting e formatação:** ESLint + Prettier + Husky

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

### 3. Configure o arquivo .env

> Crie um arquivo .env baseado no .env.example e configure as variáveis de ambiente.

### 4. Rode as migrations para criar as tabelas no banco de dados:

```bash
npx prisma migrate dev
```

### 5. Rode o script generate para gerar o Prisma Client

```bash
npm run generate
```

### 6. (Opcional) Visualize e edite o banco de dados com Prisma Studio:

```bash
npx prisma studio
```

> 💡 Você verá: Prisma Studio is up on http://localhost:5555

### 7. Rode a aplicação em modo de desenvolvimento:

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

## 📚 Documentação da API

Após subir a aplicação (`npm run start:dev`), acesse:

> http://localhost:3000/api/docs

#### Documentação gerada automaticamente com Swagger (OpenAPI), incluindo:

- Descrições das rotas (`@ApiOperation`)
- Agrupamento por domínio (`@ApiTags`)
- Tipagem de entrada e saída baseada em DTOs
- Estrutura clara para integradores e testes via Swagger UI

## 🎯 Diferenciais Técnicos

#### Este projeto foi estruturado intencionalmente com princípios de Clean Architecture, visando desacoplamento e manutenção a longo prazo:

- Domínio isolado de infraestrutura
- Repository Pattern com binding via token (Inversão de dependência)
- Serviço Prisma desacoplado e testável
- Módulo compartilhado (`SharedModule`) para consolidar responsabilidades comuns
- Projeto pronto para evoluir com autenticação, cache eficiente e testes automatizados
