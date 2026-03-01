import { BadgePill } from "@/components/ui/BadgePill";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/Card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import type { Module } from "@/constants/modules";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import type { ModuleProgress } from "@/types/progress";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";

type ModuleWithTitle =
  | (Module & { title?: string; backgroundImageUrl?: string })
  | {
      id: string;
      order: number;
      title: string;
      titleKey?: string;
      backgroundImageUrl?: string;
    };

interface ModuleCardProps {
  module: ModuleWithTitle;
  progress: ModuleProgress | null;
  attemptCount: number;
  onPress: () => void;
}

function StarRow({
  percentage,
  starColor,
}: {
  percentage: number;
  starColor: string;
}) {
  const filledCount = Math.floor((percentage / 100) * 5);
  const hasHalf = (percentage / 100) * 5 - filledCount >= 0.5;

  return (
    <HStack className="gap-0.5" style={{ alignItems: "center" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Ionicons
          key={i}
          name={
            i < filledCount
              ? "star"
              : i === filledCount && hasHalf
                ? "star-half"
                : "star-outline"
          }
          size={16}
          color={starColor}
        />
      ))}
    </HStack>
  );
}

export function ModuleCard({
  module,
  progress,
  attemptCount,
  onPress,
}: ModuleCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const status = progress?.status ?? "locked";
  const percentage = progress?.progress_percentage ?? 0;
  const isCompleted = status === "completed";

  const statusLabel =
    status === "completed"
      ? t("modules.status.passed")
      : status === "in_progress"
        ? t("modules.status.inProgress")
        : t("modules.status.locked");

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="cursor-pointer"
    >
      <Card padding="none">
        {module.backgroundImageUrl ? (
          <Box className="h-36">
            <Image
              source={{ uri: module.backgroundImageUrl }}
              style={{ width: "100%", height: 144 }}
              contentFit="cover"
            />
          </Box>
        ) : null}
        <View
          style={{
            height: 72,
            paddingHorizontal: 20,
            position: "relative",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              right: 20,
              bottom: 0,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                minWidth: 0,
              }}
            >
              <Text
                className="text-xs"
                style={{
                  color: theme.textSecondary,
                  includeFontPadding: false,
                }}
              >
                {attemptCount === 0
                  ? t("modules.attemptZero")
                  : attemptCount === 1
                    ? t("modules.attemptSingular")
                    : t("modules.attemptPlural", { count: attemptCount })}
              </Text>
              <StarRow percentage={percentage} starColor={theme.starSuccess} />
              <Text
                className="text-sm font-bold"
                style={{ color: theme.textPrimary, includeFontPadding: false }}
              >
                {percentage}%
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              {(isCompleted || status === "in_progress") && (
                <BadgePill
                  label={statusLabel}
                  variant={isCompleted ? "success" : "info"}
                />
              )}
              <Box
                className="rounded-full p-1.5"
                style={{ backgroundColor: theme.avatarPrimary }}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.textPrimary}
                />
              </Box>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
