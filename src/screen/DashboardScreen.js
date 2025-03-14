import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Appbar, Avatar, Card, Title, Paragraph, Menu, Badge } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { getUserProfile, logoutUser } from "../api/authService";
import { getFriendsList, getPendingRequestsCount } from "../api/friendService";

const DashboardScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);

        const friendsData = await getFriendsList();
        setFriends(friendsData);

        const count = await getPendingRequestsCount();
        setFriendRequestsCount(count);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigation.navigate("Home");
  };

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action icon="menu" onPress={() => setMenuVisible(true)} />
          }
        >
          <Menu.Item
            onPress={() => navigation.navigate("AddFriendScreen")}
            title="Add Friend"
            right={() =>
              friendRequestsCount > 0 ? (
                <Badge style={styles.badge}>{friendRequestsCount}</Badge>
              ) : null
            }
          />
          <Menu.Item onPress={handleLogout} title="Logout" />
          <Menu.Item onPress={() => alert("More Features Coming Soon!")} title="More" />
        </Menu>
        <Appbar.Content title="Dashboard" />
      </Appbar.Header>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <Card style={styles.profileCard}>
            <Card.Content style={styles.profileContent}>
              <Avatar.Text size={60} label={user?.first_name?.charAt(0) || "U"} />
              <Title style={styles.profileName}>
                {user?.first_name ? `${user.first_name} ${user.last_name}` : "Unknown User"}
              </Title>
            </Card.Content>
          </Card>

          <Title style={styles.sectionTitle}>Your Friends</Title>
          {friends.length === 0 ? (
            <Text style={styles.noFriendsText}>No friends yet. Add some!</Text>
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

          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("GameSelection")}>
            <Text style={styles.fabText}>🎮 Start Game</Text>
          </TouchableOpacity>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "transparent",
  },
  profileCard: {
    margin: 15,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 10,
    color: "#FFF",
  },
  badge: {
    backgroundColor: "red",
    fontSize: 14,
    marginRight: 10,
  },
  friendCard: {
    marginHorizontal: 15,
    marginVertical: 5,
    backgroundColor: "#FFF",
    borderRadius: 15,
    elevation: 3,
  },
  noFriendsText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
    color: "#DDD",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
  },
  fabText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DashboardScreen;
