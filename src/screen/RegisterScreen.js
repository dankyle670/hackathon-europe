// src/screens/Register.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { registerUser } from "../api/authService";

const RegisterScreen = ({ navigation }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await registerUser({ first_name, last_name, email, password });
      Alert.alert("Success", response.message);

      // ✅ Navigate to Login
      navigation.navigate("Login");
    } catch (error) {
      console.error("❌ Registration Error:", error);
      Alert.alert("Registration Failed", "Try again with different credentials.");
    }
  };

  return (
    <View style={{ padding: 50 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Register</Text>
      <TextInput placeholder="First Name" value={first_name} onChangeText={setFirstName} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
      <TextInput placeholder="Last Name" value={last_name} onChangeText={setLastName} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Back to Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

export default RegisterScreen;
