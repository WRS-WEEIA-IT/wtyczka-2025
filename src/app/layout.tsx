import type { Metadata } from "next";
import { ABeeZee } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

const abeeZee = ABeeZee({
  subsets: ["latin"],
  weight: ["400"],
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
    <html lang="pl">
      <body className={`${abeeZee.className} antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
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
