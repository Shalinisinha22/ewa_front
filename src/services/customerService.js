import API from "../../api";

const customerService = {
    // Get customer profile
    async getProfile() {
        return API.request(`${API.endpoints.customerAuth}/profile`, {
            method: 'GET'
        });
    },

    // Update customer profile
    async updateProfile(userData) {
        return API.request(`${API.endpoints.customerAuth}/profile`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    // Change password
    async changePassword(currentPassword, newPassword) {
        return API.request(`${API.endpoints.customerAuth}/change-password`, {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    },

    // Get customer orders
    async getOrders(page = 1, limit = 10) {
        const storeId = localStorage.getItem('storeId');
        return API.request(`${API.endpoints.orders}?page=${page}&limit=${limit}&storeId=${storeId}`, {
            method: 'GET'
        });
    },

    // Get order by ID
    async getOrderById(orderId) {
        return API.request(`${API.endpoints.orders}/${orderId}`, {
            method: 'GET'
        });
    },

    // Create order
    async createOrder(orderData) {
        return API.request(API.endpoints.orders, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    // Update order
    async updateOrder(orderId, orderData) {
        return API.request(`${API.endpoints.orders}/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify(orderData)
        });
    },

    // Cancel order
    async cancelOrder(orderId) {
        return API.request(`${API.endpoints.orders}/${orderId}/cancel`, {
            method: 'PUT'
        });
    }
};

export default customerService; 