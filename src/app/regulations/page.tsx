"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  Users,
  CreditCard,
  MapPin,
  Calendar,
} from "lucide-react";

export default function RegulationsPage() {
  const [acceptedSections, setAcceptedSections] = useState<string[]>([]);

  const toggleSectionAcceptance = (sectionId: string) => {
    setAcceptedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: "general",
      title: "Postanowienia ogólne",
      icon: FileText,
      content: [
        'Niniejszy regulamin określa zasady uczestnictwa w wydarzeniu "Wtyczka 2025" organizowanym w dniach 15-17 marca 2025 roku.',
        "Organizatorem wydarzenia jest Samorząd Studencki Politechniki Łódzkiej.",
        "Uczestnictwo w wydarzeniu jest dobrowolne i wymaga akceptacji niniejszego regulaminu.",
        "Organizator zastrzega sobie prawo do wprowadzania zmian w regulaminie, o których uczestnicy zostaną poinformowani z wyprzedzeniem.",
        "Akceptacja regulaminu jest równoznaczna z wyrażeniem zgody na wszystkie zawarte w nim postanowienia.",
      ],
    },
    {
      id: "participation",
      title: "Zasady uczestnictwa",
      icon: Users,
      content: [
        "W wydarzeniu mogą uczestniczyć wyłącznie studenci Politechniki Łódzkiej posiadający ważną legitymację studencką.",
        "Liczba miejsc jest ograniczona do 150 uczestników.",
        "Kwalifikacja uczestników odbywa się na podstawie kolejności zgłoszeń oraz spełnienia wymagań formalnych.",
        "Uczestnicy zobowiązani są do zachowania kultury osobistej i przestrzegania zasad współżycia społecznego.",
        "Zabrania się wnoszenia alkoholu i środków odurzających na teren wydarzenia.",
        "Organizator zastrzega sobie prawo do wykluczenia uczestnika w przypadku naruszenia regulaminu.",
        "Uczestnicy są zobowiązani do uczestnictwa we wszystkich zaplanowanych aktywnościach, chyba że organizator wyrazi zgodę na zwolnienie.",
      ],
    },
    {
      id: "registration",
      title: "Rejestracja i opłaty",
      icon: CreditCard,
      content: [
        "Rejestracja odbywa się wyłącznie za pośrednictwem formularza dostępnego na stronie internetowej wydarzenia.",
        "Opłata za uczestnictwo wynosi 250 zł i obejmuje zakwaterowanie, wyżywienie oraz program wydarzenia.",
        "Opłata musi zostać uiszczona w terminie 7 dni od potwierdzenia kwalifikacji.",
        "Płatności dokonywane są przelewem na wskazany w formularzu numer konta.",
        'W tytule przelewu należy podać: "Wtyczka 2025 - [Imię] [Nazwisko]".',
        "Brak wpłaty w wyznaczonym terminie skutkuje utratą miejsca.",
        "Zwrot opłaty możliwy jest jedynie w przypadku rezygnacji zgłoszonej na piśmie co najmniej 14 dni przed rozpoczęciem wydarzenia.",
        "Organizator ma prawo do zatrzymania 20% opłaty jako koszty administracyjne w przypadku rezygnacji.",
      ],
    },
    {
      id: "accommodation",
      title: "Zakwaterowanie i wyżywienie",
      icon: MapPin,
      content: [
        "Zakwaterowanie odbywa się w domkach letniskowych w miejscowości Spała.",
        "Uczestnicy zakwaterowani są w pokojach 2-4 osobowych.",
        "Organizator nie gwarantuje możliwości wyboru współlokatorów.",
        "Wyżywienie obejmuje 3 posiłki dziennie: śniadanie, obiad i kolację.",
        "Menu uwzględnia podstawowe diety specjalne (wegetariańska, wegańska) - należy zgłosić to w formularzu.",
        "Uczestnicy są odpowiedzialni za utrzymanie porządku w miejscach zakwaterowania.",
        "Za zniszczenia odpowiada finansowo osoba, która je spowodowała.",
        "Zabrania się palenia tytoniu w pomieszczeniach zamkniętych.",
      ],
    },
    {
      id: "program",
      title: "Program wydarzenia",
      icon: Calendar,
      content: [
        "Program wydarzenia obejmuje warsztaty, wykłady, integrację oraz aktywności rekreacyjne.",
        "Szczegółowy harmonogram zostanie przekazany uczestnikom na 48 godzin przed rozpoczęciem wydarzenia.",
        "Organizator zastrzega sobie prawo do zmian w programie z przyczyn niezależnych.",
        "Obecność na wszystkich zaplanowanych aktywnościach jest obowiązkowa.",
        "Spóźnienia i nieobecności muszą być usprawiedliwione u koordynatorów.",
        "Uczestnicy zobowiązani są do aktywnego uczestnictwa w warsztatach i innych formach aktywności.",
        "Zakończenie wydarzenia planowane jest na niedzielę do godziny 16:00.",
      ],
    },
    {
      id: "safety",
      title: "Bezpieczeństwo i odpowiedzialność",
      icon: AlertTriangle,
      content: [
        "Uczestnicy biorą udział w wydarzeniu na własną odpowiedzialność.",
        "Organizator nie ponosi odpowiedzialności za szkody wyrządzone przez uczestników.",
        "Każdy uczestnik musi posiadać ważne ubezpieczenie zdrowotne.",
        "W przypadku problemów zdrowotnych należy natychmiast powiadomić organizatorów.",
        "Uczestnicy zobowiązani są do przestrzegania przepisów BHP i poleceń organizatorów.",
        "Organizator zapewnia podstawową opiekę medyczną w czasie wydarzenia.",
        "Za zagubione lub skradzione rzeczy osobiste organizator nie ponosi odpowiedzialności.",
        "Uczestnicy zobowiązani są do zgłaszania wszelkich niebezpiecznych sytuacji.",
      ],
    },
    {
      id: "image",
      title: "Wykorzystanie wizerunku",
      icon: FileText,
      content: [
        "Organizator zastrzega sobie prawo do rejestrowania przebiegu wydarzenia (zdjęcia, nagrania wideo).",
        "Materiały mogą być wykorzystane do celów promocyjnych i dokumentacyjnych.",
        "Uczestnik może zgłosić sprzeciw wobec wykorzystania swojego wizerunku - należy to zrobić pisemnie.",
        "Materiały mogą być publikowane na stronach internetowych, portalach społecznościowych i w mediach.",
        "Uczestnicy mogą robić zdjęcia i nagrania, ale tylko za zgodą osób na nich widocznych.",
        "Zabrania się publikowania materiałów naruszających dobre imię wydarzenia i jego uczestników.",
      ],
    },
    {
      id: "final",
      title: "Postanowienia końcowe",
      icon: CheckCircle,
      content: [
        "Regulamin wchodzi w życie z dniem publikacji na stronie internetowej wydarzenia.",
        "W sprawach nieuregulowanych w niniejszym regulaminie zastosowanie mają przepisy Kodeksu Cywilnego.",
        "Wszelkie spory rozstrzygane będą przez sąd właściwy dla siedziby organizatora.",
        "Regulamin dostępny jest na stronie internetowej wydarzenia oraz w biurze organizatorów.",
        "Akceptacja regulaminu jest warunkiem koniecznym uczestnictwa w wydarzeniu.",
        "Organizator ma prawo do interpretacji postanowień regulaminu w przypadku wątpliwości.",
        "Zmiany regulaminu wymagają formy pisemnej i powiadomienia uczestników.",
      ],
    },
  ];

  const allSectionsAccepted = sections.every((section) =>
    acceptedSections.includes(section.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-800 to-orange-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Regulamin Wtyczki 2025
          </h1>
          <p className="text-xl text-amber-100">
            Zasady uczestnictwa w wydarzeniu
          </p>
          <p className="text-sm text-amber-200 mt-2">
            Wersja z dnia 15 stycznia 2025
          </p>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <Download className="h-6 w-6 text-amber-600" />
                <div>
                  <h3 className="text-lg font-bold text-amber-900">
                    Pobierz regulamin w wersji PDF
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Pełna wersja regulaminu do druku i archiwizacji
                  </p>
                </div>
              </div>
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-semibold transition-colors">
                Pobierz PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isAccepted = acceptedSections.includes(section.id);

            return (
              <div
                key={section.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 rounded-full p-3 flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-amber-600" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-amber-900 mb-4">
                        {section.title}
                      </h3>

                      <div className="space-y-3">
                        {section.content.map((paragraph, index) => (
                          <p
                            key={index}
                            className="text-gray-700 text-sm leading-relaxed"
                          >
                            {index + 1}. {paragraph}
                          </p>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => toggleSectionAcceptance(section.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isAccepted
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                          }`}
                        >
                          <CheckCircle
                            className={`h-4 w-4 ${
                              isAccepted ? "text-green-600" : "text-gray-400"
                            }`}
                          />
                          <span>
                            {isAccepted
                              ? "Zaakceptowano"
                              : "Akceptuję ten rozdział"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Acceptance */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-lg p-8 text-center ${
              allSectionsAccepted
                ? "bg-green-50 border border-green-200"
                : "bg-amber-50 border border-amber-200"
            }`}
          >
            <div className="text-6xl mb-4">
              {allSectionsAccepted ? "✅" : "📝"}
            </div>

            <h3
              className={`text-2xl font-bold mb-4 ${
                allSectionsAccepted ? "text-green-900" : "text-amber-900"
              }`}
            >
              {allSectionsAccepted
                ? "Regulamin w pełni zaakceptowany!"
                : "Akceptacja regulaminu"}
            </h3>

            <p
              className={`mb-6 ${
                allSectionsAccepted ? "text-green-700" : "text-amber-700"
              }`}
            >
              {allSectionsAccepted
                ? "Dziękujemy za zapoznanie się z regulaminem. Możesz teraz przystąpić do rejestracji na wydarzenie."
                : "Aby uczestniczyć w Wtyczce 2025, musisz zaakceptować wszystkie rozdziały regulaminu."}
            </p>

            <div className="flex justify-center space-x-4">
              {allSectionsAccepted ? (
                <>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-semibold transition-colors">
                    Przejdź do rejestracji
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold transition-colors">
                    Pobierz potwierdzenie
                  </button>
                </>
              ) : (
                <p className="text-amber-600 text-sm">
                  Postęp: {acceptedSections.length} / {sections.length}{" "}
                  rozdziałów zaakceptowanych
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-orange-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-6">
            Pytania dotyczące regulaminu?
          </h3>

          <p className="text-amber-100 mb-6">
            W przypadku wątpliwości dotyczących postanowień regulaminu,
            skontaktuj się z organizatorami.
          </p>

          <div className="flex justify-center space-x-6">
            <a
              href="mailto:wtyczka2025@example.com"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-md font-semibold transition-colors"
            >
              Napisz do nas
            </a>
            <a
              href="/faq"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-md font-semibold transition-colors"
            >
              Zobacz FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
