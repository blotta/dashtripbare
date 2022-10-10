import { View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { IconButton, Text, Button } from 'react-native-paper'


export default function VehiclesScreen() {
  const navigation = useNavigation();


  useEffect(() => {

    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="minus"
          mode="contained-tonal"
          onPress={() => navigation.navigate("VehicleForm")}
        />
      )
    })
  },[])
  return (
    <View style={{padding: 10, flex: 1}}>
      <View style={{flexDirection: 'row-reverse' }}>
        <Button>Adicionar</Button>
      </View>
    </View>
  )
}