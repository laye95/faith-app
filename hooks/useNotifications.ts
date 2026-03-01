import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import { notificationService } from '@/services/api/notificationService';
import { queryKeys } from '@/services/queryKeys';
import type { UserNotification } from '@/types/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/services/supabase/client';

const NOTIFICATIONS_LIMIT = 20;
const STALE_TIME_MS = 60_000;

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();
  const userId = user?.id ?? '';

  const query = useQuery({
    queryKey: queryKeys.notifications.list(userId),
    queryFn: () => notificationService.listByUser(userId, NOTIFICATIONS_LIMIT),
    enabled: !!userId,
    staleTime: STALE_TIME_MS,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(userId),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(userId),
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(userId),
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => notificationService.remove(id),
    onError: () => {
      toast.error(t('notifications.removeFailed'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(userId),
      });
    },
  });

  const removeAllMutation = useMutation({
    mutationFn: () => notificationService.removeAllByUser(userId),
    onSuccess: () => {
      toast.success(t('notifications.removeAllSuccess'));
    },
    onError: () => {
      toast.error(t('notifications.removeAllFailed'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(userId),
      });
    },
  });

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('user_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.notifications.list(userId),
          });
        },
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          queryClient.invalidateQueries({
            queryKey: queryKeys.notifications.list(userId),
          });
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          if (__DEV__ && err) {
            console.warn('[Realtime] notifications channel:', status, err);
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const notifications = (query.data ?? []) as UserNotification[];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    markAllAsRead: markAllAsReadMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    remove: removeMutation.mutate,
    removeAll: removeAllMutation.mutate,
    isRemoving: removeMutation.isPending,
    isRemovingAll: removeAllMutation.isPending,
  };
}
