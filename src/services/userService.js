import API from "../../api";

const userService = {
    // Public endpoints
    async register(userData) {
        return API.request(API.endpoints.users, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async login(email, password) {
        return API.request(`${API.endpoints.users}/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    // Protected endpoints
    async getProfile() {
        return API.request(`${API.endpoints.users}/profile`, {
            method: 'GET'
        });
    },

    async updateProfile(userData) {
        return API.request(`${API.endpoints.users}/profile`, {
            method: 'PUT',
            body: JSON.stringify(userData)
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