postgres:
	docker run --name mini-ticket-tracker -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres:16-alpine

stop:
	docker stop mini-ticket-tracker

remove:
	docker rm mini-ticket-tracker

createdb:
	docker exec -it mini-ticket-tracker createdb --username=postgres --owner=postgres mini-ticket-tracker-db

dropdb:
	docker exec -it mini-ticket-tracker dropdb mini-ticket-tracker-db

migrateup:
	migrate -path db/migration -database "postgresql://postgres:postgres@localhost:5432/mini-ticket-tracker-db?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migration -database "postgresql://postgres:postgres@localhost:5432/mini-ticket-tracker-db?sslmode=disable" -verbose up

sqlc:
	sqlc generate

test:
	go test -v -cover ./...

server:
	go run main.go

.PHONY: postgres createdb dropdb stop remove migrateup migratedown sqlc test server
