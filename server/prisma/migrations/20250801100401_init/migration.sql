/*
  Warnings:

  - Added the required column `actualDuration` to the `BatchStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feedback` to the `BatchStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BatchStep" ADD COLUMN     "actualDuration" TEXT NOT NULL,
ADD COLUMN     "feedback" TEXT NOT NULL;
