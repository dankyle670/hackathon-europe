import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={["#001E6C", "#0039A6"]} style={styles.container}>
      <Text style={styles.title}>🇪🇺 Hackathon Europe</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFD700", // Doré pour rappeler les étoiles de l'UE
    marginBottom: 50,
    textAlign: "center",
    textShadowColor: "rgba(255, 215, 0, 0.6)", // Effet doré lumineux
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  button: {
    backgroundColor: "#0044CC",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10,
  },
  buttonText: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  spacer: {
    height: 25,
  },
});

export default HomeScreen;