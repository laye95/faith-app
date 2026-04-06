import { Badge } from '@/components/ui/Badge';
import { Text } from '@/components/ui/text';
import { routes } from '@/constants/routes';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import type { Badge as BadgeType, UserBadge } from '@/types/badge';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

interface RecentBadgesRowProps {
  recentBadges: UserBadge[];
  allBadges: BadgeType[];
}

export function RecentBadgesRow({ recentBadges, allBadges }: RecentBadgesRowProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const badgeMap = new Map(allBadges.map((b) => [b.id, b]));

  if (recentBadges.length === 0) {
    return null;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <Text
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: theme.textSecondary }}
        >
          {t('voortgang.recentBadges')}
        </Text>
        <TouchableOpacity
          onPress={() => {
            bzzt();
            router.push(routes.badges());
          }}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: theme.textSecondary }}
          >
            {t('voortgang.allBadges')}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        {recentBadges.map((ub) => {
          const badge = badgeMap.get(ub.badge_id);
          if (!badge) return null;
          return (
            <View key={ub.id} style={{ flex: 1, maxWidth: 100 }}>
              <Badge
                badge={badge}
                earned
                onPress={() => {
                  bzzt();
                  router.push(routes.badges(badge.id));
                }}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}
