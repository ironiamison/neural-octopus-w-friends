-- AlterTable
ALTER TABLE "User" ADD COLUMN     "learningStats" JSONB NOT NULL DEFAULT '{"completedLessons":0,"totalLessons":50,"currentLevel":1,"xp":0,"xpToNextLevel":1000,"achievements":[]}',
ADD COLUMN     "tradingStats" JSONB NOT NULL DEFAULT '{"level":1,"xp":0,"xpToNextLevel":1000,"totalTrades":0,"successfulTrades":0,"profitFactor":0,"winRate":0,"achievements":[]}';
