import { AuthUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface PaymentRecord {
  userId: string

  tulStudent: boolean
  dietName: 'standard' | 'vegan' | 'vegetarian' | 'gluten-free'
  emergencyContactNameSurname: string
  emergencyContactPhone: string
  emergencyContactRelation: string

  needsTransport: boolean
  hasMedicalConditions?: 'yes' | 'no'
  medicalConditions?: string
  takesMedications?: 'yes' | 'no'
  medications?: string
  tshirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
  hoodieSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
  pantsSize?: 'S' | 'M' | 'L' | 'XL' | 'XXL'
  sportsCard?: 'multisport' | 'medicover' | 'fitprofit' | 'other' | 'none'
  sportsCardOther?: string
  invoiceNeeded?: boolean
  invoiceName?: string
  invoiceSurname?: string
  invoiceId?: string
  invoiceAddress?: string
  street: string
  houseNumber: string
  apartmentNumber?: string | null
  postalCode: string
  locality: string
  birthDate?: string | null
  pesel?: string | null

  regAccept: boolean
  regRejectionReason?: string

  paymentConfirmationFile: {
    url: string
    fileName: string
    fileSize: number
    fileType: string
    uploadedAt: Date
  }

  transferConfirmation: boolean
  ageConfirmation: boolean
  cancellationPolicy: boolean

  qualified?: boolean

  createdAt: Date
  updatedAt: Date
}

export async function createPayment(
  user: AuthUser,
  paymentData: Omit<PaymentRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          ...paymentData,
          userId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
    if (error) throw error
    if (!data || !data[0]) throw new Error('No payment created')
    return data[0].id
  } catch (error) {
    const errorRecord =
      typeof error === 'object' && error !== null
        ? (error as Record<string, unknown>)
        : null
    const message =
      error instanceof Error
        ? error.message
        : typeof errorRecord?.message === 'string'
          ? errorRecord.message
          : String(error)
    const code = typeof errorRecord?.code === 'string' ? errorRecord.code : undefined

    console.error('Error creating payment:', { message, code })
    throw new Error(code ? `${message} (${code})` : message)
  }
}

export const getPayment = async (
  userId: string,
): Promise<PaymentRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('userId', userId)
      .limit(1)
      .single()
    if (error || !data) return null
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    } as PaymentRecord
  } catch (error) {
    console.error('Error getting payment:', error)
    throw new Error('Failed to get payment')
  }
}

export const updatePayment = async (
  paymentId: string,
  updates: Partial<PaymentRecord>,
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', paymentId)
    if (error) throw error
  } catch (error) {
    console.error('Error updating payment:', error)
    throw new Error('Failed to update payment')
  }
}
