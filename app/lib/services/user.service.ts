import { PrismaClient, Prisma } from '@prisma/client';

export interface UserSettings extends Record<string, any> {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

export interface LearningProgress {
  completedModules: string[];
  unlockedModules: string[];
  progress: Record<string, number>;
  completedResources: number[];
}

export interface UserProfile {
  id: string;
  username?: string;
  email?: string;
  avatar?: string;
  walletAddress: string;
  learningProgress?: LearningProgress;
  bio?: string;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getProfile(walletAddress: string): Promise<UserProfile | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { walletAddress },
      });

      if (!user) return null;

      return {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username || undefined,
        avatar: user.avatar || undefined,
        bio: user.bio || undefined,
        settings: user.settings as unknown as UserSettings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  async isUsernameUnique(username: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });
      return !user;
    } catch (error) {
      console.error('Error checking username uniqueness:', error);
      throw error;
    }
  }

  async createProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      if (profile.username && !(await this.isUsernameUnique(profile.username))) {
        throw new Error('Username is already taken');
      }
      const user = await this.prisma.user.create({
        data: {
          walletAddress: profile.walletAddress!,
          username: profile.username,
          avatar: profile.avatar,
          bio: profile.bio,
          settings: profile.settings as Prisma.InputJsonValue,
        },
      });

      return {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username || undefined,
        avatar: user.avatar || undefined,
        bio: user.bio || undefined,
        settings: user.settings as unknown as UserSettings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async updateProfile(walletAddress: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      if (updates.username && !(await this.isUsernameUnique(updates.username))) {
        throw new Error('Username is already taken');
      }
      const user = await this.prisma.user.update({
        where: { walletAddress },
        data: updates,
      });

      return {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username || undefined,
        avatar: user.avatar || undefined,
        bio: user.bio || undefined,
        settings: user.settings as unknown as UserSettings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 