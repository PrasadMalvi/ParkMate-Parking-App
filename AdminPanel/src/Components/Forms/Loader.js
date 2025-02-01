import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

const Loader = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000, // Adjust the duration for slower/faster spinning
        useNativeDriver: true,
      })
    );

    spinAnimation.start();

    return () => spinAnimation.stop(); // Clean up the animation on unmount
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Spin from 0 to 360 degrees
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loader, { transform: [{ rotate: spin }] }]}>
        {/* Additional content (if needed) */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    width: 100,
    height: 100,
    borderRadius: 50, // Fully circular loader
    borderWidth: 10,
    borderColor: "#d3d3d3", // Lighter color for most of the loader
    borderTopColor: "#096c90", // Darker top color for spinning effect
  },
});

export default Loader;
