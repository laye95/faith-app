import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';

export function RegisterHeader() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <VStack className="mb-10 items-center">
      <Text
        className="mb-1 text-xs font-semibold uppercase tracking-widest"
        style={{ color: theme.textSecondary }}
      >
        {t('common.faithGeneration')}
      </Text>
      <VStack className="items-center gap-3">
        <Heading
          className="text-center text-3xl font-bold"
          style={{ color: theme.textPrimary }}
        >
          {t('auth.getStarted')}
        </Heading>
        <Text
          className="max-w-xs text-center text-base"
          style={{ color: theme.textSecondary, lineHeight: 22 }}
        >
          {t('auth.registerSubtitle')}
        </Text>
      </VStack>
    </VStack>
  );
}
