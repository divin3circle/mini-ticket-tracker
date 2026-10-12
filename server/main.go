package main

import (
	"database/sql"
	"log"

	"github.com/divin3circle/mini-ticket-tracker/api"
	db "github.com/divin3circle/mini-ticket-tracker/db/sqlc"
	"github.com/divin3circle/mini-ticket-tracker/util"
	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	config, err := util.LoadConfig(".")
	if err != nil {
		log.Fatal("Failed to load configuration variables: ", err)
	}
	conn, err := sql.Open(config.DBDriver, config.SourceString)
	defer func(conn *sql.DB) {
		err := conn.Close()
		if err != nil {
			log.Fatal("Failed to close DB: ", err)
		}
	}(conn)
	if err != nil {
		log.Fatal("Failed to connect to DB: ", err)
	}

	appStore := db.NewStore(conn)
	apiServer := api.NewServer(appStore)

	err = apiServer.Start(config.ServerAddress)
	if err != nil {
		log.Fatal("Failed to start API server", err)
	}
}
