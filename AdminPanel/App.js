import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./Navigation";
import React from "react";

const App = () => {
  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
};
export default App;
