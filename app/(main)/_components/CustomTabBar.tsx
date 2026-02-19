import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useMemo } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface TabItem {
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
}

const TAB_CONFIG: Record<string, TabItem[]> = {
  bibleschool: [
    { route: 'index', icon: 'home', labelKey: 'navbar.overview' },
    { route: 'modules', icon: 'library', labelKey: 'navbar.modules' },
  ],
  podcasts: [{ route: 'index', icon: 'mic', labelKey: 'navbar.browse' }],
  sermons: [{ route: 'index', icon: 'videocam', labelKey: 'navbar.latest' }],
};

interface CustomTabBarProps extends BottomTabBarProps {
  section: keyof typeof TAB_CONFIG;
}

export function CustomTabBar({ state, descriptors, navigation, section }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = useTranslation();
  const isDark = theme.isDark;
  const previousIndex = useRef(state.index);
  const scaleAnims = useRef<Record<string, Animated.Value>>({}).current;

  const tabItems = TAB_CONFIG[section];
  if (!tabItems || tabItems.length <= 1) return null;

  state.routes.forEach((route) => {
    if (!scaleAnims[route.key]) {
      scaleAnims[route.key] = new Animated.Value(1);
    }
  });

  useEffect(() => {
    if (previousIndex.current !== state.index) {
      const prevRoute = state.routes[previousIndex.current];
      const newRoute = state.routes[state.index];
      if (prevRoute && newRoute) {
        Animated.parallel([
          Animated.spring(scaleAnims[prevRoute.key], {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 20,
          }),
          Animated.spring(scaleAnims[newRoute.key], {
            toValue: 1.15,
            useNativeDriver: true,
            tension: 300,
            friction: 20,
          }),
        ]).start(() => {
          Animated.spring(scaleAnims[newRoute.key], {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 20,
          }).start();
        });
      }
      previousIndex.current = state.index;
    }
  }, [state.index, state.routes, scaleAnims]);

  const inactiveIconColor = theme.tabInactiveText;
  const inactiveTextColor = theme.tabInactiveText;
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom,
        left: 16,
        right: 16,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: theme.cardBg,
          borderRadius: 24,
          paddingVertical: 4,
          paddingHorizontal: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.25 : 0.1,
          shadowRadius: 24,
          elevation: 12,
          borderWidth: 1,
          borderColor,
        }}
      >
        {state.routes.map((route) => {
          const index = state.routes.findIndex((r) => r.key === route.key);
          const isFocused = state.index === index;
          const routeName = route.name;
          const tabItem = tabItems.find((t) => t.route === routeName);
          if (!tabItem) return null;
          const config = { icon: tabItem.icon, label: t(tabItem.labelKey) };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              bzzt();
              navigation.navigate(route.name as never);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              activeOpacity={0.7}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 4,
                paddingHorizontal: 0,
              }}
            >
              {isFocused ? (
                <Animated.View
                  style={{
                    transform: [{ scale: scaleAnims[route.key] || 1 }],
                    width: '100%',
                  }}
                >
                  <LinearGradient
                    colors={[theme.buttonPrimary, theme.buttonPrimary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 16,
                      paddingVertical: 8,
                      paddingHorizontal: 8,
                      shadowColor: theme.buttonPrimary,
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: isDark ? 0.15 : 0.25,
                      shadowRadius: 6,
                      elevation: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 3,
                      width: '100%',
                    }}
                  >
                    <View style={{ height: 20, justifyContent: 'center' }}>
                      <Ionicons
                        name={config.icon as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color={theme.buttonPrimaryContrast}
                      />
                    </View>
                    <View style={{ height: 12, justifyContent: 'center' }}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '600',
                          color: theme.buttonPrimaryContrast,
                          lineHeight: 12,
                        }}
                      >
                        {config.label}
                      </Text>
                    </View>
                  </LinearGradient>
                </Animated.View>
              ) : (
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                  }}
                >
                  <View style={{ height: 20, justifyContent: 'center' }}>
                    <Ionicons
                      name={
                        (config.icon === 'ellipsis-horizontal'
                          ? 'ellipsis-horizontal'
                          : `${config.icon}-outline`) as keyof typeof Ionicons.glyphMap
                      }
                      size={20}
                      color={inactiveIconColor}
                    />
                  </View>
                  <View style={{ height: 12, justifyContent: 'center' }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '500',
                        color: inactiveTextColor,
                        lineHeight: 12,
                      }}
                    >
                      {config.label}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
