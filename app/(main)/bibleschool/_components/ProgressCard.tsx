import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/contexts/AuthContext';
import { TOTAL_LESSONS } from '@/constants/modules';
import { routes } from '@/constants/routes';
import { useBibleschoolTab } from '@/contexts/BibleschoolTabContext';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useCompletedLessons } from '@/hooks/useCompletedLessons';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { OverviewCard } from './OverviewCard';

export function ProgressCard() {
  const { user } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  const { setActiveTab, setNavigationDirection } = useBibleschoolTab();

  const { data: completedLessons } = useCompletedLessons(user?.id);

  const completedCount = completedLessons?.length ?? 0;
  const percentage = TOTAL_LESSONS > 0
    ? Math.round((completedCount / TOTAL_LESSONS) * 100)
    : 0;

  const handlePress = () => {
    bzzt();
    setNavigationDirection('right');
    setActiveTab('voortgang');
    router.push(routes.bibleschoolVoortgang());
  };

  return (
    <OverviewCard>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Box className="p-5">
          <HStack className="items-center gap-4">
            <Box
              className="rounded-xl p-3"
              style={{ backgroundColor: theme.brandAccentMuted }}
            >
              <Ionicons name="bar-chart" size={28} color={theme.brandAccent} />
            </Box>
            <VStack className="flex-1">
              <HStack className="items-center justify-between">
                <Text
                  className="text-lg font-bold"
                  style={{ color: theme.textPrimary }}
                >
                  {t('overview.progressTitle')}
                </Text>
                <HStack className="items-center gap-1">
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: theme.textSecondary }}
                  >
                    {percentage}%
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={theme.textTertiary} />
                </HStack>
              </HStack>
              <Text
                className="text-sm mt-1"
                style={{ color: theme.textSecondary }}
              >
                {t('overview.progressCount', { completed: completedCount, total: TOTAL_LESSONS })}
              </Text>
              <Box className="mt-3">
                <ProgressBar value={percentage} />
              </Box>
            </VStack>
          </HStack>
        </Box>
      </TouchableOpacity>
    </OverviewCard>
  );
}
