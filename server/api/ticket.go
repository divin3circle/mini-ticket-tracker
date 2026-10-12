package api

import (
	"database/sql"
	"errors"
	"net/http"

	db "github.com/divin3circle/mini-ticket-tracker/db/sqlc"
	"github.com/gin-gonic/gin"
)

func (s *Server) checkHealth(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

// ---------- helpers ----------

func mapStatus(s string) (db.TicketStatus, bool) {
	switch s {
	case "OPEN":
		return db.TicketStatusOpen, true
	case "INPROGRESS":
		return db.TicketStatusInProgress, true
	case "CLOSED":
		return db.TicketStatusClosed, true
	}
	return "", false
}

func mapPriority(p string) (db.TicketPriority, bool) {
	switch p {
	case "LOW":
		return db.TicketPriorityLow, true
	case "MEDIUM":
		return db.TicketPriorityMedium, true
	case "HIGH":
		return db.TicketPriorityHigh, true
	}
	return "", false
}

func errorResponse(err error) gin.H {
	return gin.H{"message": err.Error()}
}

// ---------- create ----------

type createTicketRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Status      string `json:"status" binding:"required,oneof=OPEN INPROGRESS"`
	Priority    string `json:"priority" binding:"required,oneof=LOW MEDIUM HIGH"`
}

func (s *Server) createTicket(ctx *gin.Context) {
	var req createTicketRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	status, ok := mapStatus(req.Status)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "invalid ticket status"})
		return
	}

	priority, ok := mapPriority(req.Priority)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "invalid ticket priority"})
		return
	}

	createdTicket, err := s.store.CreateTicket(ctx, db.CreateTicketParams{
		Title:       req.Title,
		Description: req.Description,
		Status:      status,
		Priority:    priority,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "ticket created",
		"ticket":  createdTicket,
	})
}

// ---------- get ----------

type getTicketByIDRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (s *Server) getTicketByID(ctx *gin.Context) {
	var req getTicketByIDRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	ticket, err := s.store.GetTicketByID(ctx, req.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, gin.H{"message": "ticket not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"ticket": ticket})
}

// ---------- list ----------

type listTicketsRequest struct {
	Status   string `form:"status" binding:"required,oneof=OPEN INPROGRESS CLOSED"`
	PageID   int32  `form:"page_id" binding:"required,min=1"`
	PageSize int32  `form:"page_size" binding:"required,min=1,max=100"`
}

func (s *Server) listTickets(ctx *gin.Context) {
	var req listTicketsRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	status, ok := mapStatus(req.Status)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "invalid ticket status"})
		return
	}

	tickets, err := s.store.ListTickets(ctx, db.ListTicketsParams{
		Status:     status,
		PageOffset: (req.PageID - 1) * req.PageSize,
		PageSize:   req.PageSize,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	if tickets == nil {
		tickets = []db.Ticket{}
	}

	ctx.JSON(http.StatusOK, gin.H{"tickets": tickets})
}

// ---------- update ----------

type updateTicketURI struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

type updateTicketRequest struct {
	Status   string `json:"status" binding:"omitempty,oneof=OPEN INPROGRESS CLOSED"`
	Priority string `json:"priority" binding:"omitempty,oneof=LOW MEDIUM HIGH"`
}

func (s *Server) updateTicket(ctx *gin.Context) {
	var uri updateTicketURI
	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	var req updateTicketRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	if req.Status == "" && req.Priority == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "provide at least one of status or priority",
		})
		return
	}

	ticket, err := s.store.GetTicketByID(ctx, uri.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, gin.H{"message": "ticket not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	arg := db.UpdateTicketParams{
		ID:       ticket.ID,
		Status:   ticket.Status,
		Priority: ticket.Priority,
	}

	if req.Status != "" {
		status, ok := mapStatus(req.Status)
		if !ok {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "invalid ticket status"})
			return
		}
		arg.Status = status
	}

	if req.Priority != "" {
		priority, ok := mapPriority(req.Priority)
		if !ok {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "invalid ticket priority"})
			return
		}
		arg.Priority = priority
	}

	updatedTicket, err := s.store.UpdateTicket(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "ticket updated",
		"ticket":  updatedTicket,
	})
}
