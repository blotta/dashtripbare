import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Platform, Text, View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";

import * as Location from "expo-location";

const initialLocation = {
  latitude: -23.56387116203152,
  longitude: -46.65244831533241,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapSelection({ markers }) {

  if (!markers?.length) {
    markers = [initialLocation];
  }

  let lat = markers.reduce((acc, m) => acc + m.lat, 0) / markers.length;
  let lng = markers.reduce((acc, m) => acc + m.lng, 0) / markers.length;
  const r = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }
  console.log('new region', r);

  // useEffect(() => {
  //   async function loc() {
  //     console.log("starting");
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }

  //     try {
  //       let pos = await Location.getCurrentPositionAsync({});
  //       console.log(pos);
  //       setLocation({
  //         ...location,
  //         latitude: pos.coords.latitude,
  //         longitude: pos.coords.longitude,
  //       });
  //     } catch (err) {
  //       console.log(err);
  //       setErrorMsg(err.message);
  //     }
  //   }
  //   loc();
  // }, []);


  // let text = "Waiting..";
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  // }
  // console.log(text);

  // talvez tirar o mapview

  return (
    <MapView
      style={{ width: "100%", height: "100%" }}
      initialRegion={initialLocation}
      // region={r}
      showsUserLocation={true}
    ></MapView>
  );
}
