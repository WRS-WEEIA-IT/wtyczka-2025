'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { User, School, Info, Save, AlertTriangle } from 'lucide-react'
import { Check } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import {
  createRegistration,
  getRegistration,
  RegistrationRecord,
} from '@/usecases/registrations'
import { handleSupabaseError } from '@/lib/supabase'
import { useYear } from '@/contexts/YearContext'

const registrationSchema = z.object({
  adultStatus: z.enum(['yes', 'no'], 'Wybierz odpowiedź'),

  // Imię - tylko litery alfabetu + spacje, max 50 znaków
  name: z
    .string()
    .min(2, 'Imię musi mieć co najmniej 2 znaki')
    .max(50, 'Imię nie może przekraczać 50 znaków')
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      'Imię może zawierać tylko litery i spacje',
    ),

  // Nazwisko - tylko litery alfabetu + spacje, max 50 znaków
  surname: z
    .string()
    .min(2, 'Nazwisko musi mieć co najmniej 2 znaki')
    .max(50, 'Nazwisko nie może przekraczać 50 znaków')
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      'Nazwisko może zawierać tylko litery i spacje',
    ),

  // Numer telefonu - tylko cyfry, znak + i spacje, min 9 cyfr
  phoneNumber: z
    .string()
    .regex(
      /^[+\s\d]+$/,
      "Numer telefonu może zawierać tylko cyfry, znak '+' i spacje",
    )
    .refine(
      (value) => {
        // Sprawdzenie czy po usunięciu spacji i '+' mamy co najmniej 9 cyfr
        const digitsOnly = value.replace(/[^0-9]/g, '')
        return digitsOnly.length >= 9
      },
      { message: 'Numer telefonu musi zawierać co najmniej 9 cyfr' },
    ),

  // Płeć - wymagana
  gender: z.enum(['male', 'female', 'other'], 'Wybierz płeć'),

  // Wydział - wymagany
  faculty: z.enum(
    ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9'],
    'Wybierz wydział',
  ),

  // Numer indeksu - max 30 znaków, mogą być cyfry i litery
  studentNumber: z
    .string()
    .min(1, 'Numer indeksu jest wymagany')
    .max(30, 'Numer indeksu nie może przekraczać 30 znaków')
    .regex(/^\d+$/, 'Numer indeksu może zawierać tylko cyfry'),

  // Kierunek studiów - litery i spacje, max 60 znaków
  studyField: z
    .string()
    .min(1, 'Kierunek studiów jest wymagany')
    .max(60, 'Kierunek studiów nie może przekraczać 60 znaków')
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      'Kierunek studiów może zawierać tylko litery i spacje',
    ),

  // Poziom studiów - wymagany
  studyLevel: z.enum(['bachelor', 'master', 'phd'], 'Wybierz jedną z opcji'),

  // Rok studiów - wymagany
  studyYear: z.enum(['1', '2', '3', '4', '5'], 'Wybierz jedną z opcji'),

  // Rozmiar koszulki - wymagany
  tshirtSize: z.enum(
    ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Wybierz jedną z opcji',
  ),

  // Skąd wiesz o wtyczce - wymagane
  aboutWtyczka: z.enum(
    ['social-media', 'akcja-integracja', 'friend', 'stands', 'other'],
    'Wybierz jedną z opcji',
  ),
  aboutWtyczkaInfo: z.string().optional(),

  // Dane do faktury - opcjonalne
  invoice: z.boolean(),
  invoiceName: z.string().optional(),
  invoiceSurname: z.string().optional(),
  invoiceId: z.string().optional(),
  invoiceAddress: z.string().optional(),

  // Akceptacja regulaminu - wymagana
  regDecision: z.enum(['yes', 'no'], 'Wybierz odpowiedź'),
  regRejectionReason: z.string().optional(),

  // Zgoda na przetwarzanie danych - wymagana
  rodoAccept: z.boolean().refine((val) => val === true, {
    message: 'Musisz wyrazić zgodę na przetwarzanie danych',
  }),
})

