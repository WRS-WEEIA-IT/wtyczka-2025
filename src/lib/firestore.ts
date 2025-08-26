import { AuthUser } from "@supabase/supabase-js";
import { supabase } from './supabase';

export interface UserProfile {
  id?: string;
  userId: string;
  email: string;
  
  firstName?: string;
  lastName?: string;
  phone?: string;
  
  createdAt: Date;
  lastLoginAt: Date;
  
  hasRegistration: boolean;
  hasPayment: boolean;
  applicationStatus: 'none' | 'submitted' | 'qualified' | 'not-qualified' | 'withdrawn';
}

export interface ParticipantRecord {
  id: number;
  userId: string;

  name: string;
  surname: string;
  dob: Date;
  email: string;
  phoneNumber: string;
  pesel: number;
  gender: 'male' | 'female' | 'other';

  faculty: 'w1' | 'w2' | 'w3' | 'w4' | 'w5' | 'w6' | 'w7' | 'w8' | 'w9';
  studentNumber: number;
  studyField: string;
  studyLevel: 'bachelor' | 'master' | 'phd';
  studyYear: 1 | 2 | 3 | 4;

  dietName: 'standard' | 'vegetarian';
  tshirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  
  invoice: boolean;
  invoiceName?: string;
  invoiceSurname?: string;
  invoiceId?: string;
  invoiceAddress?: string;

  aboutWtyczka: 'social-media' | 'akcja-integracja' | 'friend' | 'stands' | 'other';
  aboutWtyczkaInfo?: string;

  regAccept: boolean;
  rodoAccept: boolean;

  createdAt: Date;
  updatedAt: Date;
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
export const createUserProfile = async (user: AuthUser): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('userId', user.id)
      .single();
    if (!data) {
      const { error: insertError } = await supabase.from('users').insert([
        {
          userId: user.id,
          email: user.email,
          displayName: user.user_metadata?.displayName,
          photoURL: user.user_metadata?.photoURL,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isAdmin: false,
          hasRegistration: false,
          hasPayment: false,
          applicationStatus: 'none',
        },
      ]);
      if (insertError) throw insertError;
    } else {
      const { error: updateError } = await supabase
        .from('users')
        .update({ lastLoginAt: new Date().toISOString() })
        .eq('userId', user.id);
      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw new Error('Failed to create user profile');
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      ...data,
      createdAt: new Date(data.createdAt),
      lastLoginAt: new Date(data.lastLoginAt),
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
    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        lastLoginAt: new Date().toISOString(),
      })
      .eq('userId', userId);
    if (error) throw error;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

export const createRegistration = async (
  user: AuthUser,
  registrationData: Omit<ParticipantRecord, 'id' | 'userId' | 'email' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const { data, error } = await supabase.from('registrations').insert([
      {
        over18: true, // TODO: zrobić check do tego.
        userId: user.id,

        name: registrationData.name,
        surname: registrationData.surname,
        dob: registrationData.dob,
        email: user.email,
        phoneNumber: registrationData.phoneNumber,
        pesel: registrationData.pesel,
        gender: registrationData.gender,

        faculty: registrationData.faculty,
        studentNumber: registrationData.studentNumber,
        studyField: registrationData.studyField,
        studyLevel: registrationData.studyLevel,
        studyYear: registrationData.studyYear,

        dietName: registrationData.dietName,
        tshirtSize: registrationData.tshirtSize,

        invoice: registrationData.invoice,
        invoiceName: registrationData.invoiceName,
        invoiceSurname: registrationData.invoiceSurname,
        invoiceId: registrationData.invoiceId,
        invoiceAddress: registrationData.invoiceAddress,

        aboutWtyczka: registrationData.aboutWtyczka,
        aboutWtyczkaInfo: registrationData.aboutWtyczkaInfo,

        regAccept: registrationData.regAccept,
        rodoAccept: registrationData.rodoAccept,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]).select();
    if (error || !data || !data[0]) throw error || new Error('No registration created');
    return data[0].id;
  } catch (error) {
    console.error('Error creating registration:', error);
    throw new Error('Failed to create registration');
  }
};

export const getRegistration = async (userId: string): Promise<ParticipantRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('userId', userId)
      .limit(1)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
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
    const { error } = await supabase
      .from('registrations')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', registrationId);
    if (error) throw error;
  } catch (error) {
    console.error('Error updating registration:', error);
    throw new Error('Failed to update registration');
  }
};

export async function createPayment(
  user: AuthUser,
  registrationId: number,
  paymentData: Omit<PaymentRecord, 'id' | 'userId' | 'registrationId' | 'createdAt' | 'updatedAt' | 'paymentStatus' | 'amount'>
): Promise<string> {
  try {
    const { data, error } = await supabase.from('payments').insert([
      {
        ...paymentData,
        userId: user.id,
        registrationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentStatus: 'pending',
        amount: 400,
      },
    ]).select();
    if (error || !data || !data[0]) throw error || new Error('No payment created');
    return data[0].id;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Failed to create payment');
  }
}

export const getPayment = async (userId: string): Promise<PaymentRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('userId', userId)
      .limit(1)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    } as PaymentRecord;
  } catch (error) {
    console.error('Error getting payment:', error);
    throw new Error('Failed to get payment');
  }
};