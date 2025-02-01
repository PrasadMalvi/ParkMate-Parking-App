import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const ConfirmBookSkeleton = () => {
  // Shared animation value
  const shimmer = useSharedValue(0);

  // Shimmer effect
  React.useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1, // infinite repeat
      true // reverse
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return (
    <View style={styles.container}>
      {/* Placeholder for an image */}
      <Animated.View
        style={[styles.placeholder, styles.largeBox, animatedStyle]}
      />
      {/* Placeholder for a title */}
      <Animated.View
        style={[styles.placeholder, styles.mediumBox, animatedStyle]}
      />
      {/* Placeholder for a subtitle */}
      <Animated.View
        style={[styles.placeholder, styles.smallBox, animatedStyle]}
      />
      {/* Placeholder for label and input fields */}
      <View style={styles.inputGroup}>
        <Animated.View
          style={[styles.placeholder, styles.label, animatedStyle]}
        />
        <Animated.View
          style={[styles.placeholder, styles.input, animatedStyle]}
        />
      </View>
      <View style={styles.inputGroup}>
        <Animated.View
          style={[styles.placeholder, styles.label, animatedStyle]}
        />
        <Animated.View
          style={[styles.placeholder, styles.input, animatedStyle]}
        />
      </View>
      {/* Placeholder for buttons */}
      <Animated.View
        style={[styles.placeholder, styles.button, animatedStyle]}
      />
      <Animated.View
        style={[styles.placeholder, styles.button, animatedStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFFFFF", // Background color
  },
  placeholder: {
    backgroundColor: "#e0e0e0", // Base color of skeleton
    borderRadius: 10,
    marginBottom: 15,
  },
  largeBox: {
    height: 150,
    width: "100%",
  },
  mediumBox: {
    height: 20,
    width: "60%",
    alignSelf: "center",
  },
  smallBox: {
    height: 16,
    width: "40%",
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    height: 14,
    width: "50%",
    marginBottom: 5,
  },
  input: {
    height: 50,
    width: "100%",
  },
  button: {
    height: 50,
    width: "100%",
    alignSelf: "center",
  },
});

export default ConfirmBookSkeleton;
