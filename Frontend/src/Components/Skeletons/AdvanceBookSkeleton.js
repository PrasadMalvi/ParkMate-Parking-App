import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

const AdvanceBookSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Search Bar Skeleton */}
      <TextInput
        style={[styles.skeleton, styles.searchInput]}
        placeholder=""
        editable={false}
      />
      {/* Rounded Text Skeleton */}
      <View style={[styles.skeleton, styles.roundedText]}></View>
      {/* Centered Skeletons */}
      <View style={styles.centered}>
        <View style={[styles.skeleton, styles.line]}></View>
        <View style={[styles.skeleton, styles.line]}></View>
      </View>
      {/* List Skeletons */}
      <View style={styles.list}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.listItem}>
            <View style={[styles.skeleton, styles.listLine]}></View>
            <View style={[styles.skeleton, styles.listLineShort]}></View>
            <View style={[styles.skeleton, styles.button]}></View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#021218",
    padding: 20,
  },
  skeleton: {
    backgroundColor: "#2c3e50",
    borderRadius: 8,
    overflow: "hidden",
  },
  searchInput: {
    height: 40,
    marginBottom: 20,
    borderRadius: 5,
    width: "100%",
  },
  roundedText: {
    height: 25,
    width: 120,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: "center",
  },
  centered: {
    alignItems: "center",
    marginBottom: 30,
  },
  line: {
    height: 20,
    width: 180,
    marginBottom: 10,
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
  listItem: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#2c3e50",
  },
  listLine: {
    height: 15,
    width: "70%",
    marginBottom: 10,
  },
  listLineShort: {
    height: 15,
    width: "50%",
    marginBottom: 20,
  },
  button: {
    height: 40,
    width: 100,
    alignSelf: "flex-start",
  },
});

export default AdvanceBookSkeleton;
