-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "ticket_quantity" SET DEFAULT 1,
ALTER COLUMN "proof_upload_at" DROP NOT NULL,
ALTER COLUMN "payment_proof_url" DROP NOT NULL,
ALTER COLUMN "payment_proof_due_at" DROP NOT NULL,
ALTER COLUMN "organizer_confirmation_due_at" DROP NOT NULL;
