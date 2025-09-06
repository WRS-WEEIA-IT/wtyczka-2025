import type { Metadata } from "next";
import { Rye, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./background-styles.css";
import "./western-buttons.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

// Rye for titles and western elements
const rye = Rye({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-rye",
});

// Playfair Display for normal text with better support for Polish characters
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Wtyczka 2025 - Wyjazd integracyjno-szkoleniowy",
  description: "Oficjalna strona wydarzenia Wtyczka 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${rye.variable} ${playfair.variable}`}>
      <body className={`${playfair.className} antialiased text-white`}>
        <div className="background-container">
          <div className="background-content">
            <img src="/background.svg" alt="Background" className="background-svg" />
            <div className="background-overlay-top"></div>
            <div className="background-overlay-bottom"></div>
          </div>
        </div>
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen relative z-10">{children}</main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                className: "animate-toast-bottom"
              }}
            />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
