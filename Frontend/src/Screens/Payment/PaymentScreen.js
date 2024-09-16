import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import FooterMenu from "../../Components/Menus/FooterMenu";

const PaymentScreen = () => {
  const [walletBalance, setWalletBalance] = useState(500); // Example balance

  const handleAddMoney = () => {
    // Logic to add money
  };

  return (
    <View style={styles.container}>
      <Text style={styles.balance}>Wallet Balance: ${walletBalance}</Text>
      <Button title="Add Money" onPress={handleAddMoney} />
      <Text style={styles.fastag}>Fastag Balance: $200</Text>
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  balance: { fontSize: 20, marginBottom: 20 },
  fastag: { fontSize: 18, color: "green" },
});

export default PaymentScreen;
