"use client";

import {
  Backpack,
  Shirt,
  Zap,
  Camera,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import Image from "next/image";
import { Facebook } from "lucide-react";

export default function EssentialsPage() {
  const essentialItems = [
    {
      category: "Ubrania i obuwie",
      icon: <Shirt className="h-6 w-6" />,
      items: [
        "Wygodne buty do chodzenia (2 pary - na zmianę)",
        "Odzież na 3 dni (casualowa, wygodna)",
        "Strój na imprezę Western (kapelusz, bandana, kamizelka, buty kowbojskie - opcjonalnie)",
        "Bluza/kurtka na wieczór (może być chłodno)",
        "Odzież przeciwdeszczowa",
        "Bielizna i skarpetki (z zapasem)",
        "Strój kąpielowy (jeśli będzie basen/jacuzzi)",
        "Piżama/odzież do spania",
      ],
    },
    {
      category: "Higiena osobista",
      icon: <Zap className="h-6 w-6" />,
      items: [
        "Szczoteczka i pasta do zębów",
        "Szampon i żel pod prysznic",
        "Dezodorant",
        "Ręcznik (może być 2 - mały i duży)",
        "Kosmetyki pielęgnacyjne",
        "Dla pań: kosmetyki do makijażu",
        "Kremy z filtrem UV",
        "Osobiste leki (jeśli przyjmujesz)",
      ],
    },
    {
      category: "Elektronika",
      icon: <Camera className="h-6 w-6" />,
      items: [
        "Telefon z ładowarką",
        "Power bank (przydatny podczas wycieczek)",
        "Aparat fotograficzny (opcjonalnie)",
        "Słuchawki",
        "Adapter do gniazdka (jeśli potrzebny)",
        "Kabel do telefonu (zapasowy)",
      ],
    },
    {
      category: "Dokumenty i pieniądze",
      icon: <AlertCircle className="h-6 w-6" />,
      items: [
        "Dowód osobisty lub paszport",
        "Legitymacja studencka",
        "Karta EKUZ (jeśli mamy)",
        "Gotówka na dodatkowe wydatki",
        "Karta płatnicza",
        "Potwierdzenie wpłaty za wydarzenie",
      ],
    },
    {
      category: "Dodatkowe rzeczy",
      icon: <Backpack className="h-6 w-6" />,
      items: [
        "Mały plecak na wycieczki",
        "Butelka na wodę",
        "Okulary przeciwsłoneczne",
        "Czapka/kapelusz na słońce",
        "Notatnik i długopis",
        "Książka/e-reader na wolny czas",
        "Gry planszowe/karty (dla chętnych)",
        "Przekąski (batoniki, orzechy)",
      ],
    },
  ];




  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-[#262626] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
            Niezbędnik uczestnika
          </h1>
          <p className="text-xl text-gray-200">
            Lista rzeczy, które warto zabrać na Wtyczkę 2025
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="/registration"
              className="bg-[#E7A801] hover:bg-amber-700 min-w-[180px] border-[#262626] border rounded-2xl px-6 py-3 font-semibold transition-colors backdrop-blur-sm text-black"
            >
              Zapisz się
            </a>
            <a
              href="/news"
              className="bg-[#0F0F0F] min-w-[180px] border-[#262626] border bg-opacity-30 rounded-2xl px-6 py-3 font-semibold transition-colors backdrop-blur-sm ml-4 text-white"
            >
              Aktualności
            </a>
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0F0F0F] border-l-4 border-[#E7A801] p-6 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-6 w-6 text-[#E7A801]" />
              <h3 className="text-lg font-bold text-[#E7A801]">
                Ważne informacje
              </h3>
            </div>
            <ul className="text-amber-200 space-y-1 text-sm">
              <li>• Pamiętaj o udziale w odprawie przed wyjazdem!</li>
              <li>
                • Zabierz tylko to, co naprawdę potrzebne - miejsce w autokarze jest ograniczone
              </li>
              <li>• Oznacz swoje bagaże (imię, nazwisko, telefon)</li>
              <li>• Wszystkie leki trzymaj w bagażu podręcznym</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Packing List */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amber-400 text-center mb-8">
            Lista rzeczy do zabrania
          </h2>

          <div className="space-y-6">
            {essentialItems.map((category, index) => (
              <div
                key={index}
                className="bg-[#0F0F0F] border border-[#262626] rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-[#1a1a1a] px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-amber-400">{category.icon}</div>
                    <h3 className="text-xl font-bold text-amber-400">
                      {category.category}
                    </h3>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="grid md:grid-cols-2 gap-2">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-start space-x-2"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-200 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>





      {/* Contact for Questions */}
      <section className="py-16 bg-[#0F0F0F] text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Masz pytania dotyczące pakowania?
          </h3>
          <p className="text-amber-200 mb-6">
            Skontaktuj się z organizatorami - chętnie pomożemy!
          </p>
          <div className="space-y-2">
            <p className="text-amber-300">
              📧 Email: {" "}
              <a
                href="mailto:wtyczka2025@example.com"
                className="underline hover:text-white"
              >
                wtyczka2025@example.com
              </a>
            </p>
            <p className="text-amber-300">
              📱 Telefon: {" "}
              <a href="tel:+48123456789" className="underline hover:text-white">
                +48 123 456 789
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

