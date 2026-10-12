package db

import (
	"context"
	"database/sql"
	"math/rand"
	"testing"

	"github.com/divin3circle/mini-ticket-tracker/util"
	"github.com/stretchr/testify/require"
)

func randomInt(min, max int64) int64 {
	return min + rand.Int63n(max-min+1)
}

func RandomStatus() NullTicketStatus {
	if randomInt(0, 10)%2 == 0 {
		return NullTicketStatus{
			TicketStatus: TicketStatusOpen,
			Valid:        true,
		}
	}

	return NullTicketStatus{
		TicketStatus: TicketStatusInProgress,
		Valid:        true,
	}
}

func RandomPriority() TicketPriority {
	if randomInt(0, 10)%2 == 0 {
		return TicketPriorityLow
	}

	return TicketPriorityHigh
}

func createRandomTestTicket(t *testing.T) Ticket {
	arg := CreateTicketParams{
		Title: util.RandomString(4),
		Description: sql.NullString{
			String: util.RandomString(10),
			Valid:  true,
		},
		Status:   RandomStatus(),
		Priority: RandomPriority(),
	}

	testTicket, err := testQueries.CreateTicket(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, testTicket)

	require.Equal(t, arg.Status.TicketStatus, testTicket.Status.TicketStatus)
	require.Equal(t, arg.Priority, testTicket.Priority)

	return testTicket
}

func TestCreateTicket(t *testing.T) {
	_ = createRandomTestTicket(t)
}

func TestGetTicket(t *testing.T) {
	testTicket1 := createRandomTestTicket(t)
	testTicket2, err := testQueries.GetTicketByID(context.Background(), testTicket1.ID)

	require.NoError(t, err)
	require.NotEmpty(t, testTicket2)

	require.Equal(t, testTicket1.ID, testTicket2.ID)
	require.Equal(t, testTicket1.Status, testTicket2.Status)
	require.Equal(t, testTicket1.Priority, testTicket2.Priority)
}

func TestCountTicketStats(t *testing.T) {
	testTicket1 := createRandomTestTicket(t)

	openStatusCount, err := testQueries.CountTicketStats(context.Background(), testTicket1.Status)
	require.NoError(t, err)
	require.GreaterOrEqual(t, openStatusCount, int64(0))
}

func TestListTickets(t *testing.T) {
	openTestTickets, err := testQueries.ListTickets(context.Background(), ListTicketsParams{
		Status: RandomStatus(),
		Offset: int32(5),
		Limit:  int32(10),
	})

	require.NoError(t, err)
}

func TestUpdateTicketPriority(t *testing.T) {
	testTicket1 := createRandomTestTicket(t)

	updateTicketPriorityParams := UpdateTicketPriorityParams{
		Priority: TicketPriorityMedium,
		ID:       testTicket1.ID,
	}

	updatedTicket, err := testQueries.UpdateTicketPriority(context.Background(), updateTicketPriorityParams)
	require.NoError(t, err)
	require.NotEmpty(t, updatedTicket)
	require.Equal(t, updatedTicket.Priority, TicketPriorityMedium)
}

func TestUpdateTicketStatus(t *testing.T) {
	testTicket1 := createRandomTestTicket(t)
	updateTicketStatusParams := UpdateTicketStatusParams{
		Status: NullTicketStatus{
			TicketStatus: TicketStatusOpen,
			Valid:        true,
		},
		ID: testTicket1.ID,
	}

	updatedTicket, err := testQueries.UpdateTicketStatus(context.Background(), updateTicketStatusParams)
	require.NoError(t, err)
	require.NotEmpty(t, updatedTicket)
	require.Equal(t, updatedTicket.Status.TicketStatus, TicketStatusOpen)
}
