import React from "react";
import { View, StyleSheet } from "react-native";

const CheckerPiece = ({ color }) => {
  return <View style={[styles.piece, { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
  piece: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: "black" },
});

export default CheckerPiece;