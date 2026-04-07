import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import type { ModuleExamStatus, ModuleProgressData } from '../_hooks/useVoortgangData';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

interface ModuleProgressRowProps {
  data: ModuleProgressData;
  onPress: () => void;
  isFirstActive?: boolean;
}

function ExamStatusLabel({ status, score }: { status: ModuleExamStatus; score: number | undefined }) {
  const theme = useTheme();
  const { t } = useTranslation();

  if (status === 'passed') {
    return (
      <Text className="text-xs font-semibold" style={{ color: theme.quizCorrect }}>
        {t('voortgang.examPassed')}
      </Text>
    );
  }
  if (status === 'failed') {
    return (
      <Text className="text-xs font-semibold" style={{ color: theme.quizIncorrect }}>
        {score !== undefined ? `${score}%` : t('voortgang.examFailed')}
      </Text>
    );
  }
  if (status === 'ready') {
    return (
      <Text className="text-xs font-semibold" style={{ color: theme.textTertiary }}>
        {t('voortgang.examReady')}
      </Text>
    );
  }
  return null;
}

function PassedRow({ data, onPress }: { data: ModuleProgressData; onPress: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={() => { bzzt(); onPress(); }}
      activeOpacity={0.6}
      style={{ opacity: 0.7 }}
    >
      <View
        style={{
          backgroundColor: theme.cardBg,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.cardBorder,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 12,
          gap: 12,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.buttonPrimary,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Ionicons name="checkmark" size={18} color={theme.buttonPrimaryContrast} />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: theme.textTertiary }}
            numberOfLines={1}
          >
            {t('modules.moduleLabel', { number: data.order })}
          </Text>
          <Text
            className="text-sm font-semibold"
            style={{ color: theme.textPrimary }}
            numberOfLines={1}
          >
            {data.moduleTitle}
          </Text>
        </View>

        <ExamStatusLabel status={data.examStatus} score={data.examScore} />
      </View>
    </TouchableOpacity>
  );
}

function LockedRow({ data, onPress }: { data: ModuleProgressData; onPress: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={() => { bzzt(); onPress(); }}
      activeOpacity={0.6}
      style={{ opacity: 0.45 }}
    >
      <View
        style={{
          backgroundColor: theme.cardBg,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.cardBorder,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 12,
          gap: 12,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.avatarPrimary,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Ionicons name="lock-closed" size={15} color={theme.textTertiary} />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: theme.textTertiary }}
            numberOfLines={1}
          >
            {t('modules.moduleLabel', { number: data.order })}
          </Text>
          <Text
            className="text-sm font-semibold"
            style={{ color: theme.textPrimary }}
            numberOfLines={1}
          >
            {data.moduleTitle}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

function ActiveRow({
  data,
  onPress,
  isFirstActive,
}: {
  data: ModuleProgressData;
  onPress: () => void;
  isFirstActive: boolean;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={() => { bzzt(); onPress(); }} activeOpacity={0.7}>
      <View>
        {isFirstActive && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginBottom: 6,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.buttonPrimary,
              }}
            />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '700',
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: theme.textSecondary,
              }}
            >
              {t('voortgang.currentModule')}
            </Text>
          </View>
        )}

        <View
          style={{
            backgroundColor: theme.cardBg,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            borderLeftWidth: isFirstActive ? 3 : 1,
            borderLeftColor: isFirstActive ? theme.buttonPrimary : theme.cardBorder,
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text
                className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                style={{ color: theme.textTertiary }}
              >
                {t('modules.moduleLabel', { number: data.order })}
              </Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: theme.textPrimary }}
                numberOfLines={2}
              >
                {data.moduleTitle}
              </Text>
            </View>

            {(data.examStatus === 'ready' || data.examStatus === 'failed') && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  backgroundColor:
                    data.examStatus === 'failed'
                      ? theme.quizIncorrectBg
                      : theme.badgeInfo,
                }}
              >
                <Ionicons
                  name={data.examStatus === 'failed' ? 'close-circle' : 'document-text'}
                  size={12}
                  color={data.examStatus === 'failed' ? theme.quizIncorrect : theme.textSecondary}
                />
                <Text
                  className="text-xs font-bold"
                  style={{
                    color: data.examStatus === 'failed' ? theme.quizIncorrect : theme.textSecondary,
                  }}
                >
                  {data.examStatus === 'failed' && data.examScore !== undefined
                    ? `${data.examScore}%`
                    : data.examStatus === 'failed'
                      ? t('voortgang.examFailed')
                      : t('voortgang.examReady')}
                </Text>
              </View>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.brandAccentMuted,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  borderRadius: 3,
                  width: `${data.lessonPercentage}%`,
                  backgroundColor: theme.brandAccent,
                }}
              />
            </View>
            <Text
              className="text-xs font-semibold tabular-nums"
              style={{ color: theme.textSecondary, minWidth: 32, textAlign: 'right' }}
            >
              {`${data.completedLessons}/${data.lessonCount}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ModuleProgressRow({ data, onPress, isFirstActive = false }: ModuleProgressRowProps) {
  if (data.examStatus === 'passed') {
    return <PassedRow data={data} onPress={onPress} />;
  }
  if (data.isLocked) {
    return <LockedRow data={data} onPress={onPress} />;
  }
  return <ActiveRow data={data} onPress={onPress} isFirstActive={isFirstActive} />;
}

const __expoRouterPrivateRoute_ModuleProgressRow = () => null;

export default __expoRouterPrivateRoute_ModuleProgressRow;
