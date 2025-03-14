CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: User
CREATE TABLE IF NOT EXISTS "User"
(
    id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email    VARCHAR NOT NULL UNIQUE,
    password VARCHAR
);

-- Table: Chat
CREATE TABLE IF NOT EXISTS "Chat"
(
    id         UUID PRIMARY KEY   DEFAULT uuid_generate_v4(),
    createdAt  TIMESTAMP NOT NULL DEFAULT NOW(),
    userId     UUID      NOT NULL REFERENCES "User" (id) ON DELETE CASCADE,
    title      TEXT      NOT NULL,
    visibility VARCHAR   NOT NULL
);

-- Table: Document
CREATE TABLE IF NOT EXISTS "Document"
(
    id        UUID PRIMARY KEY   DEFAULT uuid_generate_v4(),
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    title     TEXT      NOT NULL,
    content   TEXT,
    userId    UUID      NOT NULL REFERENCES "User" (id) ON DELETE CASCADE,
    text      VARCHAR   NOT NULL
);

-- Table: Message
CREATE TABLE IF NOT EXISTS "Message"
(
    id        UUID PRIMARY KEY   DEFAULT uuid_generate_v4(),
    chatId    UUID      NOT NULL REFERENCES "Chat" (id) ON DELETE CASCADE,
    role      VARCHAR   NOT NULL,
    content   JSON      NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table: Suggestion
CREATE TABLE IF NOT EXISTS "Suggestion"
(
    id                UUID PRIMARY KEY   DEFAULT uuid_generate_v4(),
    documentId        UUID      NOT NULL REFERENCES "Document" (id) ON DELETE CASCADE,
    documentCreatedAt TIMESTAMP NOT NULL,
    originalText      TEXT      NOT NULL,
    suggestedText     TEXT      NOT NULL,
    description       TEXT,
    isResolved        BOOLEAN   NOT NULL DEFAULT FALSE,
    userId            UUID      NOT NULL REFERENCES "User" (id) ON DELETE CASCADE,
    createdAt         TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table: Vote
CREATE TABLE IF NOT EXISTS "Vote"
(
    chatId    UUID    NOT NULL REFERENCES "Chat" (id) ON DELETE CASCADE,
    messageId UUID    NOT NULL REFERENCES "Message" (id) ON DELETE CASCADE,
    isUpvoted BOOLEAN NOT NULL,
    PRIMARY KEY (chatId, messageId)
);