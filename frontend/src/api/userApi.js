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
    editProfile: async (token, updateData) => {
        console.log(updateData, updateData.familyName, updateData.givenName, updateData.phoneNumber);
        
        try {
            const response = await axiosClient.put("users/editprofile", {
                    family_name: updateData.family_name,
                    given_name: updateData.given_name,
                    phone_number: updateData.phone_number,
                    birthday: updateData.birthday,
                    nationality: updateData.nationality,
                    membership: updateData.membership
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response);
                
            return response.data;
        } catch (error) {
            console.error("Error: ", error);
            throw error.response;
        }
    }
};
  

export default user;
