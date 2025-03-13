import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from "react-native";
import { Appbar, Button, Card, Paragraph, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllUsers, getPendingRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendsList } from "../api/friendService";
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
    const fetchFriendsData = async () => {
      try {
        const userProfile = await getUserProfile();
        setCurrentUser(userProfile);

        const allUsers = await getAllUsers();
        const pendingRequestsData = await getPendingRequests();
        const friendsData = await getFriendsList();

        setUsers(allUsers);
        setPendingRequests(pendingRequestsData);
        setFriends(friendsData);

        const storedRequests = await AsyncStorage.getItem("sentRequests");
        setSentRequests(storedRequests ? JSON.parse(storedRequests) : []);
      } catch (error) {
        console.error("Error fetching friend data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsData();
  }, []);

  // Vérifier régulièrement si des demandes ont été refusées
  useEffect(() => {
    const interval = setInterval(fetchUpdatedRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUpdatedRequests = async () => {
    try {
      const updatedPendingRequests = await getPendingRequests();
      const stillPendingIds = updatedPendingRequests.map((req) => req.senderId._id);
      const updatedSentRequests = sentRequests.filter((id) => stillPendingIds.includes(id));

      setSentRequests(updatedSentRequests);
      await AsyncStorage.setItem("sentRequests", JSON.stringify(updatedSentRequests));
    } catch (error) {
      console.error("Error updating sent requests:", error);
    }
  };

  const handleSendRequest = async (userId) => {
    if (userId === currentUser?._id) {
      alert("You cannot send a friend request to yourself.");
      return;
    }

    try {
      await sendFriendRequest(userId);
      const updatedRequests = [...sentRequests, userId];
      setSentRequests(updatedRequests);
      await AsyncStorage.setItem("sentRequests", JSON.stringify(updatedRequests));
      alert("Friend request sent!");
    } catch (error) {
      alert("Error sending request.");
    }
  };

  const handleAcceptRequest = async (requestId, senderId) => {
    try {
      await acceptFriendRequest(requestId);
      setPendingRequests(pendingRequests.filter((req) => req._id !== requestId));
      setFriends([...friends, users.find((user) => user._id === senderId)]);
      setUsers(users.filter((user) => user._id !== senderId));

      const updatedRequests = sentRequests.filter((id) => id !== senderId);
      setSentRequests(updatedRequests);
      await AsyncStorage.setItem("sentRequests", JSON.stringify(updatedRequests));

      alert("Friend request accepted!");
    } catch (error) {
      alert("Error accepting request.");
    }
  };

  const handleRejectRequest = async (requestId, senderId) => {
    try {
      await rejectFriendRequest(requestId);
      alert("Friend request rejected!");
  
      setPendingRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));
  
      const updatedRequests = sentRequests.filter((id) => id !== senderId);
      setSentRequests(updatedRequests);
      await AsyncStorage.setItem("sentRequests", JSON.stringify(updatedRequests));

      setUsers((prevUsers) => [...prevUsers, users.find((user) => user._id === senderId)]);
    } catch (error) {
      alert(error.message || "Error rejecting request.");
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Friends" />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <>
          <TextInput label="Search Users" value={search} onChangeText={setSearch} style={styles.searchInput} />

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
                    <Paragraph>{item.first_name} {item.last_name}</Paragraph>
                  </Card.Content>
                </Card>
              )}
            />
          )}

          <Text style={styles.sectionTitle}>Friend Requests</Text>
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Card style={styles.friendCard}>
                <Card.Content>
                  <Paragraph>{item.senderId.first_name} {item.senderId.last_name}</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => handleAcceptRequest(item._id, item.senderId._id)}>Accept</Button>
                  <Button onPress={() => handleRejectRequest(item._id, item.senderId._id)}>Reject</Button>
                </Card.Actions>
              </Card>
            )}
          />

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
                  <Paragraph>{item.first_name} {item.last_name}</Paragraph>
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
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f4f4f4" },
  header: { backgroundColor: "#6200EE" },
  searchInput: { margin: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  friendCard: { marginVertical: 5, padding: 10, backgroundColor: "#FFF", elevation: 3 },
  noFriendsText: { textAlign: "center", fontSize: 16, marginVertical: 10, color: "gray" },
});

export default AddFriendScreen;
