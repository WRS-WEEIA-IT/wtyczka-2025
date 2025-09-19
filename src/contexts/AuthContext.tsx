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
  authResetPassword: (email: string) => Promise<void>;
  authUpdatePassword: (password: string) => Promise<void>;
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
    } catch (error: Error | unknown) {
      console.error("Login error:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific error types for login
      if (errorMessage.includes('Email not confirmed') || 
          errorMessage.includes('signup_disabled') ||
          errorMessage.includes('email_not_confirmed')) {
        toast.error("Najpierw potwierdź adres email!");
      } else if (errorMessage.includes('Invalid login credentials')) {
        toast.error("Błędny adres email bądź hasło");
      } else if (errorMessage.includes('Too many requests')) {
        toast.error("Zbyt wiele prób, odczekaj chwile i spróbuj ponownie");
      } else {
        toast.error("Błąd logowania");
      }
      throw error;
    }
  }

  async function authRegister(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        // Sprawdź czy błąd jest związany z istniejącym kontem
        if (error.message?.includes('User already registered') ||
            error.message?.includes('signup_disabled')) {
          toast.error("Konto o takim adresie email już istnieje");
          throw error;
        }
        throw error;
      }
      
      // Check if this is a new user registration or existing user
      if (data.user) {
        // If user has email_confirmed_at, they already exist and are confirmed
        if (data.user.email_confirmed_at) {
          toast.error("Konto o takim adresie email już istnieje");
          throw new Error("User already registered");
        }
        
        // If user doesn't have email_confirmed_at, check if they were just created
        if (!data.user.email_confirmed_at && data.user.created_at) {
          const createdAt = new Date(data.user.created_at);
          const now = new Date();
          const timeDiff = now.getTime() - createdAt.getTime();
          
          // If user was created within last 30 seconds, it's likely a new registration
          // If older than that, it's probably an existing unconfirmed account
          if (timeDiff < 30000) {
            toast.success("Udało się zarejestrować!");
            
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
          } else {
            // User already exists but is not confirmed (old unconfirmed account)
            toast.error("Konto o takim adresie email już istnieje");
            throw new Error("User already registered");
          }
        }
      } else {
        // No user data returned - this shouldn't happen in normal signup
        toast.error("Błąd rejestracji");
        throw new Error("No user data returned");
      }
      
    } catch (error: Error | unknown) {
      console.error("Registration error:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific error types for registration
      if (errorMessage.includes('User already registered')) {
        // Already handled above, don't show additional error
        return;
      } else if (errorMessage.includes('Email rate limit exceeded')) {
        toast.error("Zbyt wiele prób, odczekaj chwile i spróbuj ponownie");
      } else if (errorMessage.includes('Too many requests')) {
        toast.error("Zbyt wiele prób, odczekaj chwile i spróbuj ponownie");
      } else if (!errorMessage.includes('No user data returned')) {
        toast.error("Błąd rejestracji");
      }
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
    } catch (error: Error | unknown) {
      console.error("Google login error:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific error types for Google login
      if (errorMessage.includes('Too many requests')) {
        toast.error("Zbyt wiele prób, odczekaj chwile i spróbuj ponownie");
      } else {
        toast.error("Błąd logowania przez Google");
      }
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

  async function authResetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      toast.success("Link do resetowania hasła został wysłany na podany adres email!");
    } catch (error: Error | unknown) {
      console.error("Password reset error:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific error types for password reset
      if (errorMessage.includes('Email not confirmed')) {
        toast.error("Adres email nie został potwierdzony!");
      } else if (errorMessage.includes('Too many requests')) {
        toast.error("Zbyt wiele prób, odczekaj chwile i spróbuj ponownie");
      } else {
        toast.error("Błąd resetowania hasła");
      }
      throw error;
    }
  }

  async function authUpdatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      toast.success("Hasło zostało pomyślnie zmienione!");
    } catch (error: Error | unknown) {
      console.error("Password update error:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific error types for password update
      if (errorMessage.includes('Too many requests')) {
        toast.error("Zbyt wiele prób, odczekaj chwile i spróbuj ponownie");
      } else if (errorMessage.includes('Password should be')) {
        toast.error("Hasło nie spełnia wymagań bezpieczeństwa");
      } else {
        toast.error("Błąd aktualizacji hasła");
      }
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
    authResetPassword,
    authUpdatePassword,
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
