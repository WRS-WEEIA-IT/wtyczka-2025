"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, School, Info, Save } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  createRegistration,
  getRegistration,
  ParticipantRecord,
} from "@/lib/firestore";
import { handleSupabaseError } from "@/lib/supabase";

// Schema walidacji dla formularza
const registrationSchema = z.object({
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  surname: z.string().min(2, "Nazwisko musi mieć co najmniej 2 znaki"),
  dob: z.string().min(1, "Data urodzenia jest wymagana"),
  phoneNumber: z.string().min(9, "Numer telefonu musi mieć co najmniej 9 cyfr"),
  pesel: z.string().length(11, "PESEL musi mieć 11 cyfr"),
  gender: z.enum(["male", "female", "other"]),

  faculty: z.enum(["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9"]),
  studentNumber: z.string().min(1, "Numer indeksu jest wymagany"),
  studyField: z.string().min(1, "Kierunek studiów jest wymagany"),
  studyLevel: z.enum(["bachelor", "master", "phd"]),
  studyYear: z.enum(["1", "2", "3", "4"]),

  dietName: z.enum(["standard", "vegetarian"]),
  tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  aboutWtyczka: z.enum([
    "social-media",
    "akcja-integracja",
    "friend",
    "stands",
    "other",
  ]),
  aboutWtyczkaInfo: z.string().optional(),

  invoice: z.boolean(),
  invoiceName: z.string().optional(),
  invoiceSurname: z.string().optional(),
  invoiceId: z.string().optional(),
  invoiceAddress: z.string().optional(),

  regAccept: z.boolean().refine((val) => val === true, {
    message: "Musisz zaakceptować regulamin",
  }),
  rodoAccept: z.boolean().refine((val) => val === true, {
    message: "Musisz wyrazić zgodę na przetwarzanie danych",
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationPage() {
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();

  const realLang = language || "pl";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegulations, setShowRegulations] = useState(false);
  const [existingRegistration, setExistingRegistration] =
    useState<ParticipantRecord | null>(null);

  const {
    register,
    handleSubmit,
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
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤠</div>
          <div className="text-xl text-amber-400">Ładowanie...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-gray-800 rounded-lg shadow-lg border border-amber-600">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-amber-400 mb-4">
            Dostęp ograniczony
          </h1>
          <p className="text-gray-300 mb-6">
            Aby wypełnić formularz rejestracji, musisz się najpierw zalogować.
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

  const onSubmit = async (data: RegistrationFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const dobDate = new Date(data.dob);
      const formData = {
        ...data,
        dob: dobDate,
        pesel: parseInt(data.pesel),
        studentNumber: parseInt(data.studentNumber),
        studyYear: parseInt(data.studyYear),
      } as Omit<
        ParticipantRecord,
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-4">
              Rejestracja już wysłana
            </h1>
            <p className="text-lg text-amber-700">
              Twoja rejestracja została już pomyślnie wysłana
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {existingRegistration.name} {existingRegistration.surname}
                </h2>
                {/* <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      existingRegistration.status === "qualified"
                        ? "text-green-600"
                        : existingRegistration.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {existingRegistration.status === "qualified"
                      ? "Zakwalifikowany"
                      : existingRegistration.status === "pending"
                      ? "Oczekuje"
                      : existingRegistration.status === "not-qualified"
                      ? "Niezakwalifikowany"
                      : "Wycofany"}
                  </span>
                </p> */}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Dane osobowe
                </h3>
                <p className="text-sm text-gray-600">
                  Email: {existingRegistration.email}
                </p>
                <p className="text-sm text-gray-600">
                  Telefon: {existingRegistration.phoneNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Data urodzenia:{" "}
                  {existingRegistration.dob.toLocaleDateString("pl-PL")}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Dane studenta
                </h3>
                <p className="text-sm text-gray-600">
                  Wydział: {existingRegistration.faculty}
                </p>
                <p className="text-sm text-gray-600">
                  Nr indeksu: {existingRegistration.studentNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Kierunek: {existingRegistration.studyField}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Data rejestracji:{" "}
                {existingRegistration.createdAt.toLocaleDateString("pl-PL")}
              </p>

              <div className="flex space-x-4">
                <Link
                  href="/status"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Sprawdź status
                </Link>

                {/* {existingRegistration.status === "qualified" && (
                  <Link
                    href="/payment"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
                  >
                    Przejdź do płatności
                  </Link>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            Formularz rejestracji na Wtyczkę 2025
          </h1>
          <p className="text-lg text-amber-700">
            Wypełnij wszystkie pola, aby zarejestrować się na wydarzenie
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Zalogowany jako: <span className="font-semibold">{user.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Dane uczestnika */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-amber-900">
                {t.forms.participantData}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.firstName} *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.lastName} *
                </label>
                <input
                  type="text"
                  {...register("surname")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.surname && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.surname.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.birthDate} *
                </label>
                <input
                  type="date"
                  {...register("dob")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dob.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.phone} *
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.pesel} *
                </label>
                <input
                  type="text"
                  maxLength={11}
                  {...register("pesel")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.pesel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pesel.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.gender} *
                </label>
                <select
                  {...register("gender")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <School className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-amber-900">
                {t.forms.studentData}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.faculty} *
                </label>
                <select
                  {...register("faculty")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.studentNumber} *
                </label>
                <input
                  type="text"
                  {...register("studentNumber")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.studentNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.studentNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.fieldOfStudy} *
                </label>
                <input
                  type="text"
                  {...register("studyField")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.studyField && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.studyField.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.studyLevel} *
                </label>
                <select
                  {...register("studyLevel")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.studyYear} *
                </label>
                <select
                  {...register("studyYear")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Info className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-amber-900">
                {t.forms.additionalInfo}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.diet}
                </label>
                <select
                  {...register("dietName")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Wybierz diete</option>
                  <option value="standard">Standardowa</option>
                  <option value="vegetarian">Wegetariańska (+30zł)</option>
                </select>
                {errors.dietName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dietName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.tshirtSize} *
                </label>
                <select
                  {...register("tshirtSize")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("invoice")}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label className="text-sm text-gray-700">
                    {t.forms.invoice}
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forms.howDidYouKnow} *
                </label>
                <select
                  {...register("aboutWtyczka")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            </div>
          </div>

          {/* Zgody */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-amber-900 mb-4">
              Zgody i regulamin
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  {...register("regAccept")}
                  className="mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label className="text-sm text-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowRegulations(true)}
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    {t.forms.acceptRegulations}
                  </button>
                </label>
              </div>
              {errors.regAccept && (
                <p className="text-red-500 text-sm">
                  {errors.regAccept.message}
                </p>
              )}

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  {...register("rodoAccept")}
                  className="mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label className="text-sm text-gray-700">
                  {t.forms.dataProcessingConsent}
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
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-12 py-4 rounded-md font-semibold text-lg transition-colors inline-flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{isSubmitting ? "Wysyłanie..." : t.forms.submit}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Regulations Modal */}
      {showRegulations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">
                Regulamin Wtyczki 2025
              </h2>
              <div className="prose text-gray-700 space-y-4">
                <p>
                  <strong>§1. Informacje ogólne</strong>
                  <br />
                  Niniejszy regulamin określa zasady uczestnictwa w wydarzeniu
                  Wtyczka 2025.
                </p>
                <p>
                  <strong>§2. Uczestnictwo</strong>
                  <br />W wydarzeniu mogą uczestniczyć studenci EEIA oraz innych
                  wydziałów.
                </p>
                <p>
                  <strong>§3. Opłaty</strong>
                  <br />
                  Rezygnacja z uczestnictwa mniej niż 10 dni przed wydarzeniem
                  nie uprawnia do zwrotu wpłaty.
                </p>
                <p>
                  <strong>§4. Przetwarzanie danych</strong>
                  <br />
                  Dane osobowe uczestników będą przetwarzane zgodnie z RODO.
                </p>
                <p className="text-sm text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Pellentesque habitant morbi tristique senectus et netus et
                  malesuada fames ac turpis egestas.
                </p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowRegulations(false)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
