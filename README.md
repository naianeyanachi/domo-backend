# domo-backend

## Requisitos

- NodeJS
- Docker
- Docker Compose

## Rodando o projeto

1. Criar o arquivo `.env` com as variáveis de ambiente a partir do arquivo `.env.example`

2. O arquivo `.env` deve ter a seguinte variável:

```bash
DB_HOST=postgresdb
```

3. Subir os containers com o comando:

```bash
docker-compose up
```

- O banco de dados estará rodando na porta 5432.
- O servidor estará rodando na porta 3000.

## Rodando as migrations

- Usar o sequelize-cli para rodar as migrations
- Documentação do sequelize-cli: https://sequelize.org/docs/v6/other-topics/migrations/

1. O arquivo `.env` deve ter a seguinte variável:

```bash
DB_HOST=localhost
```

2. Rodar o comando para migrar o banco de dados:

```bash
npm run db:migrate
```

3. Rodar os seeders para popular o banco de dados com o comando:

```bash
npm run db:seed
```

## Adicionando novos pacotes ao projeto

1. Adicionar o pacote ao projeto

```bash
npm install <pacote>
```

2. O arquivo `.env` deve ter a seguinte variável:

```bash
DB_HOST=postgresdb
```

3. Rodar o comando para buildar o projeto:

```bash
docker compose build
```

4. Rodar novamente o container com o comando:

```bash
docker compose up
```
