package api

import (
	"database/sql"
	"net/http"

	db "github.com/divin3circle/mini-ticket-tracker/db/sqlc"
	"github.com/gin-gonic/gin"
)

func (s *Server) checkHealth(ctx *gin.Context) {
	ctx.JSON(200, gin.H{
		"message": "pong",
	})
}

type createTicketRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Status      string `json:"status" binding:"required,oneof=OPEN INPROGRESS"`
	Priority    string `json:"priority" binding:"required,oneof=LOW MEDIUM HIGH"`
}

func (s *Server) createTicket(ctx *gin.Context) {
	var req createTicketRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	var ticketStatus db.TicketStatus
	var ticketPriority db.TicketPriority

	switch req.Status {
	case "OPEN":
		ticketStatus = db.TicketStatusOpen
	case "INPROGRESS":
		ticketStatus = db.TicketStatusInProgress
	default:
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ticket status",
		})
	}

	switch req.Priority {
	case "LOW":
		ticketPriority = db.TicketPriorityLow
	case "MEDIUM":
		ticketPriority = db.TicketPriorityMedium
	case "HIGH":
		ticketPriority = db.TicketPriorityHigh
	default:
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ticket priority",
		})
	}

	arg := db.CreateTicketParams{
		Title:       req.Title,
		Description: sql.NullString{String: req.Description, Valid: true},
		Status: db.NullTicketStatus{
			TicketStatus: ticketStatus,
			Valid:        true,
		},
		Priority: ticketPriority,
	}

	createdTicket, err := s.store.CreateTicket(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "ticket created",
		"ticket":  createdTicket,
	})
}

func (s *Server) listTickets(ctx *gin.Context) {
	
}
