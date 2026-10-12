CREATE TYPE "ticket_status" AS ENUM (
  'open',
  'in_progress',
  'closed'
);

CREATE TYPE "ticket_priority" AS ENUM (
  'low',
  'medium',
  'high'
);

CREATE TABLE "tickets" (
                           "id" bigserial PRIMARY KEY,
                           "title" varchar NOT NULL,
                           "description" varchar NOT NULL DEFAULT '',
                           "status" ticket_status NOT NULL DEFAULT 'open',
                           "priority" ticket_priority NOT NULL,
                           "createdat" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON "tickets" ("title");