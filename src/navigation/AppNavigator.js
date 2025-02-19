import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import HomeScreen from "../screen/HomeScreen";
import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";
import DashboardScreen from "../screen/DashboardScreen";
import AddFriendScreen from "../screen/AddFriendScreen";
import GameSelection from "../screen/GameSelection";
import CheckerGame from "../screen/CheckerGame";

import { Provider as PaperProvider } from "react-native-paper";

//import GameInviteScreen from "../screens/GameInviteScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="AddFriendScreen" component={AddFriendScreen}/>
        <Stack.Screen name="GameSelection" component={GameSelection} />
        <Stack.Screen name="CheckerGame" component={CheckerGame} />

      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
