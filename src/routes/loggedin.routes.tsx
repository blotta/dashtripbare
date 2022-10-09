import React from "react";
import { DrawerContentScrollView, DrawerItemList, DrawerItem, createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";

const Drawer = createDrawerNavigator();

export default function LoggedInRoutes() {
  return (
    <Drawer.Navigator initialRouteName="Home" >
      <Drawer.Screen name="Home" options={{ title: "Resumo" }} component={HomeScreen} />
    </Drawer.Navigator>
  );
}
