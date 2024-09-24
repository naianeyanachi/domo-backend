# Rotas

Todas as rotas são acessadas em `http://localhost:3000/api`.

## Citadel Routes (`/citadel`)

`GET` /citadel/:id

- Fetches a specific citadel by ID
- Updates the citadel before returning

`POST` /citadel

- Creates a new citadel
- Also creates a collector and factory for the new citadel

## Collector Routes (`/citadel/:id/collector`)

`GET` /citadel/:id/collector

- Fetches the collector for a specific citadel
- Creates a new collector if one doesn't exist

`POST` /citadel/:id/collector/collect

- Triggers the collect action for the citadel's collector

`POST` /citadel/:id/collector/repair

- Repairs the citadel's collector

## Factory Routes (`/citadel/:id/factory`)

`GET` /citadel/:id/factory

- Fetches the factory for a specific citadel
- Creates a new factory if one doesn't exist

`POST` /citadel/:id/factory/manufacture

- Triggers the manufacture action for the citadel's factory

`POST` /citadel/:id/factory/repair

- Repairs the citadel's factory
