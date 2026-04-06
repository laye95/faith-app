import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const DOT_COUNT = 8;
const CONTAINER = 96;
const RADIUS = 36;
const DOT_SIZE = 8;

const OPACITIES = [1, 0.75, 0.55, 0.38, 0.25, 0.16, 0.1, 0.14];

export function DottedRingSpinner() {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 880,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[styles.ring, { transform: [{ rotate: rotation }] }]}
      >
        {OPACITIES.map((opacity, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / DOT_COUNT;
          const cx = CONTAINER / 2 + RADIUS * Math.cos(angle) - DOT_SIZE / 2;
          const cy = CONTAINER / 2 + RADIUS * Math.sin(angle) - DOT_SIZE / 2;
          return (
            <View
              key={i}
              style={[styles.dot, { left: cx, top: cy, opacity }]}
            />
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: CONTAINER,
    height: CONTAINER,
  },
  ring: {
    width: CONTAINER,
    height: CONTAINER,
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#FFFFFF',
  },
});
