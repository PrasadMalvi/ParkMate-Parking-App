// RootNavigation.js
import React from "react";
import { AuthProvider } from "./src/Context/AuthContext";
import AdminScreenMenu from "./src/Components/Menus/AdminScreenMenu";

const RootNavigation = () => {
  return (
    <AuthProvider>
      <AdminScreenMenu />
    </AuthProvider>
  );
};

export default RootNavigation;
