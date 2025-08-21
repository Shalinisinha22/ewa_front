import API from "../../api";

const userService = {
    // Customer auth endpoints
    async register(userData) {
        return API.request(`${API.endpoints.customerAuth}/signup`, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async login(email, password, storeName) {
        return API.request(`${API.endpoints.customerAuth}/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password, storeName })
        });
    },

    async getProfile() {
        return API.request(`${API.endpoints.customerAuth}/profile`, {
            method: 'GET'
        });
    },

    async updateProfile(userData) {
        return API.request(`${API.endpoints.customerAuth}/profile`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    async changePassword(currentPassword, newPassword) {
        return API.request(`${API.endpoints.customerAuth}/change-password`, {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    },



    // Admin endpoints
    async getAllUsers() {
        return API.request(API.endpoints.users, {
            method: 'GET'
        });
    },

    async deleteUser(userId) {
        return API.request(`${API.endpoints.users}/${userId}`, {
            method: 'DELETE'
        });
    },

    async getUserById(userId) {
        return API.request(`${API.endpoints.users}/${userId}`, {
            method: 'GET'
        });
    },

    async updateUser(userId, userData) {
        return API.request(`${API.endpoints.users}/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }
};

export default userService;