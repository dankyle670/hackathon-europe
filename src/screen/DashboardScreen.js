import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from "react-native";
import { Appbar, Avatar, Card, Title, Paragraph, FAB, Menu, Badge } from "react-native-paper";
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

        // Fetch Pending Friend Requests Count
        const count = await getPendingRequestsCount();
        setFriendRequestsCount(count);

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Auto-refresh friends list every 5 seconds
    const interval = setInterval(fetchUserData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {/* Navbar with Menu Button */}
      <Appbar.Header style={styles.header}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="menu"
              onPress={() => setMenuVisible(true)}
            />
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

      {/* Show Loading Indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          {/* Profile Card */}
          <Card style={styles.profileCard}>
            <Card.Content style={styles.profileContent}>
              <Avatar.Text size={50} label={user?.first_name?.charAt(0) || "U"} />
              <Title style={styles.profileName}>
                {user?.first_name ? `${user.first_name} ${user.last_name}` : "Unknown User"}
              </Title>
            </Card.Content>
          </Card>

          {/* Friends List */}
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
                    <Paragraph>
                      {item.first_name} {item.last_name}
                    </Paragraph>
                  </Card.Content>
                </Card>
              )}
            />
          )}

          {/* Floating Action Button - Redirect to Game Selection */}
          <FAB
            style={styles.fab}
            icon="gamepad"
            label="Start Game"
            onPress={() => navigation.navigate("GameSelection")} //Correct navigation
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    backgroundColor: "#6200EE",
  },
  profileCard: {
    margin: 15,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 3,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 10,
  },
  badge: {
    backgroundColor: "red",
    color: "white",
    fontSize: 14,
    marginRight: 10,
  },
  friendCard: {
    marginHorizontal: 15,
    marginVertical: 5,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 2,
  },
  noFriendsText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
    color: "gray",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#6200EE",
  },
});

export default DashboardScreen;
