import { View  } from "react-native";
import React from "react";
import {Text} from 'react-native-paper'

import Constants from "expo-constants";
import {getDistance} from 'geolib'

export default function HomeScreen() {
  const dist = getDistance(
    { latitude: 51.5103, longitude: 7.49347 },
    { latitude: "51° 31' N", longitude: "7° 28' E" }
  );
  console.log(dist);
  return (
    <View>
      <Text variant="headlineMedium">Open up App.js to start working on your app!</Text>
    </View>
  );
}
