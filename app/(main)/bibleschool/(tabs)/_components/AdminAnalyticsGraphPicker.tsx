import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import {
  ADMIN_ANALYTICS_GRAPH_IDS,
  type AdminAnalyticsGraphId,
} from '../_hooks/useAdminAnalyticsLayout';
import { Ionicons } from '@expo/vector-icons';
import { bzzt } from '@/utils/haptics';
import { Modal, TouchableOpacity } from 'react-native';

const GRAPH_LABEL_KEYS: Record<AdminAnalyticsGraphId, string> = {
  totalUsers: 'admin.totalUsers',
  activeUsers: 'admin.activeUsers',
  mostCompleted: 'admin.mostCompleted',
  quizPerformance: 'admin.quizPerformance',
  engagementFunnel: 'admin.engagementFunnel',
  moduleCompletion: 'admin.moduleCompletion',
};

interface AdminAnalyticsGraphPickerProps {
  visible: boolean;
  onClose: () => void;
  visibleGraphIds: string[];
  onToggleGraph: (id: string, visible: boolean) => void;
}

export function AdminAnalyticsGraphPicker({
  visible,
  onClose,
  visibleGraphIds,
  onToggleGraph,
}: AdminAnalyticsGraphPickerProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="rounded-t-3xl overflow-hidden"
          style={{
            backgroundColor: theme.cardBg,
            paddingBottom: 40,
          }}
        >
          <Box className="p-5">
            <Box className="flex-row items-center justify-between mb-4">
              <Text
                className="text-lg font-semibold"
                style={{ color: theme.textPrimary }}
              >
                {t('admin.customizeGraphs')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  bzzt();
                  onClose();
                }}
                className="p-2 cursor-pointer"
              >
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </Box>
            <Text
              className="text-sm mb-4"
              style={{ color: theme.textSecondary }}
            >
              {t('admin.selectGraphs')}
            </Text>
            <Box className="gap-2">
              {ADMIN_ANALYTICS_GRAPH_IDS.map((id) => {
                const isChecked = visibleGraphIds.includes(id);
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => {
                      bzzt();
                      onToggleGraph(id, !isChecked);
                    }}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between py-3 px-4 rounded-xl cursor-pointer"
                    style={{
                      backgroundColor: theme.cardBorder,
                    }}
                  >
                    <Text
                      className="text-base font-medium"
                      style={{ color: theme.textPrimary }}
                    >
                      {t(GRAPH_LABEL_KEYS[id] as never)}
                    </Text>
                    <Box
                      className="w-6 h-6 rounded border-2 items-center justify-center"
                      style={{
                        borderColor: isChecked
                          ? theme.buttonPrimary
                          : theme.textTertiary,
                        backgroundColor: isChecked
                          ? theme.buttonPrimary
                          : 'transparent',
                      }}
                    >
                      {isChecked && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={theme.buttonPrimaryContrast}
                        />
                      )}
                    </Box>
                  </TouchableOpacity>
                );
              })}
            </Box>
          </Box>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const __expoRouterPrivateRoute_AdminAnalyticsGraphPicker = () => null;

export default __expoRouterPrivateRoute_AdminAnalyticsGraphPicker;
