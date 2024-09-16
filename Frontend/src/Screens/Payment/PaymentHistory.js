import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import FooterMenu from "../../Components/Menus/FooterMenu";

const PaymentHistoryScreen = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    // Fetch payment history from backend or storage
    // Example static data for now
    setPaymentHistory([
      {
        id: "1",
        date: "2024-08-28",
        amount: "$50.00",
        description: "Parking Fee at Mall A",
      },
      {
        id: "2",
        date: "2024-08-29",
        amount: "$30.00",
        description: "Parking Fee at Office Building B",
      },
      {
        id: "3",
        date: "2024-08-30",
        amount: "$20.00",
        description: "FastTag Recharge",
      },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      <FlatList
        data={paymentHistory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
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
  historyItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  date: { fontSize: 16, fontWeight: "bold" },
  description: { fontSize: 14, marginVertical: 5 },
  amount: { fontSize: 16, color: "green", fontWeight: "bold" },
});

export default PaymentHistoryScreen;
