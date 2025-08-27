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

  const scheduleInfo = [
    {
      title: "Odprawa przed wyjazdem",
      time: "Dzień przed wyjazdem, 18:00",
      location: "Aula A1, Budynek A1 PŁ",
      details: [
        "Omówienie programu wydarzenia",
        "Informacje praktyczne o transporcie",
        "Przekazanie materiałów szkoleniowych",
        "Odpowiedzi na pytania uczestników",
        "Podział na grupy robocze",
      ],
    },
    {
      title: "Dzień wyjazdu",
      time: "7:00 - Zbiórka",
      location: "Przed głównym budynkiem PŁ",
      details: [
        "Sprawdzenie obecności",
        "Załadowanie bagaży",
        "Ostatnie instrukcje organizatorów",
        "Odjazd o 7:30 PUNKTUALNIE!",
      ],
    },
  ];


  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto sm:px-4 lg:px-6 text-center flex flex-col justify-center items-center">
          <div className="flex flex-col items-center">
            <Image
              src="/logo_czarne_tło.jpg"
              alt="Logo wtyczka"
              width={400}
              height={150}
              className="m-0 p-0 leading-none"
              style={{ display: "block", marginBottom: "-15px" }}
            />
            <p
              className="text-xl md:text-2xl m-0 p-0 text-white leading-none"
              style={{ marginTop: "-4px" }}
            >
              Niezbędnik uczestnika
            </p>
          </div>
          <div className="flex flex-row gap-3 w-full justify-center items-stretch mt-4 mb-2 overflow-x-auto">
            <a
              href="/registration"
              className="bg-[#E7A801] hover:bg-amber-700 min-w-[180px] border-[#262626] border rounded-2xl p-2 pt-3 pb-3 flex items-center justify-center font-semibold transition-colors backdrop-blur-sm"
            >
              <span className="text-base text-black">Zapisz się</span>
            </a>
            <a
              href="/news"
              className="bg-[#0F0F0F] min-w-[180px] border-[#262626] border bg-opacity-30 rounded-2xl p-2 pt-3 pb-3 flex items-center justify-center backdrop-blur-sm"
            >
              <span className="text-base">Aktualności</span>
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

      {/* Schedule Info */}
      <section className="py-16 bg-[#0F0F0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amber-400 text-center mb-8">
            Harmonogram odpraw
          </h2>

          <div className="space-y-6">
            {scheduleInfo.map((event, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] rounded-lg border border-[#262626] p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-400 mb-2">
                      {event.title}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-2 text-amber-400">
                          <Sun className="h-4 w-4" />
                          <span className="font-semibold">{event.time}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-amber-400">
                          <span className="text-lg">📍</span>
                          <span className="font-semibold">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-200 mb-2">
                        Program:
                      </h4>
                      <ul className="space-y-1">
                        {event.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-amber-400 text-sm">•</span>
                            <span className="text-gray-200 text-sm">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather Info */}
      <section className="py-16 bg-[#0F0F0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌤️</div>
            <h2 className="text-3xl font-bold text-amber-400 mb-4">
              Informacje pogodowe
            </h2>
            <p className="text-gray-300">
              Sprawdź prognozę pogody przed pakowaniem się!
            </p>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <Sun className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-amber-400 mb-2">Dzień</h3>
                <p className="text-gray-200 text-sm">
                  Temperatura: 18-22°C
                  <br />
                  Zalecane: lekka odzież, okulary przeciwsłoneczne, krem z filtrem
                </p>
              </div>

              <div className="text-center">
                <Moon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-amber-400 mb-2">
                  Wieczór
                </h3>
                <p className="text-gray-200 text-sm">
                  Temperatura: 10-15°C
                  <br />
                  Zalecane: bluza, kurtka, długie spodnie
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                * Prognoza pogody może się zmienić. Sprawdź aktualne warunki przed wyjazdem.
              </p>
            </div>
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
