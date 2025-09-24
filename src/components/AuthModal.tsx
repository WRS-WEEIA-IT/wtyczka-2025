'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { X, Mail, Lock, TriangleAlert, EyeOff, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const {
    authLogin,
    authRegister,
    authLoginWithGoogleWebView,
    authResetPassword,
    isWebView,
    webViewInfo,
  } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null)
  const [passwordChecklist, setPasswordChecklist] = useState({
    length: false,
    lower: false,
    upper: false,
    digit: false,
    special: false,
  })

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const togglePasswordVisibility = () =>
    setIsPasswordVisible((prevState) => !prevState)

  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible((prevState) => !prevState)

  const validatePassword = (password: string) => {
    const checklist = {
      length: password.length >= 8,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      digit: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }
    setPasswordChecklist(checklist)
    if (!password) return 'Pole hasło jest wymagane.'
    const allValid = Object.values(checklist).every(Boolean)
    if (!allValid) return 'Hasło nie spełnia wszystkich wymagań.'
    return null
  }

  if (!isOpen) return null

  const validateEmail = (email: string) => {
    if (!email) return 'Pole email jest wymagane.'
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Sprawdź poprawność wpisywanego maila.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Handle password reset form submission
    if (isForgotPassword) {
      const emailValidation = validateEmail(formData.email)
      setEmailError(emailValidation)

      if (emailValidation) {
        setLoading(false)
        return
      }

      try {
        await authResetPassword(formData.email)
        setResetEmailSent(true)
      } catch (error) {
        console.error('Password reset error:', error)
      } finally {
        setLoading(false)
      }
      return
    }

    // Handle login/register form submission
    const emailValidation = validateEmail(formData.email)
    setEmailError(emailValidation)
    // Custom password validation (only for register)
    let passwordValidation = null
    let confirmPasswordValidation = null
    if (!isLogin) {
      passwordValidation = validatePassword(formData.password)
      setPasswordError(passwordValidation)
      if (!formData.confirmPassword) {
        confirmPasswordValidation = 'Pole potwierdzenia hasła jest wymagane.'
      } else if (formData.password !== formData.confirmPassword) {
        confirmPasswordValidation =
          t.errors.passwordsDontMatch || 'Hasła nie są takie same.'
      }
      setConfirmPasswordError(confirmPasswordValidation)
    } else {
      setPasswordChecklist({
        length: false,
        lower: false,
        upper: false,
        digit: false,
        special: false,
      })
      setPasswordError(null)
      setConfirmPasswordError(null)
    }
    if (emailValidation || passwordValidation || confirmPasswordValidation) {
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        await authLogin(formData.email, formData.password)
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t.errors.passwordsDontMatch)
        }
        await authRegister(formData.email, formData.password)
      }
      onClose()
      router.push('/')
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      // Use WebView-aware Google login method
      await authLoginWithGoogleWebView()
      onClose()
      router.push('/')
    } catch (error) {
      console.error('Google auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    })
    setEmailError(null)
    setPasswordError(null)
    setConfirmPasswordError(null)
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setIsForgotPassword(false)
    setResetEmailSent(false)
    resetForm()
  }

  const switchToForgotPassword = () => {
    setIsForgotPassword(true)
    resetForm()
  }

  const backToLogin = () => {
    setIsForgotPassword(false)
    setResetEmailSent(false)
    resetForm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-lg">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#232323]/90 via-[#18181b]/90 to-[#232323]/80 px-8 py-10 shadow-2xl shadow-amber-900/30 backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 transition-colors hover:text-amber-400"
        >
          <X size={28} />
        </button>

        {/* Password Reset Success Screen */}
        {isForgotPassword && resetEmailSent && (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/20">
                <Mail className="h-8 w-8 text-amber-400" />
              </div>
              <h2 className="mb-4 text-center text-3xl font-bold text-amber-400 drop-shadow-lg">
                {t.auth.resetPasswordSuccess}
              </h2>
              <p className="mb-8 text-gray-300">
                {t.auth.emailConfirmationText}
              </p>
              <div className="mb-4 rounded-lg border border-[#262626] bg-[#18181b] p-3">
                <p className="font-medium break-all text-amber-500">
                  {formData.email}
                </p>
              </div>
              <p className="mb-8 text-sm text-gray-400">
                {t.auth.checkSpamFolder}
              </p>
            </div>
            <button
              onClick={backToLogin}
              className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-lg font-semibold text-black shadow-lg transition-colors hover:bg-amber-500 focus:ring-2 focus:ring-amber-400/60 focus:outline-none disabled:opacity-50"
            >
              {t.auth.backToLogin}
            </button>
          </>
        )}

        {/* Password Reset Request Form */}
        {isForgotPassword && !resetEmailSent && (
          <>
            <h2 className="mb-8 text-center text-3xl font-bold text-amber-400 drop-shadow-lg">
              {t.auth.resetPassword}
            </h2>
            <p className="mb-8 text-center text-gray-300">
              {t.auth.resetPasswordInstructions}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.auth.email}
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2 transform text-gray-300" />
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#262626] bg-[#232323]/80 py-3 pr-4 pl-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400/60 focus:outline-none"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (emailError) setEmailError(null)
                    }}
                    placeholder={t.auth.email}
                  />
                </div>
                {emailError && (
                  <div className="mt-2 text-xs font-medium text-red-500">
                    {emailError}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-lg font-semibold text-black shadow-lg transition-colors hover:bg-amber-500 focus:ring-2 focus:ring-amber-400/60 focus:outline-none disabled:opacity-50"
              >
                {loading ? 'Ładowanie...' : t.auth.resetPassword}
              </button>
            </form>
            <div className="mt-8 text-center">
              <button
                onClick={backToLogin}
                className="text-base font-semibold text-amber-400 underline underline-offset-2 transition-colors hover:text-amber-500"
              >
                {t.auth.backToLogin}
              </button>
            </div>
          </>
        )}

        {/* Login/Register Form */}
        {!isForgotPassword && (
          <>
            <h2 className="mb-8 text-center text-3xl font-bold text-amber-400 drop-shadow-lg">
              {isLogin ? t.auth.login : t.auth.register}
            </h2>
            <div className="mb-6 text-center">
              <span className="mb-2 block rounded-lg bg-[#18181b]/80 px-4 py-2 text-sm text-gray-300">
                Jeśli chcesz usunąć wszelkie swoje dane z systemu, skontaktuj
                się mailowo:
                <a
                  href="mailto:wtyczka@samorzad.p.lodz.pl"
                  className="ml-1 text-amber-400 hover:underline"
                >
                  wtyczka@samorzad.p.lodz.pl
                </a>
              </span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.auth.email}
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2 transform text-gray-300" />
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#262626] bg-[#232323]/80 py-3 pr-4 pl-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400/60 focus:outline-none"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (emailError) setEmailError(null)
                    }}
                    placeholder={t.auth.email}
                  />
                </div>
                {emailError && (
                  <div className="mt-2 text-xs font-medium text-red-500">
                    {emailError}
                  </div>
                )}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    {t.auth.password}
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={switchToForgotPassword}
                      className="text-xs font-medium text-amber-400 transition-colors hover:text-amber-500"
                    >
                      {t.auth.forgotPassword}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2 transform text-gray-300" />
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    className="w-full rounded-xl border border-[#262626] bg-[#232323]/80 py-3 pr-4 pl-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400/60 focus:outline-none"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (!isLogin) validatePassword(e.target.value)
                      if (passwordError) setPasswordError(null)
                    }}
                    placeholder={t.auth.password}
                  />
                  <button
                    className="absolute inset-y-0 end-0 z-20 flex cursor-pointer items-center rounded-e-md px-2.5 text-gray-400 transition-colors hover:text-gray-300 focus:outline-none focus-visible:text-gray-300"
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      isPasswordVisible ? 'Ukryj hasło' : 'Pokaż hasło'
                    }
                    aria-pressed={isPasswordVisible}
                    aria-controls="password"
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={20} aria-hidden="true" />
                    ) : (
                      <Eye size={20} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1">
                    <div
                      className={
                        passwordChecklist.length
                          ? 'text-xs font-medium text-green-600'
                          : 'text-xs font-medium text-red-500'
                      }
                    >
                      • min. 8 znaków
                    </div>
                    <div
                      className={
                        passwordChecklist.digit
                          ? 'text-xs font-medium text-green-600'
                          : 'text-xs font-medium text-red-500'
                      }
                    >
                      • cyfra
                    </div>
                    <div
                      className={
                        passwordChecklist.lower && passwordChecklist.upper
                          ? 'text-xs font-medium text-green-600'
                          : 'text-xs font-medium text-red-500'
                      }
                    >
                      • mała i wielka litera
                    </div>
                    <div
                      className={
                        passwordChecklist.special
                          ? 'text-xs font-medium text-green-600'
                          : 'text-xs font-medium text-red-500'
                      }
                    >
                      • znak specjalny
                    </div>
                  </div>
                )}
                {passwordError && (
                  <div className="mt-2 text-xs font-medium text-red-500">
                    {passwordError}
                  </div>
                )}
              </div>
              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    {t.auth.confirmPassword}
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2 transform text-gray-300" />
                    <input
                      id="confirmPassword"
                      type={isConfirmPasswordVisible ? 'text' : 'password'}
                      className="w-full rounded-xl border border-[#262626] bg-[#232323]/80 py-3 pr-4 pl-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400/60 focus:outline-none"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                        if (confirmPasswordError) setConfirmPasswordError(null)
                      }}
                      placeholder={t.auth.confirmPassword}
                    />
                    <button
                      className="absolute inset-y-0 end-0 z-20 flex cursor-pointer items-center rounded-e-md px-2.5 text-gray-400 transition-colors hover:text-gray-300 focus:outline-none focus-visible:text-gray-300"
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={
                        isConfirmPasswordVisible ? 'Ukryj hasło' : 'Pokaż hasło'
                      }
                      aria-pressed={isConfirmPasswordVisible}
                      aria-controls="password"
                    >
                      {isConfirmPasswordVisible ? (
                        <EyeOff size={20} aria-hidden="true" />
                      ) : (
                        <Eye size={20} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <div className="mt-2 text-xs font-medium text-red-500">
                      {confirmPasswordError}
                    </div>
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-lg font-semibold text-black shadow-lg transition-colors hover:bg-amber-500 focus:ring-2 focus:ring-amber-400/60 focus:outline-none disabled:opacity-50"
              >
                {loading
                  ? 'Ładowanie...'
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
                  <span className="rounded-full bg-[#232323]/80 px-3 text-sm text-gray-400">
                    lub
                  </span>
                  <div className="flex-1 border-t border-[#262626]" />
                </div>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-amber-400 bg-[#232323]/90 px-4 py-3 text-lg font-semibold text-amber-400 shadow-lg transition-all hover:bg-[#18181b] focus:ring-2 focus:ring-amber-400/60 focus:outline-none disabled:opacity-50"
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
                  <span className="rounded-full bg-[#232323]/80 px-3 text-sm text-gray-400">
                    lub
                  </span>
                  <div className="flex-1 border-t border-[#262626]" />
                </div>

                {/* WebView Warning Message */}
                <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
                  <div className="flex items-start gap-3">
                    <TriangleAlert className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-400" />
                    <div className="text-sm text-amber-200">
                      <p className="mb-1 font-medium">
                        Wykryto przeglądarkę w aplikacji
                      </p>
                      <p className="text-amber-300/80">
                        Logowanie przez Google może nie działać w tej
                        przeglądarce.
                        {webViewInfo.webViewType === 'facebook' ||
                        webViewInfo.webViewType === 'messenger'
                          ? ' Otwórz stronę w przeglądarce zewnętrznej (Chrome, Safari) dla najlepszego doświadczenia.'
                          : ' Spróbuj otworzyć stronę w przeglądarce zewnętrznej.'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-amber-400 bg-[#232323]/90 px-4 py-3 text-lg font-semibold text-amber-400 shadow-lg transition-all hover:bg-[#18181b] focus:ring-2 focus:ring-amber-400/60 focus:outline-none disabled:opacity-50"
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
                className="text-base font-semibold text-amber-400 underline underline-offset-2 transition-colors hover:text-amber-500"
              >
                {isLogin ? t.auth.dontHaveAccount : t.auth.alreadyHaveAccount}{' '}
                {isLogin ? t.auth.register : t.auth.login}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
