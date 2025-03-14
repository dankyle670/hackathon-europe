import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Appbar, Button, Card, Paragraph, TextInput, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAllUsers,
  getPendingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
} from "../api/friendService";
import { getUserProfile } from "../api/authService";

const AddFriendScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfile();
        setCurrentUser(userProfile);

        const [allUsers, pendingRequestsData, friendsData] = await Promise.all([
          getAllUsers(),
          getPendingRequests(),
          getFriendsList(),
        ]);

        setUsers(allUsers);
        setPendingRequests(pendingRequestsData);
        setFriends(friendsData);

        const storedRequests = await AsyncStorage.getItem("sentRequests");
        setSentRequests(storedRequests ? JSON.parse(storedRequests) : []);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        Alert.alert("Error", "Failed to load friends data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendRequest = useCallback(async (userId) => {
    if (userId === currentUser?._id) {
      Alert.alert("⚠️ Error", "You cannot send a friend request to yourself.");
      return;
    }

    try {
      await sendFriendRequest(userId);
      const updatedRequests = [...sentRequests, userId];
      setSentRequests(updatedRequests);
      await AsyncStorage.setItem("sentRequests", JSON.stringify(updatedRequests));

      Alert.alert("✅ Success", "Friend request sent!");
    } catch (error) {
      Alert.alert("❌ Error", "Failed to send request.");
    }
  }, [currentUser, sentRequests]);

  const handleAcceptRequest = useCallback(async (requestId, senderId) => {
    try {
      await acceptFriendRequest(requestId);
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      setFriends((prev) => [...prev, users.find((user) => user._id === senderId)]);
      setUsers((prev) => prev.filter((user) => user._id !== senderId));

      const updatedRequests = sentRequests.filter((id) => id !== senderId);
      setSentRequests(updatedRequests);
      await AsyncStorage.setItem("sentRequests", JSON.stringify(updatedRequests));

      Alert.alert("✅ Success", "Friend request accepted!");
    } catch (error) {
      Alert.alert("❌ Error", "Failed to accept request.");
    }
  }, [users, sentRequests]);

  const handleRejectRequest = useCallback(async (requestId) => {
    try {
      await rejectFriendRequest(requestId);
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      Alert.alert("✅ Success", "Friend request rejected.");
    } catch (error) {
      Alert.alert("❌ Error", "Failed to reject request.");
    }
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Friends" />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
      ) : (
        <ScrollView>
          <TextInput
            label="Search Users"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Your Friends</Text>
          {friends.length === 0 ? (
            <Text style={styles.noFriendsText}>No friends yet.</Text>
          ) : (
            <FlatList
              data={friends}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Card style={styles.friendCard}>
                  <Card.Content>
                    <Paragraph>
                      {item.first_name} {item.last_name}
                    </Paragraph>
                  </Card.Content>
                </Card>
              )}
              scrollEnabled={false}
            />
          )}

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Pending Requests</Text>
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Card style={styles.friendCard}>
                <Card.Content>
                  <Paragraph>
                    {item.senderId.first_name} {item.senderId.last_name}
                  </Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => handleAcceptRequest(item._id, item.senderId._id)}>
                    Accept
                  </Button>
                  <Button onPress={() => handleRejectRequest(item._id)}>Reject</Button>
                </Card.Actions>
              </Card>
            )}
            scrollEnabled={false}
          />

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>All Users</Text>
          <FlatList
            data={users.filter(
              (u) =>
                `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()) &&
                u._id !== currentUser?._id &&
                !friends.some((friend) => friend._id === u._id)
            )}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Card style={styles.friendCard}>
                <Card.Content>
                  <Paragraph>
                    {item.first_name} {item.last_name}
                  </Paragraph>
                </Card.Content>
                <Card.Actions>
                  {sentRequests.includes(item._id) ? (
                    <Button disabled>Pending</Button>
                  ) : (
                    <Button onPress={() => handleSendRequest(item._id)}>Add Friend</Button>
                  )}
                </Card.Actions>
              </Card>
            )}
            scrollEnabled={false}
          />
        </ScrollView>
      )}
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f4f4f4" },
  header: { backgroundColor: "#6200EE" },
  loader: { marginTop: 50 },
  searchInput: { margin: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  friendCard: { marginVertical: 5, padding: 10, backgroundColor: "#FFF", elevation: 3 },
  noFriendsText: { textAlign: "center", fontSize: 16, marginVertical: 10, color: "gray" },
  divider: { marginVertical: 10 },
});

export default AddFriendScreen;
