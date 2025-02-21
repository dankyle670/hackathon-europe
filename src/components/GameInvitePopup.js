// src/components/GameInvitePopup.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import WebSocketService from "../api/websocketService";

const GameInvitePopup = ({ invite, onClose }) => {
  if (!invite) return null;

  const acceptInvite = () => {
    WebSocketService.acceptGameInvite(invite.senderId, invite.receiverId);
    onClose();
  };

  const declineInvite = () => {
    WebSocketService.declineGameInvite(invite.senderId, invite.receiverId);
    onClose();
  };

  return (
    <Animated.View style={styles.popup}>
      <Text style={styles.text}>🎮 Game Invite from {invite.senderName}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={acceptInvite} style={styles.acceptButton}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={declineInvite} style={styles.declineButton}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popup: {
    position: "absolute",
    top: 20,
    width: "90%",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default GameInvitePopup;
