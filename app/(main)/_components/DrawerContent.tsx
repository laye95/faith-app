import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSectionNavigation } from '@/contexts/SectionNavigationContext';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity } from 'react-native';

const SECTIONS: Array<{
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
}> = [
  { name: 'index', icon: 'home', labelKey: 'navbar.home' },
  { name: 'bibleschool', icon: 'school', labelKey: 'navbar.bibleschool' },
  { name: 'podcasts', icon: 'mic', labelKey: 'navbar.podcasts' },
  { name: 'sermons', icon: 'videocam', labelKey: 'navbar.sermons' },
  { name: 'profile', icon: 'person', labelKey: 'navbar.profile' },
];

export function DrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { startSectionNavigation } = useSectionNavigation();
  const { state, navigation } = props;
  const currentRoute = state.routes[state.index]?.name ?? '';
  const currentSection = currentRoute === 'index' ? 'index' : currentRoute.split('/')[0] ?? currentRoute;

  const handleSectionChange = (sectionName: string) => {
    bzzt();
    startSectionNavigation(sectionName);
    const routeName =
      sectionName === 'index'
        ? 'index'
        : sectionName === 'profile'
          ? 'profile'
          : sectionName;
    navigation.navigate(routeName as never);
    navigation.closeDrawer();
  };

  return (
    <Box
      className="flex-1"
      style={{
        backgroundColor: theme.pageBg,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 12,
      }}
    >
      <HStack className="items-center justify-between px-4 pb-3">
        <Box className="w-10" />
        <TouchableOpacity
          onPress={() => {
            bzzt();
            navigation.closeDrawer();
          }}
          activeOpacity={0.7}
          className="items-center justify-center cursor-pointer"
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme.isDark ? 0.2 : 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="close" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </HStack>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
      >
        <VStack className="gap-0">
          {SECTIONS.map((section, index) => {
            const isSelected = currentSection === section.name;
            return (
              <Box key={section.name}>
                {index > 0 && (
                  <Box
                    style={{
                      height: 1,
                      backgroundColor: theme.cardBorder,
                      marginHorizontal: 8,
                    }}
                  />
                )}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSectionChange(section.name)}
                  className="cursor-pointer"
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    backgroundColor: isSelected
                      ? theme.isDark
                        ? 'rgba(23, 23, 23, 0.3)'
                        : 'rgba(23, 23, 23, 0.08)'
                      : 'transparent',
                  }}
                >
                  <HStack className="items-center gap-3">
                    <Ionicons
                      name={
                        isSelected
                          ? section.icon
                          : (`${section.icon}-outline` as typeof section.icon)
                      }
                      size={22}
                      color={
                        isSelected
                          ? theme.buttonPrimary
                          : theme.textSecondary
                      }
                    />
                    <Text
                      className="flex-1 text-base font-semibold"
                      style={{ color: theme.textPrimary }}
                    >
                      {t(section.labelKey)}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={theme.buttonPrimary}
                      />
                    )}
                  </HStack>
                </TouchableOpacity>
              </Box>
            );
          })}
        </VStack>
      </ScrollView>
    </Box>
  );
}
