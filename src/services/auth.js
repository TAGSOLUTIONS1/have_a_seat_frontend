// import axios from "axios";

const API_URL = "https://have-a-seatonline.com/api/v1"

import axios from "axios";

// const API_URL = "https://have-a-seatonline.com/api/v1";

export const register = async (formData) => {
  console.log("formData for register is ", formData);
  const registerResponse = await axios.post(
    `${API_URL}/auth/register`,
    formData
  );
  switch (registerResponse.status) {
    case 201:
      if (registerResponse.status === 201) {
        const verifyResponse = await axios.post(
          `${API_URL}/auth/request-verify-token`,
          {
            email: formData.email,
          }
        );
        return registerResponse.data;
      } else {
        throw new Error(
          registerResponse.data.message ||
            "Something went wrong during registration"
        );
      }
    case 400:
      throw new Error(registerResponse.data.message);
    default:
      throw new Error("Something went wrong");
  }
};

// Create user without authentication (for reservation flow)
export const createUser = async (userData) => {
  try {
    console.log("Creating user with data:", userData);
    const response = await axios.post(
      `${API_URL}/users/create-user`,
      userData
    );
    
    if (response.status === 200 || response.status === 201) {
      console.log("User created successfully:", response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to create user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Create user and get JWT token for immediate use
export const createUserAndLogin = async (userData) => {
  try {
    // Step 1: Create user
    const createdUser = await createUser(userData);
    
    // Step 2: Login to get JWT token
    const loginFormData = new FormData();
    loginFormData.append('username', userData.email);
    loginFormData.append('password', userData.password);
    loginFormData.append('grant_type', '');
    loginFormData.append('client_id', '');
    loginFormData.append('client_secret', '');
    
    const loginResponse = await fetch(`${API_URL}/auth/jwt/login`, {
      method: "POST",
      body: loginFormData,
      redirect: "follow",
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed with status: ${loginResponse.status}`);
    }
    
    const loginResult = await loginResponse.json();
    
    return {
      user: createdUser,
      accessToken: loginResult.access_token
    };
    
  } catch (error) {
    console.error("Error creating user and logging in:", error);
    throw error;
  }
};