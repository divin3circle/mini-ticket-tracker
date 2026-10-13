package db

import (
	"context"
	"math/rand"
	"testing"

	"github.com/divin3circle/mini-ticket-tracker/util"
	"github.com/stretchr/testify/require"
)

func randomInt(min, max int64) int64 {
	return min + rand.Int63n(max-min+1)
}

func RandomStatus() TicketStatus {
	if randomInt(0, 10)%2 == 0 {
		return TicketStatusOpen
	}
	return TicketStatusInProgress
}

func RandomPriority() TicketPriority {
	if randomInt(0, 10)%2 == 0 {
		return TicketPriorityLow
	}
	return TicketPriorityHigh
}

func createRandomTestTicket(t *testing.T) Ticket {
	arg := CreateTicketParams{
		Title:       util.RandomString(4),
		Description: util.RandomString(10),
		Status:      RandomStatus(),
		Priority:    RandomPriority(),
	}

	testTicket, err := testQueries.CreateTicket(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, testTicket)

	require.Equal(t, arg.Title, testTicket.Title)
	require.Equal(t, arg.Description, testTicket.Description)
	require.Equal(t, arg.Status, testTicket.Status)
	require.Equal(t, arg.Priority, testTicket.Priority)
	require.NotZero(t, testTicket.ID)
	require.NotZero(t, testTicket.Createdat)

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
	require.Equal(t, testTicket1.Title, testTicket2.Title)
	require.Equal(t, testTicket1.Description, testTicket2.Description)
	require.Equal(t, testTicket1.Status, testTicket2.Status)
	require.Equal(t, testTicket1.Priority, testTicket2.Priority)
}

func TestCountTicketStats(t *testing.T) {
	_ = createRandomTestTicket(t)

	count, err := testQueries.CountTicketStats(context.Background())
	require.NoError(t, err)
	require.GreaterOrEqual(t, len(count), int(1))
}

func TestListTickets(t *testing.T) {
	// make sure there are at least 5 open tickets
	for i := 0; i < 5; i++ {
		_, err := testQueries.CreateTicket(context.Background(), CreateTicketParams{
			Title:       util.RandomString(4),
			Description: util.RandomString(10),
			Status:      TicketStatusOpen,
			Priority:    RandomPriority(),
		})
		require.NoError(t, err)
	}

	tickets, err := testQueries.ListTickets(context.Background(), ListTicketsParams{
		Status:     TicketStatusOpen,
		PageOffset: 0,
		PageSize:   5,
	})
	require.NoError(t, err)
	require.Len(t, tickets, 5)

	for _, ticket := range tickets {
		require.NotEmpty(t, ticket)
		require.Equal(t, TicketStatusOpen, ticket.Status)
	}
}

func TestUpdateTicket(t *testing.T) {
	ticket := createRandomTestTicket(t)

	updated, err := testQueries.UpdateTicket(context.Background(), UpdateTicketParams{
		ID:       ticket.ID,
		Status:   TicketStatusClosed,
		Priority: TicketPriorityMedium,
	})
	require.NoError(t, err)
	require.Equal(t, ticket.ID, updated.ID)
	require.Equal(t, TicketStatusClosed, updated.Status)
	require.Equal(t, TicketPriorityMedium, updated.Priority)
}
