"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { Translations } from "@/types/translations";
import { translations } from "@/lib/translations";

interface LanguageContextType {
  language: 'pl';
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language] = useState<'pl'>('pl');

  const value = {
    language,
    t: translations.pl,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
