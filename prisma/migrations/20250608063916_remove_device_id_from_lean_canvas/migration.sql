/*
  Warnings:

  - You are about to drop the column `deviceId` on the `lean_canvases` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "lean_canvases_deviceId_idx";

-- AlterTable
ALTER TABLE "lean_canvases" DROP COLUMN "deviceId";
