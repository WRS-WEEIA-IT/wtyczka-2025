"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Mail, Lock, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { authLogin, authRegister, authLoginWithGoogleWebView, authResetPassword, isWebView, webViewInfo } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [passwordChecklist, setPasswordChecklist] = useState({
    length: false,
    lower: false,
    upper: false,
    digit: false,
    special: false,
  });
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

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    if (!email) return "Pole email jest wymagane.";
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Sprawdź poprawność wpisywanego maila.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Handle password reset form submission
    if (isForgotPassword) {
      const emailValidation = validateEmail(formData.email);
      setEmailError(emailValidation);
      
      if (emailValidation) {
        setLoading(false);
        return;
      }

      try {
        await authResetPassword(formData.email);
        setResetEmailSent(true);
      } catch (error) {
        console.error("Password reset error:", error);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Handle login/register form submission
    const emailValidation = validateEmail(formData.email);
    setEmailError(emailValidation);
    // Custom password validation (only for register)
    let passwordValidation = null;
    let confirmPasswordValidation = null;
    if (!isLogin) {
      passwordValidation = validatePassword(formData.password);
      setPasswordError(passwordValidation);
      if (!formData.confirmPassword) {
        confirmPasswordValidation = "Pole potwierdzenia hasła jest wymagane.";
      } else if (formData.password !== formData.confirmPassword) {
        confirmPasswordValidation = t.errors.passwordsDontMatch || "Hasła nie są takie same.";
      }
      setConfirmPasswordError(confirmPasswordValidation);
    } else {
      setPasswordChecklist({
        length: false,
        lower: false,
        upper: false,
        digit: false,
        special: false,
      });
      setPasswordError(null);
      setConfirmPasswordError(null);
    }
    if (emailValidation || passwordValidation || confirmPasswordValidation) {
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await authLogin(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t.errors.passwordsDontMatch);
        }
        await authRegister(formData.email, formData.password);
      }
      onClose();
      router.push("/");
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Use WebView-aware Google login method
      await authLoginWithGoogleWebView();
      onClose();
      router.push("/");
    } catch (error) {
      console.error("Google auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setResetEmailSent(false);
    resetForm();
  };

  const switchToForgotPassword = () => {
    setIsForgotPassword(true);
    resetForm();
  };

  const backToLogin = () => {
    setIsForgotPassword(false);
    setResetEmailSent(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4">
      <div className="relative w-full max-w-lg max-h-[90vh] rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#232323]/90 via-[#18181b]/90 to-[#232323]/80 shadow-2xl shadow-amber-900/30 backdrop-blur-xl px-8 py-10 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-amber-400 transition-colors"
        >
          <X size={28} />
        </button>

        {/* Password Reset Success Screen */}
        {isForgotPassword && resetEmailSent && (
          <>
            <div className="mb-6 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-amber-400/20 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold text-amber-400 text-center mb-4 drop-shadow-lg">
                {t.auth.resetPasswordSuccess}
              </h2>
              <p className="text-gray-300 mb-8">
                {t.auth.emailConfirmationText}
              </p>
              <div className="bg-[#18181b] border border-[#262626] rounded-lg p-3 mb-4">
                <p className="text-amber-500 font-medium break-all">{formData.email}</p>
              </div>
              <p className="text-sm text-gray-400 mb-8">
                {t.auth.checkSpamFolder}
              </p>
            </div>
            <button
              onClick={backToLogin}
              className="w-full bg-amber-400 text-black py-3 px-4 rounded-2xl hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-50 font-semibold shadow-lg transition-colors text-lg"
            >
              {t.auth.backToLogin}
            </button>
          </>
        )}

        {/* Password Reset Request Form */}
        {isForgotPassword && !resetEmailSent && (
          <>
            <h2 className="text-3xl font-bold text-amber-400 text-center mb-8 drop-shadow-lg">
              {t.auth.resetPassword}
            </h2>
            <p className="text-gray-300 mb-8 text-center">
              {t.auth.resetPasswordInstructions}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.auth.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-300" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#232323]/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60 placeholder-gray-400"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (emailError) setEmailError(null);
                    }}
                    placeholder={t.auth.email}
                  />
                </div>
                {emailError && (
                  <div className="text-red-500 text-xs mt-2 font-medium">{emailError}</div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 text-black py-3 px-4 rounded-2xl hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-50 font-semibold shadow-lg transition-colors text-lg"
              >
                {loading ? "Ładowanie..." : t.auth.resetPassword}
              </button>
            </form>
            <div className="mt-8 text-center">
              <button
                onClick={backToLogin}
                className="text-amber-400 hover:text-amber-500 text-base font-semibold underline underline-offset-2 transition-colors"
              >
                {t.auth.backToLogin}
              </button>
            </div>
          </>
        )}

        {/* Login/Register Form */}
        {!isForgotPassword && (
          <>
            <h2 className="text-3xl font-bold text-amber-400 text-center mb-8 drop-shadow-lg">
              {isLogin ? t.auth.login : t.auth.register}
            </h2>
            <div className="mb-6 text-center">
              <span className="block text-sm text-gray-300 bg-[#18181b]/80 rounded-lg px-4 py-2 mb-2">
                Jeśli chcesz usunąć wszelkie swoje dane z systemu, skontaktuj się mailowo:
                <a href="mailto:wtyczka@samorzad.p.lodz.pl" className="text-amber-400 hover:underline ml-1">wtyczka@samorzad.p.lodz.pl</a>
              </span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.auth.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-300" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#232323]/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60 placeholder-gray-400"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (emailError) setEmailError(null);
                    }}
                    placeholder={t.auth.email}
                  />
                </div>
                {emailError && (
                  <div className="text-red-500 text-xs mt-2 font-medium">{emailError}</div>
                )}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {t.auth.password}
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={switchToForgotPassword}
                      className="text-amber-400 hover:text-amber-500 text-xs font-medium transition-colors"
                    >
                      {t.auth.forgotPassword}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-300" />
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#232323]/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60 placeholder-gray-400"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (!isLogin) validatePassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder={t.auth.password}
                  />
                </div>
                {!isLogin && (
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
                )}
                {passwordError && (
                  <div className="text-red-500 text-xs mt-2 font-medium">{passwordError}</div>
                )}
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.auth.confirmPassword}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-300" />
                    <input
                      type="password"
                      className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#232323]/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60 placeholder-gray-400"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        });
                        if (confirmPasswordError) setConfirmPasswordError(null);
                      }}
                      placeholder={t.auth.confirmPassword}
                    />
                  </div>
                  {confirmPasswordError && (
                    <div className="text-red-500 text-xs mt-2 font-medium">{confirmPasswordError}</div>
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 text-black py-3 px-4 rounded-2xl hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-50 font-semibold shadow-lg transition-colors text-lg"
              >
                {loading
                  ? "Ładowanie..."
                  : isLogin
                  ? t.auth.login
                  : t.auth.register}
              </button>
            </form>
            {/* Google Login Section - with WebView handling */}
            {isWebView ? (
              // Normal Google login for regular browsers
              <div className="mt-8">
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-[#262626]" />
                  <span className="text-gray-400 bg-[#232323]/80 px-3 rounded-full text-sm">lub</span>
                  <div className="flex-1 border-t border-[#262626]" />
                </div>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full mt-6 flex items-center justify-center gap-3 bg-[#232323]/90 text-amber-400 py-3 px-4 rounded-2xl hover:bg-[#18181b] focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-50 font-semibold shadow-lg transition-all text-lg border-2 border-amber-400"
                >
                  <Image
                    src="/google-logo.svg"
                    alt="Google"
                    width={24}
                    height={24}
                    className="inline-block"
                  />
                  {isLogin ? t.auth.loginWithGoogle : t.auth.registerWithGoogle}
                </button>
              </div>
            ) : (
              // WebView-specific Google login with workarounds
              <div className="mt-8">
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-[#262626]" />
                  <span className="text-gray-400 bg-[#232323]/80 px-3 rounded-full text-sm">lub</span>
                  <div className="flex-1 border-t border-[#262626]" />
                </div>
                
                {/* WebView Warning Message */}
                <div className="mt-4 p-4 bg-amber-400/10 border border-amber-400/30 rounded-xl">
                  <div className="flex items-start gap-3">
                  <TriangleAlert className="h-6 w-6 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-200">
                      <p className="font-medium mb-1">Wykryto przeglądarkę w aplikacji</p>
                      <p className="text-amber-300/80">
                        Logowanie przez Google może nie działać w tej przeglądarce. 
                        {webViewInfo.webViewType === 'facebook' || webViewInfo.webViewType === 'messenger' 
                          ? ' Otwórz stronę w przeglądarce zewnętrznej (Chrome, Safari) dla najlepszego doświadczenia.'
                          : ' Spróbuj otworzyć stronę w przeglądarce zewnętrznej.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full mt-6 flex items-center justify-center gap-3 bg-[#232323]/90 text-amber-400 py-3 px-4 rounded-2xl hover:bg-[#18181b] focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:opacity-50 font-semibold shadow-lg transition-all text-lg border-2 border-amber-400"
                >
                  <Image
                    src="/google-logo.svg"
                    alt="Google"
                    width={24}
                    height={24}
                    className="inline-block"
                  />
                  {isLogin ? t.auth.loginWithGoogle : t.auth.registerWithGoogle}
                </button>
              </div>
            )}
            <div className="mt-8 text-center">
              <button
                onClick={switchMode}
                className="text-amber-400 hover:text-amber-500 text-base font-semibold underline underline-offset-2 transition-colors"
              >
                {isLogin ? t.auth.dontHaveAccount : t.auth.alreadyHaveAccount} {isLogin ? t.auth.register : t.auth.login}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
