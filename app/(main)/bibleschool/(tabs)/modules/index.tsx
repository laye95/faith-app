import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MODULES } from "@/constants/modules";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { bzzt } from "@/utils/haptics";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainTopBar } from "../../../_components/MainTopBar";
import { ModuleCard } from "./_components/ModuleCard";
import { useModuleProgress } from "./_hooks/useModuleProgress";

export default function BibleSchoolModulesScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { progressMap, attemptCountMap } = useModuleProgress();

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
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
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
        <VStack className="gap-4">
          {MODULES.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              progress={progressMap[module.id] ?? null}
              attemptCount={attemptCountMap[module.id] ?? 0}
              onPress={() => {
                bzzt();
                router.push(`/(main)/bibleschool/modules/${module.id}`);
              }}
            />
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}
