// Force production backend URL for now to fix wishlist issue
const BASE_API_URL = 'https://ewa-back.vercel.app/api';
// const BASE_API_URL='http://localhost:5000/api'

const IMG_URL = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  ? 'http://localhost:5000'
  : 'https://ewa-back.vercel.app';


const API = {
    endpoints: {
        products: `${BASE_API_URL}/products`,
        publicProducts: `${BASE_API_URL}/products/public`,
        publicProductsByCategory: `${BASE_API_URL}/products/public/category`,
        publicNewArrivals: `${BASE_API_URL}/products/public/new-arrivals`,
        publicTrending: `${BASE_API_URL}/products/public/trending`,
        categories: `${BASE_API_URL}/categories`,
        publicCategories: `${BASE_API_URL}/categories/public`,
        stores: `${BASE_API_URL}/stores`,
        publicStore: `${BASE_API_URL}/stores/public`,
        users: `${BASE_API_URL}/users`,
        orders: `${BASE_API_URL}/orders`,
        customerOrders: `${BASE_API_URL}/auth/orders`,
        customerOrderCreate: `${BASE_API_URL}/auth/orders`,
        customerOrderDetails: `${BASE_API_URL}/auth/orders`,
        customerOrderCancel: `${BASE_API_URL}/auth/orders`,
        customerOrderReturn: `${BASE_API_URL}/auth/orders`,
        auth: `${BASE_API_URL}/auth`,
        customerAuth: `${BASE_API_URL}/auth`,
        banners: `${BASE_API_URL}/banners`,
        publicBanners: `${BASE_API_URL}/banners/public`,
        promoBanners: `${BASE_API_URL}/promo-banners`,
        publicPromoBanners: `${BASE_API_URL}/promo-banners/public`,
        shippingSettings: `${BASE_API_URL}/customers/store/shipping`,
        paymentSettings: `${BASE_API_URL}/customers/store/payment`,
        taxSettings: `${BASE_API_URL}/customers/store/tax`,
        payment: `${BASE_API_URL}/payment`,
        pages: `${BASE_API_URL}/pages`,
        publicPages: `${BASE_API_URL}/pages/public`,
        publicPageByType: `${BASE_API_URL}/pages/public/type`,
        footer: `${BASE_API_URL}/footer`,
        publicFooter: `${BASE_API_URL}/footer/public`,
        invoices: `${BASE_API_URL}/invoices`,
        invoiceDownload: `${BASE_API_URL}/invoices`,
        wishlist: `${BASE_API_URL}/wishlist`
    },

    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const storeId = localStorage.getItem('storeId');
        const storeName = localStorage.getItem('storeName');
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (token) {
            defaultHeaders.Authorization = `Bearer ${token}`;
        }

        if (storeId) {
            defaultHeaders['X-Store-ID'] = storeId;
        }

        const config = {
            method: options.method || 'GET',
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            mode: 'cors'
        };

        // Add body for non-GET requests
        if (options.body && config.method !== 'GET') {
            config.body = options.body;
        }

        // Add store parameter for public endpoints that need store identification
        if (endpoint.includes('/public') && !endpoint.includes('store=') && !endpoint.includes('storeId=')) {
            const separator = endpoint.includes('?') ? '&' : '?';
            
            // Use store ID if available (for logged-in users)
            if (storeId) {
                endpoint = `${endpoint}${separator}storeId=${encodeURIComponent(storeId)}`;
            }
            // Use store name if available
            else if (storeName) {
                endpoint = `${endpoint}${separator}store=${encodeURIComponent(storeName)}`;
            }
            // Fallback to default store for public endpoints
            else {
                endpoint = `${endpoint}${separator}store=ewa-luxe`;
            }
        }

        // Add store parameter for settings endpoints
        if ((endpoint.includes('/store/shipping') || endpoint.includes('/store/payment') || endpoint.includes('/store/tax'))) {
            const separator = endpoint.includes('?') ? '&' : '?';
            
            // After login: use store ID if available
            if (storeId) {
                endpoint = `${endpoint}${separator}storeId=${encodeURIComponent(storeId)}`;
            }
            // Before login: use store name
            else if (storeName) {
                endpoint = `${endpoint}${separator}store=${encodeURIComponent(storeName)}`;
            }
        }

        // Debug logging
        console.log('API Request:', {
            endpoint,
            fullUrl: endpoint,
            method: config.method,
            headers: config.headers,
            hasToken: !!token,
            hasStoreId: !!storeId,
            storeName: storeName,
            storeId: storeId,
            BASE_API_URL: BASE_API_URL
        });

        try {
            const response = await fetch(endpoint, config);
            
            // Debug response
            console.log('API Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });

            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                // If not JSON, get text response
                const textResponse = await response.text();
                console.error('Non-JSON response received:', textResponse);
                throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
            }

            if (!response.ok) {
                // Include status code in error message for better error handling
                const errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`;
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            // If it's already an error with status, re-throw it
            if (error.status) {
                throw error;
            }
            // For network errors or other issues, create a generic error
            const networkError = new Error(error.message || 'Network error');
            networkError.status = 0; // 0 indicates network error
            throw networkError;
        }
    },

    getImageUrl(imagePath) {
        // If the image path is already a complete URL (Cloudinary), return it as is
        if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
            return imagePath;
        }
        // Otherwise, prepend the backend URL (for legacy local uploads)
        return imagePath ? `${IMG_URL}${imagePath}` : null;
    }
};

export default API;