const registrationValidationSchema = registrationSchema.superRefine(
  (data, context) => {
    if (data.regDecision === 'no' && !data.regRejectionReason?.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['regRejectionReason'],
        message: 'Napisz, dlaczego nie akceptujesz regulaminu',
      })
    }
    if (data.aboutWtyczka === 'other' && !data.aboutWtyczkaInfo?.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['aboutWtyczkaInfo'],
        message: 'Podaj dodatkowe informacje',
      })
    }
    if (data.invoice) {
      const invoiceFields = [
        ['invoiceName', data.invoiceName],
        ['invoiceSurname', data.invoiceSurname],
        ['invoiceId', data.invoiceId],
        ['invoiceAddress', data.invoiceAddress],
      ] as const
      invoiceFields.forEach(([field, value]) => {
        if (!value?.trim()) {
          context.addIssue({
            code: 'custom',
            path: [field],
            message: 'To pole jest wymagane przy fakturze',
          })
        }
      })
    }
  },
)

type RegistrationFormData = z.infer<typeof registrationValidationSchema>

const facultyLinks: Record<string, string> = {
  w1: 'http://www.mechaniczny.p.lodz.pl/',
  w2: 'http://www.weeia.p.lodz.pl/',
  w3: 'http://chemia.p.lodz.pl/',
  w4: 'http://www.style.p.lodz.pl/index.php',
  w5: 'http://binoz.p.lodz.pl/',
  w6: 'http://bais.p.lodz.pl/',
  w7: 'http://ftims.p.lodz.pl/',
  w8: 'http://wzip.p.lodz.pl/',
  w9: 'http://wipos.p.lodz.pl/',
}

