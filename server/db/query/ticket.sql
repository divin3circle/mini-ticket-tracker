-- name: CreateTicket :one
INSERT INTO tickets (
  title,
  description,
  status,
  priority
) VALUES (
  $1, $2, $3, $4
) RETURNING *;

-- name: GetTicketByID :one
SELECT * FROM tickets
WHERE id = $1 LIMIT 1;

-- name: ListTickets :many
SELECT * FROM tickets
WHERE status = $1
ORDER BY id
LIMIT $2
OFFSET $3;

-- name: UpdateTicketStatus :one
UPDATE tickets
SET status = $1
WHERE id = sqlc.arg(id)
RETURNING *;

-- name: UpdateTicketPriority :one
UPDATE tickets
SET priority = $1
WHERE id = sqlc.arg(id)
RETURNING *;

-- name: CountTicketStats :one
SELECT COUNT(*) AS row_count
FROM tickets
WHERE status = sqlc.arg(status);
