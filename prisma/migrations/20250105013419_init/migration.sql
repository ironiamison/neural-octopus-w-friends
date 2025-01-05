/*
  Warnings:

  - You are about to drop the column `attachments` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `unlockedAt` on the `UserAchievement` table. All the data in the column will be lost.
  - You are about to drop the column `avgHoldTime` on the `UserStats` table. All the data in the column will be lost.
  - You are about to drop the column `avgTradeSize` on the `UserStats` table. All the data in the column will be lost.
  - You are about to drop the column `winningTrades` on the `UserStats` table. All the data in the column will be lost.
  - You are about to drop the `Trade` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `rarity` on the `Achievement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `icon` on table `Achievement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicKey` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followingId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_userId_fkey";

-- DropIndex
DROP INDEX "Comment_postId_idx";

-- DropIndex
DROP INDEX "Comment_userId_idx";

-- DropIndex
DROP INDEX "Follow_followerId_idx";

-- DropIndex
DROP INDEX "Follow_followingId_idx";

-- DropIndex
DROP INDEX "Post_createdAt_idx";

-- DropIndex
DROP INDEX "Post_userId_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_publicKey_idx";

-- DropIndex
DROP INDEX "User_username_idx";

-- DropIndex
DROP INDEX "UserAchievement_achievementId_idx";

-- DropIndex
DROP INDEX "UserAchievement_completed_idx";

-- DropIndex
DROP INDEX "UserAchievement_userId_idx";

-- DropIndex
DROP INDEX "UserSettings_userId_idx";

-- DropIndex
DROP INDEX "UserStats_userId_idx";

-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "rarity",
ADD COLUMN     "rarity" TEXT NOT NULL,
ALTER COLUMN "icon" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "attachments",
DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "publicKey" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserAchievement" DROP COLUMN "unlockedAt",
ADD COLUMN     "completedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserSettings" ALTER COLUMN "notifications" SET DEFAULT '{"trades":true,"achievements":true,"news":false,"marketAlerts":true}',
ALTER COLUMN "privacy" SET DEFAULT '{"showProfile":true,"showTrades":true,"showAchievements":true}',
ALTER COLUMN "appearance" SET DEFAULT '{"theme":"dark","compactView":false}',
ALTER COLUMN "trading" SET DEFAULT '{"riskLevel":50,"autoTrade":false,"tradeConfirmation":true}';

-- AlterTable
ALTER TABLE "UserStats" DROP COLUMN "avgHoldTime",
DROP COLUMN "avgTradeSize",
DROP COLUMN "winningTrades",
ADD COLUMN     "profitableTrades" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winRate" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Trade";

-- DropEnum
DROP TYPE "AchievementRarity";

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_name_key" ON "Achievement"("name");

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
