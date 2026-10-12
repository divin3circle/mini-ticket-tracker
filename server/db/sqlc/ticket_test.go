package db

import (
	"context"
	"database/sql"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestCreateTicket(t *testing.T) {
	arg := CreateTicketParams{
		Title: "Title",
		Description: sql.NullString{
			String: "Some Description",
			Valid:  true,
		},
		Status: NullTicketStatus{
			TicketStatus: TicketStatusOpen,
			Valid:        true,
		},
		Priority: TicketPriorityLow,
	}

	testTicket, err := testQueries.CreateTicket(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, testTicket)

	require.Equal(t, arg.Status.TicketStatus, testTicket.Status.TicketStatus)
	require.Equal(t, arg.Priority, testTicket.Priority)
}
