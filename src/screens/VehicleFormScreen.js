import { View, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Text, Button, TextInput, RadioButton } from "react-native-paper";
import Vehicle from "../models/Vehicle";

import firestore from "@react-native-firebase/firestore";
import Loading from "../components/Loading";
import { useNavigation } from "@react-navigation/native";
import { useAuthContext } from "../hooks/useAuthContext";

export default function VehicleFormScreen({ route }) {
  const navigation = useNavigation();
  const { vehicleId } = route.params || { vehicleId: null };
  const { user } = useAuthContext();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("Car");

  useEffect(() => {
    if (vehicleId) {
      firestore()
        .collection("vehicles")
        .doc(vehicleId)
        .get()
        .then((snap) => {
          const data = snap.data();
          setName(data.name);
          setType(data.type);
        });
    }
  }, []);

  const handleSave = () => {
    setLoading(true);
    if (vehicleId) {
      firestore()
        .collection("vehicles")
        .doc(vehicleId)
        .update({ name, type, userId: user.uid, active: true })
        .then(() =>
          Alert.alert("OK!", "Veículo atualizado!", [
            { text: "OK", onPress: () => navigation.goBack() },
          ])
        )
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else {
      firestore()
        .collection("vehicles")
        .add({
          userId: user.uid,
          active: true,
          name: name,
          type: type,
          created_at: firestore.FieldValue.serverTimestamp(),
        })
        .then(() =>
          Alert.alert("OK!", "Veículo criado", [
            { text: "OK", onPress: () => navigation.goBack() },
          ])
        )
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <Text variant="headlineSmall">
            {vehicleId ? "Editar" : "Novo"} Veículo
          </Text>
          <Button uppercase>Deletar</Button>
        </View>

        <Text variant="titleMedium">Nome</Text>
        <TextInput
          style={{ marginVertical: 5 }}
          value={name}
          onChangeText={setName}
        />

        <Text variant="titleMedium">Tipo</Text>
        <RadioButton.Group onValueChange={setType} value={type}>
          <RadioButton.Item label="Carro" value="Car" />
          <RadioButton.Item label="Moto" value="Motorcycle" />
          <RadioButton.Item label="Bicicleta" value="Bicycle" />
        </RadioButton.Group>
      </ScrollView>

      {loading && <Loading />}
      {!loading && (
        <Button mode="contained" onPress={handleSave}>
          Salvar
        </Button>
      )}
    </View>
  );
}
