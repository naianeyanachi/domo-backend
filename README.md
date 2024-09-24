# domo-backend

# Requisitos

- NodeJS
- Docker
- Docker Compose

# Rodando o projeto

1. Subir os containers com o comando:

```bash
docker-compose up -d
```

O banco de dados estará rodando na porta 5432.
O servidor estará rodando na porta 3000.

2. Migrar o banco de dados com o comando:

```bash
make migrate
```

