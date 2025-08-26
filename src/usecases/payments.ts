import { AuthUser } from "@supabase/supabase-js";
import { supabase } from '@/lib/supabase';

export interface PaymentRecord {
  userId: string;
  
  studentStatus: 'politechnika' | 'other' | 'not-student';
  emergencyContactNameSurname: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;

  needsTransport: boolean;
  medicalConditions?: string;
  medications?: string;

  paymentConfirmationFile: {
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
}

export async function createPayment(
  user: AuthUser,
  paymentData: Omit<PaymentRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const { data, error } = await supabase.from('payments').insert([
      {
        ...paymentData,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    } as PaymentRecord;
  } catch (error) {
    console.error('Error getting payment:', error);
    throw new Error('Failed to get payment');
  }
};

export const updatePayment = async (
  paymentId: string,
  updates: Partial<PaymentRecord>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', paymentId);
    if (error) throw error;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw new Error('Failed to update payment');
  }
};