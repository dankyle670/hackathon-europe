import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://hackathon-europe-server.netlify.app/api";

// Helper function to get stored token
const getAuthToken = async () => {
  return await AsyncStorage.getItem("token");
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    console.log(" Signup successful:", response.data);

    if (response.data.token) {
      await AsyncStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error(" Signup Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Signup failed" };
  }
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    console.log(" Login successful:", response.data);

    if (response.data.token) {
      await AsyncStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Login failed" };
  }
};

// Fetch User Profile
export const getUserProfile = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.warn("No token found in AsyncStorage");
      return null;
    }

    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("API Response for Profile:", response.data);

    // Ensure the response is correctly returned
    if (!response.data || !response.data._id) {
      console.warn("⚠️ API response does not contain a valid user object.");
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(" Profile Fetch Error:", error.response?.data || error.message);
    return null;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("token");
    console.log("User logged out");
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};
