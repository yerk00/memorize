import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type AppIntroProps = {
  onFinish: () => void;
};

export function AppIntro({ onFinish }: AppIntroProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const finishedRef = useRef(false);
//const end= useRef(true);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    Animated.timing(opacity, {
      toValue: 0,
      duration: 450,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  useEffect(() => {
    const fallback = setTimeout(finish, 4200);

    return () => clearTimeout(fallback);
  }, []);

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <View style={styles.content}>
        <LottieView
          source={require('../../../assets/lottie/intro.json')}
          autoPlay
          loop={false}
          speed={0.55} 
          resizeMode="contain"
          style={styles.animation}
          onAnimationFinish={finish}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:'#F8F6F3',
    zIndex: 999,
    elevation: 999,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 300,
    height: 300,
  },
});