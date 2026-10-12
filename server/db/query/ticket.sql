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
SELECT id, title, description, status, priority, createdat
FROM tickets
WHERE (@status::ticket_status IS NULL OR status = @status::ticket_status)
ORDER BY id
LIMIT @page_size OFFSET @page_offset;

-- name: UpdateTicket :one
UPDATE tickets
SET status = @status,
    priority = @priority
WHERE id = @id
RETURNING *;

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

-- name: CountTicketStats :many
SELECT status, COUNT(*) AS row_count
FROM tickets
GROUP BY status;
