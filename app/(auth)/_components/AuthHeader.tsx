import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

interface AuthHeaderProps {
  icon?: ComponentProps<typeof Ionicons>['name'];
  titleKey: string;
  subtitleKey: string;
}

export function AuthHeader({ icon, titleKey, subtitleKey }: AuthHeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <VStack className="mb-10 items-center">
      {icon ? (
        <Box
          className="mb-6 rounded-2xl p-5"
          style={{
            backgroundColor: theme.avatarPrimary,
            width: 72,
            height: 72,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon} size={36} color={theme.textPrimary} />
        </Box>
      ) : null}
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
          {t(titleKey)}
        </Heading>
        <Text
          className="max-w-xs text-center text-base"
          style={{ color: theme.textSecondary, lineHeight: 22 }}
        >
          {t(subtitleKey)}
        </Text>
      </VStack>
    </VStack>
  );
}
