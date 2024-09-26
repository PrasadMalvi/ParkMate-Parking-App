import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";
import FooterMenu from "../../Components/Menus/FooterMenu";

const WalletScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Screen</Text>
      <Text style={styles.balance}>Current Balance: $400</Text>
      <Button
        title="Add Money"
        onPress={() => navigation.navigate("PaymentScreen")}
      />
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: -10, paddingTop: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  balance: { fontSize: 20, marginBottom: 20 },
});

export default WalletScreen;
