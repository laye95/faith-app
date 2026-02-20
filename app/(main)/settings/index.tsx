import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { MainTopBar } from '@/app/(main)/_components/MainTopBar';
import { SettingRow } from './_components/SettingRow';
import { useTheme } from '@/hooks/useTheme';
import { routes } from '@/constants/routes';
import { router } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity } from 'react-native';
import { createElement, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { bzzt } from '@/utils/haptics';
import { SETTINGS_SECTIONS } from './_config/settingsSections';

export default function SettingsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

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
        title={t('navbar.settings')}
        currentSection="settings"
        showBackButton
        onBack={() => router.replace(routes.profile())}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {SETTINGS_SECTIONS.map((section) => {
          const isCollapsed = collapsedSections[section.id] ?? false;
          const toggleSection = () => {
            bzzt();
            setCollapsedSections((prev) => ({
              ...prev,
              [section.id]: !prev[section.id],
            }));
          };
          return (
            <Box key={section.id} className="mb-4">
              <Box
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: theme.cardBg,
                }}
              >
                <TouchableOpacity
                  onPress={toggleSection}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between px-4 py-3.5"
                  style={{
                    borderBottomWidth: isCollapsed ? 0 : 1,
                    borderBottomColor: theme.cardBorder,
                  }}
                >
                  <Text
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.textTertiary }}
                  >
                    {t(section.titleKey)}
                  </Text>
                  <Ionicons
                    name={isCollapsed ? 'chevron-down' : 'chevron-up'}
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
                {!isCollapsed &&
                  section.rows.map((row, rowIndex) => {
                    const Component = row.component;
                    const componentProps = (row.componentProps ?? {}) as Record<string, unknown>;
                    return (
                      <Box
                        key={row.id}
                        style={{
                          borderTopWidth: rowIndex > 0 ? 1 : 0,
                          borderTopColor: theme.cardBorder,
                        }}
                      >
                        <SettingRow
                          icon={row.icon}
                          labelKey={row.labelKey}
                          isLast={row.isLast}
                          fullWidthChildren={row.fullWidthChildren}
                        >
                          {createElement(Component, componentProps)}
                        </SettingRow>
                      </Box>
                    );
                  })}
              </Box>
            </Box>
          );
        })}
      </ScrollView>
    </Box>
  );
}
