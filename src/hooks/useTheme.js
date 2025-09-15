import { useStore } from '../context/StoreContext';

export const useTheme = () => {
  const { currentStore } = useStore();

  const getThemeColors = () => {
    if (!currentStore?.settings?.theme) {
      return {
        primaryColor: '#c30001',
        secondaryColor: '#292929'
      };
    }

    return {
      primaryColor: currentStore.settings.theme.primaryColor || '#c30001',
      secondaryColor: currentStore.settings.theme.secondaryColor || '#292929'
    };
  };

  const getLogo = () => {
    if (!currentStore?.logo) {
      return null;
    }
    return currentStore.logo;
  };

  const getFavicon = () => {
    if (!currentStore?.favicon) {
      return null;
    }
    return currentStore.favicon;
  };

  const getStoreName = () => {
    return currentStore?.name || 'EWA Luxe';
  };

  const getStoreSettings = () => {
    return currentStore?.settings || {};
  };

  return {
    theme: getThemeColors(),
    logo: getLogo(),
    favicon: getFavicon(),
    storeName: getStoreName(),
    settings: getStoreSettings(),
    isLoaded: !!currentStore
  };
};

