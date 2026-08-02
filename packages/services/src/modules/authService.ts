import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../firebase';
import { mapAuthError } from './authErrors';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginPayload { email: string; password: string; }
export interface SignupPayload { name: string; email: string; password: string; role?: string; }

const mapUserToTokens = async (user: FirebaseUser): Promise<AuthTokens> => {
  const token = await user.getIdToken();
  return {
    accessToken: token,
    refreshToken: user.refreshToken,
    expiresIn: 3600, // Firebase default
  };
};

export const authService = {
  async login({ email, password }: LoginPayload): Promise<AuthTokens> {
    const auth = getFirebaseAuth();
    try {
      // Explicitly set persistence to local browser storage
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const tokens = await mapUserToTokens(cred.user);
      if (typeof window !== 'undefined') localStorage.setItem('career_bridge_token', tokens.accessToken);
      return tokens;
    } catch (err: any) {
      const message = mapAuthError(err.code);
      throw new Error(message);
    }
  },

  async signup({ name, email, password, role }: SignupPayload): Promise<AuthTokens> {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    
    try {
      // Explicitly set persistence to local browser storage
      await setPersistence(auth, browserLocalPersistence);
      
      // 1. Create Auth User
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Run Profile Update and Firestore storage in parallel to save time
      await Promise.all([
        updateProfile(cred.user, { displayName: name }),
        setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          name,
          email,
          role: role || 'student',
          createdAt: new Date().toISOString(),
        })
      ]);

      const tokens = await mapUserToTokens(cred.user);
      if (typeof window !== 'undefined') localStorage.setItem('career_bridge_token', tokens.accessToken);
      return tokens;
    } catch (err: any) {
      const message = mapAuthError(err.code);
      throw new Error(message);
    }
  },

  async logout(): Promise<void> {
    const auth = getFirebaseAuth();
    await signOut(auth);
    if (typeof window !== 'undefined') localStorage.removeItem('career_bridge_token');
  },

  async refreshToken(): Promise<AuthTokens | null> {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) return null;
    const tokens = await mapUserToTokens(user);
    return tokens;
  },

  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, callback);
  },

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('career_bridge_token');
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },
};
