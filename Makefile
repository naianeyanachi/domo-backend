migrate:
	npx sequelize-cli db:migrate
	make seed

migrate-undo:
	npx sequelize-cli db:migrate:undo:all

seed:
	npx sequelize-cli db:seed:all

seed-undo:
	npx sequelize-cli db:seed:undo:all
