"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { authUpdatePassword } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordChecklist, setPasswordChecklist] = useState({
    length: false,
    lower: false,
    upper: false,
    digit: false,
    special: false,
  });

  // Sprawdzenie, czy użytkownik jest w sesji resetowania hasła
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Link resetowania hasła wygasł lub jest nieprawidłowy");
        router.push("/");
      }
    };

    checkSession();
  }, [router]);

  const validatePassword = (password: string) => {
    const checklist = {
      length: password.length >= 8,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      digit: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    setPasswordChecklist(checklist);
    if (!password) return "Pole hasło jest wymagane.";
    const allValid = Object.values(checklist).every(Boolean);
    if (!allValid) return "Hasło nie spełnia wszystkich wymagań.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Walidacja hasła
    const passwordValidation = validatePassword(password);
    setPasswordError(passwordValidation);

    // Walidacja potwierdzenia hasła
    let confirmPasswordValidation = null;
    if (!confirmPassword) {
      confirmPasswordValidation = "Pole potwierdzenia hasła jest wymagane.";
    } else if (password !== confirmPassword) {
      confirmPasswordValidation = t.errors.passwordsDontMatch || "Hasła nie są takie same.";
    }
    setConfirmPasswordError(confirmPasswordValidation);

    if (passwordValidation || confirmPasswordValidation) {
      setLoading(false);
      return;
    }

    try {
      await authUpdatePassword(password);
      setResetSuccess(true);
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#232323]/90 via-[#18181b]/90 to-[#232323]/80 shadow-2xl shadow-amber-900/30 backdrop-blur-xl px-8 py-12">
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-400/20 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold text-amber-400 text-center mb-4">Hasło zmienione!</h2>
          <p className="text-gray-300 text-center mb-8">
            Twoje hasło zostało pomyślnie zresetowane. Możesz teraz zalogować się używając nowego hasła.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-amber-400 text-black py-3 px-4 rounded-2xl hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 font-semibold shadow-lg transition-colors text-lg"
          >
            Powrót do strony głównej
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#232323]/90 via-[#18181b]/90 to-[#232323]/80 shadow-2xl shadow-amber-900/30 backdrop-blur-xl px-8 py-12">
        <h2 className="text-3xl font-bold text-amber-400 text-center mb-8">Utwórz nowe hasło</h2>
        <p className="text-gray-300 text-center mb-8">
          Wprowadź nowe hasło dla swojego konta.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nowe hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-300" />
              <input
                type="password"
                className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#232323]/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60 placeholder-gray-400"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                placeholder="Nowe hasło"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-2">
              <div>
                <div className={passwordChecklist.length ? "text-green-600 text-xs font-medium" : "text-red-500 text-xs font-medium"}>• min. 8 znaków</div>
                <div className={passwordChecklist.lower && passwordChecklist.upper ? "text-green-600 text-xs font-medium" : "text-red-500 text-xs font-medium"}>• mała i wielka litera</div>
              </div>
              <div>
                <div className={passwordChecklist.digit ? "text-green-600 text-xs font-medium" : "text-red-500 text-xs font-medium"}>• cyfra</div>
                <div className={passwordChecklist.special ? "text-green-600 text-xs font-medium" : "text-red-500 text-xs font-medium"}>• znak specjalny</div>
              </div>
            </div>
            {passwordError && (
              <div className="text-red-500 text-xs mt-2 font-medium">{passwordError}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Potwierdź nowe hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-300" />
              <input
                type="password"
                className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#232323]/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60 placeholder-gray-400"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError(null);
                }}
                placeholder="Potwierdź nowe hasło"
              />
            </div>
            {confirmPasswordError && (
              <div className="text-red-500 text-xs mt-2 font-medium">{confirmPasswordError}</div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 text-black py-3 px-4 rounded-2xl hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-50 font-semibold shadow-lg transition-colors text-lg"
          >
            {loading ? "Ładowanie..." : "Resetuj hasło"}
          </button>
        </form>
      </div>
    </div>
  );
}