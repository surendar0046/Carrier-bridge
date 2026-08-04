import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../firebase';
import { UserProfile, UserRole } from '@career-bridge/types';

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
      // Prioritize Firestore name, but use Firebase Auth displayName as override
      const name = user.displayName || data.name || user.email?.split('@')[0] || 'User';
      return {
        role: data.role || UserRole.STUDENT,
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
        skills: [],
        xp: 0,
        level: 1,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        education: [],
        experience: [],
        certifications: [],
        languages: [],
        ...data,
        // These must always come from Firebase Auth, not Firestore
        id: user.uid,
        email: user.email || data.email || '',
        name,
      } as UserProfile;
    }

    // Firestore doc missing — build profile from Firebase Auth data and auto-create the doc
    const name = user.displayName || user.email?.split('@')[0] || 'User';
    const fallbackProfile: UserProfile = {
      id: user.uid,
      email: user.email || '',
      name,
      role: UserRole.STUDENT,
      avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
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

    // Auto-create the missing Firestore document so future fetches work
    try {
      await setDoc(docRef, {
        uid: user.uid,
        name,
        email: user.email || '',
        role: 'student',
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
    // For real implementation, use Firebase Storage
    // For now, return a placeholder or implement storage upload
    console.log('Avatar upload to storage not yet implemented');
    return '';
  },
};
