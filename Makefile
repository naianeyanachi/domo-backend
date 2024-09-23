migrate:
	npx sequelize-cli db:migrate
	make seed

migrate-undo:
	make seed-undo
	npx sequelize-cli db:migrate:undo:all

seed:
	npx sequelize-cli db:seed

seed-undo:
	npx sequelize-cli db:seed:undo:all

