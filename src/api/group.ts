import axios from './configureAxios';

const GroupAPI = {
  async getGroup(groupName: string, code: string | null = null) {
    try {
      console.log('Fetching group:', groupName, 'for user:', localStorage.getItem('uuid'), 'with code:', code, 'on page:');
      const response = await axios.get('/group/fetch/' + groupName + '/' + (localStorage.getItem('uuid') || localStorage.getItem('anon-username')) + '/' + (code || 'none'));
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
  async changeGroupPrivacy(groupName: string, privacy: boolean) {
    try {
      const response = await axios.post('/group/change-privacy', {
        groupName,
        privacy
      });
      if (response.status !== 200) {
        throw new Error(`Error changing group privacy: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      console.error('Error changing group privacy:', error);
      throw error;
    }
  },
  async changeGroupSecret(groupName: string, newSecret: string) {
    try {
      const response = await axios.post('/group/change-secret', {
        groupName,
        newSecret
      });
      if (response.status !== 200) {
        throw new Error(`Error changing group secret: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      console.error('Error changing group secret:', error);
      throw error;
    }
  },
  async createGroup(groupName: string, groupSecret: string, privacy: boolean, uuid: string) {
    try {
      const response = await axios.post('/group/create', {
        groupName,
        groupSecret,
        privacy,
        uuid
      });
      if (response.status !== 200) {
        throw new Error(`Error creating group: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },
  async deleteGroup(groupName: string, uuid: string) {
    try {
      const response = await axios.post('/group/delete', { groupName, uuid });
      if (response.status !== 200) {
        throw new Error(`Error deleting group: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  }
};

export default GroupAPI;