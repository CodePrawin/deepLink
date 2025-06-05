const PLATFORMS = {
  android: {
    userAgent: /Android/i,
    scheme: (path) => `${APP_CONFIG.customScheme}://${path}`,
    intent: (path) => `intent://${path}#Intent;scheme=${APP_CONFIG.customScheme};package=${APP_CONFIG.androidPackage};S.browser_fallback_url=${encodeURIComponent(APP_CONFIG.playStoreUrl)};end`,
    storeUrl: APP_CONFIG.playStoreUrl
  },
  ios: {
    userAgent: /iPhone|iPad|iPod/i,
    scheme: (path) => `${APP_CONFIG.customScheme}://${path}`,
    storeUrl: APP_CONFIG.appStoreUrl
  },
  desktop: {
    userAgent: /(?!.*Mobile)/,
    storeUrl: APP_CONFIG.playStoreUrl // Default to Android
  }
};

if (typeof window !== 'undefined') {
  window.PLATFORMS = PLATFORMS;
}

if (typeof module !== 'undefined') {
  module.exports = PLATFORMS;
}