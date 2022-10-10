import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import LoggedInRoutes from "./routes/loggedin.routes";
import NotLoggedInRoutes from "./routes/notloggedin.routes";
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import {
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { AuthContextProvider } from "./context/AuthContext";
import Routes from "./routes";


const theme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: "#28c",
    secondary: "#ff3",
  },
};

export default function App() {
  return (
    <AuthContextProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Routes />
        </NavigationContainer>
      </PaperProvider>
    </AuthContextProvider>
  );
}
