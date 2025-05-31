/*
  Warnings:

  - You are about to drop the `LeanCanvas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Simulation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeanCanvas" DROP CONSTRAINT "LeanCanvas_userId_fkey";

-- DropForeignKey
ALTER TABLE "Simulation" DROP CONSTRAINT "Simulation_leanCanvasId_fkey";

-- DropForeignKey
ALTER TABLE "Simulation" DROP CONSTRAINT "Simulation_userId_fkey";

-- DropTable
DROP TABLE "LeanCanvas";

-- DropTable
DROP TABLE "Simulation";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lean_canvases" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "problem" TEXT,
    "solution" TEXT,
    "uniqueValueProposition" TEXT,
    "customerSegments" TEXT,
    "channels" TEXT,
    "revenueStreams" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT,

    CONSTRAINT "lean_canvases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT,
    "leanCanvasId" TEXT,
    "averagePrice" DOUBLE PRECISION,
    "costPerUnit" DOUBLE PRECISION,
    "fixedCosts" DOUBLE PRECISION,
    "customerAcquisitionCost" DOUBLE PRECISION,
    "monthlyNewCustomers" DOUBLE PRECISION,
    "averageCustomerLifetime" DOUBLE PRECISION,
    "initialInvestment" DOUBLE PRECISION,
    "monthlyExpenses" DOUBLE PRECISION,
    "avgRevenue" DOUBLE PRECISION,
    "growthRate" DOUBLE PRECISION,
    "timeframeMonths" INTEGER,
    "otherParams" JSONB,
    "results" JSONB,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_inputs" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "averagePrice" DOUBLE PRECISION NOT NULL,
    "costPerUnit" DOUBLE PRECISION NOT NULL,
    "fixedCosts" DOUBLE PRECISION NOT NULL,
    "customerAcquisitionCost" DOUBLE PRECISION NOT NULL,
    "monthlyNewCustomers" DOUBLE PRECISION NOT NULL,
    "averageCustomerLifetime" DOUBLE PRECISION NOT NULL,
    "validationWarnings" JSONB,
    "calculationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_results" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "unitMargin" DOUBLE PRECISION NOT NULL,
    "monthlyRevenue" DOUBLE PRECISION NOT NULL,
    "monthlyProfit" DOUBLE PRECISION NOT NULL,
    "ltv" DOUBLE PRECISION NOT NULL,
    "cac" DOUBLE PRECISION NOT NULL,
    "cacLtvRatio" DOUBLE PRECISION NOT NULL,
    "breakEvenUnits" DOUBLE PRECISION NOT NULL,
    "breakEvenMonths" DOUBLE PRECISION NOT NULL,
    "profitabilityHealth" TEXT NOT NULL,
    "ltvCacHealth" TEXT NOT NULL,
    "overallHealth" TEXT NOT NULL,
    "recommendations" JSONB NOT NULL,
    "insights" JSONB NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculationVersion" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulation_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "lean_canvases_deviceId_idx" ON "lean_canvases"("deviceId");

-- CreateIndex
CREATE INDEX "lean_canvases_userId_idx" ON "lean_canvases"("userId");

-- CreateIndex
CREATE INDEX "simulations_deviceId_idx" ON "simulations"("deviceId");

-- CreateIndex
CREATE INDEX "simulations_userId_idx" ON "simulations"("userId");

-- CreateIndex
CREATE INDEX "simulations_createdAt_idx" ON "simulations"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "financial_inputs_simulationId_key" ON "financial_inputs"("simulationId");

-- CreateIndex
CREATE UNIQUE INDEX "simulation_results_simulationId_key" ON "simulation_results"("simulationId");

-- CreateIndex
CREATE INDEX "simulation_results_overallHealth_idx" ON "simulation_results"("overallHealth");

-- CreateIndex
CREATE INDEX "simulation_results_calculatedAt_idx" ON "simulation_results"("calculatedAt");

-- AddForeignKey
ALTER TABLE "lean_canvases" ADD CONSTRAINT "lean_canvases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_leanCanvasId_fkey" FOREIGN KEY ("leanCanvasId") REFERENCES "lean_canvases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_inputs" ADD CONSTRAINT "financial_inputs_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_results" ADD CONSTRAINT "simulation_results_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
