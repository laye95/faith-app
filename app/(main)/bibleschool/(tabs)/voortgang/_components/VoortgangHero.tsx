import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

interface VoortgangHeroProps {
  overallPercentage: number;
  completedCount: number;
  passedModuleCount: number;
  streakDays: number;
  totalLessons: number;
  totalModules: number;
}

interface StatChipProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

function StatChip({ icon, value, label }: StatChipProps) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
      <Ionicons name={icon} size={16} color={theme.textTertiary} />
      <Text
        className="text-sm font-bold"
        style={{ color: theme.textPrimary }}
      >
        {value}
      </Text>
      <Text
        className="text-xs"
        style={{ color: theme.textTertiary }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export function VoortgangHero({
  overallPercentage,
  completedCount,
  passedModuleCount,
  streakDays,
  totalLessons,
  totalModules,
}: VoortgangHeroProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const clamped = Math.min(100, Math.max(0, overallPercentage));

  return (
    <View
      style={{
        backgroundColor: theme.cardBg,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 52,
          fontWeight: '700',
          color: theme.textPrimary,
          lineHeight: 68,
          letterSpacing: -1,
        }}
      >
        {overallPercentage}%
      </Text>

      <Text
        className="text-sm mt-1 mb-5"
        style={{ color: theme.textSecondary }}
      >
        {t('overview.progressCount', {
          completed: completedCount,
          total: totalLessons,
        })}
      </Text>

      <View
        style={{
          height: 10,
          borderRadius: 6,
          backgroundColor: theme.brandAccentMuted,
          overflow: 'hidden',
          marginBottom: 20,
        }}
      >
        <View
          style={{
            height: '100%',
            borderRadius: 6,
            width: `${clamped}%`,
            backgroundColor: theme.brandAccent,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: theme.cardBorder,
          paddingTop: 16,
        }}
      >
        <StatChip
          icon="book-outline"
          value={`${completedCount}/${totalLessons}`}
          label={t('voortgang.lessons')}
        />
        <View style={{ width: 1, backgroundColor: theme.cardBorder }} />
        <StatChip
          icon="ribbon-outline"
          value={`${passedModuleCount}/${totalModules}`}
          label={t('voortgang.modules')}
        />
        <View style={{ width: 1, backgroundColor: theme.cardBorder }} />
        <StatChip
          icon="flame-outline"
          value={String(streakDays)}
          label={t('voortgang.streak')}
        />
      </View>
    </View>
  );
}

const __expoRouterPrivateRoute_VoortgangHero = () => null;

export default __expoRouterPrivateRoute_VoortgangHero;
