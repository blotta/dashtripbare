import { ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import Loading from "../components/Loading";
import TripItem from "../components/TripItem";

export default function TripsScreen() {
  const navigation = useNavigation();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection("trips")
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        setTrips(data);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <View style={{ flexDirection: "row-reverse" }}>
      </View>

      {loading && <Loading />}

      {!loading && trips && (
        <ScrollView>
          {trips.map((trip) => (
            <TripItem key={trip.id} item={trip} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
