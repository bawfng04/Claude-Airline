import axiosClient from "./apiManager";

const authen = {
    register: async (family_name, given_name, email, password, phone_number, birthday, nationality, membership) => { 
        try {
            const response = await axiosClient.post("users/register", {
                family_name: family_name,
                given_name: given_name,
                email: email,
                password: password,
                phone_number: phone_number,
                birthday: birthday,
                nationality: nationality,
                membership: membership,
                });
            return response.data;
        } catch (error) {
            console.error("Error: ", error);
            throw error.response;
        }
    },
    login: async (email, password) => { 
        
        try {
            const response = await axiosClient.post("users/login", {
                email: email,
                password: password,
            });
            return response.data;
        } catch (error) {
            console.error("Error: ", error);
            throw error.response;
        }
    },
};
  

export default authen;
