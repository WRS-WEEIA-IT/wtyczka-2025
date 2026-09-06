'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CheckCircle, XCircle, Clock, FileText, CreditCard } from 'lucide-react'
import Link from 'next/link'

import { getPayment, PaymentRecord } from '@/usecases/payments'
import { getRegistration, RegistrationRecord } from '@/usecases/registrations'
import { useYear } from '@/contexts/YearContext'

export default function StatusPage() {
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const { year } = useYear()
  const { user, loading } = useAuth()
  useLanguage()
  const [registration, setRegistration] = useState<RegistrationRecord | null>(
    null,
  )
  const [payment, setPayment] = useState<PaymentRecord | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const [regData, payData] = await Promise.all([
            getRegistration(user.id),
            getPayment(user.id),
          ])

          setRegistration(regData)
          setPayment(payData)
        } catch (error) {
          console.error('Error loading user data:', error)
        } finally {
          setDataLoading(false)
        }
      } else {
        setDataLoading(false)
      }
    }

    loadUserData()
  }, [user])

  if (loading || dataLoading) {
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
      <div className="status-page flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md rounded-lg border border-[#262626] bg-[#0F0F0F] p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl">🔒</div>
          <h1 className="mb-4 text-2xl font-bold text-[#4fb3ff]">
            Dostęp ograniczony
          </h1>
          <p className="mb-6 text-gray-300">
            Aby sprawdzić status aplikacji, musisz się najpierw zalogować.
          </p>
          <Link
            href="/"
            className="status-primary-button rounded-md px-6 py-3 font-semibold transition-colors"
          >
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    )
  }

  const getStatusIcon = (completed: boolean, isQualified?: boolean) => {
    if (isQualified === false) {
      return <XCircle className="h-6 w-6 text-red-500" />
    }
    if (completed) {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    }
    return <Clock className="h-6 w-6 text-yellow-500" />
  }

  // Nowa logika statusu
  const registrationCompleted = !!registration
  const paymentCompleted = !!payment
  const qualified = payment?.qualified === true

  let statusType:
    | 'none'
    | 'registration'
    | 'payment'
    | 'pending'
    | 'qualified' = 'none'
  if (!registrationCompleted) {
    statusType = 'none'
  } else if (registrationCompleted && !paymentCompleted) {
    statusType = 'registration'
  } else if (registrationCompleted && paymentCompleted && !qualified) {
    statusType = 'pending'
  } else if (registrationCompleted && paymentCompleted && qualified) {
    statusType = 'qualified'
  }

  if (!isMounted) return null
  return (
    <div className="status-page min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Status Overview */}
        <div className="mb-8 rounded-lg border border-[#262626] bg-[#0F0F0F] p-6 shadow-lg">
          <h2 className="mt-4 mb-6 text-center text-2xl font-bold text-[#4fb3ff]">
            Status Twojej Aplikacji
          </h2>

          <div className="mb-6 flex items-center justify-center">
            <div className="flex w-full flex-col items-center justify-center">
              {statusType === 'none' && (
                <>
                  <XCircle className="mx-auto h-16 w-16 text-red-500" />
                  <div className="mt-2 text-center text-3xl font-bold text-[#4fb3ff]">
                    Brak rejestracji
                  </div>
                  <div className="mt-2 text-center text-gray-300">
                    Wypełnij formularz rejestracji, aby rozpocząć proces
                    zgłoszenia.
                  </div>
                </>
              )}
              {statusType === 'registration' && (
                <>
                  <Clock className="mx-auto h-16 w-16 text-yellow-500" />
                  <div className="mt-2 text-center text-3xl font-bold text-[#4fb3ff]">
                    Czekamy na formularz płatności
                  </div>
                  <div className="mt-2 text-center text-gray-300">
                    Wypełnij formularz płatności, aby przejść dalej.
                  </div>
                </>
              )}
              {statusType === 'pending' && (
                <>
                  <Clock className="mx-auto h-16 w-16 text-yellow-500" />
                  <div className="mt-2 text-center text-3xl font-bold text-[#4fb3ff]">
                    Oczekiwanie na werdykt
                  </div>
                  <div className="mt-2 text-center text-gray-300">
                    Twoje zgłoszenie i płatność zostały przyjęte. Czekaj na
                    decyzję organizatorów – możesz być jeszcze niezaakceptowany
                    lub znajdować się na liście rezerwowej.
                  </div>
                </>
              )}
              {statusType === 'qualified' && (
                <>
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                  <div className="mt-2 text-center text-3xl font-bold text-[#4fb3ff]">
                    Zakwalifikowany!
                  </div>
                  <div className="mt-2 text-center text-green-400">
                    {`Gratulacje! Zostałeś zakwalifikowany na Wtyczkę ${year}! 🎉`}
                  </div>
                </>
              )}
            </div>
          </div>

          {registration && (
            <div className="text-center text-gray-300">
              <p>
                Data złożenia aplikacji:{' '}
                <span className="font-semibold">
                  {registration.createdAt.toLocaleDateString('pl-PL')}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Forms Status */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Registration Form Status */}
          <div className="rounded-lg border border-[#262626] bg-[#0F0F0F] p-6 shadow-lg">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex items-center space-x-3">
                <FileText className="h-6 w-6 text-[#4fb3ff]" />
                <h3 className="text-xl font-bold text-[#4fb3ff]">
                  Formularz rejestracji
                </h3>
              </div>

              <div className="mb-4 flex items-center justify-center space-x-2">
                {getStatusIcon(registrationCompleted)}
                <span className="font-semibold text-gray-200">
                  {registrationCompleted ? 'Wypełniony' : 'Nie wypełniony'}
                </span>
              </div>

              {registrationCompleted ? (
                <div>
                  <p className="mb-2 text-sm text-green-400">
                    ✓ Formularz rejestracji został pomyślnie wysłany
                  </p>
                  <div className="h-4"></div>
                  {registration && (
                    <Link
                      href="/registration"
                      className="rounded-md bg-[#4fb3ff] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#66d9ff]"
                    >
                      Sprawdź swoje odpowiedzi
                    </Link>
                  )}
                </div>
              ) : (
                <div>
                  <p className="mb-3 text-sm text-red-400">
                    Formularz rejestracji nie został jeszcze wypełniony
                  </p>
                  <div className="h-4"></div>
                  <Link
                    href="/registration"
                    className="rounded-md bg-[#4fb3ff] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#66d9ff]"
                  >
                    Wypełnij formularz
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Payment Form Status */}
          <div className="rounded-lg border border-[#262626] bg-[#0F0F0F] p-6 shadow-lg">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-amber-400" />
                <h3 className="text-xl font-bold text-amber-400">
                  Formularz płatności
                </h3>
              </div>

              <div className="mb-4 flex items-center justify-center space-x-2">
                {getStatusIcon(paymentCompleted)}
                <span className="font-semibold text-gray-200">
                  {paymentCompleted ? 'Wypełniony' : 'Nie wypełniony'}
                </span>
              </div>

              {paymentCompleted ? (
                <div>
                  <p className="mb-2 text-sm text-green-400">
                    ✓ Formularz płatności został pomyślnie wysłany
                  </p>
                  <div className="h-4"></div>
                  <Link
                    href="/payment"
                    className="rounded-md bg-[#4fb3ff] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#66d9ff]"
                  >
                    Sprawdź swoje odpowiedzi
                  </Link>
                </div>
              ) : registrationCompleted ? (
                <div>
                  <p className="mb-3 text-sm text-yellow-400">
                    Wypełnij formularz płatności, aby przejść dalej
                  </p>
                  <div className="h-4"></div>
                  <Link
                    href="/payment"
                    className="rounded-md bg-[#4fb3ff] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#66d9ff]"
                  >
                    Wypełnij formularz płatności
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="mb-3 text-sm text-red-400">
                    Najpierw wypełnij formularz rejestracji
                  </p>
                  <div className="h-2"></div>
                  <button
                    className="cursor-not-allowed rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-black opacity-60"
                    disabled
                  >
                    Wypełnij formularz płatności
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
