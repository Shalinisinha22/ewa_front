const BASE_API_URL = 'http://localhost:5000/api';
const IMG_URL = 'http://localhost:5000/uploads/';

const API = {
    endpoints: {
        products: `${BASE_API_URL}/products`,
        users: `${BASE_API_URL}/users`,
        orders: `${BASE_API_URL}/orders`,
        auth: `${BASE_API_URL}/auth`
    },

    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        const defaultHeaders = {
            'Content-Type': 'application/json'
        };

        if (token) {
            defaultHeaders.Authorization = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };

        try {
            const response = await fetch(endpoint, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    getImageUrl(imagePath) {
        return imagePath ? `${IMG_URL}${imagePath}` : null;
    }
};

export default API;