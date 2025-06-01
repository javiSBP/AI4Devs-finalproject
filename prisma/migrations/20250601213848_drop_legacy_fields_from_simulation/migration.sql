/*
  Warnings:

  - You are about to drop the column `averageCustomerLifetime` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `averagePrice` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `avgRevenue` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `costPerUnit` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `customerAcquisitionCost` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `fixedCosts` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `growthRate` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `initialInvestment` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyExpenses` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyNewCustomers` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `otherParams` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `results` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `timeframeMonths` on the `simulations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "simulations" DROP COLUMN "averageCustomerLifetime",
DROP COLUMN "averagePrice",
DROP COLUMN "avgRevenue",
DROP COLUMN "costPerUnit",
DROP COLUMN "customerAcquisitionCost",
DROP COLUMN "fixedCosts",
DROP COLUMN "growthRate",
DROP COLUMN "initialInvestment",
DROP COLUMN "monthlyExpenses",
DROP COLUMN "monthlyNewCustomers",
DROP COLUMN "otherParams",
DROP COLUMN "results",
DROP COLUMN "timeframeMonths";
