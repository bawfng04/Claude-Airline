import axiosClient from "./apiManager";

const AboutUs = {
    getAllAboutUs: async () => {
    try {
      const response = await axiosClient.get('aboutus/getAboutUs');
      if (response.status !== 200) {
        throw new Error('Failed to fetch FAQs');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs: ', error);
      throw error;
    }
  },
    getAllAchievements: async () => {
    try {
      const response = await axiosClient.get('achievements/getAchievements');
      if (response.status !== 200) {
        throw new Error('Failed to fetch FAQs');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs: ', error);
      throw error;
    }
  },
    getAllExperiences: async () => {
    try {
      const response = await axiosClient.get('airlineexperience/getExperiences');
      if (response.status !== 200) {
        throw new Error('Failed to fetch FAQs');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs: ', error);
      throw error;
    }
  },
    getAllFleets: async () => {
    try {
      const response = await axiosClient.get('airlinefleet/getFleets');
      if (response.status !== 200) {
        throw new Error('Failed to fetch FAQs');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs: ', error);
      throw error;
    }
  },
    getAllCoreValues: async () => {
    try {
      const response = await axiosClient.get('corevalue/getCoreValues');
      if (response.status !== 200) {
        throw new Error('Failed to fetch FAQs');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs: ', error);
      throw error;
    }
  },
    getLeadershipTeam: async () => {
    try {
      const response = await axiosClient.get('leadershipteam/getTeams');
      if (response.status !== 200) {
        throw new Error('Failed to fetch FAQs');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs: ', error);
      throw error;
    }
  },
};

export default AboutUs;