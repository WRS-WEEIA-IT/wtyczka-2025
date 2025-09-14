"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { authLogin, authRegister, authLoginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      await authLoginWithGoogle();
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
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#232323]/90 via-[#18181b]/90 to-[#232323]/80 shadow-2xl shadow-amber-900/30 backdrop-blur-xl px-8 py-10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-amber-400 transition-colors"
        >
          <X size={28} />
        </button>
        <h2 className="text-3xl font-bold text-amber-400 text-center mb-8 drop-shadow-lg">
          {isLogin ? t.auth.login : t.auth.register}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.auth.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-300" />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#232323]/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60 placeholder-gray-400"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={t.auth.email}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.auth.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-300" />
              <input
                type="password"
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#232323]/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60 placeholder-gray-400"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={t.auth.password}
              />
            </div>
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
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 border border-[#262626] bg-[#232323]/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60 placeholder-gray-400"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder={t.auth.confirmPassword}
                />
              </div>
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
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='24' height='24'><g><path fill='#4285F4' d='M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.69 30.13 0 24 0 14.64 0 6.4 5.74 2.44 14.09l7.98 6.21C12.13 13.09 17.62 9.5 24 9.5z'/><path fill='#34A853' d='M46.1 24.55c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.18 5.36-4.65 7.02l7.2 5.59C43.6 37.13 46.1 31.34 46.1 24.55z'/><path fill='#FBBC05' d='M10.42 28.3c-1.01-2.99-1.01-6.21 0-9.2l-7.98-6.21C.8 16.36 0 20.04 0 24c0 3.96.8 7.64 2.44 11.11l7.98-6.21z'/><path fill='#EA4335' d='M24 48c6.13 0 11.64-2.03 15.84-5.53l-7.2-5.59c-2.01 1.35-4.59 2.16-8.64 2.16-6.38 0-11.87-3.59-14.58-8.8l-7.98 6.21C6.4 42.26 14.64 48 24 48z'/><path fill='none' d='M0 0h48v48H0z'/></g></svg>
            {isLogin ? t.auth.loginWithGoogle : t.auth.registerWithGoogle}
          </button>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={switchMode}
            className="text-amber-400 hover:text-amber-500 text-base font-semibold underline underline-offset-2 transition-colors"
          >
            {isLogin ? t.auth.dontHaveAccount : t.auth.alreadyHaveAccount} {isLogin ? t.auth.register : t.auth.login}
          </button>
        </div>
      </div>
    </div>
  );
}
