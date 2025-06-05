const APP_CONFIG = {
  // App Details
  appName: 'King Research Academy',
  appDescription: 'Welcome to King Research Academy, your go-to destination for comprehensive and research-backed courses in various academic disciplines. Our app offers a rich repository of educational content, meticulously curated by seasoned educators. Dive into subjects ranging from mathematics to literature, with engaging lessons designed to cater to diverse learning styles. King Research Academy prioritizes academic excellence through interactive lessons, quizzes, and a supportive community. Enhance your learning experience and unlock your full potential with King Research Academy. Download now and embark on a journey towards academic success.',
  customScheme: 'kingresearch',
  
  // Package Names
  androidPackage: 'com.kingresearch',
  iosAppId: 'id6503350906',
  iosTeamId: 'ABCDEF1234',
  
  // Store URLs
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.kingresearch',
  appStoreUrl: 'https://apps.apple.com/us/app/king-research/id6503350906',
  
  // Domain
  domain: 'https://deep-link-eta.vercel.app/',
  
  // Performance
  redirectTimeout: 2500,
  maxRetries: 2,
  
  // Security
  allowedOrigins: ['https://deep-link-eta.vercel.app/'],
  rateLimitWindow: 60000, // 1 minute
  maxRequestsPerWindow: 10 // 10 requests
};

// Export for browser
if (typeof window !== 'undefined') {
  window.APP_CONFIG = APP_CONFIG;
}

// Export for Node.js
if (typeof module !== 'undefined') {
  module.exports = APP_CONFIG;
}