import { ScrollView, View } from "react-native";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuthContext } from "../hooks/useAuthContext";
import Loading from "../components/Loading";
import VehicleItem from "../components/VehicleItem";
import firestore from "@react-native-firebase/firestore";
import { Button, Chip, IconButton, Text } from "react-native-paper";
import TransportIcon, {
  iconNameForTrasport,
} from "../components/TransportIcon";

import { TRANSPORTS } from "../models/Transport";

const initialTypes = TRANSPORTS.map((t) => { return { ...t, hasVehicle: false}});

// const initialTypes = [
//   {
//     name: "Legs",
//     title: "Andando",
//     needVehicle: false,
//     hasVehicle: false,
//   },
//   {
//     name: "PublicTransport",
//     title: "Transporte Público",
//     needVehicle: false,
//     hasVehicle: false,
//   },
//   {
//     name: "Car",
//     title: "Carro",
//     needVehicle: true,
//     hasVehicle: false,
//   },
//   {
//     name: "Motorcycle",
//     title: "Moto",
//     needVehicle: true,
//     hasVehicle: false,
//   },
//   {
//     name: "Bicycle",
//     title: "Bicicleta",
//     needVehicle: true,
//     hasVehicle: false,
//   },
// ];

export default function TransportSelectModal() {
  const navigation = useNavigation();

  const { user } = useAuthContext();

  const [selectedType, setSelectedType] = useState("Car");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectTransport = () => {
    console.log(transport);
    navigation.navigate({
      name: 'TripSetup',
      params: { transportType: selectedType, vehicleId: selectedVehicleId },
      merge: true
    });
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection("vehicles")
      .where("userId", "==", user.uid)
      .where("active", "==", true)
      // .orderBy('created_at', 'desc')
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        setVehicles(data);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const transportTypes = useMemo(() => {
    const ret = [...initialTypes];
    if (vehicles) {
      for (let t of initialTypes) {
        const vt = vehicles.filter((v) => v.type == t.name);
        const idx = ret.findIndex((x) => x.name == t.name);
        ret[idx].hasVehicle = vt.length > 0;
      }
    }
    return ret;
  }, [vehicles]);

  // transport selected
  const transport = useMemo(() => {
    const ret = {
      ...transportTypes.find((t) => t.name === selectedType),
      vehicle: null,
    };
    if (selectedVehicleId) {
      ret.vehicle = { ...vehicles.find((v) => v.id === selectedVehicleId) };
    }
    return ret;
  }, [selectedType, selectedVehicleId, transportTypes]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {transportTypes.map((type) => (
          <IconButton
            selected={type.name == selectedType}
            // disabled={type.needVehicle && !type.hasVehicle}
            onPress={() => {
              setSelectedType(type.name);
              setSelectedVehicleId(null);
            }}
            icon={iconNameForTrasport(type.name)}
          />
        ))}
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text variant="headlineSmall" style={{ textAlign: "center" }}>
          {transportTypes.find((t) => t.name === selectedType).title}
        </Text>
        {selectedVehicleId && <VehicleItem item={transport.vehicle} selected />}
      </View>

      <View style={{ flex: 1 }}>
        {!transport.needVehicle && <View style={{ flex: 1 }}></View>}
        {transport.needVehicle && !transport.hasVehicle && (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text variant="bodyLarge" style={{ textAlign: "center" }}>
              Não há veículos para esta categoria.
            </Text>
            <Text variant="bodyLarge" style={{ textAlign: "center" }}>
              Registre um veículo antes de continuar
            </Text>
          </View>
        )}

        {transport.needVehicle && transport.hasVehicle && (
          <ScrollView>
            {vehicles
              .filter(
                (v) => v.type == selectedType && v.id !== selectedVehicleId
              )
              .map((v) => (
                <VehicleItem
                  key={v.id}
                  item={v}
                  buttonOptions={[
                    {
                      text: "selecionar",
                      cb: () => setSelectedVehicleId(v.id),
                    },
                  ]}
                />
              ))}
          </ScrollView>
        )}

        {((transport.needVehicle && transport.vehicle != null) ||
          !transport.needVehicle) && (
          <Button mode="contained" uppercase onPress={handleSelectTransport}>
            Continuar
          </Button>
        )}
      </View>
    </View>
  );
}
