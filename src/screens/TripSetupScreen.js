import { View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { TRANSPORTS } from "../models/Transport";
import TransportIcon from "../components/TransportIcon";
import MapSelection from "../components/MapSelection";

import * as Location from "expo-location";
import AddressSearch from "../components/AddressSearch";
import { useTrip } from "../context/TripManager";
import MapView, { Marker } from "react-native-maps";

export default function TripSetupScreen({ route }) {
  const navigation = useNavigation();

  const { trip, dispatchTrip } = useTrip();
  // console.log(JSON.stringify(trip, null, 2));

  const handleStartTripPress = () => {
    navigation.navigate("TripDuring");
  }

  async function startLoc() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      throw new Error("Permission to access location was denied");
    }
  }

  function gpsToAppLocation(pos, address) {
    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    let location = {
      formatted_address: "",
      description: "(localização atual)",
      address,
      coords,
      geometry: {
        location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      },
    };
    location = JSON.parse(JSON.stringify(location));
    return location;
  }

  useEffect(() => {
    async function sl() {
      try {
        await startLoc();
        const pos = await Location.getCurrentPositionAsync();
        const address = await Location.reverseGeocodeAsync(pos.coords);
        const location = gpsToAppLocation(pos, address);
        // console.log("gpsLocation", location);
        dispatchTrip("SET_CURRENT_COORDS", location.coords);
        dispatchTrip("SET_ORIGIN", location);
      } catch (err) {
        console.error("gpsLocation", err);
      }
    }
    sl();
  }, []);

  useEffect(() => {
    if (!route.params?.transportType) {
      dispatchTrip("SET_TRANSPORT", null);
    } else {
      const trans = {
        ...TRANSPORTS.find((t) => t.name == route.params.transportType),
        vehicle: null,
      };
      if (route.params?.vehicleId) {
        firestore()
          .collection("vehicles")
          .doc(route.params.vehicleId)
          .get()
          .then((snap) => {
            trans.vehicle = { ...snap.data(), id: snap.id };
            dispatchTrip("SET_TRANSPORT", trans);
          });
      } else {
        dispatchTrip("SET_TRANSPORT", trans);
      }
    }
  }, [route.params?.transportType, route.params?.vehicleId]);

  const region = useMemo(() => {
    const ret = {
      latitude: -23.56387116203152,
      longitude: -46.65244831533241,
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    };
    if (trip.origin && trip.destination) {
      let o = trip.origin.coords;
      let d = trip.destination.coords;
      ret.latitude = (o.lat + d.lat) / 2;
      ret.longitude = (o.lng + d.lng) / 2;
      ret.latitudeDelta = Math.abs(o.lat - d.lat) + 0.01;
      ret.longitudeDelta = Math.abs(o.lng - d.lng) + 0.01;
    } else if (trip.origin) {
      ret.latitude = trip.origin.coords.lat;
      ret.longitude = trip.origin.coords.lng;
    } else if (trip.destination) {
      ret.latitude = trip.destination.coords.lat;
      ret.longitude = trip.destination.coords.lng;
    } else if (trip.currentCoords) {
      ret.latitude = trip.currentCoords.lat;
      ret.longitude = trip.currentCoords.lng;
    }
    return ret;
  }, [trip]);

  const markers = useMemo(() => {
    const ret = [];
    if (trip.origin) {
      ret.push({
        id: "origin",
        title: "Origem",
        coords: {
          latitude: trip.origin.coords.lat,
          longitude: trip.origin.coords.lng,
        },
      });
    }
    if (trip.destination) {
      ret.push({
        id: "destination",
        title: "Destino",
        coords: {
          latitude: trip.destination.coords.lat,
          longitude: trip.destination.coords.lng,
        },
      });
    }
    return ret;
  }, [trip]);

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <Text variant="titleMedium">Meio de Transporte</Text>
        <View>
          {trip.transport && (
            <Button
              mode="elevated"
              style={{
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
              onPress={() => navigation.navigate("TransportSelect")}
            >
              <TransportIcon
                transportType={trip.transport.name}
                color="black"
                size={20}
              />
              <Text>
                {trip.transport.vehicle?.name || trip.transport.title}
              </Text>
            </Button>
          )}
        </View>

        {!trip.transport && (
          <Button
            mode="elevated"
            onPress={() => navigation.navigate("TransportSelect")}
          >
            selecione
          </Button>
        )}
      </View>

      <View style={{ marginVertical: 5 }}>
        <Text variant="titleMedium">Origem</Text>
        <AddressSearch
          placeholder={trip.origin?.description}
          onPress={(location) => dispatchTrip("SET_ORIGIN", location)}
        />
      </View>

      <View style={{ marginVertical: 5 }}>
        <Text variant="titleMedium">Destino</Text>
        <AddressSearch
          placeholder={trip.destination?.description}
          onPress={(location) => dispatchTrip("SET_DESTINATION", location)}
        />
      </View>

      <View
        style={{
          flex: 1,
          marginVertical: 10,
          borderWidth: 3,
          borderRadius: 5,
          borderColor: "gray",
        }}
      >
        {/* <MapSelection markers={[]} /> */}
        {region && (
          <MapView
            style={{ width: "100%", height: "100%" }}
            region={region}
            // onRegionChange={(p) => console.log(p)}
          >
            {markers.map((m) => (
              <Marker key={m.id} coordinate={m.coords} title={m.title} />
            ))}
          </MapView>
        )}
      </View>

      <View>
        <Button
          uppercase
          mode="contained"
          disabled={!(trip.transport && trip.origin && trip.destination)}
          onPress={handleStartTripPress}
        >
          Iniciar
        </Button>
      </View>
    </View>
  );
}
