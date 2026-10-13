package api

import (
	"github.com/divin3circle/mini-ticket-tracker/db/sqlc"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

type Server struct {
	store  *db.Store
	router *gin.Engine
}

func NewServer(store *db.Store) *Server {
	server := &Server{store: store}
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.POST("/tickets", server.createTicket)

	router.PATCH("/tickets/:id", server.updateTicket)

	router.GET("/ping", server.checkHealth)
	router.GET("/tickets/:id", server.getTicketByID)
	router.GET("/tickets", server.listTickets)
	router.GET("/tickets/stats", server.getTicketStats)

	server.router = router
	return server
}

func (s *Server) Start(addr string) error {
	return s.router.Run(addr)
}
