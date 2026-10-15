export const env = {
  // API
  apiUrl:    process.env.NEXT_PUBLIC_API_URL    || 'http://localhost:4000/api',
  wsUrl:     process.env.NEXT_PUBLIC_WS_URL     || 'ws://localhost:4000',
  
  // Firebase
  firebase: {
    apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBI5KLQPRt1HXBIUeRl8SGaDy5hsRbSLWk',
    authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'career-bridge-01-b661b.firebaseapp.com',
    projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'career-bridge-01-b661b',
    storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'career-bridge-01-b661b.firebasestorage.app',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '267870081629',
    appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:267870081629:web:b4a7cdc63ced32972af3b4',
  },

  // App Settings
  useMock:   process.env.NEXT_PUBLIC_USE_MOCK   === 'true',
  nodeEnv:   process.env.NODE_ENV               || 'development',
  isProd:    process.env.NODE_ENV               === 'production',
  isDev:     process.env.NODE_ENV               !== 'production',

  // External APIs
  rapidApi: {
    key:  process.env.RAPIDAPI_KEY || 'c884b018eemshc5207a81b6e1ef9p1cebcbjsn3f6ab007f0dc',
    host: 'jsearch.p.rapidapi.com',
  },

  // Realtime Mentoring
  realtimeMentoring: {
    apiKey: process.env.REALTIME_MENTORING_API_KEY || process.env.NEXT_PUBLIC_REALTIME_MENTORING_API_KEY || '384d8cd5f11d81dfac087fea2c8d5bf034a96c6f',
  },
} as const;

