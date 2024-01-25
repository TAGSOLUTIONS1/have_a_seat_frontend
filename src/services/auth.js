// import axios from "axios";

// const API_URL = "https://tagsolutionsltd.com/api/v1"

// export const register = async (formData) => {
//     const response = await axios.post(`${API_URL}/auth/register`, formData);
//     switch (response.status) {
//         case 200:
//             return response.data;
//         case 400:
//             throw new Error(response.data.message);
//         default:
//             throw new Error("Something went wrong");
//     }
// };

import axios from "axios";

const API_URL = "https://tagsolutionsltd.com/api/v1";

export const register = async (formData) => {
  try {
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
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};
