import { View } from 'react-native'
import React, {useState} from 'react'
import { Link, useTheme } from '@react-navigation/native';
import { Button, Text, TextInput } from 'react-native-paper'
import Loading from '../components/Loading';

export default function SignupScreen() {
    const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const { loading, signupEmailAndPassword } = useSignup();
  const [loading, setLoading] = useState(false);

  const handleRegisterPress = () => {
    // signupEmailAndPassword(email, password);
  };

  return (
    <View style={{flex: 1, padding: 10, alignItems: 'stretch', justifyContent: 'space-evenly'}}>
      <Text
        variant="headlineSmall"
        style={{ textAlign: "center", textTransform: "uppercase" }}
      >
        Registrar
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
          style={{ marginBottom: 10 }}
          mode="flat"
          placeholder="senha"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={{ marginBottom: 10 }}
          mode="flat"
          placeholder="confimação de senha"
        />
      </View>

      {loading && (
        <View>
          <Loading />
        </View>
      )}

      {!loading && (
        <>
          <Button mode="contained" uppercase onPress={handleRegisterPress}>
            Registrar
          </Button>

          <Text style={{alignSelf: 'center'}}>
            Já possui uma conta?{" "}
            <Link
              to={{ screen: "Login" }}
              style={{ color: theme.colors.primary }}
            >
              Faça o login
            </Link>
          </Text>
        </>
      )}
    </View>
  );
}