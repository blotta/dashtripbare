import { View } from "react-native";
import React, { useCallback } from "react";
import useMoment from "../hooks/useMoment";
import { Card, Text, Button, Chip, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TransportIcon from "./TransportIcon";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

function getStatus(id) {
  switch (id) {
    case "aborted":
      return "Abortado";
      break;
    case "started":
      return "Iniciado";
      break;
    case "created":
      return "Criado";
      break;
    case "finished":
      return "Finalizado";
      break;
    default:
      return "default";
      break;
  }
}

export default function TripItem({ item }) {
  const navigation = useNavigation();
  const { moment } = useMoment();

  const handleTripPress = (id) => {
    navigation.navigate("TripRoutes", {
      screen: 'TripDetails',
      params: { tripId: id }
    })
  }

  
  return (
    <Card mode="outlined" style={{ marginBottom: 10 }}>
      <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
      <Card.Content>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <TransportIcon
                transportType={item.transport.name}
                size={30}
                color="#555"
              />
              <Text variant="titleLarge" style={{ marginLeft: 10 }}>
                {moment(item.created_at.toDate()).to(
                  item.finished_at?.toDate() || new Date(),
                  true
                )}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginRight: 10 }}>
                {moment().to(moment(item.created_at.toDate()))}
              </Text>
              <MaterialCommunityIcons name="clock-outline" size={20} />
            </View>
          </View>
          <View>
            <Text variant="bodyLarge" style={{textAlign: 'center'}}>{getStatus(item.status)}</Text>
            <Divider style={{ backgroundColor: '#777', height: 2, marginVertical: 5}} />
            <Text>{item.origin.description}</Text>
            <Text>{item.destination.description}</Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button uppercase mode="text" onPress={() => handleTripPress(item.id)}>
          Detalhes
        </Button>
      </Card.Actions>
    </Card>
  );
}
