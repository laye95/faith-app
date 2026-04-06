import { Image } from 'expo-image';
import { View } from 'react-native';

export function FaithHeroBanner() {
  return (
    <View style={{ alignItems: 'flex-start', paddingTop: 8 }}>
      <Image
        source={require('@/assets/images/logo_full.png')}
        style={{ width: 180, height: 48 }}
        contentFit="contain"
      />
    </View>
  );
}
