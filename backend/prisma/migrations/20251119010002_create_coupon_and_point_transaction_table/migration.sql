/*
  Warnings:

  - The values [USER,ORGANAIZER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `referrer_user_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referral_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CUSTOMER', 'ORGANIZER', 'ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
COMMIT;

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_referrer_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "referrer_user_id",
ADD COLUMN     "referrerId" TEXT,
ALTER COLUMN "role" SET DEFAULT 'CUSTOMER',
ALTER COLUMN "points_balance" DROP DEFAULT;

-- CreateTable
CREATE TABLE "point_transactions" (
    "point_history_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount_change" INTEGER NOT NULL,
    "point_remaining" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "point_transactions_pkey" PRIMARY KEY ("point_history_id")
);

-- CreateTable
CREATE TABLE "coupon" (
    "coupon_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount_amount" DECIMAL(65,30) NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL,
    "used_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_pkey" PRIMARY KEY ("coupon_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupon_code_key" ON "coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_referral_code_key" ON "users"("referral_code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
