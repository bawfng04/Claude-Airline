import axiosClient from "./apiManager";

const user = {
    getUserInfo: async (user_id) => { 
        try {
            const response = await axiosClient.post("users/getUserInfo", {
                user_id: user_id,
            });
            return response.data;
        } catch (error) {
            console.error("Error: ", error);
            throw error.response;
        }
    },
};
  

export default user;
