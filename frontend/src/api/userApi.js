import axiosClient from "./apiManager";

const user = {
    getUserInfo: async (token) => { 
        try {
            const response = await axiosClient.get("users/getUserInfo", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error: ", error);
            throw error.response;
        }
    },
};
  

export default user;
