import React from "react";
import { View, StyleSheet } from "react-native";

const HomeSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={[styles.header, styles.skeleton]} />

      {/* Parking Location Skeleton */}
      <View style={[styles.parkingLocation, styles.skeleton]} />

      {/* History Section Skeleton */}
      <View style={styles.historySection}>
        {/* Search Bar Skeleton */}
        <View style={[styles.searchBar, styles.skeleton]} />

        {/* Footer Menu Skeleton */}
        <View style={styles.footerMenu}>
          {[...Array(3)].map((_, index) => (
            <View key={index} style={[styles.footerItem, styles.skeleton]} />
          ))}
        </View>

        {/* History Header Skeleton */}
        <View style={styles.historyHeader}>
          <View style={[styles.historyTitle, styles.skeleton]} />
          <View style={[styles.viewMore, styles.skeleton]} />
        </View>

        {/* History Items Skeleton */}
        {[...Array(3)].map((_, index) => (
          <View key={index} style={[styles.historyItem, styles.skeleton]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1b262f",
  },
  skeleton: {
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  header: {
    height: 50,
    marginBottom: 20,
  },
  parkingLocation: {
    height: 150,
    marginBottom: 20,
  },
  historySection: {
    flex: 1,
  },
  searchBar: {
    height: 40,
    marginBottom: 20,
  },
  footerMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  footerItem: {
    width: 60,
    height: 60,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  historyTitle: {
    width: 100,
    height: 20,
  },
  viewMore: {
    width: 80,
    height: 20,
  },
  historyItem: {
    height: 60,
    marginBottom: 10,
  },
});

export default HomeSkeleton;
