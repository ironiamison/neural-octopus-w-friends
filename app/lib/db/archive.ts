import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const prisma = new PrismaClient();
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const ARCHIVE_BUCKET = process.env.ARCHIVE_BUCKET || 'neural-octopus-archives';
const ARCHIVE_AFTER_DAYS = 180; // Archive trades older than 6 months

export async function archiveOldTrades() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - ARCHIVE_AFTER_DAYS);

  // Get trades to archive
  const tradesToArchive = await prisma.trade.findMany({
    where: {
      AND: [
        { closedAt: { lt: cutoffDate } },
        { status: 'closed' },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  // Group trades by user
  const tradesByUser = tradesToArchive.reduce((acc, trade) => {
    const userId = trade.user.id;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(trade);
    return acc;
  }, {} as Record<string, any[]>);

  // Archive trades for each user
  for (const [userId, trades] of Object.entries(tradesByUser)) {
    const archiveKey = `trades/${userId}/${cutoffDate.getFullYear()}/${cutoffDate.getMonth() + 1}.json`;
    
    try {
      // Upload to S3
      await s3.send(new PutObjectCommand({
        Bucket: ARCHIVE_BUCKET,
        Key: archiveKey,
        Body: JSON.stringify(trades),
        ContentType: 'application/json',
      }));

      // Delete archived trades from the database
      await prisma.trade.deleteMany({
        where: {
          id: {
            in: trades.map(t => t.id),
          },
        },
      });

      console.log(`Archived ${trades.length} trades for user ${userId}`);
    } catch (error) {
      console.error(`Failed to archive trades for user ${userId}:`, error);
    }
  }
}

export async function archiveOldPosts() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 365); // Archive posts older than 1 year

  const postsToArchive = await prisma.post.findMany({
    where: {
      createdAt: { lt: cutoffDate },
    },
    include: {
      comments: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  for (const post of postsToArchive) {
    const archiveKey = `posts/${post.userId}/${cutoffDate.getFullYear()}/${post.id}.json`;
    
    try {
      await s3.send(new PutObjectCommand({
        Bucket: ARCHIVE_BUCKET,
        Key: archiveKey,
        Body: JSON.stringify(post),
        ContentType: 'application/json',
      }));

      // Delete archived post and its comments
      await prisma.post.delete({
        where: { id: post.id },
      });

      console.log(`Archived post ${post.id} for user ${post.userId}`);
    } catch (error) {
      console.error(`Failed to archive post ${post.id}:`, error);
    }
  }
}

export async function archiveInactiveUsers() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 365); // Archive users inactive for 1 year

  const inactiveUsers = await prisma.user.findMany({
    where: {
      AND: [
        { updatedAt: { lt: cutoffDate } },
        {
          trades: { none: { closedAt: { gt: cutoffDate } } },
        },
        {
          posts: { none: { createdAt: { gt: cutoffDate } } },
        },
      ],
    },
    include: {
      trades: true,
      posts: true,
      comments: true,
      achievements: true,
      stats: true,
      settings: true,
    },
  });

  for (const user of inactiveUsers) {
    const archiveKey = `users/${user.id}/archive.json`;
    
    try {
      await s3.send(new PutObjectCommand({
        Bucket: ARCHIVE_BUCKET,
        Key: archiveKey,
        Body: JSON.stringify(user),
        ContentType: 'application/json',
      }));

      // Mark user as archived instead of deleting
      await prisma.user.update({
        where: { id: user.id },
        data: { status: 'archived' },
      });

      console.log(`Archived inactive user ${user.id}`);
    } catch (error) {
      console.error(`Failed to archive user ${user.id}:`, error);
    }
  }
}

// Cron job to run archiving tasks
export async function runArchivingTasks() {
  console.log('Starting archiving tasks...');
  
  try {
    await archiveOldTrades();
    await archiveOldPosts();
    await archiveInactiveUsers();
    console.log('Archiving tasks completed successfully');
  } catch (error) {
    console.error('Error running archiving tasks:', error);
  }
} 