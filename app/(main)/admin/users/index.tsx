import { Box } from '@/components/ui/box';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { MainTopBar } from '@/app/(main)/_components/MainTopBar';
import { adminAnalyticsService } from '@/services/api/adminAnalyticsService';
import { queryKeys } from '@/services/queryKeys';
import type { AdminUser } from '@/types/analytics';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Keyboard, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { routes } from '@/constants/routes';
import { formatFullDate, formatRelativeDate } from '@/utils/formatters';

function UserRow({
  user,
  onPress,
  theme,
  t,
}: {
  user: AdminUser;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="cursor-pointer"
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.cardBorder,
        backgroundColor: theme.cardBg,
      }}
    >
      <Box className="flex-row items-center justify-between">
        <Box className="flex-1">
          <Text
            className="text-base font-semibold"
            style={{ color: theme.textPrimary }}
            numberOfLines={1}
          >
            {user.fullName || user.email}
          </Text>
          <Text
            className="text-sm mt-0.5"
            style={{ color: theme.textSecondary }}
            numberOfLines={1}
          >
            {user.email}
          </Text>
        </Box>
        <Box className="items-end">
          <Text
            className="text-xs"
            style={{ color: theme.textSecondary }}
          >
            {t('admin.lastActivity')}: {formatRelativeDate(user.lastActivity, {
            yesterday: t('common.yesterday'),
            daysAgo: (n) => t('common.daysAgo', { count: n }),
            weeksAgo: (n) => t('common.weeksAgo', { count: n }),
          })}
          </Text>
          <Text
            className="text-xs mt-0.5"
            style={{ color: theme.textTertiary }}
          >
            {formatFullDate(user.createdAt)}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}

export default function AdminUsersScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.users(50, 0, search || undefined),
    queryFn: () => adminAnalyticsService.getAdminUsers(50, 0, search || undefined),
  });

  const handleUserPress = useCallback(
    (userId: string) => {
      Keyboard.dismiss();
      router.push(routes.admin(`users/${userId}`) as never);
    },
    [router],
  );

  const users = data?.users ?? [];

  if (isLoading) {
    return <LoadingScreen message={t('admin.loadingUsers')} />;
  }

  return (
    <Box
      className="flex-1 px-6"
      style={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        backgroundColor: theme.pageBg,
      }}
    >
      <MainTopBar
        title={t('admin.users')}
        currentSection="admin"
        showBackButton
      />
      <Box className="pb-3">
        <Box
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
          }}
        >
          <Input variant="outline" size="lg" className="h-12 border-0">
            <InputSlot className="pl-4">
              <InputIcon>
                <Ionicons name="search" size={20} color={theme.textSecondary} />
              </InputIcon>
            </InputSlot>
            <InputField
              placeholder={t('admin.searchUsers')}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
          </Input>
        </Box>
      </Box>
      <Box className="flex-1">
        {users.length === 0 ? (
          <Box className="flex-1 items-center justify-center py-12">
            <Text
              className="text-base text-center"
              style={{ color: theme.textSecondary }}
            >
              {search ? t('admin.noUsersFound') : t('admin.noUsers')}
            </Text>
          </Box>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <UserRow
                user={item}
                onPress={() => handleUserPress(item.id)}
                theme={theme}
                t={t}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </Box>
    </Box>
  );
}
