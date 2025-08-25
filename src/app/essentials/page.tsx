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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-800 to-orange-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">🎒</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Niezbędnik uczestnika
          </h1>
          <p className="text-xl text-amber-100">
            Lista rzeczy do zabrania na Wtyczkę 2025 oraz informacje o odprawie
          </p>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-bold text-yellow-800">
                Ważne informacje
              </h3>
            </div>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Pamiętaj o udziale w odprawie przed wyjazdem!</li>
              <li>
                • Zabierz tylko to, co naprawdę potrzebne - miejsce w autokarze
                jest ograniczone
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
          <h2 className="text-3xl font-bold text-amber-900 text-center mb-8">
            Lista rzeczy do zabrania
          </h2>

          <div className="space-y-6">
            {essentialItems.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="bg-amber-100 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-amber-600">{category.icon}</div>
                    <h3 className="text-xl font-bold text-amber-900">
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
                        <span className="text-gray-700 text-sm">{item}</span>
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
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amber-900 text-center mb-8">
            Harmonogram odpraw
          </h2>

          <div className="space-y-6">
            {scheduleInfo.map((event, index) => (
              <div
                key={index}
                className="bg-amber-50 rounded-lg border border-amber-200 p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-900 mb-2">
                      {event.title}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-2 text-amber-700">
                          <Sun className="h-4 w-4" />
                          <span className="font-semibold">{event.time}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-amber-700">
                          <span className="text-lg">📍</span>
                          <span className="font-semibold">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Program:
                      </h4>
                      <ul className="space-y-1">
                        {event.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-amber-600 text-sm">•</span>
                            <span className="text-gray-700 text-sm">
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
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌤️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Informacje pogodowe
            </h2>
            <p className="text-gray-600">
              Sprawdź prognozę pogody przed pakowanie się!
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <Sun className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Dzień</h3>
                <p className="text-gray-600 text-sm">
                  Temperatura: 18-22°C
                  <br />
                  Zalecane: lekka odzież, okulary przeciwsłoneczne, krem z
                  filtrem
                </p>
              </div>

              <div className="text-center">
                <Moon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Wieczór
                </h3>
                <p className="text-gray-600 text-sm">
                  Temperatura: 10-15°C
                  <br />
                  Zalecane: bluza, kurtka, długie spodnie
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                * Prognoza pogody może się zmienić. Sprawdź aktualne warunki
                przed wyjazdem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Questions */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-orange-800 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Masz pytania dotyczące pakowania?
          </h3>
          <p className="text-amber-100 mb-6">
            Skontaktuj się z organizatorami - chętnie pomożemy!
          </p>
          <div className="space-y-2">
            <p className="text-amber-200">
              📧 Email:{" "}
              <a
                href="mailto:wtyczka2025@example.com"
                className="underline hover:text-white"
              >
                wtyczka2025@example.com
              </a>
            </p>
            <p className="text-amber-200">
              📱 Telefon:{" "}
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
