import API from '../../api';

export const taxService = {
    // Get tax settings for current store
    async getTaxSettings() {
        try {
            const response = await API.request(API.endpoints.taxSettings);
            return response;
        } catch (error) {
            console.error('Error fetching tax settings:', error);
            throw error;
        }
    },

    // Calculate tax amount based on subtotal and active tax rates
    calculateTax(subtotal, taxSettings) {
        if (!taxSettings || !Array.isArray(taxSettings)) {
            return 0;
        }

        let totalTax = 0;
        const activeTaxes = taxSettings.filter(tax => tax.isActive);

        activeTaxes.forEach(tax => {
            const taxAmount = (subtotal * tax.rate) / 100;
            totalTax += taxAmount;
        });

        return totalTax;
    },

    // Get active tax rates
    getActiveTaxRates(taxSettings) {
        if (!taxSettings || !Array.isArray(taxSettings)) {
            return [];
        }
        return taxSettings.filter(tax => tax.isActive);
    },

    // Get tax breakdown
    getTaxBreakdown(subtotal, taxSettings) {
        if (!taxSettings || !Array.isArray(taxSettings)) {
            return [];
        }

        const activeTaxes = taxSettings.filter(tax => tax.isActive);
        return activeTaxes.map(tax => ({
            name: tax.name,
            rate: tax.rate,
            amount: (subtotal * tax.rate) / 100
        }));
    }
};
