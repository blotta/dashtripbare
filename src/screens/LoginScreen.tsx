import { View, Alert } from 'react-native'
import React, {useState} from 'react'
import { Button, Text, TextInput } from 'react-native-paper'
import Loading from '../components/Loading';
import { Link, useTheme } from '@react-navigation/native'
import { useLogin } from '../hooks/appAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const theme = useTheme();

  const { loginEmailAndPassword, loading } = useLogin((err) => Alert.alert(err.message));

  const handleLoginPress = () => {
    if (email && password) {
      loginEmailAndPassword(email, password)
    }
  }
  return (
    <View style={{flex: 1, padding: 10, alignItems: 'stretch', justifyContent: 'space-evenly'}}>
        <Text
        variant="headlineSmall"
        style={{ textAlign: "center", textTransform: "uppercase" }}
      >
        Login
      </Text>

      <View>
        <TextInput
          style={{ marginBottom: 10 }}
          mode="flat"
          placeholder="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          mode="flat"
          placeholder="senha"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {loading && (
        <View>
          <Loading />
        </View>
      )}

      {!loading && (
        <>
          <Button mode="contained" uppercase onPress={handleLoginPress}>
            Login
          </Button>
          <Text style={{alignSelf: 'center'}}>
            Não possui conta?{" "}
            <Link
              to={{ screen: "Signup" }}
              style={{ color: theme.colors.primary }}
            >
              Registrar
            </Link>
          </Text>
        </>
      )}
    </View>
  )
}