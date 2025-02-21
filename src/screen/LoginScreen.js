// src/screens/Login.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../api/authService";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await loginUser({ email, password });

      // ✅ Save Token and User ID in AsyncStorage
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("userId", response.userId);  // Save userId here

      console.log("✅ User ID saved:", response.userId);
      navigation.navigate("Dashboard");
    } catch (error) {
      console.error("❌ Login Error:", error);
      Alert.alert("Login Failed", "Invalid email or password");
    }
  };

  return (
    <View style={{ padding: 50 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
};

export default LoginScreen;
