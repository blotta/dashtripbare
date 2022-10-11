import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import {
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { AuthContextProvider } from "./context/AuthContext";
import Routes from "./routes";
import appTheme from './config/theme';

const theme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  ...appTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    ...appTheme.colors
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
