
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

// const Drawer = createDrawerNavigator();
const StackNav = createNativeStackNavigator();

export default function NotLoggedInRoutes() {
  return (
    <StackNav.Navigator initialRouteName="Login">
      <StackNav.Screen name="Login" options={{ title: "Login", headerShown: false }} component={LoginScreen} />
      <StackNav.Screen name="Signup" options={{ title: "Regitrar", headerShown: false }} component={SignupScreen} />
    </StackNav.Navigator>
  )
}