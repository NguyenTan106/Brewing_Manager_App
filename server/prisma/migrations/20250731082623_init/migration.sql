/*
  Warnings:

  - Added the required column `name` to the `BatchStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BatchStep" ADD COLUMN     "name" TEXT NOT NULL;
