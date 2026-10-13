import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../firebase';
import { mapAuthError } from './authErrors';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  uid?: string;
}

export interface LoginPayload { email: string; password: string; }
export interface SignupPayload { name: string; email: string; password: string; role?: string; }

const mapUserToTokens = async (user: FirebaseUser): Promise<AuthTokens> => {
  const token = (user as any).accessToken || (await user.getIdToken());
  return {
    accessToken: token,
    refreshToken: user.refreshToken,
    expiresIn: 3600, // Firebase default
    uid: user.uid,
  };
};

export const authService = {
  async login({ email, password }: LoginPayload): Promise<AuthTokens> {
    const auth = getFirebaseAuth();
    try {
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
      // 1. Create Auth User in Firebase
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Immediately retrieve tokens synchronously from user
      const token = (cred.user as any).accessToken || (await cred.user.getIdToken());
      const tokens: AuthTokens = {
        accessToken: token,
        refreshToken: cred.user.refreshToken,
        expiresIn: 3600,
        uid: cred.user.uid,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('career_bridge_token', tokens.accessToken);
      }

      // 3. Fire-and-forget background synchronization (zero latency impact)
      updateProfile(cred.user, { displayName: name }).catch(() => {});
      setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name,
        email,
        role: role || 'student',
        createdAt: new Date().toISOString(),
      }).catch(() => {});

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

  async resetPassword(email: string): Promise<void> {
    const auth = getFirebaseAuth();
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      const message = mapAuthError(err.code);
      throw new Error(message);
    }
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
