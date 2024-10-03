import React from "react";
import { AuthProvider } from "./src/Context/AuthContext";
import ScreenMenu from "./src/Components/Menus/ScreenMenu";

const RootNavigation = () => {
  return (
    <AuthProvider>
      <ScreenMenu />
    </AuthProvider>
  );
};

export default RootNavigation;
