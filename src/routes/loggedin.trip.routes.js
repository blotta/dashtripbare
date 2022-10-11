import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TripSetupScreen from "../screens/TripSetupScreen";
import TransportSelectModal from "../screens/TransportSelectModal";

const Stack = createNativeStackNavigator();

export default function LoggedInTripRoutes() {
  return (
    <Stack.Navigator initialRouteName="TripSetupScreen">
      <Stack.Group>
        <Stack.Screen
          name="TripSetup"
          options={{
            title: "Novo Percurso",
          }}
          component={TripSetupScreen}
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
  );
}
