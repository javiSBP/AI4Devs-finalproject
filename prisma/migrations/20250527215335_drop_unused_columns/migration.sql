/*
  Warnings:

  - You are about to drop the column `costStructure` on the `LeanCanvas` table. All the data in the column will be lost.
  - You are about to drop the column `keyMetrics` on the `LeanCanvas` table. All the data in the column will be lost.
  - You are about to drop the column `unfairAdvantage` on the `LeanCanvas` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueValueProp` on the `LeanCanvas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LeanCanvas" DROP COLUMN "costStructure",
DROP COLUMN "keyMetrics",
DROP COLUMN "unfairAdvantage",
DROP COLUMN "uniqueValueProp",
ADD COLUMN     "deviceId" TEXT,
ADD COLUMN     "uniqueValueProposition" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Simulation" ADD COLUMN     "averageCustomerLifetime" DOUBLE PRECISION,
ADD COLUMN     "averagePrice" DOUBLE PRECISION,
ADD COLUMN     "costPerUnit" DOUBLE PRECISION,
ADD COLUMN     "customerAcquisitionCost" DOUBLE PRECISION,
ADD COLUMN     "deviceId" TEXT,
ADD COLUMN     "fixedCosts" DOUBLE PRECISION,
ADD COLUMN     "monthlyNewCustomers" DOUBLE PRECISION,
ALTER COLUMN "initialInvestment" DROP NOT NULL,
ALTER COLUMN "monthlyExpenses" DROP NOT NULL,
ALTER COLUMN "avgRevenue" DROP NOT NULL,
ALTER COLUMN "growthRate" DROP NOT NULL,
ALTER COLUMN "timeframeMonths" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "LeanCanvas_deviceId_idx" ON "LeanCanvas"("deviceId");

-- CreateIndex
CREATE INDEX "LeanCanvas_userId_idx" ON "LeanCanvas"("userId");

-- CreateIndex
CREATE INDEX "Simulation_deviceId_idx" ON "Simulation"("deviceId");

-- CreateIndex
CREATE INDEX "Simulation_userId_idx" ON "Simulation"("userId");
