import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { getFriendsList } from "../api/friendService";
import websocketService from "../api/websocketService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InviteFriendScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");

        if (!storedUserId) {
          throw new Error("User ID not found");
        }

        setUserId(storedUserId);
        websocketService.connect(storedUserId); // Connexion WebSocket

        const friendsData = await getFriendsList();
        setFriends(friendsData);
      } catch (error) {
        console.error("❌ Error fetching friends:", error);
        Alert.alert("Error", "Could not fetch friends. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFriends();
  }, []);

  const sendInvite = useCallback(
    (friendId) => {
      if (!userId) {
        Alert.alert("⚠️ Error", "User ID not found. Please log in again.");
        return;
      }

      console.log(`📤 Sending invite from ${userId} to ${friendId} for checkers`);
      websocketService.sendGameInvite(userId, friendId, "checkers");
      Alert.alert("✅ Invite Sent", "Your friend has been invited to play!");
    },
    [userId]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invite a Friend to Play</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.inviteButton} onPress={() => sendInvite(item._id)}>
              <Text style={styles.buttonText}>Invite {item.first_name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#121212" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  inviteButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});

export default InviteFriendScreen;
