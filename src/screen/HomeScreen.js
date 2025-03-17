import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={{ uri: "https://culture.ec.europa.eu/sites/default/files/styles/eac_ratio_16_9_xl/public/2020-08/policies01-c_istock-kamisoka.jpg?h=c74750f6&itok=WPTcSWfi" }} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🇪🇺 Hackathon Europe</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Assombrit l'image pour améliorer la lisibilité
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 50,
    textAlign: "center",
    textShadowColor: "rgba(255, 215, 0, 0.8)", 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  button: {
    backgroundColor: "rgba(0, 68, 204, 0.8)", // Bleu semi-transparent
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