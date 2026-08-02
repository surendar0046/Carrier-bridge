export const env = {
  // API
  apiUrl:    process.env.NEXT_PUBLIC_API_URL    || 'http://localhost:4000/api',
  wsUrl:     process.env.NEXT_PUBLIC_WS_URL     || 'ws://localhost:4000',
  
  // Firebase
  firebase: {
    apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },

  // App Settings
  useMock:   process.env.NEXT_PUBLIC_USE_MOCK   === 'true',
  nodeEnv:   process.env.NODE_ENV               || 'development',
  isProd:    process.env.NODE_ENV               === 'production',
  isDev:     process.env.NODE_ENV               !== 'production',

  // External APIs
  rapidApi: {
    key:  'c884b018eemshc5207a81b6e1ef9p1cebcbjsn3f6ab007f0dc',
    host: 'jsearch.p.rapidapi.com',
  }
} as const;
