"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react";
import Link from "next/link";



import { getPayment, PaymentRecord } from "@/usecases/payments";
import { getRegistration, RegistrationRecord } from "@/usecases/registrations";



export default function StatusPage() {
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  const { user, loading } = useAuth();
  useLanguage();
  const [registration, setRegistration] = useState<RegistrationRecord | null>(
    null
  );
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const [regData, payData] = await Promise.all([
            getRegistration(user.id),
            getPayment(user.id),
          ]);

          setRegistration(regData);
          setPayment(payData);
        } catch (error) {
          console.error("Error loading user data:", error);
        } finally {
          setDataLoading(false);
        }
      } else {
        setDataLoading(false);
      }
    };

    loadUserData();
  }, [user]);

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
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-[#0F0F0F] border border-[#262626] rounded-lg shadow-lg">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-amber-400 mb-4">
            Dostęp ograniczony
          </h1>
          <p className="text-gray-300 mb-6">
            Aby sprawdzić status aplikacji, musisz się najpierw zalogować.
          </p>
          <Link
            href="/"
            className="bg-[#E7A801] hover:bg-amber-700 text-black px-6 py-3 rounded-md font-semibold transition-colors"
          >
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (completed: boolean, isQualified?: boolean) => {
    if (isQualified === false) {
      return <XCircle className="h-6 w-6 text-red-500" />;
    }
    if (completed) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    return <Clock className="h-6 w-6 text-yellow-500" />;
  };




  // Nowa logika statusu
  const registrationCompleted = !!registration;
  const paymentCompleted = !!payment;
  const qualified = payment?.qualified === true;

  let statusType: 'none' | 'registration' | 'payment' | 'pending' | 'qualified' = 'none';
  if (!registrationCompleted) {
    statusType = 'none';
  } else if (registrationCompleted && !paymentCompleted) {
    statusType = 'registration';
  } else if (registrationCompleted && paymentCompleted && !qualified) {
    statusType = 'pending';
  } else if (registrationCompleted && paymentCompleted && qualified) {
    statusType = 'qualified';
  }

  if (!isMounted) return null;
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Status Overview */}
        <div className="bg-[#0F0F0F] border border-[#262626] rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center mt-4">
            Status Twojej Aplikacji
          </h2>

          <div className="flex items-center justify-center mb-6">
            <div className="flex flex-col items-center justify-center w-full">
              {statusType === 'none' && (
                <>
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <div className="text-3xl font-bold text-amber-400 mt-2 text-center">Brak rejestracji</div>
                  <div className="text-gray-300 mt-2 text-center">Wypełnij formularz rejestracji, aby rozpocząć proces zgłoszenia.</div>
                </>
              )}
              {statusType === 'registration' && (
                <>
                  <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
                  <div className="text-3xl font-bold text-amber-400 mt-2 text-center">Czekamy na formularz płatności</div>
                  <div className="text-gray-300 mt-2 text-center">Wypełnij formularz płatności, aby przejść dalej.</div>
                </>
              )}
              {statusType === 'pending' && (
                <>
                  <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
                  <div className="text-3xl font-bold text-amber-400 mt-2 text-center">Oczekiwanie na werdykt</div>
                  <div className="text-gray-300 mt-2 text-center">Twoje zgłoszenie i płatność zostały przyjęte. Czekaj na decyzję organizatorów – możesz być jeszcze niezaakceptowany lub znajdować się na liście rezerwowej.</div>
                </>
              )}
              {statusType === 'qualified' && (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div className="text-3xl font-bold text-amber-400 mt-2 text-center">Zakwalifikowany!</div>
                  <div className="text-green-400 mt-2 text-center">Gratulacje! Zostałeś zakwalifikowany na Wtyczkę 2025! 🎉</div>
                </>
              )}
            </div>
          </div>

          {registration && (
            <div className="text-center text-gray-300">
              <p>
                Data złożenia aplikacji: {" "}
                <span className="font-semibold">
                  {registration.createdAt.toLocaleDateString("pl-PL")}
                </span>
              </p>
            </div>
          )}
        </div>


        {/* Forms Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Registration Form Status */}
          <div className="bg-[#0F0F0F] border border-[#262626] rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-6 w-6 text-amber-400" />
                <h3 className="text-xl font-bold text-amber-400">
                  Formularz rejestracji
                </h3>
              </div>

              <div className="flex items-center justify-center space-x-2 mb-4">
                {getStatusIcon(registrationCompleted)}
                <span className="font-semibold text-gray-200">
                  {registrationCompleted ? "Wypełniony" : "Nie wypełniony"}
                </span>
              </div>

              {registrationCompleted ? (
                <div>
                  <p className="text-green-400 text-sm mb-2">
                    ✓ Formularz rejestracji został pomyślnie wysłany
                  </p>
                  <div className="h-1"></div>
                  {registration && (
                    <div className="text-xs text-gray-400">
                      <p>
                        Imię i nazwisko: {registration.name}{" "}
                        {registration.surname}
                      </p>
                      <p>Wydział: {registration.faculty}</p>
                      <p>Kierunek: {registration.studyField}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-red-400 text-sm mb-3">
                    Formularz rejestracji nie został jeszcze wypełniony
                  </p>
                  <div className="h-4"></div>
                  <Link
                    href="/registration"
                    className="bg-[#E7A801] hover:bg-amber-700 text-black px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                  >
                    Wypełnij formularz
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Payment Form Status */}
          <div className="bg-[#0F0F0F] border border-[#262626] rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="h-6 w-6 text-amber-400" />
                <h3 className="text-xl font-bold text-amber-400">
                  Formularz płatności
                </h3>
              </div>

              <div className="flex items-center justify-center space-x-2 mb-4">
                {getStatusIcon(paymentCompleted)}
                <span className="font-semibold text-gray-200">
                  {paymentCompleted ? "Wypełniony" : "Nie wypełniony"}
                </span>
              </div>

              {paymentCompleted ? (
                <div>
                  <p className="text-green-400 text-sm mb-2">
                    ✓ Formularz płatności został pomyślnie wysłany
                  </p>
                  <div className="text-xs text-gray-400 mt-5">
                      <p className="text-lg">
                        Oczekuj na werdykt
                      </p>
                    </div>
                </div>
              ) : registrationCompleted ? (
                <div>
                  <p className="text-yellow-400 text-sm mb-3">
                    Wypełnij formularz płatności, aby przejść dalej
                  </p>
                  <div className="h-4"></div>
                  <Link
                    href="/payment"
                    className="bg-[#E7A801] hover:bg-amber-700 text-black px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                  >
                    Wypełnij formularz płatności
                  </Link>
                </div>
               ) : (
                 <div className="flex flex-col items-center">
                   <p className="text-red-400 text-sm mb-3">
                     Najpierw wypełnij formularz rejestracji
                   </p>
                   <div className="h-2"></div>
                   <button
                     className="bg-amber-700 text-black px-4 py-2 rounded-md text-sm font-semibold cursor-not-allowed opacity-60"
                     disabled
                   >
                     Wypełnij formularz płatności
                   </button>
                 </div>
                
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-8">
            Masz pytania? Sprawdź naszą sekcję FAQ lub skontaktuj się z
            organizatorami.
          </p>
          <div className="space-x-4">
            <Link
              href="/faq"
              className="bg-[#0F0F0F] border border-[#E7A801] text-amber-400 hover:bg-[#232323] hover:text-amber-300 px-6 py-2 rounded-md font-semibold transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contacts"
              className="bg-[#0F0F0F] border border-[#E7A801] text-amber-400 hover:bg-[#232323] hover:text-amber-300 px-6 py-2 rounded-md font-semibold transition-colors"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

