const axios = require('axios');
const WebSocket = require('ws');

// Replace with your actual servers
const AUTH_SERVER_URL = 'https://hackathon-europe-server.netlify.app';
const SOCKET_SERVER_URL = 'wss://websocket-server-hackathon-europe.onrender.com';

// User details
const userDetails = {
  email: `testuser${Date.now()}@example.com`, // Unique email for testing
  password: 'TestPassword123',
  first_name: 'Test',
  last_name: 'User'
};

const friendName = 'daniel komoe';
let userId = null;
let friendId = null;
let token = null;

// Function to register a new user
const registerUser = async () => {
  try {
    const response = await axios.post(`${AUTH_SERVER_URL}/signup`, userDetails);
    console.log('✅ User registered successfully:', response.data);
  } catch (error) {
    console.error('❌ Error registering user:', error.response?.data || error.message);
  }
};

// Function to log in the user and get the token
const loginUser = async () => {
  try {
    const response = await axios.post(`${AUTH_SERVER_URL}/login`, {
      email: userDetails.email,
      password: userDetails.password
    });
    token = response.data.token;
    userId = response.data.userId;
    console.log('✅ User logged in successfully. Token:', token);
  } catch (error) {
    console.error('❌ Error logging in:', error.response?.data || error.message);
  }
};

// Function to find friend by name
const findFriend = async () => {
  try {
    const response = await axios.get(`${AUTH_SERVER_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = response.data.find(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase() === friendName.toLowerCase()
    );
    if (user) {
      friendId = user._id;
      console.log(`✅ Friend found: ${friendName} (ID: ${friendId})`);
    } else {
      console.log('❌ Friend not found');
    }
  } catch (error) {
    console.error('❌ Error finding friend:', error.response?.data || error.message);
  }
};

// Function to send friend request
const sendFriendRequest = async () => {
  try {
    const response = await axios.post(`${AUTH_SERVER_URL}/api/friends`, 
      { friendId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Friend request sent:', response.data);
  } catch (error) {
    console.error('❌ Error sending friend request:', error.response?.data || error.message);
  }
};

// Function to send game invite using WebSocket
const sendGameInvite = () => {
  const ws = new WebSocket(SOCKET_SERVER_URL);

  ws.on('open', () => {
    console.log('✅ Connected to WebSocket server');
    ws.send(JSON.stringify({ event: 'register', data: userId }));

    // Send game invite after registering
    setTimeout(() => {
      console.log(`🚀 Sending game invite from ${userId} to ${friendId}`);
      ws.send(JSON.stringify({
        event: 'invite',
        data: {
          senderId: userId,
          receiverId: friendId,
          game: 'checkers'
        }
      }));
    }, 1000);
  });

  ws.on('message', (data) => {
    console.log('💬 Message from server:', data);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket Error:', error);
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket connection closed');
  });
};

// Main function to execute all steps
const main = async () => {
  await registerUser();
  await loginUser();
  await findFriend();

  if (friendId) {
    await sendFriendRequest();

    // Wait for a while to allow the friend request to be accepted
    console.log('⏳ Waiting for friend request to be accepted...');
    setTimeout(() => {
      sendGameInvite();
    }, 5000);
  } else {
    console.log('❌ Friend not found. Exiting...');
  }
};

main();