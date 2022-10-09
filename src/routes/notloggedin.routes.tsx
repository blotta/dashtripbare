
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';

const Drawer = createDrawerNavigator();

export default function NotLoggedInRoutes() {
  return (
    <Drawer.Navigator initialRouteName="Login">
      <Drawer.Screen name="Login" options={{ title: "Login", headerShown: false }} component={LoginScreen} />
    </Drawer.Navigator>
  )
}