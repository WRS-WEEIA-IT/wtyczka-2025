"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { User, School, Info, Save, AlertTriangle } from "lucide-react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  createRegistration,
  getRegistration,
  RegistrationRecord,
} from "@/usecases/registrations";
import { handleSupabaseError } from "@/lib/supabase";

// Schema walidacji dla formularza
const EVENT_DATE = new Date("2025-10-23"); // data wydarzenia

const registrationSchema = z.object({
  // Imię - tylko litery alfabetu + spacje, max 50 znaków
  name: z
    .string()
    .min(2, "Imię musi mieć co najmniej 2 znaki")
    .max(50, "Imię nie może przekraczać 50 znaków")
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      "Imię może zawierać tylko litery i spacje"
    ),

  // Nazwisko - tylko litery alfabetu + spacje, max 50 znaków
  surname: z
    .string()
    .min(2, "Nazwisko musi mieć co najmniej 2 znaki")
    .max(50, "Nazwisko nie może przekraczać 50 znaków")
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      "Nazwisko może zawierać tylko litery i spacje"
    ),

  // Data urodzenia - osoba musi być 18+ w dniu wyjazdu i mieć mniej niż 70 lat
  dob: z
    .string()
    .min(1, "Data urodzenia jest wymagana")
    .refine(
      (value) => {
        const birthDate = new Date(value);
        if (isNaN(birthDate.getTime())) return false;

        // Sprawdzenie czy osoba ma ukończone 18 lat w dniu wydarzenia
        let age = EVENT_DATE.getFullYear() - birthDate.getFullYear();
        const m = EVENT_DATE.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && EVENT_DATE.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 18;
      },
      { message: "Musisz mieć ukończone 18 lat w dniu wydarzenia (23.10.2025)" }
    )
    .refine(
      (value) => {
        const birthDate = new Date(value);
        if (isNaN(birthDate.getTime())) return false;

        // Sprawdzenie czy osoba ma mniej niż 70 lat
        let age = EVENT_DATE.getFullYear() - birthDate.getFullYear();
        const m = EVENT_DATE.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && EVENT_DATE.getDate() < birthDate.getDate())) {
          age--;
        }
        return age < 70;
      },
      { message: "Podaj poprawne dane" }
    ),

  // Numer telefonu - tylko cyfry, znak + i spacje, min 9 cyfr
  phoneNumber: z
    .string()
    .regex(
      /^[+\s\d]+$/,
      "Numer telefonu może zawierać tylko cyfry, znak '+' i spacje"
    )
    .refine(
      (value) => {
        // Sprawdzenie czy po usunięciu spacji i '+' mamy co najmniej 9 cyfr
        const digitsOnly = value.replace(/[^0-9]/g, "");
        return digitsOnly.length >= 9;
      },
      { message: "Numer telefonu musi zawierać co najmniej 9 cyfr" }
    ),

  // PESEL - dokładnie 11 cyfr i zgodny z datą urodzenia
  pesel: z.string().regex(/^\d{11}$/, "PESEL musi składać się z 11 cyfr"),

  // Płeć - wymagana
  gender: z.enum(["male", "female", "other"], "Wybierz płeć"),

  // Wydział - wymagany
  faculty: z.enum(
    ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9"],
    "Wybierz wydział"
  ),

  // Numer indeksu - max 30 znaków, mogą być cyfry i litery
  studentNumber: z
    .string()
    .min(1, "Numer indeksu jest wymagany")
    .max(30, "Numer indeksu nie może przekraczać 30 znaków"),

  // Kierunek studiów - litery i spacje, max 60 znaków
  studyField: z
    .string()
    .min(1, "Kierunek studiów jest wymagany")
    .max(60, "Kierunek studiów nie może przekraczać 60 znaków")
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      "Kierunek studiów może zawierać tylko litery i spacje"
    ),

  // Poziom studiów - wymagany
  studyLevel: z.enum(["bachelor", "master", "phd"], "Wybierz jedną z opcji"),

  // Rok studiów - wymagany
  studyYear: z.enum(["1", "2", "3", "4"], "Wybierz jedną z opcji"),

  // Dieta - wymagana
  dietName: z.enum(["standard", "vegetarian"], "Wybierz jedną z opcji"),

  // Rozmiar koszulki - wymagany
  tshirtSize: z.enum(
    ["XS", "S", "M", "L", "XL", "XXL"],
    "Wybierz jedną z opcji"
  ),

  // Skąd wiesz o wtyczce - wymagane
  aboutWtyczka: z.enum(
    ["social-media", "akcja-integracja", "friend", "stands", "other"],
    "Wybierz jedną z opcji"
  ),
  aboutWtyczkaInfo: z.string().optional(),

  // Dane do faktury - opcjonalne
  invoice: z.boolean(),
  invoiceName: z.string().optional(),
  invoiceSurname: z.string().optional(),
  invoiceId: z.string().optional(),
  invoiceAddress: z.string().optional(),

  // Akceptacja regulaminu - wymagana
  regAccept: z.boolean().refine((val) => val === true, {
    message: "Musisz zaakceptować regulamin",
  }),

  // Zgoda na przetwarzanie danych - wymagana
  rodoAccept: z.boolean().refine((val) => val === true, {
    message: "Musisz wyrazić zgodę na przetwarzanie danych",
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationPage() {
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();

  const realLang = language || "pl";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [existingRegistration, setExistingRegistration] =
    useState<RegistrationRecord | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  // Check if user already has a registration
  useEffect(() => {
    const checkExistingRegistration = async () => {
      if (user) {
        try {
          const registration = await getRegistration(user.id);
          setExistingRegistration(registration);
        } catch (error) {
          console.error("Error checking existing registration:", error);
        }
      }
    };

    checkExistingRegistration();
  }, [user]);

  // Redirect to login if not authenticated
  if (!isMounted) return null;
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
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-[#1a1a1a]/70 rounded-2xl shadow-xl border border-[#262626]">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-amber-400 mb-4">
            Dostęp ograniczony
          </h1>
          <p className="text-gray-300 mb-6">
            Aby wypełnić formularz rejestracji, musisz się najpierw zalogować.
          </p>
          <Link
            href="/"
            className="bg-[#E7A801] hover:bg-amber-700 text-black px-6 py-3 rounded-xl font-bold tracking-wider uppercase transition-colors western-btn block w-full break-words"
            style={{ boxShadow: "0 4px 12px rgba(231, 168, 1, 0.4)" }}
          >
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    );
  }

  // Funkcja do walidacji PESEL z datą urodzenia
  const validatePeselWithDob = (pesel: string, dob: Date): boolean => {
    if (!pesel || pesel.length !== 11) return false;

    // Pobieramy dane z daty urodzenia
    const year = dob.getFullYear();
    const month = dob.getMonth() + 1; // Miesiące w JS są 0-based
    const day = dob.getDate();

    // Pobieramy dane z PESEL
    const peselYearDigits = parseInt(pesel.substring(0, 2), 10); // Pierwsze 2 cyfry - rok (ostatnie 2 cyfry roku)
    const peselMonthDigits = parseInt(pesel.substring(2, 4), 10); // Kolejne 2 cyfry - miesiąc z modyfikacją wieku
    const peselDayDigits = parseInt(pesel.substring(4, 6), 10); // Kolejne 2 cyfry - dzień

    // Określamy rzeczywisty rok i miesiąc w PESEL
    let peselYear, peselMonth;

    // Dla osób urodzonych po 2000 roku, miesiąc ma dodane 20
    if (year >= 2000) {
      // Sprawdzamy czy miesiąc w PESEL ma dodane 20
      peselYear = 2000 + peselYearDigits;
      peselMonth = peselMonthDigits - 20; // Odejmujemy 20, aby uzyskać właściwy miesiąc
    } else {
      // Dla osób urodzonych w XX wieku (1900-1999)
      peselYear = 1900 + peselYearDigits;
      peselMonth = peselMonthDigits;
    }

    // Sprawdzamy zgodność roku, miesiąca i dnia
    const yearMatch = year === peselYear;
    const monthMatch = month === peselMonth;
    const dayMatch = day === peselDayDigits;

    // Wszystkie elementy muszą się zgadzać
    return yearMatch && monthMatch && dayMatch;
  };

  const onSubmit = async (data: RegistrationFormData) => {
    if (!user) return;

    // Walidacja PESEL z datą urodzenia przed wysłaniem
    const dobDate = new Date(data.dob);
    if (!validatePeselWithDob(data.pesel, dobDate)) {
      toast.error("PESEL nie zgadza się z datą urodzenia");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        dob: dobDate,
        studentNumber: parseInt(data.studentNumber),
        studyYear: parseInt(data.studyYear),
      } as Omit<
        RegistrationRecord,
        "id" | "userId" | "email" | "createdAt" | "updatedAt"
      >;
      await createRegistration(user, formData);
      toast.success("Formularz został wysłany pomyślnie!");

      // Refresh the existing registration
      const registration = await getRegistration(user.id);
      setExistingRegistration(registration);
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage = handleSupabaseError(error, realLang);
      toast.error(`Wystąpił błąd: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show existing registration info if it exists
  if (existingRegistration) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Rejestracja wysłana pomyślnie
            </h1>
          </div>

          <div className="bg-[#18181b] rounded-2xl shadow-xl p-8 border border-[#262626]">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-green-900 rounded-full p-3 shadow-lg">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {existingRegistration.name} {existingRegistration.surname}
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-200 mb-2 text-lg">
                  Dane osobowe
                </h3>
                <p className="text-base text-gray-400">
                  Email: {existingRegistration.email}
                </p>
                <p className="text-base text-gray-400">
                  Telefon: {existingRegistration.phoneNumber}
                </p>
                <p className="text-base text-gray-400">
                  Data urodzenia:{" "}
                  {existingRegistration.dob.toLocaleDateString("pl-PL")}
                </p>
                <p className="text-base text-gray-400">
                  PESEL: {existingRegistration.pesel}
                </p>
                <p className="text-base text-gray-400">
                  Płeć:{" "}
                  {existingRegistration.gender === "male"
                    ? "Mężczyzna"
                    : existingRegistration.gender === "female"
                    ? "Kobieta"
                    : "Inna"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-200 mb-2 text-lg">
                  Dane studenta
                </h3>
                <p className="text-base text-gray-400">
                  Wydział: {existingRegistration.faculty}
                </p>
                <p className="text-base text-gray-400">
                  Nr indeksu: {existingRegistration.studentNumber}
                </p>
                <p className="text-base text-gray-400">
                  Kierunek: {existingRegistration.studyField}
                </p>
                <p className="text-base text-gray-400">
                  Poziom studiów:{" "}
                  {existingRegistration.studyLevel === "bachelor"
                    ? "I (Licencjat / Inżynier)"
                    : existingRegistration.studyLevel === "master"
                    ? "II (Magisterskie)"
                    : "III (Doktorskie)"}
                </p>
                <p className="text-base text-gray-400">
                  Rok studiów: {existingRegistration.studyYear}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold text-gray-200 mb-2 text-lg">
                  Preferencje
                </h3>
                <p className="text-base text-gray-400">
                  Dieta:{" "}
                  {existingRegistration.dietName === "standard"
                    ? "Standardowa"
                    : "Wegetariańska"}
                </p>
                <p className="text-base text-gray-400">
                  Rozmiar koszulki: {existingRegistration.tshirtSize}
                </p>
                <p className="text-base text-gray-400">
                  Skąd wiesz o Wtyczce:{" "}
                  {existingRegistration.aboutWtyczka === "social-media"
                    ? "Social Media"
                    : existingRegistration.aboutWtyczka === "akcja-integracja"
                    ? "Akcja Integracja"
                    : existingRegistration.aboutWtyczka === "friend"
                    ? "Od znajomych"
                    : existingRegistration.aboutWtyczka === "stands"
                    ? "Standy"
                    : "Inne"}
                </p>
                {existingRegistration.aboutWtyczkaInfo && (
                  <p className="text-base text-gray-400">
                    Dodatkowe info: {existingRegistration.aboutWtyczkaInfo}
                  </p>
                )}
              </div>

              {existingRegistration.invoice && (
                <div>
                  <h3 className="font-semibold text-gray-200 mb-2 text-lg">
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

            <div className="mt-8 pt-6 border-t border-[#262626]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <p className="text-base text-gray-500 mb-4 md:mb-0 text-center md:text-left">
                  Data rejestracji:{" "}
                  {existingRegistration.createdAt.toLocaleDateString("pl-PL")}
                </p>
                {/* Desktop: przycisk po prawej */}
                <div className="hidden md:block">
                  <Link
                    href="/status"
                    className="bg-[#E7A801] hover:bg-amber-700 text-black px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
                  >
                    Sprawdź status
                  </Link>
                </div>
              </div>
              {/* Mobile: przycisk pod datą, wyśrodkowany */}
              <div className="block md:hidden mt-4 flex justify-center items-center">
                <Link
                  href="/status"
                  className="bg-[#E7A801] hover:bg-amber-700 text-black px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
                >
                  Sprawdź status
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#262626] bg-[#1a1a1a] p-4 rounded-xl">
              <div className="flex items-start space-x-3 border-2 border-[#ff0033] shadow-[0_0_12px_2px_#ff0033] bg-[#1a1a1a] p-4 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-400 text-lg">
                    Zauważyłeś błąd w swoich danych?
                  </h3>
                  <p className="text-gray-300 mt-2">
                    Jeśli jakiekolwiek dane zostały wprowadzone błędnie,
                    skontaktuj się z nami jak najszybciej:
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center">
                      <span className="bg-red-900/40 rounded-full p-1 mr-2">
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
                      <span className="text-gray-300">
                        Telefon:{" "}
                        <a
                          href="tel:+48690150650"
                          className="text-red-400 hover:underline"
                        >
                          +48 690 150 650
                        </a>
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-red-900/40 rounded-full p-1 mr-2">
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
                      <span className="text-gray-300">
                        Email:{" "}
                        <a
                          href="mailto:wtyczka@samorzad.p.lodz.pl"
                          className="text-red-400 hover:underline"
                        >
                          wtyczka@samorzad.p.lodz.pl
                        </a>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - spójny z payment/news */}
        <section className="border-b border-[#262626] text-white py-16 mb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
              Formularz rejestracji
            </h1>
            <p className="text-xl text-gray-200">
              Wypełnij wszystkie pola, aby zarejestrować się na Wtyczkę 2025
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Zalogowany jako:{" "}
              <span className="font-semibold">{user.email}</span>
            </p>
          </div>
        </section>

        {/* Ostrzeżenie o konsekwencjach podawania fałszywych danych */}
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-400 text-lg">UWAGA!</h3>
              <p className="text-gray-200">
                Podawanie fałszywych informacji (np. osoba niepełnoletnia w dniu
                wyjazdu wpisująca fałszywą datę urodzenia) będzie wiązało się z
                negatywnymi konsekwencjami - niedopuszczenie uczestnika do
                wyjazdu oraz permanentny zakaz uczestniczenia w przyszłych tego
                typu wyjazdach.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Dane uczestnika */}
          <div className="bg-[#18181b] rounded-2xl shadow-xl p-6 border border-[#262626]">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">
                {t.forms.participantData}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.firstName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  {...register("name")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.lastName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  {...register("surname")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.surname && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.surname.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.birthDate} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min="1955-01-01"
                  max="2008-10-23"
                  {...register("dob")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dob.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.pesel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={11}
                  {...register("pesel")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.pesel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pesel.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.gender} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("gender")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Wybierz płeć</option>
                  <option value="male">Mężczyzna</option>
                  <option value="female">Kobieta</option>
                  <option value="other">Inna</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dane studenta */}
          <div className="bg-[#18181b] rounded-2xl shadow-xl p-6 border border-[#262626]">
            <div className="flex items-center space-x-2 mb-6">
              <School className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">
                {t.forms.studentData}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.faculty} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("faculty")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.faculty.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.studentNumber}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={30}
                  {...register("studentNumber")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.studentNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.studentNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.fieldOfStudy} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={60}
                  {...register("studyField")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.studyField && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.studyField.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.studyLevel} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("studyLevel")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Wybierz stopień</option>
                  <option value="bachelor">I (Licencjat / Inżynier)</option>
                  <option value="master">II (Magisterskie)</option>
                  <option value="phd">III (Doktorskie)</option>
                </select>
                {errors.studyLevel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.studyLevel.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.studyYear} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("studyYear")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Wybierz rok</option>
                  <option value="1">1 rok</option>
                  <option value="2">2 rok</option>
                  <option value="3">3 rok</option>
                  <option value="4">4 rok</option>
                </select>
                {errors.studyYear && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.studyYear.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dodatkowe informacje */}
          <div className="bg-[#18181b] rounded-2xl shadow-xl p-6 border border-[#262626]">
            <div className="flex items-center space-x-2 mb-6">
              <Info className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">
                {t.forms.additionalInfo}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.diet} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("dietName")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Wybierz diete</option>
                  <option value="standard">Standardowa</option>
                  <option value="vegetarian">Wegetariańska (+20zł)</option>
                </select>
                {errors.dietName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dietName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.tshirtSize} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("tshirtSize")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tshirtSize.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <div className="flex items-start">
                  <label className="flex items-center cursor-pointer select-none">
                    <span className="custom-checkbox-container">
                      <input
                        type="checkbox"
                        {...register("invoice")}
                        className="custom-checkbox-input"
                        onChange={() => setIsInvoice(!isInvoice)}
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Imię do faktury <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("invoiceName")}
                      className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {errors.invoiceName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.invoiceName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nazwisko do faktury{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("invoiceSurname")}
                      className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {errors.invoiceSurname && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.invoiceSurname.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      NIP/PESEL do faktury{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      {...register("invoiceId")}
                      className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {errors.invoiceId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.invoiceId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Adres odbiorcy faktury{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      {...register("invoiceAddress")}
                      className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {errors.invoiceAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.invoiceAddress.message}
                      </p>
                    )}
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.forms.howDidYouKnow}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("aboutWtyczka")}
                  className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Wybierz skąd wiesz</option>
                  <option value="social-media">Social Media</option>
                  <option value="akcja-integracja">Akcja Integracja</option>
                  <option value="friend">Od znajomych</option>
                  <option value="stands">Standy</option>
                  <option value="other">Inne</option>
                </select>
                {errors.aboutWtyczka && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.aboutWtyczka.message}
                  </p>
                )}
              </div>
              {watch("aboutWtyczka") === "other" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dodatkowe informacje (skąd dokładnie?){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    {...register("aboutWtyczkaInfo")}
                    className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.aboutWtyczkaInfo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.aboutWtyczkaInfo.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Zgody */}
          <div className="bg-[#18181b] rounded-2xl shadow-xl p-6 border border-[#262626]">
            <h3 className="text-xl font-bold text-white mb-4">
              Zgody i regulamin
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <label className="flex items-center cursor-pointer select-none">
                  <span className="custom-checkbox-container">
                    <input
                      type="checkbox"
                      {...register("regAccept")}
                      className="custom-checkbox-input"
                    />
                    <div className="custom-checkbox-glow"></div>
                    <div className="custom-checkbox-check">✓</div>
                  </span>
                  <span className="ml-3 text-gray-300">
                    Akceptuję{" "}
                    <a
                      href={process.env.NEXT_PUBLIC_REGULATIONS_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-500 underline"
                    >
                      regulamin
                    </a>{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
              {errors.regAccept && (
                <p className="text-red-500 text-sm">
                  {errors.regAccept.message}
                </p>
              )}
              <div className="flex items-start">
                <label className="flex items-center cursor-pointer select-none">
                  <span className="custom-checkbox-container">
                    <input
                      type="checkbox"
                      {...register("rodoAccept")}
                      className="custom-checkbox-input"
                    />
                    <div className="custom-checkbox-glow"></div>
                    <div className="custom-checkbox-check">✓</div>
                  </span>
                  <span className="ml-3 text-gray-300 text-xs">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych przez
                    Politechnikę Łódzką w celu zorganizowania i przeprowadzenia
                    wyjazdu integracyjno-szkoleniowego &quot;Wtyczka 2025&quot;.
                    Także zgadzam się na otrzymywanie wiadomości tekstowych
                    dotyczących spraw organizacyjnych związanych z Wyjazdem na
                    adres e-mail i numer telefonu podany w formularzu. Klauzula
                    RODO dostępna jest{" "}
                    <a
                      href="https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/dokumenty/rodo.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-500 underline"
                    >
                      tutaj
                    </a>
                    . <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
              {errors.rodoAccept && (
                <p className="text-red-500 text-sm">
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
              className="bg-[#E7A801] hover:bg-amber-700 disabled:opacity-50 text-black px-12 py-4 rounded-xl font-semibold text-lg transition-colors inline-flex items-center space-x-2 shadow-md"
            >
              <Save className="h-5 w-5" />
              <span>{isSubmitting ? "Wysyłanie..." : t.forms.submit}</span>
            </button>
          </div>
        </form>

        {/* Regulations Modal */}
      </div>
    </div>
  );
}
