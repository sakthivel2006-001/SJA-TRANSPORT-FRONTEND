import { useState, useEffect, useCallback } from 'react';
import { getAchievements } from '../services/achievementService';

interface AchievementItem {
  _id: string;
  title: string;
  value: string;
  description: string;
  icon: string;
  image: string;
  displayOrder: number;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await getAchievements();
      setAchievements(res.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAchievements(); }, [fetchAchievements]);

  return { achievements, loading, error, refetch: fetchAchievements };
};
