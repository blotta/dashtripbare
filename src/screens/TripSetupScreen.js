import { View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { TRANSPORTS } from "../models/Transport";
import VehicleItem from "../components/VehicleItem";
import TransportIcon from "../components/TransportIcon";

export default function TripSetupScreen({ route }) {
  const navigation = useNavigation();
  // const route = useRoute();

  const [transport, setTransport] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("route params", route.params);
    if (!route.params?.transportType) {
      setTransport(null);
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
            setTransport(trans);
          });
      } else {
        setTransport(trans);
      }
    }
  }, [route.params?.transportType, route.params?.vehicleId]);

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <View style={{ marginVertical: 10 }}>
        <Text variant="titleMedium">Destino</Text>
        <TextInput />
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text variant="titleMedium">Meio de Transporte</Text>
      </View>

      <View style={{ flex: 1 }}>
        {transport && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TransportIcon
              transportType={transport.name}
              color="black"
              size={30}
            />
            {transport.vehicle && <Text>{transport.vehicle.name}</Text>}
            <Button
              mode="elevated"
              onPress={() => navigation.navigate("TransportSelect")}
            >
              selecione
            </Button>
          </View>
        )}

        {!transport && (
          <Button
            mode="elevated"
            onPress={() => navigation.navigate("TransportSelect")}
          >
            selecione
          </Button>
        )}
      </View>

      <Button uppercase mode="contained">
        Iniciar
      </Button>
    </View>
  );
}
