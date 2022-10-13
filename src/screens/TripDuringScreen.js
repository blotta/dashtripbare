import { View } from "react-native";
import React, { useMemo, useState } from "react";
import { Button, Divider, IconButton, Menu, Text } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { useTrip } from "../context/TripManager";
import TransportIcon from "../components/TransportIcon";

export default function TripDuringScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { trip } = useTrip();
  console.log(JSON.stringify(trip, null, 2));

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

  const handleUserLocationChange = (gps) => {
    console.log(gps.nativeEvent.coordinate);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 6, backgroundColor: "blue" }}>
        {/* <Text>ok</Text> */}
        <MapView
          style={{ width: "100%", height: "100%" }}
          region={region}
          showsUserLocation={true}
          onUserLocationChange={handleUserLocationChange}
        >
          {markers.map((m) => (
            <Marker key={m.id} coordinate={m.coords} title={m.title} />
          ))}
        </MapView>
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            padding: 10,
            borderTopWidth: 3,
            borderTopColor: "gray",
          }}
        >
          <View style={{ flex: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TransportIcon
                transportType={trip.transport.name}
                size={30}
                color="#333"
              />
              <Text variant="headlineMedium" style={{ marginLeft: 10 }}>
                00:03:34
              </Text>
            </View>
            <Text>{trip.destination.description}</Text>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Menu
              visible={menuOpen}
              onDismiss={() => setMenuOpen(false)}
              anchor={
                <IconButton
                  onPress={() => setMenuOpen((p) => !p)}
                  icon="menu"
                  size={40}
                />
              }
            >
              <Menu.Item title="Encerrar" />
            </Menu>
          </View>
        </View>
      </View>
    </View>
  );
}
