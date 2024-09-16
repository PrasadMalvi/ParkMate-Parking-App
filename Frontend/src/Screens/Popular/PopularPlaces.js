import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import React from "react";
import FooterMenu from "../../Components/Menus/FooterMenu";

const popularPlacesData = [
  {
    id: "1",
    name: "Central Park",
    location: "New York, USA",
    imageUrl: "https://example.com/central-park.jpg",
  },
  {
    id: "2",
    name: "Eiffel Tower",
    location: "Paris, France",
    imageUrl: "https://example.com/eiffel-tower.jpg",
  },
  // Add more popular places here
];

const PopularPlaces = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Places</Text>
      <FlatList
        data={popularPlacesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.placeItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        )}
      />
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  placeItem: { marginBottom: 20, alignItems: "center" },
  image: { width: 200, height: 150, borderRadius: 10 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  location: { fontSize: 16, color: "gray" },
});

export default PopularPlaces;