export default function RegistrationPage() {
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const { user, loading } = useAuth()
  const { t, language } = useLanguage()

  const realLang = language || 'pl'

  const { year } = useYear()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInvoice, setIsInvoice] = useState(false)
  const [existingRegistration, setExistingRegistration] =
    useState<RegistrationRecord | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationValidationSchema),
  })
  const adultStatus = watch('adultStatus')
  const invoiceField = register('invoice')

  useEffect(() => {
    const checkExistingRegistration = async () => {
      if (user) {
        try {
          const registration = await getRegistration(user.id)
          setExistingRegistration(registration)
        } catch (error) {
          console.error('Error checking existing registration:', error)
        }
      }
    }

    checkExistingRegistration()
  }, [user])

  // Redirect to login if not authenticated
  if (!isMounted) return null
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
        <div className="mx-auto max-w-md rounded-2xl border border-[#262626] bg-[#1a1a1a]/70 p-8 text-center shadow-xl">
          <div className="mb-4 text-6xl">🔒</div>
          <h1 className="mb-4 text-2xl font-bold text-amber-400">
            Dostęp ograniczony
          </h1>
          <p className="mb-6 text-gray-300">
            Aby wypełnić formularz rejestracji, musisz się najpierw zalogować.
          </p>
          <Link
            href="/"
            className="western-btn block w-full rounded-xl bg-[#4fb3ff] px-6 py-3 font-bold tracking-wider break-words text-black uppercase transition-colors hover:bg-[#66d9ff]"
            style={{ boxShadow: '0 4px 12px rgba(79,179,255,0.36)' }}
          >
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: RegistrationFormData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const {
        adultStatus: _adultStatus,
        regDecision,
        regRejectionReason,
        ...formValues
      } = data
      const formData = {
        ...formValues,
        dob: undefined,
        pesel: undefined,
        dietName: 'standard' as const,
        regAccept: regDecision === 'yes',
        regRejectionReason,
        studentNumber: parseInt(data.studentNumber),
        studyYear: parseInt(data.studyYear),
      } as Omit<
        RegistrationRecord,
        'id' | 'userId' | 'email' | 'createdAt' | 'updatedAt'
      >
      await createRegistration(user, formData)
      toast.success('Formularz został wysłany pomyślnie!')

      // Refresh the existing registration
      const registration = await getRegistration(user.id)
      setExistingRegistration(registration)
    } catch (error) {
      console.error('Submit error:', error)
      const errorMessage = handleSupabaseError(error, realLang)
      toast.error(`Wystąpił błąd: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show existing registration info if it exists
  if (existingRegistration) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white drop-shadow-lg">
              Rejestracja wysłana pomyślnie
            </h1>
          </div>

          <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-8 shadow-xl">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-green-900 p-3 shadow-lg">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {existingRegistration.name} {existingRegistration.surname}
                </h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-200">
                  Dane osobowe
                </h3>
                <p className="text-base text-gray-400">
                  Email: {existingRegistration.email}
                </p>
                <p className="text-base text-gray-400">
                  Pełnoletność:{' '}
                  {existingRegistration.over18 === false ? 'Nie' : 'Tak'}
                </p>
                <p className="text-base text-gray-400">
                  Telefon: {existingRegistration.phoneNumber}
                </p>
                <p className="text-base text-gray-400">
                  Płeć:{' '}
                  {existingRegistration.gender === 'male'
                    ? 'Mężczyzna'
                    : existingRegistration.gender === 'female'
                      ? 'Kobieta'
                      : 'Inna'}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-200">
                  Dane studenta
                </h3>
                <p className="text-base text-gray-400">
                  Wydział:{' '}
                  {existingRegistration.faculty === 'w1'
                    ? 'Mechaniczny W1'
                    : existingRegistration.faculty === 'w2'
                      ? 'Elektrotechniki, Elektroniki, Informatyki i Automatyki W2'
                      : existingRegistration.faculty === 'w3'
                        ? 'Chemiczny W3'
                        : existingRegistration.faculty === 'w4'
                          ? 'Technologii Materiałowych i Wzornictwa Tekstyliów W4'
                          : existingRegistration.faculty === 'w5'
                            ? 'Biotechnologii i Nauk o Żywności W5'
                            : existingRegistration.faculty === 'w6'
                              ? 'Budownictwa, Architektury i Inżynierii Środowiska W6'
                              : existingRegistration.faculty === 'w7'
                                ? 'Fizyki Technicznej, Informatyki i Matematyki Stosowanej W7'
                                : existingRegistration.faculty === 'w8'
                                  ? 'Organizacji i Zarządzania W8'
                                  : 'Inżynierii Procesowej i Ochrony Środowiska W9'}
                </p>
                <p className="text-base text-gray-400">
                  Nr indeksu: {existingRegistration.studentNumber}
                </p>
                <p className="text-base text-gray-400">
                  Kierunek: {existingRegistration.studyField}
                </p>
                <p className="text-base text-gray-400">
                  Poziom studiów:{' '}
                  {existingRegistration.studyLevel === 'bachelor'
                    ? 'I (Licencjat / Inżynier)'
                    : existingRegistration.studyLevel === 'master'
                      ? 'II (Magisterskie)'
                      : 'III (Doktorskie)'}
                </p>
                <p className="text-base text-gray-400">
                  Rok studiów: {existingRegistration.studyYear}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-200">
                  Preferencje
                </h3>
                <p className="text-base text-gray-400">
                  Rozmiar koszulki: {existingRegistration.tshirtSize}
                </p>
                <p className="text-base text-gray-400">
                  Skąd wiesz o Wtyczce:{' '}
                  {existingRegistration.aboutWtyczka === 'social-media'
                    ? 'Social Media'
                    : existingRegistration.aboutWtyczka === 'akcja-integracja'
                      ? 'Akcja Integracja'
                      : existingRegistration.aboutWtyczka === 'friend'
                        ? 'Od znajomych'
                        : existingRegistration.aboutWtyczka === 'stands'
                          ? 'Standy'
                          : 'Inne'}
                </p>
                {existingRegistration.aboutWtyczkaInfo && (
                  <p className="text-base text-gray-400">
                    Dodatkowe info: {existingRegistration.aboutWtyczkaInfo}
                  </p>
                )}
              </div>

              {existingRegistration.invoice && (
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-200">
                    Dane do faktury
                  </h3>
                  {existingRegistration.invoiceName && (
                    <p className="text-base text-gray-400">
                      Imię: {existingRegistration.invoiceName}
                    </p>
                  )}
                  {existingRegistration.invoiceSurname && (
                    <p className="text-base text-gray-400">
                      Nazwisko: {existingRegistration.invoiceSurname}
                    </p>
                  )}
                  {existingRegistration.invoiceId && (
                    <p className="text-base text-gray-400">
                      NIP/PESEL: {existingRegistration.invoiceId}
                    </p>
                  )}
                  {existingRegistration.invoiceAddress && (
                    <p className="text-base text-gray-400">
                      Adres: {existingRegistration.invoiceAddress}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-6 border-t border-[#262626] pt-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-200">
                  Zgody
                </h3>
                <p className="text-base text-gray-400">
                  Regulamin:{' '}
                  {existingRegistration.regAccept
                    ? 'Zaakceptowany'
                    : 'Niezaakceptowany'}
                </p>
                {!existingRegistration.regAccept &&
                  existingRegistration.regRejectionReason && (
                    <p className="text-base text-gray-400">
                      Powód: {existingRegistration.regRejectionReason}
                    </p>
                  )}
                <p className="text-base text-gray-400">
                  Zgoda RODO:{' '}
                  {existingRegistration.rodoAccept ? 'Wyrażona' : 'Brak zgody'}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-[#262626] pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <p className="mb-4 text-center text-base text-gray-500 md:mb-0 md:text-left">
                  Data rejestracji:{' '}
                  {existingRegistration.createdAt.toLocaleDateString('pl-PL')}
                </p>
                {/* Desktop: przycisk po prawej */}
                <div className="hidden md:block">
                  <Link
                    href="/status"
                    className="registration-primary-button rounded-xl px-6 py-3 font-semibold shadow-md transition-colors"
                  >
                    Sprawdź status
                  </Link>
                </div>
              </div>
              {/* Mobile: przycisk pod datą, wyśrodkowany */}
              <div className="mt-4 block flex items-center justify-center md:hidden">
                <Link
                  href="/status"
                  className="registration-primary-button rounded-xl px-6 py-3 font-semibold shadow-md transition-colors"
                >
                  Sprawdź status
                </Link>
              </div>
            </div>

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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header - spójny z payment/news */}
        <section className="mb-8 border-b border-[#262626] py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-bold text-amber-400 md:text-5xl">
              Formularz rejestracji
            </h1>
            <p className="text-xl text-gray-200">
              {`Wypełnij wszystkie pola, aby zarejestrować się na Wtyczkę ${year}`}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Zalogowany jako:{' '}
              <span className="font-semibold">{user.email}</span>
            </p>
          </div>
        </section>

        {/* Ostrzeżenie o konsekwencjach podawania fałszywych danych */}
        <div className="mb-6 rounded-xl border border-red-700 bg-red-900/30 p-4">
          <div className="flex items-start">
            <AlertTriangle className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-red-400">UWAGA!</h3>
              <p className="text-gray-200">
                Wyjazd jest przeznaczony wyłącznie dla osób pełnoletnich.
                Podanie nieprawdziwych informacji skutkuje pozbawieniem
                możliwości uczestniczenia w tej i kolejnych edycjach „Wtyczki”
                oraz zwrotu kosztów.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-[#262626] bg-[#18181b] p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-bold text-white">
            Czy jesteś osobą pełnoletnią?
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            {[
              { value: 'yes', label: 'Tak' },
              { value: 'no', label: 'Nie' },
            ].map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 text-gray-300"
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('adultStatus')}
                  className="h-4 w-4 accent-amber-400"
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.adultStatus && (
            <p className="mt-2 text-sm text-red-500">
              {errors.adultStatus.message}
            </p>
          )}
        </div>

        {adultStatus === 'no' && (
          <div className="mb-6 rounded-xl border border-red-700 bg-red-900/30 p-4 text-gray-200">
            Niestety, w wyjeździe mogą uczestniczyć wyłącznie osoby pełnoletnie.
            Zapraszamy do udziału w przyszłych edycjach „Wtyczki”.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={adultStatus === 'yes' ? 'space-y-8' : 'hidden'}
        >
          {/* Dane uczestnika */}
          <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-6 shadow-xl">
            <div className="mb-6 flex items-center space-x-2">
              <User className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">
                {t.forms.participantData}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.firstName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  {...register('name')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.lastName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  {...register('surname')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {errors.surname && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.surname.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.gender} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="">Wybierz płeć</option>
                  <option value="male">Mężczyzna</option>
                  <option value="female">Kobieta</option>
                  <option value="other">Inna</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dane studenta */}
          <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-6 shadow-xl">
            <div className="mb-6 flex items-center space-x-2">
              <School className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">
                {t.forms.studentData}
              </h2>
            </div>
            <p className="mb-6 rounded-lg border border-amber-700/60 bg-amber-900/20 p-3 text-sm text-amber-200">
              Dane o posiadaniu statusu studenta będą weryfikowane. Podanie
              nieprawdziwych informacji może skutkować wykluczeniem z tej i
              kolejnych edycji „Wtyczki”.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.faculty} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('faculty')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="">Wybierz wydział</option>
                  <option value="w1">Mechaniczny W1</option>
                  <option value="w2">
                    Elektrotechniki, Elektroniki, Informatyki i Automatyki W2
                  </option>
                  <option value="w3">Chemiczny W3</option>
                  <option value="w4">
                    Technologii Materiałowych i Wzornictwa Tekstyliów W4
                  </option>
                  <option value="w5">
                    Biotechnologii i Nauk o Żywności W5
                  </option>
                  <option value="w6">
                    Budownictwa, Architektury i Inżynierii Środowiska W6
                  </option>
                  <option value="w7">
                    Fizyki Technicznej, Informatyki i Matematyki Stosowanej W7
                  </option>
                  <option value="w8">Organizacji i Zarządzania W8</option>
                  <option value="w9">
                    Inżynierii Procesowej i Ochrony Środowiska W9
                  </option>
                </select>
                {errors.faculty && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.faculty.message}
                  </p>
                )}
                {watch('faculty') && (
                  <a
                    href={facultyLinks[watch('faculty')]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-amber-400 underline hover:text-amber-300"
                  >
                    Strona wybranego wydziału
                  </a>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.studentNumber}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={30}
                  {...register('studentNumber')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {errors.studentNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.studentNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.fieldOfStudy} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={60}
                  {...register('studyField')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {errors.studyField && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.studyField.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.studyLevel} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('studyLevel')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="">Wybierz stopień</option>
                  <option value="bachelor">I (Licencjat / Inżynier)</option>
                  <option value="master">II (Magisterskie)</option>
                  <option value="phd">III (Doktorskie)</option>
                </select>
                {errors.studyLevel && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.studyLevel.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.studyYear} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('studyYear')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="">Wybierz rok</option>
                  <option value="1">1 rok</option>
                  <option value="2">2 rok</option>
                  <option value="3">3 rok</option>
                  <option value="4">4 rok</option>
                  <option value="5">5 rok</option>
                </select>
                {errors.studyYear && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.studyYear.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dodatkowe informacje */}
          <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-6 shadow-xl">
            <div className="mb-6 flex items-center space-x-2">
              <Info className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">
                {t.forms.additionalInfo}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.tshirtSize} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('tshirtSize')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="">Wybierz rozmiar</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
                {errors.tshirtSize && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.tshirtSize.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <div className="flex items-start">
                  <label className="flex cursor-pointer items-center select-none">
                    <span className="custom-checkbox-container">
                      <input
                        type="checkbox"
                        {...invoiceField}
                        className="custom-checkbox-input"
                        onChange={(event) => {
                          invoiceField.onChange(event)
                          setIsInvoice(event.target.checked)
                        }}
                      />
                      <div className="custom-checkbox-glow"></div>
                      <div className="custom-checkbox-check">✓</div>
                    </span>
                    <span className="ml-3 text-gray-300">
                      {t.forms.invoice}
                    </span>
                  </label>
                </div>
              </div>
              {isInvoice && (
                <>
                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-gray-300"
                      htmlFor="invoiceName"
                    >
                      Imię do faktury <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="invoiceName"
                      type="text"
                      {...register('invoiceName')}
                      className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    {errors.invoiceName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.invoiceName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Nazwisko do faktury{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('invoiceSurname')}
                      className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    {errors.invoiceSurname && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.invoiceSurname.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      NIP/PESEL do faktury{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      {...register('invoiceId')}
                      className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    {errors.invoiceId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.invoiceId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Adres odbiorcy faktury{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      {...register('invoiceAddress')}
                      className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    {errors.invoiceAddress && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.invoiceAddress.message}
                      </p>
                    )}
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.forms.howDidYouKnow}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('aboutWtyczka')}
                  className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="">Wybierz skąd wiesz</option>
                  <option value="social-media">Social Media</option>
                  <option value="akcja-integracja">Akcja Integracja</option>
                  <option value="friend">Od znajomych</option>
                  <option value="stands">Standy</option>
                  <option value="other">Inne</option>
                </select>
                {errors.aboutWtyczka && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.aboutWtyczka.message}
                  </p>
                )}
              </div>
              {watch('aboutWtyczka') === 'other' && (
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Dodatkowe informacje (skąd dokładnie?){' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    {...register('aboutWtyczkaInfo')}
                    className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  {errors.aboutWtyczkaInfo && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.aboutWtyczkaInfo.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Zgody */}
          <div className="rounded-2xl border border-[#262626] bg-[#18181b] p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-white">
              Zgody i regulamin
            </h3>
            <div className="space-y-4">
              <div>
                <p className="mb-3 text-gray-300">
                  Czy akceptujesz regulamin wyjazdu?{' '}
                  <a
                    href={process.env.NEXT_PUBLIC_REGULATIONS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 underline hover:text-amber-500"
                  >
                    Otwórz regulamin
                  </a>{' '}
                  <span className="text-red-500">*</span>
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                  {[
                    { value: 'yes', label: 'Tak' },
                    { value: 'no', label: 'Nie' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 text-gray-300"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register('regDecision')}
                        className="h-4 w-4 accent-amber-400"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
              {errors.regDecision && (
                <p className="text-sm text-red-500">
                  {errors.regDecision.message}
                </p>
              )}
              {watch('regDecision') === 'no' && (
                <div>
                  <label
                    htmlFor="regRejectionReason"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Dlaczego nie? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="regRejectionReason"
                    rows={3}
                    {...register('regRejectionReason')}
                    className="w-full rounded-md border border-[#262626] bg-[#232323] px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  {errors.regRejectionReason && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.regRejectionReason.message}
                    </p>
                  )}
                </div>
              )}
              <div className="flex items-start">
                <label className="flex cursor-pointer items-center select-none">
                  <span className="custom-checkbox-container">
                    <input
                      type="checkbox"
                      {...register('rodoAccept')}
                      className="custom-checkbox-input"
                    />
                    <div className="custom-checkbox-glow"></div>
                    <div className="custom-checkbox-check">✓</div>
                  </span>
                  <span className="ml-3 text-xs text-gray-300">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych przez
                    Politechnikę Łódzką w celu zorganizowania i przeprowadzenia
                    wyjazdu integracyjno-szkoleniowego {`"Wtyczka ${year}"`}.
                    Także zgadzam się na otrzymywanie wiadomości tekstowych
                    dotyczących spraw organizacyjnych związanych z Wyjazdem na
                    adres e-mail i numer telefonu podany w formularzu. Klauzula
                    RODO dostępna jest{' '}
                    <a
                      href="https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/dokumenty/rodo.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 underline hover:text-amber-500"
                    >
                      tutaj
                    </a>
                    . <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
              {errors.rodoAccept && (
                <p className="text-sm text-red-500">
                  {errors.rodoAccept.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="registration-primary-button inline-flex items-center space-x-2 rounded-xl px-12 py-4 text-lg font-semibold shadow-md transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{isSubmitting ? 'Wysyłanie...' : t.forms.submit}</span>
            </button>
          </div>
        </form>

        {/* Regulations Modal */}
      </div>
    </div>
  )
}
