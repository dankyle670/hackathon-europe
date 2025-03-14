import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { registerUser } from "../api/authService";

const RegisterScreen = ({ navigation }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await registerUser({ first_name, last_name, email, password });
      Alert.alert("Success", response.message);

      // ✅ Navigate to Login
      navigation.navigate("Login");
    } catch (error) {
      console.error("❌ Registration Error:", error);
      setError("Registration failed. Try again with different credentials.");
      Alert.alert("Registration Failed", "Try again with different credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        label="First Name"
        value={first_name}
        onChangeText={setFirstName}
        mode="outlined"
        left={<TextInput.Icon icon="account" />}
        style={styles.input}
      />

      <TextInput
        label="Last Name"
        value={last_name}
        onChangeText={setLastName}
        mode="outlined"
        left={<TextInput.Icon icon="account" />}
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email" />}
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        left={<TextInput.Icon icon="lock" />}
        style={styles.input}
      />

      <Button mode="contained" loading={loading} onPress={handleRegister} style={styles.button}>
        Register
      </Button>

      <Button onPress={() => navigation.navigate("Login")} style={styles.backButton}>
        Back to Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  backButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default RegisterScreen;
