"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Calendar,
  MapPin,
  UserRound,
  CheckCircle,
  Shield,
  Phone,
  Ambulance,
  Bus,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { createPayment, getPayment, PaymentRecord } from "@/usecases/payments";
import { getRegistration, RegistrationRecord } from "@/usecases/registrations";
import { handleSupabaseError } from "@/lib/supabase";
import Image from "next/image";
import {
  uploadPaymentConfirmation,
  validatePaymentFile,
  formatFileSize,
  FileUploadResult,
} from "@/lib/storage";

// Schema walidacji dla formularza płatności
const paymentSchema = z.object({
  adminPassword: z.string().min(1, "Hasło administratora jest wymagane"),

  studentStatus: z.string().min(1, "Status studenta jest wymagany").refine(val => ["politechnika", "other", "not-student"].includes(val), {
    message: "Status studenta jest wymagany"
  }),
  emergencyContactNameSurname: z
    .string()
    .min(2, "Imię i nazwisko jest wymagane"),
  emergencyContactPhone: z.string().min(9, "Numer telefonu jest wymagany"),
  emergencyContactRelation: z
    .string()
    .min(1, "Stopień pokrewieństwa jest wymagany"),
  needsTransport: z.boolean(),
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  transferConfirmation: z.boolean().refine((val) => val === true, {
    message: "Musisz potwierdzić wykonanie przelewu",
  }),
  ageConfirmation: z.boolean().refine((val) => val === true, {
    message: "Musisz potwierdzić, że masz ukończone 18 lat",
  }),
  cancellationPolicy: z.boolean().refine((val) => val === true, {
    message: "Musisz zaakceptować politykę anulowania",
  }),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function PaymentPage() {
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();

  const realLang = language || "pl";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRegistration, setUserRegistration] = useState<RegistrationRecord | null>(null);
  const [existingPayment, setExistingPayment] = useState<PaymentRecord | null>(null);
  const [uploadedFile, setUploadedFile] = useState<FileUploadResult | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [daysUntilEvent, setDaysUntilEvent] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Calculate days until event
  useEffect(() => {
    const eventDate = new Date("2025-10-23");
    const today = new Date();
    const timeDiff = eventDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDaysUntilEvent(daysDiff > 0 ? daysDiff : 0);
  }, []);

  // Check user's registration and payment status
  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        try {
          const [registration, payment] = await Promise.all([
            getRegistration(user.id),
            getPayment(user.id),
          ]);

          setUserRegistration(registration);
          setExistingPayment(payment);
        } catch (error) {
          console.error("Error checking user status:", error);
        }
      }
    };

    checkUserStatus();
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    setError,
    trigger,
    getValues
  } = useForm<PaymentFormData>({
  resolver: zodResolver(paymentSchema),
  defaultValues: { needsTransport: false, studentStatus: "" },
  mode: "onChange"
  });

  const [showErrorTooltip, setShowErrorTooltip] = useState(false);

  const adminPassword = watch("adminPassword");

  const checkAdminPassword = () => {
    const correctPassword =
      process.env.NEXT_PUBLIC_PAYMENT_FORM_PASSWORD || "admin123";
    if (adminPassword === correctPassword) {
      setIsAuthorized(true);
      toast.success("Dostęp do formularza płatności został aktywowany");
    } else {
      setError("adminPassword", {
        type: "manual",
        message: "Nieprawidłowe hasło administratora",
      });
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const validationError = validatePaymentFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsFileUploading(true);
    try {
      const uploadResult = await uploadPaymentConfirmation(file, user);
      setUploadedFile(uploadResult);
      toast.success("Plik został przesłany pomyślnie!");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Błąd podczas przesyłania pliku"
      );
    } finally {
      setIsFileUploading(false);
      // Clear the input
      event.target.value = "";
    }
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    toast.success("Plik został usunięty");
  };

  const onSubmit = async (data: PaymentFormData) => {
    // Wymuszenie konwersji needsTransport na boolean
    if (!isAuthorized) {
      toast.error("Musisz najpierw aktywować dostęp do formularza");
      return;
    }

    if (!user || !userRegistration) {
      toast.error("Brak danych użytkownika lub rejestracji");
      return;
    }

    if (!uploadedFile) {
      toast.error("Musisz przesłać potwierdzenie płatności");
      return;
    }

    setIsSubmitting(true);
    try {
      const { adminPassword: _, ...paymentData } = data;

      const mappedPaymentRecord = {
        studentStatus: paymentData.studentStatus,
        emergencyContactNameSurname: paymentData.emergencyContactNameSurname,
        emergencyContactPhone: paymentData.emergencyContactPhone,
        emergencyContactRelation: paymentData.emergencyContactRelation,
        needsTransport: paymentData.needsTransport,
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
        "id" | "userId" | "registrationId" | "createdAt" | "updatedAt"
      >;

      await createPayment(user, mappedPaymentRecord);
      toast.success("Formularz płatności został wysłany pomyślnie!");

      // Refresh payment data
      const payment = await getPayment(user.id);
      setExistingPayment(payment);
    } catch (error) {
      console.error("Submit error:", error);
      alert('Błąd wysyłki: ' + (error instanceof Error ? error.message : String(error)));
      const errorMessage = handleSupabaseError(error, realLang);
      toast.error(`Wystąpił błąd: ${errorMessage}`);
    } finally {
    setIsSubmitting(false);
    }
  };

  const bankAccountDetails = {
    accountNumber: "12 3456 7890 1234 5678 9012 3456",
    accountHolder: "Samorząd Studencki EEIA",
    bankName: "Bank Przykładowy",
    transferTitle: `Wtyczka 2025 - ${user?.email}`,
    amount: `${process.env.PAYMENT_AMOUNT || "850"}zł`,
  };

  // Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤠</div>
          <div className="text-xl text-amber-400">Ładowanie...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-[#18181b] rounded-2xl shadow-xl border border-[#262626]">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-amber-400 mb-4">
            Dostęp ograniczony
          </h1>
          <p className="text-gray-300 mb-6">
            Aby wypełnić formularz płatności, musisz się najpierw zalogować.
          </p>
          <Link
            href="/"
            className="bg-[#E7A801] hover:bg-amber-700 text-black px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    );
  }

  // Show existing payment if already submitted
  if (existingPayment) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with logo */}
          <section className="border-b border-[#262626] text-white py-16 mb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
                Potwierdzenie płatności
              </h1>
              <p className="text-xl text-gray-200">
                Sprawdź status i szczegóły swojej płatności za Wtyczkę 2025
              </p>
            </div>
          </section>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-green-900 rounded-full p-4 shadow-lg mb-4">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-amber-400 mb-2">
              Formularz płatności przyjęty!
            </h1>
            <p className="text-lg text-gray-300">
              Dziękujemy za wypełnienie formularza płatności
            </p>
          </div>

          <div className="bg-[#18181b] rounded-2xl shadow-xl p-8 border border-[#262626]">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-[#262626] rounded-full p-3">
                <CreditCard className="h-8 w-8 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Potwierdzenie płatności
                </h2>
                <p className="text-amber-400 text-sm">
                  Wysłano: {existingPayment.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-6">
              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-[#262626]">
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 text-amber-400 mr-2" />
                  <h3 className="font-semibold text-amber-400">
                    Dane zgłoszenia
                  </h3>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="text-gray-500">Status studenta:</span>{" "}
                    <span className="font-medium">
                      {existingPayment.studentStatus === "politechnika" 
                        ? "Politechnika Łódzka" 
                        : existingPayment.studentStatus === "other" 
                          ? "Inna uczelnia" 
                          : "Nie student"}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Transport:</span>{" "}
                    <span className="font-medium">
                      {existingPayment.needsTransport ? "Tak" : "Nie"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-[#0F0F0F] rounded-xl p-6 border border-[#262626]">
                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 text-amber-400 mr-2" />
                  <h3 className="font-semibold text-amber-400">
                    Kontakt alarmowy
                  </h3>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="text-gray-500">Osoba:</span>{" "}
                    <span className="font-medium">{existingPayment.emergencyContactNameSurname}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Telefon:</span>{" "}
                    <span className="font-medium">{existingPayment.emergencyContactPhone}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Relacja:</span>{" "}
                    <span className="font-medium">{existingPayment.emergencyContactRelation}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            {(existingPayment.medicalConditions || existingPayment.medications) && (
              <div className="mt-6 bg-[#0F0F0F] rounded-xl p-6 border border-[#262626]">
                <div className="flex items-center mb-4">
                  <Ambulance className="h-5 w-5 text-amber-400 mr-2" />
                  <h3 className="font-semibold text-amber-400">
                    Informacje medyczne
                  </h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  {existingPayment.medicalConditions && (
                    <p>
                      <span className="text-gray-500 block mb-1">Stan zdrowia:</span>{" "}
                      <span className="font-medium">{existingPayment.medicalConditions}</span>
                    </p>
                  )}
                  {existingPayment.medications && (
                    <p>
                      <span className="text-gray-500 block mb-1">Przyjmowane leki:</span>{" "}
                      <span className="font-medium">{existingPayment.medications}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 bg-[#0F0F0F] rounded-xl p-6 border border-[#262626]">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-amber-400 mr-2" />
                <h3 className="font-semibold text-amber-400">
                  Przesłane potwierdzenie płatności
                </h3>
              </div>

              <div className="bg-[#232323] rounded-md p-4">
                <p className="text-sm text-gray-300 mb-1">
                  Nazwa pliku: <span className="text-amber-400">{existingPayment.paymentConfirmationFile.fileName}</span>
                </p>
                <p className="text-sm text-gray-300 mb-3">
                  Rozmiar: <span className="text-amber-400">{formatFileSize(existingPayment.paymentConfirmationFile.fileSize)}</span>
                </p>

                <a
                  href={existingPayment.paymentConfirmationFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm bg-[#E7A801] hover:bg-amber-700 text-black px-5 py-2.5 rounded-xl font-medium transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Podgląd potwierdzenia
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#262626]">
              <p className="text-sm text-gray-400 text-center mb-6">
                Status Twojego zgłoszenia możesz sprawdzić w panelu uczestnika.
              </p>

              <div className="flex justify-center">
                <Link
                  href="/status"
                  className="inline-flex items-center bg-[#E7A801] hover:bg-amber-700 text-black px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Sprawdź status</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Event countdown section */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Do Wtyczki 2025 pozostało:</h3>
            <div className="bg-[#18181b] inline-flex items-center px-8 py-4 rounded-xl border border-[#262626]">
              <Calendar className="h-6 w-6 text-amber-400 mr-3" />
              <span className="text-3xl font-bold text-amber-400">{daysUntilEvent}</span>
              <span className="ml-2 text-xl text-white">dni</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is registered before allowing payment
  if (!userRegistration) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with logo */}
          <section className="relative bg-black text-white overflow-hidden mb-8">
            <div className="relative max-w-7xl mx-auto text-center flex flex-col justify-center items-center">
              <div className="flex flex-col items-center">
                <Image
                  src="/logo.svg"
                  alt="Logo wtyczka"
                  width={400}
                  height={150}
                  className="m-0 p-0 leading-none"
                  style={{ display: "block", marginBottom: "-15px" }}
                />
                <p
                  className="text-xl md:text-2xl m-0 p-0 text-white leading-none"
                  style={{ marginTop: "-4px" }}
                >
                  Płatność za Wtyczkę 2025
                </p>
              </div>
            </div>
          </section>

          <div className="max-w-md mx-auto text-center p-8 bg-[#18181b] rounded-2xl shadow-xl border border-[#262626]">
            <div className="text-amber-500 mb-4">
              <AlertTriangle className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-amber-400 mb-4">
              Wymagana rejestracja
            </h1>
            <p className="text-gray-300 mb-6">
              Aby dokonać płatności, musisz najpierw wypełnić formularz rejestracyjny.
            </p>
            <Link
              href="/registration"
              className="bg-[#E7A801] hover:bg-amber-700 text-black px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Przejdź do rejestracji
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header like on news page, no logo */}
        <section className="border-b border-[#262626] text-white py-16 mb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
              Formularz płatności
            </h1>
            <p className="text-xl text-gray-200">
              Wypełnij formularz płatności za Wtyczkę 2025
            </p>
          </div>
        </section>

        {/* Admin Password Section */}
        {!isAuthorized && (
          <div className="max-w-lg mx-auto">
            <div className="bg-[#18181b] rounded-2xl shadow-lg p-8 border border-[#262626]">
              <div className="flex items-center mb-6">
                <div className="bg-[#262626] rounded-full p-3">
                  <Lock className="h-6 w-6 text-amber-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-white">
                    Autoryzacja administratora
                  </h2>
                  <p className="text-gray-400">
                    Podaj hasło aby odblokować formularz
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hasło administratora
                </label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    {...register("adminPassword")}
                    className="w-full px-3 py-3 border border-[#262626] bg-[#232323] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                    placeholder="Wprowadź hasło..."
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-amber-400"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.adminPassword && (
                  <p className="mt-2 text-red-500 text-sm">
                    {errors.adminPassword.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={checkAdminPassword}
                className="w-full bg-[#E7A801] hover:bg-amber-700 text-black py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center"
              >
                <Lock className="h-5 w-5 mr-2" />
                <span>Weryfikuj hasło</span>
              </button>
            </div>
          </div>
        )}

        {/* Payment form - visible only when authorized */}
        {isAuthorized && (
          <>
            {/* Ostrzeżenie o konsekwencjach podawania fałszywych danych */}
            <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-400 text-lg">UWAGA!</h3>
                  <p className="text-gray-200">
                    Podawanie fałszywych informacji (np. osoba niepełnoletnia w dniu wyjazdu wpisująca fałszywą datę urodzenia) 
                    będzie wiązało się z negatywnymi konsekwencjami - niedopuszczenie uczestnika do wyjazdu oraz permanentny 
                    zakaz uczestniczenia w przyszłych tego typu wyjazdach.
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={async (e) => {
            e.preventDefault();
            const valid = await trigger();
            if (!valid) {
              return;
            }
            handleSubmit(onSubmit)(e);
          }} className="space-y-8">
            <div className="bg-[#18181b] rounded-2xl shadow-xl p-8 border border-[#262626]">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-[#262626]">
                <CreditCard className="h-6 w-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">
                  Informacje o płatności
                </h2>
              </div>

              <div className="bg-[#0F0F0F] border border-[#262626] rounded-xl p-6 mb-6">
                <h3 className="text-lg font-medium text-amber-400 mb-3">
                  Dane do przelewu
                </h3>
                <div className="space-y-2 text-white">
                  <p>
                    <span className="text-gray-400">Numer konta:</span>{" "}
                    <span className="font-mono bg-[#232323] px-2 py-1 rounded">
                      {bankAccountDetails.accountNumber}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Odbiorca:</span>{" "}
                    {bankAccountDetails.accountHolder}
                  </p>
                  <p>
                    <span className="text-gray-400">Bank:</span>{" "}
                    {bankAccountDetails.bankName}
                  </p>
                  <p>
                    <span className="text-gray-400">Tytuł przelewu:</span>{" "}
                    <span className="font-medium text-amber-400">
                      {bankAccountDetails.transferTitle}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Kwota:</span>{" "}
                    <span className="font-bold text-lg text-amber-400">
                      {bankAccountDetails.amount}
                    </span>
                  </p>
                </div>
              </div>

              {/* Upload payment confirmation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Potwierdzenie przelewu (max 5MB)<span className="text-red-500">*</span>
                </label>
                {!uploadedFile ? (
                  <>
                    <div className="border-2 border-dashed border-[#262626] rounded-xl p-6 text-center">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400 mb-4">
                        Prześlij potwierdzenie płatności (PDF, JPG, PNG)
                      </p>
                      <div className="relative">
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: "none" }}
                        />
                        <button
                          type="button"
                          className="bg-[#E7A801] hover:bg-amber-700 text-black py-2 px-6 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center mx-auto"
                          disabled={isFileUploading}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {isFileUploading ? (
                            "Przesyłanie..."
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" /> Wybierz plik
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Error message for missing file below the box */}
                    {errors.transferConfirmation && (
                      <p className="mt-2 text-red-500 text-sm">Potwierdzenie przelewu jest wymagane</p>
                    )}
                  </>
                ) : (
                  <div className="bg-[#0F0F0F] rounded-xl p-4 border border-[#262626]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-amber-400" />
                        <div>
                          <p className="text-amber-400 font-medium text-sm">
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
                        className="bg-[#232323] hover:bg-[#2c2c2c] text-gray-300 p-2 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Student status & emergency contact */}
            <div className="bg-[#18181b] rounded-2xl shadow-xl p-8 border border-[#262626]">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-[#262626]">
                <Shield className="h-6 w-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">
                  Informacje dodatkowe
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-end h-full">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status studenta <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div>
                    <select
                      {...register("studentStatus")}
                      className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Wybierz...</option>
                      <option value="politechnika">Politechnika Łódzka</option>
                      <option value="other">Inna uczelnia</option>
                      <option value="not-student">Nie jestem studentem</option>
                    </select>
                    {errors.studentStatus && (
                      <p className="mt-1 text-red-500 text-sm">
                        Status studenta jest wymagany
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Czy dojeżdżasz samodzielnie (tam, z powrotem i na atrakcje)?
                  </label>
                  <div className="flex items-center space-x-2 h-10">
          <label className="flex items-center cursor-pointer gap-2 select-none">
            <span className="relative inline-flex items-center">
              <input
                type="checkbox"
                {...register("needsTransport", { setValueAs: v => !v })}
                className="peer h-5 w-5 aspect-square text-amber-600 focus:ring-amber-500 border border-gray-400 rounded bg-[#232323] cursor-pointer appearance-none checked:bg-amber-500 checked:border-amber-500"
              />
              <svg className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="5 10 9 14 15 7" />
              </svg>
            </span>
            <span className="text-white text-sm">Tak, dojeżdżam samodzielnie</span>
          </label>
                  </div>  
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-8 border-t border-[#262626] pt-6">
                <h3 className="font-semibold text-amber-400 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Kontakt w razie wypadku
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Imię i nazwisko <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("emergencyContactNameSurname")}
                      className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {errors.emergencyContactNameSurname && (
                      <p className="mt-1 text-red-500 text-sm">
                        {errors.emergencyContactNameSurname.message}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Numer telefonu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register("emergencyContactPhone", { setValueAs: v => String(v) })}
                        className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      {errors.emergencyContactPhone && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.emergencyContactPhone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Stopień pokrewieństwa <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("emergencyContactRelation")}
                        className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="np. matka, ojciec, rodzeństwo"
                      />
                      {errors.emergencyContactRelation && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.emergencyContactRelation.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical information */}
              <div className="mt-8 border-t border-[#262626] pt-6">
                <h3 className="font-semibold text-amber-400 mb-4 flex items-center">
                  <Ambulance className="h-5 w-5 mr-2" />
                  Informacje medyczne (opcjonalne)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stan zdrowia / choroby
                    </label>
                    <textarea
                      {...register("medicalConditions")}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Podaj informacje o swoim stanie zdrowia, które mogą być istotne..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Przyjmowane leki
                    </label>
                    <textarea
                      {...register("medications")}
                      rows={2}
                      className="w-full px-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Podaj leki, które regularnie przyjmujesz..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="bg-[#18181b] rounded-2xl shadow-xl p-8 border border-[#262626]">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-[#262626]">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">
                  Zgody i oświadczenia
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <label className="flex items-center cursor-pointer select-none">
                    <span className="relative inline-block">
                      <input
                        type="checkbox"
                        {...register("transferConfirmation")}
                        className="peer h-5 w-5 aspect-square mt-0.5 text-amber-600 focus:ring-amber-500 border border-gray-400 rounded bg-[#232323] cursor-pointer appearance-none checked:bg-amber-500 checked:border-amber-500"
                      />
                      <svg className="pointer-events-none absolute left-0 top-0.5 h-5 w-5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="5 10 9 14 15 7" />
                      </svg>
                    </span>
                    <span className="ml-3 text-gray-300">
                      Potwierdzam, że wykonałem/am przelew na wskazane konto bankowe
                      i załączyłem/am jego potwierdzenie. <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
                {errors.transferConfirmation && (
                  <p className="text-red-500 text-sm">
                    {errors.transferConfirmation.message}
                  </p>
                )}

                <div className="flex items-start">
                  <label className="flex items-center cursor-pointer select-none">
                    <span className="relative inline-block">
                      <input
                        type="checkbox"
                        {...register("ageConfirmation")}
                        className="peer h-5 w-5 aspect-square mt-0.5 text-amber-600 focus:ring-amber-500 border border-gray-400 rounded bg-[#232323] cursor-pointer appearance-none checked:bg-amber-500 checked:border-amber-500"
                      />
                      <svg className="pointer-events-none absolute left-0 top-0.5 h-5 w-5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="5 10 9 14 15 7" />
                      </svg>
                    </span>
                    <span className="ml-3 text-gray-300">
                      Oświadczam, że mam ukończone 18 lat w dniu wyjazdu. <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
                {errors.ageConfirmation && (
                  <p className="text-red-500 text-sm">
                    {errors.ageConfirmation.message}
                  </p>
                )}

                <div className="flex items-start">
                  <label className="flex items-center cursor-pointer select-none">
                    <span className="relative inline-block">
                      <input
                        type="checkbox"
                        {...register("cancellationPolicy")}
                        className="peer h-5 w-5 aspect-square mt-0.5 text-amber-600 focus:ring-amber-500 border border-gray-400 rounded bg-[#232323] cursor-pointer appearance-none checked:bg-amber-500 checked:border-amber-500"
                      />
                      <svg className="pointer-events-none absolute left-0 top-0.5 h-5 w-5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="5 10 9 14 15 7" />
                      </svg>
                    </span>
                    <span className="ml-3 text-gray-300">
                      Rozumiem i akceptuję politykę anulowania, zgodnie z którą zwrot
                      pieniędzy jest możliwy tylko do 30 dni przed wydarzeniem. <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
                {errors.cancellationPolicy && (
                  <p className="text-red-500 text-sm">
                    {errors.cancellationPolicy.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`inline-flex items-center px-8 py-3 rounded-xl font-semibold transition-colors shadow-md
                  ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}
                  ${(!uploadedFile || !isValid) ? "bg-amber-700 text-black" : "bg-[#E7A801] hover:bg-amber-700 text-black"}
                `}
                disabled={isSubmitting}
              >
                <Save className="h-5 w-5 mr-2" />
                {isSubmitting ? "Wysyłanie..." : "Wyślij formularz płatności"}
              </button>
            </div>
          </form>
          </>
        )}
      </div>
    </div>
  );
}

