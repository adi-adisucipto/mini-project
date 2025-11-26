-- CreateTable
CREATE TABLE "point_use" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "point_id" TEXT NOT NULL,
    "amount_used" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "point_use_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "point_use" ADD CONSTRAINT "point_use_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_use" ADD CONSTRAINT "point_use_point_id_fkey" FOREIGN KEY ("point_id") REFERENCES "point_transactions"("point_history_id") ON DELETE RESTRICT ON UPDATE CASCADE;
