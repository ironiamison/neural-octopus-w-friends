'use client';

import { useEffect } from 'react';
import { useAchievementsStore } from '@/utils/achievements';
import type { Achievement } from '@/utils/achievements';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function AchievementsList() {
  const { data: session } = useSession();
  const { achievements, isLoading, error, fetchAchievements } = useAchievementsStore();

  useEffect(() => {
    if (session?.user?.id) {
      fetchAchievements(session.user.id);
    }
  }, [session?.user?.id, fetchAchievements]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="p-4">
          <p className="text-destructive">Failed to load achievements: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!achievements.length) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-muted-foreground text-center">
            No achievements unlocked yet. Start trading to earn achievements!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {achievements.map((achievement: Achievement) => (
        <Card key={achievement.id}>
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {achievement.name}
              </CardTitle>
              <Badge variant="secondary">+{achievement.xpReward} XP</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-muted-foreground">{achievement.description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 