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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#18181b] border border-[#262626] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-[#262626]">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? t.auth.login : t.auth.register}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-amber-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t.auth.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t.auth.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t.auth.confirmPassword}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-3 py-2 border border-[#262626] bg-[#232323] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E7A801] text-black py-2 px-4 rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 font-semibold shadow-md"
            >
              {loading
                ? "Ładowanie..."
                : isLogin
                ? t.auth.login
                : t.auth.register}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#262626]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#18181b] text-gray-400">lub</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 font-semibold shadow-md transition-colors"
            >
              {isLogin ? t.auth.loginWithGoogle : t.auth.registerWithGoogle}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={switchMode}
              className="text-amber-400 hover:text-amber-500 text-sm font-semibold"
            >
              {isLogin ? t.auth.dontHaveAccount : t.auth.alreadyHaveAccount}{" "}
              <span className="underline">
                {isLogin ? t.auth.register : t.auth.login}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
