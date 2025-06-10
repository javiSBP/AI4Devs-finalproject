/*
  Warnings:

  - You are about to drop the column `description` on the `lean_canvases` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `lean_canvases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lean_canvases" DROP COLUMN "description",
DROP COLUMN "name";
