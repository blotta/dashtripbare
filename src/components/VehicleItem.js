import React from "react";
import { Button, Card, Text } from "react-native-paper";

import useMoment from "../hooks/useMoment";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function VehicleItem({ item, buttonOptions, selected }) {
  const { moment } = useMoment();
  const navigation = useNavigation();

  let icon = "car-estate";

  switch (item.type) {
    case "Car":
      icon = "car-estate";
      break;
    case "Motorcycle":
      icon = "motorbike";
      break;
    case "Bicycle":
      icon = "bicycle";
      break;
    default:
      icon = "car-estate";
      break;
  }

  return (
    <Card mode={selected ? 'outlined' : 'elevated'} style={{ marginBottom: 10 }}>
      <Card.Title

        title={item.name}
        titleVariant="titleLarge"
        left={({size}) => <MaterialCommunityIcons name={icon} size={size} />}
      />
      <Card.Content>
        <Text>{moment().to(item.created_at?.toDate())}</Text>
      </Card.Content>
      {buttonOptions && (
      <Card.Actions>
        {buttonOptions.map(({text, cb}) => (
          <Button key={text} uppercase mode="text" onPress={cb}>{text}</Button>
        ))}
      </Card.Actions>

      )}
    </Card>
  );
}
