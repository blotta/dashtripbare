import { View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TRANSPORTS } from "../models/Transport";
import TransportIcon from "../components/TransportIcon";
import MapSelection from "../components/MapSelection";

import * as Location from "expo-location";
import AddressSearch from "../components/AddressSearch";
import { calcRegion, tripMarkers, useTrip } from "../context/TripManager";
import MapView, { Marker } from "react-native-maps";
import firestore from "@react-native-firebase/firestore";
import { useAuthContext } from "../hooks/useAuthContext";

export default function TripSetupScreen({ route }) {
  const navigation = useNavigation();
  const { user } = useAuthContext();

  const { trip, dispatchTrip } = useTrip();
  // console.log(JSON.stringify(trip, null, 2));

  const handleStartTripPress = async () => {
    const transport = { ...trip.transport };
    if (transport.vehicle) {
      transport.vehicle = await firestore()
        .collection("vehicles")
        .doc(transport.vehicle.id);
    }
    const ftrip = {
      ...trip,
      userId: user.uid,
      status: "started",
      created_at: firestore.FieldValue.serverTimestamp(),
      transport: transport,
    };
    const doc = await firestore().collection("trips").add(ftrip);

    const snap = await doc.get();
    const data = await snap.data();
    console.log('doc data', data);

    dispatchTrip("START_TRIP", {
      id: doc.id,
      created_at: data.created_at.toDate(),
      status: data.status,
      // vvvvv: await (await data.transport.vehicle.get()).data()
    });

    navigation.navigate("TripDuring");
  };

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
        if (!trip.origin) {
          dispatchTrip("SET_ORIGIN", location);
        }
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
    return calcRegion(trip);
  }, [trip]);

  const markers = useMemo(() => {
    return tripMarkers(trip);
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
