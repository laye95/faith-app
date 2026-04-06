import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ColorMatrix, invert } from 'react-native-color-matrix-image-filters';

import logoSource from '@/assets/images/logo_full.png';

interface AuthHeaderProps {
  icon?: ComponentProps<typeof Ionicons>['name'];
  showLogo?: boolean;
  titleKey?: string;
  subtitleKey?: string;
  titleClassName?: string;
}

export function AuthHeader({
  icon,
  showLogo,
  titleKey,
  subtitleKey,
  titleClassName,
}: AuthHeaderProps) {
  const hasTitleOrSubtitle = !!titleKey || !!subtitleKey;
  const theme = useTheme();
  const { t } = useTranslation();

  const logoImage = (
    <Image
      source={logoSource}
      style={{ width: 260, height: 82 }}
      contentFit="contain"
    />
  );

  return (
    <VStack className="mb-10 items-center">
      {showLogo ? (
        <Box className="mb-8 items-center justify-center">
          {theme.isDark ? (
            logoImage
          ) : (
            <ColorMatrix matrix={invert()}>
              {logoImage}
            </ColorMatrix>
          )}
        </Box>
      ) : icon ? (
        <Box
          className="mb-8 rounded-2xl p-5"
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
      {hasTitleOrSubtitle && (
        <VStack className="items-center gap-3">
          {titleKey && (
            <Heading
              className={titleClassName ?? 'text-center text-3xl font-bold'}
              style={{ color: theme.textPrimary }}
            >
              {t(titleKey)}
            </Heading>
          )}
          {subtitleKey && (
            <Text
              className="max-w-xs text-center text-base"
              style={{ color: theme.textSecondary, lineHeight: 22 }}
            >
              {t(subtitleKey)}
            </Text>
          )}
        </VStack>
      )}
    </VStack>
  );
}
