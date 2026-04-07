import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useBibleschoolCategoryQuery } from '@/hooks/useBibleschoolContent';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function StoryblokErrorBanner() {
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const { isError, refetch, isFetching } = useBibleschoolCategoryQuery(locale);

  if (!isError) {
    return null;
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: theme.cardBorder,
        backgroundColor: theme.badgeWarning,
      }}
    >
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Ionicons name="cloud-offline-outline" size={20} color={theme.textPrimary} />
      <Text
        className="text-sm flex-1"
        style={{ color: theme.textPrimary }}
      >
        {t('bibleschoolContent.loadError')}
      </Text>
      <TouchableOpacity
        onPress={() => {
          bzzt();
          refetch();
        }}
        disabled={isFetching}
        accessibilityRole="button"
        accessibilityLabel={t('bibleschoolContent.retry')}
      >
        <Text
          className="text-sm font-semibold"
          style={{
            color: theme.buttonPrimary,
            opacity: isFetching ? 0.5 : 1,
          }}
        >
          {t('bibleschoolContent.retry')}
        </Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const __expoRouterPrivateRoute_StoryblokErrorBanner = () => null;
export default __expoRouterPrivateRoute_StoryblokErrorBanner;
