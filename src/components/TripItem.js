import { View, Text } from 'react-native'
import React from 'react'
import useMoment from '../hooks/useMoment';

export default function TripItem({item}) {
  const {moment} = useMoment();
  return (
    <Card style={{ marginBottom: 10 }}>
      <Card.Title
        title={item.name}
        titleVariant="titleLarge"
        left={({size}) => <MaterialCommunityIcons name={icon} size={size} />}
      />
      <Card.Content>
        <Text>{moment().to(item.created_at?.toDate())}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          uppercase
          mode="text"
        >
          Editar
        </Button>
      </Card.Actions>
    </Card>
  );



}