import React from "react";
import { View, StyleSheet } from "react-native";

const ViewQRSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.skeletonBlock}>
        <View style={[styles.skeleton, styles.title]}></View>
        <View style={[styles.skeleton, styles.subTitle]}></View>
        <View style={[styles.skeleton, styles.text]}></View>
        <View style={[styles.skeleton, styles.text]}></View>
        <View style={[styles.skeleton, styles.text]}></View>
        <View style={[styles.skeleton, styles.button]}></View>
        <View style={[styles.skeleton, styles.qrCode]}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#021218",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonBlock: {
    width: "100%",
    alignItems: "center",
  },
  skeleton: {
    backgroundColor: "#2c3e50",
    borderRadius: 8,
    marginBottom: 15,
    width: "90%",
  },
  title: {
    height: 30,
    width: "80%",
  },
  subTitle: {
    height: 20,
    width: "60%",
  },
  text: {
    height: 15,
    width: "90%",
  },
  button: {
    height: 40,
    width: "50%",
  },
  qrCode: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});

export default ViewQRSkeleton;
