import { View, Image, ScrollView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Divider, Text } from "react-native-paper";
import Loading from "../components/Loading";
import firestore from "@react-native-firebase/firestore";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import TransportIcon from "../components/TransportIcon";
import useMoment from "../hooks/useMoment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getStatus } from "../models/Trip";

export default function TripDetailsScreen({ route }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { moment } = useMoment();
  const [trip, setTrip] = useState(null);

  function resetStack() {
    console.log("resseting stack");
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Home" }, { name: "Trips" }],
      })
    );
  }

  useFocusEffect(useCallback(() => resetStack, []));

  useEffect(() => {
    async function loadData() {
      console.log("fetching tripId", route.params?.tripId);
      if (!route.params?.tripId) {
        console.log("tripId not found");
        return;
      }
      const doc = await firestore()
        .collection("trips")
        .doc(route.params.tripId);
      const snap = await doc.get();
      const data = await snap.data();
      const ret = {
        ...data,
        id: doc.id,
      };
      if (ret.transport.vehicle) {
        const vdoc = await firestore()
          .collection("vehicles")
          .doc(ret.transport.vehicle.id);
        const vsnap = await vdoc.get();
        ret.transport.vehicle = {
          ...(await vsnap.data()),
          id: vdoc.id,
        };
      }
      setTrip(ret);
    }
    loadData();
  }, [route.params?.tripId]);

  useEffect(() => {
    if (trip) {
      setLoading(false);
    }
  }, [trip]);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={{ padding: 10, flex: 1 }}>
      <View>
        <Image
          style={{ width: "100%", height: 200, resizeMode: "cover" }}
          source={{ uri: "https://picsum.photos/700" }}
        />
      </View>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <TransportIcon
              transportType={trip.transport.name}
              size={30}
              color="#555"
            />
            <Text variant="titleLarge" style={{ marginLeft: 10 }}>
              {moment(trip.created_at.toDate()).to(
                trip.finished_at?.toDate() || new Date(),
                true
              )}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ marginRight: 10 }}>
              {moment().to(moment(trip.created_at.toDate()))}
            </Text>
            <MaterialCommunityIcons name="clock-outline" size={20} />
          </View>
        </View>
        <View>
          <Text variant="bodyLarge" style={{ textAlign: "right" }}>
            {getStatus(trip.status)}
          </Text>
          <Divider
            style={{
              backgroundColor: "#777",
              height: 2,
              marginVertical: 5,
            }}
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text variant="titleSmall">Origem</Text>
          <Text variant="titleMedium">{trip.origin.description}</Text>
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text variant="titleSmall">Destino</Text>
          <Text variant="titleMedium">{trip.destination.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
