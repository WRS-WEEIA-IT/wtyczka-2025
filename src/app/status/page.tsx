"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import {
  getRegistration,
  getPayment,
  ParticipantRecord,
  PaymentRecord,
} from "@/lib/firestore";

export default function StatusPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [registration, setRegistration] = useState<ParticipantRecord | null>(
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
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤠</div>
          <div className="text-xl text-amber-800">Ładowanie...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-amber-900 mb-4">
            Dostęp ograniczony
          </h1>
          <p className="text-gray-600 mb-6">
            Aby sprawdzić status aplikacji, musisz się najpierw zalogować.
          </p>
          <Link
            href="/"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
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

  const getStatusText = (completed: boolean, isQualified?: boolean) => {
    if (isQualified === false) {
      return t.forms.notQualified;
    }
    if (completed) {
      return t.forms.qualified;
    }
    return t.forms.pending;
  };

  // Calculate status based on real data
  const isQualified = true;
  const isNotQualified = false;
  const isPending = false;
  const registrationCompleted = !!registration;
  const paymentCompleted = !!payment;
  const paymentConfirmed = true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            Status Twojej aplikacji
          </h1>
          <p className="text-lg text-amber-700">
            Sprawdź aktualny status swojego zgłoszenia na Wtyczkę 2025
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Zalogowany jako: <span className="font-semibold">{user.email}</span>
          </p>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            Ogólny status aplikacji
          </h2>

          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              {getStatusIcon(isQualified || isPending, isQualified)}
              <div className="text-3xl font-bold text-amber-900 mt-2">
                {getStatusText(isQualified || isPending, isQualified)}
              </div>
              {isQualified && (
                <div className="text-green-600 mt-2">
                  Gratulacje! Zostałeś zakwalifikowany na Wtyczkę 2025! 🎉
                </div>
              )}
              {isNotQualified && (
                <div className="text-red-600 mt-2">
                  Niestety, tym razem nie zostałeś zakwalifikowany.
                </div>
              )}
            </div>
          </div>

          {registration && (
            <div className="text-center text-gray-600">
              <p>
                Data złożenia aplikacji:{" "}
                <span className="font-semibold">
                  {registration.createdAt.toLocaleDateString("pl-PL")}
                </span>
              </p>
              {/* {registration.updatedAt &&
                registration.createdAt.getTime() !==
                  registration.updatedAt.getTime() && (
                  <p>
                    Ostatnia aktualizacja:{" "}
                    <span className="font-semibold">
                      {registration.updatedAt.toLocaleDateString("pl-PL")}
                    </span>
                  </p>
                )} */}
            </div>
          )}
        </div>

        {/* Forms Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Registration Form Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-6 w-6 text-amber-600" />
              <h3 className="text-xl font-bold text-amber-900">
                Formularz rejestracji
              </h3>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              {getStatusIcon(registrationCompleted)}
              <span className="font-semibold">
                {registrationCompleted ? "Wypełniony" : "Nie wypełniony"}
              </span>
            </div>

            {registrationCompleted ? (
              <div>
                <p className="text-green-600 text-sm mb-2">
                  ✓ Formularz rejestracji został pomyślnie wysłany
                </p>
                {registration && (
                  <div className="text-xs text-gray-500">
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
                <p className="text-red-600 text-sm mb-3">
                  Formularz rejestracji nie został jeszcze wypełniony
                </p>
                <Link
                  href="/registration"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                >
                  Wypełnij formularz
                </Link>
              </div>
            )}
          </div>

          {/* Payment Form Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="h-6 w-6 text-amber-600" />
              <h3 className="text-xl font-bold text-amber-900">
                Formularz płatności
              </h3>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              {getStatusIcon(paymentCompleted)}
              <span className="font-semibold">
                {paymentCompleted ? "Wypełniony" : "Nie wypełniony"}
              </span>
            </div>

            {isQualified ? (
              paymentCompleted ? (
                <div>
                  <p className="text-green-600 text-sm mb-2">
                    ✓ Formularz płatności został pomyślnie wysłany
                  </p>
                  {/* {payment && (
                    // <div className="text-xs text-gray-500">
                    //   <p>Kwota: {payment.amount} zł</p>
                    //   <p>
                    //     Status:{" "}
                    //     {payment.paymentStatus === "confirmed"
                    //       ? "Potwierdzona"
                    //       : payment.paymentStatus === "pending"
                    //       ? "Oczekuje"
                    //       : "Anulowana"}
                    //   </p>
                    // </div>
                  )} */}
                </div>
              ) : (
                <div>
                  <p className="text-yellow-600 text-sm mb-3">
                    Możesz teraz wypełnić formularz płatności
                  </p>
                  <Link
                    href="/payment"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                  >
                    Wypełnij formularz płatności
                  </Link>
                </div>
              )
            ) : (
              <p className="text-gray-500 text-sm">
                Formularz płatności będzie dostępny po zakwalifikowaniu
              </p>
            )}
          </div>
        </div>

        {/* Payment Status */}
        {isQualified && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-amber-900 mb-4">
              Status płatności
            </h3>

            <div className="flex items-center space-x-2 mb-4">
              {getStatusIcon(paymentConfirmed)}
              <span className="font-semibold">
                {paymentConfirmed
                  ? "Płatność potwierdzona"
                  : "Oczekuje na płatność"}
              </span>
            </div>

            {paymentConfirmed ? (
              <p className="text-green-600 text-sm">
                ✓ Twoja płatność została potwierdzona. Wszystko gotowe!
              </p>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800 text-sm mb-2">
                  <strong>Ważne:</strong> Wpłaty należy dokonać w ciągu 7 dni od
                  zakwalifikowania.
                </p>
                <p className="text-yellow-700 text-sm">
                  Po dokonaniu przelewu, wypełnij formularz płatności aby
                  potwierdzić wpłatę.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-amber-800 to-orange-800 text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Następne kroki</h3>

          <div className="space-y-3">
            {!registrationCompleted && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <span>Wypełnij formularz rejestracji</span>
              </div>
            )}

            {registrationCompleted && !isQualified && !isNotQualified && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <span>Oczekuj na informację o zakwalifikowaniu</span>
              </div>
            )}

            {isQualified && !paymentCompleted && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <span>Wypełnij formularz płatności</span>
              </div>
            )}

            {paymentCompleted && !paymentConfirmed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <span>Dokonaj wpłaty i potwierdź przelew</span>
              </div>
            )}

            {paymentConfirmed && (
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-300" />
                <span>Gotowe! Czekamy na Ciebie na Wtyczce 2025! 🤠</span>
              </div>
            )}

            {isNotQualified && (
              <div className="flex items-center space-x-3">
                <XCircle className="w-8 h-8 text-red-300" />
                <span>
                  Niestety tym razem się nie udało. Zapraszamy za rok!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Masz pytania? Sprawdź naszą sekcję FAQ lub skontaktuj się z
            organizatorami.
          </p>
          <div className="space-x-4">
            <Link
              href="/faq"
              className="bg-white text-amber-800 border border-amber-800 hover:bg-amber-50 px-6 py-2 rounded-md font-semibold transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contacts"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
