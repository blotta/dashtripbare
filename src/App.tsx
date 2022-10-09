import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import LoggedInRoutes from "./routes/loggedin.routes";
import NotLoggedInRoutes from "./routes/notloggedin.routes";

export default function App() {
  const user = true;
  return (
    <NavigationContainer>
      {user ? <LoggedInRoutes /> : <NotLoggedInRoutes />}
    </NavigationContainer>
  );
}
