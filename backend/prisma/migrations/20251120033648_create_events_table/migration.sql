-- CreateTable
CREATE TABLE "events" (
    "event_id" TEXT NOT NULL,
    "organizer_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "available_seats" INTEGER NOT NULL,
    "total_seats" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
