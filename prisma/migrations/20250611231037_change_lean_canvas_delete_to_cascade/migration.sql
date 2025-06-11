-- DropForeignKey
ALTER TABLE "simulations" DROP CONSTRAINT "simulations_leanCanvasId_fkey";

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_leanCanvasId_fkey" FOREIGN KEY ("leanCanvasId") REFERENCES "lean_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
