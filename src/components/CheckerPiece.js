import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

const CheckerPiece = ({ color, size = 30 }) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.piece,
        { backgroundColor: color, width: size, height: size, borderRadius: size / 2, borderColor: color === "black" ? "white" : "black", transform: [{ scale: pressed ? 0.9 : 1 }] }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  piece: {
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3, // Effet d'ombre sur Android
    shadowColor: "#000", // Effet d'ombre sur iOS
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default CheckerPiece;
