import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appbar, Avatar, Card, Title, Paragraph, FAB, Menu } from "react-native-paper";
import { getUserProfile, logoutUser } from "../api/authService";
import { getFriendsList } from "../api/friendService";

const DashboardScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.navigate("Login");
        return;
      }

      try {
        // Fetch User Profile
        const userData = await getUserProfile();
        console.log("User Data from API:", userData);

        if (userData && userData._id) {
          setUser(userData);
        } else {
          console.warn("⚠️ No user data received, check API response");
        }

        // Fetch Friends List
        const friendsData = await getFriendsList();
        console.log("Friends List:", friendsData);
        setFriends(friendsData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigation.navigate("Login");
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
            onPress={() => navigation.navigate("FriendRequests")}
            title="Add Friend"
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

          {/* Floating Action Button */}
          <FAB.Group
            open={false}
            color="white"
            style={styles.fab}
            fabStyle={{ backgroundColor: "#6200EE" }}
            actions={[
              { icon: "account-plus", label: "Add Friend", onPress: () => navigation.navigate("FriendRequests") },
              { icon: "gamepad", label: "Start Game", onPress: () => navigation.navigate("GameSelection") },
            ]}
            onStateChange={() => {}}
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
  },
});

export default DashboardScreen;
