import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, Button, ActivityIndicator } from "react-native";
import { getFriendsList } from "../api/friendService";
import WebSocketService from "../api/websocketService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InviteFriendScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
      const friendsData = await getFriendsList();
      setFriends(friendsData);
      setLoading(false);
    };
    fetchFriends();
  }, []);

  const sendInvite = (friendId) => {
    WebSocketService.sendGameInvite(userId, friendId);
    alert("Game invite sent!");
    navigation.navigate("CheckerGame", { gameMode: "Multiplayer", friendId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Friend to Play</Text>
      {loading ? <ActivityIndicator size="large" /> : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Button title={`Invite ${item.first_name}`} onPress={() => sendInvite(item._id)} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 100 },
});

export default InviteFriendScreen;
