package api

import (
	"github.com/divin3circle/mini-ticket-tracker/db/sqlc"
	"github.com/gin-gonic/gin"
)

type Server struct {
	store  *db.Store
	router *gin.Engine
}

func NewServer(store *db.Store) *Server {
	server := &Server{store: store}
	router := gin.Default()

	router.POST("/tickets", server.createTicket)

	router.PATCH("/tickets/:id", server.updateTicket)

	router.GET("/ping", server.checkHealth)
	router.GET("/tickets/:id", server.getTicketByID)
	router.GET("/tickets", server.listTickets)

	server.router = router
	return server
}

func (s *Server) Start(addr string) error {
	return s.router.Run(addr)
}
