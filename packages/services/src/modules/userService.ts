import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
      return {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || data.name || 'User',
        role: data.role || UserRole.STUDENT,
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}`,
        ...data
      } as UserProfile;
    }

    throw new Error('Profile not found');
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
