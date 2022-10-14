import { ScrollView, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Button, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import Loading from "../components/Loading";
import TripItem from "../components/TripItem";
import { useAuthContext } from "../hooks/useAuthContext";

export default function TripsScreen() {
  const navigation = useNavigation();
  const { user } = useAuthContext();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   const unsubscribe = firestore()
  //     .collection("trips")
  //     .where("userId", "==", user.uid)
  //     // .orderBy('created_at')
  //     .onSnapshot((querySnapshot) => {
  //       console.log("trips docs", querySnapshot.docs);
  //       const data = querySnapshot.docs.map((doc) => {
  //         return {
  //           ...doc.data(),
  //           id: doc.id,
  //         };
  //       });

  //       setTrips(data);
  //       setLoading(false);
  //     });

  //   return () => unsubscribe();
  // }, []);

  function resetStack() {
    console.log("resseting stack");
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Home" }, { name: "Trips" }],
      })
    );
  }

  // replacing useEffect
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const unsubscribe = firestore()
        .collection("trips")
        .where("userId", "==", user.uid)
        // .orderBy('created_at')
        .onSnapshot((querySnapshot) => {
          // console.log("trips docs", querySnapshot.docs);
          const data = querySnapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id,
            };
          });

          setTrips(data);
          setLoading(false);
        });
      return () => {
        console.log('unsub');
        unsubscribe();
      }
    }, [])
  );

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <View style={{ flexDirection: "row-reverse" }}></View>

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
