import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://hackathon-europe-server.netlify.app/api";

// Helper function to get stored token
const getAuthToken = async () => {
    return await AsyncStorage.getItem("token");
  };

//Fetch Friends List
export const getFriendsList = async () => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${API_URL}/friends`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Friends List fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Friends Fetch Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch friends" };
  }
};

// Send Friend Request
export const sendFriendRequest = async (receiverId) => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No token found");

    const response = await axios.post(
      `${API_URL}/friend-request/${receiverId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Friend request sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Friend Request Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to send friend request" };
  }
};

// Accept Friend Request
export const acceptFriendRequest = async (requestId) => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No token found");

    const response = await axios.put(
      `${API_URL}/friend-request/${requestId}/accept`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Friend request accepted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Accept Request Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to accept friend request" };
  }
};

// Get Pending Friend Requests
export const getPendingRequests = async () => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${API_URL}/friend-requests/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Pending Friend Requests fetched:", response.data);
    return response.data.pendingRequests;
  } catch (error) {
    console.error("Pending Requests Fetch Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch pending requests" };
  }
};

// Fetch All Users (To Send Friend Requests)
export const getAllUsers = async () => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Users fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch Users Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

//  Fetch Pending Friend Requests Count
export const getPendingRequestsCount = async () => {
  try {
    const token = await getAuthToken();
    if (!token) throw { message: "No token found" };

    const response = await axios.get(`${API_URL}/friend-requests/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.count; // Returns the count of pending requests
  } catch (error) {
    console.error("Pending Requests Count Error:", error.response?.data || error.message);
    return 0; // Return 0 if there's an error
  }
};

export const rejectFriendRequest = async (requestId) => {
  try {
    const token = await getAuthToken();
    if (!token) throw { message: "No token found" };

    const response = await axios.put(
      `${API_URL}/friend-request/${requestId}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Friend request rejected:", response.data);
    return response.data;
  } catch (error) {
    console.error("Reject Request Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to reject friend request" };
  }
};