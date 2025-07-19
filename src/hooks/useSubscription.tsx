
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserSubscription {
  id: string;
  status: string;
  trial_start: string;
  trial_end: string;
  subscription_start: string | null;
  subscription_end: string | null;
  plan_id: string;
}

interface SubscriptionStatus {
  isActive: boolean;
  isTrialActive: boolean;
  isSubscriptionActive: boolean;
  daysLeft: number | null;
  status: 'trial' | 'active' | 'expired' | 'none';
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatus = (): SubscriptionStatus => {
    if (!subscription) {
      return {
        isActive: false,
        isTrialActive: false,
        isSubscriptionActive: false,
        daysLeft: null,
        status: 'none'
      };
    }

    const now = new Date();
    const trialEnd = new Date(subscription.trial_end);
    const subscriptionEnd = subscription.subscription_end ? new Date(subscription.subscription_end) : null;

    const isTrialActive = subscription.status === 'trial' && trialEnd > now;
    const isSubscriptionActive = subscription.status === 'active' && subscriptionEnd && subscriptionEnd > now;

    let daysLeft: number | null = null;
    let status: 'trial' | 'active' | 'expired' | 'none' = 'none';

    if (isTrialActive) {
      daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      status = 'trial';
    } else if (isSubscriptionActive) {
      status = 'active';
    } else if (subscription.status === 'trial' && trialEnd <= now) {
      status = 'expired';
    }

    return {
      isActive: isTrialActive || isSubscriptionActive,
      isTrialActive,
      isSubscriptionActive,
      daysLeft,
      status
    };
  };

  return {
    subscription,
    loading,
    getSubscriptionStatus,
    refetchSubscription: fetchSubscription
  };
};
