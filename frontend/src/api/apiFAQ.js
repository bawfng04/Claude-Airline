import axios from 'axios';
import axiosClient from "./apiManager";

const faq = {
  getAllFAQs: async () => {
    try {
      const response = await axiosClient.get('faq/getFaqs');
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

export default faq;