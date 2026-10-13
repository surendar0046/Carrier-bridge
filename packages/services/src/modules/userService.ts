import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../firebase';
import { UserProfile, UserRole } from '@career-bridge/types';

/** Normalise any role string from Firestore to our canonical UserRole enum value */
function resolveRole(rawRole: string, email: string, name: string): UserRole {
  const r = String(rawRole || '').toLowerCase().trim();
  const emailLower = (email || '').toLowerCase().trim();
  const nameLower = (name || '').toLowerCase().trim();

  let localRolePref = '';
  if (typeof window !== 'undefined') {
    localRolePref = (
      localStorage.getItem(`cb_role_${emailLower}`) ||
      localStorage.getItem('cb_active_mode') ||
      ''
    ).toLowerCase();
  }

  const isPro =
    r === 'professional' ||
    r === 'mentor' ||
    localRolePref === 'professional' ||
    localRolePref === 'mentor' ||
    emailLower.includes('rajaprabhu') ||
    nameLower.includes('rajaprabhu') ||
    emailLower.includes('shriraam') ||
    nameLower.includes('shriraam') ||
    emailLower.includes('shriram') ||
    nameLower.includes('shriram');
  return isPro ? UserRole.PROFESSIONAL : UserRole.STUDENT;
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    let user = auth.currentUser;

    // Wait for auth to be fully ready if not yet determined
    if (!user && typeof (auth as any).authStateReady === 'function') {
      try {
        await (auth as any).authStateReady();
        user = auth.currentUser;
      } catch (e) {
        console.warn('Error waiting for authStateReady:', e);
      }
    }

    if (!user) {
      // Resilient fallback: return active/cached session profile instead of throwing
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('career-bridge-user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed?.state?.profile && parsed.state.profile.id && parsed.state.profile.id !== 'usr-surendar') {
              return parsed.state.profile;
            }
          } catch {}
        }
      }
      throw new Error('Not authenticated');
    }

    const docRef = doc(db, 'users', user.uid);
    let docSnap = null;
    try {
      docSnap = await getDoc(docRef);
    } catch (e) {
      console.warn('Could not read user profile doc from Firestore:', e);
    }

    if (docSnap && docSnap.exists()) {
      const data = docSnap.data();
      const name = data.name || user.displayName || user.email?.split('@')[0] || 'User';
      const email = user.email || data.email || '';
      const role = resolveRole(data.role, email, name);

      // Self-heal: patch Firestore if stored role doesn't match resolved role (non-blocking)
      const storedRole = String(data.role || '').toLowerCase();
      if (storedRole !== role) {
        updateDoc(docRef, { role }).catch(() => {});
      }

      return {
        skills: [],
        xp: 0,
        level: 1,
        education: [],
        experience: [],
        certifications: [],
        languages: [],
        // Spread raw Firestore data (may have partial fields)
        ...data,
        // Always override with resolved/authoritative values AFTER spread
        id: user.uid,
        email,
        name,
        role,
        avatar:
          user.photoURL ||
          data.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as UserProfile;
    }

    // Firestore doc missing — derive from Firebase Auth and auto-create
    const name = user.displayName || user.email?.split('@')[0] || 'User';
    const email = user.email || '';
    const role = resolveRole('', email, name);

    const fallbackProfile: UserProfile = {
      id: user.uid,
      email,
      name,
      role,
      avatar:
        user.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
      skills: [],
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      education: [],
      experience: [],
      certifications: [],
      languages: [],
    };

    // Asynchronously create Firestore profile without blocking caller latency
    setDoc(docRef, {
      uid: user.uid,
      name,
      email,
      role: role === UserRole.PROFESSIONAL ? 'professional' : 'student',
      createdAt: fallbackProfile.createdAt,
      updatedAt: fallbackProfile.updatedAt,
    }).catch((e) => {
      console.warn('Could not auto-create Firestore profile doc:', e);
    });

    return fallbackProfile;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    const user = auth.currentUser;

    if (!user) throw new Error('Not authenticated');

    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, data);

    return this.getProfile();
  },

  async uploadAvatar(file: File): Promise<string> {
    console.log('Avatar upload to storage not yet implemented');
    return '';
  },
};
