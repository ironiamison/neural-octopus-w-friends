/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rankPoints` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAchievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserStats` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[walletAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `walletAddress` to the `User` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_publicKey_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "level",
DROP COLUMN "publicKey",
DROP COLUMN "rankPoints",
DROP COLUMN "xp",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{"notifications":true,"theme":"dark","language":"en"}',
ADD COLUMN     "walletAddress" TEXT NOT NULL;

-- DropTable
DROP TABLE "Achievement";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Follow";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "UserAchievement";

-- DropTable
DROP TABLE "UserSettings";

-- DropTable
DROP TABLE "UserStats";

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");
