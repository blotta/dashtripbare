import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { Drawer } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLogout } from "../hooks/appAuth";

const DrawerNav = createDrawerNavigator();

export default function LoggedInRoutes() {
  const {logout } = useLogout();
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
    </DrawerNav.Navigator>
  );
}
