import axios from './configureAxios';

const GroupAPI = {
  async getGroup(groupName: string) {
    try {
      const response = await axios.get('/group/fetch/' + groupName );
      if (response.status !== 200) {
        throw new Error(`Error fetching group data: ${response.statusText}`);
      }
      if (!response.data) {
        throw new Error('No data found for the specified group');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching group data:', error);
      throw error;
    }
  },
};

export default GroupAPI;