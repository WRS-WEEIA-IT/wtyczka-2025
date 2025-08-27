"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Phone, Mail, MessageCircle, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function ContactsPage() {
  const { user, loading } = useAuth();

  // Mock data - w prawdziwej aplikacji te dane byłyby pobierane z Firebase
  const isQualified = true; // Tu będzie logika sprawdzania statusu z bazy danych

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤠</div>
          <div className="text-xl text-amber-800">Ładowanie...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-amber-900 mb-4">
            Dostęp ograniczony
          </h1>
          <p className="text-gray-600 mb-6">
            Aby zobaczyć kontakty, musisz się najpierw zalogować.
          </p>
          <Link
            href="/"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
          >
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    );
  }

  if (!isQualified) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-amber-900 mb-4">
            Kontakty niedostępne
          </h1>
          <p className="text-gray-600 mb-6">
            Kontakty do koordynatorów są dostępne tylko dla zakwalifikowanych
            uczestników.
          </p>
          <Link
            href="/status"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
          >
            Sprawdź swój status
          </Link>
        </div>
      </div>
    );
  }

  const coordinators = [
    {
      name: "Anna Kowalska",
      role: "Główny Koordynator",
      email: "anna.kowalska@example.com",
      phone: "+48 123 456 789",
      availability: "Pon-Pt 9:00-17:00",
      responsibilities: [
        "Ogólne pytania",
        "Problemy z rejestracją",
        "Informacje o wydarzeniu",
      ],
    },
    {
      name: "Michał Nowak",
      role: "Koordynator Logistyki",
      email: "michal.nowak@example.com",
      phone: "+48 234 567 890",
      availability: "Pon-Pt 10:00-18:00",
      responsibilities: ["Transport", "Zakwaterowanie", "Wyżywienie"],
    },
    {
      name: "Katarzyna Wiśniewska",
      role: "Koordynator Programu",
      email: "katarzyna.wisniewska@example.com",
      phone: "+48 345 678 901",
      availability: "Pon-Śr, Pt 8:00-16:00",
      responsibilities: ["Program wydarzenia", "Warsztaty", "Aktywności"],
    },
    {
      name: "Tomasz Zieliński",
      role: "Koordynator Finansowy",
      email: "tomasz.zielinski@example.com",
      phone: "+48 456 789 012",
      availability: "Wt-Czw 12:00-20:00",
      responsibilities: ["Płatności", "Faktury", "Zwroty kosztów"],
    },
  ];

  const emergencyContacts = [
    {
      title: "Dyżur organizatorów podczas wydarzenia",
      phone: "+48 500 600 700",
      availability: "24/7 podczas Wtyczki 2025",
      description: "Numer dostępny tylko w czasie trwania wydarzenia",
    },
    {
      title: "Nagłe przypadki medyczne",
      phone: "112",
      availability: "24/7",
      description: "Numer alarmowy - służby ratunkowe",
    },
  ];

  return (
    <div className="min-h-screen bg-[#18181b]">
      {/* Header */}
  <section className="bg-[#232323] border-b border-[#262626] text-white py-16">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">📞</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
            Kontakty do organizatorów
          </h1>
          <p className="text-xl text-gray-200">
            Dane kontaktowe kadry i koordynatorów Wtyczki 2025
          </p>
          <p className="text-sm text-amber-300 mt-2">
            Dostępne dla zakwalifikowanych uczestników
          </p>
        </div>
      </section>

      {/* General Contact Info */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#232323] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageCircle className="h-6 w-6 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-300">
                Ogólne informacje kontaktowe
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-200">
                  <strong>Email główny:</strong>
                  <br />
                  <a
                    href="mailto:wtyczka2025@example.com"
                    className="text-amber-400 hover:underline"
                  >
                    wtyczka2025@example.com
                  </a>
                </p>
              </div>
              <div>
                <p className="text-gray-200">
                  <strong>Telefon biura:</strong>
                  <br />
                  <a
                    href="tel:+48123000000"
                    className="text-amber-400 hover:underline"
                  >
                    +48 123 000 000
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coordinators */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amber-400 text-center mb-8">
            Koordynatorzy wydarzenia
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {coordinators.map((coordinator, index) => (
              <div key={index} className="bg-[#232323] rounded-xl shadow-lg p-6 border border-[#262626]">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-[#18181b] rounded-full p-3">
                    <Users className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-300">
                      {coordinator.name}
                    </h3>
                    <p className="text-amber-400 text-sm">{coordinator.role}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${coordinator.email}`}
                      className="text-amber-400 hover:underline text-sm"
                    >
                      {coordinator.email}
                    </a>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${coordinator.phone}`}
                      className="text-amber-400 hover:underline text-sm"
                    >
                      {coordinator.phone}
                    </a>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">
                      {coordinator.availability}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#262626]">
                  <h4 className="font-semibold text-gray-200 text-sm mb-2">
                    Obszar odpowiedzialności:
                  </h4>
                  <ul className="space-y-1">
                    {coordinator.responsibilities.map((resp, respIndex) => (
                      <li
                        key={respIndex}
                        className="text-gray-300 text-xs flex items-start space-x-1"
                      >
                        <span className="text-amber-400">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
  <section className="py-16 bg-[#232323] border-t border-[#262626]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amber-400 text-center mb-8">
            Kontakty w nagłych przypadkach
          </h2>

          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="bg-[#18181b] border-l-4 border-amber-400 rounded-xl p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-[#232323] rounded-full p-3">
                    <Phone className="h-6 w-6 text-amber-400" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-300 mb-2">
                      {contact.title}
                    </h3>

                    <div className="space-y-2">
                      <div>
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-2xl font-bold text-amber-400 hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">
                          {contact.availability}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm">
                        {contact.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Location */}
  <section className="py-16 bg-[#232323] border-t border-[#262626]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amber-400 text-center mb-8">
            Biuro organizatorów
          </h2>

          <div className="bg-[#18181b] rounded-xl p-6 border border-[#262626]">
            <div className="flex items-start space-x-4">
              <div className="bg-[#232323] rounded-full p-3">
                <MapPin className="h-6 w-6 text-amber-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-amber-300 mb-2">
                  Lokalizacja biura
                </h3>

                <div className="space-y-2 text-gray-300">
                  <p>
                    <strong>Adres:</strong>
                    <br />
                    ul. Żeromskiego 116
                    <br />
                    90-924 Łódź
                    <br />
                    Budynek B1, pokój 123
                  </p>

                  <p>
                    <strong>Godziny otwarcia:</strong>
                    <br />
                    Poniedziałek - Piątek: 9:00 - 17:00
                    <br />
                    Sobota - Niedziela: Zamknięte
                  </p>

                  <p className="text-sm text-amber-400">
                    💡 Przed wizytą zalecamy wcześniejszy kontakt telefoniczny
                    lub mailowy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Times */}
      <section className="py-16 bg-[#232323] border-t border-[#262626] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-6 text-amber-400">Czas odpowiedzi</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl mb-2">📧</div>
              <h4 className="font-bold mb-2 text-amber-300">Email</h4>
              <p className="text-amber-200 text-sm">
                Do 24 godzin w dni robocze
              </p>
            </div>

            <div>
              <div className="text-4xl mb-2">📱</div>
              <h4 className="font-bold mb-2 text-amber-300">Telefon</h4>
              <p className="text-amber-200 text-sm">
                Natychmiastowo w godzinach pracy
              </p>
            </div>

            <div>
              <div className="text-4xl mb-2">🚨</div>
              <h4 className="font-bold mb-2 text-amber-300">Nagłe przypadki</h4>
              <p className="text-amber-200 text-sm">Natychmiastowo 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
