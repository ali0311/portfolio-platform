-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "ip_hash" TEXT,
    "country" TEXT,
    "browser" TEXT,
    "device_type" TEXT,
    "visited_page" TEXT,
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_downloads" (
    "id" TEXT NOT NULL,
    "session_id" TEXT,
    "device_type" TEXT,
    "browser" TEXT,
    "source_page" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_events" (
    "id" TEXT NOT NULL,
    "session_id" TEXT,
    "event_type" TEXT NOT NULL,
    "section_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "visitors_created_at_idx" ON "visitors"("created_at");

-- CreateIndex
CREATE INDEX "visitors_session_id_idx" ON "visitors"("session_id");

-- CreateIndex
CREATE INDEX "resume_downloads_created_at_idx" ON "resume_downloads"("created_at");

-- CreateIndex
CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages"("created_at");

-- CreateIndex
CREATE INDEX "page_events_created_at_idx" ON "page_events"("created_at");

-- CreateIndex
CREATE INDEX "page_events_event_type_idx" ON "page_events"("event_type");
