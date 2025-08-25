import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  FirestoreError 
} from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface UserProfile {
  id?: string;
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  
  // Profile data
  firstName?: string;
  lastName?: string;
  phone?: string;
  
  // System fields
  createdAt: Date;
  lastLoginAt: Date;
  isAdmin: boolean;
  
  // Registration status
  hasRegistration: boolean;
  hasPayment: boolean;
  applicationStatus: 'none' | 'submitted' | 'qualified' | 'not-qualified' | 'withdrawn';
}

export interface ParticipantRecord {
  id?: string;
  userId: string;
  email: string;
  
  // Participant Data
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  pesel: string;
  gender: 'male' | 'female' | 'other';
  
  // Student Data
  faculty: string;
  studentNumber: string;
  fieldOfStudy: string;
  studyLevel: 'bachelor' | 'master' | 'phd';
  studyYear: number;
  
  // Additional Info
  diet: string;
  tshirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  invoice: boolean;
  howDidYouKnow: string;
  
  // Consents
  acceptRegulations: boolean;
  dataProcessingConsent: boolean;
  privacyPolicy: boolean;
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'qualified' | 'not-qualified' | 'withdrawn';
  qualificationScore?: number;
  notes?: string;
}

export interface PaymentRecord {
  id?: string;
  userId: string;
  registrationId: string;
  
  studentStatus: 'politechnika' | 'other' | 'not-student';
  emergencyContactName: string;
  emergencyContactPhone: string;
  needsTransport: boolean;
  medicalConditions: string;
  medications: string;
  
  paymentConfirmationFile?: {
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: Date;
  };
  
  transferConfirmation: boolean;
  ageConfirmation: boolean;
  cancellationPolicy: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  amount: number;
  transferDetails?: string;
}

// User profile functions
export const createUserProfile = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await updateDoc(userRef, {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isAdmin: false,
        hasRegistration: false,
        hasPayment: false,
        applicationStatus: 'none',
      });
    } else {
      // Update last login
      await updateDoc(userRef, {
        lastLoginAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw new Error('Failed to create user profile');
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      lastLoginAt: docSnap.data().lastLoginAt?.toDate() || new Date(),
    } as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to get user profile');
  }
};

export const updateUserProfile = async (
  userId: string, 
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId);
    
    // Use setDoc with merge to create or update the document
    await setDoc(docRef, {
      userId: userId,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isAdmin: false,
      hasRegistration: false,
      hasPayment: false,
      applicationStatus: 'none',
      ...updates
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

export const createRegistration = async (
  user: User, 
  registrationData: Omit<ParticipantRecord, 'id' | 'userId' | 'email' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'registrations'), {
      ...registrationData,
      userId: user.uid,
      email: user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
    });
    
    // Update user profile
    await updateUserProfile(user.uid, { 
      email: user.email || '',
      hasRegistration: true,
      applicationStatus: 'submitted'
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating registration:', error);
    throw new Error('Failed to create registration');
  }
};

export const getRegistration = async (userId: string): Promise<ParticipantRecord | null> => {
  try {
    const q = query(
      collection(db, 'registrations'), 
      where('userId', '==', userId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as ParticipantRecord;
  } catch (error) {
    console.error('Error getting registration:', error);
    throw new Error('Failed to get registration');
  }
};

export const updateRegistration = async (
  registrationId: string, 
  updates: Partial<ParticipantRecord>
): Promise<void> => {
  try {
    const docRef = doc(db, 'registrations', registrationId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    throw new Error('Failed to update registration');
  }
};

export async function createPayment(
  user: User,
  registrationId: string,
  paymentData: Omit<PaymentRecord, 'id' | 'userId' | 'registrationId' | 'createdAt' | 'updatedAt' | 'paymentStatus' | 'amount'>
): Promise<string> {
  try {    
    const docRef = await addDoc(collection(db, 'payments'), {
      ...paymentData,
      userId: user.uid,
      registrationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentStatus: 'pending',
      amount: 400,
    });
    
    // Update user profile
    //await updateUserProfile(user.uid, { hasPayment: true });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Failed to create payment');
  }
};

export const getPayment = async (userId: string): Promise<PaymentRecord | null> => {
  try {
    const queryResult = query(
      collection(db, 'payments'), 
      where('userId', '==', userId),
      limit(1)
    );
    const querySnapshot = await getDocs(queryResult);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as PaymentRecord;
  } catch (error) {
    console.error('Error getting payment:', error);
    throw new Error('Failed to get payment');
  }
};