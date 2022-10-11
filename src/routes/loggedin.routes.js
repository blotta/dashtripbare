import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
  DrawerScreenProps,
} from "@react-navigation/drawer";
import { Drawer, IconButton } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLogout } from "../hooks/appAuth";
import TripsScreen from "../screens/TripsScreen";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";
import LoggedInVehicleRoutes from "./loggedin.vehicle.routes";
import LoggedInTripRoutes from "./loggedin.trip.routes";


const DrawerNav = createDrawerNavigator();

export default function LoggedInRoutes() {
  const { logout } = useLogout();
  return (
    <DrawerNav.Navigator
      initialRouteName="Home"
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <Drawer.Section title="DashTrip">
              <DrawerItemList {...props} />
            </Drawer.Section>
            <DrawerItem
              label="Sair"
              onPress={logout}
              icon={({ color, size }) => (
                <MaterialIcons name="logout" color={color} size={size} />
              )}
            />
          </DrawerContentScrollView>
        );
      }}
      // screenOptions={(props) => {
      //   const routeName = getFocusedRouteNameFromRoute(props.route) ?? 'DashTrip'
      //   return {...props, headerTitle: routeName}
      // }}
      // screenOptions={{headerShown: }}
    >
      <DrawerNav.Screen
        name="Home"
        options={{
          title: "Resumo",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
        component={HomeScreen}
      />
      <DrawerNav.Screen
        name="Trips"
        options={{
          title: "Percursos",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="road-variant"
              color={color}
              size={size}
            />
          ),
        }}
        component={TripsScreen}
      />
      <DrawerNav.Screen
        name="TripRoutes"
        component={LoggedInTripRoutes}
        options={{
          headerShown: false,
          title: "Novo Percurso",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons
              name="add-road"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <DrawerNav.Screen
        name="VehicleRoutes"
        component={LoggedInVehicleRoutes}
        options={{
          title: "Veículos",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="car-estate"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </DrawerNav.Navigator>
  );
}
