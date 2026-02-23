import { MainTopBar } from "@/app/(main)/_components/MainTopBar";
import { Box } from "@/components/ui/box";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { routes } from "@/constants/routes";
import { useModules } from "@/hooks/useBibleschoolContent";
import { useLastWatchedLesson } from "@/hooks/useLastWatchedLesson";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { bzzt } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModuleCard } from "./_components/ModuleCard";
import { useModuleProgress } from "./_hooks/useModuleProgress";

export default function BibleSchoolModulesScreen() {
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const insets = useSafeAreaInsets();
  const { progressMap, attemptCountMap } = useModuleProgress();
  const { data: modules, isLoading } = useModules(locale);
  const { module: currentModule } = useLastWatchedLesson();

  const currentModuleData = useMemo(() => {
    if (!modules?.length || !currentModule) return undefined;
    return modules.find((m) => m.id === currentModule.id);
  }, [modules, currentModule?.id]);

  const completedModules = useMemo(() => {
    if (!modules?.length) return [];
    return modules.filter((m) => progressMap[m.id]?.status === "completed");
  }, [modules, progressMap]);

  const allModulesExcludingCurrent = useMemo(() => {
    if (!modules?.length) return [];
    if (!currentModuleData) return modules;
    return modules.filter((m) => m.id !== currentModuleData.id);
  }, [modules, currentModuleData?.id]);

  const remainingModules = useMemo(() => {
    return allModulesExcludingCurrent.filter(
      (m) => progressMap[m.id]?.status !== "completed",
    );
  }, [allModulesExcludingCurrent, progressMap]);

  const [completedModulesExpanded, setCompletedModulesExpanded] =
    useState(true);
  const [allModulesExpanded, setAllModulesExpanded] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const SCROLL_THRESHOLD = 150;

  if (!modules?.length) {
    return (
      <Box
        className="flex-1 items-center justify-center px-6"
        style={{
          paddingTop: insets.top + 24,
          backgroundColor: theme.pageBg,
        }}
      >
        <MainTopBar
          title={t("navbar.bibleschool")}
          currentSection="bibleschool"
          showBackButton
          onBack={() => router.replace(routes.bibleschool())}
        />
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.textSecondary} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className="flex-1 px-6 pt-6"
      style={{
        paddingTop: insets.top + 24,
        backgroundColor: theme.pageBg,
      }}
    >
      <MainTopBar
        title={t("navbar.bibleschool")}
        currentSection="bibleschool"
        showBackButton
        onBack={() => router.replace(routes.bibleschool())}
      />
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          setShowScrollToTop(y > SCROLL_THRESHOLD);
        }}
        scrollEventThrottle={100}
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <Text
          className="text-2xl font-bold mb-4"
          style={{ color: theme.textPrimary }}
        >
          {t("navbar.modules")}
        </Text>
        <VStack className="gap-6">
          {currentModuleData && (
            <VStack className="gap-2">
              <Text
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: theme.textTertiary }}
              >
                {t("modules.currentModule")}
              </Text>
              <ModuleCard
                key={currentModuleData.id}
                module={{
                  ...currentModuleData,
                  title: currentModuleData.title,
                  backgroundImageUrl: currentModuleData.backgroundImageUrl,
                }}
                progress={progressMap[currentModuleData.id] ?? null}
                attemptCount={attemptCountMap[currentModuleData.id] ?? 0}
                onPress={() => {
                  bzzt();
                  router.push(routes.bibleschoolModule(currentModuleData.id));
                }}
              />
            </VStack>
          )}
          <VStack className="gap-2">
            <CollapsibleSection
              title={t("modules.allModules")}
              collapsed={!allModulesExpanded}
              onToggle={() => setAllModulesExpanded((v) => !v)}
              headerBg={theme.tabInactiveBg}
            >
              {remainingModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={{
                    ...module,
                    title: module.title,
                    backgroundImageUrl: module.backgroundImageUrl,
                  }}
                  progress={progressMap[module.id] ?? null}
                  attemptCount={attemptCountMap[module.id] ?? 0}
                  onPress={() => {
                    bzzt();
                    router.push(routes.bibleschoolModule(module.id));
                  }}
                />
              ))}
            </CollapsibleSection>
            {completedModules.length > 0 && (
              <CollapsibleSection
                title={t("modules.completedModules")}
                collapsed={!completedModulesExpanded}
                onToggle={() => setCompletedModulesExpanded((v) => !v)}
                headerBg={theme.tabInactiveBg}
              >
                {completedModules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={{
                      ...module,
                      title: module.title,
                      backgroundImageUrl: module.backgroundImageUrl,
                    }}
                    progress={progressMap[module.id] ?? null}
                    attemptCount={attemptCountMap[module.id] ?? 0}
                    onPress={() => {
                      bzzt();
                      router.push(routes.bibleschoolModule(module.id));
                    }}
                  />
                ))}
              </CollapsibleSection>
            )}
          </VStack>
        </VStack>
      </ScrollView>
      {showScrollToTop && (
        <View
          style={{
            position: "absolute",
            right: 12,
            bottom: insets.bottom + 90,
          }}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            onPress={() => {
              bzzt();
              scrollRef.current?.scrollTo({ y: 0, animated: true });
            }}
            activeOpacity={0.7}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: theme.cardBg,
              borderWidth: 1,
              borderColor: theme.cardBorder,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="arrow-up-circle"
              size={28}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
        </View>
      )}
    </Box>
  );
}
