'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Lock,
  CreditCard,
  AlertTriangle,
  Save,
  Eye,
  EyeOff,
  Upload,
  X,
  FileText,
  CheckCircle,
  Shield,
  Phone,
  Ambulance,
  ArrowRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { createPayment, getPayment, PaymentRecord } from '@/usecases/payments'
import { getRegistration, RegistrationRecord } from '@/usecases/registrations'
import { getDataValue, handleSupabaseError } from '@/lib/supabase'
import Image from 'next/image'
import {
  uploadPaymentConfirmation,
  validatePaymentFile,
  formatFileSize,
  FileUploadResult,
} from '@/lib/storage'
import { useYear } from '@/contexts/YearContext'

// Helper to show toast
const showLimitedToast = (
  content: React.ReactNode,
  options?: {
    duration?: number
    icon?: React.ReactNode
  },
) => {
  // Use toast's standard notification
  return toast.custom(
    (t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'} pointer-events-auto flex w-full max-w-md items-center rounded-lg bg-[#232323] p-4 text-white shadow-lg`}
      >
        {options?.icon && <div className="mr-2">{options.icon}</div>}
        <div>{content}</div>
      </div>
    ),
    {
      duration: options?.duration || 1200,
      position: 'bottom-right',
    },
  )
}

// Schema walidacji dla formularza płatności
const paymentSchema = z.object({
  adminPassword: z.string().min(1, 'Hasło administratora jest wymagane'),

  studentStatus: z
    .string()
    .min(1, 'Status studenta jest wymagany')
    .refine((val) => ['politechnika', 'other', 'not-student'].includes(val), {
      message: 'Status studenta jest wymagany',
    }),
  emergencyContactNameSurname: z
    .string()
    .min(2, 'Imię i nazwisko jest wymagane')
    .max(255, 'Imię i nazwisko nie może przekraczać 255 znaków')
    .regex(
      /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s]+$/,
      'Imię i nazwisko może zawierać tylko litery i spacje',
    ),
  emergencyContactPhone: z
    .string()
    .min(9, 'Numer telefonu musi mieć co najmniej 9 znaków')
    .max(20, 'Numer telefonu jest za długi')
    .regex(/^[0-9+]+$/, "Numer telefonu może zawierać tylko cyfry i znak '+'"),
  emergencyContactRelation: z
    .string()
    .min(1, 'Stopień pokrewieństwa jest wymagany')
    .max(50, 'Stopień pokrewieństwa nie może przekraczać 50 znaków'),
  needsTransport: z.boolean(),
  medicalConditions: z
    .string()
    .max(512, 'Stan zdrowia nie może przekraczać 512 znaków')
    .optional(),
  medications: z
    .string()
    .max(512, 'Lista przyjmowanych leków nie może przekraczać 512 znaków')
    .optional(),
  transferConfirmation: z.boolean().refine((val) => val === true, {
    message: 'Musisz potwierdzić wykonanie przelewu',
  }),
  ageConfirmation: z.boolean().refine((val) => val === true, {
    message: 'Musisz potwierdzić, że masz ukończone 18 lat',
  }),
  cancellationPolicy: z.boolean().refine((val) => val === true, {
    message: 'Musisz zaakceptować politykę anulowania',
  }),
})

type PaymentFormData = z.infer<typeof paymentSchema>

