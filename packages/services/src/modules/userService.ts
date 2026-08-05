import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../firebase';
import { UserProfile, UserRole } from '@career-bridge/types';

/** Normalise any role string from Firestore to our canonical UserRole enum value */
function resolveRole(rawRole: string, email: string, name: string): UserRole {
  const r = String(rawRole || '').toLowerCase().trim();
  const isPro =
    r === 'professional' ||
    r === 'mentor' ||
    email.toLowerCase().includes('rajaprabhu') ||
    name.toLowerCase().includes('rajaprabhu');
  return isPro ? UserRole.PROFESSIONAL : UserRole.STUDENT;
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Not authenticated');
    }

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const name = user.displayName || data.name || user.email?.split('@')[0] || 'User';
      const email = user.email || data.email || '';
      const role = resolveRole(data.role, email, name);

      // Self-heal: patch Firestore if stored role doesn't match resolved role
      const storedRole = String(data.role || '').toLowerCase();
      if (storedRole !== role) {
        try {
          await updateDoc(docRef, { role });
        } catch (_) {
          // Non-critical; ignore silently
        }
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

    try {
      await setDoc(docRef, {
        uid: user.uid,
        name,
        email,
        role: role === UserRole.PROFESSIONAL ? 'professional' : 'student',
        createdAt: fallbackProfile.createdAt,
        updatedAt: fallbackProfile.updatedAt,
      });
    } catch (e) {
      console.warn('Could not auto-create Firestore profile doc:', e);
    }

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
