"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  createPayment,
  getPayment,
  getRegistration,
  PaymentRecord,
  ParticipantRecord,
} from "@/lib/firestore";
import { handleFirestoreError } from "@/lib/firebase";
import {
  uploadPaymentConfirmation,
  validatePaymentFile,
  formatFileSize,
  FileUploadResult,
} from "@/lib/storage";

// Schema walidacji dla formularza płatności
const paymentSchema = z.object({
  adminPassword: z.string().min(1, "Hasło administratora jest wymagane"),
  studentStatus: z.enum(["politechnika", "other", "none"]),
  emergencyContactName: z.string().min(2, "Imię i nazwisko jest wymagane"),
  emergencyContactPhone: z.string().min(9, "Numer telefonu jest wymagany"),
  emergencyContactRelation: z
    .string()
    .min(1, "Stopień pokrewieństwa jest wymagany"),
  transportProvided: z.boolean(),
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  transferConfirmed: z.boolean().refine((val) => val === true, {
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
  const [userRegistration, setUserRegistration] =
    useState<ParticipantRecord | null>(null);
  const [existingPayment, setExistingPayment] = useState<PaymentRecord | null>(
    null
  );
  const [uploadedFile, setUploadedFile] = useState<FileUploadResult | null>(
    null
  );
  const [isFileUploading, setIsFileUploading] = useState(false);

  // Check user's registration and payment status
  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        try {
          const [registration, payment] = await Promise.all([
            getRegistration(user.uid),
            getPayment(user.uid),
          ]);

          console.log("User registration:", registration);
          console.log("Registration status:", registration?.status);
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
    formState: { errors },
    watch,
    setError,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const adminPassword = watch("adminPassword");

  // Redirect to login if not authenticated
  if (loading) {
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
            Aby wypełnić formularz płatności, musisz się najpierw zalogować.
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
    if (!isAuthorized) {
      toast.error("Musisz najpierw aktywować dostęp do formularza");
      return;
    }

    if (!user || !userRegistration) {
      toast.error("Brak danych użytkownika lub rejestracji");
      return;
    }

    setIsSubmitting(true);
    try {
      // Remove admin password from data before saving
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { adminPassword: _, ...paymentData } = data;

      // Map form data to payment structure
      const mappedPaymentRecord = {
        studentStatus: paymentData.studentStatus as
          | "politechnika"
          | "other"
          | "not-student",
        emergencyContactName: paymentData.emergencyContactName,
        emergencyContactPhone: paymentData.emergencyContactPhone,
        needsTransport: paymentData.transportProvided,
        medicalConditions: paymentData.medicalConditions || "",
        medications: paymentData.medications || "",
        transferConfirmation: paymentData.transferConfirmed,
        ageConfirmation: paymentData.ageConfirmation,
        cancellationPolicy: paymentData.cancellationPolicy,
        // Add uploaded file information
        ...(uploadedFile && {
          paymentConfirmationFile: {
            url: uploadedFile.url,
            fileName: uploadedFile.fileName,
            fileSize: uploadedFile.fileSize,
            fileType: uploadedFile.fileType,
            uploadedAt: new Date(),
          },
        }),
      };

      await createPayment(user, userRegistration.id!, mappedPaymentRecord);
      toast.success("Formularz płatności został wysłany pomyślnie!");

      // Refresh payment data
      const payment = await getPayment(user.uid);
      setExistingPayment(payment);
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage = handleFirestoreError(error, realLang);
      toast.error(`Wystąpił błąd: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bankAccountDetails = {
    accountNumber: "12 3456 7890 1234 5678 9012 3456",
    accountHolder: "Samorząd Studencki EEIA",
    bankName: "Bank Przykładowy",
    transferTitle: `Wtyczka 2025 - ${user.email}`,
    amount: `${process.env.PAYMENT_AMOUNT}zł`,
  };

  // Check if user is qualified - temporarily disabled for testing
  if (userRegistration && userRegistration.status !== "qualified" && false) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-amber-900 mb-4">
            Formularz płatności niedostępny
          </h1>
          <p className="text-gray-600 mb-6">
            Formularz płatności jest dostępny tylko dla zakwalifikowanych
            uczestników.
          </p>
          <Link
            href="/status"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
          >
            Sprawdź swój status
          </Link>
        </div>
      </div>
    );
  }

  // Show existing payment if already submitted
  if (existingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-4">
              Formularz płatności już wysłany
            </h1>
            <p className="text-lg text-amber-700">
              Twój formularz płatności został już pomyślnie wysłany
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Formularz płatności
                </h2>
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      existingPayment.paymentStatus === "confirmed"
                        ? "text-green-600"
                        : existingPayment.paymentStatus === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {existingPayment.paymentStatus === "confirmed"
                      ? "Potwierdzona"
                      : existingPayment.paymentStatus === "pending"
                      ? "Oczekuje"
                      : "Anulowana"}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Szczegóły płatności
                </h3>
                <p className="text-sm text-gray-600">
                  Kwota: {existingPayment.amount} zł
                </p>
                <p className="text-sm text-gray-600">
                  Status studenta:{" "}
                  {existingPayment.studentStatus === "politechnika"
                    ? "Politechnika Łódzka"
                    : existingPayment.studentStatus === "other"
                    ? "Inna uczelnia"
                    : "Nie jestem studentem"}
                </p>
                <p className="text-sm text-gray-600">
                  Transport: {existingPayment.needsTransport ? "Tak" : "Nie"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Kontakt awaryjny
                </h3>
                <p className="text-sm text-gray-600">
                  Imię: {existingPayment.emergencyContactName}
                </p>
                <p className="text-sm text-gray-600">
                  Telefon: {existingPayment.emergencyContactPhone}
                </p>
              </div>
            </div>

            {existingPayment.paymentConfirmationFile && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Załączone potwierdzenie płatności
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      {existingPayment.paymentConfirmationFile.fileType ===
                      "application/pdf" ? (
                        <svg
                          className="w-6 h-6 text-amber-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-amber-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {existingPayment.paymentConfirmationFile.fileName
                          .split("-")
                          .slice(2)
                          .join("-")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(
                          existingPayment.paymentConfirmationFile.fileSize
                        )}
                      </p>
                    </div>
                  </div>
                  <a
                    href={existingPayment.paymentConfirmationFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Pobierz
                  </a>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Data wysłania:{" "}
                {existingPayment.createdAt.toLocaleDateString("pl-PL")}
              </p>

              <div className="flex space-x-4">
                <Link
                  href="/status"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Sprawdź status
                </Link>

                <Link
                  href="/contacts"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Kontakt
                </Link>
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
            {t.payment.title}
          </h1>
          <p className="text-lg text-amber-700">
            Wypełnij formularz płatności aby sfinalizować rejestrację
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Zalogowany jako: <span className="font-semibold">{user.email}</span>
          </p>
        </div>

        {/* Admin Password Section */}
        {!isAuthorized && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-red-900">
                Autoryzacja administratora
              </h2>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 text-sm">
                  <strong>Uwaga:</strong> Dostęp do tego formularza wymaga hasła
                  administratora.
                </p>
              </div>
            </div>

            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.payment.passwordRequired}
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  {...register("adminPassword")}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Wprowadź hasło administratora"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.adminPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.adminPassword.message}
                </p>
              )}

              <button
                type="button"
                onClick={checkAdminPassword}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
              >
                Aktywuj dostęp
              </button>
            </div>
          </div>
        )}

        {/* Bank Account Details */}
        {isAuthorized && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              {t.payment.accountDetails}
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Numer konta:</strong>
                <br />
                <span className="font-mono">
                  {bankAccountDetails.accountNumber}
                </span>
              </div>
              <div>
                <strong>Odbiorca:</strong>
                <br />
                {bankAccountDetails.accountHolder}
              </div>
              <div>
                <strong>Bank:</strong>
                <br />
                {bankAccountDetails.bankName}
              </div>
              <div>
                <strong>Kwota:</strong>
                <br />
                {bankAccountDetails.amount}
              </div>
              <div className="md:col-span-2">
                <strong>Tytuł przelewu:</strong>
                <br />
                <span className="font-mono bg-yellow-100 px-2 py-1 rounded">
                  {bankAccountDetails.transferTitle}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form */}
        {isAuthorized && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Student Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <CreditCard className="h-6 w-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-amber-900">
                  Status studenta
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t.payment.studentStatus} *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="politechnika"
                      {...register("studentStatus")}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>{t.payment.politechnika}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="other"
                      {...register("studentStatus")}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>{t.payment.otherUniversity}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="none"
                      {...register("studentStatus")}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>{t.payment.noStudent}</span>
                  </label>
                </div>
                {errors.studentStatus && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.studentStatus.message}
                  </p>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                {t.payment.emergencyContact}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    {...register("emergencyContactName")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.emergencyContactName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.emergencyContactName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numer telefonu *
                  </label>
                  <input
                    type="tel"
                    {...register("emergencyContactPhone")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.emergencyContactPhone.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stopień pokrewieństwa *
                  </label>
                  <input
                    type="text"
                    placeholder="np. matka, ojciec, rodzeństwo"
                    {...register("emergencyContactRelation")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.emergencyContactRelation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.emergencyContactRelation.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                Dodatkowe informacje
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("transportProvided")}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <label className="text-sm text-gray-700">
                      {t.payment.transport}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.payment.medicalConditions}
                  </label>
                  <textarea
                    {...register("medicalConditions")}
                    rows={3}
                    placeholder="Opisz ewentualne schorzenia, alergie pokarmowe, itp."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.payment.medications}
                  </label>
                  <textarea
                    {...register("medications")}
                    rows={3}
                    placeholder="Wymień przyjmowane leki (jeśli dotyczy)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Confirmation Upload */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                Potwierdzenie płatności
              </h3>

              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Prześlij potwierdzenie przelewu (PDF, PNG, JPG - max 5MB)
                </p>

                {!uploadedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="payment-file-upload"
                      disabled={isFileUploading}
                    />
                    <label
                      htmlFor="payment-file-upload"
                      className={`cursor-pointer flex flex-col items-center space-y-2 ${
                        isFileUploading ? "opacity-50" : ""
                      }`}
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-gray-600">
                        {isFileUploading
                          ? "Przesyłanie..."
                          : "Kliknij aby wybrać plik lub przeciągnij tutaj"}
                      </span>
                      <span className="text-sm text-gray-400">
                        PDF, PNG, JPG - max 5MB
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {uploadedFile.fileName.split("-").slice(2).join("-")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(uploadedFile.fileSize)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleFileRemove}
                      className="text-red-600 hover:text-red-700"
                      disabled={isFileUploading}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Confirmations */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                Potwierdzenia
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...register("ageConfirmation")}
                    className="mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label className="text-sm text-gray-700">
                    {t.payment.ageConfirmation}
                  </label>
                </div>
                {errors.ageConfirmation && (
                  <p className="text-red-500 text-sm">
                    {errors.ageConfirmation.message}
                  </p>
                )}

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...register("cancellationPolicy")}
                    className="mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label className="text-sm text-gray-700">
                    {t.payment.cancellationPolicy}
                  </label>
                </div>
                {errors.cancellationPolicy && (
                  <p className="text-red-500 text-sm">
                    {errors.cancellationPolicy.message}
                  </p>
                )}

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...register("transferConfirmed")}
                    className="mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label className="text-sm text-gray-700">
                    {t.payment.transferConfirmation}
                  </label>
                </div>
                {errors.transferConfirmed && (
                  <p className="text-red-500 text-sm">
                    {errors.transferConfirmed.message}
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
                <span>
                  {isSubmitting ? "Wysyłanie..." : "Wyślij formularz płatności"}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
