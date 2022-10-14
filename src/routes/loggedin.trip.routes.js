import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TripSetupScreen from "../screens/TripSetupScreen";
import TransportSelectModal from "../screens/TransportSelectModal";
import { TripProvider } from "../context/TripManager";
import TripDuringScreen from "../screens/TripDuringScreen";
import TripDetailsScreen from "../screens/TripDetailsScreen";

const Stack = createNativeStackNavigator();

export default function LoggedInTripRoutes() {
  return (
    <TripProvider>
      <Stack.Navigator initialRouteName="TripSetupScreen">
        <Stack.Group>
          <Stack.Screen
            name="TripSetup"
            options={{
              title: "Novo Percurso",
            }}
            component={TripSetupScreen}
          />
          <Stack.Screen
            name="TripDuring"
            options={{
              title: "Durante o Percurso",
              headerShown: false
            }}
            component={TripDuringScreen}
          />
          <Stack.Screen
            name="TripDetails"
            options={{
              title: "Detalhes do Percurso",
            }}
            component={TripDetailsScreen}
          />
        </Stack.Group>

        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            name="TransportSelect"
            options={{
              title: "Meio de Transporte",
            }}
            component={TransportSelectModal}
          />
        </Stack.Group>
      </Stack.Navigator>
    </TripProvider>
  );
}
