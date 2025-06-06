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
}

export default UserAPI;