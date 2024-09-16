import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import FooterMenu from "../../Components/Menus/FooterMenu";
import { BarCodeScanner } from "expo-barcode-scanner";

const MallParkingScreen = () => {
  const [isParked, setIsParked] = useState(false);
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    // Logic to handle scanned QR code data
  };

  const handlePunchIn = () => {
    setIsParked(true);
    // Logic for punch-in
  };

  const handlePunchOut = () => {
    setIsParked(false);
    // Logic for punch-out and payment
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {isParked ? "Vehicle is Parked" : "No Vehicle is Parked"}
      </Text>
      <Button
        title={isParked ? "Punch Out" : "Punch In"}
        onPress={isParked ? handlePunchOut : handlePunchIn}
      />
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  status: { fontSize: 20, marginBottom: 20 },
});

export default MallParkingScreen;
