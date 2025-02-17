import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hackathon Europe</Text>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
      <View style={styles.spacer} />
      <Button title="Signup" onPress={() => navigation.navigate("Register")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  spacer: {
    marginVertical: 10,
  },
});

export default HomeScreen;
