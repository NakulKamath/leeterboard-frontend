
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

  async getUserProfile(uuid: string) {
    try {
      const response = await axios.get("/user/profile/" + uuid);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
  async addUserToGroup(groupName: string, secret: string) {
    try {
      const response = await axios.post("/user/add", {
        uuid: localStorage.getItem("uuid") || "none",
        groupName: groupName,
        secret: secret
      });
      return response.data;
    } catch (error) {
      console.error("Error adding user to group:", error);
      throw error;
    }
  },
  async addAnonUserToGroup(groupName: string, secret: string) {
    try {
      const response = await axios.post("/user/add-anon", {
        username: localStorage.getItem("anon-username") || "none",
        groupName: groupName,
        secret: secret
      });
      return response.data;
    } catch (error) {
      console.error("Error adding anonymous user to group:", error);
      throw error;
    }
  },
  async removeUserFromGroup(groupName: string, username: string) {
    try {
      const response = await axios.post("/user/remove", {
        groupName: groupName,
        username: username
      });
      return response.data;
    } catch (error) {
      console.error("Error removing user from group:", error);
      throw error;
    }
  },
  async removeSelfFromGroup(groupName: string) {
    try {
      const response = await axios.post("/user/remove", {
        groupName: groupName,
        uuid: localStorage.getItem("uuid"),
        username: localStorage.getItem("anon-username")
      });
      return response.data;
    } catch (error) {
      console.error("Error removing self from group:", error);
      throw error;
    }
  }
}

export default UserAPI;