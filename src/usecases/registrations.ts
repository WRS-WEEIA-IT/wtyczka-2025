import { User } from "@supabase/supabase-js";
import { supabase } from '@/lib/supabase';

export interface RegistrationRecord {
  userId: string;

  name: string;
  surname: string;
  dob: Date;
  email: string;
  phoneNumber: string;
  pesel: string;
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

  qualified?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const createRegistration = async (
  user: User,
  registrationData: Omit<RegistrationRecord, 'id' | 'userId' | 'email' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { id: user.id, email: user.email }, registration: registrationData })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'Failed to create registration');
    return json.id as string;
  } catch (error) {
    console.error('Error creating registration:', error);
    throw new Error('Failed to create registration');
  }
};

export const getRegistration = async (userId: string): Promise<RegistrationRecord | null> => {
  try {
    const res = await fetch(`/api/registrations?userId=${encodeURIComponent(userId)}`);
    const json = await res.json();
    const data = json?.data;
    if (!data) return null;
    return {
      ...data,
      dob: new Date(data.dob),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    } as RegistrationRecord;
  } catch (error) {
    console.error('Error getting registration:', error);
    throw new Error('Failed to get registration');
  }
};

export const updateRegistration = async (
  registrationId: string,
  updates: Partial<RegistrationRecord>
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