
import axios from "./configureAxios";

const UserAPI = {
  async getUser(userName: string) {
    try {
      const response = await axios.get("/user/" + userName);
      return response.data;
    }
    catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  },

  async registerUser(uuid: string, username: string) {
    try {
      const response = await axios.post("/user/register", { uuid, username });
      return response.status === 200 ? response.data : false;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  async getUserStatus(uuid: string) {
    try {
      const response = await axios.get("/user/status/" + uuid);
      return response.data;
    }
    catch (error) {
      console.error("Error fetching user status:", error);
      throw error;
    }
  },
}

export default UserAPI;