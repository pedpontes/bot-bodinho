/*
  Warnings:

  - A unique constraint covering the columns `[channelVoiceId]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Music" DROP CONSTRAINT "Music_channelId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Channel_channelVoiceId_key" ON "Channel"("channelVoiceId");

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelVoiceId") ON DELETE RESTRICT ON UPDATE CASCADE;
