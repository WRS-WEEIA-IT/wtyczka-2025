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
      toast.success("Zarejestrowano pomyślnie!");
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
