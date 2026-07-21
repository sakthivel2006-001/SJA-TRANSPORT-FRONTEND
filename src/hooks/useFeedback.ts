import { useState, useEffect, useCallback } from 'react';
import { getPublicFeedback } from '../services/feedbackService';

interface FeedbackItem {
  _id: string;
  customerName: string;
  rating: number;
  review: string;
  approved?: boolean;
  status?: string;
  vehicle?: string;
  service?: string;
  createdAt?: string;
}

export const useFeedback = () => {
  const [reviews, setReviews] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await getPublicFeedback();
      setReviews(res.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  return { reviews, loading, error, refetch: fetchFeedback };
};
