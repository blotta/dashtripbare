import { FlatList, ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useNavigation } from "@react-navigation/native";
import { IconButton, Text, Button } from "react-native-paper";

import firestore from "@react-native-firebase/firestore";
import Loading from "../components/Loading";
import VehicleItem from "../components/VehicleItem";
import { useAuthContext } from "../hooks/useAuthContext";

export default function VehiclesScreen() {
  const navigation = useNavigation();

  const { user } = useAuthContext();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection("vehicles")
      .where("userId", "==", user.uid)
      .where("active", "==", true)
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

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <View style={{ flexDirection: "row-reverse" }}>
        <Button uppercase onPress={() => navigation.navigate("VehicleForm")}>
          Adicionar
        </Button>
      </View>

      {loading && <Loading />}

      {!loading && vehicles && (
        <ScrollView>
          {vehicles.map((vehicle) => (
            <VehicleItem
              key={vehicle.id}
              item={vehicle}
              buttonOptions={[
                {
                  text: "Editar",
                  cb: () =>
                    navigation.navigate("VehicleForm", {
                      vehicleId: vehicle.id,
                    }),
                },
              ]}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
