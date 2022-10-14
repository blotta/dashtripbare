import { View, Dimensions } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text } from "react-native-paper";

import Constants from "expo-constants";
import { getDistance } from "geolib";
import { ProgressChart, PieChart, LineChart } from "react-native-chart-kit";
import { chartConfig } from "../config/chart";
import firestore from "@react-native-firebase/firestore";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { colorForTransport, titleForTransport, transportKeysAll } from "../models/Transport";
import Loading from "../components/Loading";
import useMoment from "../hooks/useMoment";

export default function HomeScreen() {
  const { user } = useAuthContext();
  const { moment } = useMoment();
  const data = {
    labels: ["Swim", "Bike", "Run"], // optional
    data: [0.4, 0.6, 8],
  };

  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState();

  useEffect(() => {
    setLoading(true);
    async function loadData() {
      const query = await firestore()
        .collection("trips")
        .where("userId", "==", user.uid)
        .get();
      const data = query.docs.map((doc) => {
        const d = doc.data();
        return {
          ...d,
          id: doc.id,
          created_at: d.created_at.toDate(),
          finished_at: d.finished_at.toDate(),
        };
      });
      setTrips(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const dashData = useMemo(() => {
    if (!trips) {
      return null;
    }
    // const data = {
    //   labels: ["Swim", "Bike", "Run"], // optional
    //   data: [0.4, 0.6, 0.8],
    // };

    const ret = {};
    for (let k of transportKeysAll()) {
      ret[k] = { label: titleForTransport(k), items: [] };
    }

    for (let trip of trips) {
      ret[trip.transport.name].items.push(trip);
    }

    const pieList = [];
    for (let [key, value] of Object.entries(ret)) {
      // console.log(key);
      let time = 0;
      value.time = value.items.reduce((acc, curr) => {
        const min = moment(curr.finished_at || new Date()).diff(
          curr.created_at,
          "seconds"
        );
        // console.log(key, min);
        return acc + min;
      }, time);

      pieList.push({
        name: value.label,
        time: moment(value.time),
        color: colorForTransport(key),
        legendFontColor: "#aaa",
        legendFontSize: 15,
      });
    }
    // console.log(pieList);


    return pieList;
  }, [trips]);


  // useFocusEffect(useCallback(() => resetStack, []));

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Text variant="displaySmall" style={{ marginVertical: 10 }}>
        DashTrip
      </Text>
      <PieChart
        data={dashData}
        width={Dimensions.get("window").width - 20}
        height={220}
        chartConfig={chartConfig}
        accessor={"time"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 20]}
        absolute
      />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text variant="titleLarge">Bem vindo!</Text>
        <Text variant="titleMedium">Inicie um percurso para popular os dados</Text>
      </View>
    </View>
  );
}
