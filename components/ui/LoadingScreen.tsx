import { View, ActivityIndicator } from 'react-native';

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Laden...' }: LoadingScreenProps) {
  const theme = useTheme();

  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: theme.pageBg }}
    >
      <VStack className="items-center gap-4">
        <View className="relative">
          <View
            className="rounded-full p-6"
            style={{
              borderWidth: 1,
              borderColor: theme.cardBorder,
              backgroundColor: theme.avatarPrimary,
            }}
          >
            <ActivityIndicator size="large" color={theme.buttonPrimary} />
          </View>
        </View>
        <Text
          className="text-base font-medium"
          style={{ color: theme.textSecondary }}
        >
          {message}
        </Text>
      </VStack>
    </View>
  );
}
