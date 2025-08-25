"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, LogOut, Users, Globe } from "lucide-react";
import AuthModal from "./AuthModal";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "pl" ? "en" : "pl");
  };

  return (
    <>
      <nav className="bg-amber-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-amber-100">
                  🤠 Wtyczka 2025
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="hover:text-amber-200 transition-colors">
                {t.nav.home}
              </Link>

              <Link
                href="/news"
                className="hover:text-amber-200 transition-colors"
              >
                {t.nav.news}
              </Link>

              {user && (
                <>
                  <div className="relative group">
                    <button className="hover:text-amber-200 transition-colors flex items-center space-x-1">
                      <Users size={16} />
                      <span>{t.nav.participantInfo}</span>
                    </button>
                    <div className="absolute top-full left-0 mt-1 bg-amber-800 rounded-md shadow-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <Link
                        href="/regulations"
                        className="block px-4 py-2 hover:bg-amber-700"
                      >
                        {t.nav.regulations}
                      </Link>
                      <Link
                        href="/essentials"
                        className="block px-4 py-2 hover:bg-amber-700"
                      >
                        {t.nav.essentials}
                      </Link>
                      <Link
                        href="/faq"
                        className="block px-4 py-2 hover:bg-amber-700"
                      >
                        {t.nav.faq}
                      </Link>
                      <Link
                        href="/contacts"
                        className="block px-4 py-2 hover:bg-amber-700"
                      >
                        {t.nav.contacts}
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/registration"
                    className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md transition-colors"
                  >
                    Formularz rejestracji
                  </Link>

                  <Link
                    href="/status"
                    className="hover:text-amber-200 transition-colors"
                  >
                    Status
                  </Link>
                </>
              )}

              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 hover:text-amber-200 transition-colors"
              >
                <Globe size={16} />
                <span>{language.toUpperCase()}</span>
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-amber-200">
                    Witaj, {user.displayName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-amber-200 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>{t.nav.logout}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md transition-colors"
                >
                  {t.nav.login} / {t.nav.register}
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-amber-200"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-amber-800">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="hover:text-amber-200 transition-colors"
                >
                  {t.nav.home}
                </Link>

                <Link
                  href="/news"
                  className="hover:text-amber-200 transition-colors"
                >
                  {t.nav.news}
                </Link>

                {user && (
                  <>
                    <div className="pl-4 space-y-2">
                      <div className="text-amber-300 font-semibold">
                        {t.nav.participantInfo}:
                      </div>
                      <Link
                        href="/regulations"
                        className="block hover:text-amber-200"
                      >
                        {t.nav.regulations}
                      </Link>
                      <Link
                        href="/essentials"
                        className="block hover:text-amber-200"
                      >
                        {t.nav.essentials}
                      </Link>
                      <Link href="/faq" className="block hover:text-amber-200">
                        {t.nav.faq}
                      </Link>
                      <Link
                        href="/contacts"
                        className="block hover:text-amber-200"
                      >
                        {t.nav.contacts}
                      </Link>
                    </div>

                    <Link
                      href="/registration"
                      className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md transition-colors text-center"
                    >
                      Formularz rejestracji
                    </Link>

                    <Link
                      href="/status"
                      className="hover:text-amber-200 transition-colors"
                    >
                      Status
                    </Link>
                  </>
                )}

                <button
                  onClick={toggleLanguage}
                  className="flex items-center space-x-1 hover:text-amber-200 transition-colors"
                >
                  <Globe size={16} />
                  <span>{language.toUpperCase()}</span>
                </button>

                {user ? (
                  <div className="space-y-2">
                    <div className="text-amber-200">
                      Witaj, {user.displayName}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 hover:text-amber-200 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md transition-colors text-center"
                  >
                    {t.nav.login} / {t.nav.register}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