export default function PaymentPage() {
  const { user, loading } = useAuth()
  const { language } = useLanguage()

  const realLang = language || 'pl'

  const { year } = useYear()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [userRegistration, setUserRegistration] =
    useState<RegistrationRecord | null>(null)
  const [existingPayment, setExistingPayment] = useState<PaymentRecord | null>(
    null,
  )
  const [uploadedFile, setUploadedFile] = useState<FileUploadResult | null>(
    null,
  )
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isCancellationPolicyModalOpen, setIsCancellationPolicyModalOpen] =
    useState(false)

  // Payment open date logic
  const [isPaymentOpen, setIsPaymentOpen] = useState(false) // Start with closed
  const [isPageLoading, setIsPageLoading] = useState(true) // Add loading state
  const [defaultPrice, setDefaultPrice] = useState(500)
  const [transportDiscount, setTransportDiscount] = useState(100)

  // Function to check payment access that can be called multiple times
  const checkPaymentAccess = () => {
    setIsPageLoading(true) // Show loading state
    console.log('Checking payment form access...')

    // Add timestamp parameter to avoid browser caching
    const timestamp = new Date().getTime()

    // Sprawdzanie dostępności formularza płatności wyłącznie przez API
    fetch(`/api/check-access/payment-form?t=${timestamp}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Payment access API response:', data)
        // Ensure we're being strict about the access check
        const accessAllowed = data.access === true
        setIsPaymentOpen(accessAllowed)

        // Informacja o dacie nie jest już wykorzystywana
        setIsPageLoading(false) // Mark loading as complete
      })
      .catch((error) => {
        console.error('Error checking payment access:', error)
        // W przypadku błędu API, blokujemy dostęp
        setIsPaymentOpen(false)
        setIsPageLoading(false) // Mark loading as complete even on error
      })
  }

  useEffect(() => {
    // Call the function when component mounts
    checkPaymentAccess()
  }, [])

  useEffect(() => {
    const loadPaymentSettings = async () => {
      const [priceValue, discountValue] = await Promise.all([
        getDataValue('default_price'),
        getDataValue('transport_discount'),
      ])

      const parsedPrice = Number(priceValue)
      const parsedDiscount = Number(discountValue)
      if (Number.isFinite(parsedPrice)) setDefaultPrice(parsedPrice)
      if (Number.isFinite(parsedDiscount)) setTransportDiscount(parsedDiscount)
    }

    loadPaymentSettings().catch((error) =>
      console.error('Error loading payment settings:', error),
    )
  }, [])

  // Obliczanie dni do wydarzenia zostało usunięte, ponieważ nie jest już potrzebne

  // Check user's registration and payment status
  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        try {
          const [registration, payment] = await Promise.all([
            getRegistration(user.id),
            getPayment(user.id),
          ])

          setUserRegistration(registration)
          setExistingPayment(payment)
        } catch (error) {
          console.error('Error checking user status:', error)
        }
      }
    }

    checkUserStatus()
  }, [user])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
    trigger,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { needsTransport: false, studentStatus: '' },
    mode: 'onChange',
  })

  // Watch needsTransport value
  const needsTransportValue = watch('needsTransport')

  // Character count for textareas
  useEffect(() => {
    const updateCharCount = (elementId: string, value: string | undefined) => {
      const element = document.getElementById(elementId)
      if (element) {
        element.textContent = value ? String(value.length) : '0'
      }
    }

    const medicalConditions = watch('medicalConditions')
    const medications = watch('medications')

    updateCharCount('medicalConditionsCharCount', medicalConditions)
    updateCharCount('medicationsCharCount', medications)
  }, [watch])

  // Status state removed

  const adminPassword = watch('adminPassword')

  const checkAdminPassword = async () => {
    try {
      const res = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword?.toLowerCase() }),
      })
      const data = await res.json()

      // Check if the password is correct
      if (res.ok && data?.ok) {
        // If password is correct, authorize the user regardless of date
        // The API already checks if we should allow access
        setIsAuthorized(true)
        toast.success('Dostęp do formularza płatności został aktywowany')
      } else if (res.status === 401) {
        setError('adminPassword', {
          type: 'manual',
          message: 'Nieprawidłowe hasło!',
        })
      } else {
        const msg = data?.error || 'Błąd weryfikacji hasła'
        setError('adminPassword', { type: 'manual', message: msg })
      }
    } catch (_) {
      setError('adminPassword', {
        type: 'manual',
        message: 'Błąd połączenia z serwerem',
      })
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file
    const validationError = validatePaymentFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }

    setIsFileUploading(true)
    try {
      const uploadResult = await uploadPaymentConfirmation(file)
      setUploadedFile(uploadResult)
      toast.success('Plik został przesłany pomyślnie!')
    } catch (error) {
      console.error('File upload error:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Błąd podczas przesyłania pliku',
      )
    } finally {
      setIsFileUploading(false)
      // Clear the input
      event.target.value = ''
    }
  }

  const handleFileRemove = () => {
    setUploadedFile(null)
    toast.success('Plik został usunięty')
  }

  const onSubmit = async (data: PaymentFormData) => {
    // Wymuszenie konwersji needsTransport na boolean
    if (!isAuthorized) {
      toast.error('Musisz najpierw aktywować dostęp do formularza')
      return
    }

    if (!user || !userRegistration) {
      toast.error('Brak danych użytkownika lub rejestracji')
      return
    }

    if (!uploadedFile) {
      toast.error('Musisz przesłać potwierdzenie płatności')
      return
    }

    setIsSubmitting(true)
    try {
      // Usuwamy adminPassword z danych, które wysyłamy
      const { adminPassword: _, ...paymentData } = data

      const mappedPaymentRecord = {
        studentStatus: paymentData.studentStatus,
        emergencyContactNameSurname: paymentData.emergencyContactNameSurname,
        emergencyContactPhone: paymentData.emergencyContactPhone,
        emergencyContactRelation: paymentData.emergencyContactRelation,
        needsTransport: !paymentData.needsTransport, // Odwracamy logikę: checkbox zaznaczony = dojeżdża sam = NIE potrzebuje transportu
        medicalConditions: paymentData.medicalConditions,
        medications: paymentData.medications,
        transferConfirmation: paymentData.transferConfirmation,
        ageConfirmation: paymentData.ageConfirmation,
        cancellationPolicy: paymentData.cancellationPolicy,

        paymentConfirmationFile: {
          url: uploadedFile.url,
          fileName: uploadedFile.fileName,
          fileSize: uploadedFile.fileSize,
          fileType: uploadedFile.fileType,
          uploadedAt: new Date(),
        },
      } as Omit<
        PaymentRecord,
        'id' | 'userId' | 'registrationId' | 'createdAt' | 'updatedAt'
      >

      await createPayment(user, mappedPaymentRecord)
      toast.success('Formularz płatności został wysłany pomyślnie!')

      // Refresh payment data
      const payment = await getPayment(user.id)
      setExistingPayment(payment)
    } catch (error) {
      console.error('Submit error:', error)
      const errorMessage = handleSupabaseError(error, realLang)
      toast.error(`Wystąpił błąd: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Kalkulacja kwoty w zależności od opcji
  const calculateAmount = useMemo(() => {
    let baseAmount = defaultPrice

    // Jeśli dieta wegetariańska, dodaj 20zł
    if (userRegistration?.dietName === 'vegetarian') {
      baseAmount += 20
    }

    // Jeśli checkbox zaznaczony (dojeżdża samodzielnie), odlicz 100zł
    if (needsTransportValue) {
      baseAmount -= transportDiscount
    }

    return baseAmount
  }, [
    defaultPrice,
    transportDiscount,
    userRegistration?.dietName,
    needsTransportValue,
  ])

  const getAmountBreakdown = () => {
    const breakdown = []
    breakdown.push({
      label: 'Cena podstawowa',
      amount: `${defaultPrice}zł`,
      color: 'text-gray-500',
    })

    if (userRegistration?.dietName === 'vegetarian') {
      breakdown.push({
        label: '+ Dieta wegetariańska',
        amount: '+20zł',
        color: 'text-amber-400',
      })
    }

    if (needsTransportValue) {
      breakdown.push({
        label: '- Dojeżdżam samodzielnie',
        amount: `-${transportDiscount}zł`,
        color: 'text-green-400',
      })
    }

    return breakdown
  }

  const bankAccountDetails = {
    accountNumber: '03 1240 3028 1111 0010 3741 8675',
    recipient: 'Politechnika Łódzka',
    transferTitle: userRegistration
      ? `Wtyczka ${year} - ${userRegistration.name} ${userRegistration.surname}`
      : `Wtyczka ${year} - IMIE I NAZWISKO`,
    amount: `${calculateAmount}zł`,
  }

  // Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="wtyczka-loading-container">
        <div className="text-center">
          <Image
            src="/logo.svg"
            alt="Wtyczka Logo"
            className="wtyczka-loading-logo"
            width={150}
            height={150}
          />
          <div className="wtyczka-loading-text">Ładowanie...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md rounded-2xl border border-[#262626] bg-[#18181b] p-8 text-center shadow-xl">
          <div className="mb-4 text-6xl">🔒</div>
          <h1 className="mb-4 text-2xl font-bold text-amber-400">
            Dostęp ograniczony
          </h1>
          <p className="mb-6 text-gray-300">
            Aby wypełnić formularz płatności, musisz się najpierw zalogować.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-[#4fb3ff] px-6 py-3 font-semibold text-black transition-colors hover:bg-[#66d9ff]"
          >
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    )
  }

  // Show existing payment if already submitted
  if (existingPayment) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Szary/blur prostokąt za komunikatem */}
          <div className="relative mb-8 flex justify-center">
            <div
              className="absolute inset-0 mx-auto h-full w-full max-w-xl rounded-2xl"
              style={{
                background: 'rgba(36,36,36,0.85)',
                filter: 'blur(2.5px)',
                zIndex: 0,
              }}
            ></div>
            <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-4 py-8 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-900 p-4 shadow-lg">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h1 className="mb-2 text-3xl font-bold text-amber-400">
                Formularz płatności przyjęty!
              </h1>
              <p className="text-lg text-gray-300">
                Dziękujemy za wypełnienie formularza płatności
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-8 shadow-xl">
            {/* Uwaga / kontakt na dole */}
            <div className="mt-6 rounded-xl border-t border-[#262626] bg-[#1a1a1a] p-3 pt-4 sm:mt-8 sm:p-4 sm:pt-6">
              <div className="flex flex-col space-y-3 rounded-xl border-2 border-[#ff0033] bg-[#1a1a1a] p-3 shadow-[0_0_12px_2px_#ff0033] sm:flex-row sm:items-start sm:space-y-0 sm:space-x-3 sm:p-4">
                <AlertTriangle className="h-6 w-6 flex-shrink-0 self-center text-red-500 sm:mt-0.5 sm:self-start" />
                <div className="w-full">
                  <h3 className="text-center text-base font-semibold text-red-400 sm:text-left sm:text-lg">
                    Zauważyłeś błąd w swoich danych?
                  </h3>
                  <p className="mt-2 text-center text-sm text-gray-300 sm:text-left sm:text-base">
                    Jeśli jakiekolwiek dane zostały wprowadzone błędnie,
                    skontaktuj się z nami jak najszybciej:
                  </p>
                  <ul className="mt-3 space-y-3 sm:space-y-2">
                    <li className="flex flex-col space-y-2 rounded-lg bg-[#0f0f0f] p-2 sm:flex-row sm:items-center sm:space-y-0 sm:rounded-none sm:bg-transparent sm:p-0">
                      <div className="flex items-center justify-center sm:justify-start">
                        <span className="mr-2 rounded-full bg-red-900/40 p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-400"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </span>
                        <span className="font-medium text-gray-300 sm:text-base">
                          Telefon:
                        </span>
                      </div>
                      <a
                        href="tel:+48690150650"
                        className="text-center text-lg font-semibold text-red-400 transition-colors duration-200 hover:text-red-300 hover:underline sm:ml-1 sm:text-left sm:text-base sm:font-normal"
                      >
                        +48 690 150 650
                      </a>
                    </li>
                    <li className="flex flex-col space-y-2 rounded-lg bg-[#0f0f0f] p-2 sm:flex-row sm:items-center sm:space-y-0 sm:rounded-none sm:bg-transparent sm:p-0">
                      <div className="flex items-center justify-center sm:justify-start">
                        <span className="mr-2 rounded-full bg-red-900/40 p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-400"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </span>
                        <span className="font-medium text-gray-300 sm:text-base">
                          Email:
                        </span>
                      </div>
                      <a
                        href="mailto:wtyczka@samorzad.p.lodz.pl"
                        className="text-center text-base break-all text-red-400 transition-colors duration-200 hover:text-red-300 hover:underline sm:ml-1 sm:text-left sm:text-base sm:break-normal"
                      >
                        wtyczka@samorzad.p.lodz.pl
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-[#262626] bg-[#0F0F0F] p-6">
                <div className="mb-4 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-amber-400">
                    Dane zgłoszenia
                  </h3>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    <span className="text-gray-500">Status studenta:</span>{' '}
                    <span className="font-medium">
                      {existingPayment.studentStatus === 'politechnika'
                        ? 'Politechnika Łódzka'
                        : existingPayment.studentStatus === 'other'
                          ? 'Inna uczelnia'
                          : 'Nie student'}
                    </span>
                  </p>
                  <p
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    <span className="text-gray-500">Transport:</span>{' '}
                    <span className="font-medium">
                      {existingPayment.needsTransport ? 'Tak' : 'Nie'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#0F0F0F] p-6">
                <div className="mb-4 flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-amber-400">
                    Kontakt alarmowy
                  </h3>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    <span className="text-gray-500">Osoba:</span>{' '}
                    <span className="font-medium">
                      {existingPayment.emergencyContactNameSurname}
                    </span>
                  </p>
                  <p
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    <span className="text-gray-500">Telefon:</span>{' '}
                    <span className="font-medium">
                      {existingPayment.emergencyContactPhone}
                    </span>
                  </p>
                  <p
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    <span className="text-gray-500">Relacja:</span>{' '}
                    <span className="font-medium">
                      {existingPayment.emergencyContactRelation}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            {(existingPayment.medicalConditions ||
              existingPayment.medications) && (
              <div className="mt-6 rounded-xl border border-[#262626] bg-[#0F0F0F] p-6">
                <div className="mb-4 flex items-center">
                  <Ambulance className="mr-2 h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-amber-400">
                    Informacje medyczne
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  {existingPayment.medicalConditions && (
                    <p
                      style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      <span className="mb-1 block text-gray-500">
                        Stan zdrowia:
                      </span>{' '}
                      <span className="font-medium">
                        {existingPayment.medicalConditions}
                      </span>
                    </p>
                  )}
                  {existingPayment.medications && (
                    <p
                      style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      <span className="mb-1 block text-gray-500">
                        Przyjmowane leki:
                      </span>{' '}
                      <span className="font-medium">
                        {existingPayment.medications}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-xl border border-[#262626] bg-[#0F0F0F] p-6">
              <div className="mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-amber-400" />
                <h3 className="font-semibold text-amber-400">
                  Przesłane potwierdzenie płatności
                </h3>
              </div>

              <div className="rounded-md bg-[#232323] p-4">
                <p
                  className="mb-1 text-sm text-gray-300"
                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                >
                  Nazwa pliku:{' '}
                  <span className="text-amber-400">
                    {existingPayment.paymentConfirmationFile.fileName}
                  </span>
                </p>
                <p
                  className="mb-3 text-sm text-gray-300"
                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                >
                  Rozmiar:{' '}
                  <span className="text-amber-400">
                    {formatFileSize(
                      existingPayment.paymentConfirmationFile.fileSize,
                    )}
                  </span>
                </p>

                <a
                  href={existingPayment.paymentConfirmationFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="xs:mx-0 mx-auto mt-2 flex flex-col items-center justify-center rounded-xl bg-[#4fb3ff] px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#66d9ff] sm:mx-0 sm:flex-row md:mx-0 md:flex-row lg:mx-0 lg:flex-row xl:mx-0 xl:flex-row"
                  style={{
                    textAlign: 'center',
                    maxWidth: 'fit-content',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  <Eye className="mb-1 h-4 w-4 sm:mr-2 sm:mb-0 md:mr-2 md:mb-0 lg:mr-2 lg:mb-0 xl:mr-2 xl:mb-0" />
                  <span>Podgląd potwierdzenia</span>
                </a>
              </div>
            </div>

            <div className="mt-8 border-t border-[#262626] pt-6">
              <p className="mb-6 text-center text-sm text-gray-400">
                Status Twojego zgłoszenia możesz sprawdzić w panelu uczestnika.
              </p>

              <div className="flex justify-center">
                <Link
                  href="/status"
                  className="payment-primary-button inline-flex items-center rounded-xl px-6 py-3 font-semibold shadow-md transition-colors"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span>Sprawdź status</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if user is registered before allowing payment
  if (!userRegistration) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header with logo */}
          <section className="relative mb-8 overflow-hidden bg-black text-white">
            <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center text-center">
              <div className="flex flex-col items-center">
                <Image
                  src="/logo.svg"
                  alt="Logo wtyczka"
                  width={400}
                  height={150}
                  className="m-0 p-0 leading-none"
                  style={{ display: 'block', marginBottom: '-15px' }}
                />
                <p
                  className="m-0 p-0 text-xl leading-none text-white md:text-2xl"
                  style={{ marginTop: '-4px' }}
                >
                  {`Płatność za Wtyczkę ${year}`}
                </p>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-md rounded-2xl border border-[#262626] bg-[#18181b] p-8 text-center shadow-xl">
            <div className="mb-4 text-amber-500">
              <AlertTriangle className="mx-auto h-16 w-16" />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-amber-400">
              Wymagana rejestracja
            </h1>
            <p className="mb-6 text-gray-300">
              Aby dokonać płatności, musisz najpierw wypełnić formularz
              rejestracyjny.
            </p>
            <Link
              href="/registration"
              className="rounded-xl bg-[#4fb3ff] px-6 py-3 font-semibold text-black transition-colors hover:bg-[#66d9ff]"
            >
              Przejdź do rejestracji
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header like on news page, no logo */}
        <section className="mb-8 rounded-2xl border-b border-[#262626] bg-[#18181b] py-16 text-white shadow-xl">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-bold text-amber-400 md:text-5xl">
              Formularz płatności
            </h1>
            <p className="text-xl text-gray-200">
              {`Wypełnij formularz płatności za Wtyczkę ${year}`}
            </p>
          </div>
        </section>

        {/* Payment Access Section */}
        <div className="mx-auto max-w-lg">
          {isPageLoading ? (
            // Loading state
            <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-8 text-center shadow-lg">
              <div
                className="mb-6 flex flex-col items-center justify-center"
                style={{ minHeight: '120px' }}
              >
                <div className="text-xl text-white">Ładowanie...</div>
              </div>
            </div>
          ) : !isPaymentOpen ? (
            // Payment form not yet available
            <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-8 text-center shadow-lg">
              <div className="mb-6">
                <Lock className="mx-auto mb-4 h-10 w-10 text-amber-400" />
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Formularz płatności niedostępny
                </h2>
                <p className="mb-2 text-gray-400">
                  Możliwość autoryzacji i wysyłania formularza płatności
                  zostanie wkrótce otwarta.
                </p>
                <p className="text-sm text-gray-400">
                  Sprawdź aktualności na stronie, aby być na bieżąco!
                </p>

                <button
                  onClick={checkPaymentAccess}
                  className="mt-6 rounded-lg bg-amber-600 px-6 py-3 text-white shadow transition-colors hover:bg-amber-700"
                >
                  Sprawdź dostępność
                </button>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center text-sm text-amber-400 transition-colors hover:text-amber-300"
              >
                <ArrowRight className="mr-1 h-4 w-4" />
                <span>Przejdź do aktualności</span>
              </Link>
            </div>
          ) : !isAuthorized ? (
            // Password authorization section (only shown when payment date is reached)
            <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-8 shadow-lg">
              <div className="mb-6">
                <div className="flex flex-col items-center md:flex-row md:items-center">
                  <div className="mb-4 flex-shrink-0 rounded-full bg-[#262626] p-3 md:mr-4 md:mb-0">
                    <Lock className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white">
                      Autoryzacja hasłem
                    </h2>
                    <p className="text-gray-400">
                      Podaj tajny kod aby odblokować formularz
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="mb-2 block text-sm font-medium text-gray-300"
                  htmlFor="adminPassword"
                >
                  Hasło:
                </label>
                <div className="relative">
                  <input
                    id="adminPassword"
                    type={isPasswordVisible ? 'text' : 'password'}
                    {...register('adminPassword')}
                    className="w-full rounded-xl border border-[#262626] bg-[#232323] px-3 py-3 pr-10 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Wprowadź hasło..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        checkAdminPassword()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-amber-400"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.adminPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.adminPassword.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={checkAdminPassword}
                className="payment-primary-button flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold transition-colors"
              >
                <Lock className="mr-2 h-5 w-5" />
                <span>Weryfikuj hasło</span>
              </button>

              <div className="mt-6 border-t border-[#262626] pt-6 text-center">
                <p className="mb-2 text-sm text-gray-400">
                  Nie znasz tajnego hasła? Śledź na bieżąco aktualności!
                </p>
                <Link
                  href="/news"
                  className="inline-flex items-center text-sm text-amber-400 transition-colors hover:text-amber-300"
                >
                  <ArrowRight className="mr-1 h-4 w-4" />
                  <span>Przejdź do aktualności</span>
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* Payment form - visible only when authorized */}
        {isAuthorized && (
          <>
            {/* Ostrzeżenie o konsekwencjach podawania fałszywych danych */}
            <div className="mb-6 rounded-xl border border-red-700 bg-red-900/30 p-4">
              <div className="flex items-start">
                <AlertTriangle className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-red-400">UWAGA!</h3>
                  <p className="text-gray-200">
                    Podawanie fałszywych informacji (np. osoba niepełnoletnia w
                    dniu wyjazdu wpisująca fałszywą datę urodzenia) będzie
                    wiązało się z negatywnymi konsekwencjami - niedopuszczenie
                    uczestnika do wyjazdu oraz permanentny zakaz uczestniczenia
                    w przyszłych tego typu wyjazdach.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const valid = await trigger()
                if (!valid) {
                  return
                }
                handleSubmit(onSubmit)(e)
              }}
              className="space-y-8"
            >
              {/* Student status & emergency contact */}
              <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-8 shadow-xl">
                <div className="mb-6 flex items-center space-x-2 pb-4">
                  <Shield className="h-6 w-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Informacje dodatkowe
                  </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex h-full flex-col justify-end">
                    <div className="mb-2">
                      <label
                        className="mb-2 block text-sm font-medium text-gray-300"
                        htmlFor="studentStatus"
                      >
                        Status studenta <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div>
                      <select
                        id="studentStatus"
                        {...register('studentStatus')}
                        className="w-full rounded-xl border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="">Wybierz...</option>
                        <option value="politechnika">
                          Politechnika Łódzka
                        </option>
                        <option value="other">Inna uczelnia</option>
                        <option value="not-student">
                          Nie jestem studentem
                        </option>
                      </select>
                      {errors.studentStatus && (
                        <p className="mt-1 text-sm text-red-500">
                          Status studenta jest wymagany
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-gray-300"
                      htmlFor="needsTransport"
                    >
                      Czy dojeżdżasz samodzielnie (tam, z powrotem i na
                      atrakcje)?
                    </label>
                    <div className="flex h-10 items-center space-x-2">
                      <label className="flex cursor-pointer items-center gap-2 select-none">
                        <span className="custom-checkbox-container">
                          <input
                            id="needsTransport"
                            type="checkbox"
                            {...register('needsTransport')}
                            className="custom-checkbox-input"
                          />
                          <div className="custom-checkbox-glow"></div>
                          <div className="custom-checkbox-check">✓</div>
                        </span>
                        <span className="text-sm text-white">
                          Tak, dojeżdżam samodzielnie{' '}
                          <span className="font-medium text-green-400">
                            (-{transportDiscount} zł)
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-8 border-t border-[#262626] pt-6">
                  <h3 className="mb-4 flex items-center font-semibold text-amber-400">
                    <Phone className="mr-2 h-5 w-5" />
                    Kontakt w razie wypadku
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium text-gray-300"
                        htmlFor="emergencyContactNameSurname"
                      >
                        Imię i nazwisko <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="emergencyContactNameSurname"
                        type="text"
                        {...register('emergencyContactNameSurname')}
                        className="w-full rounded-xl border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        maxLength={255}
                      />
                      {errors.emergencyContactNameSurname && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.emergencyContactNameSurname.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label
                          className="mb-2 block text-sm font-medium text-gray-300"
                          htmlFor="emergencyContactPhone"
                        >
                          Numer telefonu <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="emergencyContactPhone"
                          type="tel"
                          {...register('emergencyContactPhone', {
                            setValueAs: (v) => String(v),
                          })}
                          className="w-full rounded-xl border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          maxLength={20}
                        />
                        {errors.emergencyContactPhone && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.emergencyContactPhone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Stopień pokrewieństwa{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register('emergencyContactRelation')}
                          className="w-full rounded-xl border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          placeholder="np. matka, ojciec, rodzeństwo"
                          maxLength={50}
                        />
                        {errors.emergencyContactRelation && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.emergencyContactRelation.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical information */}
                <div className="mt-8 border-t border-[#262626] pt-6">
                  <h3 className="mb-4 flex items-center font-semibold text-amber-400">
                    <Ambulance className="mr-2 h-5 w-5" />
                    Informacje medyczne (opcjonalne)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium text-gray-300"
                        htmlFor="medicalConditions"
                      >
                        Stan zdrowia / choroby
                      </label>
                      <textarea
                        id="medicalConditions"
                        {...register('medicalConditions')}
                        rows={3}
                        className="w-full rounded-xl border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="Podaj informacje o swoim stanie zdrowia, które mogą być istotne..."
                        maxLength={512}
                      ></textarea>
                      {errors.medicalConditions && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.medicalConditions.message}
                        </p>
                      )}
                      <p className="mt-1 text-right text-xs text-gray-500">
                        <span id="medicalConditionsCharCount">0</span>/512
                        znaków
                      </p>
                    </div>

                    <div>
                      <label
                        className="mb-2 block text-sm font-medium text-gray-300"
                        htmlFor="medications"
                      >
                        Przyjmowane leki
                      </label>
                      <textarea
                        id="medications"
                        {...register('medications')}
                        rows={2}
                        className="w-full rounded-xl border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="Podaj leki, które regularnie przyjmujesz..."
                        maxLength={512}
                      ></textarea>
                      {errors.medications && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.medications.message}
                        </p>
                      )}
                      <p className="mt-1 text-right text-xs text-gray-500">
                        <span id="medicationsCharCount">0</span>/512 znaków
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-8 shadow-xl">
                <div className="mb-6 flex items-center space-x-2 pb-4">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Zgody i oświadczenia
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <label className="flex cursor-pointer items-center select-none">
                      <span className="custom-checkbox-container">
                        <input
                          type="checkbox"
                          {...register('transferConfirmation')}
                          className="custom-checkbox-input"
                        />
                        <div className="custom-checkbox-glow"></div>
                        <div className="custom-checkbox-check">✓</div>
                      </span>
                      <span className="ml-3 text-gray-300">
                        Potwierdzam, że wykonałem/am przelew na wskazane konto
                        bankowe i załączyłem/am jego potwierdzenie.{' '}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                  {errors.transferConfirmation && (
                    <p className="text-sm text-red-500">
                      {errors.transferConfirmation.message}
                    </p>
                  )}

                  <div className="flex items-start">
                    <label className="flex cursor-pointer items-center select-none">
                      <span className="custom-checkbox-container">
                        <input
                          type="checkbox"
                          {...register('ageConfirmation')}
                          className="custom-checkbox-input"
                        />
                        <div className="custom-checkbox-glow"></div>
                        <div className="custom-checkbox-check">✓</div>
                      </span>
                      <span className="ml-3 text-gray-300">
                        Oświadczam, że mam ukończone 18 lat w dniu wyjazdu.{' '}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                  {errors.ageConfirmation && (
                    <p className="text-sm text-red-500">
                      {errors.ageConfirmation.message}
                    </p>
                  )}

                  <div className="flex items-start">
                    <label className="flex cursor-pointer items-center select-none">
                      <span className="custom-checkbox-container">
                        <input
                          type="checkbox"
                          {...register('cancellationPolicy')}
                          className="custom-checkbox-input"
                        />
                        <div className="custom-checkbox-glow"></div>
                        <div className="custom-checkbox-check">✓</div>
                      </span>
                      <span className="ml-3 text-gray-300">
                        Rozumiem i akceptuję{' '}
                        <button
                          type="button"
                          onClick={() => setIsCancellationPolicyModalOpen(true)}
                          className="text-amber-400 underline hover:text-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#18181b] focus:outline-none"
                        >
                          politykę anulowania
                        </button>{' '}
                        zgodnie z regulaminem wydarzenia.
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                  {errors.cancellationPolicy && (
                    <p className="text-sm text-red-500">
                      {errors.cancellationPolicy.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Information and Upload confirmation - moved to bottom */}
              <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-8 shadow-xl">
                {/* Payment Information FIRST */}
                <div className="mb-6 flex items-center space-x-2 pb-4">
                  <CreditCard className="h-6 w-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Informacje o płatności
                  </h2>
                </div>

                <div className="mb-8 rounded-xl border border-[#262626] bg-[#0F0F0F] p-6">
                  <h3 className="mb-4 text-lg font-medium text-amber-400">
                    Dane do przelewu
                  </h3>
                  <div className="space-y-4 text-white">
                    <div>
                      <span className="mb-2 block text-gray-400">
                        Odbiorca:
                      </span>
                      <span className="block font-medium text-white">
                        {bankAccountDetails.recipient}
                      </span>
                    </div>

                    <div>
                      <span className="mb-2 block text-gray-400">
                        Numer konta:
                      </span>
                      <button
                        type="button"
                        className="block w-full cursor-pointer rounded bg-[#232323] px-3 py-2 text-left font-mono break-words transition-colors hover:bg-[#2c2c2c] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            bankAccountDetails.accountNumber,
                          )
                          showLimitedToast(
                            <span style={{ fontWeight: 600 }}>
                              Skopiowano numer konta do schowka
                            </span>,
                            { icon: '📋', duration: 2000 },
                          )
                        }}
                        aria-label="Kliknij, aby skopiować numer konta"
                      >
                        {bankAccountDetails.accountNumber}
                      </button>
                    </div>

                    <div>
                      <span className="mb-2 block text-gray-400">
                        Tytuł przelewu:
                      </span>
                      <span className="mb-1 block font-medium break-words text-amber-400">
                        {bankAccountDetails.transferTitle}
                      </span>
                      <p className="text-xs text-gray-400">
                        Koniecznie musi być słowo{' '}
                        <strong className="text-amber-400 underline">
                          &quot;Wtyczka&quot;
                        </strong>{' '}
                        w tytule <span className="text-red-500">⚠️</span>
                      </p>
                    </div>

                    <div>
                      <span className="mb-2 block text-gray-400">Kwota:</span>
                      <span className="mb-2 block text-xl font-bold text-amber-400">
                        {bankAccountDetails.amount}
                      </span>
                      <div className="space-y-1 text-xs text-gray-500">
                        {getAmountBreakdown().map((item, index) => (
                          <div key={index} className={item.color}>
                            {item.label}: {item.amount}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload payment confirmation SECOND */}
                <div className="mb-6 flex items-center space-x-2 pb-4">
                  <Upload className="h-6 w-6 text-amber-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Potwierdzenie płatności
                  </h2>
                </div>

                <div className="mb-6">
                  <label
                    className="mb-2 block text-sm font-medium text-gray-300"
                    htmlFor="transferConfirmation"
                  >
                    <span
                      className="mb-2 block w-full text-xs font-medium text-gray-300 sm:text-sm md:text-base lg:text-base xl:text-base"
                      style={{
                        maxWidth: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      Potwierdzenie przelewu (max 5MB)
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {!uploadedFile ? (
                    <>
                      <div
                        id="transferConfirmation"
                        className={`cursor-pointer rounded-xl border-2 border-dashed border-[#262626] p-6 text-center transition-colors ${isDragActive ? 'border-[#b8860b] bg-[#b8860b]/60' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ')
                            fileInputRef.current?.click()
                        }}
                        role="button"
                        aria-label="Kliknij, aby wybrać plik do przesłania"
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDragActive(true)
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          setIsDragActive(false)
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDragActive(false)
                          const files = e.dataTransfer.files
                          if (files && files.length > 0) {
                            handleFileUpload({
                              target: { files },
                            } as React.ChangeEvent<HTMLInputElement>)
                          }
                        }}
                      >
                        <Upload
                          className={`mx-auto mb-3 h-10 w-10 transition-colors duration-150 ${isDragActive ? 'text-amber-400' : 'text-gray-400'}`}
                        />
                        <p
                          className={`mb-4 transition-colors duration-150 ${isDragActive ? 'font-semibold text-amber-400' : 'text-gray-400'}`}
                          style={{ minHeight: '1.5em' }}
                        >
                          {isDragActive
                            ? 'Upuść plik tutaj'
                            : 'Prześlij potwierdzenie płatności (PDF, JPG, PNG)'}
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          className="mx-auto flex items-center justify-center rounded-xl bg-[#4fb3ff] px-6 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#66d9ff]"
                          disabled={isFileUploading}
                          onClick={(e) => {
                            e.stopPropagation()
                            fileInputRef.current?.click()
                          }}
                        >
                          {isFileUploading ? (
                            'Przesyłanie...'
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" /> Wybierz plik
                            </>
                          )}
                        </button>
                      </div>
                      {errors.transferConfirmation && (
                        <p className="mt-2 text-sm text-red-500">
                          Potwierdzenie przelewu jest wymagane
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="rounded-xl border border-[#262626] bg-[#0F0F0F] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-6 w-6 text-amber-400" />
                          <div>
                            <p className="text-sm font-medium text-amber-400">
                              {uploadedFile.fileName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatFileSize(uploadedFile.fileSize)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleFileRemove}
                          className="rounded-full bg-[#232323] p-2 text-gray-300 transition-colors hover:bg-[#2c2c2c]"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`payment-submit-button inline-flex items-center rounded-xl px-8 py-3 font-semibold shadow-md transition-colors ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''} ${uploadedFile && isValid ? 'payment-submit-button--ready' : ''}`}
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isSubmitting ? 'Wysyłanie...' : 'Wyślij formularz płatności'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Cancellation Policy Modal */}
      {isCancellationPolicyModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4 sm:p-6">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#262626] bg-[#18181b] p-4 shadow-xl sm:p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h2 className="pr-4 text-lg font-bold text-white sm:text-xl md:text-2xl">
                Polityka anulowania
              </h2>
              <button
                onClick={() => setIsCancellationPolicyModalOpen(false)}
                className="flex-shrink-0 rounded-full bg-[#232323] p-1.5 text-gray-300 transition-colors hover:bg-[#2c2c2c] sm:p-2"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <div className="space-y-3 text-gray-300 sm:space-y-4">
              <div className="rounded-lg border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
                <h3 className="mb-2 text-sm font-semibold text-amber-400 sm:mb-3 sm:text-base">
                  Zgodnie z punktem 12 regulaminu:
                </h3>
                <ul className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
                  <li className="flex items-start">
                    <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400"></span>
                    <span>
                      <strong>Zwrot kosztów możliwy</strong> w ciągu{' '}
                      <strong>24 godzin</strong> od otrzymania potwierdzenia
                      zakwalifikowania się na wyjazd
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400"></span>
                    <span>
                      Rezygnacja możliwa{' '}
                      <strong>{`nie później niż po 13 października ${year} r.`}</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400"></span>
                    <span>
                      <strong>Po tym terminie</strong> wymagane jest wskazanie{' '}
                      <strong>zastępcy</strong> na {`"Wtyczkę ${year}"`} w
                      miejsce rezygnującego
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400"></span>
                    <span>
                      Osoba wskazana jako zastępca musi{' '}
                      <strong>uiścić opłatę</strong> za uczestnictwo w
                      wydarzeniu
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
                <h3 className="mb-2 text-sm font-semibold text-blue-400 sm:mb-3 sm:text-base">
                  Rezygnacja z przyczyn losowych:
                </h3>
                <p className="text-xs sm:text-sm">
                  W przypadku rezygnacji z przyczyn losowych, Uczestnik powinien
                  skontaktować się niezwłocznie z Koordynatorem.
                </p>
              </div>

              <div className="rounded-lg border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
                <h3 className="mb-2 text-sm font-semibold text-green-400 sm:mb-3 sm:text-base">
                  Kontakt w sprawie rezygnacji:
                </h3>
                <p className="mb-2 text-xs sm:text-sm">
                  Informację o rezygnacji należy wysłać na adresy:
                </p>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">📧</span>
                    <a
                      href="mailto:l.wilczura@samorzad.p.lodz.pl"
                      className="break-all text-amber-400 hover:text-amber-500"
                    >
                      l.wilczura@samorzad.p.lodz.pl
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📧</span>
                    <a
                      href="mailto:wtyczka@samorzad.p.lodz.pl"
                      className="break-all text-amber-400 hover:text-amber-500"
                    >
                      wtyczka@samorzad.p.lodz.pl
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end sm:mt-6">
              <button
                onClick={() => setIsCancellationPolicyModalOpen(false)}
                className="rounded-xl bg-[#4fb3ff] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#66d9ff] sm:px-6 sm:text-base"
              >
                Rozumiem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
