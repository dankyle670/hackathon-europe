// src/navigation/AppNavigator.js
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";



import HomeScreen from "../screen/HomeScreen";
import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";
import DashboardScreen from "../screen/DashboardScreen";
import AddFriendScreen from "../screen/AddFriendScreen";
import GameSelection from "../screen/GameSelection";
import GameModeSelection from "../screen/GameModeSelection";
import InviteFriendScreen from "../screen/InviteFriendScreen";
import CheckerGame from "../screen/CheckerGame";
import SnakeLaddersGame from "../screen/SnakeLaddersGame";

import GameInvitePopup from "../components/GameInvitePopup";
import WebSocketService from "../api/websocketService";

import { Provider as PaperProvider } from "react-native-paper";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [invite, setInvite] = useState(null); // State for game invite

  // Listen for incoming game invites
  useEffect(() => {
    WebSocketService.onGameInvite((inviteData) => {
      console.log("📩 Game Invite Received:", inviteData);
      setInvite(inviteData);
    });
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="AddFriendScreen" component={AddFriendScreen} />
          <Stack.Screen name="GameSelection" component={GameSelection} />
          <Stack.Screen name="GameModeSelection" component={GameModeSelection} />
          <Stack.Screen name="InviteFriendScreen" component={InviteFriendScreen} />
          <Stack.Screen name="CheckerGame" component={CheckerGame} />
          <Stack.Screen name="SnakeLaddersGame" component={SnakeLaddersGame} />
        </Stack.Navigator>

        {/* Game Invite Popup */}
        <GameInvitePopup invite={invite} onClose={() => setInvite(null)} />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
