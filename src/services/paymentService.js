import API from '../api';

export const paymentService = {
    // Get payment settings for current store
    async getPaymentSettings() {
        try {
            const response = await API.request(API.endpoints.paymentSettings);
            return response;
        } catch (error) {
            console.error('Error fetching payment settings:', error);
            throw error;
        }
    },

    // Get active payment gateways
    getActiveGateways(paymentSettings) {
        if (!paymentSettings || !Array.isArray(paymentSettings)) {
            return [];
        }
        return paymentSettings.filter(gateway => gateway.isActive);
    },

    // Get payment gateway by name
    getGatewayByName(paymentSettings, gatewayName) {
        if (!paymentSettings || !Array.isArray(paymentSettings)) {
            return null;
        }
        return paymentSettings.find(gateway => gateway.name === gatewayName);
    },

    // Check if COD is available and within limits
    isCODAvailable(paymentSettings, orderAmount) {
        const codGateway = this.getGatewayByName(paymentSettings, 'Cash on Delivery');
        if (!codGateway || !codGateway.isActive) {
            return false;
        }

        const maxAmount = codGateway.credentials?.maxAmount || 5000;
        return orderAmount <= maxAmount;
    },

    // Get COD charges
    getCODCharges(paymentSettings) {
        const codGateway = this.getGatewayByName(paymentSettings, 'Cash on Delivery');
        return codGateway?.credentials?.charges || 0;
    },

    // Get available payment methods for order amount
    getAvailablePaymentMethods(paymentSettings, orderAmount) {
        const activeGateways = this.getActiveGateways(paymentSettings);
        
        return activeGateways.filter(gateway => {
            if (gateway.name === 'Cash on Delivery') {
                return this.isCODAvailable(paymentSettings, orderAmount);
            }
            return true;
        });
    }
};
