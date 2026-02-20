import { useNotificationSetting } from '../_hooks/useNotificationSetting';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { bzzt } from '@/utils/haptics';
import { ActivityIndicator, Switch } from 'react-native';

interface NotificationToggleProps {
  settingKey: string;
}

export function NotificationToggle({ settingKey }: NotificationToggleProps) {
  const theme = useTheme();
  const toast = useToast();
  const [value, setValue, isLoading] = useNotificationSetting(settingKey);

  const handleToggle = async (newValue: boolean) => {
    bzzt();
    try {
      await setValue(newValue);
    } catch {
      toast.error('Failed to save. Please try again.');
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="small" color={theme.brandAccent} />;
  }

  return (
    <Switch
      value={value}
      onValueChange={handleToggle}
      trackColor={{
        false: theme.cardBorder,
        true: theme.buttonAccept,
      }}
      thumbColor="#FFFFFF"
    />
  );
}
