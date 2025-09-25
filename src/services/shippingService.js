import API from '../api';

export const shippingService = {
    // Get shipping settings for current store
    async getShippingSettings() {
        try {
            const response = await API.request(API.endpoints.shippingSettings);
            return response;
        } catch (error) {
            console.error('Error fetching shipping settings:', error);
            throw error;
        }
    },

    // Calculate shipping cost based on cart total and selected zone
    calculateShippingCost(cartTotal, selectedZone, shippingSettings) {
        if (!shippingSettings || !selectedZone) {
            return 0;
        }

        // Check if free shipping threshold is met
        if (cartTotal >= shippingSettings.freeShippingThreshold) {
            return 0;
        }

        // Return zone-specific shipping cost
        return selectedZone.cost || shippingSettings.defaultShippingCost;
    },

    // Get available shipping zones
    getAvailableZones(shippingSettings) {
        if (!shippingSettings || !shippingSettings.zones) {
            return [];
        }
        return shippingSettings.zones.filter(zone => zone.isActive !== false);
    },

    // Find shipping zone by name
    findZoneByName(zones, zoneName) {
        return zones.find(zone => zone.name === zoneName);
    },

    // Get default shipping zone
    getDefaultZone(shippingSettings) {
        const zones = this.getAvailableZones(shippingSettings);
        return zones.length > 0 ? zones[0] : null;
    }
};
