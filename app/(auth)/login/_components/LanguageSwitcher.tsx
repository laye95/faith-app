import { useRef, useState } from 'react';
import {
  TouchableOpacity,
  Dimensions,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import { LANGUAGES, type SupportedLocale } from '@/i18n';

export function LanguageSwitcher() {
  const theme = useTheme();
  const { locale, changeLanguage } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [layout, setLayout] = useState<{ x: number; y: number; width: number } | null>(null);
  const triggerRef = useRef<View>(null);
  const isDark = theme.isDark;
  const { width: screenWidth } = Dimensions.get('window');
  const switcherWidth = Math.min(screenWidth - 96, 320);

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

  const handleOpen = () => {
    bzzt();
    triggerRef.current?.measureInWindow((x, y, width) => {
      setLayout({ x, y, width });
      setExpanded(true);
    });
  };

  const handleClose = () => {
    setExpanded(false);
    setLayout(null);
  };

  const handleLanguageChange = async (newLocale: SupportedLocale) => {
    bzzt();
    await changeLanguage(newLocale);
    handleClose();
  };

  return (
    <View
      ref={triggerRef}
      style={{ width: switcherWidth, minWidth: switcherWidth }}
      collapsable={false}
    >
      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={0.7}
        style={{
          width: '100%',
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 12,
          backgroundColor: theme.cardBg,
          borderWidth: 1,
          borderColor: theme.cardBorder,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <HStack className="items-center gap-2">
          <Text style={{ fontSize: 18 }}>{currentLanguage.flag}</Text>
          <Text
            className="text-sm font-semibold flex-1"
            style={{ color: theme.textPrimary }}
          >
            {currentLanguage.nativeName}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={theme.textSecondary}
          />
        </HStack>
      </TouchableOpacity>

      <Modal
        visible={expanded}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          {layout && (
            <View
              style={{
                position: 'absolute',
                left: layout.x,
                top: layout.y + 44,
                width: layout.width,
                marginTop: 4,
                zIndex: 9999,
              }}
            >
              <View
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      backgroundColor: theme.cardBg,
                      borderWidth: 1,
                      borderColor: theme.cardBorder,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isDark ? 0.25 : 0.1,
                      shadowRadius: 12,
                      elevation: 8,
                    }}
                  >
                    {LANGUAGES.map((language, index) => {
                      const isSelected = locale === language.code;
                      return (
                        <TouchableOpacity
                          key={language.code}
                          onPress={() => handleLanguageChange(language.code)}
                          activeOpacity={0.7}
                          style={{
                            paddingVertical: 18,
                            paddingHorizontal: 20,
                            backgroundColor: isSelected
                              ? isDark
                                ? 'rgba(23, 23, 23, 0.3)'
                                : 'rgba(23, 23, 23, 0.08)'
                              : 'transparent',
                            borderTopWidth: index > 0 ? 1 : 0,
                            borderTopColor: theme.cardBorder,
                          }}
                        >
                          <HStack className="items-center gap-3">
                            <Text style={{ fontSize: 22 }}>{language.flag}</Text>
                            <VStack className="flex-1">
                              <Text
                                className="text-base font-semibold"
                                style={{ color: theme.textPrimary }}
                              >
                                {language.nativeName}
                              </Text>
                              <Text
                                className="text-sm"
                                style={{ color: theme.textSecondary }}
                              >
                                {language.name}
                              </Text>
                            </VStack>
                            {isSelected && (
                              <Ionicons
                                name="checkmark-circle"
                                size={24}
                                color={theme.buttonPrimary}
                              />
                            )}
                          </HStack>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
