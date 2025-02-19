Welcome to the Outh Game frontend! This is the React Native application that powers the multiplayer gaming platform, where users can register, log in, add friends, and join real-time 1v1 duels.

# 🚀 Features

User Authentication (Signup, Login, Logout)

Friendship System (Send, accept, reject friend requests)

Game Invitation System (via WebSockets)

Modern UI with React Native Paper

Persistent Session with AsyncStorage

# 📌 Tech Stack

Frontend Framework: React Native (Expo)

State Management: React Hooks

Networking: Axios for API requests

UI Library: React Native Paper

Storage: AsyncStorage

Navigation: React Navigation

# 📂 Project Structure

frontend/
│── src/
│   ├── api/
│   │   ├── authService.js      # API calls for authentication
│   │   ├── friendService.js    # API calls for friends management
│   ├── screens/
│   │   ├── HomeScreen.js       # Welcome screen with Login & Signup
│   │   ├── LoginScreen.js      # Login UI
│   │   ├── SignupScreen.js     # Signup UI
│   │   ├── DashboardScreen.js  # User dashboard (Friends, Logout, Games)
│   │   ├── FriendRequests.js   # Manage friend requests
│   │   ├── GameSelection.js    # Choose a game to play
│   ├── components/
│   │   ├── FriendList.js       # Component for displaying friends
│   │   ├── GameInvite.js       # WebSocket-based game invitations
│   ├── navigation/
│   │   ├── AppNavigator.js     # Navigation setup
│   ├── App.js                  # Main app entry point
│── package.json                # Dependencies & scripts
│── app.json                     # Expo config
│── .env                         # Environment variables (API URL)

⚙️ Setup & Installation

1️⃣ Clone the repository

# git clone git@github.com:dankyle670/hackathon-europe.git
# cd hackathon-europe

2️⃣ Install dependencies

# npm install

3️⃣ Run the development server

# npx expo start --tunnel

Select i for iOS Simulator or a for Android Emulator.

🔥 Environment Variables

Create a .env file in the root directory and set your API URL:

# API_URL=https://hackathon-europe-server.netlify.app/api


# 🚀 Upcoming Features

Push Notifications for Game Invites

Leaderboard and Player Stats

More Multiplayer Games!

📧 Need help? Contact me at your.email@example.com