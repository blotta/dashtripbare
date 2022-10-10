import { View, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import {Text, Button, TextInput, RadioButton} from 'react-native-paper'
import Vehicle from '../models/Vehicle'

import firestore from '@react-native-firebase/firestore'
import Loading from '../components/Loading'

export default function VehicleFormScreen({route}) {
  const { vehicleId } = route.params || { vehicleId: null};
  const [loading, setLoading] = useState(false);
  // const [vehicleId, setVehicleId] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Car');

  useEffect(() => {
    if (vehicleId) {
      // setVehicleId(route.params.vehicleId);
      firestore()
        .collection('vehicles')
        .doc(vehicleId).get()
        .then(snap => {
          const data = snap.data();
          setName(data.name);
          setType(data.type);
        })

    }
  }, [])

  const handleSave = () => {
    setLoading(true);
    if (vehicleId) {
      firestore()
        .collection('vehicles')
        .doc(vehicleId)
        .update({name, type})
        .then(() => Alert.alert("OK!", 'Veículo atualizado!'))
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
    } else {
      firestore()
        .collection('vehicles')
        .add({
          name: name,
          type: type,
          created_at: firestore.FieldValue.serverTimestamp()
        })
        .then(() => Alert.alert("OK!", 'Veículo criado'))
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
    }
  }
  
  return (
    <View style={{padding: 10, flex: 1}}>
      <Text variant='headlineSmall'>Novo Veículo</Text>

      <Text variant='titleMedium'>Nome</Text>
      <TextInput style={{marginVertical: 5}} value={name} onChangeText={setName} />

      <Text variant='titleMedium'>Tipo</Text>
      <RadioButton.Group onValueChange={setType} value={type}>
        <RadioButton.Item label='Carro' value='Car' />
        <RadioButton.Item label='Moto' value='Motorcycle' />
        <RadioButton.Item label='Bicicleta' value='Bicycle' />
      </RadioButton.Group>

      {loading && (
        <Loading />
      )}
      {!loading && (
        <Button mode='contained' onPress={handleSave}>Salvar</Button>
      )}
    </View>
  )
}