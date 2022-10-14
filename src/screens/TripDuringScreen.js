import { View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Divider, IconButton, Menu, Text } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useTrip,
  calcRegion,
  tripMarkers,
  consolidateEvents,
} from "../context/TripManager";
import TransportIcon from "../components/TransportIcon";
import useMoment from "../hooks/useMoment";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { getDistance, getSpeed } from "geolib";

export default function TripDuringScreen() {
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { moment } = useMoment();

  const { trip, dispatchTrip } = useTrip();
  // console.log(JSON.stringify(trip, null, 2));
  const [distanceText, setDistanceText] = useState("");
  const events = useRef([]);

  const navigateToTripDetails = (id) => {
    navigation.navigate("TripRoutes", {
      screen: 'TripDetails',
      params: { tripId: id }
    })
  }

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
    async function finalize() {
      const stats = consolidateEvents(events.current);
      await firestore()
        .collection("trips")
        .doc(trip.id)
        .update({ stats: stats });

      navigation.reset({
        index: 1,
        routes: [{ name: "Home" }, { name: "Trips" }],
      });
      // navigation.getParent().navigate("Trips");
      dispatchTrip("RESET");
    }
    if (trip.status !== "started") {
      finalize();
    }
  }, [trip.status]);

  const region = useMemo(() => {
    return calcRegion(trip);
  }, [trip]);

  const markers = useMemo(() => {
    return tripMarkers(trip);
  }, [trip]);

  const [elapsedTime, seteElapsedTime] = useState(trip.created_at);

  useEffect(() => {
    const interval = setInterval(() => {
      seteElapsedTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [trip]);

  const [lastUpdate, setLastUpdate] = useState({
    speed: 0,
    timestamp: null,
    latitude: 0,
    longitude: 0,
    idle: true,
    msSinceLast: 0,
  });

  const handleUserLocationChange = (gps) => {
    // console.log(gps.nativeEvent.coordinate);
    const o = {
      latitude: trip.origin.coords.lat,
      longitude: trip.origin.coords.lng,
    };
    const d = {
      latitude: trip.destination.coords.lat,
      longitude: trip.destination.coords.lng,
    };
    const curr = {
      latitude: gps.nativeEvent.coordinate.latitude,
      longitude: gps.nativeEvent.coordinate.longitude,
    };
    const totalMeters = getDistance(o, d);
    const destinationIn = getDistance(curr, d);
    setDistanceText(destinationIn.toString() + "/" + totalMeters + "m");

    const update = {
      idle: true,
      speed: 0,
      latitude: curr.latitude,
      longitude: curr.longitude,
      timestamp: gps.nativeEvent.coordinate.timestamp,
      msSinceLast: 0,
    };

    if (lastUpdate.timestamp) {
      const start = {
        latitude: update.latitude,
        longitude: update.longitude,
        time: update.timestamp,
      };
      const end = {
        latitude: lastUpdate.latitude,
        longitude: lastUpdate.longitude,
        time: lastUpdate.timestamp,
      };
      update.speed = Math.abs(getSpeed(start, end));
      update.msSinceLast = update.timestamp - lastUpdate.timestamp;
      update.idle = update.speed < 2.2;
    }
    setLastUpdate(update);

    const arrived = destinationIn < 40;
    console.log(
      destinationIn,
      totalMeters,
      arrived,
      moment(update.timestamp),
      events.current.length,
      update, arrived
    );

    events.current.push(update);

    if (arrived) {
      handleFinished();
    }
  };

  const handleFinished = async () => {
    const updates = {
      finished_at: firestore.FieldValue.serverTimestamp(),
      status: "finished",
    };
    await firestore().collection("trips").doc(trip.id).update(updates);
    dispatchTrip("FINISH", {
      finished_at: new Date(),
      status: updates.status,
    });
  };

  const handleAbort = async () => {
    const updates = {
      finished_at: firestore.FieldValue.serverTimestamp(),
      status: "aborted",
    };
    await firestore().collection("trips").doc(trip.id).update(updates);
    dispatchTrip("FINISH", {
      finished_at: new Date(),
      status: updates.status,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 5, backgroundColor: "blue" }}>
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
              <Text
                variant="headlineMedium"
                style={{ flex: 1, marginLeft: 10 }}
              >
                {moment
                  .utc(moment(elapsedTime).diff(trip.created_at))
                  .format("HH:mm:ss")}
              </Text>
              <Text>{distanceText}</Text>
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
              <Menu.Item title="Encerrar" onPress={handleAbort} />
            </Menu>
          </View>
        </View>
      </View>
    </View>
  );
}
