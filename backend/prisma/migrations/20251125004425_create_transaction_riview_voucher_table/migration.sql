-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Available', 'Used');

-- CreateEnum
CREATE TYPE "StatusPay" AS ENUM ('WaitingPay', 'WaitingConfirm', 'Done', 'Rejected', 'Expired', 'Canceled');

-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- AlterTable
ALTER TABLE "coupon" ALTER COLUMN "is_used" SET DEFAULT false,
ALTER COLUMN "used_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "point_transactions" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Available',
ADD COLUMN     "used_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "transaction" (
    "transaction_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "ticket_quantity" INTEGER NOT NULL,
    "total_price_paid" DECIMAL(65,30) NOT NULL,
    "statusPay" "StatusPay" NOT NULL DEFAULT 'WaitingPay',
    "proof_upload_at" TIMESTAMP(3) NOT NULL,
    "payment_proof_url" TEXT NOT NULL,
    "payment_proof_due_at" TIMESTAMP(3) NOT NULL,
    "organizer_confirmation_due_at" TIMESTAMP(3) NOT NULL,
    "points_used" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "coupon_use_id" TEXT,
    "voucher_used_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "review_event" (
    "riview_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "rating" "Rating" NOT NULL DEFAULT 'A',
    "review_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_event_pkey" PRIMARY KEY ("riview_id")
);

-- CreateTable
CREATE TABLE "voucher" (
    "voucher_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount_amount" DECIMAL(65,30) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "usage_limit" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "voucher_pkey" PRIMARY KEY ("voucher_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voucher_code_key" ON "voucher"("code");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_coupon_use_id_fkey" FOREIGN KEY ("coupon_use_id") REFERENCES "coupon"("coupon_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_voucher_used_id_fkey" FOREIGN KEY ("voucher_used_id") REFERENCES "voucher"("voucher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_event" ADD CONSTRAINT "review_event_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_event" ADD CONSTRAINT "review_event_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher" ADD CONSTRAINT "voucher_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;
