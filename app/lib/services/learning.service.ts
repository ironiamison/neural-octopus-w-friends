import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  order: number;
  requiredModules: string[];
  content: {
    sections: {
      title: string;
      content: string;
      videoUrl?: string;
      quiz?: {
        question: string;
        options: string[];
        correctAnswer: number;
      }[];
    }[];
  };
}

export interface LearningProgress {
  userId: string;
  moduleId: string;
  progress: number;
  completed: boolean;
  quizScores: {
    sectionIndex: number;
    score: number;
    completedAt: Date;
  }[];
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
}

export class LearningService {
  private static COLLECTION_NAME = 'learning_progress';
  private static DB_NAME = 'papermemes';

  static async getModules(): Promise<LearningModule[]> {
    return [
      {
        id: 'basics',
        title: 'Trading Basics',
        description: 'Learn the fundamentals of trading',
        order: 1,
        requiredModules: [],
        content: {
          sections: [
            {
              title: 'Introduction to Trading',
              content: 'Understanding the basics of trading and market mechanics.',
              videoUrl: 'https://www.youtube.com/watch?v=example1'
            },
            {
              title: 'Basic Trading Terms',
              content: 'Learn essential trading terminology and concepts.',
              quiz: [
                {
                  question: 'What is a market order?',
                  options: [
                    'An order to buy/sell at the best available price',
                    'An order to buy/sell at a specific price',
                    'An order that expires at the end of the day',
                    'An order that is partially filled'
                  ],
                  correctAnswer: 0
                }
              ]
            }
          ]
        }
      },
      {
        id: 'advanced',
        title: 'Advanced Strategies',
        description: 'Master advanced trading techniques',
        order: 2,
        requiredModules: ['basics'],
        content: {
          sections: [
            {
              title: 'Technical Analysis',
              content: 'Learn how to analyze price charts and identify patterns.',
              videoUrl: 'https://www.youtube.com/watch?v=example2'
            },
            {
              title: 'Risk Management',
              content: 'Advanced risk management strategies and position sizing.',
              quiz: [
                {
                  question: 'What is the recommended maximum risk per trade?',
                  options: [
                    '50% of your portfolio',
                    '25% of your portfolio',
                    '10% of your portfolio',
                    '1-2% of your portfolio'
                  ],
                  correctAnswer: 3
                }
              ]
            }
          ]
        }
      }
    ];
  }

  static async getUserProgress(userId: string): Promise<LearningProgress[]> {
    const client = await clientPromise;
    const collection = client.db(this.DB_NAME).collection<LearningProgress>(this.COLLECTION_NAME);
    
    return collection.find({ userId }).toArray();
  }

  static async updateProgress(
    userId: string,
    moduleId: string,
    progress: number,
    quizScore?: { sectionIndex: number; score: number }
  ): Promise<void> {
    const client = await clientPromise;
    const collection = client.db(this.DB_NAME).collection<LearningProgress>(this.COLLECTION_NAME);

    const now = new Date();
    const completed = progress === 100;

    const existingProgress = await collection.findOne({ userId, moduleId });
    
    if (!existingProgress) {
      await collection.insertOne({
        userId,
        moduleId,
        progress,
        completed,
        quizScores: quizScore ? [{ ...quizScore, completedAt: now }] : [],
        startedAt: now,
        lastAccessedAt: now,
        ...(completed ? { completedAt: now } : {})
      });
    } else {
      const update: any = {
        progress,
        completed,
        lastAccessedAt: now
      };

      if (completed && !existingProgress.completedAt) {
        update.completedAt = now;
      }

      if (quizScore) {
        update.$push = {
          quizScores: { ...quizScore, completedAt: now }
        };
      }

      await collection.updateOne(
        { userId, moduleId },
        { $set: update }
      );
    }
  }

  static async isModuleAvailable(userId: string, moduleId: string): Promise<boolean> {
    const modules = await this.getModules();
    const module = modules.find(m => m.id === moduleId);
    
    if (!module || module.requiredModules.length === 0) {
      return true;
    }

    const progress = await this.getUserProgress(userId);
    return module.requiredModules.every(requiredId => 
      progress.some(p => p.moduleId === requiredId && p.completed)
    );
  }
} 