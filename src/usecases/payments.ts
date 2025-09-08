import { User } from "@supabase/supabase-js";
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

  qualified?: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export async function createPayment(
  user: User,
  paymentData: Omit<PaymentRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { id: user.id }, payment: paymentData })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'Failed to create payment');
    return json.id as string;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Failed to create payment');
  }
}

export const getPayment = async (userId: string): Promise<PaymentRecord | null> => {
  try {
    const res = await fetch(`/api/payments?userId=${encodeURIComponent(userId)}`);
    const json = await res.json();
    const data = json?.data;
    if (!data) return null;
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