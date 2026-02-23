import { Toggle } from '@/components/ui/Toggle';
import { useToast } from '@/hooks/useToast';
import { bzzt } from '@/utils/haptics';
import { useNotificationSetting } from '../_hooks/useNotificationSetting';

interface NotificationToggleProps {
  settingKey: string;
}

export function NotificationToggle({ settingKey }: NotificationToggleProps) {
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

  return (
    <Toggle
      value={value}
      onValueChange={handleToggle}
      isLoading={isLoading}
    />
  );
}
