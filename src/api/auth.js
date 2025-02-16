import axios from "axios";

const API_URL = "https://hackathon-europe-server.netlify.app/api";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data);
    throw error;
  }
};
