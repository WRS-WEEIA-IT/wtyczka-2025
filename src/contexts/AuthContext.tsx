"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authLogin: (email: string, password: string) => Promise<void>;
  authRegister: (email: string, password: string) => Promise<void>;
  authLoginWithGoogle: () => Promise<void>;
  authLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function authLogin(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success("Zalogowano pomyślnie!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Błąd logowania");
      throw error;
    }
  }

  async function authRegister(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) throw error;
      toast.success("Zarejestrowano pomyślnie! Potwierdź rejestrację na email!");
      
      // Show popup with email confirmation details
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4';
      modal.innerHTML = `
        <div class="relative w-full max-w-md rounded-xl border border-amber-400/40 bg-gradient-to-br from-[#232323]/95 via-[#18181b]/95 to-[#232323]/90 shadow-2xl shadow-amber-900/30 backdrop-blur-xl px-6 py-8 text-center">
          <button class="absolute top-4 right-4 text-gray-400 hover:text-amber-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
          <div class="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500 mx-auto">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-amber-400 mb-2">Potwierdź rejestrację</h3>
          <p class="text-gray-300 mb-4">Aby dokończyć rejestrację, kliknij w link aktywacyjny wysłany na adres:</p>
          <div class="bg-[#18181b] border border-[#262626] rounded-lg p-3 mb-4">
            <p class="text-amber-500 font-medium break-all">${email}</p>
          </div>
          <p class="text-sm text-gray-400 mb-6">Sprawdź folder spam, jeśli nie widzisz wiadomości w skrzynce odbiorczej.</p>
          <button class="w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-colors shadow-lg">
            Rozumiem
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners for closing the modal
      const closeButton = modal.querySelector('button');
      const confirmButton = modal.querySelector('button:last-child');
      
      const closeModal = () => {
        document.body.removeChild(modal);
      };
      
      closeButton?.addEventListener('click', closeModal);
      confirmButton?.addEventListener('click', closeModal);
      
      // Also close modal when clicking outside or pressing escape
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          closeModal();
        }
      });
      
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      }, { once: true });
      
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Błąd rejestracji");
      throw error;
    }
  }

  async function authLoginWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
      toast.success("Zalogowano pomyślnie!");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Błąd logowania przez Google");
      throw error;
    }
  }

  async function authLogout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
      toast.success("Wylogowano pomyślnie!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Błąd wylogowania");
      throw error;
    }
  }

  const value = {
    user,
    loading,
    authLogin,
    authRegister,
    authLoginWithGoogle,
    authLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
