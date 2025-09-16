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

    if (error || !data || !data[0]) {
      throw error || new Error('No registration created');
    }

    return data[0].id;
  } catch (error) {

    console.error('Error creating registration:', error);
    throw new Error('Failed to create registration');
  }
};

export const getRegistration = async (userId: string): Promise<RegistrationRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('userId', userId)
      .limit(1)
      .single();
    if (error || !data) return null;
    
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