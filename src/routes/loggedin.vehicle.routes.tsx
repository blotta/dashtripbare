import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import VehiclesScreen from '../screens/VehiclesScreen';
import VehicleFormScreen from '../screens/VehicleFormScreen';

const Stack = createNativeStackNavigator();

export default function LoggedInVehicleRoutes() {
  return (
    <Stack.Navigator initialRouteName='Vehicles'>
      <Stack.Screen name='Vehicles' options={{
        title: "Veículos",
        headerShown: false
      }} component={VehiclesScreen} />

      <Stack.Screen name='VehicleForm' options={{
        title: "Veículo",
        headerShown: false
      }} component={VehicleFormScreen} />
    </Stack.Navigator>
  )
}